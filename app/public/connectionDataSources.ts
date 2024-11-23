"use server"


import { VIEW, NameWithCaption, SubjectRelation } from "./connectionTypesDefinitions";
import { do_query, get_caption } from "./connection";
import { remove_quotes } from "./utils";





// get navigable namespaces according to the current interface view
export async function query_navigable_namespaces(current_view:VIEW) {
    let query = "";
    switch (current_view) {
        case VIEW.STRUCTURAL:
            query = `
            SELECT ?namespace ?namespace_caption WHERE {
                icatalogo:namespacesByStructure ds:field ?namespace.
                BIND(concat(?namespace,":",?namespace) AS ?fullName).
                OPTIONAL{?fullName irdf:caption ?namespace_caption}.
            }`

            break;
        case VIEW.CONCEPTUAL:
            query = `
            SELECT ?namespace ?namespace_caption WHERE {
                icatalogo:namespacesByConcept ds:field ?namespace.
                BIND(concat(?namespace,":",?namespace) AS ?fullName).
                OPTIONAL{?fullName irdf:caption ?namespace_caption}.
            }`
            break;
    }

    if (query.length == 0) return null;

    let response = await do_query(query);
    let namespaces:Array<NameWithCaption> = [];

    for (let i = 0; i < response.result.length; i++) {
        const row = response.result[i]
        namespaces.push({
            "name": row[0],
            // not working. INVESTIGATE!
            // "caption": row[1]
            "caption": await get_caption(`${row[0]}:${row[0]}`)
        });
    }

    return namespaces;
}


export async function query_relation_predicates(current_view:VIEW) {
    let query:string = "";
    switch (current_view) {
        case VIEW.STRUCTURAL:
            query = `SELECT ?predicate ?predicate_caption WHERE {
                icatalogo:irdfParents ds:field ?predicate.
            }`

            break;
        case VIEW.CONCEPTUAL:
            query = `SELECT ?predicate ?predicate_caption WHERE {
                icatalogo:subConcept ds:field ?predicate.
            }`

            break;
    }

    if (query.length == 0) return null;

    let response = await do_query(query);
    let predicates:Array<string> = [];

    for (let i = 0; i < response.result.length; i++) {
        const row = response.result[i];
        predicates.push(row[0]);
    }

    return predicates;
}



// SELECT ?p ?o ?predicate_label ?object_label ?is_terminal WHERE {
//     vif:Data ?p ?o.
//     FILTER ( ?p != irdf:parent )
//     OPTIONAL{?p irdf:caption ?predicate_label}.
//     OPTIONAL{?o irdf:caption ?object_label}.
//     BIND(
//         (
//              NOT EXISTS {?o ds:field ?x0.} &&
//              NOT EXISTS {?o ds:listOf ?x1.}
//         ) AS ?exist_relation
//     )
//     BIND (IF(?exist_relation, true, false) AS ?is_terminal)
// }

export async function query_subject_info(subject:string, current_view:VIEW) {
    const current_view_predicates = await query_relation_predicates(current_view);

    if (!current_view_predicates) return null;

    let is_terminal = `BIND ( (NOT EXISTS {?o ${current_view_predicates[0]} ?x0.}`
    for (let i = 1; i < current_view_predicates.length; i++) {
        is_terminal = is_terminal + ` && NOT EXISTS {?o ${current_view_predicates[i]} ?x${i}.}`
    }
    is_terminal = `
        ${is_terminal}) AS ?exist_relation)
        BIND (IF(?exist_relation, true, false) AS ?is_terminal)
    `

    const query = `SELECT ?p ?o ?predicate_label ?object_label ?is_terminal WHERE {
        ${subject} ?p ?o.
        FILTER ( ?p != irdf:parent )
        OPTIONAL{?p irdf:caption ?predicate_label}.
        OPTIONAL{?o irdf:caption ?object_label}.
        ${is_terminal}
    }`

    const response = await do_query(query);
    return process_response((response.result as Array<string>));
}

function process_response(raw:Array<string>) {
    let processed:SubjectRelation = {}
    
    // aux variables
    let predicate:string;
    let object:string;
    let predicate_caption:string;
    let object_caption:string;
    let is_terminal:any;

    for (let i = 0; i < raw.length; i++) {
        predicate = raw[i][0]
        object = raw[i][1]
        predicate_caption = raw[i][2]
        object_caption = raw[i][3]
        is_terminal = raw[i][4]

        if (predicate_caption) predicate = remove_quotes(predicate_caption)
        if (!(predicate in processed)) {
            processed[predicate] = [];
        }

        processed[predicate].push({
            "object": object,
            "caption": object_caption? remove_quotes(object_caption):object_caption,
            "terminal": is_terminal,
        })
    }

    return processed
}


export async function query_namespace_roots(namespace:string) {
    let query = `
    SELECT DISTINCT ?root ?root_label ?s2 ?s2_label WHERE {
        ?root ?p ?o.
        ?s2 irdf:parent ?root.
        ?root irdf:caption ?root_label.
        FILTER (
            isUri(?root) && STRSTARTS(STR(?root), STR(${namespace}:))
            && NOT EXISTS { ?root irdf:parent ?o2. }
        )
        OPTIONAL{?s2 irdf:caption ?s2_label}.
    }`
    const response = await do_query(query)
    
    return response
}



// SELECT ?name ?def ?type ?unit ?v ?unitName ?unitDefinition WHERE {
//     ?s ds:field ?o.
// ?o xsem:definition ?def.
// ?o irdf:exptabSet "psf:APPU_Endpoint".
// ?o irdf:exptabColumn ?name.
// ?o irdf:exptabType ?type.
// OPTIONAL {?o xsem:valueExample ?v}.
// OPTIONAL {
//      ?o irdf:exptabUnit ?unit
//      OPTIONAL {?unit xsem:name ?unitName}.
//     OPTIONAL {?unit xsem:definition ?unitDefinition}.
// }.
// OPTIONAL {?o irdf:exptabOrder ?level}.
// FILTER (NOT EXISTS {?o ds:field ?x} && NOT EXISTS {?o ds:listOf ?x} && NOT EXISTS {?o ds:timeSeries ?x} && NOT EXISTS {?o ds:oneOf ?x} && NOT EXISTS {?o rest:dataEndpoint ?x} && NOT EXISTS {?o rest:endpointParameter ?x} && NOT EXISTS {?o xsem:dataDomain ?x} && NOT EXISTS {?o ds:rootData ?x} && NOT EXISTS {?o ds:concept ?x} )
// } GROUP BY ?name ORDER BY ?level
export async function query_root_info(root:string, current_view:VIEW, isNamespace:boolean = false) {
    const current_view_predicates = await query_relation_predicates(current_view);

    if (!current_view_predicates) return null;

    let filter = `FILTER (`

    for (let i = 0; i < current_view_predicates.length; i++) {
        const predicate = current_view_predicates[i];

        if (i != 0) filter += "&& ";
        filter += `NOT EXISTS {?o ${predicate} ?x} `;
    }

    filter += ")"

    const query = `
    SELECT ?name ?def ?type ?unit ?v ?unitName ?unitDefinition WHERE {
 	    ?s ds:field ?o.
        ?o xsem:definition ?def.
        ?o irdf:exptabSet "${remove_quotes(root)}".
        ?o irdf:exptabColumn ?name.
        ?o irdf:exptabType ?type.
        OPTIONAL {?o xsem:valueExample ?v}.
        OPTIONAL {
            ?o irdf:exptabUnit ?unit
            OPTIONAL {?unit xsem:name ?unitName}.
            OPTIONAL {?unit xsem:definition ?unitDefinition}.    
        }.
        OPTIONAL {?o irdf:exptabOrder ?level}.
        ${filter}
    } GROUP BY ?name ORDER BY ?level
    `
    const response = await do_query(query);

    return response.result;
}

// SELECT ?dataSource ?dataSourceCaption WHERE {
// 	icatalogo:dataSourceFromNamespace ds:field ?dataSource .
//  OPTIONAL {?dataSource irdf:caption ?dataSourceCaption}.
// 	FILTER (
// 		STRSTARTS(STR(?dataSource), STR(mlab:))
// 	)
// }
export async function query_namespace_datasources(namespace:string) {
    const query = `SELECT ?dataSource ?dataSourceCaption WHERE {
    	icatalogo:dataSourceFromNamespace ds:field ?dataSource .
        OPTIONAL {?dataSource irdf:caption ?dataSourceCaption}.
    	FILTER (
    		STRSTARTS(STR(?dataSource), STR(${namespace}:))
	    )
    }`;

    const response = await do_query(query);
    let dataSources:Array<NameWithCaption> = [];

    for (let i = 0; i < response.result.length; i++) {
        const row = response.result[i]
        dataSources.push({
            "name": row[0],
            "caption": row[1]? remove_quotes(row[1]):row[1]
        });
    }

    return dataSources;
}
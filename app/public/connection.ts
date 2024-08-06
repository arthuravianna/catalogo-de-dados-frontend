"use server"


import { envClient } from "./envClient"


export type NameWithCaption = {
    name:string,
    caption:string|null
}

// x[predicate] = [objectInfo0, objectInfo1]
export type SubjectRelation = Record<string, Array<ObjectInfo>>;
export type ObjectInfo = {
    object:string,
    caption:string|null,
    terminal:boolean
}

const STRUCTURAL = 0;
const CONCEPTUAL = 1;
const SCIENTIFIC_ARTICLES = 2;
const GOVERNANCE = 3;
const STRUCTURAL_TO_CONCEPTUAL = "xsem:keyTerm";


async function do_query(query:string) {
    const res = await fetch(`${envClient.RDF_SERVER_URL}/query`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: query,
        next: {
            revalidate: 300
        }
    });

    return await res.json();
}

export async function get_namespaces() {
    return await fetch(`${envClient.RDF_SERVER_URL}/namespaces`, {
        method: "GET",
    });
}


// remove caption's double quotes (")
function format_caption(caption:string) {
    return caption.substring(1, caption.length-1);
}

export async function get_caption(subject:string) {
    const query = `SELECT ?subject_caption WHERE {${subject} irdf:caption ?subject_caption}`;
    const response = await do_query(query);

    // get label if exists and use substring to remove "
    const caption = response.result.length > 0? format_caption(response.result[0][0]):null;

    return caption;
}



// get navigable namespaces according to the current interface view
export async function query_navigable_namespaces(current_view:number) {
    let query = "";
    switch (current_view) {
        case STRUCTURAL:
            query = `
            SELECT ?namespace ?namespace_caption WHERE {
                icatalogo:namespacesByStructure ds:field ?namespace.
                BIND(concat(?namespace,":",?namespace) AS ?fullName).
                OPTIONAL{?fullName irdf:caption ?namespace_caption}.
            }`

            break;
        case CONCEPTUAL:
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


export async function query_relation_predicates(current_view:number) {
    let query:string = "";
    switch (current_view) {
        case STRUCTURAL:
            query = `SELECT ?predicate ?predicate_caption WHERE {
                icatalogo:irdfParents ds:field ?predicate.
            }`

            break;
        case CONCEPTUAL:
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

export async function query_subject_info(subject:string, current_view:number) {
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

        if (predicate_caption) predicate = format_caption(predicate_caption)
        if (!(predicate in processed)) {
            processed[predicate] = [];
        }

        processed[predicate].push({
            "object": object,
            "caption": object_caption? format_caption(object_caption):object_caption,
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



// SELECT ?cap ?o ?def ?v WHERE {
// 	?s ds:field ?o.
//         ?o xsem:definition ?def.
//         OPTIONAL {?o xsem:valueExample ?v}.
//         OPTIONAL { ?o irdf:level ?level.}
//         OPTIONAL {?o irdf:caption ?cap.}
// FILTER (NOT EXISTS {?o ds:field ?x} && NOT EXISTS {?o ds:oneOf ?x} && NOT EXISTS {?o ds:listOf ?y} && isUri(?o) && STRSTARTS(STR(?o), STR(vif:)) )
// } ORDER BY ?level
export async function query_root_info(root:string, current_view:number, isNamespace:boolean = false) {
    const current_view_predicates = await query_relation_predicates(current_view);

    if (!current_view_predicates) return null;

    let filter = `FILTER (`

    for (let predicate of current_view_predicates) {
        filter += `NOT EXISTS {?o ${predicate} ?x} && `
    }

    if (isNamespace) {
        filter += `STRSTARTS(STR(?o), STR(${root}:))` + ")"
    } else {
        filter += `STRSTARTS(STR(?o), STR(${root}_))` + ")"
    }

    const query = `
    SELECT ?cap ?o ?def ?v WHERE {
 	    ?s ds:field ?o.
        ?o xsem:definition ?def.
        OPTIONAL {?o xsem:valueExample ?v}.
        OPTIONAL {?o irdf:level ?level}.
        OPTIONAL {?o irdf:caption ?cap}.
        ${filter}
    } ORDER BY ?level
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
            "caption": row[1]? format_caption(row[1]):row[1]
        });
    }

    return dataSources;
}
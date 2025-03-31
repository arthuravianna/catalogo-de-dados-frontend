"use server"

import { do_query } from "./connection"

export async function getDataTypes() {
    let query = `
    SELECT DISTINCT ?datatype ?caption ?subclassOf ?is_terminal WHERE {
        ?datatype ?p ?o .
        FILTER (
            isUri(?datatype) &&
            ?datatype != rnpk:keyTerm &&
            STRSTARTS(STR(?datatype), STR(rnpk:))
        )
        OPTIONAL{?datatype irdf:caption ?caption}
        OPTIONAL{?datatype rdfs:subClassOf ?subclassOf}
        BIND(
                (
                    NOT EXISTS {?s xsem:keyTerm ?datatype.}
                ) AS ?exist_relation
        )
        BIND (IF(?exist_relation, true, false) AS ?is_terminal)
    }`

    const response = await do_query(query);
    
    return response.result;
}

export async function getDataFromDataType(datatype:string) {
    let query = `
    SELECT ?data ?caption WHERE {
        ?data xsem:keyTerm ${datatype} .
        OPTIONAL{?data irdf:caption ?caption}
    }`

    const response = await do_query(query);
    
    return response.result;
}

export async function getDataTypesRoots() {
    let query = `
    SELECT ?root ?rootCaption WHERE { 
	    icatalogo:RNP irdf:dataTypeRoot ?root .
	    OPTIONAL{?root irdf:caption ?rootCaption}
    }`;

    const response = await do_query(query);
    
    return response.result;
}

export async function getDataTypesPredicates() {
    let query = `
    SELECT ?predicate WHERE { 
	    icatalogo:dataTypePredicates ds:field ?predicate .
    }`;

    const response = await do_query(query);

    return response.result;
}

// SELECT ?data ?dataCaption ?is_terminal WHERE {
//     {
//         ?data rdfs:subClassOf rnpk:TimestampedData .
//     }
//     UNION
//     {
//         ?data xsem:keyTerm rnpk:TimestampedData .
//     }
    
//     OPTIONAL{?data irdf:caption ?dataCaption}

// BIND (
//     (
//         NOT EXISTS {?s rdfs:subClassOf ?data.} && 
//         NOT EXISTS {?s xsem:keyTerm ?data.}
//         ) AS ?exist_relation
// )
// BIND (IF(?exist_relation, true, false) AS ?is_terminal)
// }
export async function getDatatypeAndMetrics(datatype:string) {
    const predicates:Array<string> = await getDataTypesPredicates();

    let unions = `{?data ${predicates[0]} ${datatype}}`;
    let is_terminal = `BIND ( (NOT EXISTS {?s ${predicates[0]} ?data.}`
    for (let i = 1; i < predicates.length; i++) {
        unions = unions + ` UNION {?data ${predicates[i]} ${datatype}}`;
        is_terminal = is_terminal + ` && NOT EXISTS {?s ${predicates[i]} ?data.}`;
    }

    is_terminal = `
        ${is_terminal}) AS ?exist_relation)
        BIND (IF(?exist_relation, true, false) AS ?is_terminal)
    `

    const query = `
    SELECT ?data ?dataCaption ?is_terminal WHERE {
        ${unions}
        OPTIONAL {?data irdf:caption ?dataCaption}
        ${is_terminal}
    }
    `

    const response = await do_query(query);
    return response.result;
}

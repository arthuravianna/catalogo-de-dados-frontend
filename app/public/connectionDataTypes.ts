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
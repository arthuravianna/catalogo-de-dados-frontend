"use server"

import { envClient } from "../../public/envClient";
import { remove_quotes } from "../../public/utils";

export async function do_query(query:string) {
    const res = await fetch(`${envClient.RDF_SERVER_URL}/query`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: query,
        next: {
            //revalidate: 300
            revalidate: 60
        }
    });

    return await res.json();
}

export async function get_namespaces() {
    return await fetch(`${envClient.RDF_SERVER_URL}/namespaces`, {
        method: "GET",
    });
}


export async function get_caption(subject:string) {
    const query = `SELECT ?subject_caption WHERE {${subject} irdf:caption ?subject_caption}`;
    const response = await do_query(query);

    // get label if exists and use substring to remove "
    const caption = response.result.length > 0? remove_quotes(response.result[0][0]):null;

    return caption;
}
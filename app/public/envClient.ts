import { envsafe, url } from 'envsafe';


export const envClient = envsafe({
  RDF_SERVER_URL: url({
    input: process.env.NEXT_PUBLIC_RDF_SERVER_URL,
    desc: "RDF Server URL."
  })
})
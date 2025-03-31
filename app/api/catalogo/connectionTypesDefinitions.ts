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

export enum VIEW {
    STRUCTURAL,
    CONCEPTUAL,
    SCIENTIFIC_ARTICLES,
    GOVERNANCE
}
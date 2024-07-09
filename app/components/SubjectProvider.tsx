'use client'


import { createContext, useState } from 'react';
import { NamespaceWithCaption, query_subject_info, SubjectRelation } from '../public/connection';

export type Subject = {
    name:string,
    caption?:string,
    relations:SubjectRelation
}
const emptySubject:Subject = {
    name: "",
    relations: {}
}

export const SubjectContext = createContext<{
    view:number,
    namespace:NamespaceWithCaption|null, changeNamespace(n:NamespaceWithCaption):void,
    subject:Subject, changeSubject(s:string):Promise<Subject>
}>({
    view:0,
    namespace:null,  changeNamespace:(n:NamespaceWithCaption) => null,
    subject: emptySubject, changeSubject: async (s:string) => emptySubject
});


export function SubjectProvider({ children }:{ children: React.ReactNode }) {
    const [namespace, setNamespace] = useState<NamespaceWithCaption|null>(null);
    const [subject, setSubject] = useState<Subject>(emptySubject);
    const [view, setCurrentView] = useState(0); // view = structural


    const changeNamespace = (n:NamespaceWithCaption) => {
        setNamespace(n);
        setSubject(emptySubject);
    }

    const changeSubject = async (subjectName:string) => {
        const relations = await query_subject_info(subjectName, view);
        if (relations) {
            const subject = {name: subjectName, relations: relations};
            setSubject(subject);
            return subject;
        }
        return emptySubject;
    }

    return (
        <SubjectContext.Provider value={ {view, namespace, changeNamespace, subject, changeSubject} }>
            { children }
        </SubjectContext.Provider>
    );
}


'use client'


import { createContext, useState } from 'react';
import { query_subject_info, SubjectRelation } from '../public/connection';

const FRAME_OPTIONS = ["tree", "flat"] as const;
type FRAME = typeof FRAME_OPTIONS;        // type x = readonly ['op1', 'op2', ...]
type FRAME_OPTIONS_TYPE = FRAME[number]


export type Root = {
    name:string,
    isNamespace:boolean
}

const emptyRoot:Root = {
    name: "",
    isNamespace: false
}


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
    root:Root, changeRoot(root:Root):void,
    frame:FRAME_OPTIONS_TYPE,changeFrame(frame:FRAME_OPTIONS_TYPE):void
    subject:Subject, changeSubject(s:string):Promise<Subject>,
    selectedSubject:Subject, changeSelectedSubject(subjectName:string):void
}>({
    view:0,
    root:emptyRoot, changeRoot:(root:Root) => null,
    frame:"tree", changeFrame:() => null,
    subject: emptySubject, changeSubject: async (s:string) => emptySubject,
    selectedSubject:emptySubject, changeSelectedSubject: async () => null
});


export function SubjectProvider({ children }:{ children: React.ReactNode }) {
    const [root, setRoot] = useState(emptyRoot);
    const [subject, setSubject] = useState<Subject>(emptySubject);
    const [selectedSubject, setSelectedSubject] = useState<Subject>(emptySubject);
    const [view, setCurrentView] = useState(0); // view = structural
    const [frame, setFrame] = useState<FRAME_OPTIONS_TYPE>("tree");



    // change current root, can be a namespace or a subject
    const changeRoot = (root:Root) => setRoot(root);

    const changeSubject = async (subjectName:string) => {
        const relations = await query_subject_info(subjectName, view);
        if (relations) {
            const subject = {name: subjectName, relations: relations};
            setSubject(subject);
            return subject;
        }
        return emptySubject;
    }

    const changeSelectedSubject = async (subjectName:string) => {
        const relations = await query_subject_info(subjectName, view);
        if (relations) {
            const subject = {name: subjectName, relations: relations};
            setSelectedSubject(subject);
        }
    }

    const changeFrame = (frame:FRAME_OPTIONS_TYPE) => {
        setFrame(frame);
    }

    return (
        <SubjectContext.Provider value={ {
            view,
            root, changeRoot,
            frame, changeFrame,
            // namespace, changeNamespace,
            subject, changeSubject,
            selectedSubject, changeSelectedSubject
        } }>
            { children }
        </SubjectContext.Provider>
    );
}


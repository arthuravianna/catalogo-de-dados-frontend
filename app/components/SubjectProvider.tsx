'use client'


import { createContext, useState } from 'react';
import { SubjectRelation, VIEW } from '@api/catalogo/connectionTypesDefinitions';
import { query_subject_info } from '@api/catalogo/connectionDataSources';

const FRAME_OPTIONS = ["tree", "flat"] as const;
type FRAME = typeof FRAME_OPTIONS;        // type x = readonly ['op1', 'op2', ...]
type FRAME_OPTIONS_TYPE = FRAME[number]


export type Root = {
    name:string,
    isNamespace:boolean,
    caption?:string
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
    view:VIEW,
    root:Root, changeRoot(root:Root):void,
    frame:FRAME_OPTIONS_TYPE,changeFrame(frame:FRAME_OPTIONS_TYPE):void
    subject:Subject, changeSubject(s:string):Promise<Subject>,
    selectedSubject:Subject, changeSelectedSubject(subjectName:string):void,
    exportData:boolean, setExportData(e:boolean):void,
    dataToExport:string, changeDataToExport(data:string):void
}>({
    view:0,
    root:emptyRoot, changeRoot:(root:Root) => null,
    frame:"tree", changeFrame:() => null,
    subject: emptySubject, changeSubject: async (s:string) => emptySubject,
    selectedSubject:emptySubject, changeSelectedSubject: async () => null,
    exportData:false, setExportData: (e:boolean) => null,
    dataToExport:"", changeDataToExport: (data:string) => null
});


export function SubjectProvider({ children }:{ children: React.ReactNode }) {
    const [root, setRoot] = useState(emptyRoot);
    const [subject, setSubject] = useState<Subject>(emptySubject);
    const [selectedSubject, setSelectedSubject] = useState<Subject>(emptySubject);
    const [view, setCurrentView] = useState(VIEW.STRUCTURAL); // view = structural
    const [frame, setFrame] = useState<FRAME_OPTIONS_TYPE>("tree");
    const [exportData, setExportData] = useState(false);
    const [dataToExport, setDataToExport] = useState("");



    // change current root, can be a namespace or a subject
    const changeRoot = (root:Root) => {
        root.isNamespace? setFrame("tree"):setFrame("flat");
        setRoot(root);
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

    const changeDataToExport = (data:string) => {
        setDataToExport(data);
    }

    return (
        <SubjectContext.Provider value={ {
            view,
            root, changeRoot,
            frame, changeFrame,
            // namespace, changeNamespace,
            subject, changeSubject,
            selectedSubject, changeSelectedSubject,
            exportData, setExportData,
            dataToExport, changeDataToExport
        } }>
            { children }
        </SubjectContext.Provider>
    );
}


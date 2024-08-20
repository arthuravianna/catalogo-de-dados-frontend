"use client"

import { Field, Label, Switch } from '@headlessui/react'
import React, { useContext, useEffect } from 'react'
import { SubjectContext } from './SubjectProvider';

function HeaderFrame() {
    const {frame, changeFrame, dataToExport, changeDataToExport, setExportData} = useContext(SubjectContext);
    const exportDisabled = frame == "tree";

    useEffect(() => {
        if (dataToExport.length == 0) return;

        const url = window.URL.createObjectURL(new Blob([dataToExport], {type: "text/csv"}));
        const link = document.createElement("a");
        const filename = "catalogo_export.csv";
        link.href = url;
        link.type
        link.download = filename;
        document.body.appendChild(link);

        link.click();

        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        // clear export variables
        setExportData(false);
        changeDataToExport("");
    }, [dataToExport])

    function changeCurrentFrame() {
        if (frame == "tree") changeFrame("flat");
        else changeFrame("tree");
    }

    return (
        <div className="h-12 bg-white p-2 rounded-md w-full flex gap-4">
            <Field className="h-full flex items-center gap-1">
                <Label>Tree</Label>
                <Switch
                    checked={frame=='flat'}
                    onChange={changeCurrentFrame}
                    className="group inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition data-[checked]:bg-blue-600"
                >
                    <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-[checked]:translate-x-6" />
                </Switch>
                <Label>Flat</Label>
            </Field>

            <button disabled={exportDisabled} onClick={() => setExportData(true)}
            className={`rounded-md p-2 flex items-center border border-black bg-gray-200 ${exportDisabled? "":"hover:text-white hover:bg-rnp-blue"}`}>
                Export as CSV
            </button>
        </div>
    )
}

export default HeaderFrame
"use client"

import React, { useContext, useEffect } from 'react'
import { SubjectContext } from './SubjectProvider';
import ShoppingCart from './ShoppingCart';
import { RequestsCartContext } from '../context/RequestsCart';

function HeaderFrame() {
    const {frame, dataToExport, changeDataToExport, setExportData} = useContext(SubjectContext);
    const {setShowRequestModal} = useContext(RequestsCartContext);
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

    return (
        <div className="h-12 bg-white p-2 rounded-md w-full flex gap-4">
            <button disabled={exportDisabled} onClick={() => setExportData(true)}
            className={`rounded-md p-2 flex items-center border border-black bg-gray-200 ${exportDisabled? "":"hover:text-white hover:bg-rnp-blue"}`}>
                Export as CSV
            </button>

            <button disabled={exportDisabled} onClick={() => setShowRequestModal(true)}
            className={`rounded-md p-2 flex items-center border border-black bg-gray-200 ${exportDisabled? "":"hover:text-white hover:bg-rnp-blue"}`}>
                Solicitar Dados
            </button>

            <ShoppingCart/>
        </div>
    )
}

export default HeaderFrame
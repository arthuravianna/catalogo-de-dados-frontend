"use client"

import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import React, { useContext, useEffect, useState } from 'react'
import { SubjectContext } from './SubjectProvider'
import { query_root_info } from '../public/connection'
import { remove_quotes } from '../public/utils'
//import { IoWarning } from "react-icons/io5"; // TODO: add warning "Example Value" is not included in the exported CSV
import { IoInformationCircleOutline } from "react-icons/io5";

interface Info {
    name:string,
    definition:string,
    type:string,
    unit:string|null,
    value:string,
    unitName:string|null,
    unitDefinition:string|null
}

function FlatFrame() {
    const { root, view, exportData, setExportData, changeDataToExport } = useContext(SubjectContext);
    const [ data, setData ] = useState<Array<Info>>([]);
    const [loading, setLoading] = useState(true);
    const [tableHeight, setTableHeight] = useState("400px");
    const [selectedData, setSelectedData] = useState<Array<Info>|null>(null);

    useEffect(() => {
        if (!exportData) return;
        if (!selectedData || selectedData.length == 0) {
            alert("Select the fields to be exported.");
            setExportData(false); // clear
            return;
        }

        let csvData = "name,type,definition";
        let csvRowInfo:Info;
        for (let i = 0; i < selectedData.length; i++) {
            csvRowInfo = selectedData[i];
            csvData += `\n${csvRowInfo.name},${csvRowInfo.type},${csvRowInfo.definition}`;
        }

        changeDataToExport(csvData);
    }, [exportData]);

    useEffect(() => {
        if (!root) return;

        if (!loading) setLoading(true);
        let newData:Array<Info> = [];

        const namePos = 0;
        const definitionPos = 1;
        const typePos = 2;
        const unitPos = 3;
        const valPos = 4;
        const unitNamePos = 5;
        const unitDefinitionPos = 6;

        query_root_info(root.name, view, root.isNamespace)
        .then((res) => {
            for (let item of res) {
                newData.push(
                    {
                        name: remove_quotes(item[namePos]),
                        definition: item[definitionPos],
                        type: remove_quotes(item[typePos]),
                        unit: item[unitPos]? remove_quotes(item[unitPos]): null,
                        value: item[valPos],
                        unitName: item[unitNamePos]? remove_quotes(item[unitNamePos]): null,
                        unitDefinition: item[unitDefinitionPos]? remove_quotes(item[unitDefinitionPos]): null
                    }
                )
            }

            setData(newData);
            setLoading(false);
        })


    }, [root])

    useEffect(handleResize, []);

    function unitBody(info:Info) {
        let text = "-";

        if (info.unitName) {
            text = info.unitName;
        } else if (info.unit) {
            text = info.unit;
        }


        return <span className='flex gap-1 items-center' >
                {text}

                {
                    !info.unitDefinition?
                        <></>
                    :
                        <IoInformationCircleOutline className='text-lg hover:txt-rnp-blue' title={info.unitDefinition}/>
                }
                
            </span>
    }

    function handleResize() {
        const parentHeight = document.getElementById("frame-content")?.offsetHeight;
        if (parentHeight) setTableHeight(`${parentHeight-20}px`);
    }

    if (typeof window != "undefined") {
        window.addEventListener("resize", handleResize);
    }

    return (
        <div className='frame'>
            <DataTable 
            selectionMode={null} selection={selectedData!} onSelectionChange={(e:any) => setSelectedData(e.value)}
            loading={loading} value={data} stripedRows scrollable scrollHeight={tableHeight} style={{fontSize: 12}} >
                <Column selectionMode="multiple"  headerStyle={{ width: '3rem' }}></Column>
                <Column field="name" header="Name" className='py-1'></Column>
                <Column field="type" header="Type" className='py-1'></Column>
                <Column field="unit" header="Unit" className='py-1' body={unitBody} ></Column>
                <Column field="value" header="Example Value" className='py-1'></Column>
                <Column field="definition" header="Definition" className='py-1'></Column>
            </DataTable>
        </div>
    )
}

export default FlatFrame
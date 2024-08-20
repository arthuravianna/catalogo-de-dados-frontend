"use client"

import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import React, { useContext, useEffect, useState } from 'react'
import { SubjectContext } from './SubjectProvider'
import { query_root_info } from '../public/connection'

interface Info {
    name:string,
    definition:string,
    value:string
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

        let csvData = "name,definition,example_value";
        let csvRowInfo:Info;
        for (let i = 0; i < selectedData.length; i++) {
            csvRowInfo = selectedData[i];
            csvData += `\n${csvRowInfo.name},${csvRowInfo.definition},${csvRowInfo.value}`;
        }

        changeDataToExport(csvData);
    }, [exportData]);

    useEffect(() => {
        if (!root) return;

        if (!loading) setLoading(true);
        let newData:Array<Info> = [];

        const namePos = 0;
        const objectPos = 1
        const definitionPos = 2;
        const valPos = 3;

        query_root_info(root.name, view, root.isNamespace)
        .then((res) => {
            for (let item of res) {
                newData.push(
                    {
                        name: item[namePos]? item[namePos]: item[objectPos],
                        definition: item[definitionPos],
                        value: item[valPos]
                    }
                )
            }

            setData(newData);
            setLoading(false);
        })


    }, [root])

    useEffect(handleResize, []);

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
                <Column field="name" header="Name" className='p-1'></Column>
                <Column field="definition" header="Definition" className='p-1'></Column>
                <Column field="value" header="Example Value" className='p-1'></Column>
            </DataTable>
        </div>
    )
}

export default FlatFrame
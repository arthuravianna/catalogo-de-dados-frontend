"use client"


import React from 'react'
import { useContext } from 'react';
import { SubjectContext } from './SubjectProvider';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useEffect, useState } from 'react';

interface Relation {
  predicate:string,
  object:string
}

function TableFrame() {
  const { selectedSubject } = useContext(SubjectContext);
  const [ data, setData ] = useState<Array<Relation>>([]);

  useEffect(() => {
    let newData:Array<Relation> = [];

    for (let predicate in selectedSubject.relations) {
      for (let i = 0; i < selectedSubject.relations[predicate].length; i++) {
        const object = selectedSubject.relations[predicate][i];
        console.log(predicate, object);

        newData.push({predicate: predicate, object: object.object});
      }
    }

    if (newData.length > 0) setData(newData);
  }, [selectedSubject])
  
  return (
    <div className='frame'>
      <DataTable emptyMessage={"Select a node."} value={data} >
          <Column field="predicate" header="Predicate"></Column>
          <Column field="object" header="Object"></Column>
      </DataTable>
    </div>
  )
}

export default TableFrame
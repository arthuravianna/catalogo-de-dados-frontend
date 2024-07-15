"use client"


import React from 'react'
import { useContext } from 'react';
import { SubjectContext } from './SubjectProvider';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useEffect, useState } from 'react';
import { query_relation_predicates } from '../public/connection';

interface Relation {
  predicate:string,
  object:string
}

function TableFrame() {
  const { view, selectedSubject } = useContext(SubjectContext);
  const [ data, setData ] = useState<Array<Relation>>([]);
  const [ predicates, setPredicates ] = useState<Array<string>>([]);

  useEffect(() => {
    let newData:Array<Relation> = [];

    for (let predicate in selectedSubject.relations) {
      for (let i = 0; i < selectedSubject.relations[predicate].length; i++) {
        const object = selectedSubject.relations[predicate][i];

        if (predicates.includes(predicate)) continue;

        newData.push({predicate: predicate, object: object.object});
      }
    }

    if (newData.length > 0) setData(newData);
  }, [selectedSubject])

  useEffect(() => {
    query_relation_predicates(view).then((relation_predicates) => {
      if (relation_predicates) setPredicates(relation_predicates);
    })
  }, [view])
  

  return (
    <div className='frame'>
      <DataTable emptyMessage={"Select a node."} value={data} stripedRows >
          <Column field="predicate" header="Predicate" className='p-1'></Column>
          <Column field="object" header="Object" className='p-1'></Column>
      </DataTable>
    </div>
  )
}

export default TableFrame
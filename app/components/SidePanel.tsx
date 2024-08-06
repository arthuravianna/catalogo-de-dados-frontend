"use client"


import React, { useContext, useEffect, useState } from 'react'
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { PiCubeBold } from "react-icons/pi";
import { query_navigable_namespaces, NameWithCaption, query_namespace_datasources } from '../public/connection';
import { SubjectContext } from './SubjectProvider';


function SidePanel() {
    const { view, changeRoot } = useContext(SubjectContext);
    const [rootDataSources, setRootDataSources] = useState<Array<NameWithCaption>|null>([]);
    const [dataSources, setDataSources] = useState<Record<string, Array<NameWithCaption>>>({});

    useEffect(() => {
        const getData = async () => {
            const namespaces = await query_navigable_namespaces(view);
            if (!namespaces) return;

            let namespaceDataSources:Record<string, Array<NameWithCaption>> = {};
            for (let namespace of namespaces) {
                //if (!namespaceDataSources[namespace.namespace]) namespaceDataSources[namespace.namespace] = [];

                const sources = await query_namespace_datasources(namespace.name);
                namespaceDataSources[namespace.name] = sources;
            }
            
            setRootDataSources(namespaces);
            setDataSources(namespaceDataSources);
        }
        
        getData();
    }, [])

    return (
        <Sidebar breakPoint="md" width='256px' className='bg-black'>
            <div className='flex items-center justify-center gap-2 my-4'>
                <PiCubeBold className='text-5xl' />
                <div className='flex flex-col items-center'>
                    <span className='text-xl'>Catalogo de Dados</span>
                    <span className='text-xs'>(Fontes de Dados)</span>
                </div>
            </div>
            <Menu>
                {
                    rootDataSources?.map((rootSource, index) => {
                        return (
                            <SubMenu 
                            key={`${rootSource.name}-${index}`} 
                            open={true} 
                            onClick={() => changeRoot({name: rootSource.name, isNamespace: true})}
                            label={rootSource.caption? rootSource.caption:rootSource.name}>
                                {
                                    dataSources[rootSource.name].map((dataSouce, index) => {
                                        return (
                                            <MenuItem key={`${dataSouce}-${index}`} style={{fontSize: "12px"}}
                                            onClick={() => changeRoot({name: dataSouce.name, isNamespace: false})}>
                                                {dataSouce.caption? dataSouce.caption:dataSouce.name}
                                            </MenuItem>
                                        )
                                    })
                                }
                            </SubMenu>
                        )
                    })
                }
            </Menu>
        </Sidebar>
    )
}

export default SidePanel
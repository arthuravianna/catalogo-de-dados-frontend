"use client"


import React, { useContext, useEffect, useState } from 'react'
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { PiCubeBold } from "react-icons/pi";
import { query_navigable_namespaces, NameWithCaption, query_namespace_datasources } from '../public/connection';
import { SubjectContext } from './SubjectProvider';

const RNP_BLUE = "#001EFF";

function SidePanel() {
    const { view, root, changeRoot } = useContext(SubjectContext);
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
        <Sidebar breakPoint="md" width='256px'  backgroundColor="#FFFFFF">
            <div className='flex items-center justify-center gap-2 my-4'>
                <PiCubeBold style={{color: RNP_BLUE}} className='text-5xl' />
                <div className='flex flex-col items-center'>
                    <span className='text-xl font-bold'>Catalogo de Dados</span>
                    <span className='text-xs font-semibold'>(Fontes de Dados)</span>
                </div>
            </div>
            <Menu menuItemStyles={
                {
                    button: ({ level, active, disabled }) => {
                        return {
                            color: active ? '#FFFFFF' : undefined,
                            backgroundColor: active ? RNP_BLUE : level == 0? "#F8F8F8":undefined,
                            fontWeight: level == 0? "500": "",
                            fontSize: level == 0? "16px": "12px",
                            '&:hover': {
                                backgroundColor: RNP_BLUE,
                                color: '#FFFFFF',
                            }
                        };
                    },
                  }
            }>
                
                {
                    rootDataSources?.map((rootSource, index) => {
                        return (
                            <SubMenu 
                            active={root.name == rootSource.name}
                            key={`${rootSource.name}-${index}`} 
                            open={true} 
                            onClick={() => changeRoot({name: rootSource.name, isNamespace: true})}
                            label={rootSource.caption? rootSource.caption:rootSource.name}>
                                {
                                    dataSources[rootSource.name].map((dataSouce, index) => {
                                        return (
                                            <MenuItem active={root.name == dataSouce.name} key={`${dataSouce}-${index}`}
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
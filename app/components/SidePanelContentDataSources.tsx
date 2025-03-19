"use client"


import React, { useContext, useEffect, useState } from 'react'
import { Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { SubjectContext } from './SubjectProvider';
import { RNP_BLUE } from '../public/utils';
import { query_namespace_datasources, query_navigable_namespaces } from '../public/connectionDataSources';
import { NameWithCaption } from '../public/connectionTypesDefinitions';

function SidePanelContentDataSources() {
    const { view, root, changeRoot } = useContext(SubjectContext);
    const [rootDataSources, setRootDataSources] = useState<Array<NameWithCaption>|null>([]);
    const [dataSources, setDataSources] = useState<Record<string, Array<NameWithCaption>>>({});
    
    useEffect(() => {
        const getData = async () => {
            const namespaces = await query_navigable_namespaces(view);
            if (!namespaces) return;

            changeRoot({name: namespaces[0].name, isNamespace: true}); // pre select the first namespace

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
                                        onClick={() => changeRoot({name: dataSouce.name, isNamespace: false, caption: dataSouce.caption||undefined})}>
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
    )
}

export default SidePanelContentDataSources
"use client"


import React, { useContext, useEffect } from 'react'
import { Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { SubjectContext } from './SubjectProvider';
import { RNP_BLUE } from '../public/utils';
import { DataSources, RootDataSource } from '../datasources/page';

function SidePanelContentDataSources(
    {rootDataSources, dataSources}:
    {rootDataSources:RootDataSource, dataSources:DataSources}
) {
    const { root, changeRoot } = useContext(SubjectContext);
    
    useEffect(() => {
        if (!rootDataSources) return;

        // pre select the first namespace
        changeRoot({name: rootDataSources[0].name, isNamespace: true});
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
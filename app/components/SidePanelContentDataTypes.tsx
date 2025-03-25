
"use client"


import React, { useContext } from 'react'
import { Menu, SubMenu } from 'react-pro-sidebar';
import { SubjectContext } from './SubjectProvider';
import { RNP_BLUE } from '../public/utils';
import { DataTypeData } from '../datatypes/page';


function SidePanelContentDataTypes({rootDataTypes}:{rootDataTypes:DataTypeData}) {
    const { root, changeRoot } = useContext(SubjectContext);

    
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
                rootDataTypes?.map((rootDataType, index) => {
                    return (
                        <SubMenu 
                        active={root.name == rootDataType[0]}
                        key={`${rootDataType[0]}-${index}`} 
                        open={true} 
                        onClick={() => changeRoot({name: rootDataType[0], isNamespace: true})}
                        label={rootDataType[1]? rootDataType[1]:rootDataType[0]}>

                        </SubMenu>
                    )
                })
            }
        </Menu>
    )
}

export default SidePanelContentDataTypes
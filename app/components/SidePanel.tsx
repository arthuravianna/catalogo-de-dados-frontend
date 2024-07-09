"use client"


import React, { useContext, useEffect, useState } from 'react'
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { PiCubeBold } from "react-icons/pi";
import { query_navigable_namespaces, NamespaceWithCaption } from '../public/connection';
import { SubjectContext } from './SubjectProvider';


function SidePanel() {
    const { view, changeNamespace } = useContext(SubjectContext);
    const [dataSources, setDataSources] = useState<Array<NamespaceWithCaption>|null>([]);

    useEffect(() => {
        query_navigable_namespaces(view).then((namespaces) => {
            setDataSources(namespaces);
        })
    }, [])

    return (
        <Sidebar breakPoint="md" width='256px' className='bg-black'>
            <div className='flex items-center justify-center gap-2 my-4'>
                <PiCubeBold className='text-5xl' />
                <span className='text-xl'>Catalogo de Dados</span>
            </div>
            <Menu>
                {
                    dataSources?.map((source, index) => {
                        return (
                            <MenuItem key={index} onClick={() => changeNamespace(source)}>
                                {source.caption? source.caption:source.namespace}
                            </MenuItem>
                        )
                    })
                }
            </Menu>
        </Sidebar>
    )
}

export default SidePanel
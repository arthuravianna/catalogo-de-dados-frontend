"use client"


import React from 'react'
import { Sidebar } from 'react-pro-sidebar';
import SidePanelTitle from './SidePanelTitle';
import SidePanelContentDataSources from './SidePanelContentDataSources';
import { INTERFACE_CONTENT_TYPE } from '../public/utils';
import SidePanelContentDataTypes from './SidePanelContentDataTypes';


function SidePanel({sidePanelType}:{sidePanelType:INTERFACE_CONTENT_TYPE}) {

    function sidePanelContent() {
        if (sidePanelType == "datasources") {
            return (
                <>
                    <SidePanelTitle subtitle="Fontes de Dados"/>
                    <SidePanelContentDataSources/>
                </>
            )
        } else if (sidePanelType == "datatypes") {
            return (
                <>
                    <SidePanelTitle subtitle="Tipos de Dados"/>
                    <SidePanelContentDataTypes/>
                </>
            )
        }
    }

    return (
        <Sidebar breakPoint="md" width='256px' backgroundColor="#FFFFFF">
            {sidePanelContent()}
        </Sidebar>
    )
}

export default SidePanel
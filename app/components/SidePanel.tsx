"use client"


import React from 'react'
import { Sidebar } from 'react-pro-sidebar';
import SidePanelTitle from './SidePanelTitle';
import SidePanelContentDataSources from './SidePanelContentDataSources';

const SIDE_PANEL_OPTIONS = ["datasources", "datatypes"] as const;
type SIDE_PANEL = typeof SIDE_PANEL_OPTIONS;        // type x = readonly ['op1', 'op2', ...]
type SIDE_PANEL_TYPE = SIDE_PANEL[number]


function SidePanel({sidePanelType}:{sidePanelType:SIDE_PANEL_TYPE}) {

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
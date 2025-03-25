"use client"


import React from 'react'
import { Sidebar } from 'react-pro-sidebar';
import SidePanelTitle from './SidePanelTitle';
import SidePanelContentDataSources from './SidePanelContentDataSources';
import { INTERFACE_CONTENT_TYPE } from '../public/utils';
import SidePanelContentDataTypes from './SidePanelContentDataTypes';
import { DataSourceData } from '../datasources/page';
import { DataTypeData } from '../datatypes/page';

function SidePanel({sidePanelType, data}:{sidePanelType:INTERFACE_CONTENT_TYPE, data:DataSourceData|DataTypeData}) {

    function sidePanelContent() {
        if (sidePanelType == "datasources") {
            data = data as DataSourceData;
            return (
                <>
                    <SidePanelTitle subtitle="Fontes de Dados"/>
                    <SidePanelContentDataSources rootDataSources={data.rootDataSources} dataSources={data.dataSources}/>
                </>
            )
        } else if (sidePanelType == "datatypes") {
            data = data as DataTypeData;
            return (
                <>
                    <SidePanelTitle subtitle="Tipos de Dados"/>
                    <SidePanelContentDataTypes rootDataTypes={data}/>
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
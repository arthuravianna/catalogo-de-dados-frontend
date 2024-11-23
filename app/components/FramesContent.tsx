"use client"

import React, { useContext } from 'react'
import TreeFrame from './TreeFrame'
import TableFrame from './TableFrame'
import { SubjectContext } from './SubjectProvider'
import FlatFrame from './FlatFrame'
import { INTERFACE_CONTENT_TYPE } from '../public/utils'
import TreeFrameDataTypes from './TreeFrameDataTypes'


function FramesContent({frameContentType}:{frameContentType:INTERFACE_CONTENT_TYPE}) {
    const {frame} = useContext(SubjectContext);

    function frameContent() {
        if (frameContentType == "datasources") {
            return (
                <>
                    <div hidden={frame != "tree"} className="frame-container"><TreeFrame/></div>
                    <div hidden={frame != "tree"} className="frame-container"><TableFrame/></div>
                    <div hidden={frame != "flat"} className="frame-container col-span-2"><FlatFrame/></div>
                </>
            )
        } else if (frameContentType == "datatypes") {
            return (
                <>
                    <div className='frame-container'><TreeFrameDataTypes/></div>
                    <div className="frame-container"><TableFrame/></div>
                </>
            )
        }
    }

    return (
        <div id="frame-content" className="flex-1 grid grid-cols-2 h-full gap-2">
            {frameContent()}
        </div>
    )
}

export default FramesContent
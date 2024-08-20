"use client"

import React, { useContext } from 'react'
import TreeFrame from './TreeFrame'
import TableFrame from './TableFrame'
import { SubjectContext } from './SubjectProvider'
import FlatFrame from './FlatFrame'

function FramesContent() {
    const {frame} = useContext(SubjectContext);

    return (
        <div id="frame-content" className="flex-1 grid grid-cols-2 h-full gap-2">
            <div hidden={frame != "tree"} className="frame-container"><TreeFrame/></div>
            <div hidden={frame != "tree"} className="frame-container"><TableFrame/></div>
            <div hidden={frame != "flat"} className="frame-container col-span-2"><FlatFrame/></div>
        </div>
    )
}

export default FramesContent
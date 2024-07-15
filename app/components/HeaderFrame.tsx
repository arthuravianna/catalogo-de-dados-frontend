"use client"

import { Field, Label, Switch } from '@headlessui/react'
import React, { useContext } from 'react'
import { SubjectContext } from './SubjectProvider';

function HeaderFrame() {
    const {frame, changeFrame} = useContext(SubjectContext);

    function changeCurrentFrame() {
        if (frame == "tree") changeFrame("flat");
        else changeFrame("tree");
    }
    
    return (
        <div className="h-12 bg-white p-2 rounded-md w-full">
            <Field className="h-full flex items-center gap-1">
                <Label>Tree</Label>
                <Switch
                    checked={frame=='flat'}
                    onChange={changeCurrentFrame}
                    className="group inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition data-[checked]:bg-blue-600"
                >
                    <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-[checked]:translate-x-6" />
                </Switch>
                <Label>Flat</Label>
            </Field>
        </div>
    )
}

export default HeaderFrame
"use client"

import { Sidebar } from 'primereact/sidebar';
import React, { useState } from 'react'
import { FaShoppingCart } from 'react-icons/fa'

export default function ShoppingCart() {
    const [visibleRight, setVisibleRight] = useState(false);

    const sidebarHeader = (
        <div className="flex align-items-center gap-2">
            <span className="font-bold">Solicitações</span>
        </div>
    );

    return (
        <>
            <div className='flex-1 flex justify-end'>
                <button
                onClick={() => setVisibleRight(true)}
                className={`rounded-md p-2 flex items-center border border-black bg-gray-200 hover:text-white hover:bg-rnp-blue`}>
                    <FaShoppingCart/>
                </button>
            </div>

            <Sidebar visible={visibleRight} header={sidebarHeader} position="right" onHide={() => setVisibleRight(false)}>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
            </Sidebar>
        </>

  )
}

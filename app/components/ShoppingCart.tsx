"use client"

import { Sidebar } from 'primereact/sidebar';
import React, { useContext, useState } from 'react'
import { FaShoppingCart, FaTrash } from 'react-icons/fa'
import { RequestsCartContext } from '@/app/context/RequestsCart';

export default function ShoppingCart() {
    const [visible, setVisible] = useState(false);
    const { requests, removeRequest } = useContext(RequestsCartContext);

    const sidebarHeader = (
        <div className="flex align-items-center gap-2">
            <span className="font-bold text-xl">Solicitações</span>
        </div>
    );

    return (
        <>
            <div className='flex-1 flex justify-end'>
                <button
                onClick={() => setVisible(true)}
                className='relative p-2 rounded-md border border-black bg-gray-200 hover:text-white hover:bg-rnp-blue'
                >
                    <FaShoppingCart/>
                    {
                        !requests.length?
                            <></>
                        :
                            <div className='bg-red-700 text-white absolute px-1 flex items-center justify-center rounded-full -top-2 -right-1 text-xs'>
                                {requests.length}
                            </div>
                    }

                </button>
            </div>

            <Sidebar visible={visible} header={sidebarHeader} position="right" onHide={() => setVisible(false)}>
                {
                    requests.length == 0?
                        <div>
                            Sem solicitações no carrinho.
                        </div>
                    :
                        <div>
                            {
                                requests.map((request, index) => {
                                    return (
                                        <div key={index} className='mb-2 border-b-2 border-gray-500 flex flex-col'>
                                            <div className='flex'>
                                                <h2 className='font-bold mb-2'>{request.data.caption}</h2>
                                                <span className='flex-1 flex justify-end'>
                                                    <button 
                                                    onClick={() => removeRequest(index)}
                                                    className='hover:text-red-500 h-fit text-lg'
                                                    >
                                                        <FaTrash/>
                                                    </button>
                                                </span>
                                            </div>

                                            <div className='flex gap-1'>
                                                <span className='font-semibold'>Origem:</span>
                                                <div className='flex flex-col'>
                                                    {
                                                        request.source.map((source, index) => {
                                                            if (index != request.source.length-1) {
                                                                return source.caption + ", ";
                                                            }
                                                            return source.caption + ".";
                                                        })
                                                    }
                                                </div>
                                            </div>

                                            <div className='flex gap-1'>
                                                <span className='font-semibold'>Destino:</span>
                                                <div className='flex flex-col'>
                                                    {
                                                        request.destination.map((destination, index) => {
                                                            if (index != request.destination.length-1) {
                                                                return destination.caption + ", ";
                                                            }
                                                            return destination.caption + ".";
                                                        })
                                                    }
                                                </div>
                                            </div>

                                            <div className='flex gap-1'>
                                                <span className='font-semibold'>Período:</span>
                                                <span>{new Date(request.start_time).toLocaleDateString()}-{new Date(request.end_time).toLocaleDateString()}</span>
                                            </div>

                                            <div className='flex gap-1'>
                                                <span className='font-semibold'>Email:</span>
                                                <span>{request.email}</span>
                                            </div>
                                        </div>
                                    );
                                })
                            }

                            <button className='w-full mt-2 p-2 rounded-md border border-black bg-gray-200 hover:text-white hover:bg-rnp-blue'>
                                Confirmar
                            </button>
                        </div>
                }
            </Sidebar>
        </>
    )
}

'use client'


import { createContext, useState } from 'react';

export interface DataSourceOrDestination {
    id:string,
    caption:string
}

export interface DataRequest {
    data:{id: string, caption:string},
    start_time:number,
    end_time:number,
    source:Array<DataSourceOrDestination>,
    destination:Array<DataSourceOrDestination>,
    email:string
}
const DATA_REQUESTS_LOCAL_STORAGE_KEY = "cartRequests"


function getCartRequests(): Array<DataRequest> {
    if (typeof window !== "undefined") {
      const storedCartItems = localStorage.getItem(DATA_REQUESTS_LOCAL_STORAGE_KEY);

      if (storedCartItems !== null) {
        try {
          const cartItems = JSON.parse(storedCartItems);
          return cartItems;
        } catch (error) {
          console.error(error);
        }
      }
    }
    return [];
  }


// CONTEXT
export const RequestsCartContext = createContext<{
    showRequestModal:boolean, setShowRequestModal:(option:boolean) => void,
    requests:Array<DataRequest>,
    addRequest:(dataRequest:DataRequest) => void,
    removeRequest:(index:number) => void

}>({
    showRequestModal:false, setShowRequestModal:(option:boolean) => null,
    requests:[],
    addRequest:(dataRequest:DataRequest) => null,
    removeRequest:(index:number) => null
});


// CONTEXT PROVIDER
export function RequestsCartProvider({ children }:{ children: React.ReactNode }) {
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [requests, setRequests] = useState(getCartRequests());

    const addRequest = (dataRequest:DataRequest) => {
        if (typeof window !== "undefined") {
            let items = getCartRequests();
            items.push(dataRequest);
            setRequests(items);
    
            localStorage.setItem(DATA_REQUESTS_LOCAL_STORAGE_KEY, JSON.stringify(items));    
        }
    }

    const removeRequest = (index:number) => {
        if (index < 0) throw new Error("Negative index");
    
        if (typeof window !== "undefined") {
            let items = getCartRequests();
            items.splice(index, 1);
            setRequests(items);
        
            localStorage.setItem(DATA_REQUESTS_LOCAL_STORAGE_KEY, JSON.stringify(items));    
        }
    }


    return (
        <RequestsCartContext.Provider value={ {
            showRequestModal, setShowRequestModal,
            requests,
            addRequest, removeRequest
        } }>
            { children }
        </RequestsCartContext.Provider>
    );
}


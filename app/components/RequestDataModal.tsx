"use client"


import React, { useContext, useState } from 'react'
import { SubjectContext } from './SubjectProvider';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Calendar } from 'primereact/calendar';
import { addLocale } from 'primereact/api';
import { MultiSelect } from 'primereact/multiselect';
import { addCartRequest, DataRequest } from '../public/utils';

addLocale('pt-BR', {
    firstDayOfWeek: 0,
    dayNames: [
        "Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"
    ],
    dayNamesShort: [
        "Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"
    ],
    dayNamesMin: [
        "D", "S", "T", "Q", "Q", "S", "S"
    ],
    monthNames: [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
      ],
    monthNamesShort: [
        "Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"
      ],
    today: 'Hoje',
    clear: 'Limpar',
    dateFormat: "dd/mm/yy"
});


function RequestDataModal() {
    const {requestData, setRequestData, root} = useContext(SubjectContext);
    const [email, setEmail] = useState("");
    const [dates, setDates] = useState<(Date | null)[]|null>(null);
    const [selectedSource, setSelectedSource] = useState("");
    const [selectedDestination, setSelectedDestination] = useState("");
    const maxDate = new Date();

    const sourceOptions = [
        {"name": "PoP-DF", "code": "monipe-df-banda.rnp.br"},
        {"name": "PoP-RJ", "code": "monipe-rj-banda.rnp.br"},
        {"name": "PoP-SP", "code": "monipe-sp-banda.rnp.br"},
    ]

    const destinationOptions = [
        {"name": "PoP-DF", "code": "monipe-df-banda.rnp.br"},
        {"name": "PoP-RJ", "code": "monipe-rj-banda.rnp.br"},
        {"name": "PoP-SP", "code": "monipe-sp-banda.rnp.br"},
    ]

    function close() {
        setRequestData(false);
    }

    function clear() {
        setDates(null);
        setSelectedSource("");
        setSelectedDestination("");
    }

    function handleAddRequest() {
        if (!selectedSource || selectedSource.length == 0) return;
        if (!selectedDestination || selectedDestination.length == 0) return;
        if (!dates || dates.length < 2 || !dates[0] || !dates[1]) return;
        if (!email || email.length == 0) return;

        // add request
        const dataRequest:DataRequest = {
            data: {
                id: root.name,
                caption: root.caption? root.caption:root.name
            },
            start_time: dates[0].getTime(),
            end_time: dates[1].getTime(),
            source: selectedSource,
            destination: selectedDestination,
            email: email
        }
        addCartRequest(dataRequest);

        // close
        close()
    }

  
    return (
        <Dialog header="Pedido de Extração de Dados" visible={requestData} style={{ width: '30vw' }} breakpoints={{ '1480px': '40vw', '1280px': '60vw', '960px': '80vw', '641px': '100vw' }} onHide={() => {if (!requestData) return; close(); }}>
            <div className='flex flex-col gap-3 min-h-full items-center justify-center'>
                <form className='flex flex-col gap-3'>
                    <div className="flex flex-col gap-1 w-fit">
                        <label htmlFor="data">Dado</label>
                        <InputText id="data" className='border border-black ps-2' value={root.caption? root.caption:root.name} disabled />
                        <small id="data-help">
                            Dado selecionado.
                        </small>
                    </div>

                    <div className="flex flex-col gap-1 w-fit">
                        <label htmlFor="data-range">Período</label>
                        <Calendar id='data-range' locale="pt-BR" maxDate={maxDate} className='border border-black rounded-md ps-2' value={dates} onChange={(e) => setDates(e.value? e.value:null)} selectionMode="range" readOnlyInput hideOnRangeSelection />
                        <small id="data-range-help">
                            Período de tempo das medições.
                        </small>
                    </div>

                    <div className="flex flex-col gap-1 w-fit">
                        <label htmlFor="source">Origem x Destino</label>
                        <div className='flex flex-wrap gap-2'>
                            <MultiSelect id='source' value={selectedSource} onChange={(e) => setSelectedSource(e.value)} options={sourceOptions} optionLabel="name" 
                            placeholder="Escolha a origem" className="w-56 border border-black" />

                            <MultiSelect value={selectedDestination} onChange={(e) => setSelectedDestination(e.value)} options={destinationOptions} optionLabel="name" 
                            placeholder="Escolha o destino" className="w-56 border border-black" />
                        </div>

                        <small id="source-help">
                            Origem e destino das medições.
                        </small>
                    </div>

                    <div className="flex flex-col gap-1 w-fit">
                        <label htmlFor="email">Email</label>
                        <InputText id="email" className='border border-black ps-2' value={email} onChange={(e) => setEmail(e.target.value)} />
                        <small id="email-help">
                            Email para receber o dataset.
                        </small>
                    </div>
                </form>
                <div className='w-full flex justify-end'>
                    <button
                    className="inline-flex items-center gap-2 rounded-md bg-blue-600 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner hover:bg-rnp-blue"
                    onClick={handleAddRequest}
                    >
                    Adicionar Solicitação
                    </button>
                </div>
            </div>
        </Dialog>
  )
}

export default RequestDataModal
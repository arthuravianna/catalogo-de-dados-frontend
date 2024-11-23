import Link from 'next/link';
import React from 'react'
import { PiCubeBold } from 'react-icons/pi'

const RNP_BLUE = "#001EFF";

function SidePanelTitle({subtitle}:{subtitle:string}) {
  return (
    <Link href={"/"} className='flex items-center justify-center gap-2 my-4'>
        <PiCubeBold style={{color: RNP_BLUE}} className='text-5xl' />
        <div className='flex flex-col items-center'>
            <span className='text-xl font-bold'>Catalogo de Dados</span>
            <span className='text-xs font-semibold'>{subtitle.length == 0? "": `(${subtitle})`}</span>
        </div>
    </Link>
  )
}

export default SidePanelTitle
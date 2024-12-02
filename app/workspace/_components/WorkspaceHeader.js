import React, { useContext } from 'react'
import Image from 'next/image'
import { UserButton } from '@clerk/nextjs'
import { Button } from '../../../components/ui/button'
import { createContext } from "react";
import{FileSaveContext}from '../../../_context/FileSaveContext'

function WorkspaceHeader({fileName}) {
  const { fileSave, setFileSave } = useContext(FileSaveContext) || {};
  return (
    <div className='p-4 flex justify-between shadow-md'>
        <Image src={'/logo.svg'} alt='logo' width={140} height={100} />
        <h2 className='font-bold'>{fileName}</h2>
        <div className='flex gap-2 items-center'>
        <Button >Save</Button>
        <UserButton />
        </div>
        
    </div>
    
  )
}

export default WorkspaceHeader
"use client"
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "../../../components/ui/dialog";
import { Input } from '../../../components/ui/input'
import { DialogClose } from "@radix-ui/react-dialog";
import { Button } from "../../../components/ui/button";
import { useAction, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Loader2Icon } from "lucide-react";

import uuid from 'uuid4'
import { useUser } from '@clerk/nextjs';
import axios from 'axios';
import { ingest } from '../../../convex/myActions';
import { toast } from 'sonner';


  

function UploadPdfDialog({children,isMaxFile}) {
    const generateUploadUrl=useMutation(api.fileStorage.generateUploadUrl);
    const addFileEntry=useMutation(api.fileStorage.AddFileEntryToDb);
    const getFileUrl=useMutation(api.fileStorage.getFileUrl);
    const [file,setFile]=useState();
    const embeddDocument=useAction(api.myActions.ingest);
    const [loading,setLoading]=useState(false);
    const{ user}=useUser();
    const [fileName, setFileName] = useState("Untitled fil");
    const [open,setOpen]=useState(false);

    const OnFileSelect=(event)=>{
        setFile(event.target.files[0]);

    }
    const OnUpload=async()=>{
        setLoading(true);
          // Step 1: Get a short-lived upload URL
    const postUrl = await generateUploadUrl();
       // Step 2: POST the file to the URL
       const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file?.type },
        body: file,
      });
      const { storageId } = await result.json();
      console.log('StorageId',storageId);
      const fileId=uuid();
      const fileUrl=await getFileUrl({storageId:storageId})
       // Step 3: Save the newly allocated storage id to the database
    const resp=await addFileEntry({
      fileId:fileId,
      storageId:storageId,
      fileName:fileName??'Untitled fil',
      fileUrl:fileUrl,
      createdBy:user?.primaryEmailAddress?.emailAddress
    })
    console.log(resp);
    //API call to fetch pdf process data
    const ApiResp=await axios.get('/api/pdf-loader?pdfUrl='+fileUrl);
    console.log(ApiResp.data.result);
   await embeddDocument({
      splitText:ApiResp.data.result,
      fileId:fileId
    });

      //console.log(embdeddResult)
      setLoading(false);
      setOpen(false);
      toast('File is getting ready...')
    }
  return (
    <Dialog open={open}>
  <DialogTrigger asChild>
    <Button onClick={()=>setOpen(true)} disabled={isMaxFile} className="w-full">+ Upload PDF File</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Upload Pdf File</DialogTitle>
      <DialogDescription asChild>
        <div className='mt-5'>
                <h2 className='mt-5'>
                    Select a File to Upload
                </h2>
            <div className=' mt-10 gap-2 p-3 rounded-md border'>
               
                <input type='file' accept='application/pdf'  
                onChange={(event)=>OnFileSelect(event)}
                />
            </div>
            <div className='mt-2'>
                <label>
                    File Name *
                </label>
                <Input
  placeholder="File Name"
  value={fileName} // L'état est affiché dans le champ
  onChange={(e) => setFileName(e.target.value)} // L'état est mis à jour avec la saisie
/>

            </div>
        </div>
      </DialogDescription>
    </DialogHeader>
    <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button onClick={OnUpload} disabled={loading}> {
            loading?
            <Loader2Icon className='animate-spin'/>:'Upload'}
          </Button>
        </DialogFooter>
  </DialogContent>
</Dialog>

  )
}

export default UploadPdfDialog
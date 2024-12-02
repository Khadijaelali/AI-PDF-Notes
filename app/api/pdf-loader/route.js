import { NextResponse } from "next/server";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { Loader } from "lucide-react";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

//const pdfUrl="https://elated-lemming-719.convex.cloud/api/storage/535ee411-17ad-487c-9ad5-637fe8b473d0"
export async function GET(req) {
  const reqUrl=req.url;
  const{searchParams}=new URL(reqUrl);
  const pdfUrl=searchParams.get('pdfUrl');
  console.log(pdfUrl);

    //1. Load the PDF file
    const response=await fetch(pdfUrl);
    const data=await response.blob();
    const loader=new WebPDFLoader(data);
    const docs=await loader.load();


    let pdfTextContent='';
    docs.forEach(doc=>{
        pdfTextContent=pdfTextContent+doc.pageContent;
    })
    //2. Split thee text into small texts
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 100,
        chunkOverlap: 20,
      });
      const output=await splitter.createDocuments([pdfTextContent]);
      let splitterList=[];
      output.forEach(doc=>{
        splitterList.push(doc.pageContent);

      })
    return NextResponse.json({result:splitterList})
    
}
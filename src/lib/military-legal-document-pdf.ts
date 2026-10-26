import type {Content,TDocumentDefinitions} from "pdfmake/interfaces";
import type {DocumentResultV1} from "@/lib/document-result-contract";

/** A4 legal-document project: no instruction sheet or other substitute document. */
export async function createMilitaryLegalDocumentPdfBlob(result:DocumentResultV1):Promise<Blob>{
 if(result.resultKind!=="DRAFT"||result.categorySlug!=="voennoe-pravo"||
    result.filingReady!==false||!result.requiresLegalReview||
    !result.documentText.trim()){
   throw new Error("PDF допускается только для содержательного юридического документа, требующего проверки.");
 }
 const [pdfMakeModule,vfsModule]=await Promise.all([
  import("pdfmake/build/pdfmake"),import("pdfmake/build/vfs_fonts")
 ]);
 const pdfMake=pdfMakeModule.default;
 (pdfMake as typeof pdfMake & {addVirtualFileSystem:(files:Record<string,string>)=>void})
   .addVirtualFileSystem(vfsModule.default as unknown as Record<string,string>);
 const body:Content[]=[
  {text:"ПРОЕКТ ЮРИДИЧЕСКОГО ДОКУМЕНТА — ПРОВЕРЬТЕ ПЕРЕД НАПРАВЛЕНИЕМ",style:"warning"},
  {text:result.documentTitle,style:"title"},
  {text:result.documentText,style:"document"}
 ];
 const definition:TDocumentDefinitions={
  pageSize:"A4",pageMargins:[48,55,48,58],
  defaultStyle:{font:"Roboto",fontSize:11,lineHeight:1.4,color:"#18181b"},
  content:body,
  footer:(page,pages)=>({
   margin:[48,10,48,0],
   columns:[
    {text:"Юридическая проверка перед подачей | Версия: "+result.versionId,style:"footer"},
    {text:page+" / "+pages,alignment:"right",style:"footer"}
   ]
  }),
  styles:{
   warning:{fontSize:8.7,bold:true,color:"#9a3412",margin:[0,0,0,12]},
   title:{fontSize:13,bold:true,alignment:"center",margin:[0,0,0,14]},
   document:{fontSize:11,lineHeight:1.4},
   footer:{fontSize:8,color:"#71717a"}
  },
  info:{title:result.documentTitle,subject:"Юридический документ — предварительный проект для проверки"}
 };
 return new Promise<Blob>((resolve,reject)=>{
  try{pdfMake.createPdf(definition).getBlob(resolve)}catch(error){reject(error)}
 });
}

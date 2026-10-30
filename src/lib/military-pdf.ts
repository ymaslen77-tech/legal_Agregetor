import type {Content,TDocumentDefinitions} from "pdfmake/interfaces";
/** Client-side PDF generation. No applicant data leaves the browser. */
export async function createMilitaryPdfBlob(title:string,text:string):Promise<Blob>{
 const [mod,vfs]=await Promise.all([import("pdfmake/build/pdfmake"),import("pdfmake/build/vfs_fonts")]);
 const pdfMake=mod.default;
 (pdfMake as typeof pdfMake & {addVirtualFileSystem:(files:Record<string,string>)=>void}).addVirtualFileSystem(vfs.default as unknown as Record<string,string>);
 const content:Content[]=[
   {text:"ЧЕРНОВИК — НЕ ГОТОВ К ПОДАЧЕ",style:"warning"},
   {text:title,style:"title"},
   {text,style:"body"}
 ];
 const def:TDocumentDefinitions={
   pageSize:"A4",pageMargins:[48,52,48,60],
   defaultStyle:{font:"Roboto",fontSize:10,lineHeight:1.4,color:"#18181b"},
   content,styles:{
     warning:{fontSize:10,bold:true,color:"#92400e",margin:[0,0,0,12]},
     title:{fontSize:16,bold:true,margin:[0,0,0,16]},
     body:{fontSize:10,lineHeight:1.4}
   }
 };
 return new Promise<Blob>((resolve,reject)=>{
   try{pdfMake.createPdf(def).getBlob(resolve);}catch(error){reject(error);}
 });
}

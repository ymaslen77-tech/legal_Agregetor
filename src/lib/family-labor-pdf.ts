import type {Content,TDocumentDefinitions} from "pdfmake/interfaces";
import type {DocumentResultV1} from "@/lib/document-result-contract";

/** Genuine A4 PDF for archived provisional checklists, never a court-ready form. */
export async function createFamilyLaborPdfBlob(result:DocumentResultV1):Promise<Blob>{
  if(result.resultKind!=="CHECKLIST"||result.filingReady!==false||!result.requiresLegalReview){
    throw new Error("Только предварительный чек-лист может быть выгружен без юридической приёмки.");
  }
  const [pdfMakeModule,vfsModule]=await Promise.all([
    import("pdfmake/build/pdfmake"),import("pdfmake/build/vfs_fonts")
  ]);
  const pdfMake=pdfMakeModule.default;
  (pdfMake as typeof pdfMake & {addVirtualFileSystem:(files:Record<string,string>)=>void})
    .addVirtualFileSystem(vfsModule.default as unknown as Record<string,string>);
  const body:Content[]=[
    {text:"ПРЕДВАРИТЕЛЬНЫЙ ЧЕК-ЛИСТ — НЕ ГОТОВ К ПОДАЧЕ",style:"warning"},
    {text:result.documentTitle,style:"title"},
    {text:result.documentText,style:"body"}
  ];
  const definition:TDocumentDefinitions={
    pageSize:"A4",pageMargins:[45,52,45,60],
    defaultStyle:{font:"Roboto",fontSize:10.5,lineHeight:1.4,color:"#18181b"},
    content:body,
    footer:(page,pages)=>({
      margin:[45,10,45,0],
      columns:[
        {text:"Требуется юридическая проверка | Версия: "+result.versionId,style:"footer"},
        {text:page+"/"+pages,alignment:"right",style:"footer"}
      ]
    }),
    styles:{
      warning:{bold:true,color:"#9a3412",fontSize:10,margin:[0,0,0,12]},
      title:{bold:true,fontSize:16,margin:[0,0,0,12]},
      body:{fontSize:10.5,lineHeight:1.45},
      footer:{fontSize:8,color:"#71717a"}
    },
    info:{title:result.documentTitle,subject:"Предварительный юридический чек-лист"}
  };
  return new Promise<Blob>((resolve,reject)=>{
    try{pdfMake.createPdf(definition).getBlob(resolve);}catch(error){reject(error);}
  });
}

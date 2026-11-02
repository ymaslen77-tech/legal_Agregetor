import type { Content, TDocumentDefinitions } from "pdfmake/interfaces";
import type { DocumentResultV1 } from "@/lib/document-result-contract";

/**
 * Neutral PDF adapter for the shared lawyer-review workflow.
 * Only used after the user explicitly opts in to attaching the current draft.
 */
export async function createDocumentReviewPdfBlob(result: DocumentResultV1): Promise<Blob> {
  const [pdfMakeModule, vfsModule] = await Promise.all([
    import("pdfmake/build/pdfmake"), import("pdfmake/build/vfs_fonts")
  ]);
  const pdfMake = pdfMakeModule.default;
  (pdfMake as typeof pdfMake & {addVirtualFileSystem: (files: Record<string,string>) => void})
    .addVirtualFileSystem(vfsModule.default as unknown as Record<string,string>);
  const content: Content[] = [
    {text: result.documentTitle, style:"title"},
    {text: result.requiresLegalReview || !result.filingReady
      ? "ПРОЕКТ — ТРЕБУЕТСЯ ЮРИДИЧЕСКАЯ ПРОВЕРКА. НЕ ГОТОВ К ПОДАЧЕ."
      : "Документ передан на дополнительную проверку по инициативе пользователя.", style:"warning"},
    {text: result.documentText, style:"body"},
    {text: "Версия: " + result.versionId, style:"footer"}
  ];
  const document: TDocumentDefinitions = {
    pageSize:"A4",pageMargins:[48,52,48,60],
    defaultStyle:{font:"Roboto",fontSize:10,lineHeight:1.4,color:"#18181b"},
    content,
    styles:{
      title:{fontSize:16,bold:true,margin:[0,0,0,15]},
      warning:{fontSize:10,bold:true,color:"#92400e",margin:[0,0,0,12]},
      body:{fontSize:10,lineHeight:1.4},
      footer:{fontSize:8,color:"#71717a",margin:[0,18,0,0]}
    }
  };
  return new Promise<Blob>((resolve,reject)=>{
    try { pdfMake.createPdf(document).getBlob(resolve); } catch(error) { reject(error); }
  });
}

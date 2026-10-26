/** Synthetic, no personal data: generate genuine PDF and DOCX for every published military legal document. */
import assert from "node:assert/strict";
import {mkdirSync,writeFileSync} from "node:fs";
import {join} from "node:path";
import {MILITARY_LEGAL_DOCUMENTS} from "@/data/military-legal-documents";
import {createMilitaryLegalDocumentResult} from "@/lib/military-legal-document-generator";
import {createFamilyLaborPdfBlob} from "@/lib/family-labor-pdf";
import {buildGeneratedDocumentDocxBlob} from "@/lib/document-export";
import {validateSavedDocument} from "@/lib/saved-document-validation";
async function main(){
 const rows:Array<{slug:string;kind:string;pdfBytes:number;docxBytes:number;canArchive:boolean}>=[];
 const dir="artifacts/military-legal-files";mkdirSync(dir,{recursive:true});
 const ids={versionId:"11111111-1111-4111-8111-111111111111",createdAt:"2026-10-26T12:00:00.000Z"};
 for(const doc of MILITARY_LEGAL_DOCUMENTS){
  const values:Record<string,string>={};
  for(const key of doc.fields)
   values[key]=key==="birthDate"||key==="date"?"01.10.2026":"Подтвержденные исходные данные для реквизита "+key;
  const result=createMilitaryLegalDocumentResult(doc.slug,values,ids);
  assert.equal(result.documentTitle,doc.title);
  assert.equal(result.resultKind,"DRAFT");
  assert.equal(result.filingReady,false);
  assert.equal(result.requiresLegalReview,true);
  assert.equal(result.legalRegistryReviewedAt,null);
  assert.ok(result.documentText.includes("Подпись:"));
  assert.ok(result.documentText.includes(doc.request));
  assert.ok(result.documentText.length<40000);
  assert.ok(validateSavedDocument(result),doc.slug+" should be accepted by document cabinet");
  const [pdf,docx]=await Promise.all([
   createFamilyLaborPdfBlob(result),
   buildGeneratedDocumentDocxBlob({title:result.documentTitle,content:result.documentText,
    fileName:doc.slug+"-"+ids.versionId+".docx"})
  ]);
  const pdfData=Buffer.from(await pdf.arrayBuffer()),docxData=Buffer.from(await docx.arrayBuffer());
  assert.equal(pdfData.subarray(0,5).toString("ascii"),"%PDF-",doc.slug);
  assert.equal(docxData.subarray(0,2).toString("ascii"),"PK",doc.slug);
  assert.ok(pdfData.length>1200,doc.slug);
  assert.ok(docxData.length>1200,doc.slug);
  writeFileSync(join(dir,doc.slug+".pdf"),pdfData);
  writeFileSync(join(dir,doc.slug+".docx"),docxData);
  rows.push({slug:doc.slug,kind:doc.kind,pdfBytes:pdfData.length,docxBytes:docxData.length,canArchive:true});
 }
 assert.equal(rows.length,23);
 writeFileSync(join(dir,"manifest.json"),JSON.stringify({scope:"23_REGISTERED_MILITARY_LEGAL_DOCUMENTS",legalFilingApproval:false,rows,passed:23},null,2)+"\n");
 console.log("Military legal documents: 23/23 PDF+DOCX generated and structurally verified; all remain legal-review drafts");
}
void main().catch(error=>{console.error(error);process.exitCode=1;});

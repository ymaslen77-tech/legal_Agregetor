/** Binary export audit for all 17 military preliminary documents, synthetic data only. */
import assert from "node:assert/strict";
import {mkdirSync,writeFileSync} from "node:fs";
import {join} from "node:path";
import {MILITARY_ROUTES} from "@/data/military-route-plans";
import {createMilitaryDocumentResult} from "@/lib/military-document-generator";
import {createFamilyLaborPdfBlob} from "@/lib/family-labor-pdf";
import {buildGeneratedDocumentDocxBlob} from "@/lib/document-export";
import {validateSavedDocument} from "@/lib/saved-document-validation";
async function main(){
 const rows:Array<{scenario:string;resultKind:string;pdfBytes:number;docxBytes:number;versionId:string;filingReady:false}>=[];
 const dir="artifacts/military-file-audit";mkdirSync(dir,{recursive:true});
 const ids={versionId:"11111111-1111-4111-8111-111111111111",createdAt:"2026-10-21T00:00:00.000Z"};
 for(const route of MILITARY_ROUTES){
  for(const scenario of route.scenarios){
   if(scenario.kind==="URGENT_INSTRUCTION")continue;
   const values:Record<string,string>={};
   for(const field of route.fields){
    values[field.key]=field.key==="urgency"?"нет":field.values?
      field.values.find(v=>v!=="не знаю")??field.values[0]:"Подтверждение обстоятельств для проверки";
   }
   values.role="военнослужащий";
   if(route.id==="mobilization-draft"){values.role="призывник";values.regime="доподготовка к призыву";}
   const result=createMilitaryDocumentResult(route,scenario,values,ids);
   assert.equal(result.filingReady,false);
   assert.equal(result.requiresLegalReview,true);
   assert.equal(result.legalRegistryReviewedAt,null);
   assert.ok(result.documentText.includes("НЕ ГОТОВ К ПОДАЧЕ"));
   assert.ok(result.documentText.includes("С учётом изложенного прошу:"));
   assert.ok(result.documentText.includes("Правовые основания"));
   assert.ok(result.documentText.includes("Цель обращения:"));
   assert.ok(result.documentText.includes("Дата: [указать]"));
   assert.ok(!result.documentText.includes("0 из 11"));
   assert.ok(result.documentText.length<30000,"Draft is excessively long");
   // Must remain outside the public catalog until expert legal review.
   assert.equal(validateSavedDocument(result),null,"Cannot persist draft under an unregistered route");
   const [pdf,docx]=await Promise.all([
    createFamilyLaborPdfBlob(result),
    buildGeneratedDocumentDocxBlob({title:result.documentTitle,content:result.documentText,
      fileName:result.documentSlug+"-"+ids.versionId+".docx"})
   ]);
   const pdfBuffer=Buffer.from(await pdf.arrayBuffer()),docxBuffer=Buffer.from(await docx.arrayBuffer());
   assert.equal(pdfBuffer.subarray(0,5).toString("ascii"),"%PDF-");
   assert.equal(docxBuffer.subarray(0,2).toString("ascii"),"PK");
   assert.ok(pdfBuffer.byteLength>1200);
   assert.ok(docxBuffer.byteLength>1200);
   const prefix=route.id+"-"+scenario.key;
   writeFileSync(join(dir,prefix+".pdf"),pdfBuffer);
   writeFileSync(join(dir,prefix+".docx"),docxBuffer);
   rows.push({scenario:prefix,resultKind:result.resultKind,pdfBytes:pdfBuffer.length,
     docxBytes:docxBuffer.length,versionId:result.versionId,filingReady:false});
  }
 }
 assert.equal(rows.length,17);
 assert.equal(rows.filter(x=>x.resultKind==="DRAFT").length,17);
 const report={scope:"BINARY_FILES_AND_VERSION_ONLY",legallyApproved:0,rows,passed:rows.length};
 writeFileSync(join(dir,"manifest.json"),JSON.stringify(report,null,2)+"\n");
 console.log("Military export: 17/17 synthetic PDF and DOCX, filingReady=false, not yet cabinet approved");
}
void main().catch(error=>{console.error(error);process.exitCode=1;});

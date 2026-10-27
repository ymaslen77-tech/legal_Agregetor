/** Mandatory binary audit of all 17 NEW named military legal documents.
 * Synthetic persons and values only. Verifies file integrity, not legal approval.
 */
import assert from "node:assert/strict";
import {mkdirSync,writeFileSync} from "node:fs";
import {join} from "node:path";
import {MILITARY_DOCUMENT_BLUEPRINTS} from "@/data/military-document-blueprints";
import {getMilitaryDocumentFields,composeMilitaryDocument} from "@/lib/military-document-composer";
import {documentResultSchema} from "@/lib/document-result-contract";
import {createMilitaryLegalDocumentPdfBlob} from "@/lib/military-legal-document-pdf";
import {buildGeneratedDocumentDocxBlob} from "@/lib/document-export";
const outDir="artifacts/military-official-documents";
const versionId="11111111-1111-4111-8111-111111111111";
const timestamp="2026-10-27T04:31:00.000Z";
async function main(){
 mkdirSync(outDir,{recursive:true});
 const rows:{scenario:string;slug:string;pdfBytes:number;docxBytes:number;filingReady:false}[]=[];
 for(const item of MILITARY_DOCUMENT_BLUEPRINTS){
  const answers=Object.fromEntries(getMilitaryDocumentFields(item.scenarioKey).map(f=>[
   f.key,
   f.options?.[0]??(f.key==="date"?"27.10.2026":
    f.key==="applicantName"?"Иванов Иван Иванович":
    f.key==="applicantBirth"?"01.01.1985, город Москва":
    "Подтверждённое тестовое обстоятельство по документам")
  ]));
  const result=composeMilitaryDocument(item.scenarioKey,answers);
  assert.equal(result.missing.length,0,item.scenarioKey+" required facts");
  const document=result.document;
  assert.ok(document,item.scenarioKey+" generated legal document");
  assert.equal(document.title,item.title);
  assert.ok(document.text.includes("Подпись:"));
  assert.match(document.text,/ПРОШУ|Прошу/);
  assert.ok(!/анкета|опросник|чек-лист/iu.test(document.text),item.scenarioKey);
  assert.equal(document.filingReady,false);
  const envelope=documentResultSchema.parse({
   contractVersion:"DOCUMENT_RESULT_V1",versionId,createdAt:timestamp,
   categorySlug:"voennoe-pravo",routeSlug:"military-documents",
   scenarioKey:item.scenarioKey,documentSlug:item.slug,resultKind:"DRAFT",
   source:"DETERMINISTIC",documentTitle:document.title,documentText:document.text,
   usedRuleIds:[],placeholders:[],legalRegistryReviewedAt:null,
   generatorVersion:"military-document-1",filingReady:false,requiresLegalReview:true
  });
  const [pdf,docx]=await Promise.all([
   createMilitaryLegalDocumentPdfBlob(envelope),
   buildGeneratedDocumentDocxBlob({
    title:document.title,content:document.text,fileName:item.slug+".docx"
   })
  ]);
  const p=Buffer.from(await pdf.arrayBuffer());
  const d=Buffer.from(await docx.arrayBuffer());
  assert.equal(p.subarray(0,5).toString("ascii"),"%PDF-",item.scenarioKey);
  assert.equal(d.subarray(0,2).toString("ascii"),"PK",item.scenarioKey);
  assert.ok(p.length>2000,item.scenarioKey+" empty PDF");
  assert.ok(d.length>2000,item.scenarioKey+" empty DOCX");
  writeFileSync(join(outDir,item.slug+".pdf"),p);
  writeFileSync(join(outDir,item.slug+".docx"),d);
  rows.push({scenario:item.scenarioKey,slug:item.slug,pdfBytes:p.length,docxBytes:d.length,filingReady:false});
 }
 assert.equal(rows.length,17);
 assert.equal(new Set(rows.map(row=>row.slug)).size,17);
 writeFileSync(join(outDir,"manifest.json"),JSON.stringify({
  generated:rows.length,formatChecksPassed:34,legalSignOff:"NOT_GRANTED",
  allProjectsRequireIndividualLegalReview:true,rows
 },null,2)+"\n");
 console.log("17/17 military legal documents, 17 PDFs and 17 DOCX: BINARY PASS; legal filing review not granted");
}
main().catch(error=>{console.error(error);process.exitCode=1;});

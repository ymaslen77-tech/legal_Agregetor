import assert from "node:assert/strict";
import { MILITARY_TOPICS } from "@/data/military-catalog";
import { createMilitaryDraftPrototype } from "@/data/military-document-core";
import {
  validateMilitaryDraftExport,
  militaryDraftExportText,
  militaryDraftExportFileName,
  createMilitaryDraftDocxBlob,
  createMilitaryDraftPdfBlob
} from "@/lib/military-document-export";

const topic=MILITARY_TOPICS.find(x=>x.slug==="prizyv")!;
const situation=topic.situations[4];
const sample=createMilitaryDraftPrototype({
 categorySlug:topic.slug,situationSlug:situation.slug,
 versionId:"550e8400-e29b-41d4-a716-446655440000",
 createdAt:"2026-10-29T10:00:00.000Z",
 values:{
  applicant:"Тестовый заявитель",
  recipient:"Призывной комиссии",
  facts:"Прошу учесть сведения о заседании призывной комиссии и направить выписку из решения.",
  attachments:"Копия поданного ранее обращения"
 }
}).documentResult;
assert.equal(validateMilitaryDraftExport(sample).documentSlug,sample.documentSlug);
const body=militaryDraftExportText(sample);
assert(body.startsWith("ПРОЕКТ — НЕ ГОТОВ К ПОДАЧЕ"));
assert(body.includes(sample.documentText));
assert(body.includes("Юридическая сверка реестра: не проведена"));
assert.equal(militaryDraftExportFileName(sample,"pdf").endsWith(".pdf"),true);
assert.equal(militaryDraftExportFileName(sample,"docx").endsWith(".docx"),true);
assert.throws(()=>validateMilitaryDraftExport({...sample,categorySlug:"semya-i-deti"}));
assert.throws(()=>validateMilitaryDraftExport({...sample,documentSlug:"not-registered"}));
assert.throws(()=>validateMilitaryDraftExport({...sample,source:"USER_EDITED"}));
assert.throws(()=>validateMilitaryDraftExport({...sample,legalRegistryReviewedAt:"2026-10-29"}));
assert.throws(()=>validateMilitaryDraftExport({...sample,usedRuleIds:["user-forged"]}));
assert.throws(()=>validateMilitaryDraftExport({...sample,documentText:"Подать без проверки"}));
assert.throws(()=>validateMilitaryDraftExport({...sample,requiresLegalReview:false}));
assert.throws(()=>validateMilitaryDraftExport({...sample,filingReady:true} as unknown as Parameters<typeof validateMilitaryDraftExport>[0]));
// Real DOCX binary is created from the shared family-compatible document renderer.
// No network, saved files, account data or public endpoints involved.
(async()=>{
 const blob=await createMilitaryDraftDocxBlob(sample);
 const bytes=new Uint8Array(await blob.arrayBuffer());
 assert(blob.size>500);
 assert.equal(bytes[0],0x50);
 assert.equal(bytes[1],0x4b);
 const pdf=await createMilitaryDraftPdfBlob(sample);
 const pdfBytes=new Uint8Array(await pdf.arrayBuffer());
 assert(pdf.size>1000);
 assert.equal(new TextDecoder().decode(pdfBytes.slice(0,5)),"%PDF-");
 console.log(JSON.stringify({stage4DocxExport:true,stage4PdfExport:true,docxBytes:blob.size,pdfBytes:pdf.size,legalApproval:false,filingReady:false}));
})().catch(error=>{console.error(error);process.exitCode=1;});

import assert from "node:assert/strict";
import { MILITARY_TOPICS } from "@/data/military-catalog";
import { createMilitaryDraftPrototype, reviseMilitaryDraftPrototype, getMilitaryDraftPlan } from "@/data/military-document-core";
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
const edited=reviseMilitaryDraftPrototype({documentResult:sample,formData:{}},
  "Уточнённый проект обращения. Прошу проверить сведения по делу и предоставить выписку из протокола заседания призывной комиссии.",{
    versionId:"550e8400-e29b-41d4-a716-446655440020",
    createdAt:"2026-10-29T12:00:00.000Z"
  });
assert.equal(validateMilitaryDraftExport(edited.documentResult).source,"USER_EDITED");
assert(militaryDraftExportText(edited.documentResult).includes("Уточнённый проект обращения"));
assert.throws(()=>validateMilitaryDraftExport({...sample,legalRegistryReviewedAt:"2026-10-29"}));
assert.throws(()=>validateMilitaryDraftExport({...sample,usedRuleIds:["user-forged"]}));
assert.throws(()=>validateMilitaryDraftExport({...sample,documentText:"Подать без проверки"}));
assert.throws(()=>validateMilitaryDraftExport({...sample,requiresLegalReview:false}));
assert.throws(()=>validateMilitaryDraftExport({...sample,filingReady:true} as unknown as Parameters<typeof validateMilitaryDraftExport>[0]));
// Judicial prototypes must preserve strict pending-review flags and all
// mandatory court/defendant particulars in the actual exported document.
const courtTopic=MILITARY_TOPICS.find(x=>x.slug==="sudebnaya-zashchita")!;
const courtSituation=courtTopic.situations[1];
const courtPlan=getMilitaryDraftPlan(courtTopic.slug,courtSituation.slug)!;
const courtValues=Object.fromEntries(courtPlan.requiredInputs.map(f=>[
  f.key,"Проверенное тестовое значение: "+f.label+" — сведения из материалов дела"
])) as Record<string,string>;
const courtResult=createMilitaryDraftPrototype({
  categorySlug:courtTopic.slug,situationSlug:courtSituation.slug,
  values:courtValues,
  versionId:"550e8400-e29b-41d4-a716-446655440055",
  createdAt:"2026-10-29T14:00:00.000Z"
}).documentResult;
assert.equal(validateMilitaryDraftExport(courtResult).filingReady,false);
assert(courtResult.documentText.includes("ПРЕДВАРИТЕЛЬНАЯ ПОДГОТОВКА"));
assert(courtResult.documentText.includes("Компетентный суд"));
assert(courtResult.documentText.includes("Ответчик"));
assert.equal(courtResult.legalRegistryReviewedAt,null);
const courtExport=militaryDraftExportText(courtResult);
assert(courtExport.startsWith("ПРОЕКТ — НЕ ГОТОВ К ПОДАЧЕ"));
// Real DOCX binary is created from the shared family-compatible document renderer.
// No network, saved files, account data or public endpoints involved.
(async()=>{
 const blob=await createMilitaryDraftDocxBlob(sample);
 const bytes=new Uint8Array(await blob.arrayBuffer());
 assert(blob.size>500);
 assert.equal(bytes[0],0x50);
 assert.equal(bytes[1],0x4b);
 const docxCourt=await createMilitaryDraftDocxBlob(courtResult);
 assert(docxCourt.size>500);
 const courtDocxBytes=new Uint8Array(await docxCourt.arrayBuffer());
 assert.equal(courtDocxBytes[0],0x50);
 assert.equal(courtDocxBytes[1],0x4b);
 const pdf=await createMilitaryDraftPdfBlob(sample);
 const pdfBytes=new Uint8Array(await pdf.arrayBuffer());
 assert(pdf.size>1000);
 assert.equal(new TextDecoder().decode(pdfBytes.slice(0,5)),"%PDF-");
 const pdfCourt=await createMilitaryDraftPdfBlob(courtResult);
 const pdfCourtBytes=new Uint8Array(await pdfCourt.arrayBuffer());
 assert(pdfCourt.size>1000);
 assert.equal(new TextDecoder().decode(pdfCourtBytes.slice(0,5)),"%PDF-");
 console.log(JSON.stringify({stage4DocxExport:true,stage4PdfExport:true,docxBytes:blob.size,pdfBytes:pdf.size,legalApproval:false,filingReady:false}));
})().catch(error=>{console.error(error);process.exitCode=1;});

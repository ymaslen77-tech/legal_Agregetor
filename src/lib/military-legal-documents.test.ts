import assert from "node:assert/strict";
import {MILITARY_ROUTES} from "@/data/military-route-plans";
import {MILITARY_LEGAL_DOCUMENTS,MILITARY_NAVIGATOR_DOCUMENTS,MILITARY_LEGAL_FIELDS,getMilitaryDocumentsForScenario} from "@/data/military-legal-documents";
import {createMilitaryLegalDocumentResult,validateMilitaryLegalDocument} from "@/lib/military-legal-document-generator";
import {documentResultSchema} from "@/lib/document-result-contract";
import {getNavigatorDocument} from "@/data/documents";

const id="11111111-1111-4111-8111-111111111111";
const time="2026-10-26T00:00:00.000Z";
assert.equal(MILITARY_ROUTES.length,6);
assert.equal(MILITARY_LEGAL_DOCUMENTS.length,23);
assert.equal(MILITARY_NAVIGATOR_DOCUMENTS.length,23);
assert.equal(new Set(MILITARY_LEGAL_DOCUMENTS.map(doc=>doc.slug)).size,23);
const groups=MILITARY_ROUTES.flatMap(r=>r.scenarios.filter(s=>s.kind!=="URGENT_INSTRUCTION").map(s=>s.key));
assert.equal(groups.length,17);
for(const key of groups){
 assert.ok(getMilitaryDocumentsForScenario(key).length>=1,"Every legal route needs a real document "+key);
}
for(const doc of MILITARY_LEGAL_DOCUMENTS){
 assert.ok(doc.title.startsWith(doc.formLabel),"Every title must name the real legal document: "+doc.slug);
 assert.ok(doc.fields.length>=5);
 assert.ok(doc.fields.every(key=>MILITARY_LEGAL_FIELDS[key]&&MILITARY_LEGAL_FIELDS[key].hint.length>20));
 assert.ok(doc.sourceIds.length>=1,"Legal citations must be specific "+doc.slug);
 assert.ok(doc.exampleUrl.startsWith("https://"),"Published sample source required: "+doc.slug);
 assert.ok(!/checklist|check-list|questionnaire|anketa/i.test(doc.slug+" "+doc.title));
 const seo=getNavigatorDocument(doc.slug);
 assert.ok(seo,"Military document must be registered with global catalog "+doc.slug);
 assert.ok(seo?.seoTitle?.includes("скачать PDF"),"Document-specific SEO title "+doc.slug);
 assert.ok(seo?.seoDescription&&seo.seoDescription.length>=100,"Document-specific meta description");
 assert.ok(!seo?.seoDescription?.includes("ПРОЕКТ ДОКУМЕНТА"));
 const answers=Object.fromEntries(doc.fields.map(key=>[key,["birthDate","date"].includes(key)?"01.10.2026":"Подтверждённый реквизит или правовое обстоятельство "+key]));
 assert.equal(validateMilitaryLegalDocument(doc,answers).complete,true,doc.slug);
 const result=createMilitaryLegalDocumentResult(doc.slug,answers,{versionId:id,createdAt:time});
 documentResultSchema.parse(result);
 assert.equal(result.resultKind,"DRAFT");
 assert.equal(result.documentSlug,doc.slug);
 assert.equal(result.documentTitle,doc.title);
 assert.equal(result.filingReady,false);
 assert.equal(result.requiresLegalReview,true);
 assert.ok(result.documentText.includes("ПРОШУ"),doc.slug);
 assert.ok(result.documentText.includes("Приложения"),doc.slug);
 assert.ok(result.documentText.includes("Подпись"),doc.slug);
 if(doc.kind==="court"){
  assert.ok(result.documentText.includes("Административный истец:"));
  assert.ok(result.documentText.includes("Административный ответчик:"));
  assert.ok(result.documentText.includes("статьям 125 и 126 КАС РФ"));
  assert.ok(result.documentText.includes("ПРОШУ СУД:"));
 }else{
  assert.ok(result.documentText.includes("Кому:"));
  assert.ok(result.documentText.includes("От:"));
 }
 const missing=validateMilitaryLegalDocument(doc,{});
 assert.equal(missing.complete,false);
 assert.equal(missing.missing.length,doc.fields.length);
 assert.throws(()=>createMilitaryLegalDocumentResult(doc.slug,{},{versionId:id,createdAt:time}));
}
assert.ok(MILITARY_LEGAL_DOCUMENTS.some(doc=>doc.kind==="court"));
assert.ok(getMilitaryDocumentsForScenario("deferment").some(doc=>doc.slug.includes("mobilizatsii")));
assert.ok(getMilitaryDocumentsForScenario("pay-breakdown").some(doc=>doc.kind==="court"));
console.log("23 military legal documents: statutes, exemplars, SEO, court requisites and drafts PASS");

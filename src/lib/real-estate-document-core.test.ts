import assert from "node:assert/strict";
import { REAL_ESTATE_GROUPS } from "@/data/real-estate-route-plan";
import { getRealEstateIntakeSpec } from "@/lib/real-estate-intake";
import {
  REAL_ESTATE_GENERATOR_VERSION, createRealEstateDraftPrototype,
  getRealEstateDocumentPlan, listRealEstateDocumentPlans, reviseRealEstateDraft,
  isRealEstateDraftResult, addRealEstateDraftVersion
} from "@/lib/real-estate-document-core";
import { realEstateFileName, validateRealEstateExport } from "./real-estate-document-export";

const plans = listRealEstateDocumentPlans();
assert.equal(plans.length, 60);
assert.equal(new Set(plans.map(p=>p.documentSlug)).size, 60);
const seenKinds = new Set<string>();
let checked=0, versionsVerified=false;
for (const group of REAL_ESTATE_GROUPS) for (const s of group.situations) {
  const key = group.id+"/"+s.id;
  const spec=getRealEstateIntakeSpec(group.id,s.id);
  const plan=getRealEstateDocumentPlan(group.id,s.id);
  assert.ok(spec && plan,key);
  const answers:Record<string,string>={};
  for(const field of spec.fields){
    answers[field.key]=field.kind==="choice"?field.choices![0]:
      field.kind==="date"?"2026-11-19":
        "Проверочные обстоятельства без персональных данных, подготовленные для тестов.";
  }
  const original=createRealEstateDraftPrototype({
    groupId:group.id,situationId:s.id,values:answers,
    versionId:"00000000-0000-4000-8000-000000000001",
    createdAt:"2026-11-20T16:00:00.000Z"
  });
  const out=original.documentResult;
  assert.equal(out.documentTitle,plan.documentTitle,key);
  assert.equal(out.documentSlug,plan.documentSlug,key);
  assert.equal(out.generatorVersion,REAL_ESTATE_GENERATOR_VERSION,key);
  assert.equal(out.categorySlug,"nedvizhimost-i-zemlya",key);
  assert.equal(out.filingReady,false,key);
  assert.equal(out.requiresLegalReview,true,key);
  assert.equal(out.legalRegistryReviewedAt,null,key);
  assert.deepEqual(out.usedRuleIds,[],key);
  assert.ok(isRealEstateDraftResult(out),key);
  assert.ok(out.documentText.includes(s.title),key);
  assert.ok(out.documentText.includes(answers.caseDetails),key);
  assert.ok(out.documentText.includes(answers.goal),key);
  for(const field of spec.fields.filter(field=>!["role","propertyType","stage","summary","eventDate","documents","goal","caseDetails"].includes(field.key))){
    if(answers[field.key]) assert.ok(out.documentText.includes(field.label+": "+answers[field.key]),key+" "+field.key);
  }
  assert.ok(out.documentText.includes("не") || out.documentText.includes("НЕ"),key);
  assert.equal(validateRealEstateExport(out),out,key);
  assert.ok(realEstateFileName(out,"pdf").startsWith("proekt-"),key);
  assert.equal(out.resultKind,plan.resultKind,key);
  seenKinds.add(out.resultKind);
  assert.throws(()=>createRealEstateDraftPrototype({groupId:group.id,situationId:s.id,values:{}}),/обязательные сведения/);
  const forbidden={...out,filingReady:true};
  assert.equal(isRealEstateDraftResult(forbidden),false,key);
  const firstLine=out.documentText.split("\n")[0];
  const falseReady={...out,documentText:out.documentText.replace(firstLine,"ПРОЕКТ — ГОТОВ К ПОДАЧЕ")};
  assert.equal(isRealEstateDraftResult(falseReady),false,key);
  assert.throws(()=>reviseRealEstateDraft(original,falseReady.documentText),/Сохраните предупреждение/,key);
  assert.throws(()=>validateRealEstateExport(forbidden as typeof out),/Нельзя экспортировать/);
  if(!versionsVerified){
    const altered=reviseRealEstateDraft(original,out.documentText+"\n\nПроверочная редакторская пометка.",{
      versionId:"00000000-0000-4000-8000-000000000002",
      createdAt:"2026-11-20T17:00:00.000Z"
    });
    assert.equal(out.source,"DETERMINISTIC");
    assert.equal(altered.documentResult.source,"USER_EDITED");
    assert.notEqual(out.versionId,altered.documentResult.versionId);
    assert.equal(original.documentResult.documentText,out.documentText);
    assert.ok(altered.documentResult.documentText.endsWith("Проверочная редакторская пометка."));
    assert.equal(altered.documentResult.filingReady,false);
    assert.ok(isRealEstateDraftResult(altered.documentResult));
    assert.throws(()=>reviseRealEstateDraft(original,""),/Сохраните предупреждение/);
    const history=addRealEstateDraftVersion(
      addRealEstateDraftVersion([],original),altered
    );
    assert.equal(history.length,2);
    assert.equal(history[0].documentResult.versionId,altered.documentResult.versionId);
    assert.equal(history[1].documentResult.versionId,original.documentResult.versionId);
    versionsVerified=true;
  }
  checked++;
}
const saleSpec=getRealEstateIntakeSpec("shared-ownership","share-sale");
assert.ok(saleSpec);
const saleValues:Record<string,string>={};
for(const field of saleSpec.fields)if(field.required){
  saleValues[field.key]=field.kind==="choice"?field.choices![0]:"Обезличенное описание обстоятельств сделки для тестового проекта";
}
saleValues.transactionKind="публичные торги";
saleValues.specialLandStatus="земля сельскохозяйственного назначения";
saleValues.shareNotice="не знаю";
const auctionDraft=createRealEstateDraftPrototype({
  groupId:"shared-ownership",situationId:"share-sale",values:saleValues,
  versionId:"00000000-0000-4000-8000-000000000003",
  createdAt:"2026-11-20T17:15:00.000Z"
}).documentResult;
assert.match(auctionDraft.documentText,/Продажа с публичных торгов/);
assert.match(auctionDraft.documentText,/земля сельскохозяйственного назначения/);
assert.match(auctionDraft.documentText,/публичные торги/);
assert.equal(auctionDraft.filingReady,false);
assert.equal(checked,60);
assert.deepEqual([...seenKinds].sort(),["CHECKLIST","DRAFT","LEGAL_REVIEW_ONLY","PREPARED_DATA"]);
assert.equal(getRealEstateDocumentPlan("invalid","invalid"),null);
assert.throws(()=>createRealEstateDraftPrototype({groupId:"invalid",situationId:"invalid",values:{}}),/Неизвестная ситуация/);
console.log("REAL_ESTATE_DRAFT_PASS: 60 individually titled draft-only results, immutable edits, zero legal approvals, guarded PDF/DOCX exports");

const suspensionSpec=getRealEstateIntakeSpec("ownership-register","suspension-registration");assert.ok(suspensionSpec);
const appealAnswers:Record<string,string>={};
for(const field of suspensionSpec.fields)if(field.required)appealAnswers[field.key]=field.kind==="choice"?field.choices![0]:"Обезличенные тестовые сведения";
const appealDraft=(date:string)=>createRealEstateDraftPrototype({groupId:"ownership-register",situationId:"suspension-registration",values:{...appealAnswers,registrationDecisionDate:date,suspensionAppealStage:"обжаловано в суд"}}).documentResult;
assert.match(appealDraft("2026-11-20").documentText,/15 рабочих дней/);
assert.match(appealDraft("2026-11-20").documentText,/Судебное обжалование препятствует/);
assert.doesNotMatch(appealDraft("2025-12-31").documentText,/15 рабочих дней/);
assert.equal(appealDraft("2026-11-20").filingReady,false);

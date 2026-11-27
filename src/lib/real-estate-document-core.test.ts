import assert from "node:assert/strict";
import { REAL_ESTATE_GROUPS } from "@/data/real-estate-route-plan";
import { getRealEstateFormGuidance,renderRealEstateFormPreparation } from "@/data/real-estate-form-guidance";
import { REAL_ESTATE_PREPARED_GUIDANCE,renderPreparedRealEstateGuidance } from "@/data/real-estate-prepared-guidance";
import { getReviewedRealEstateGuidance,REAL_ESTATE_REVIEWED_GUIDANCE } from "@/data/real-estate-reviewed-guidance";
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
  const guidance=getReviewedRealEstateGuidance(group.id,s.id);
  assert.equal(out.legalRegistryReviewedAt,guidance?.asOf??null,key);
  assert.deepEqual(out.usedRuleIds,guidance?[guidance.id]:[],key);
  if(guidance){assert.ok(out.documentText.includes(guidance.statement),key);assert.match(out.documentText,/Правовая оценка и дальнейшие действия/);assert.doesNotMatch(out.documentText,/Каждый материальный правовой вывод подтвердить/);}
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

for(const scenario of ["seller-no-transfer","buyer-payment-delay"]){
  const spec=getRealEstateIntakeSpec("property-transactions",scenario);assert.ok(spec);
  const values:Record<string,string>={};
  for(const field of spec.fields)if(field.required)values[field.key]=field.kind==="choice"?field.choices![0]:"Тестовое описание обстоятельств и подтверждающих документов";
  Object.assign(values,{role:scenario==="seller-no-transfer"?"покупатель":"продавец",saleContract:"договор от 01.10.2026",saleObject:"условный объект",saleDueDate:"2026-10-15",saleBreachConfirmed:"да",handoverAct:"нет",handoverPossession:"нет",paymentEvidence:"есть документы",paymentTerms:"единовременно",saleTransferred:"да",saleDebt:"125000,50"});
  const generate=(overrides:Record<string,string>={})=>createRealEstateDraftPrototype({groupId:"property-transactions",situationId:scenario,values:{...values,...overrides}}).documentResult;
  const result=generate();
  assert.match(result.documentText,/ПРЕТЕНЗИЯ о/);
  assert.equal(result.legalRegistryReviewedAt,"2026-11-27");
  assert.deepEqual(result.usedRuleIds,[scenario==="seller-no-transfer"?"sale-transfer-556-1":"sale-payment-486-3"]);
  assert.equal(validateRealEstateExport(result),result);
  assert.equal(isRealEstateDraftResult({...result,usedRuleIds:["invented-law"]}),false);
  assert.equal(isRealEstateDraftResult({...result,source:"USER_EDITED"}),false);
  assert.match(result.documentText,scenario==="seller-no-transfer"?/статьи 556 ГК РФ/:/статьи 486 ГК РФ/);
  assert.match(result.documentText,/договор от 01.10.2026/);
  assert.match(result.documentText,/Кому:|От кого:/);
  assert.match(result.documentText,/Приложения:/);
  assert.match(result.documentText,/Подпись:/);
  assert.doesNotMatch(result.documentText,/ИЗЛОЖЕНИЕ ОБСТОЯТЕЛЬСТВ|ДО ПОДАЧИ НЕОБХОДИМО|Предварительный результат|Вопросы для проверки/);
  if(scenario==="buyer-payment-delay")assert.match(result.documentText,/125000,50 руб\./);
  assert.doesNotMatch(generate({saleBreachConfirmed:"нет или не знаю"}).documentText,/ПРЕТЕНЗИЯ о/);
  assert.doesNotMatch(generate({role:"не знаю"}).documentText,/ПРЕТЕНЗИЯ о/);
  assert.doesNotMatch(generate({saleDueDate:"2099-12-31"}).documentText,/ПРЕТЕНЗИЯ о/);
  assert.equal(result.filingReady,false);
  assert.ok(isRealEstateDraftResult(result));
}

const defectsSpec=getRealEstateIntakeSpec("newbuild-ddu","quality-defects");assert.ok(defectsSpec);
const defects:Record<string,string>={};
for(const field of defectsSpec.fields)if(field.required)defects[field.key]=field.kind==="choice"?field.choices![0]:"Синтетическое описание обстоятельств";
Object.assign(defects,{role:"дольщик",defectStage:"после передачи",defectEvidence:"акт или письменное заключение",defectContract:"ДДУ от 01.02.2026",defectObject:"условная квартира",defectDeveloper:"ООО Тест",defectApplicant:"Тестовый заявитель",defectReplyAddress:"Условный адрес",defectTransferDate:"2026-09-01",defectFoundDate:"2026-10-01",defectList:"Протечка оконного блока",defectBasis:"Несоответствие условиям ДДУ о качестве",defectProof:"Акт осмотра",defectWarranty:"да",defectContractRemedy:"да",defectAttribution:"да",defectRemedy:"безвозмездное устранение"});
const defectResult=(changes:Record<string,string>={})=>createRealEstateDraftPrototype({groupId:"newbuild-ddu",situationId:"quality-defects",values:{...defects,...changes},createdAt:"2026-11-27T12:00:00.000Z"}).documentResult;
const defectClaim=defectResult();
assert.match(defectClaim.documentText,/ПРЕТЕНЗИЯ об устранении недостатков/);
assert.match(defectClaim.documentText,/статьи 7 Федерального закона/);
assert.match(defectClaim.documentText,/Протечка оконного блока/);
assert.match(defectClaim.documentText,/ООО Тест/);
assert.deepEqual(defectClaim.usedRuleIds,["ddu-defect-remedy-7-2-6"]);
assert.equal(defectClaim.filingReady,false);
assert.ok(isRealEstateDraftResult(defectClaim));
assert.doesNotMatch(defectClaim.documentText,/Вопросы для проверки|Примечания к предварительному проекту|штраф|неустойк/i);
for(const changes of ([{defectWarranty:"нет или не знаю"},{defectContractRemedy:"нет или не знаю"},{defectAttribution:"нет или не знаю"},{defectRemedy:"уменьшение цены"},{defectTransferDate:"2025-12-01"},{defectFoundDate:"2026-08-01"},{defectFoundDate:"2027-01-01"},{defectStage:"до подписания акта"}] as Record<string,string>[]))assert.deepEqual(defectResult(changes).usedRuleIds,[]);

assert.equal(REAL_ESTATE_REVIEWED_GUIDANCE.length,10);
for(const rule of REAL_ESTATE_REVIEWED_GUIDANCE)assert.ok(new Set(rule.sources.map(u=>new URL(u).hostname)).size>=3);
const compensationSpec=getRealEstateIntakeSpec("shared-ownership","compensation-share");assert.ok(compensationSpec);
const compensationValues:Record<string,string>={};
for(const field of compensationSpec.fields)if(field.required)compensationValues[field.key]=field.kind==="choice"?field.choices![0]:"Синтетические обстоятельства";
const compensation=(kind:string,consent:string)=>createRealEstateDraftPrototype({groupId:"shared-ownership",situationId:"compensation-share",values:{...compensationValues,compensationKind:kind,compensationConsent:consent}}).documentResult;
assert.match(compensation("за пользование имуществом","есть согласие").documentText,/фактическое пользование этой частью/);
assert.match(compensation("вместо выдела или за прекращение доли","согласия нет").documentText,/трёх условий одновременно/);
assert.match(compensation("не знаю","не знаю").documentText,/Сначала определите цель/);
assert.equal(compensation("за пользование имуществом","есть согласие").filingReady,false);

for(const [group,scenario] of [["ownership-register","registration-refusal"],["build-renovation","building-register-refusal"]]){
  const spec=getRealEstateIntakeSpec(group,scenario);assert.ok(spec);
  const values:Record<string,string>={};
  for(const field of spec.fields)if(field.required)values[field.key]=field.kind==="choice"?field.choices![0]:field.kind==="date"?"2026-10-15":"Синтетические обстоятельства";
  Object.assign(values,{"registrationDecision":"есть решение с основаниями","priorSuspension":"есть уведомление, причины известны","correctionEvidence":"да, есть доказательства подачи","registrationDecisionDate":"2026-11-01","refusalKnownDate":"2026-11-02","refusalScope":"личное обращение гражданина к органу без спора о праве и предпринимательской деятельности","refusalProcedure":"да","refusalCourt":"Тестовые сведения: Наименование и адрес компетентного суда","refusalClaimant":"Тестовые сведения: ФИО, дата и место рождения, место жительства, известный идентификатор и контакты истца (только вымышленные реквизиты)","refusalRespondent":"Тестовые сведения: Наименование, адрес и известные реквизиты административного ответчика","refusalParties":"Тестовые сведения: Заинтересованные лица и реквизиты либо сведения об их отсутствии","refusalDecisionNumber":"Тестовые сведения: Номер и наименование оспариваемого решения","refusalApplication":"Тестовые сведения: Номер и дата исходного заявления, объект и вид регистрационного действия","refusalReason":"Тестовые сведения: Основания отказа из решения","refusalObjection":"Тестовые сведения: Почему причины отказа устранены; доказательства и даты подачи","refusalRights":"Тестовые сведения: Какие права нарушены и какие препятствия возникли","refusalPretrial":"Тестовые сведения: Сведения о предыдущих жалобах, ответах или их отсутствии","refusalFee":"Тестовые сведения: Сведения об уплате пошлины, льготе либо соответствующем ходатайстве","refusalService":"Тестовые сведения: Сведения о направлении копий или представлении необходимых экземпляров"});
  const generate=(overrides:Record<string,string>={})=>createRealEstateDraftPrototype({groupId:group,situationId:scenario,values:{...values,...overrides},createdAt:"2026-11-27T12:00:00.000Z"}).documentResult;
  const result=generate();
  assert.match(result.documentText,/АДМИНИСТРАТИВНОЕ ИСКОВОЕ ЗАЯВЛЕНИЕ/);
  assert.match(result.documentText,/статья 227 КАС РФ/);
  assert.match(result.documentText,/повторного рассмотрения/);
  assert.doesNotMatch(result.documentText,/Вопросы для проверки|Примечания к предварительному проекту/);
  assert.deepEqual(result.usedRuleIds,[scenario+"-27-29-kas"]);
  assert.equal(result.filingReady,false);
  assert.ok(isRealEstateDraftResult(result));
  const negatives:Record<string,string>[]=[{refusalScope:"не установлено"},{refusalProcedure:"не подтверждено"},{refusalCourt:""},{refusalKnownDate:"2026-10-31"},{correctionEvidence:"нет"}];
  for(const negative of negatives)assert.deepEqual(generate(negative).usedRuleIds,[]);
}

assert.equal(Object.keys(REAL_ESTATE_PREPARED_GUIDANCE).length,40);
for(const [key,item] of Object.entries(REAL_ESTATE_PREPARED_GUIDANCE)){
  const [group,scenario]=key.split("/");
  const spec=getRealEstateIntakeSpec(group,scenario);assert.ok(spec,key);
  for(const [field,expected,yes,no] of item.branches){
    const definition=spec.fields.find(f=>f.key===field);
    assert.ok(definition?.choices?.includes(expected),key+"/"+field);
    const other=definition!.choices!.find(v=>v!==expected);assert.ok(other,key);
    assert.ok(renderPreparedRealEstateGuidance(group,scenario,{[field]:expected}).includes(yes),key);
    assert.ok(renderPreparedRealEstateGuidance(group,scenario,{[field]:other}).includes(no),key);
    assert.notEqual(yes,no,key);
  }
  assert.ok(item.actions.length,key);
}

for(const [group,scenario] of [["ownership-register","record-inaccurate"],["land-boundaries","registry-boundary-error"],["cadastral-valuation","wrong-object-area"],["ownership-register","suspension-registration"],["cadastral-valuation","cadastre-suspension"]]){
  const form=getRealEstateFormGuidance(group,scenario);assert.ok(form);
  const output=renderRealEstateFormPreparation(group,scenario,{},"2026-11-27T12:00:00.000Z").join("\n");
  assert.ok(output.includes(form.url));
  assert.match(output,/не заменяет утверждённую форму/);
  assert.match(output,/не подтвержден/);
}

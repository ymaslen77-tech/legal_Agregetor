import assert from "node:assert/strict";
import { REAL_ESTATE_GROUPS } from "@/data/real-estate-route-plan";
import { getRealEstateCheckedContext } from "@/data/real-estate-checked-context";
import { createRealEstateDraftPrototype, REAL_ESTATE_ACCEPTED_DRAFT_RULES } from "@/lib/real-estate-document-core";
import { getRealEstateFormGuidance } from "@/data/real-estate-form-guidance";
import { REAL_ESTATE_PREPARED_GUIDANCE } from "@/data/real-estate-prepared-guidance";
import { getReviewedRealEstateGuidance } from "@/data/real-estate-reviewed-guidance";
import { getRealEstateIntakeSpec } from "@/lib/real-estate-intake";

/** Acceptance is based on actual output, not on the number of registered routes. */
const officialForms:Record<string,string>={
  "ownership-register/record-inaccurate":"Техническая ошибка: приложение 2 к приказу П/0310 (ред. 07.04.2026); спор о праве или реестровая ошибка — иной порядок",
  "cadastral-valuation/wrong-object-area":"Установить техническую или реестровую ошибку; при применимости использовать форму П/0310, приложение 1 или 2",
  "land-boundaries/registry-boundary-error":"Установить источник ошибки и необходимость межевого плана; не заменять заявление по П/0310 свободным текстом",
  "ownership-register/suspension-registration":"Для апелляционной комиссии использовать форму по приказу П/0237/25; суд — отдельная процедура",
  "cadastral-valuation/cadastre-suspension":"Для апелляционной комиссии использовать форму по приказу П/0237/25; суд — отдельная процедура"
};
const claimProblems:Record<string,string>={
  "ownership-register/registration-refusal":"Установить вид оспаривания, адресата, основания отказа, сроки и надлежащую просительную часть",
  "build-renovation/building-register-refusal":"Определить процедуру, основание отказа, технический план и просительную часть",
  "newbuild-ddu/quality-defects":"Установить договор, дату передачи и выявления, доказательства недостатков, выбранное требование и применимые специальные правила"
};
const rows=REAL_ESTATE_GROUPS.flatMap(group=>group.situations.map(situation=>{
  const key=group.id+"/"+situation.id;
  const spec=getRealEstateIntakeSpec(group.id,situation.id);assert.ok(spec,key);
  const values:Record<string,string>={};
  for(const field of spec.fields)if(field.required)values[field.key]=field.kind==="choice"?field.choices![0]:field.kind==="date"?"2026-10-15":"Синтетическое описание фактов и документов для контроля результата";
  const rule=REAL_ESTATE_ACCEPTED_DRAFT_RULES.find(r=>r.group===group.id&&r.scenario===situation.id);
  if(rule&&group.id==="property-transactions")Object.assign(values,{role:situation.id==="seller-no-transfer"?"покупатель":"продавец",saleContract:"договор от 01.10.2026",saleObject:"условный объект",saleDueDate:"2026-10-15",saleBreachConfirmed:"да",handoverAct:"нет",handoverPossession:"нет",paymentEvidence:"есть документы",paymentTerms:"единовременно",saleTransferred:"да",saleDebt:"125000,50"});
  if(rule&&group.id==="newbuild-ddu")Object.assign(values,{role:"дольщик",defectStage:"после передачи",defectEvidence:"акт или письменное заключение",defectContract:"ДДУ от 01.02.2026",defectObject:"условная квартира",defectTransferDate:"2026-09-01",defectFoundDate:"2026-10-01",defectList:"Протечка оконного блока",defectBasis:"Несоответствие условиям договора о качестве окон",defectProof:"Акт осмотра от 01.10.2026",defectWarranty:"да",defectContractRemedy:"да",defectAttribution:"да",defectRemedy:"безвозмездное устранение"});
  if(rule&&["registration-refusal","building-register-refusal"].includes(situation.id))Object.assign(values,{"registrationDecision":"есть решение с основаниями","priorSuspension":"есть уведомление, причины известны","correctionEvidence":"да, есть доказательства подачи","registrationDecisionDate":"2026-11-01","refusalKnownDate":"2026-11-02","refusalScope":"личное обращение гражданина к органу без спора о праве и предпринимательской деятельности","refusalProcedure":"да","refusalCourt":"Тестовые сведения: Наименование и адрес компетентного суда","refusalClaimant":"Тестовые сведения: ФИО, дата и место рождения, место жительства, известный идентификатор и контакты истца (только вымышленные реквизиты)","refusalRespondent":"Тестовые сведения: Наименование, адрес и известные реквизиты административного ответчика","refusalParties":"Тестовые сведения: Заинтересованные лица и реквизиты либо сведения об их отсутствии","refusalDecisionNumber":"Тестовые сведения: Номер и наименование оспариваемого решения","refusalApplication":"Тестовые сведения: Номер и дата исходного заявления, объект и вид регистрационного действия","refusalReason":"Тестовые сведения: Основания отказа из решения","refusalObjection":"Тестовые сведения: Почему причины отказа устранены; доказательства и даты подачи","refusalRights":"Тестовые сведения: Какие права нарушены и какие препятствия возникли","refusalPretrial":"Тестовые сведения: Сведения о предыдущих жалобах, ответах или их отсутствии","refusalFee":"Тестовые сведения: Сведения об уплате пошлины, льготе либо соответствующем ходатайстве","refusalService":"Тестовые сведения: Сведения о направлении копий или представлении необходимых экземпляров"});
  const result=createRealEstateDraftPrototype({groupId:group.id,situationId:situation.id,values,createdAt:"2026-11-27T12:00:00.000Z"}).documentResult;
  const context=getRealEstateCheckedContext(group.id,situation.id);
  assert.ok(context.length,key);
  assert.equal(result.filingReady,false,key);
  assert.equal(result.requiresLegalReview,true,key);
  if(rule){
    assert.deepEqual(result.usedRuleIds,[rule.id],key);
    assert.ok(result.documentText.includes(rule.statement),key);
    assert.doesNotMatch(result.documentText,/Вопросы для проверки|Сведения для индивидуальной проверки|Примечания к предварительному проекту/i,key);
    assert.equal(new Set(rule.sources.map(url=>new URL(url).hostname)).size>=3,true,key);
  }
  const guidance=getReviewedRealEstateGuidance(group.id,situation.id);
  if(guidance){assert.deepEqual(result.usedRuleIds,[guidance.id],key);assert.ok(result.documentText.includes(guidance.statement),key);assert.match(result.documentText,/Правовая оценка и дальнейшие действия/);assert.ok(new Set(guidance.sources.map(url=>new URL(url).hostname)).size>=3,key);}
  const prepared=REAL_ESTATE_PREPARED_GUIDANCE[key];
  if(prepared){assert.equal(result.usedRuleIds.length,0,key);assert.match(result.documentText,/Предварительная правовая оценка и дальнейшие действия/);for(const card of context)assert.ok(result.documentText.includes(card.proposition),key);for(const action of prepared.actions)assert.ok(result.documentText.includes(action),key);}
  const form=getRealEstateFormGuidance(group.id,situation.id);
  if(form){assert.ok(result.documentText.includes(form.url),key);assert.match(result.documentText,/не заменяет утверждённую форму/);assert.equal(result.usedRuleIds.length,0,key);assert.ok(new Set(form.sources.map(url=>new URL(url).hostname)).size>=3,key);}
  const reason=rule?"Условный шаблон и правовой тезис приняты; необходимы реквизиты сторон, проверка договорных исключений и успешное сохранение пользователем":
    guidance?"Принят информационный шаблон с проверенной нормой и условной правовой оценкой; публичные интеграции ещё не приняты":prepared?"Предметный информационный результат подготовлен по общему проверенному контексту; индивидуальная приёмка правовых выводов и источников не завершена":officialForms[key]??claimProblems[key]??"Результат является памяткой или листом сведений, не юридическим документом; требуется предметная правовая оценка и проверка применимости норм/доказательств";
  return {key,title:situation.title,resultKind:result.resultKind,contextIds:context.map(c=>c.id),usedRuleIds:result.usedRuleIds,
    textStatus:rule?"CONDITIONAL_TEMPLATE_PASS":guidance?"CONDITIONAL_GUIDANCE_PASS":prepared?"PREPARED_GUIDANCE_REVIEW_REQUIRED":form?"OFFICIAL_FORM_PREPARATION_REQUIRED":"REWORK_REQUIRED",releaseStatus:"BLOCKED",reason};
}));
assert.equal(rows.length,60);
assert.equal(rows.filter(r=>r.textStatus==="CONDITIONAL_TEMPLATE_PASS").length,5);
assert.equal(rows.filter(r=>r.textStatus==="CONDITIONAL_GUIDANCE_PASS").length,10);
assert.equal(rows.filter(r=>r.textStatus==="PREPARED_GUIDANCE_REVIEW_REQUIRED").length,40);
assert.equal(rows.filter(r=>r.textStatus==="OFFICIAL_FORM_PREPARATION_REQUIRED").length,5);
assert.equal(rows.filter(r=>r.textStatus==="REWORK_REQUIRED").length,0);
assert.ok(rows.every(r=>r.releaseStatus==="BLOCKED"));
assert.equal(rows.filter(r=>r.resultKind==="DRAFT").length,10);
console.log("REAL_ESTATE_DOCUMENT_ACCEPTANCE="+JSON.stringify(rows));
console.log("5 conditional claim templates; 10 conditional informational templates; 40 prepared informational outputs awaiting acceptance; 5 official form preparation routes require completion of actual form generation; no public release approval.");

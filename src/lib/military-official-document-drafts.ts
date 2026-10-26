import {getMilitaryDocumentBlueprint} from "@/data/military-document-blueprints";

/**
 * Release-gated specimen-derived templates. Do not fabricate facts or recipients.
 * These two requests contain the standard elements of a service communication:
 * recipient, applicant, documented circumstances, specific request, attachments,
 * date and signature. No automatic legal eligibility conclusion.
 */
export const MILITARY_READY_DRAFT_KEYS=[
 "service-order-copy",
 "pay-breakdown"
] as const;
export type MilitaryReadyDraftKey=(typeof MILITARY_READY_DRAFT_KEYS)[number];
export type MilitaryDocumentFacts={
 recipient:string;applicantName:string;applicantPosition:string;
 contactMethod:string;date:string;attachments:string;
 documentKind?:string;documentDate?:string;documentNumber?:string;
 paymentPeriod?:string;paymentKinds?:string;
};
export type MilitaryDraftValidation={missing:string[];draft:string|null};
const labels:Record<string,string>={
 recipient:"Должность и наименование компетентного адресата",
 applicantName:"ФИО заявителя",
 applicantPosition:"Должность или статус заявителя",
 contactMethod:"Куда направить ответ",
 date:"Дата обращения",
 attachments:"Приложения (при отсутствии указать «нет»)",
 documentKind:"Какую выписку или копию приказа необходимо выдать",
 paymentPeriod:"Период начислений денежного довольствия",
 paymentKinds:"Какие составляющие начислений или удержаний нужно разъяснить"
};
export const MILITARY_DRAFT_FIELDS:Readonly<Record<MilitaryReadyDraftKey,readonly string[]>>={
 "service-order-copy":["recipient","applicantName","applicantPosition","contactMethod","date","attachments","documentKind"],
 "pay-breakdown":["recipient","applicantName","applicantPosition","contactMethod","date","attachments","paymentPeriod","paymentKinds"]
};
export function getMilitaryDraftFields(key:MilitaryReadyDraftKey){
 return MILITARY_DRAFT_FIELDS[key].map(k=>({key:k,label:labels[k]}));
}
const trim=(input:unknown)=>typeof input==="string"?input.trim():"";
const safe=(value:string)=>value.replace(/[<>\u0000-\u001f]/g," ").trim();
export function prepareMilitaryOfficialDraft(key:MilitaryReadyDraftKey,facts:MilitaryDocumentFacts):MilitaryDraftValidation{
 const blueprint=getMilitaryDocumentBlueprint(key);
 if(!blueprint)return {missing:["Не зарегистрирован документ"],draft:null};
 const missing=MILITARY_DRAFT_FIELDS[key].filter(field=>trim(facts[field as keyof MilitaryDocumentFacts]).length<2);
 if(missing.length)return {missing:missing.map(field=>labels[field]),draft:null};
 const data=Object.fromEntries(Object.entries(facts).map(([k,v])=>[k,safe(v??"")]));
 const head=[
  "Кому: "+data.recipient,
  "От: "+data.applicantName,
  "Должность / статус: "+data.applicantPosition,
  "Для ответа: "+data.contactMethod,
  "",
  blueprint.title.toUpperCase(),
  ""
 ];
 const body=key==="service-order-copy"?[
  "Прошу предоставить относящуюся ко мне копию (выписку из) следующего служебного документа: "+data.documentKind+".",
  ...(data.documentDate?["Известная дата документа: "+data.documentDate+"."]:[]),
  ...(data.documentNumber?["Известный номер документа: "+data.documentNumber+"."]:[]),
  "Документ необходим для ознакомления со сведениями, касающимися прохождения мною военной службы.",
  "Прошу предоставить копию или мотивированно разъяснить установленный порядок ознакомления и получения документа."
 ]:[
  "Прошу предоставить письменные сведения о начислении денежного довольствия за период: "+data.paymentPeriod+".",
  "Прошу раскрыть состав и правовые основания следующих начислений или удержаний: "+data.paymentKinds+".",
  "Прошу указать основания расчёта соответствующих сумм и, при выявлении ошибки, разъяснить порядок исправления расчёта.",
  "Размеры начислений не заявляются как установленная задолженность без подтверждающих документов."
 ];
 const footer=[
  "",
  "Прошу предоставить ответ по указанным мной контактным данным.",
  "Приложения: "+data.attachments+".",
  "Дата: "+data.date,
  "Подпись: __________________ /"+data.applicantName+"/",
  "",
  "Перед направлением проверьте полномочия адресата, правовые основания и подтверждающие документы."
 ];
 return {missing:[],draft:[...head,...body,...footer].join("\n")};
}

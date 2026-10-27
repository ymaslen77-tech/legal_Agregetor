import {documentResultSchema,DOCUMENT_RESULT_CONTRACT_VERSION} from "@/lib/document-result-contract";
import type {DocumentResultV1} from "@/lib/document-result-contract";
import {getMilitaryLegalDocument,MILITARY_LEGAL_FIELDS,MILITARY_LEGAL_SOURCES,type MilitaryLegalDocument} from "@/data/military-legal-documents";
import {MILITARY_ROUTES} from "@/data/military-route-plans";

export type MilitaryDocumentAnswers=Record<string,string>;
export type MilitaryLegalValidation={missing:string[];invalid:string[];complete:boolean};
/** All required facts originate in a real document's standard legal requisites. */
/** The selected document already defines the remedy; extra requests are optional. */
export const MILITARY_OPTIONAL_DOCUMENT_FIELDS = new Set<string>(["desired"]);
export function isMilitaryDocumentFieldRequired(field:string):boolean{
 return !MILITARY_OPTIONAL_DOCUMENT_FIELDS.has(field);
}
function isRealCalendarDate(value:string):boolean{
 const match=/^(\d{2})\.(\d{2})\.(\d{4})$/.exec(value);
 if(!match)return false;
 const day=Number(match[1]),month=Number(match[2]),year=Number(match[3]);
 if(year<1900||year>2100)return false;
 const parsed=new Date(Date.UTC(year,month-1,day));
 return parsed.getUTCFullYear()===year&&parsed.getUTCMonth()===month-1&&parsed.getUTCDate()===day;
}
export function validateMilitaryLegalDocument(doc:MilitaryLegalDocument,answers:MilitaryDocumentAnswers):MilitaryLegalValidation{
 const missing=doc.fields.filter(key=>isMilitaryDocumentFieldRequired(key)&&!(answers[key]??"").trim());
 const invalid=doc.fields.filter(key=>{
  const value=(answers[key]??"").trim();
  return value.length>1600 || (Boolean(value)&&["birthDate","date"].includes(key)&&!isRealCalendarDate(value));
 });
 return {missing,invalid,complete:missing.length===0&&invalid.length===0};
}

function trim(answers:MilitaryDocumentAnswers,key:string){return (answers[key]??"").trim();}
function section(label:string,content?:string){return content?label+" "+content+"\n":"";}
function legalLines(doc:MilitaryLegalDocument){
 return doc.sourceIds.map(key=>MILITARY_LEGAL_SOURCES[key]?.title).filter((item):item is string=>Boolean(item))
  .map(item=>"— "+item).join("\n");
}
function statementBody(doc:MilitaryLegalDocument,a:MilitaryDocumentAnswers){
 const details=[
  ["Предмет обращения:",doc.subject+"."],
  ["Документ или решение:",trim(a,"instrument")],
  ["Дата существенного события:",trim(a,"date")],
  ["Подтверждённый статус:",trim(a,"service")],
  ["Воинский учёт:",trim(a,"registration")],
  ["Период:",trim(a,"period")],
  ["Выплата:",trim(a,"payment")],
  ["Основание:",trim(a,"grounds")],
  ["Заключение ВВК:",trim(a,"vvk")],
  ["Суть несогласия:",trim(a,"disagreement")],
  ["Основание обращения члена семьи:",trim(a,"relation")],
  ["Фактические обстоятельства:",trim(a,"facts")],
  ["Нарушенное право:",trim(a,"violation")],
  ["Документы и подтверждения:",trim(a,"proof")],
  ["Предыдущие обращения и результат:",trim(a,"prior")]
 ].filter(item=>Boolean(item[1])).map(item=>item[0]+" "+item[1]);
 return details.join("\n");
}
function renderOrdinary(doc:MilitaryLegalDocument,a:MilitaryDocumentAnswers):string{
 const requests=[
  doc.request,
  ...(trim(a,"desired")?["Уточнение заявителя: "+trim(a,"desired")]:[]),
  "Сообщить о принятом решении и порядке получения ответа."
 ];
 const greeting=[
  "Кому: "+trim(a,"recipient"),
  "От: "+trim(a,"applicant"),
  section("Адрес для ответа:",trim(a,"postal")).trim(),
  section("Воинское звание / статус:",trim(a,"service")).trim(),
  "",
  doc.title.toUpperCase(),
  "",
  statementBody(doc,a),
  "",
  "Правовые основания, применимость которых подлежит проверке:",
  legalLines(doc),
  "",
  "ПРОШУ:",
  ...requests.map((request,index)=>(index+1)+". "+request),
  "",
  "Приложения:",
  (trim(a,"proof")?trim(a,"proof"):"Перечень подтверждающих документов необходимо уточнить и приложить перед направлением."),
  "",
  "Дата: [указать]                        Подпись: [подписать]",
  "",
  "Юридическая проверка обязательна до направления: адресат, полномочия, правовой режим, содержание требования и приложения."
 ];
 return greeting.filter((part,index)=>part!==""||index>0).join("\n");
}
function renderCourt(doc:MilitaryLegalDocument,a:MilitaryDocumentAnswers):string{
 const requests=[
  doc.request,
  ...(trim(a,"desired")?["Дополнительное требование заявителя (проверить процессуальную допустимость): "+trim(a,"desired")]:[])
 ];
 return [
  "В "+trim(a,"court"),
  "Административный истец: "+trim(a,"applicant"),
  "Дата рождения: "+trim(a,"birthDate")+"; место рождения: "+trim(a,"birthPlace"),
  "Адрес проживания / пребывания: "+trim(a,"postal"),
  "Административный ответчик: "+trim(a,"defendant"),
  "Место нахождения ответчика: "+trim(a,"defendantAddress"),
  "",
  doc.title.toUpperCase(),
  "",
  "Оспариваемое решение (действие / бездействие) и обстоятельства:",
  statementBody(doc,a),
  "",
  "Сведения о поданных ранее жалобах и их результате:",
  trim(a,"prior"),
  "",
  "Правовое обоснование:",
  "С учётом статьи 46 Конституции РФ и положений главы 22 КАС РФ право на оспаривание зависит от предмета спора, характера публичных полномочий и компетенции суда.",
  "Требования к содержанию и приложениям проверяются по статьям 125 и 126 КАС РФ. Начало и течение срока обращения проверяются по статье 219 КАС РФ. Состав ответчиков и суд определяются индивидуально.",
  legalLines(doc),
  "",
  "ПРОШУ СУД:",
  ...requests.map((request,index)=>(index+1)+". "+request),
  "",
  "Приложения:",
  trim(a,"proof"),
  "Документ об уплате госпошлины либо подтверждение основания освобождения (если применимо).",
  "Документы о направлении копий участникам процесса (если они требуются в данном деле).",
  "Доверенность и подтверждение полномочий представителя (при наличии).",
  "",
  "Дата: [указать]                        Подпись: [подписать]",
  "",
  "ПРОЕКТ ДЛЯ ЮРИДИЧЕСКОЙ ПРОВЕРКИ: суд, подсудность, вид производства, сроки, доказательства, госпошлина, требования и ответчик не подтверждены автоматически."
 ].join("\n");
}
export function createMilitaryLegalDocumentResult(
 slug:string,answers:MilitaryDocumentAnswers,ids:{versionId:string;createdAt:string}
):DocumentResultV1{
 const doc=getMilitaryLegalDocument(slug);
 if(!doc)throw new Error("Документ не найден.");
 const route=MILITARY_ROUTES.find(item=>item.id===doc.routeId);
 if(!route)throw new Error("Военный маршрут документа не зарегистрирован.");
 const validation=validateMilitaryLegalDocument(doc,answers);
 if(!validation.complete)throw new Error("Уточните обязательные реквизиты: "+validation.missing.map(key=>MILITARY_LEGAL_FIELDS[key]?.label??key).join(", "));
 const text=doc.kind==="court"?renderCourt(doc,answers):renderOrdinary(doc,answers);
 return documentResultSchema.parse({
  contractVersion:DOCUMENT_RESULT_CONTRACT_VERSION,
  versionId:ids.versionId,createdAt:ids.createdAt,
  categorySlug:"voennoe-pravo",routeSlug:route.slug,scenarioKey:doc.scenarioKey,
  documentSlug:doc.slug,resultKind:"DRAFT",source:"DETERMINISTIC",
  documentTitle:doc.title,documentText:text,
  usedRuleIds:[],placeholders:[],
  legalRegistryReviewedAt:null,generatorVersion:"military-docs-1",
  filingReady:false,requiresLegalReview:true
 });
}

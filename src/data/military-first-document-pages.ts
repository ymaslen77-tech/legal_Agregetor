import type {NavigatorDocument} from "@/data/documents";
import {getMilitaryDocumentBlueprint} from "@/data/military-document-blueprints";
import {getMilitaryDraftFields,type MilitaryReadyDraftKey,MILITARY_READY_DRAFT_KEYS} from "@/lib/military-official-document-drafts";

export const MILITARY_FIRST_DOCUMENT_PAGES:NavigatorDocument[]=MILITARY_READY_DRAFT_KEYS.map((key:MilitaryReadyDraftKey)=>{
 const blueprint=getMilitaryDocumentBlueprint(key)!;
 const legalBasis=blueprint.legalSources.map(s=>s.citation);
 const instructions=[
  "Определите уполномоченного адресата по кадровым или финансовым документам.",
  "Заполните сведения, которые действительно подтверждены документами.",
  "Проверьте текст и приложения до подписания.",
  "Направьте обращение по установленному ведомственному порядку и сохраните подтверждение получения."
 ];
 const whatToPrepare=[...blueprint.evidence];
 const cautions=[
  "Нет сведений о компетенции получателя: не отправляйте документ по предположительному адресу.",
  "Заявитель действует за другое лицо без проверенных полномочий.",
  "Для военнослужащих разных ведомств или статусов может действовать иной порядок."
 ];
 return {
  slug:blueprint.slug,title:blueprint.title,category:"военное право",documentType:blueprint.type,
  shortTitle:blueprint.title,titleAccusative:blueprint.title.toLowerCase(),
  shortIntro:blueprint.intent,shortDescription:blueprint.intent,
  description:blueprint.intent,heroDescription:`${blueprint.intent}. Подготовьте подтверждённые сведения и сформируйте текст для проверки.`,
  whenToUse:[blueprint.intent],whenNotToUse:cautions,
  beforeFillingChecklist:[...blueprint.requiredRequisites],
  requiredData:getMilitaryDraftFields(key).map(x=>x.label),
  whatToPrepare,whatToInclude:[...blueprint.requiredRequisites],
  howToFill:["Заполняйте исключительно подтверждённые сведения.","Не сообщайте сведения о дислокации подразделений и персональные данные третьих лиц."],
  whereToFile:blueprint.submission,whereToSubmit:blueprint.submission,
  filingProcedure:instructions,howToSubmit:instructions,
  legalBasis,deadlinesAndFees:["Срок и применимость процедуры определяются с учётом вида обращения и статуса заявителя."],
  stateDuty:["Для ведомственного рапорта судебная госпошлина не рассчитывается."],
  deadlines:["Перед отправкой проверьте применимый срок рассмотрения и порядок регистрации."],
  afterFiling:["Сохраните доказательство направления.","Проверьте регистрацию и получение ответа."],
  importantFactsToFix:[...blueprint.facts],
  mistakes:["Не указывать конкретный вид документа либо период начислений.","Обращаться к органу, не уполномоченному решать вопрос."],
  commonMistakes:["Не указывать конкретный вид документа либо период начислений.","Обращаться к органу, не уполномоченному решать вопрос."],
  documentsToAttach:whatToPrepare,attachments:whatToPrepare,
  relatedProblems:[{title:"Военное право",slug:""}],relatedSituations:[],
  relatedDocuments:[],faq:[],relatedProblemSlugs:[],legalReferenceKeys:[],
  seoTitle:`${blueprint.title}: образец, составить онлайн, скачать PDF`,
  seoDescription:`${blueprint.title}: подтверждённые реквизиты, правовые основания и инструкция. Сформируйте проект, скачайте PDF или DOCX после проверки.`,
  generatorSeoTitle:`${blueprint.title}: заполнить онлайн, PDF и DOCX`,
  generatorSeoDescription:`${blueprint.title} — персональный проект для проверки. Нужные сведения, необходимые документы и порядок направления.`,
  keywords:[blueprint.title.toLowerCase(),`${blueprint.title.toLowerCase()} образец`,`${blueprint.title.toLowerCase()} скачать pdf`],
  userQueries:[`${blueprint.title.toLowerCase()} составить`],
  lastReviewedAt:"2026-10-26",
  disclaimer:"Рапорт не готов к направлению без проверки компетенции адресата и подтверждающих документов."
 } satisfies NavigatorDocument;
});
export function getMilitaryFirstDocumentMatch(slug:string){
 const match=MILITARY_FIRST_DOCUMENT_PAGES.find(x=>x.slug===slug);
 if(!match)return null;
 const key=MILITARY_READY_DRAFT_KEYS.find(k=>getMilitaryDocumentBlueprint(k)?.slug===slug);
 return key?{document:match,key}:null;
}

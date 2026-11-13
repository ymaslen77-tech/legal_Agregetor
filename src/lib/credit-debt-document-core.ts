import { getCreditDebtAcceptanceItem } from "@/data/credit-debt-acceptance-matrix";
import { CREDIT_DEBT_DOCUMENT_TARGETS, getCreditDebtDocumentTarget, type CreditDebtDocumentTarget } from "@/data/credit-debt-document-targets";
import { CREDIT_DEBT_GROUPS } from "@/data/credit-debt-route-plan";
import { getCreditDebtSkeletonSpec,evaluateCreditDebtSkeleton } from "@/lib/credit-debt-full-route";
import { DOCUMENT_RESULT_CONTRACT_VERSION,documentResultSchema,type DocumentResultV1 } from "@/lib/document-result-contract";
import { addDocumentVersion,type DocumentVersionEntry } from "@/lib/document-version-history";

/**
 * All 60 scenarios have an individually selected output. Some are legal drafts;
 * others are prepared data, checklists, urgent actions, or hand-offs. DO NOT
 * call the latter "claims", "complaints", "court applications", or official forms.
 * Until per-claim validation is complete all versions remain non-filing drafts.
 */
export const CREDIT_DEBT_GENERATOR_VERSION="credit-debt-2" as const;
export type CreditDebtDocumentPlan=Readonly<{
  target:CreditDebtDocumentTarget;
  documentSlug:string;
  title:string;
  resultKind:DocumentResultV1["resultKind"];
  requiresAddress:boolean;
  inputs:ReadonlyArray<{
    key:"applicant"|"recipient"|"contract"|"facts"|"specificFacts"|"evidence"|"attachments"|"counterparty"|"disputedAmount"|"proceduralDate"|"priorRequests";
    label:string;
    required:boolean;
    rows:number;
  }>;
  filingReady:false;
  requiresLegalReview:true;
  legalRegistryReviewedAt:null;
}>;
export type CreditDebtDocumentOutput=Readonly<{
  documentResult:DocumentResultV1;
  formData:Readonly<Record<string,string>>;
}>;
export type CreditDebtDocumentInput=Readonly<{
  groupId:string;
  situationId:string;
  values:Readonly<Record<string,unknown>>;
  intakeValues?:Readonly<Record<string,string|undefined>>;
  versionId?:string;
  createdAt?:string;
}>;

const drafted = new Set(["REQUEST_DRAFT","COMPLAINT_DRAFT","OBJECTION_DRAFT","CLAIM_DRAFT"]);
const urgent = new Set(["FRAUD_REFERRAL","SAFETY_ESCALATION"]);
function resultKind(target:CreditDebtDocumentTarget):DocumentResultV1["resultKind"]{
  if(drafted.has(target.targetResult))return "DRAFT";
  if(urgent.has(target.targetResult))return "URGENT_INSTRUCTION";
  if(target.targetResult==="DATA_PREPARATION")return "PREPARED_DATA";
  if(target.targetResult==="CROSS_LINK")return "LEGAL_REVIEW_ONLY";
  return "CHECKLIST";
}
function safe(value:unknown,max:number):string{
  return typeof value==="string" ? value.replace(/\r\n?/g,"\n").trim().slice(0,max) : "";
}
/** Normalized input is only kept in memory until the user explicitly saves. */
export function getCreditDebtDocumentPlan(groupId:string,situationId:string):CreditDebtDocumentPlan|null{
  const target=getCreditDebtDocumentTarget(groupId,situationId);
  if(!target||!getCreditDebtSkeletonSpec(groupId,situationId))return null;
  const isDraft=drafted.has(target.targetResult);
  const originalSituation=CREDIT_DEBT_GROUPS.find(g=>g.id===groupId)?.situations.find(x=>x.id===situationId);
  if(!originalSituation)throw new Error("Missing situation-specific factual prompt.");
  const noCollection=urgent.has(target.targetResult)||target.targetResult==="CROSS_LINK";
  const courtDraft=target.targetResult==="CLAIM_DRAFT"||target.targetResult==="OBJECTION_DRAFT";
  const claim=target.targetResult==="CLAIM_DRAFT";
  const inputs:CreditDebtDocumentPlan["inputs"]=noCollection?[]:[
    {key:"applicant",label:"Заявитель (при необходимости: ФИО и способ связи)",required:isDraft,rows:2},
    {key:"recipient",label:claim?"Суд, подсудность которого предстоит подтвердить":"Проверенный адресат",required:isDraft,rows:2},
    ...(courtDraft?[{key:"counterparty" as const,label:"Противная сторона / взыскатель (как в документах)",required:true,rows:2},
      {key:"proceduralDate" as const,label:"Судебный акт и дата его фактического получения",required:true,rows:2}]:[]),
    ...(claim?[{key:"disputedAmount" as const,label:"Цена требования и проверенный расчёт (если применимо)",required:true,rows:2}]:[]),
    {key:"contract",label:"Договор, судебное дело или номер обращения (если известны)",required:false,rows:2},
    {key:"facts",label:"Обстоятельства, даты и факты конкретной ситуации",required:true,rows:5},
    {key:"specificFacts",label:"Дополнительные сведения по этой ситуации: "+originalSituation.caseFacts,required:isDraft,rows:3},
    ...(isDraft?[{key:"priorRequests" as const,label:"Предыдущие обращения, ответы и подтверждения направления (если имеются)",required:false,rows:3}]:[]),
    {key:"evidence",label:"Документы, которыми подтверждаются обстоятельства",required:false,rows:3},
    {key:"attachments",label:"Приложения к обращению (если предусмотрены и фактически имеются)",required:false,rows:3}
  ];
  return {
    target,documentSlug:"credit-debt-"+groupId+"-"+situationId,
    title:target.title,resultKind:resultKind(target),
    requiresAddress:isDraft,inputs,
    filingReady:false,requiresLegalReview:true,legalRegistryReviewedAt:null
  };
}
export function listCreditDebtDocumentPlans():readonly CreditDebtDocumentPlan[]{
  return CREDIT_DEBT_DOCUMENT_TARGETS.map(x=>{
    const plan=getCreditDebtDocumentPlan(x.groupId,x.situationId);
    if(!plan)throw new Error("Missing credit/debt document plan: "+x.key);
    return plan;
  });
}
function formatPlan(plan:CreditDebtDocumentPlan,formData:Readonly<Record<string,string>>,
  intake:Readonly<Record<string,string|undefined>>):string{
  const t=plan.target;
  const legalGate=getCreditDebtAcceptanceItem(t.groupId,t.situationId);
  if(!legalGate)throw new Error("Missing individual legal review checklist: "+t.key);
  const draft=plan.resultKind==="DRAFT";
  const introduction=draft?"ПРОЕКТ ОБРАЩЕНИЯ — НЕ ГОТОВ К ПОДАЧЕ":
    plan.resultKind==="URGENT_INSTRUCTION"?"ПЕРВООЧЕРЕДНЫЕ ДЕЙСТВИЯ — НЕ ЮРИДИЧЕСКОЕ ЗАКЛЮЧЕНИЕ":
    plan.resultKind==="LEGAL_REVIEW_ONLY"?"ПАМЯТКА О ПЕРЕХОДЕ К ПРОФИЛЬНОМУ МАРШРУТУ":
    plan.resultKind==="PREPARED_DATA"?"ЛИСТ ПОДГОТОВЛЕННЫХ ДАННЫХ":
    "ПРЕДВАРИТЕЛЬНЫЙ ЧЕК-ЛИСТ";
  const fields=[
    formData.contract?"Договор или производство: "+formData.contract:"",
    formData.facts?"Изложенные обстоятельства:\n"+formData.facts:"",
    formData.specificFacts?"Дополнительные обстоятельства по выбранной ситуации:\n"+formData.specificFacts:"",
    formData.evidence?"Подтверждающие материалы:\n"+formData.evidence:""
  ].filter(Boolean);
  const spec=getCreditDebtSkeletonSpec(t.groupId,t.situationId);
  if(!spec)throw new Error("Unknown credit/debt case");
  // Snapshot the questionnaire in the generated version, so a changed answer
  // cannot be silently omitted when the applicant regenerates the document.
  const intakeLines=spec.fields.map(field=>{
    const answer=safe(intake[field.key],2000);
    return answer?field.label+": "+answer:"";
  }).filter(Boolean);
  const intakeBlock=intakeLines.length?
    ["Ответы анкеты на момент формирования документа:",...intakeLines].join("\n"):"";
  const assessment=evaluateCreditDebtSkeleton(spec,intake);
  const checks=assessment.checklist.map((v,i)=>`${i+1}. ${v}`);
  if(draft){
    const heading=t.targetResult==="OBJECTION_DRAFT"?"ПРОЕКТ ПИСЬМЕННЫХ ВОЗРАЖЕНИЙ":
      t.targetResult==="CLAIM_DRAFT"?"ПРОЕКТ ИСКОВОГО ЗАЯВЛЕНИЯ":
      t.targetResult==="COMPLAINT_DRAFT"?"ПРОЕКТ ЖАЛОБЫ":"ПРОЕКТ ЗАЯВЛЕНИЯ";
    const introductory="Я, "+formData.applicant+", обращаюсь по вопросу «"+t.title+"». "+
      "Излагаю обстоятельства для проверки компетентным адресатом.";
    const factual=[
      formData.contract?"Обязательство или судебное производство: "+formData.contract+".":"",
      formData.counterparty?"Другая сторона: "+formData.counterparty+".":"",
      formData.proceduralDate?"Сведения о судебном акте и вручении: "+formData.proceduralDate+".":"",
      formData.disputedAmount?"Заявленная цена требования или расчёт: "+formData.disputedAmount+".":"",
      "Фактические обстоятельства: "+formData.facts,
      formData.specificFacts?"Сведения, относящиеся именно к выбранному случаю: "+formData.specificFacts:"",
      formData.priorRequests?"Ранее направленные обращения и ответы: "+formData.priorRequests:"",
      formData.evidence?"Подтверждение изложенного: "+formData.evidence:""
    ].filter(Boolean).join("\n\n");
    const litigationWarning=t.targetResult==="CLAIM_DRAFT"?
      "ВНИМАНИЕ: до подачи иска отдельно подтвердить подсудность, цену иска, расчет, госпошлину, досудебный порядок, полномочия сторон и обязательные приложения.":t.targetResult==="OBJECTION_DRAFT"?
      "ВНИМАНИЕ: по статьям 128–129 ГПК РФ общий срок возражений — десять дней со дня получения судебного приказа. При пропуске срока необходимо обосновать невозможность своевременной подачи по не зависящим от должника причинам и подтвердить их документально. До направления проверить вид производства, вручение, исчисление срока и реквизиты конкретного суда. Подача поздних возражений не гарантирует их принятия.":"";
    return [
      introduction,"ТРЕБУЕТСЯ ЮРИДИЧЕСКАЯ ПРОВЕРКА","",
      "Кому: "+formData.recipient,"От: "+formData.applicant,
      formData.counterparty?"Другая сторона: "+formData.counterparty:"",
      "",heading,"По вопросу: "+t.title,"",introductory,"",intakeBlock,"",factual,"",
      "ПРОШУ:",t.objective,"",
      "Приложения: "+(formData.attachments||"уточняются; прилагаются только фактически имеющиеся документы"),
      "","Дата: __________________","Подпись: ______________","",
      litigationWarning,
      "Юридическая проверка данной ситуации: "+legalGate.reviewFocus,
      "Перед подачей требуется индивидуальная проверка применимых норм, компетенции адресата, процессуальной формы, сроков, пошлины и обязательных приложений."
    ].filter(x=>x!==undefined).join("\n");
  }
  if(plan.resultKind==="URGENT_INSTRUCTION"){
    return [introduction,"","Ситуация: "+t.title,"",t.objective,"",
      "Непосредственная безопасность важнее подготовки документа.",
      ...checks,"","При наличии угроз жизни или здоровью обратитесь в экстренные службы.",
      "Не передавайте пароли, коды и персональные документы неизвестным лицам."].join("\n");
  }
  return [
    introduction,"","Ситуация: "+t.title,"",
    "Предмет предварительной проверки:",t.objective,"",
    ...fields,"",intakeBlock,"",
    "Порядок предварительной проверки:",...checks,"",
    "Необходимо собрать:",...assessment.documentsToGather.map((v,i)=>`${i+1}. ${v}`),"",
    "Индивидуальная юридическая проверка: "+legalGate.reviewFocus,
    "Ситуация требует самостоятельной проверки правовых условий по действующим официальным источникам.",
    "Этот результат не является судебным заявлением, официальным бланком, признанием права на льготу или подтверждением освобождения от долгов."
  ].join("\n");
}

export function createCreditDebtDraftPrototype(input:CreditDebtDocumentInput):CreditDebtDocumentOutput{
  const plan=getCreditDebtDocumentPlan(input.groupId,input.situationId);
  if(!plan)throw new Error("Неизвестная ситуация: документ не создан.");
  const cleaned:Record<string,string>={};
  for(const f of plan.inputs){
    const value=safe(input.values[f.key],f.key==="facts"?5000:f.key==="attachments"?1800:1200);
    if(f.required&&value.length<(f.key==="facts"?15:3))throw new Error("Не заполнено обязательное поле: "+f.label);
    cleaned[f.key]=value;
  }
  const docText=formatPlan(plan,cleaned,input.intakeValues??{});
  if(docText.length<110)throw new Error("Недостаточно данных для проекта.");
  const result=documentResultSchema.parse({
    contractVersion:DOCUMENT_RESULT_CONTRACT_VERSION,
    versionId:input.versionId??crypto.randomUUID(),
    createdAt:input.createdAt??new Date().toISOString(),
    categorySlug:"kredity-dolgi",
    routeSlug:input.groupId,
    scenarioKey:input.situationId,
    documentSlug:plan.documentSlug,
    resultKind:plan.resultKind,
    source:"DETERMINISTIC",
    documentTitle:plan.title,
    documentText:docText,
    usedRuleIds:[],
    placeholders:[],
    legalRegistryReviewedAt:null,
    generatorVersion:CREDIT_DEBT_GENERATOR_VERSION,
    filingReady:false,
    requiresLegalReview:true
  });
  return {documentResult:result,formData:cleaned};
}
export function isCreditDebtDraftResult(input:unknown):input is DocumentResultV1{
  const parsed=documentResultSchema.safeParse(input);
  if(!parsed.success)return false;
  const result=parsed.data;
  const plan=getCreditDebtDocumentPlan(result.routeSlug,result.scenarioKey);
  return result.categorySlug==="kredity-dolgi"&&!!plan &&
    result.documentSlug===plan.documentSlug&&result.documentTitle===plan.title&&
    result.resultKind===plan.resultKind&&result.generatorVersion===CREDIT_DEBT_GENERATOR_VERSION&&
    ["DETERMINISTIC","USER_EDITED"].includes(result.source)&&
    result.filingReady===false&&result.requiresLegalReview===true&&
    result.usedRuleIds.length===0&&result.legalRegistryReviewedAt===null&&
    (result.documentText.startsWith("ПРОЕКТ")||
      result.documentText.startsWith("ПЕРВООЧЕРЕДНЫЕ")||
      result.documentText.startsWith("ПАМЯТКА")||
      result.documentText.startsWith("ЛИСТ ПОДГОТОВЛЕННЫХ")||
      result.documentText.startsWith("ПРЕДВАРИТЕЛЬНЫЙ"));
}
export function reviseCreditDebtDraft(
  previous:CreditDebtDocumentOutput,
  editedText:string,
  options:Readonly<{versionId?:string;createdAt?:string}>={}
):CreditDebtDocumentOutput{
  if(!isCreditDebtDraftResult(previous.documentResult))throw new Error("Несовместимый или неподтверждённый документ.");
  const old=previous.documentResult;
  const text=safe(editedText,35000);
  if(text.length<110||text.length>35000)throw new Error("Некорректная длина отредактированного текста.");
  const warning=old.documentText.split("\n")[0];
  const withoutWarning=text.startsWith(warning)?text.slice(warning.length).trim():text;
  const rest=withoutWarning.replace(/^ТРЕБУЕТСЯ ЮРИДИЧЕСКАЯ ПРОВЕРКА\s*/,"").trim();
  const result=documentResultSchema.parse({
    ...old,versionId:options.versionId??crypto.randomUUID(),
    createdAt:options.createdAt??new Date().toISOString(),source:"USER_EDITED",
    documentText:warning+"\n"+(old.resultKind==="DRAFT"?"ТРЕБУЕТСЯ ЮРИДИЧЕСКАЯ ПРОВЕРКА\n":"")+"\n"+rest,
    usedRuleIds:[],legalRegistryReviewedAt:null,filingReady:false,requiresLegalReview:true
  });
  return {documentResult:result,formData:{...previous.formData}};
}
export function addCreditDebtDocumentVersion(
  previous:readonly DocumentVersionEntry<Readonly<Record<string,string>>>[],
  next:CreditDebtDocumentOutput
):DocumentVersionEntry<Readonly<Record<string,string>>>[]{
  return addDocumentVersion(previous,{documentResult:next.documentResult,payload:next.formData});
}

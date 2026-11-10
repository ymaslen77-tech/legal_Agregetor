import {
  CREDIT_DEBT_COMMON_FACTS,
  CREDIT_DEBT_GROUPS,
  CREDIT_DEBT_PUBLICATION_GATE,
  type CreditDebtGroup,
  type CreditDebtSituation
} from "@/data/credit-debt-route-plan";
import { getCreditDebtLegalSourceCandidates } from "@/data/credit-debt-legal-review";

/**
 * Stage 1 of the credit/debt program: 35 non-public, deterministic intake paths.
 * Not a legal opinion, not a document generator, not an eligibility calculation.
 * Does not import Prisma, write to a database, or perform a network request.
 */
export type CreditDebtInputKind = "text" | "textarea" | "choice" | "date";
export type CreditDebtInputField = {
  key: string;
  label: string;
  kind: CreditDebtInputKind;
  required: boolean;
  choices?: readonly string[];
};
export type CreditDebtIntakeSpec = {
  groupId: string;
  groupTitle: string;
  situationId: string;
  situationTitle: string;
  risk: CreditDebtSituation["risk"];
  targetResult: CreditDebtSituation["targetResult"];
  fields: readonly CreditDebtInputField[];
  linkedArea: string | null;
  sourceCandidates: readonly { label: string; url: string }[];
  publicationEnabled: false;
  documentGenerationAllowed: false;
};
export type CreditDebtIntakeAssessment = {
  stage: "INTAKE_PREPARATION_ONLY";
  status: "NEEDS_DETAILS" | "CHECKLIST_ONLY" | "URGENT_SAFETY_FIRST" | "SPECIALIST_ROUTE";
  missing: string[];
  invalid: string[];
  complete: boolean;
  checklist: string[];
  documentsToGather: string[];
  sourceCandidates: CreditDebtIntakeSpec["sourceCandidates"];
  requiresLegalVerification: true;
  filingReady: false;
  documentText: null;
  canGenerateDocument: false;
  linkedArea: string | null;
};

const answerRole = ["заёмщик", "созаёмщик", "поручитель", "кредитор", "наследник", "представитель", "не знаю"] as const;
const yesNo = ["да", "нет", "не знаю"] as const;
const stageOptions = [
  "заключение договора", "действующий договор", "просрочка", "претензия кредитору",
  "коллектор", "судебный приказ", "исковое производство", "исполнительное производство",
  "банкротство", "не знаю"
] as const;
const base: readonly CreditDebtInputField[] = [
  { key:"role",label:"Ваша роль",kind:"choice",required:true,choices:answerRole },
  { key:"creditor",label:"Кредитор или взыскатель (без паспортных данных)",kind:"text",required:true },
  { key:"stage",label:"Стадия спора",kind:"choice",required:true,choices:stageOptions },
  { key:"summary",label:"Что произошло и какого результата вы хотите?",kind:"textarea",required:true },
  { key:"knownDates",label:"Важные даты и даты получения уведомлений (если известны)",kind:"textarea",required:true },
  { key:"evidence",label:"Какие документы или доказательства есть?",kind:"textarea",required:true }
];
const field=(key:string,label:string,kind:CreditDebtInputKind="textarea",required=true,choices?:readonly string[]):CreditDebtInputField =>
  ({key,label,kind,required,...(choices?{choices}:{})});
const groupFields: Record<string, readonly CreditDebtInputField[]> = {
  "contract-terms":[
    field("product","Тип кредита", "choice",true,["потребительский кредит","кредитная карта","заём","целевой кредит","не знаю"]),
    field("contractCopy","Есть ли договор и индивидуальные условия?", "choice",true,yesNo),
    field("contractTerms","Спорные условия и редакции договора")
  ],
  "fees-addons":[
    field("chargedProduct","Какое списание/услуга/страхование оспаривается?"),
    field("separateConsent","Есть ли отдельное подтверждение согласия?", "choice",true,yesNo),
    field("paymentEvidence","Какие суммы списаны и где подтверждение?")
  ],
  "payment-difficulties":[
    field("paymentDifficulty","Причина изменения финансового положения","choice",true,["снижение дохода","чрезвычайная ситуация","мобилизация или военная служба","другая","не знаю"]),
    field("previousRelief","Предоставлялись ли ранее каникулы или реструктуризация?","choice",true,yesNo),
    field("incomeEvidence","Какие доказательства основания и доходов имеются?")
  ],
  "microloans":[
    field("mfoStatus","Известен ли реальный кредитор МФО?","choice",true,yesNo),
    field("loanTiming","Дата займа, продлений и спорных начислений"),
    field("paymentHistory","Какой есть расчёт или история платежей?")
  ],
  "collectors":[
    field("collectorIdentity","Кто звонит или предъявляет требование?"),
    field("contactsEvidence","Даты, способы и частота контактов, доказательства"),
    field("threatsNow","Есть ли непосредственные угрозы безопасности?","choice",true,yesNo)
  ],
  "court-debt":[
    field("judicialDocument","Какой судебный документ получен?","choice",true,["приказ","исковое заявление","решение","заочное решение","исполнительный лист","не знаю"]),
    field("receiptDate","Дата получения копии судебного документа (если известна)","date",false),
    field("courtEvidence","Что известно о суде, вручении и содержании требования?")
  ]
};
export const CREDIT_DEBT_STAGE_ONE_GROUP_IDS = Object.freeze([
  "contract-terms","fees-addons","payment-difficulties","microloans","collectors","court-debt"
] as const);
export function getCreditDebtStageOneGroups(): readonly CreditDebtGroup[] {
  return CREDIT_DEBT_GROUPS.filter(group=>CREDIT_DEBT_STAGE_ONE_GROUP_IDS.some(id=>id===group.id));
}
export function getCreditDebtIntakeSpec(groupId:string,situationId:string):CreditDebtIntakeSpec|null {
  const group=getCreditDebtStageOneGroups().find(g=>g.id===groupId);
  const situation=group?.situations.find(s=>s.id===situationId);
  if(!group||!situation)return null;
  const linkedArea=situation.crossLinkArea;
  const fields=situation.targetResult==="SAFETY_ESCALATION"||situation.targetResult==="FRAUD_REFERRAL"
    ? []
    : [...base,...groupFields[groupId],
      field("caseSpecific",`Уточните обстоятельства: ${situation.caseFacts}`)];
  const sourceCandidates=getCreditDebtLegalSourceCandidates(groupId)
    .map(candidate=>({label:candidate.title,url:candidate.url}));
  return {
    groupId,groupTitle:group.title,situationId,situationTitle:situation.title,
    risk:situation.risk,targetResult:situation.targetResult,fields,
    linkedArea,sourceCandidates,
    publicationEnabled:CREDIT_DEBT_PUBLICATION_GATE.publicUrlsEnabled,
    documentGenerationAllowed:CREDIT_DEBT_PUBLICATION_GATE.documentGenerationAllowed
  };
}
function validDate(value:string):boolean {
  if(!/^\d{4}-\d{2}-\d{2}$/.test(value))return false;
  const [year,month,day]=value.split("-").map(Number);
  if(year<1900||year>2100)return false;
  const d=new Date(Date.UTC(year,month-1,day));
  return d.getUTCFullYear()===year&&d.getUTCMonth()===month-1&&d.getUTCDate()===day;
}
function checks(groupId:string):string[]{
  const global=[
    "Уточните сторону обязательства, статус заявителя и фактическую стадию спора.",
    "Сверьте договор и обстоятельства с первичными документами; не определяйте размер требований по одному описанию.",
    "Перед подготовкой документа проверьте применимую редакцию нормы, адресата, сроки, обязательный порядок и приложения."
  ];
  const specific:Record<string,string>={
    "contract-terms":"Сопоставьте индивидуальные условия, тарифы, уведомления и фактические платежи.",
    "fees-addons":"Уточните кто оказывал дополнительную услугу и есть ли отдельное согласие, отдельный договор и условия отказа.",
    "payment-difficulties":"Различайте установленные законом кредитные каникулы и договорную реструктуризацию: условия и последствия могут различаться.",
    "microloans":"Сверьте дату выдачи займа, каждый период начислений и применимые к этой дате ограничения.",
    "collectors":"Зафиксируйте способ и время взаимодействия; отдельно выясните полномочия взыскателя и наличие угроз.",
    "court-debt":"Проверьте реальный вид судебного акта, его вручение и применимые процессуальные сроки. Не считайте срок от даты вынесения без проверки."
  };
  return [...global,specific[groupId]];
}
export function evaluateCreditDebtStageOne(
  spec:CreditDebtIntakeSpec,
  answers:Readonly<Record<string,string|undefined>>
):CreditDebtIntakeAssessment{
  if(!CREDIT_DEBT_STAGE_ONE_GROUP_IDS.some(id=>id===spec.groupId))
    throw new Error("Only stage-one groups are permitted");
  const urgent=spec.targetResult==="SAFETY_ESCALATION"||spec.targetResult==="FRAUD_REFERRAL";
  const missing:string[]=[];
  const invalid:string[]=[];
  if(!urgent){
    for(const field of spec.fields){
      const v=(answers[field.key]??"").trim();
      if(!v){if(field.required)missing.push(field.key);continue;}
      if(v.length>2000 || (field.kind==="text"&&v.length>250) ||
        (field.kind==="choice"&&!field.choices?.includes(v)) ||
        (field.kind==="date"&&!validDate(v)))invalid.push(field.key);
    }
  }
  const incomplete=missing.length>0||invalid.length>0;
  const priority=urgent||spec.groupId==="collectors"&&answers.threatsNow==="да";
  const status:CreditDebtIntakeAssessment["status"]=
    priority?"URGENT_SAFETY_FIRST":spec.targetResult==="CROSS_LINK"?"SPECIALIST_ROUTE":
      incomplete?"NEEDS_DETAILS":"CHECKLIST_ONLY";
  const checklist=priority?[
    "При непосредственной угрозе жизни или здоровью обратитесь в экстренные службы; не откладывайте защиту ради заполнения формы.",
    "Не передавайте коды доступа, пароли и реквизиты третьим лицам; сохраняйте доказательства безопасным способом.",
    "Сообщите о подозрении на мошенничество или угрозах в компетентные органы и уведомите финансовую организацию при наличии спорного займа."
  ]:checks(spec.groupId);
  return {
    stage:"INTAKE_PREPARATION_ONLY",status,missing,invalid,complete:!incomplete&&!priority,
    checklist,
    documentsToGather:priority?["Имеющиеся сообщения и подтверждения, если собирать их безопасно"]:
      ["Договор и индивидуальные условия (если есть)","Платёжные документы и выписки",
       "Письменные уведомления и ответы", "Судебные акты и сведения о вручении, если спор дошёл до суда"],
    sourceCandidates:spec.sourceCandidates,
    requiresLegalVerification:true,
    filingReady:false,
    documentText:null,
    canGenerateDocument:false,
    linkedArea:spec.linkedArea
  };
}

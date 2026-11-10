import {
  CREDIT_DEBT_GROUPS,CREDIT_DEBT_PUBLICATION_GATE,CREDIT_DEBT_SOURCE_CANDIDATES,
  type CreditDebtGroup, type CreditDebtSituation
} from "@/data/credit-debt-route-plan";
import {
  evaluateCreditDebtStageOne, getCreditDebtIntakeSpec,
  type CreditDebtInputField, type CreditDebtIntakeSpec,
  type CreditDebtIntakeAssessment
} from "@/lib/credit-debt-stage-one";

/** Same UI/form contract for all 60 situations; no legal-document output. */
const choice=(key:string,label:string,values:readonly string[],required=true):CreditDebtInputField=>
  ({key,label,kind:"choice",choices:values,required});
const field=(key:string,label:string,required=true):CreditDebtInputField=>
  ({key,label,kind:"textarea",required});
const yesNo=["да","нет","не знаю"] as const;
const groupSpecificFields:Record<string, readonly CreditDebtInputField[]>={
  mortgage:[
    choice("propertyType","Какой вид недвижимости находится в залоге?",["квартира","дом","земельный участок","иной объект","не знаю"]),
    choice("mortgageStatus","Каково текущее состояние ипотеки?",["действует","просрочка","судебный спор","погашена","не знаю"]),
    field("propertyRights","Что известно о залоге, собственниках, правах детей и уведомлениях?")
  ],
  "history-fraud":[
    choice("historyIssue","Что обнаружено?",["неверная запись","чужой кредит","незакрытый кредит","проблема самозапрета","не знаю"]),
    choice("contactStatus","Сообщали ли уже о проблеме в БКИ или кредитору?",yesNo),
    field("creditRecord","Какие сведения видны в кредитной истории или ответе организации?")
  ],
  guarantors:[
    choice("obligationRole","Какую роль вы исполняете в обязательстве?",["поручитель","созаёмщик","заёмщик","супруг или супруга","наследник","кредитор","не знаю"]),
    field("separateDocuments","Какие договоры поручительства, совместных обязательств или соглашения имеются?"),
    field("paymentsBetweenParties","Известны ли платежи, требования другой стороны и доказательства их получения?")
  ],
  bankruptcy:[
    choice("bankruptcyPath","Какую процедуру рассматриваете?",["через МФЦ","через арбитражный суд","не определено"]),
    choice("enforcement","Имеются ли исполнительные производства?",["есть действующее","окончено или прекращено","нет","не знаю"]),
    field("debtsOverview","Какие виды долгов и кредиторов известны? Укажите условные сведения без реквизитов."),
    field("incomeAndProperty","Какие виды доходов и имущества имеются? Без личных данных."),
    field("pastTransactions","Были ли значимые имущественные сделки или передачи активов?",false)
  ]
};
const base:readonly CreditDebtInputField[]=[
  choice("role","Ваш статус",["должник","заёмщик","кредитор","созаёмщик","поручитель","наследник","супруг или супруга","представитель","не знаю"]),
  field("creditor","Кто участники обязательства? Без идентификаторов и реквизитов."),
  choice("stage","На какой стадии дело?",["действующее обязательство","просрочка","досудебный спор","суд","исполнение","банкротство","не знаю"]),
  field("summary","Что произошло и какого результата вы хотите?"),
  field("knownDates","Ключевые даты, сроки и фактическое получение документов"),
  field("evidence","Какие подтверждающие документы имеются?")
];
export type CreditDebtSkeletonSpec=CreditDebtIntakeSpec;
export type CreditDebtSkeletonAssessment=CreditDebtIntakeAssessment;
export function getCreditDebtSkeletonGroups():readonly CreditDebtGroup[]{
  return CREDIT_DEBT_GROUPS;
}
export function getCreditDebtSkeletonSituation(groupId:string,situationId:string):CreditDebtSituation|null{
  return CREDIT_DEBT_GROUPS.find(group=>group.id===groupId)?.situations.find(s=>s.id===situationId)??null;
}
export function getCreditDebtSkeletonSpec(groupId:string,situationId:string):CreditDebtSkeletonSpec|null{
  const first=getCreditDebtIntakeSpec(groupId,situationId);
  if(first)return first;
  const group=CREDIT_DEBT_GROUPS.find(x=>x.id===groupId);
  const situation=group?.situations.find(x=>x.id===situationId);
  if(!group||!situation)return null;
  const emergency=situation.targetResult==="FRAUD_REFERRAL"||situation.targetResult==="SAFETY_ESCALATION";
  const fields=emergency?[]:[
    ...base,...(groupSpecificFields[groupId]??[]),
    field("situationDetail","Уточните обстоятельства: "+situation.caseFacts)
  ];
  return {
    groupId,groupTitle:group.title,situationId,situationTitle:situation.title,
    risk:situation.risk,targetResult:situation.targetResult,fields,
    linkedArea:situation.crossLinkArea,
    sourceCandidates:group.sourceKeys.map(key=>CREDIT_DEBT_SOURCE_CANDIDATES[key]).map(x=>({label:x.title,url:x.url})),
    publicationEnabled:CREDIT_DEBT_PUBLICATION_GATE.publicUrlsEnabled,
    documentGenerationAllowed:CREDIT_DEBT_PUBLICATION_GATE.documentGenerationAllowed
  };
}
function isDate(value:string):boolean{
  if(!/^\d{4}-\d{2}-\d{2}$/.test(value))return false;
  const [y,m,d]=value.split("-").map(Number);
  const parsed=new Date(Date.UTC(y,m-1,d));
  return parsed.getUTCFullYear()===y&&parsed.getUTCMonth()===m-1&&parsed.getUTCDate()===d;
}
/**
 * Stage 2 uses a deterministic checklist until specific norms/eligibility
 * conditions are independently confirmed. No benefit/debt discharge claims.
 */
export function evaluateCreditDebtSkeleton(
  spec:CreditDebtSkeletonSpec,
  answers:Readonly<Record<string,string|undefined>>
):CreditDebtSkeletonAssessment{
  const first=getCreditDebtIntakeSpec(spec.groupId,spec.situationId);
  if(first)return evaluateCreditDebtStageOne(first,answers);
  if(!getCreditDebtSkeletonSituation(spec.groupId,spec.situationId))
    throw new Error("Unknown credit/debt situation");
  const urgent=spec.targetResult==="FRAUD_REFERRAL"||spec.targetResult==="SAFETY_ESCALATION";
  const missing:string[]=[];
  const invalid:string[]=[];
  if(!urgent)for(const field of spec.fields){
    const value=(answers[field.key]??"").trim();
    if(!value){if(field.required)missing.push(field.key);continue;}
    if(value.length>2000||(field.kind==="text"&&value.length>250)||
      (field.kind==="choice"&&!field.choices?.includes(value))||
      (field.kind==="date"&&!isDate(value)))invalid.push(field.key);
  }
  const complete=!urgent&&missing.length===0&&invalid.length===0;
  const status:CreditDebtSkeletonAssessment["status"]=urgent?"URGENT_SAFETY_FIRST":
    spec.targetResult==="CROSS_LINK"?"SPECIALIST_ROUTE":
    complete?"CHECKLIST_ONLY":"NEEDS_DETAILS";
  const checks:Record<string,string[]>={
    mortgage:[
      "Проверьте документы о залоге, право собственности, уведомления кредитора и историю платежей.",
      "Уточните права созаёмщиков, собственников и детей. Нельзя автоматически обещать сохранение заложенного жилья.",
      "Правовой результат и срок обращения зависят от конкретного требования и действующей редакции закона."
    ],
    "history-fraud":[
      "Сохраните имеющуюся выписку из кредитной истории и письменные ответы участников.",
      "Уточните основание спорной записи и направляйте персональные документы только через проверенные официальные каналы.",
      "Самозапрет и исправление истории имеют разные основания, сроки и процедуры."
    ],
    guarantors:[
      "Отдельно определите основание ответственности каждого участника обязательства.",
      "Проверьте договор, уведомления, движение платежей и применимость выбранного способа защиты.",
      "Не считайте долг общим для супругов только из факта брака."
    ],
    bankruptcy:[
      "Разграничьте судебное банкротство и внесудебную процедуру через МФЦ: основания и порядок различаются.",
      "Соберите перечень кредиторов, виды обязательств, сведения об имуществе, доходах и исполнительных производствах.",
      "Отдельно проверьте залог, совместное имущество, спорные сделки, исключения из освобождения от долгов и действующую редакцию закона.",
      "Нельзя обещать автоматическое списание долгов или сохранение жилья без проверки условий."
    ]
  };
  return {
    stage:"INTAKE_PREPARATION_ONLY",status,missing,invalid,complete,
    checklist:urgent?[
      "При непосредственной угрозе обратитесь за экстренной помощью; не откладывайте защиту ради заполнения анкеты.",
      "Не передавайте пароли, коды, копии документов и реквизиты подозрительным лицам.",
      "Сохраните доказательства безопасным способом и используйте официальные каналы кредитора и уполномоченных органов."
    ]:checks[spec.groupId]??[],
    documentsToGather:urgent?["Доступные безопасные доказательства без передачи их в этот сервис"]:[
      "Договоры, уведомления и платёжные документы",
      "Судебные акты и документы по исполнительному производству, если они имеются",
      "Подтверждения прав на имущество и состава обязательств, когда это относится к выбранной ситуации"
    ],
    sourceCandidates:spec.sourceCandidates,requiresLegalVerification:true,
    filingReady:false,documentText:null,canGenerateDocument:false,linkedArea:spec.linkedArea
  };
}

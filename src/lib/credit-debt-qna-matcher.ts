import { getQnaLegalAreaByServiceSlug } from "@/data/legal-qna-taxonomy";
import { getCreditDebtStageOneGroups } from "@/lib/credit-debt-stage-one";

/**
 * NON-PUBLIC RESEARCH CLASSIFIER — evidence-only candidates for Q&A planning.
 * Historic imported Service.slug might reflect the lawyer's specialization,
 * not the actual legal problem; a specific title/text signal is mandatory.
 * Never publishes, changes Question.serviceId, or claims legal certainty.
 * Do not log or persist raw question text through this module.
 */
export const CREDIT_DEBT_QNA_SIGNALS: Readonly<Record<string,readonly string[]>> = {
  "contract-terms/loan-contract-review": [
    "проверить условия кредитного договора",
    "непонятные условия кредита"
  ],
  "contract-terms/total-cost-dispute": [
    "полная стоимость кредита неверная",
    "пск по кредиту неверная"
  ],
  "contract-terms/credit-card-terms": [
    "льготный период кредитной карты",
    "изменили лимит кредитной карты"
  ],
  "contract-terms/early-repayment": [
    "досрочное погашение кредита",
    "досрочно погасил кредит"
  ],
  "contract-terms/funds-not-issued": [
    "кредит не выдали",
    "банк не выдал деньги по кредиту"
  ],
  "contract-terms/unilateral-change": [
    "банк изменил условия кредита",
    "банк повысил ставку по кредиту"
  ],
  "fees-addons/imposed-insurance": [
    "навязали страховку при оформлении кредита",
    "банк навязал страховку по кредиту"
  ],
  "fees-addons/insurance-cancellation": [
    "возврат страховки по кредиту",
    "отказаться от страховки по кредиту"
  ],
  "fees-addons/paid-subscriptions": [
    "навязали платную подписку с кредитом",
    "навязали платные услуги при кредите"
  ],
  "fees-addons/unlawful-fee": [
    "комиссия за выдачу кредита",
    "незаконная комиссия по кредиту"
  ],
  "fees-addons/interest-calculation": [
    "банк неправильно начислил проценты",
    "ошибка в расчете процентов по кредиту"
  ],
  "fees-addons/penalties-and-fines": [
    "неустойка по кредиту",
    "штрафы и пени по кредиту"
  ],
  "payment-difficulties/credit-holidays": [
    "имею право на кредитные каникулы",
    "подхожу ли под кредитные каникулы"
  ],
  "payment-difficulties/credit-holidays-request": [
    "подать заявление на кредитные каникулы",
    "оформить кредитные каникулы через банк"
  ],
  "payment-difficulties/credit-holidays-rejection": [
    "отказали в кредитных каникулах",
    "банк не одобрил кредитные каникулы"
  ],
  "payment-difficulties/restructuring-request": [
    "реструктуризация кредита в банке",
    "попросить реструктуризацию долга"
  ],
  "payment-difficulties/payment-allocation": [
    "банк неправильно зачел платеж",
    "банк не учел оплату кредита"
  ],
  "payment-difficulties/military-special-benefits": [
    "кредитные льготы участникам сво",
    "кредитные каникулы военнослужащего"
  ],
  "microloans/microloan-rate": [
    "проценты по микрозайму",
    "процентная ставка мфо"
  ],
  "microloans/microloan-overpayment": [
    "мфо начислила больше процентов",
    "превышен предел процентов по микрозайму"
  ],
  "microloans/microloan-extension": [
    "платное продление микрозайма",
    "пролонгация договора микрозайма"
  ],
  "microloans/microloan-not-mine": [
    "микрозайм оформили без моего согласия",
    "чужой микрозайм на мое имя"
  ],
  "microloans/microloan-payment-missing": [
    "мфо не учла погашение",
    "микрозайм оплатил но долг остался"
  ],
  "collectors/harassing-calls": [
    "коллекторы звонят каждый день",
    "коллекторы постоянно звонят"
  ],
  "collectors/contact-third-parties": [
    "коллекторы звонят родственникам",
    "коллекторы звонят работодателю"
  ],
  "collectors/threats-and-pressure": [
    "коллекторы угрожают расправой",
    "угрозы коллекторов должнику"
  ],
  "collectors/unknown-collector": [
    "неизвестный коллектор требует деньги",
    "непонятная организация требует долг"
  ],
  "collectors/disputed-assignment": [
    "передача долга коллекторам",
    "уступили долг без уведомления"
  ],
  "collectors/collector-refusal-contact": [
    "отказ от взаимодействия с коллекторами",
    "как отказаться от звонков коллекторов"
  ],
  "court-debt/court-order-received": [
    "получил судебный приказ по кредиту",
    "судебный приказ по займу"
  ],
  "court-debt/court-order-objection": [
    "отмена судебного приказа по кредиту",
    "возражения на судебный приказ по кредиту"
  ],
  "court-debt/creditor-lawsuit": [
    "банк подал иск о взыскании долга",
    "мфо подала иск в суд"
  ],
  "court-debt/limitation-defense": [
    "исковая давность по кредиту",
    "срок давности по кредитному долгу"
  ],
  "court-debt/default-judgment": [
    "заочное решение по кредиту",
    "получил заочное решение о взыскании долга"
  ],
  "court-debt/enforcement-after-court": [
    "пристав арестовал счет за кредит",
    "приставы списали кредитный долг"
  ]
};
function norm(text:string):string{
  return text.toLocaleLowerCase("ru").replace(/ё/g,"е")
    .replace(/[^a-zа-я0-9]+/gi," ").replace(/\s+/g," ").trim();
}
export type CreditDebtQnaCandidate = {
  groupId: string;
  situationId: string;
  matchedSignals: string[];
  status: "CANDIDATE_ONLY_REVIEW_REQUIRED";
};
export function proposeCreditDebtQnaSituations(input:{
  serviceSlug:string;
  title:string;
  text?:string;
}):CreditDebtQnaCandidate[]{
  const area=getQnaLegalAreaByServiceSlug(input.serviceSlug);
  if(area?.id!=="credit-bankruptcy")return [];
  const content=norm(input.title+" "+(input.text??""));
  if(content.length<15||content.length>25000)return [];
  const possible=getCreditDebtStageOneGroups().flatMap(group=>group.situations.map(situation=>{
    const matchedSignals=(CREDIT_DEBT_QNA_SIGNALS[group.id+"/"+situation.id]??[])
      .filter(signal=>content.includes(norm(signal)));
    return {groupId:group.id,situationId:situation.id,matchedSignals,
      status:"CANDIDATE_ONLY_REVIEW_REQUIRED" as const};
  })).filter(item=>item.matchedSignals.length>0);
  return possible.sort((a,b)=>b.matchedSignals.length-a.matchedSignals.length||
    Math.max(...b.matchedSignals.map(s=>s.length))-Math.max(...a.matchedSignals.map(s=>s.length))||
    a.groupId.localeCompare(b.groupId)||a.situationId.localeCompare(b.situationId)).slice(0,5);
}

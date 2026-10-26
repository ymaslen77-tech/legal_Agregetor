/**
 * Each military situation asks only facts that cannot be established from
 * the selected scenario. Defaults represent explicit route context, not
 * independently verified facts about the applicant.
 */
type IntakePlan={
 fields:readonly string[];
 defaults?:Readonly<Record<string,string>>;
 labels:Readonly<Record<string,string>>;
};
export const MILITARY_INTAKE_PLANS:Readonly<Record<string,IntakePlan>>={
 "contract-check":{
  fields:["role","contract"],defaults:{regime:"контракт"},
  labels:{contract:"Какое условие контракта нужно уточнить?"}
 },
 "service-order-copy":{
  fields:["role","order","authority"],defaults:{regime:"контракт"},
  labels:{order:"Какой приказ или ответ вам нужен?",authority:"В какой орган или к какому должностному лицу обратитесь?"}
 },
 "transfer":{
  fields:["role","order"],defaults:{regime:"контракт"},
  labels:{order:"Что известно о переводе или приказе?"}
 },
 "discharge-basis":{
  fields:["role","regime","grounds"],
  labels:{grounds:"Какое основание увольнения указано или обсуждается?"}
 },
 "medical-discharge":{
  fields:["role","regime","medical"],
  labels:{medical:"Есть ли заключение ВВК и что в нём указано о годности? Без диагноза."}
 },
 "discharge-order":{
  fields:["role","regime","order"],
  labels:{order:"Какого приказа или расчёта вам не хватает?"}
 },
 "pay-breakdown":{
  fields:["role","regime","payments","authority"],
  labels:{payments:"За какой период нужны сведения о начислениях?",authority:"Кому направите запрос о выплатах?"}
 },
 "benefits":{
  fields:["role","regime","payments"],
  labels:{payments:"Какую выплату или компенсацию нужно проверить?"}
 },
 "family-benefits":{
  fields:["regime","family","payments"],defaults:{role:"член семьи"},
  labels:{regime:"Как проходил службу военнослужащий?",family:"Какие родство и обстоятельства подтверждены?",payments:"О какой выплате идёт речь?"}
 },
 "vvk-conclusion":{
  fields:["role","regime","medical","urgency"],
  labels:{medical:"Какое заключение ВВК получено и когда?",urgency:"Нужна ли помощь врача прямо сейчас?"}
 },
 "independent-review":{
  fields:["role","regime","medical","urgency"],
  labels:{medical:"Какое заключение ВВК хотите перепроверить?",urgency:"Нужна ли помощь врача прямо сейчас?"}
 },
 "request-explanation":{
  fields:["role","regime","decision","authority"],
  labels:{decision:"Какое решение или действие нужно разъяснить?",authority:"Кому направите запрос?"}
 },
 "challenge-decision":{
  fields:["role","regime","decision","receipt"],
  labels:{decision:"Какое решение вы оспариваете?",receipt:"Когда и как вы узнали о решении?"}
 },
 "inaction":{
  fields:["role","regime","decision","receipt"],
  labels:{decision:"На какое обращение не получили ответ?",receipt:"Когда вы направили обращение и чем это подтверждается?"}
 },
 "draft-notice":{
  fields:["role","regime","summons"],
  labels:{summons:"Какую повестку или решение получили и когда?"}
 },
 "deferment":{
  fields:["role","regime","deferment"],
  labels:{deferment:"Какое основание отсрочки подтверждают ваши документы?"}
 },
 "challenge-draft":{
  fields:["role","regime","summons","receipt"],
  labels:{summons:"Какое решение о призыве хотите оспорить?",receipt:"Когда и как вам вручили решение?"}
 }
};

export function getMilitaryIntakePlan(scenarioKey:string):IntakePlan{
 const plan=MILITARY_INTAKE_PLANS[scenarioKey];
 if(!plan)throw new Error("Missing targeted military intake: "+scenarioKey);
 return plan;
}

/** Do not overwrite user-provided values: contradictory facts still trigger safety checks. */
export function resolveMilitaryIntakeAnswers(
 scenarioKey:string,
 answers:Readonly<Record<string,string|undefined>>
):Record<string,string|undefined>{
 const defaults=MILITARY_INTAKE_PLANS[scenarioKey]?.defaults??{};
 return {...defaults,...answers};
}

export function militaryIntakeQuestionLabel(scenarioKey:string,field:{key:string;label:string}):string{
 return MILITARY_INTAKE_PLANS[scenarioKey]?.labels[field.key]??field.label;
}

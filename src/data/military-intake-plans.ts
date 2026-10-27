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
  labels:{contract:"Условие контракта, требующее разъяснения"}
 },
 "service-order-copy":{
  fields:["role","order","authority"],defaults:{regime:"контракт"},
  labels:{order:"Нужный приказ или ответ (номер и дата, если известны)",authority:"Адресат обращения"}
 },
 "transfer":{
  fields:["role","order"],defaults:{regime:"контракт"},
  labels:{order:"Сведения о переводе или приказе"}
 },
 "discharge-basis":{
  fields:["role","regime","grounds"],
  labels:{grounds:"Указанное основание увольнения"}
 },
 "medical-discharge":{
  fields:["role","regime","medical"],
  labels:{medical:"Заключение ВВК и категория годности (без диагноза)"}
 },
 "discharge-order":{
  fields:["role","regime","order"],
  labels:{order:"Недостающий приказ или расчёт"}
 },
 "pay-breakdown":{
  fields:["role","regime","payments","authority"],
  labels:{payments:"Период спорных начислений",authority:"Адресат запроса о начислениях"}
 },
 "benefits":{
  fields:["role","regime","payments"],
  labels:{payments:"Выплата или компенсация"}
 },
 "family-benefits":{
  fields:["regime","family","payments"],defaults:{role:"член семьи"},
  labels:{regime:"Вид службы военнослужащего",family:"Родство и подтверждённые обстоятельства",payments:"Выплата, за которой обращаетесь"}
 },
 "vvk-conclusion":{
  fields:["role","regime","medical","urgency"],
  labels:{medical:"Заключение ВВК: дата и вывод о годности",urgency:"Неотложная помощь необходима сейчас?"}
 },
 "independent-review":{
  fields:["role","regime","medical","urgency"],
  labels:{medical:"Заключение ВВК для перепроверки",urgency:"Неотложная помощь необходима сейчас?"}
 },
 "request-explanation":{
  fields:["role","regime","decision","authority"],
  labels:{decision:"Решение или действие для разъяснения",authority:"Адресат запроса"}
 },
 "challenge-decision":{
  fields:["role","regime","decision","receipt"],
  labels:{decision:"Оспариваемое решение (номер, дата)",receipt:"Дата и способ получения решения"}
 },
 "inaction":{
  fields:["role","regime","decision","receipt"],
  labels:{decision:"Обращение, оставшееся без ответа",receipt:"Дата направления и подтверждение отправки"}
 },
 "draft-notice":{
  fields:["role","regime","summons"],
  labels:{summons:"Повестка или решение: дата и вид"}
 },
 "deferment":{
  fields:["role","regime","deferment"],
  labels:{deferment:"Основание возможной отсрочки и документы"}
 },
 "challenge-draft":{
  fields:["role","regime","summons","receipt"],
  labels:{summons:"Оспариваемое решение о призыве",receipt:"Дата и способ вручения решения"}
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
 const standardLabels:Readonly<Record<string,string>>={role:"Статус заявителя",regime:"Вид службы"};
 return MILITARY_INTAKE_PLANS[scenarioKey]?.labels[field.key]??standardLabels[field.key]??field.label;
}

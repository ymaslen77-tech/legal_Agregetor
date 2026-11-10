/**
 * Legal context facts cross-checked on 10 Nov 2026. These facts are relevant
 * starting points, not adjudication, not exhaustive statutory conditions and
 * NEVER a filing-readiness flag for an individual 60-situation branch.
 * Two independent publishers must support each exact core proposition.
 */
export type CreditDebtCheckedContext=Readonly<{
  id:string;
  appliesTo:readonly string[];
  proposition:string;
  status:"CONTEXT_ONLY_VERIFIED_NOT_SCENARIO_READY";
  asOf:"2026-11-10";
  limitations:string;
  sources:readonly Readonly<{
    publisher:string;type:"OFFICIAL_EXPLANATION"|"LEGAL_TEXT";
    url:string;supports:string;
  }>[];
}>;
export const CREDIT_DEBT_CHECKED_CONTEXT:readonly CreditDebtCheckedContext[]=[
  {
    id:"mfc-debt-range",
    appliesTo:["bankruptcy/out-of-court-mfc","bankruptcy/bankruptcy-eligibility"],
    proposition:"Внесудебная процедура банкротства гражданина через МФЦ предусматривает общий размер обязательств от 25 000 до 1 000 000 рублей при наличии иных установленных законом оснований.",
    status:"CONTEXT_ONLY_VERIFIED_NOT_SCENARIO_READY",
    asOf:"2026-11-10",
    limitations:"Необходимо отдельно установить подходящее основание, состав обязательств, исключения, наличие исполнительного документа, дату обращения и действующую редакцию. Публикация ФНС обозначена как архивная.",
    sources:[
      {publisher:"ФНС России",type:"OFFICIAL_EXPLANATION",
        url:"https://www.nalog.gov.ru/rn38/news/activities_fts/16640726/",supports:"Диапазон суммы и обращение в МФЦ"},
      {publisher:"КонсультантПлюс",type:"LEGAL_TEXT",
        url:"https://www.consultant.ru/document/cons_doc_LAW_39331/c48290d39215783e73f0899bb1026b14cb221eff/",
        supports:"Статья 223.2 закона № 127-ФЗ: сумма, дополнительные основания и процедура"}
    ]
  },
  {
    id:"consumer-credit-holidays-income",
    appliesTo:["payment-difficulties/credit-holidays","payment-difficulties/credit-holidays-request","payment-difficulties/credit-holidays-rejection"],
    proposition:"Для определённого вида потребительских кредитных каникул закон рассматривает снижение дохода более чем на 30% за установленный период как одно из оснований, но требует соблюдения дополнительных условий.",
    status:"CONTEXT_ONLY_VERIFIED_NOT_SCENARIO_READY",
    asOf:"2026-11-10",
    limitations:"Нельзя переносить правило на ипотечные каникулы, специальные военные режимы или любую просрочку без проверки всех ограничений и применимых дат.",
    sources:[
      {publisher:"Банк России",type:"OFFICIAL_EXPLANATION",
        url:"https://www.cbr.ru/faq/w_fin_sector/kreditnye-kanikuly/",supports:"Основания и условия потребительских кредитных каникул, обновление 25.09.2026"},
      {publisher:"КонсультантПлюс",type:"LEGAL_TEXT",
        url:"https://www.consultant.ru/document/cons_doc_LAW_155986/bd7f38ed0b39cca756850bad5e6ea2d460cc2b5c/",
        supports:"Статья 6.1-2 закона № 353-ФЗ: трудная жизненная ситуация и одновременные требования"}
    ]
  },
  {
    id:"credit-history-dispute",
    appliesTo:["history-fraud/incorrect-credit-history","history-fraud/loan-not-mine","history-fraud/refused-credit-history-dispute"],
    proposition:"Гражданин вправе оспаривать неточные сведения кредитной истории через бюро кредитных историй или надлежащий источник формирования таких сведений.",
    status:"CONTEXT_ONLY_VERIFIED_NOT_SCENARIO_READY",
    asOf:"2026-11-10",
    limitations:"Необходимо установить конкретный спорный атрибут, полномочия источника и правила идентификации; верную отрицательную историю нельзя удалить просто по желанию.",
    sources:[
      {publisher:"Банк России",type:"OFFICIAL_EXPLANATION",
        url:"https://www.cbr.ru/ckki/osparivanie-kreditnoy-istorii/",supports:"Порядок оспаривания и проверка достоверности информации"},
      {publisher:"КонсультантПлюс",type:"LEGAL_TEXT",
        url:"https://www.consultant.ru/document/cons_doc_LAW_51043/602f589cb0d8d7b7127f3446189d6e399778eabb/",
        supports:"Статья 8 закона № 218-ФЗ: право на оспаривание"}
    ]
  },
  {
    id:"insurance-separate-consent",
    appliesTo:["fees-addons/imposed-insurance","fees-addons/paid-subscriptions","fees-addons/insurance-cancellation"],
    proposition:"Отдельные платные услуги и страхование при потребительском кредите требуют проверки согласия заёмщика; его волеизъявление нельзя подменять заранее проставленным согласием.",
    status:"CONTEXT_ONLY_VERIFIED_NOT_SCENARIO_READY",
    asOf:"2026-11-10",
    limitations:"Нельзя автоматически обещать возврат всей страховой премии: срок, вид договора, субъект оказания услуги, цена и редакция закона проверяются отдельно.",
    sources:[
      {publisher:"Роспотребнадзор",type:"OFFICIAL_EXPLANATION",
        url:"https://zpp.rospotrebnadzor.ru/news/regional/573114",supports:"Отдельное волеизъявление на страхование, публикация 09.04.2026"},
      {publisher:"КонсультантПлюс",type:"LEGAL_TEXT",
        url:"https://www.consultant.ru/document/cons_doc_LAW_155986/5bf96f6f9c3054d6934e4fa63a9dac27e0b56b53/",
        supports:"Статья 7 закона № 353-ФЗ: согласие на дополнительные услуги и запрет заранее проставленного согласия"}
    ]
  }
];
export function getCreditDebtCheckedContext(groupId:string,situationId:string):readonly CreditDebtCheckedContext[]{
  const key=groupId+"/"+situationId;
  return CREDIT_DEBT_CHECKED_CONTEXT.filter(item=>item.appliesTo.includes(key));
}

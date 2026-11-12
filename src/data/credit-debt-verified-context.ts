/**
 * Legal context facts cross-checked on 10 Nov 2026. These facts are relevant
 * starting points, not adjudication, not exhaustive statutory conditions and
 * NEVER a filing-readiness flag for an individual 60-situation branch.
 * Two independent publishers supported preliminary context; release now requires three per material claim.
 */
export type CreditDebtCheckedContext=Readonly<{
  id:string;
  appliesTo:readonly string[];
  proposition:string;
  status:"CONTEXT_ONLY_VERIFIED_NOT_SCENARIO_READY";
  asOf:"2026-11-10"|"2026-11-12";
  limitations:string;
  /** Divergent publisher summaries never override the effective statutory wording. */
  officialTextPriorityNote?:string;
  sources:readonly Readonly<{
    publisher:string;type:"OFFICIAL_EXPLANATION"|"AUTHORITY_ACT"|"LEGAL_TEXT";
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
        supports:"Статья 223.2 закона № 127-ФЗ: сумма, дополнительные основания и процедура"},
      {publisher:"Социальный фонд России",type:"OFFICIAL_EXPLANATION",
        url:"https://sfr.gov.ru/press_center/news/~2026/04/06/280163",
        supports:"Актуальный диапазон 25 000–1 000 000 рублей (06.04.2026)"},
      {publisher:"МФЦ Орловской области",type:"OFFICIAL_EXPLANATION",
        url:"https://www.mfc-orel.ru/vbank/",
        supports:"Региональная карточка государственной услуги: диапазон задолженности и необходимость специального основания"}
    ]
  },
  {
    id:"consumer-credit-holidays-income",
    appliesTo:["payment-difficulties/credit-holidays","payment-difficulties/credit-holidays-request","payment-difficulties/credit-holidays-rejection"],
    proposition:"Для определённого вида потребительских кредитных каникул закон рассматривает снижение дохода более чем на 30% за установленный период как одно из оснований, но требует соблюдения дополнительных условий.",
    status:"CONTEXT_ONLY_VERIFIED_NOT_SCENARIO_READY",
    asOf:"2026-11-10",
    limitations:"Нельзя переносить правило на ипотечные каникулы, специальные военные режимы или любую просрочку без проверки всех ограничений и применимых дат.",
    officialTextPriorityNote:"Действующая часть 2 статьи 6.1-2 закона №353-ФЗ использует условие «более чем на 30 процентов», а FAQ Банка России (25.09.2026) пишет «минимум на 30%». При расхождении применяется точный текст закона. Ровно 30% не означает автоматически выполненное условие; нужен расчёт и проверка других требований.",
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
  },
{
  "id": "credit-early-repayment",
  "appliesTo": [
    "contract-terms/early-repayment",
    "contract-terms/loan-contract-review"
  ],
  "proposition": "По потребительскому кредиту заёмщик в общем случае вправе досрочно погасить задолженность полностью или частично с соблюдением применимых правил уведомления кредитора и уплатой процентов за фактический срок пользования средствами.",
  "limitations": "Для отдельных сроков и видов кредита предусмотрены особые правила, включая возврат в течение первых 14 или 30 дней. Не проверены дата договора, статус кредита, уведомление и фактический расчёт.",
  "sources": [
    {
      "publisher": "Банк России",
      "type": "OFFICIAL_EXPLANATION",
      "url": "https://www.cbr.ru/faq/bank_s/kredity/",
      "supports": "Право на досрочное погашение и уведомление"
    },
    {
      "publisher": "КонсультантПлюс",
      "type": "LEGAL_TEXT",
      "url": "https://www.consultant.ru/document/cons_doc_LAW_155986/10dd842d4f87b9fe0ae3a8de9f32e91ae070817d/",
      "supports": "Статья 11 закона №353-ФЗ: порядок, проценты и исключения"
    }
  ],
  "status": "CONTEXT_ONLY_VERIFIED_NOT_SCENARIO_READY",
  "asOf": "2026-11-10"
},
{
  "id": "microloan-cap-2026",
  "appliesTo": [
    "microloans/microloan-rate",
    "microloans/microloan-overpayment",
    "microloans/microloan-extension"
  ],
  "proposition": "С 1 апреля 2026 года по новым потребительским кредитам и займам со сроком возврата не более года общий лимит начислений снижен со 130% до 100% от предоставленной суммы с учётом предусмотренных законом исключений.",
  "limitations": "Обязательно учитывать дату заключения договора, срок, вид займа, специальные исключения и переходные положения. Старый FAQ Банка России с нормой 130% за 2023 год не является актуальным ориентиром для новых договоров после 01.04.2026.",
  "sources": [
    {
      "publisher": "Банк России",
      "type": "OFFICIAL_EXPLANATION",
      "url": "https://www.cbr.ru/press/event/?id=28447",
      "supports": "Введение 100-процентного предела с 1 апреля 2026 года для новых займов"
    },
    {
      "publisher": "ГАРАНТ",
      "type": "LEGAL_TEXT",
      "url": "https://www.garant.ru/products/ipo/prime/doc/413276720/",
      "supports": "Закон №545-ФЗ, изменение 130% на 100% и дата вступления"
    }
  ],
  "status": "CONTEXT_ONLY_VERIFIED_NOT_SCENARIO_READY",
  "asOf": "2026-11-10"
},
{
  "id": "collector-third-party",
  "appliesTo": [
    "collectors/contact-third-parties",
    "collectors/harassing-calls"
  ],
  "proposition": "Направленное на возврат просроченной задолженности взаимодействие взыскателя с третьими лицами допускается при предусмотренных законом согласиях должника и соответствующего третьего лица с учётом специальных исключений.",
  "limitations": "Нужно подтвердить, кто взыскатель, кто третье лицо, форму и действительность согласий, возможность отзыва и возможные исключения. Положения о телефонных контактах с должником отдельно проверяются по статье 7 закона №230-ФЗ.",
  "sources": [
    {
      "publisher": "КонсультантПлюс",
      "type": "LEGAL_TEXT",
      "url": "https://www.consultant.ru/document/cons_doc_LAW_200497/c83ecd44bd226534ed4267fd1a4bc9d4ed86c8e6/",
      "supports": "Статья 4 закона №230-ФЗ: условия взаимодействия с третьими лицами"
    },
    {
      "publisher": "ФССП (приказ №345 опубликован в ГАРАНТ)",
      "type": "AUTHORITY_ACT",
      "url": "https://www.garant.ru/products/ipo/prime/doc/414737779/",
      "supports": "Контрольные вопросы ФССП по письменному согласию должника и третьего лица"
    }
  ],
  "status": "CONTEXT_ONLY_VERIFIED_NOT_SCENARIO_READY",
  "asOf": "2026-11-10"
},
{
  "id": "court-order-objections",
  "appliesTo": [
    "court-debt/court-order-received",
    "court-debt/court-order-objection"
  ],
  "proposition": "При поступлении в установленный законом срок возражений должника относительно исполнения судебного приказа судья отменяет судебный приказ; по пропущенному сроку требуется проверка предусмотренных законом оснований принятия поздних возражений.",
  "limitations": "До подготовки возражений необходимо установить дату вручения, суд, номер приказа, доказательства получения и фактическую возможность подачи; своевременная отмена приказа не исключает будущий иск кредитора.",
  "sources": [
    {
      "publisher": "КонсультантПлюс",
      "type": "LEGAL_TEXT",
      "url": "https://www.consultant.ru/document/cons_doc_LAW_39570/fd3336defa264ba3f3adb30a5f7d9b21017a6ca2/",
      "supports": "Действующая статья 129 ГПК РФ и последствия своевременных возражений"
    },
    {
      "publisher": "Восьмой кассационный суд общей юрисдикции",
      "type": "OFFICIAL_EXPLANATION",
      "url": "https://8kas.sudrf.ru/modules.php?case_id=34532429&case_uid=eee416ac-8c19-463c-802a-5f42e34cec2c&delo_id=2800001&name=sud_delo&name_op=case&new=2800001&srv_num=1",
      "supports": "Применение статьи 129 ГПК РФ, сроки и основания рассмотрения поздних возражений"
    }
  ],
  "status": "CONTEXT_ONLY_VERIFIED_NOT_SCENARIO_READY",
  "asOf": "2026-11-10"
},
{
  "id": "guarantor-default-solidarity",
  "appliesTo": [
    "guarantors/guarantor-liability",
    "guarantors/guarantor-regress"
  ],
  "proposition": "При неисполнении обеспеченного поручительством обязательства поручитель и основной должник по общему правилу отвечают перед кредитором солидарно, если законом либо договором поручительства не предусмотрена субсидиарная ответственность.",
  "limitations": "Нужно проверить договор поручительства, объём обеспечения, изменение основного обязательства, специальные условия и основания прекращения поручительства, прежде чем определять объём ответственности.",
  "sources": [
    {
      "publisher": "КонсультантПлюс",
      "type": "LEGAL_TEXT",
      "url": "https://www.consultant.ru/document/cons_doc_LAW_5142/1f9a87c9b304e5f284f77512792e47d1a4c864b0/",
      "supports": "Статья 363 ГК РФ: солидарная ответственность по общему правилу"
    },
    {
      "publisher": "Верховный Суд РФ",
      "type": "OFFICIAL_EXPLANATION",
      "url": "https://vsrf.ru/documents/all/15122/",
      "supports": "Обзор практики по кредитным обязательствам, поручительству и солидарной ответственности"
    }
  ],
  "status": "CONTEXT_ONLY_VERIFIED_NOT_SCENARIO_READY",
  "asOf": "2026-11-10"
},
{
  "id": "mortgage-holiday-special",
  "appliesTo": [
    "mortgage/mortgage-holidays",
    "mortgage/mortgage-holidays-rejection"
  ],
  "proposition": "Для кредитов граждан, обеспеченных ипотекой, предусмотрена отдельная законная процедура льготного периода по статье 6.1-1 закона №353-ФЗ, применимая при одновременном выполнении предусмотренных ею условий.",
  "limitations": "С 1 сентября 2026 года изменены отдельные условия и основания, включая особые обстоятельства после рождения или усыновления второго и последующих детей. Нельзя механически применять старые FAQ или правила обычных потребительских каникул.",
  "sources": [
    {
      "publisher": "Банк России",
      "type": "OFFICIAL_EXPLANATION",
      "url": "https://www.cbr.ru/faq/bank_s/ipotechnye_kanikuly/",
      "supports": "Отдельная ипотечная процедура, порядок обращения и базовые условия"
    },
    {
      "publisher": "КонсультантПлюс",
      "type": "LEGAL_TEXT",
      "url": "https://www.consultant.ru/document/cons_doc_LAW_155986/ff0c34905877a905b4477e42d7729c839dc2c152/",
      "supports": "Статья 6.1-1 закона №353-ФЗ в редакции после сентября 2026 года"
    }
  ],
  "status": "CONTEXT_ONLY_VERIFIED_NOT_SCENARIO_READY",
  "asOf": "2026-11-10"
},
  {
    id:"bankruptcy-court-debtor-no-duty-2026",
    appliesTo:["bankruptcy/bankruptcy-court"],
    proposition:"По подпункту 8 пункта 1 статьи 333.21 НК РФ при обращении самого должника с заявлением о признании его банкротом государственная пошлина не взимается.",
    status:"CONTEXT_ONLY_VERIFIED_NOT_SCENARIO_READY",
    asOf:"2026-11-12",
    limitations:"Не переносить освобождение должника на заявление кредитора, обособленные споры и расходы на финансового управляющего. Проверить заявителя, редакцию НК РФ на дату обращения и иные расходы.",
    sources:[
      {publisher:"КонсультантПлюс",type:"LEGAL_TEXT",
        url:"https://www.consultant.ru/document/cons_doc_LAW_52444/afc6f34df07a642bc66902eb48f253bcbc13797b/",
        supports:"Подпункт 8 пункта 1 статьи 333.21 НК РФ"},
      {publisher:"Арбитражный суд Удмуртской Республики",type:"OFFICIAL_EXPLANATION",
        url:"https://udmurtiya.arbitr.ru/process/duty/amount_of_duty",
        supports:"Отсутствие пошлины для собственного заявления должника"},
      {publisher:"Арбитражная практика по делу А68-15029/2024",type:"AUTHORITY_ACT",
        url:"https://www.zakonrf.info/arbsud/doc-53525b79-1747-508d-b111-0f9de9173905/",
        supports:"Применение освобождения должника"}
    ]
  },
  {
    id:"bankruptcy-court-deposit-2026",
    appliesTo:["bankruptcy/bankruptcy-court"],
    proposition:"С 9 января 2026 года средства на вознаграждение финансовому управляющему вносятся в депозит арбитражного суда после определения о принятии заявления о банкротстве гражданина и до заседания по проверке его обоснованности, с указанием номера дела.",
    status:"CONTEXT_ONLY_VERIFIED_NOT_SCENARIO_READY",
    asOf:"2026-11-12",
    limitations:"Правило относится к судебному банкротству. Не путать депозит с государственной пошлиной; размер вознаграждения и другие расходы требуют отдельной проверки.",
    sources:[
      {publisher:"ГАРАНТ",type:"LEGAL_TEXT",
        url:"https://base.garant.ru/185181/549fa6616cad4410333212ee85d05347/",
        supports:"Статья 213.4 закона №127-ФЗ после закона №544-ФЗ"},
      {publisher:"Арбитражный суд Ивановской области",type:"OFFICIAL_EXPLANATION",
        url:"https://ivanovo.arbitr.ru/preview/382148",
        supports:"Изменения, вступившие в силу 09.01.2026"},
      {publisher:"Арбитражный суд города Москвы",type:"OFFICIAL_EXPLANATION",
        url:"https://msk.arbitr.ru/process/duty/deposit_info",
        supports:"Депозит вносится после принятия заявления, до заседания"}
    ]
  },
  {
    id:"mfc-bankruptcy-unlisted-creditors",
    appliesTo:["bankruptcy/out-of-court-mfc","bankruptcy/creditor-list","bankruptcy/bankruptcy-completion"],
    proposition:"После завершения внесудебного банкротства освобождение гражданина от обязательств не распространяется на требования кредиторов, не указанные в заявлении; при заниженной сумме долга действуют специальные ограничения освобождения.",
    status:"CONTEXT_ONLY_VERIFIED_NOT_SCENARIO_READY",
    asOf:"2026-11-12",
    limitations:"Проверить список, суммы по каждому кредитору и исключения из освобождения. Не переносить эти специальные последствия автоматически на судебное банкротство.",
    sources:[
      {publisher:"КонсультантПлюс",type:"LEGAL_TEXT",
        url:"https://www.consultant.ru/document/cons_doc_LAW_39331/e5cb50d09c1b7740b5ce84bc51ef2c6de9510bbd/",
        supports:"Пункты 1–2 статьи 223.6 закона №127-ФЗ"},
      {publisher:"ФНС России",type:"OFFICIAL_EXPLANATION",
        url:"https://www.nalog.gov.ru/rn39/taxation/bankruptcy/10370052/",
        supports:"Неуказанные кредиторы не охватываются освобождением"},
      {publisher:"ГАРАНТ",type:"LEGAL_TEXT",
        url:"https://base.garant.ru/185181/0fcd3286b73e5f729c54fd3f8f6a4eac/",
        supports:"Статья 223.6, ограничения при заниженной сумме"}
    ]
  }
];
export function getCreditDebtCheckedContext(groupId:string,situationId:string):readonly CreditDebtCheckedContext[]{
  const key=groupId+"/"+situationId;
  return CREDIT_DEBT_CHECKED_CONTEXT.filter(item=>item.appliesTo.includes(key));
}

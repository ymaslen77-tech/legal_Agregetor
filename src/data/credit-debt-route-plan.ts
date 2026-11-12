/**
 * INTERNAL DEVELOPMENT BLUEPRINT, not a published route catalog.
 * Q&A baseline: 12,783 imported questions mapped from legacy Service.slug
 * (Neon snapshot 2026-10-15). Not sessions, searches, or legally reviewed cases.
 * All proposed documents remain disabled pending claim-level source verification,
 * scenario-specific legal checks, privacy review and automated acceptance.
 * Do NOT import this module in a public route, sitemap or navigation directly.
 */
export type CreditDebtResult =
  | "CHECKLIST" | "ELIGIBILITY_CHECK" | "CALCULATION_REVIEW"
  | "REQUEST_DRAFT" | "COMPLAINT_DRAFT" | "OBJECTION_DRAFT"
  | "CLAIM_DRAFT" | "DATA_PREPARATION" | "SAFETY_ESCALATION"
  | "FRAUD_REFERRAL" | "CROSS_LINK";

export type CreditDebtRisk = "standard" | "high" | "critical";
export type CreditDebtPriority = "P1" | "P2";
export type CreditDebtSituation = {
  id: string;
  title: string;
  targetResult: CreditDebtResult;
  risk: CreditDebtRisk;
  caseFacts: string;
  crossLinkArea: string | null;
};
export type CreditDebtGroup = {
  id: string;
  title: string;
  priority: CreditDebtPriority;
  description: string;
  specificFacts: readonly string[];
  sourceKeys: readonly CreditDebtSourceKey[];
  situations: readonly CreditDebtSituation[];
};
export type CreditDebtSourceKey = keyof typeof CREDIT_DEBT_SOURCE_CANDIDATES;
/** Sources to open and compare per claim, NOT completed verification evidence.
 * Generic pravo.gov.ru landing pages are NOT evidence of an exact normative clause.
 */
export const CREDIT_DEBT_SOURCE_CANDIDATES = {
  "GK_RF": {
    "title": "Гражданский кодекс РФ — обязательства, договор займа, поручительство",
    "owner": "Официальный интернет-портал правовой информации",
    "url": "https://pravo.gov.ru/"
  },
  "353_FZ": {
    "title": "353-ФЗ «О потребительском кредите (займе)»",
    "owner": "Официальный интернет-портал правовой информации",
    "url": "https://pravo.gov.ru/"
  },
  "127_FZ": {
    "title": "127-ФЗ «О несостоятельности (банкротстве)»",
    "owner": "Официальный интернет-портал правовой информации",
    "url": "https://pravo.gov.ru/"
  },
  "230_FZ": {
    "title": "230-ФЗ — защита граждан при возврате просроченной задолженности",
    "owner": "Официальный интернет-портал правовой информации",
    "url": "https://pravo.gov.ru/"
  },
  "218_FZ": {
    "title": "218-ФЗ «О кредитных историях»",
    "owner": "Официальный интернет-портал правовой информации",
    "url": "https://pravo.gov.ru/"
  },
  "102_FZ": {
    "title": "102-ФЗ «Об ипотеке (залоге недвижимости)»",
    "owner": "Официальный интернет-портал правовой информации",
    "url": "https://pravo.gov.ru/"
  },
  "229_FZ": {
    "title": "229-ФЗ «Об исполнительном производстве»",
    "owner": "Официальный интернет-портал правовой информации",
    "url": "https://pravo.gov.ru/"
  },
  "GPK_RF": {
    "title": "Гражданский процессуальный кодекс РФ",
    "owner": "Официальный интернет-портал правовой информации",
    "url": "https://pravo.gov.ru/"
  },
  "123_FZ": {
    "title": "123-ФЗ — уполномоченный по правам потребителей финансовых услуг",
    "owner": "Официальный интернет-портал правовой информации",
    "url": "https://pravo.gov.ru/"
  },
  "CBR_HOLIDAYS": {
    "title": "Банк России: кредитные каникулы, условия и отказы",
    "owner": "Банк России",
    "url": "https://www.cbr.ru/faq/w_fin_sector/kreditnye-kanikuly/"
  },
  "CBR_COMPLAINTS": {
    "title": "Банк России: порядок жалобы на финансовую организацию",
    "owner": "Банк России",
    "url": "https://www.cbr.ru/faq/zhaloby-v-bank-rossii-/"
  },
  "CBR_PROTECTION": {
    "title": "Банк России: защита потребителей финансовых услуг",
    "owner": "Банк России",
    "url": "https://www.cbr.ru/protection_rights/"
  },
  "CBR_HOLIDAYS_PRACTICE": {
    "title": "Банк России: обзор практик кредитных каникул",
    "owner": "Банк России",
    "url": "https://www.cbr.ru/protection_rights/practices_credit_holidays/"
  }
} as const;
export const CREDIT_DEBT_COMMON_FACTS = [
  {
    "key": "applicantCapacity",
    "label": "Кто обращается: заёмщик, созаёмщик, поручитель, наследник или иное лицо?"
  },
  {
    "key": "creditorAndProduct",
    "label": "Кто кредитор и какой продукт или обязательство?"
  },
  {
    "key": "contractAndDates",
    "label": "Номер и дата договора, даты событий и вручения документов"
  },
  {
    "key": "currentStage",
    "label": "На какой стадии находится спор: договор, просрочка, претензия, суд, пристав, банкротство?"
  },
  {
    "key": "evidenceAndRequestedOutcome",
    "label": "Какие подтверждения есть и какого результата нужно добиться?"
  }
] as const;
export const CREDIT_DEBT_BASELINE = {
  corpusDate: "2026-10-15",
  questions: 12783,
  baseAreaId: "credit-bankruptcy",
  source: "Neon pravopoisk_import_20261014; Service.slug mapped to Q&A taxonomic area",
  isTrafficMetric: false
} as const;
export const CREDIT_DEBT_PUBLICATION_GATE = {
  stage: "DESIGN_ONLY",
  publicNavigatorEnabled: false,
  publicUrlsEnabled: false,
  documentGenerationAllowed: false,
  filingReady: false,
  claimVerification: "PENDING_THREE_INDEPENDENT_SOURCES_AND_OFFICIAL_VERSION",
  rule: "One verified claim requires exact matching scope/effective date in three independent sources; if non-official sources disagree, official effective text has priority, and the claim must be corrected before approval.",
  noFakeProfilesOrFixtureAnswers: true
} as const;
export const CREDIT_DEBT_GROUPS: readonly CreditDebtGroup[] = [
  {
    "id": "contract-terms",
    "title": "Кредитные договоры и условия займа",
    "priority": "P1",
    "description": "Оформление, изменение условий и проверка обязательств по кредиту",
    "specificFacts": [
      "индивидуальные условия договора",
      "график платежей",
      "дата выдачи или отказа"
    ],
    "sourceKeys": [
      "GK_RF",
      "353_FZ",
      "CBR_PROTECTION"
    ],
    "situations": [
      {
        "id": "loan-contract-review",
        "title": "Проверить условия кредитного договора",
        "targetResult": "CHECKLIST",
        "risk": "standard",
        "caseFacts": "сумма, срок, ставка, индивидуальные условия",
        "crossLinkArea": null
      },
      {
        "id": "total-cost-dispute",
        "title": "Полная стоимость кредита указана неверно",
        "targetResult": "REQUEST_DRAFT",
        "risk": "high",
        "caseFacts": "ПСК, реклама, фактические платежи",
        "crossLinkArea": null
      },
      {
        "id": "credit-card-terms",
        "title": "Спор о лимите, льготном периоде или тарифе кредитной карты",
        "targetResult": "REQUEST_DRAFT",
        "risk": "standard",
        "caseFacts": "тариф, выписки, уведомления",
        "crossLinkArea": null
      },
      {
        "id": "early-repayment",
        "title": "Досрочное погашение и перерасчёт процентов",
        "targetResult": "REQUEST_DRAFT",
        "risk": "standard",
        "caseFacts": "дата заявления и погашения, остаток",
        "crossLinkArea": null
      },
      {
        "id": "funds-not-issued",
        "title": "Кредит одобрен, но средства не выданы или выданы не полностью",
        "targetResult": "REQUEST_DRAFT",
        "risk": "high",
        "caseFacts": "договор, платёжные документы, статус выдачи",
        "crossLinkArea": null
      },
      {
        "id": "unilateral-change",
        "title": "Кредитор изменил условия договора в одностороннем порядке",
        "targetResult": "COMPLAINT_DRAFT",
        "risk": "high",
        "caseFacts": "старая и новая редакции, дата уведомления",
        "crossLinkArea": null
      }
    ]
  },
  {
    "id": "fees-addons",
    "title": "Проценты, комиссии, страховки и дополнительные услуги",
    "priority": "P1",
    "description": "Непрозрачные платежи и дополнительные договоры при кредитовании",
    "specificFacts": [
      "отдельные согласия на платные услуги",
      "страховой договор",
      "расчёт спорного начисления"
    ],
    "sourceKeys": [
      "353_FZ",
      "GK_RF",
      "123_FZ",
      "CBR_PROTECTION"
    ],
    "situations": [
      {
        "id": "imposed-insurance",
        "title": "Навязанная страховка при оформлении кредита",
        "targetResult": "REQUEST_DRAFT",
        "risk": "high",
        "caseFacts": "условия страхования, даты согласия и отказа",
        "crossLinkArea": null
      },
      {
        "id": "insurance-cancellation",
        "title": "Отказ от страховки и возврат страховой премии",
        "targetResult": "REQUEST_DRAFT",
        "risk": "high",
        "caseFacts": "дата заключения и прекращения, страховщик",
        "crossLinkArea": null
      },
      {
        "id": "paid-subscriptions",
        "title": "Платные подписки и услуги, подключённые вместе с кредитом",
        "targetResult": "REQUEST_DRAFT",
        "risk": "standard",
        "caseFacts": "согласие, поставщик услуги, списания",
        "crossLinkArea": null
      },
      {
        "id": "unlawful-fee",
        "title": "Незаконная или нераскрытая комиссия банка",
        "targetResult": "COMPLAINT_DRAFT",
        "risk": "high",
        "caseFacts": "тариф, основание комиссии, выписка",
        "crossLinkArea": null
      },
      {
        "id": "interest-calculation",
        "title": "Неверно рассчитаны проценты и сумма долга",
        "targetResult": "CALCULATION_REVIEW",
        "risk": "high",
        "caseFacts": "ставка, периоды, движения средств",
        "crossLinkArea": null
      },
      {
        "id": "penalties-and-fines",
        "title": "Проверить неустойку, штрафы и пени",
        "targetResult": "CALCULATION_REVIEW",
        "risk": "high",
        "caseFacts": "просрочка, размер и даты начислений",
        "crossLinkArea": null
      }
    ]
  },
  {
    "id": "payment-difficulties",
    "title": "Просрочка, кредитные каникулы и реструктуризация",
    "priority": "P1",
    "description": "Законные льготные периоды и договорные варианты изменения платежей",
    "specificFacts": [
      "причина снижения платёжеспособности",
      "текущий размер дохода",
      "кредитор и предыдущие льготы"
    ],
    "sourceKeys": [
      "353_FZ",
      "GK_RF",
      "CBR_HOLIDAYS",
      "CBR_HOLIDAYS_PRACTICE"
    ],
    "situations": [
      {
        "id": "credit-holidays",
        "title": "Проверить право на кредитные каникулы",
        "targetResult": "ELIGIBILITY_CHECK",
        "risk": "high",
        "caseFacts": "основание, доходы, ограничения, даты",
        "crossLinkArea": null
      },
      {
        "id": "credit-holidays-request",
        "title": "Подготовить требование о кредитных каникулах",
        "targetResult": "REQUEST_DRAFT",
        "risk": "high",
        "caseFacts": "доказательства основания, способ направления",
        "crossLinkArea": null
      },
      {
        "id": "credit-holidays-rejection",
        "title": "Оспорить отказ в кредитных каникулах",
        "targetResult": "COMPLAINT_DRAFT",
        "risk": "high",
        "caseFacts": "текст отказа, даты, подтверждения",
        "crossLinkArea": null
      },
      {
        "id": "restructuring-request",
        "title": "Попросить банк о реструктуризации долга",
        "targetResult": "REQUEST_DRAFT",
        "risk": "standard",
        "caseFacts": "предлагаемый график, доходы и расходы",
        "crossLinkArea": null
      },
      {
        "id": "payment-allocation",
        "title": "Неверно распределены внесённые платежи",
        "targetResult": "REQUEST_DRAFT",
        "risk": "high",
        "caseFacts": "выписка, график, порядок погашения",
        "crossLinkArea": null
      },
      {
        "id": "military-special-benefits",
        "title": "Кредитные льготы военнослужащим и членам семей",
        "targetResult": "CROSS_LINK",
        "risk": "high",
        "caseFacts": "статус, даты, договор; переход в военное право",
        "crossLinkArea": "military"
      }
    ]
  },
  {
    "id": "microloans",
    "title": "Микрозаймы и МФО",
    "priority": "P1",
    "description": "Споры о микрозаймах, предельных платежах и действиях МФО",
    "specificFacts": [
      "юридическое наименование МФО",
      "сумма и срок займа",
      "история продлений и платежей"
    ],
    "sourceKeys": [
      "353_FZ",
      "GK_RF",
      "CBR_PROTECTION"
    ],
    "situations": [
      {
        "id": "microloan-rate",
        "title": "Проверить проценты по микрозайму",
        "targetResult": "CALCULATION_REVIEW",
        "risk": "high",
        "caseFacts": "дата займа, срок, ставка и платежи",
        "crossLinkArea": null
      },
      {
        "id": "microloan-overpayment",
        "title": "Оспорить превышение применимых ограничений начислений",
        "targetResult": "REQUEST_DRAFT",
        "risk": "high",
        "caseFacts": "условия на дату выдачи и все начисления",
        "crossLinkArea": null
      },
      {
        "id": "microloan-extension",
        "title": "Платное продление займа и повторное начисление услуг",
        "targetResult": "REQUEST_DRAFT",
        "risk": "standard",
        "caseFacts": "соглашения о продлении и списания",
        "crossLinkArea": null
      },
      {
        "id": "microloan-not-mine",
        "title": "Микрозайм оформлен без моего согласия",
        "targetResult": "FRAUD_REFERRAL",
        "risk": "critical",
        "caseFacts": "история идентификации, заявления, дата обнаружения",
        "crossLinkArea": "fraud"
      },
      {
        "id": "microloan-payment-missing",
        "title": "МФО не учла погашение займа",
        "targetResult": "REQUEST_DRAFT",
        "risk": "standard",
        "caseFacts": "чеки, дата и реквизиты перевода",
        "crossLinkArea": null
      }
    ]
  },
  {
    "id": "collectors",
    "title": "Коллекторы и внесудебное взыскание",
    "priority": "P1",
    "description": "Проверка законности требований и способов взаимодействия с должником",
    "specificFacts": [
      "кто и каким способом требует деньги",
      "даты и частота контактов",
      "основание требования долга"
    ],
    "sourceKeys": [
      "230_FZ",
      "GK_RF",
      "CBR_COMPLAINTS"
    ],
    "situations": [
      {
        "id": "harassing-calls",
        "title": "Чрезмерные звонки, сообщения и визиты взыскателей",
        "targetResult": "COMPLAINT_DRAFT",
        "risk": "high",
        "caseFacts": "журнал контактов, время, записи",
        "crossLinkArea": null
      },
      {
        "id": "contact-third-parties",
        "title": "Коллекторы обращаются к родственникам, работодателю или соседям",
        "targetResult": "COMPLAINT_DRAFT",
        "risk": "high",
        "caseFacts": "контактные лица и доказательства",
        "crossLinkArea": null
      },
      {
        "id": "threats-and-pressure",
        "title": "Угрозы, шантаж и принуждение при взыскании",
        "targetResult": "SAFETY_ESCALATION",
        "risk": "critical",
        "caseFacts": "доказательства угроз; срочный безопасный маршрут",
        "crossLinkArea": null
      },
      {
        "id": "unknown-collector",
        "title": "Неизвестный взыскатель требует погашения долга",
        "targetResult": "CHECKLIST",
        "risk": "high",
        "caseFacts": "документы уступки/полномочий, реквизиты",
        "crossLinkArea": null
      },
      {
        "id": "disputed-assignment",
        "title": "Передача права требования другому кредитору",
        "targetResult": "REQUEST_DRAFT",
        "risk": "high",
        "caseFacts": "уведомление, новый кредитор, договор",
        "crossLinkArea": null
      },
      {
        "id": "collector-refusal-contact",
        "title": "Ограничение взаимодействия и оформление заявления",
        "targetResult": "REQUEST_DRAFT",
        "risk": "high",
        "caseFacts": "стадия просрочки, формат общения, реквизиты",
        "crossLinkArea": null
      }
    ]
  },
  {
    "id": "court-debt",
    "title": "Судебное взыскание долга",
    "priority": "P1",
    "description": "Выбор процессуального порядка, судебные документы и защита должника",
    "specificFacts": [
      "вид судебного документа",
      "суд и номер дела",
      "дата получения судебных документов"
    ],
    "sourceKeys": [
      "GPK_RF",
      "GK_RF",
      "353_FZ",
      "229_FZ"
    ],
    "situations": [
      {
        "id": "court-order-received",
        "title": "Получен судебный приказ по кредитному долгу",
        "targetResult": "CROSS_LINK",
        "risk": "high",
        "caseFacts": "дата вручения, суд, номер дела",
        "crossLinkArea": "civil-process"
      },
      {
        "id": "court-order-objection",
        "title": "Возражения относительно исполнения судебного приказа",
        "targetResult": "OBJECTION_DRAFT",
        "risk": "high",
        "caseFacts": "срок и порядок вручения, реквизиты приказа",
        "crossLinkArea": null
      },
      {
        "id": "creditor-lawsuit",
        "title": "Банк или МФО подал иск о взыскании долга",
        "targetResult": "OBJECTION_DRAFT",
        "risk": "high",
        "caseFacts": "иск, расчёт, документы оплаты",
        "crossLinkArea": null
      },
      {
        "id": "limitation-defense",
        "title": "Проверить возможность заявления об исковой давности",
        "targetResult": "CHECKLIST",
        "risk": "high",
        "caseFacts": "график платежей, даты требований, изменения обязательств",
        "crossLinkArea": null
      },
      {
        "id": "default-judgment",
        "title": "Получено заочное решение по кредитному долгу",
        "targetResult": "CROSS_LINK",
        "risk": "high",
        "caseFacts": "дата вручения и обстоятельства участия",
        "crossLinkArea": "civil-process"
      },
      {
        "id": "enforcement-after-court",
        "title": "Списания и арест после вступления решения в силу",
        "targetResult": "CROSS_LINK",
        "risk": "high",
        "caseFacts": "постановления, защищённые выплаты",
        "crossLinkArea": "enforcement"
      }
    ]
  },
  {
    "id": "mortgage",
    "title": "Ипотека и залог жилья",
    "priority": "P1",
    "description": "Обязательства по ипотеке, залоговые риски, реструктуризация и особые семейные условия",
    "specificFacts": [
      "договор ипотеки и сведения о залоге",
      "обременения и собственники",
      "платёжная история"
    ],
    "sourceKeys": [
      "102_FZ",
      "353_FZ",
      "GK_RF",
      "CBR_HOLIDAYS"
    ],
    "situations": [
      {
        "id": "mortgage-holidays",
        "title": "Проверить право на ипотечные каникулы",
        "targetResult": "ELIGIBILITY_CHECK",
        "risk": "high",
        "caseFacts": "залог, основания, ограничения, изменения доходов",
        "crossLinkArea": null
      },
      {
        "id": "mortgage-holidays-rejection",
        "title": "Банк отказал в ипотечных каникулах",
        "targetResult": "COMPLAINT_DRAFT",
        "risk": "high",
        "caseFacts": "письменный отказ, подтверждения",
        "crossLinkArea": null
      },
      {
        "id": "mortgage-arrears",
        "title": "Просрочка по ипотеке: варианты урегулирования",
        "targetResult": "REQUEST_DRAFT",
        "risk": "high",
        "caseFacts": "размер просрочки, требования банка, состояние залога",
        "crossLinkArea": null
      },
      {
        "id": "foreclosure-housing",
        "title": "Банк требует обратить взыскание на заложенную квартиру",
        "targetResult": "CHECKLIST",
        "risk": "critical",
        "caseFacts": "иск, залог, состав семьи и доли",
        "crossLinkArea": null
      },
      {
        "id": "sale-pledged-home",
        "title": "Продажа, рефинансирование или снятие обременения",
        "targetResult": "CHECKLIST",
        "risk": "high",
        "caseFacts": "согласия, план расчёта и состояние залога",
        "crossLinkArea": null
      },
      {
        "id": "mortgage-family-capital",
        "title": "Ипотека с маткапиталом или детскими долями",
        "targetResult": "CROSS_LINK",
        "risk": "high",
        "caseFacts": "доли детей, обязательства, согласия",
        "crossLinkArea": "family"
      }
    ]
  },
  {
    "id": "history-fraud",
    "title": "Кредитная история и кредиты без согласия",
    "priority": "P1",
    "description": "Исправление сведений, мошеннические обязательства и защита персональных данных",
    "specificFacts": [
      "какой записью или действием нарушены права",
      "когда обнаружена проблема",
      "ответ организации или БКИ"
    ],
    "sourceKeys": [
      "218_FZ",
      "353_FZ",
      "GK_RF",
      "CBR_COMPLAINTS"
    ],
    "situations": [
      {
        "id": "incorrect-credit-history",
        "title": "В кредитной истории ошибка или чужая просрочка",
        "targetResult": "REQUEST_DRAFT",
        "risk": "high",
        "caseFacts": "выписка БКИ, основания исправления",
        "crossLinkArea": null
      },
      {
        "id": "loan-not-mine",
        "title": "На моё имя оформили кредит без согласия",
        "targetResult": "FRAUD_REFERRAL",
        "risk": "critical",
        "caseFacts": "полиция, кредитор, подтверждение личности и входов",
        "crossLinkArea": null
      },
      {
        "id": "credit-self-ban",
        "title": "Установить или снять самозапрет на кредиты",
        "targetResult": "CHECKLIST",
        "risk": "standard",
        "caseFacts": "тип займа, статус запрета, требуемая дата",
        "crossLinkArea": null
      },
      {
        "id": "paid-loan-not-closed",
        "title": "Погашенный кредит остаётся открытым в кредитной истории",
        "targetResult": "REQUEST_DRAFT",
        "risk": "standard",
        "caseFacts": "справка о закрытии и выписка БКИ",
        "crossLinkArea": null
      },
      {
        "id": "data-breach-credit",
        "title": "Утечка персональных данных и риск мошеннических займов",
        "targetResult": "SAFETY_ESCALATION",
        "risk": "high",
        "caseFacts": "дата обнаружения, источники, уже принятые меры",
        "crossLinkArea": null
      },
      {
        "id": "refused-credit-history-dispute",
        "title": "БКИ или кредитор отказался исправить сведения",
        "targetResult": "COMPLAINT_DRAFT",
        "risk": "high",
        "caseFacts": "ответ, документы, маршрут обжалования",
        "crossLinkArea": null
      }
    ]
  },
  {
    "id": "guarantors",
    "title": "Поручительство, созаёмщики и общие долги",
    "priority": "P2",
    "description": "Ответственность нескольких лиц, регресс и границы обязательств",
    "specificFacts": [
      "роль лица и основания обязательства",
      "копии всех договоров",
      "платежи участников и уведомления"
    ],
    "sourceKeys": [
      "GK_RF",
      "353_FZ",
      "GPK_RF"
    ],
    "situations": [
      {
        "id": "guarantor-liability",
        "title": "Банк требует долг с поручителя",
        "targetResult": "CHECKLIST",
        "risk": "high",
        "caseFacts": "поручительство, основание требования, даты",
        "crossLinkArea": null
      },
      {
        "id": "guarantor-regress",
        "title": "Поручитель погасил долг: требование к основному должнику",
        "targetResult": "CLAIM_DRAFT",
        "risk": "high",
        "caseFacts": "доказательства уплаты, договор, расчёт",
        "crossLinkArea": null
      },
      {
        "id": "co-borrower-dispute",
        "title": "Спор между созаёмщиками о платежах и обязательствах",
        "targetResult": "CHECKLIST",
        "risk": "high",
        "caseFacts": "доли и поручения, соглашения, платёжные документы",
        "crossLinkArea": null
      },
      {
        "id": "spousal-loan-dispute",
        "title": "Кредит одного из супругов: общий или личный долг",
        "targetResult": "CROSS_LINK",
        "risk": "high",
        "caseFacts": "цель кредита, режим собственности, доказательства",
        "crossLinkArea": "family"
      },
      {
        "id": "deceased-borrower",
        "title": "Банк предъявил наследникам требования по кредиту умершего",
        "targetResult": "CROSS_LINK",
        "risk": "high",
        "caseFacts": "открытие наследства, состав имущества, сроки",
        "crossLinkArea": "inheritance"
      }
    ]
  },
  {
    "id": "bankruptcy",
    "title": "Банкротство физических лиц",
    "priority": "P1",
    "description": "Выбор судебной или внесудебной процедуры и последствия для должника",
    "specificFacts": [
      "состав и сумма обязательств",
      "доходы и имущество",
      "исполнительные производства и сделки",
      "семейное положение"
    ],
    "sourceKeys": [
      "127_FZ",
      "GK_RF",
      "GPK_RF"
    ],
    "situations": [
      {
        "id": "bankruptcy-eligibility",
        "title": "Оценить основания и ограничения банкротства гражданина",
        "targetResult": "ELIGIBILITY_CHECK",
        "risk": "high",
        "caseFacts": "состав кредиторов, долгов, имущества и доходов",
        "crossLinkArea": null
      },
      {
        "id": "out-of-court-mfc",
        "title": "Проверить условия внесудебного банкротства через МФЦ",
        "targetResult": "ELIGIBILITY_CHECK",
        "risk": "high",
        "caseFacts": "условия на дату обращения, справки, ФССП",
        "crossLinkArea": null
      },
      {
        "id": "bankruptcy-court",
        "title": "Подготовка к обращению в арбитражный суд",
        "targetResult": "CHECKLIST",
        "risk": "high",
        "caseFacts": "документы и данные о кредиторах",
        "crossLinkArea": null
      },
      {
        "id": "creditor-list",
        "title": "Составить реестр кредиторов, требований и обеспечений",
        "targetResult": "DATA_PREPARATION",
        "risk": "high",
        "caseFacts": "долги, проценты, залоги, поручители",
        "crossLinkArea": null
      },
      {
        "id": "property-and-spouse",
        "title": "Имущество, совместная собственность супругов и ограничения",
        "targetResult": "CHECKLIST",
        "risk": "critical",
        "caseFacts": "состав имущества, семейные доли, ограничения",
        "crossLinkArea": null
      },
      {
        "id": "transaction-risk",
        "title": "Проверка ранее совершённых сделок перед банкротством",
        "targetResult": "CHECKLIST",
        "risk": "critical",
        "caseFacts": "сделки и платежи, связанные лица, периоды",
        "crossLinkArea": null
      },
      {
        "id": "bankruptcy-property-protection",
        "title": "Жильё, ипотека и имущество, подлежащее исключению",
        "targetResult": "CHECKLIST",
        "risk": "critical",
        "caseFacts": "статус недвижимости, залог, региональные особенности",
        "crossLinkArea": null
      },
      {
        "id": "bankruptcy-completion",
        "title": "Завершение банкротства: долги, которые могут сохраниться, и последствия",
        "targetResult": "CHECKLIST",
        "risk": "high",
        "caseFacts": "судебные акты, вид обязательств, обязанности после процедуры",
        "crossLinkArea": null
      }
    ]
  }
];
export function getCreditDebtPlanStats() {
  return {
    baselineQuestions: CREDIT_DEBT_BASELINE.questions,
    groups: CREDIT_DEBT_GROUPS.length,
    situations: CREDIT_DEBT_GROUPS.reduce((n,g)=>n+g.situations.length,0),
    crossLinks: CREDIT_DEBT_GROUPS.flatMap(g=>g.situations).filter(s=>s.targetResult==="CROSS_LINK").length,
    publicationEnabled: CREDIT_DEBT_PUBLICATION_GATE.publicUrlsEnabled
  };
}
export function findCreditDebtSituation(groupId:string,situationId:string): CreditDebtSituation|null {
  return CREDIT_DEBT_GROUPS.find(g=>g.id===groupId)?.situations.find(s=>s.id===situationId)??null;
}

import { getQnaLegalArea } from "@/data/legal-qna-taxonomy";

/**
 * Planning-only catalog for property and land disputes, 2026-11-20.
 * The 12,220 Q&A number is a historical Service-category aggregate, NOT
 * a count of verified real estate cases, searches or site visits.
 * This file states possible questions and intended outputs, NOT law or
 * eligibility. Every substantial legal claim requires independent review.
 */
export type RealEstateResult =
  | "CHECKLIST" | "STATUS_CHECK" | "EVIDENCE_PLAN"
  | "REQUEST_DRAFT" | "COMPLAINT_DRAFT" | "SPECIALIST_REFERRAL" | "CROSS_LINK";
export type RealEstateRisk = "standard" | "high" | "critical";
export type RealEstateCrossLink = "housing" | "inheritance" | "civil-court" |
  "enforcement" | "credit-bankruptcy" | "family" | "consumer" | null;
export type RealEstateSourceKey = keyof typeof REAL_ESTATE_SOURCE_FAMILIES;
export type RealEstateSituation = Readonly<{
  id:string;title:string;targetResult:RealEstateResult;risk:RealEstateRisk;
  caseFacts:string;crossLinkArea:RealEstateCrossLink;
}>;
export type RealEstateGroup = Readonly<{
  id:string;title:string;description:string;
  specificFacts:readonly string[];
  sourceKeys:readonly RealEstateSourceKey[];
  situations:readonly RealEstateSituation[];
}>;
/** Names of candidate acts ONLY. No exact provision, effective date or
 * legally valid result is asserted by this preliminary inventory. */
export const REAL_ESTATE_SOURCE_FAMILIES = {
  "214": "Федеральный закон № 214-ФЗ «Об участии в долевом строительстве»",
  "218": "Федеральный закон № 218-ФЗ «О государственной регистрации недвижимости»",
  "237": "Федеральный закон № 237-ФЗ «О государственной кадастровой оценке»",
  "GK": "Гражданский кодекс РФ",
  "ZK": "Земельный кодекс РФ",
  "GRK": "Градостроительный кодекс РФ",
  "GPK": "Гражданский процессуальный кодекс РФ",
  "APK": "Арбитражный процессуальный кодекс РФ"
} as const;
export const REAL_ESTATE_BASELINE = {
  areaId: "real-estate",
  corpusDate: "2026-10-15",
  questionCount: 12220,
  source: "Neon pravopoisk_import_20261014; legacy Service.slug mapping",
  trafficMetric: false,
  expertVerifiedCaseCount: null
} as const;
export const REAL_ESTATE_PUBLICATION_GATE = {
  stage: "DESIGN_ONLY",
  publicNavigatorEnabled: false,
  publicUrlsEnabled: false,
  documentGenerationAllowed: false,
  filingReady: false,
  indexable: false,
  perClaimReview: "PENDING_THREE_INDEPENDENT_SOURCES",
  sourceVersionReview: "PENDING_EFFECTIVE_OFFICIAL_TEXT",
  personalDataCollectionAllowed: false
} as const;
export const REAL_ESTATE_GROUPS = [
  {
    "id": "ownership-register",
    "title": "Право собственности и регистрация в ЕГРН",
    "description": "Документы, запись о праве и действия органа регистрации",
    "specificFacts": [
      "правоустанавливающий документ",
      "тип регистрационного действия",
      "дата решения Росреестра"
    ],
    "sourceKeys": [
      "GK",
      "218"
    ],
    "situations": [
      {
        "id": "title-documents",
        "title": "Не хватает документов для подтверждения права собственности",
        "targetResult": "EVIDENCE_PLAN",
        "risk": "high",
        "caseFacts": "основание права, архивные документы",
        "crossLinkArea": null
      },
      {
        "id": "suspension-registration",
        "title": "Получено уведомление о приостановлении регистрации недвижимости",
        "targetResult": "REQUEST_DRAFT",
        "risk": "high",
        "caseFacts": "уведомление, заявленный объект, причины",
        "crossLinkArea": null
      },
      {
        "id": "registration-refusal",
        "title": "Росреестр отказал в регистрации права на объект",
        "targetResult": "COMPLAINT_DRAFT",
        "risk": "high",
        "caseFacts": "отказ, документы, дата получения",
        "crossLinkArea": null
      },
      {
        "id": "record-inaccurate",
        "title": "В ЕГРН обнаружены неверные сведения о зарегистрированном праве",
        "targetResult": "REQUEST_DRAFT",
        "risk": "high",
        "caseFacts": "выписка, основание исправления",
        "crossLinkArea": null
      },
      {
        "id": "ownership-transfer",
        "title": "Переход права по договору не зарегистрирован",
        "targetResult": "EVIDENCE_PLAN",
        "risk": "high",
        "caseFacts": "договор, подача заявления, уведомления",
        "crossLinkArea": null
      },
      {
        "id": "encumbrance-record",
        "title": "Неизвестная запись об ограничении или обременении в ЕГРН",
        "targetResult": "STATUS_CHECK",
        "risk": "high",
        "caseFacts": "вид записи, дата, основание ограничения",
        "crossLinkArea": null
      }
    ]
  },
  {
    "id": "property-transactions",
    "title": "Сделки с квартирами, домами и нежилыми объектами",
    "description": "Проверка договора, расчётов, передачи и обременений",
    "specificFacts": [
      "договор и его редакции",
      "даты платежей",
      "акт передачи объекта"
    ],
    "sourceKeys": [
      "GK",
      "218"
    ],
    "situations": [
      {
        "id": "prepurchase-check",
        "title": "Проверить документы и риски перед покупкой недвижимости",
        "targetResult": "CHECKLIST",
        "risk": "standard",
        "caseFacts": "выписка ЕГРН, продавец, обременения",
        "crossLinkArea": null
      },
      {
        "id": "seller-no-transfer",
        "title": "Продавец не передаёт объект после заключения договора",
        "targetResult": "REQUEST_DRAFT",
        "risk": "high",
        "caseFacts": "договор, оплата, акт передачи",
        "crossLinkArea": null
      },
      {
        "id": "buyer-payment-delay",
        "title": "Покупатель не исполнил условия оплаты недвижимости",
        "targetResult": "REQUEST_DRAFT",
        "risk": "high",
        "caseFacts": "договор, график, платежи",
        "crossLinkArea": null
      },
      {
        "id": "hidden-encumbrance",
        "title": "После покупки обнаружено ранее неизвестное обременение",
        "targetResult": "EVIDENCE_PLAN",
        "risk": "high",
        "caseFacts": "выписка, сведения продавца, договор",
        "crossLinkArea": null
      },
      {
        "id": "preliminary-contract",
        "title": "Спор о предварительном договоре купли-продажи недвижимости",
        "targetResult": "EVIDENCE_PLAN",
        "risk": "high",
        "caseFacts": "условия, срок, внесённая сумма",
        "crossLinkArea": null
      },
      {
        "id": "invalidate-property-deal",
        "title": "Поставлена под сомнение действительность сделки с недвижимостью",
        "targetResult": "SPECIALIST_REFERRAL",
        "risk": "critical",
        "caseFacts": "основания оспаривания, стороны, сроки",
        "crossLinkArea": null
      }
    ]
  },
  {
    "id": "shared-ownership",
    "title": "Доли и общая собственность",
    "description": "Споры между сособственниками об объекте и распоряжении долями",
    "specificFacts": [
      "доли в праве",
      "состав сособственников",
      "согласования и письменные уведомления"
    ],
    "sourceKeys": [
      "GK",
      "218"
    ],
    "situations": [
      {
        "id": "share-registration",
        "title": "Не получается зарегистрировать долю в праве на недвижимость",
        "targetResult": "EVIDENCE_PLAN",
        "risk": "high",
        "caseFacts": "основание доли, выписки, заявления",
        "crossLinkArea": null
      },
      {
        "id": "use-arrangement",
        "title": "Сособственники не договорились о порядке пользования объектом",
        "targetResult": "EVIDENCE_PLAN",
        "risk": "high",
        "caseFacts": "размер долей, фактическое пользование",
        "crossLinkArea": null
      },
      {
        "id": "share-sale",
        "title": "Продажа доли вызывает спор между сособственниками",
        "targetResult": "CHECKLIST",
        "risk": "high",
        "caseFacts": "уведомление, цена, договор",
        "crossLinkArea": null
      },
      {
        "id": "share-division",
        "title": "Требуется выделить долю или разделить общий объект",
        "targetResult": "EVIDENCE_PLAN",
        "risk": "high",
        "caseFacts": "характеристики объекта, доли, технические документы",
        "crossLinkArea": null
      },
      {
        "id": "compensation-share",
        "title": "Возник спор о денежной компенсации за долю",
        "targetResult": "EVIDENCE_PLAN",
        "risk": "high",
        "caseFacts": "оценка, размер доли, использование",
        "crossLinkArea": null
      },
      {
        "id": "shared-costs",
        "title": "Сособственники спорят о расходах на общее имущество",
        "targetResult": "CROSS_LINK",
        "risk": "high",
        "caseFacts": "состав расходов, периоды, платёжные доказательства",
        "crossLinkArea": "housing"
      }
    ]
  },
  {
    "id": "newbuild-ddu",
    "title": "Новостройки и договоры долевого участия",
    "description": "Передача квартиры, качество объекта и отношения с застройщиком",
    "specificFacts": [
      "текст договора",
      "плановая и фактическая дата передачи",
      "акт осмотра или передачи"
    ],
    "sourceKeys": [
      "214",
      "GK",
      "218"
    ],
    "situations": [
      {
        "id": "ddu-signing",
        "title": "Проверить договор участия в долевом строительстве до подписания",
        "targetResult": "CHECKLIST",
        "risk": "high",
        "caseFacts": "проект договора, объект, сроки",
        "crossLinkArea": null
      },
      {
        "id": "developer-delay",
        "title": "Застройщик нарушает согласованный срок передачи объекта",
        "targetResult": "EVIDENCE_PLAN",
        "risk": "high",
        "caseFacts": "договор, сроки, уведомления",
        "crossLinkArea": null
      },
      {
        "id": "quality-defects",
        "title": "Обнаружены недостатки качества квартиры при приёмке",
        "targetResult": "REQUEST_DRAFT",
        "risk": "high",
        "caseFacts": "акт осмотра, фото, перечень недостатков",
        "crossLinkArea": null
      },
      {
        "id": "area-mismatch",
        "title": "Фактическая площадь объекта отличается от согласованной",
        "targetResult": "EVIDENCE_PLAN",
        "risk": "high",
        "caseFacts": "условия договора, замеры, техплан",
        "crossLinkArea": null
      },
      {
        "id": "act-acceptance-dispute",
        "title": "Спор о подписании передаточного акта в новостройке",
        "targetResult": "EVIDENCE_PLAN",
        "risk": "high",
        "caseFacts": "уведомления, проект акта, осмотр",
        "crossLinkArea": null
      },
      {
        "id": "developer-bankruptcy",
        "title": "Застройщик проходит процедуру банкротства",
        "targetResult": "SPECIALIST_REFERRAL",
        "risk": "critical",
        "caseFacts": "стадия процедуры, договор, сведения о требованиях",
        "crossLinkArea": null
      }
    ]
  },
  {
    "id": "land-boundaries",
    "title": "Межевание, границы и кадастровые споры",
    "description": "Установление границ, согласование и пересечения участков",
    "specificFacts": [
      "кадастровые сведения",
      "межевой план",
      "акт согласования границ"
    ],
    "sourceKeys": [
      "218",
      "ZK",
      "GK"
    ],
    "situations": [
      {
        "id": "boundary-survey",
        "title": "Нужно определить границы земельного участка",
        "targetResult": "CHECKLIST",
        "risk": "standard",
        "caseFacts": "межевание, правоустанавливающие сведения",
        "crossLinkArea": null
      },
      {
        "id": "neighbor-boundary-dispute",
        "title": "Сосед оспаривает установленную границу участка",
        "targetResult": "EVIDENCE_PLAN",
        "risk": "high",
        "caseFacts": "межевой план, сведения сторон",
        "crossLinkArea": null
      },
      {
        "id": "boundary-overlap",
        "title": "На кадастровой схеме участки пересекаются",
        "targetResult": "EVIDENCE_PLAN",
        "risk": "high",
        "caseFacts": "координаты, выписки, заключения",
        "crossLinkArea": null
      },
      {
        "id": "boundary-approval",
        "title": "Возник спор при согласовании границ с соседями",
        "targetResult": "EVIDENCE_PLAN",
        "risk": "high",
        "caseFacts": "публикации, уведомления, возражения",
        "crossLinkArea": null
      },
      {
        "id": "registry-boundary-error",
        "title": "Предполагаемая реестровая ошибка в координатах участка",
        "targetResult": "REQUEST_DRAFT",
        "risk": "high",
        "caseFacts": "план, кадастровые сведения, подтверждения",
        "crossLinkArea": null
      },
      {
        "id": "land-access",
        "title": "Нет согласованного доступа к участку через чужую землю",
        "targetResult": "EVIDENCE_PLAN",
        "risk": "high",
        "caseFacts": "расположение участков, варианты доступа",
        "crossLinkArea": null
      }
    ]
  },
  {
    "id": "land-status-use",
    "title": "Земля: категория, назначение и ограничения",
    "description": "Разрешённое использование, территориальные условия и оформление земли",
    "specificFacts": [
      "категория земли",
      "вид разрешённого использования",
      "право на участок и ограничения"
    ],
    "sourceKeys": [
      "ZK",
      "GRK",
      "218"
    ],
    "situations": [
      {
        "id": "land-permitted-use",
        "title": "Не подходит установленный вид разрешённого использования земли",
        "targetResult": "EVIDENCE_PLAN",
        "risk": "high",
        "caseFacts": "действующий ВРИ, запрашиваемый ВРИ",
        "crossLinkArea": null
      },
      {
        "id": "land-zone-limit",
        "title": "Обнаружены ограничения использования участка или зоны",
        "targetResult": "STATUS_CHECK",
        "risk": "high",
        "caseFacts": "вид зоны, документ-основание, карта",
        "crossLinkArea": null
      },
      {
        "id": "public-land-lease",
        "title": "Спор об оформлении аренды земельного участка у публичного собственника",
        "targetResult": "EVIDENCE_PLAN",
        "risk": "high",
        "caseFacts": "основание обращения, решение органа",
        "crossLinkArea": null
      },
      {
        "id": "land-redistribution",
        "title": "Нужно проверить возможность перераспределения земельных участков",
        "targetResult": "CHECKLIST",
        "risk": "high",
        "caseFacts": "границы, принадлежность земли, заявление",
        "crossLinkArea": null
      },
      {
        "id": "agricultural-plot",
        "title": "Возник вопрос об обороте земель сельскохозяйственного назначения",
        "targetResult": "SPECIALIST_REFERRAL",
        "risk": "high",
        "caseFacts": "категория, право, участники сделки",
        "crossLinkArea": null
      },
      {
        "id": "land-withdrawal",
        "title": "Получены документы об изъятии участка или ограничении права",
        "targetResult": "SPECIALIST_REFERRAL",
        "risk": "critical",
        "caseFacts": "уведомление, основание, сроки",
        "crossLinkArea": null
      }
    ]
  },
  {
    "id": "build-renovation",
    "title": "Строительство, реконструкция и оформление зданий",
    "description": "Документы на работы, регистрация сооружений и споры по застройке",
    "specificFacts": [
      "назначение объекта",
      "документы о строительстве",
      "статус земельного участка"
    ],
    "sourceKeys": [
      "GRK",
      "GK",
      "218"
    ],
    "situations": [
      {
        "id": "house-notification",
        "title": "Оформление документов для строительства индивидуального жилого дома",
        "targetResult": "CHECKLIST",
        "risk": "high",
        "caseFacts": "земля, уведомления, параметры здания",
        "crossLinkArea": null
      },
      {
        "id": "reconstruction-docs",
        "title": "Реконструкция здания требует проверки исходных документов",
        "targetResult": "EVIDENCE_PLAN",
        "risk": "high",
        "caseFacts": "проект, границы, площадь",
        "crossLinkArea": null
      },
      {
        "id": "unauthorized-building",
        "title": "Возник спор о самовольной постройке",
        "targetResult": "SPECIALIST_REFERRAL",
        "risk": "critical",
        "caseFacts": "земельное право, параметры, документы",
        "crossLinkArea": null
      },
      {
        "id": "demolition-order",
        "title": "Получено требование снести или изменить постройку",
        "targetResult": "SPECIALIST_REFERRAL",
        "risk": "critical",
        "caseFacts": "текст требования, объект, дата",
        "crossLinkArea": null
      },
      {
        "id": "unfinished-property",
        "title": "Нужно оформить объект незавершённого строительства",
        "targetResult": "EVIDENCE_PLAN",
        "risk": "high",
        "caseFacts": "готовность, документы, право на участок",
        "crossLinkArea": null
      },
      {
        "id": "building-register-refusal",
        "title": "Отказано в кадастровом учёте или регистрации здания",
        "targetResult": "COMPLAINT_DRAFT",
        "risk": "high",
        "caseFacts": "решение, техплан, основания отказа",
        "crossLinkArea": null
      }
    ]
  },
  {
    "id": "neighbors-servitudes",
    "title": "Соседи, доступ и сервитуты",
    "description": "Фактическое использование участков и спорные препятствия",
    "specificFacts": [
      "расположение объектов",
      "предполагаемое нарушение",
      "обращения и ответы соседей"
    ],
    "sourceKeys": [
      "GK",
      "ZK"
    ],
    "situations": [
      {
        "id": "fence-dispute",
        "title": "Спор о расположении забора между земельными участками",
        "targetResult": "EVIDENCE_PLAN",
        "risk": "high",
        "caseFacts": "план, координаты, фото",
        "crossLinkArea": null
      },
      {
        "id": "blocked-drive",
        "title": "Перекрыт проезд или проход к земельному участку",
        "targetResult": "EVIDENCE_PLAN",
        "risk": "high",
        "caseFacts": "схема, основания доступа",
        "crossLinkArea": null
      },
      {
        "id": "servitude-agreement",
        "title": "Не удаётся согласовать условия сервитута",
        "targetResult": "EVIDENCE_PLAN",
        "risk": "high",
        "caseFacts": "варианты маршрута, переписка",
        "crossLinkArea": null
      },
      {
        "id": "utilities-neighbor",
        "title": "Коммуникации проходят по соседнему земельному участку",
        "targetResult": "EVIDENCE_PLAN",
        "risk": "high",
        "caseFacts": "расположение сетей, разрешения",
        "crossLinkArea": null
      },
      {
        "id": "damage-neighbor-build",
        "title": "Соседнее строительство предположительно повредило имущество",
        "targetResult": "EVIDENCE_PLAN",
        "risk": "high",
        "caseFacts": "фото, акты, заключения",
        "crossLinkArea": null
      },
      {
        "id": "water-runoff",
        "title": "Возник спор о водоотведении на соседний участок",
        "targetResult": "EVIDENCE_PLAN",
        "risk": "high",
        "caseFacts": "план, фактический сток, доказательства",
        "crossLinkArea": null
      }
    ]
  },
  {
    "id": "cadastral-valuation",
    "title": "Кадастровый учёт, стоимость и характеристики",
    "description": "Технические сведения об объектах и оценка",
    "specificFacts": [
      "выписка ЕГРН",
      "технический или межевой план",
      "документы об определении стоимости"
    ],
    "sourceKeys": [
      "218",
      "237",
      "GK"
    ],
    "situations": [
      {
        "id": "object-no-record",
        "title": "Сведения об объекте отсутствуют в кадастровом учёте",
        "targetResult": "CHECKLIST",
        "risk": "high",
        "caseFacts": "основание объекта, техплан",
        "crossLinkArea": null
      },
      {
        "id": "wrong-object-area",
        "title": "В ЕГРН неверно указана площадь или характеристика объекта",
        "targetResult": "REQUEST_DRAFT",
        "risk": "high",
        "caseFacts": "выписка, техплан, измерения",
        "crossLinkArea": null
      },
      {
        "id": "cadastral-value-check",
        "title": "Проверить основание кадастровой стоимости недвижимости",
        "targetResult": "EVIDENCE_PLAN",
        "risk": "standard",
        "caseFacts": "дата оценки, объект, выписка",
        "crossLinkArea": null
      },
      {
        "id": "cadastral-value-challenge",
        "title": "Возник спор о кадастровой стоимости объекта",
        "targetResult": "SPECIALIST_REFERRAL",
        "risk": "high",
        "caseFacts": "решение об оценке, объект, документы",
        "crossLinkArea": null
      },
      {
        "id": "technical-plan-error",
        "title": "Предполагаемая ошибка технического плана здания",
        "targetResult": "EVIDENCE_PLAN",
        "risk": "high",
        "caseFacts": "план, заключение специалиста",
        "crossLinkArea": null
      },
      {
        "id": "cadastre-suspension",
        "title": "Приостановлен кадастровый учёт объекта",
        "targetResult": "REQUEST_DRAFT",
        "risk": "high",
        "caseFacts": "решение, заявленный вид учёта",
        "crossLinkArea": null
      }
    ]
  },
  {
    "id": "property-litigation",
    "title": "Защита права и судебные споры о недвижимости",
    "description": "Споры о принадлежности, пользовании и восстановлении права",
    "specificFacts": [
      "стадия спора",
      "документы о праве",
      "стороны и содержание требований"
    ],
    "sourceKeys": [
      "GK",
      "GPK",
      "APK",
      "218"
    ],
    "situations": [
      {
        "id": "recognition-of-right",
        "title": "Необходимо выяснить основания признания права собственности",
        "targetResult": "SPECIALIST_REFERRAL",
        "risk": "high",
        "caseFacts": "объект, возникновение права, доказательства",
        "crossLinkArea": null
      },
      {
        "id": "property-recovery",
        "title": "Имущество находится во владении другого лица",
        "targetResult": "SPECIALIST_REFERRAL",
        "risk": "high",
        "caseFacts": "владение, право, история передачи",
        "crossLinkArea": null
      },
      {
        "id": "property-obstacle",
        "title": "Собственнику препятствуют пользоваться недвижимостью",
        "targetResult": "EVIDENCE_PLAN",
        "risk": "high",
        "caseFacts": "помехи, фактическое пользование",
        "crossLinkArea": null
      },
      {
        "id": "contested-register-right",
        "title": "Оспаривается зарегистрированное право на недвижимость",
        "targetResult": "SPECIALIST_REFERRAL",
        "risk": "critical",
        "caseFacts": "выписка, акты, обстоятельства",
        "crossLinkArea": null
      },
      {
        "id": "property-lease-dispute",
        "title": "Возник спор об аренде нежилого помещения или участка",
        "targetResult": "EVIDENCE_PLAN",
        "risk": "high",
        "caseFacts": "договор, срок, уведомления",
        "crossLinkArea": null
      },
      {
        "id": "civil-court-procedure",
        "title": "Нужно определить судебную процедуру по земельному спору",
        "targetResult": "CROSS_LINK",
        "risk": "high",
        "caseFacts": "стороны, предмет требований, стадия",
        "crossLinkArea": "civil-court"
      }
    ]
  }
] as const satisfies readonly RealEstateGroup[];

export function getRealEstateGroup(groupId:string):RealEstateGroup|null{
  return REAL_ESTATE_GROUPS.find(group=>group.id===groupId)??null;
}
export function getRealEstateSituation(groupId:string,situationId:string):RealEstateSituation|null{
  return getRealEstateGroup(groupId)?.situations.find(item=>item.id===situationId)??null;
}
export function getRealEstatePlanStats(){
  const area=getQnaLegalArea(REAL_ESTATE_BASELINE.areaId);
  return {
    groups:REAL_ESTATE_GROUPS.length,
    situations:REAL_ESTATE_GROUPS.reduce((n,group)=>n+group.situations.length,0),
    crossLinks:REAL_ESTATE_GROUPS.flatMap(group=>group.situations).filter(s=>s.crossLinkArea!==null).length,
    baselineQna:area.baselineQuestions,
    publicNavigatorEnabled:REAL_ESTATE_PUBLICATION_GATE.publicNavigatorEnabled,
    documentsReady:0
  };
}

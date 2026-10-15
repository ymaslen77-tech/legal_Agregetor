import { getQnaLegalArea, type LegalQnaAreaId } from "@/data/legal-qna-taxonomy";

export type RoutePreparationStage = "PRIORITY_1_DESIGN" | "NEXT_STAGE_DESIGN";
export type ProposedResult = "PREPARED_DATA" | "CHECKLIST" | "REQUEST_DRAFT" | "CLAIM_DRAFT" | "COMPLAINT_DRAFT";
export type DraftField = {
  key: string;
  title: string;
  type: "text" | "textarea" | "date" | "choice";
  required: boolean;
  values?: readonly string[];
};

export type ProposedScenario = {
  key: string;
  title: string;
  /** Only the intended document type: no generator or public URL exists yet. */
  proposedResult: ProposedResult;
  requiredFacts: readonly string[];
  risk: "standard" | "high";
};

export type ProposedLegalRoute = {
  areaId: Extract<LegalQnaAreaId,"consumer"|"inheritance"|"enforcement"|"housing">;
  slug: string;
  title: string;
  stage: RoutePreparationStage;
  /** A strong match in question title OR text is needed beyond Service.slug. */
  questionSignals: readonly string[];
  /** Protect against clearly unrelated or misleading cross-topic matches. */
  excludedSignals: readonly string[];
  fields: readonly DraftField[];
  scenarios: readonly ProposedScenario[];
  authoritativeSourcesToVerify: readonly string[];
  sourceVerification: "PENDING_OFFICIAL_TEXT_REVIEW";
  generationStatus: "NOT_IMPLEMENTED";
  filingReady: false;
};

const baseFacts: DraftField[] = [
  { key:"situation", title:"Что произошло и какого результата вы хотите?",type:"textarea", required:true },
  { key:"documents", title:"Какие документы и доказательства есть?",type:"textarea", required:true },
  { key:"dates", title:"Ключевые даты и известные сроки",type:"textarea", required:true },
  { key:"partyStatus", title:"Ваш статус в правоотношении",type:"choice",required:true,values:["заявитель","представитель","другая сторона","не уверен"] }
];
function detail(key:string,title:string):DraftField{return {key,title,type:"textarea",required:true};}
function scenario(key:string,title:string,proposedResult:ProposedResult,risk:"standard"|"high"="standard",requiredFacts:readonly string[]=[]):ProposedScenario{
  return {key,title,proposedResult,risk,requiredFacts:["situation","documents","dates","partyStatus",...requiredFacts]};
}
function route(
  areaId: ProposedLegalRoute["areaId"],slug:string,title:string,
  questionSignals:readonly string[],excludedSignals:readonly string[],
  fields:readonly DraftField[],scenarios:readonly ProposedScenario[],
  authoritativeSourcesToVerify:readonly string[]
):ProposedLegalRoute{
  return {
    areaId,slug,title,stage: areaId==="consumer"||areaId==="inheritance"?"PRIORITY_1_DESIGN":"NEXT_STAGE_DESIGN",
    questionSignals,excludedSignals,fields:[...baseFacts,...fields],scenarios,
    authoritativeSourcesToVerify,sourceVerification:"PENDING_OFFICIAL_TEXT_REVIEW",
    generationStatus:"NOT_IMPLEMENTED",filingReady:false
  };
}

const CONSUMER_SOURCES=["Закон РФ № 2300-1 «О защите прав потребителей»","Гражданский кодекс РФ","ГПК РФ (при судебном обращении)","Официальный правовой портал pravo.gov.ru"];
const INHERITANCE_SOURCES=["Гражданский кодекс РФ, часть третья","Основы законодательства РФ о нотариате","ГПК РФ (при судебном обращении)","Официальный правовой портал pravo.gov.ru"];
const ENFORCEMENT_SOURCES=["Федеральный закон № 229-ФЗ «Об исполнительном производстве»","Федеральный закон № 118-ФЗ «Об органах принудительного исполнения РФ»","КАС РФ / ГПК РФ — в зависимости от спора","Официальный правовой портал pravo.gov.ru"];
const HOUSING_SOURCES=["Жилищный кодекс РФ","Гражданский кодекс РФ","Правила предоставления коммунальных услуг — действующая редакция","ГПК РФ","Официальный правовой портал pravo.gov.ru"];

/**
 * First 24 route blueprints (6 consumer, 7 inheritance, 5 enforcement,
 * 6 housing). They are NOT entries in the public route registry and not a
 * substitute for authoritative legal review.
 */
export const PROPOSED_LEGAL_ROUTES: readonly ProposedLegalRoute[] = [
  route("consumer","nekachestvennyy-tovar","Недостатки товара: требования к продавцу",
    ["некачественн","бракованн","дефект товар","сломался товар","гарантийный ремонт"],
    ["квартир","наследств","кредитор"],
    [detail("purchase","Что и у кого приобретено?"),detail("defect","Какой недостаток обнаружен?"),detail("claim","Что уже направляли продавцу?")],
    [scenario("refund","Требование о возврате денежных средств","REQUEST_DRAFT"),scenario("repair","Требование об устранении недостатков","REQUEST_DRAFT"),scenario("dispute","Спор о причинах недостатка","CHECKLIST","high")],CONSUMER_SOURCES),
  route("consumer","vozvrat-kachestvennogo-tovara","Обмен и возврат товара надлежащего качества",
    ["вернуть товар","возврат товар","обмен товар","не подошел размер","не подошел цвет"],
    ["бракованн","дефект"],
    [detail("purchase","Каким способом и когда приобретён товар?"),detail("condition","Сохранность, использование и характеристики товара")],
    [scenario("exchange","Проверка условий обмена","CHECKLIST"),scenario("request","Подготовка обращения продавцу","REQUEST_DRAFT")],CONSUMER_SOURCES),
  route("consumer","distantsionnaya-pokupka","Дистанционная покупка, маркетплейс и доставка",
    ["маркетплейс","интернет магазин","дистанционн","озон","вайлдберриз","wildberries","доставк заказа"],
    ["оформить кредит","ипотек"],
    [detail("delivery","Получен ли товар, есть ли акт выдачи?"),detail("seller","Кто продавец по чеку и договору?")],
    [scenario("before","Отказ до передачи товара","REQUEST_DRAFT"),scenario("after","Возврат после передачи товара","REQUEST_DRAFT"),scenario("missing","Недоставка или отсутствие возврата","CHECKLIST")],CONSUMER_SOURCES),
  route("consumer","uslugi-nenadlezhashchego-kachestva","Некачественные работы и услуги",
    ["некачественн услуг","услугу оказал","выполненн работ","ремонт некачественн","подрядчик"],
    ["договор трудов","увольнен"],
    [detail("service","Характер работ или услуг, договор"),detail("acceptance","Приняты ли работы и зафиксированы ли недостатки?")],
    [scenario("defect","Требование устранить недостатки","REQUEST_DRAFT"),scenario("cost","Проверка возможности уменьшения цены/возмещения","CHECKLIST")],CONSUMER_SOURCES),
  route("consumer","narushenie-srokov-uslug","Нарушены сроки оказания услуг или выполнения работ",
    ["не выполнен в срок","просрочк услуг","срыв срок","не завершил ремонт","нарушен срок работ"],
    ["срок принятия наследств","срок исковой давности"],
    [detail("contract","Какие сроки указаны в договоре?"),detail("delay","Что конкретно не сделано и когда?")],
    [scenario("request","Претензия по срокам","REQUEST_DRAFT"),scenario("calculate","Проверка расчёта требований","PREPARED_DATA")],CONSUMER_SOURCES),
  route("consumer","turisticheskie-uslugi","Туристические услуги: возврат и претензии",
    ["туристическ","туроператор","турфирм","путевк","туристическ поездк"],
    ["рабочая командировк"],
    [detail("booking","Договор, туроператор и основание отмены"),detail("travel","Дата поездки и уже понесённые расходы")],
    [scenario("cancel","Возврат и отказ от туристических услуг","CHECKLIST"),scenario("claim","Претензия туроператору","REQUEST_DRAFT")],CONSUMER_SOURCES),

  route("inheritance","prinyatie-nasledstva","Принятие наследства у нотариуса",
    ["принять наследств","вступить в наследств","нотариус наследств","наследственное дело","вступление в наследств"],
    ["некачественн товар"],
    [detail("deceased","Когда открылось наследство?"),detail("relation","Какова связь с наследодателем и основание наследования?")],
    [scenario("notary","Подготовить документы для нотариуса","CHECKLIST"),scenario("factual","Оценить фактическое принятие","PREPARED_DATA","high")],INHERITANCE_SOURCES),
  route("inheritance","propushchennyy-srok-nasledstva","Пропущен срок принятия наследства",
    ["пропустил срок наследств","пропущен срок принятия","восстановить срок наследств","не успел вступить в наследств"],
    ["пропуск срок судебной апелляции"],
    [detail("dateOfDeath","Дата открытия наследства"),detail("reasons","Причины и продолжительность пропуска")],
    [scenario("consent","Проверка внесудебного согласия наследников","CHECKLIST"),scenario("court","Варианты судебного восстановления","CLAIM_DRAFT","high")],INHERITANCE_SOURCES),
  route("inheritance","osparivanie-zaveshchaniya","Оспаривание завещания",
    ["оспорить завещан","недействительн завещан","подделк завещан","завещание оспорить"],
    ["оспорить брачный договор"],
    [detail("will","Известные реквизиты завещания"),detail("grounds","На каких фактах основано оспаривание?")],
    [scenario("check","Оценка оснований и доказательств","CHECKLIST","high"),scenario("claim","Проект требования после проверки основания","CLAIM_DRAFT","high")],INHERITANCE_SOURCES),
  route("inheritance","obyazatelnaya-dolya","Обязательная доля в наследстве",
    ["обязательная доля наследств","обязательн долю наследств","нетрудоспособн наследник"],
    ["обязательные алименты"],
    [detail("status","Обстоятельства, подтверждающие возможное право на долю"),detail("estate","Известный состав наследственного имущества")],
    [scenario("eligibility","Проверка условий права","CHECKLIST","high"),scenario("notary","Подготовка к обращению к нотариусу","PREPARED_DATA")],INHERITANCE_SOURCES),
  route("inheritance","dolgi-nasledodatelya","Долги наследодателя и пределы ответственности",
    ["долги умерш","кредит умерш","долг наследодател","долги по наследств"],
    ["долги по алиментам"],
    [detail("debts","Данные о долгах, требования кредиторов"),detail("acceptance","Принято ли наследство и в каком объёме?")],
    [scenario("limits","Оценить ответственность и документы","CHECKLIST","high"),scenario("reply","Проект ответа на требование кредитора","REQUEST_DRAFT","high")],INHERITANCE_SOURCES),
  route("inheritance","nasleduemaya-nedvizhimost","Оформление наследуемой недвижимости",
    ["квартира в наследств","наследств квартир","унаследовал дом","наследство недвижим"],
    ["покупка квартиры у застройщика"],
    [detail("property","Какая недвижимость входит в наследство?"),detail("title","Есть ли правоустанавливающие документы?")],
    [scenario("documents","Документы и регистрация прав","CHECKLIST"),scenario("dispute","Спор о принадлежности имущества","CHECKLIST","high")],INHERITANCE_SOURCES),
  route("inheritance","razdel-nasledstva","Раздел наследственного имущества",
    ["раздел наследств","доля наследств","спор между наследниками","наследственные доли"],
    ["раздел имущества супругов"],
    [detail("heirs","Кто наследники и в каком статусе?"),detail("assets","Известный состав имущества и доли")],
    [scenario("settle","Проект согласования распределения","PREPARED_DATA"),scenario("court","Судебный спор о разделе","CLAIM_DRAFT","high")],INHERITANCE_SOURCES),

  route("enforcement","poisk-ispolnitelnogo-proizvodstva","Найти и проверить исполнительное производство",
    ["исполнительн производств","пристав","фссп","исполнительный лист"],
    ["исполнительный директор"],
    [detail("document","Какой исполнительный документ имеется?")],
    [scenario("check","Проверка статуса и материалов производства","CHECKLIST"),scenario("request","Запрос материалов","REQUEST_DRAFT")],ENFORCEMENT_SOURCES),
  route("enforcement","zhaloba-na-pristava","Жалоба на действия или бездействие пристава",
    ["жалоба на пристава","жалобу на пристава","жалобы на пристава","бездействие пристав","обжаловать пристава","пристав незаконно"],
    ["оспаривание завещания"],
    [detail("action","Какие конкретно действия оспариваются?"),detail("dateOfKnowledge","Когда о них стало известно?")],
    [scenario("authority","Подчинённость и порядок обжалования","CHECKLIST","high"),scenario("complaint","Подготовка жалобы","COMPLAINT_DRAFT","high")],ENFORCEMENT_SOURCES),
  route("enforcement","arest-schetov","Арест счёта и обращение взыскания",
    ["арестовали счет","арест банковской карты","арест счет","заблокировали счет пристав"],
    ["налоговое уведомление"],
    [detail("restrictions","Кем и когда введено ограничение?"),detail("moneyOrigin","Происхождение денежных средств")],
    [scenario("protected","Проверка защищённых выплат","CHECKLIST","high"),scenario("request","Заявление о снятии ограничения","REQUEST_DRAFT","high")],ENFORCEMENT_SOURCES),
  route("enforcement","uderzhaniya-i-dolgi","Удержания из зарплаты, пенсии и расчёт задолженности",
    ["удержание из зарплаты пристав","удерживают пенсию","списали с карты","удержания по исполнительному"],
    ["удержание работодателем за прогул"],
    [detail("incomes","Виды доходов и удерживаемые суммы"),detail("writ","Наличие и реквизиты исполнительного документа")],
    [scenario("limits","Проверка размера удержаний","PREPARED_DATA","high"),scenario("challenge","Обращение о корректировке","REQUEST_DRAFT","high")],ENFORCEMENT_SOURCES),
  route("enforcement","okonchanie-ispolneniya","Приостановление, прекращение и окончание производства",
    ["прекратить исполнительное производств","окончить исполнительное производств","приостановить исполнительное производств","закрыли производство пристав"],
    ["прекращение алиментов без исполнительного"],
    [detail("basis","Какое событие или документ является основанием?")],
    [scenario("qualify","Выбрать правовой режим","CHECKLIST","high"),scenario("request","Подготовить заявление","REQUEST_DRAFT","high")],ENFORCEMENT_SOURCES),

  route("housing","vyselenie-i-vselenie","Выселение, вселение, право проживания",
    ["выселение из квартиры","выселить","вселение","право проживания"],
    ["отказ от тура"],
    [detail("title","Основание владения или пользования жильём"),detail("occupants","Кто проживает и каковы их права?")],
    [scenario("analyze","Определить вид и основания спора","CHECKLIST","high"),scenario("claim","Проект обращения после проверки права","CLAIM_DRAFT","high")],HOUSING_SOURCES),
  route("housing","sotsialnyy-naem","Социальный наём и муниципальное жильё",
    ["социальный наем","соцнайм","муниципальная квартира","приватизация жилья"],
    ["социальное пособие"],
    [detail("tenure","Договор, предоставление жилья и статус заявителя")],
    [scenario("documents","Документы и порядок обращения","CHECKLIST"),scenario("refusal","Обжалование отказа","COMPLAINT_DRAFT","high")],HOUSING_SOURCES),
  route("housing","registratsiya-po-mestu-zhitelstva","Регистрация по месту жительства",
    ["прописка в квартире","снять с регистрации","зарегистрировать в квартире","выписать из квартиры"],
    ["временная регистрация иностранца"],
    [detail("residence","Кому принадлежит помещение, кто зарегистрирован?")],
    [scenario("check","Определение согласий и прав","CHECKLIST"),scenario("dispute","Спор о регистрации и пользовании","CLAIM_DRAFT","high")],HOUSING_SOURCES),
  route("housing","upravlyayushchaya-kompaniya","Управляющая организация и общее имущество",
    ["управляющая компания","управляющей компании","тсж","общее имущество дома"],
    ["управляющий финансовый"],
    [detail("building","Дом, управляющая организация, обязанности"),detail("request","Что конкретно нарушено и что уже заявлено?")],
    [scenario("request","Обращение в управляющую организацию","REQUEST_DRAFT"),scenario("complaint","Жалоба при неустранении нарушения","COMPLAINT_DRAFT")],HOUSING_SOURCES),
  route("housing","nachisleniya-zhku","Начисления за ЖКУ и перерасчёт",
    ["неверно начислили жкх","перерасчет коммунальн","плата за коммунальные","завышен счет за жкх"],
    ["кредитный счет","плата госпошлины"],
    [detail("charge","Что и за какой период начислено?"),detail("meter","Показания и квитанции, акт проверки")],
    [scenario("check","Проверка вида начисления","PREPARED_DATA"),scenario("request","Требование о перерасчёте","REQUEST_DRAFT")],HOUSING_SOURCES),
  route("housing","zaliv-kvartiry","Залив квартиры, ущерб и ответственность",
    ["затопили квартиру","залив квартиры","протечка с крыши","ущерб от залива"],
    ["залив топлива"],
    [detail("cause","Предполагаемый источник залива"),detail("damage","Акт, фото, оценка вреда")],
    [scenario("evidence","Сохранение доказательств и установление ответственного","CHECKLIST","high"),scenario("claim","Досудебное обращение/иск после установления лица","CLAIM_DRAFT","high")],HOUSING_SOURCES)
];

export function getProposedRoutes(areaId: ProposedLegalRoute["areaId"]): readonly ProposedLegalRoute[] {
  getQnaLegalArea(areaId); // validated against the unified Q&A taxonomy
  return PROPOSED_LEGAL_ROUTES.filter((route) => route.areaId === areaId);
}
export function getProposedRoute(areaId: ProposedLegalRoute["areaId"],slug:string):ProposedLegalRoute|null{
  return PROPOSED_LEGAL_ROUTES.find((route)=>route.areaId===areaId&&route.slug===slug)??null;
}

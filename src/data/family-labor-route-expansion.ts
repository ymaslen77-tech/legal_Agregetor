/**
 * Planned family/labor amendments derived from the 2026-10-16 Q&A gap audit.
 * Internal only. Never register these as public routes or document generators.
 */
export type Area = "family" | "labor";
export type Kind = "NEW_ROUTE" | "EXISTING_ROUTE_EXTENSION" | "CROSS_AREA_LINK";
export type IntakeField = { key: string; label: string; options?: readonly string[] };
export type ScenarioPlan = {
  key: string; title: string; requiredFields: readonly string[];
  emergencyFirst: boolean;
};
export type FamilyLaborPlan = {
  id: string; area: Area; kind: Kind; title: string; qnaSignalHits: number;
  existingSlug: string | null; destinationArea: string | null;
  fields: readonly IntakeField[]; scenarios: readonly ScenarioPlan[];
  legalSources: readonly string[];
  legalReview: "PENDING_OFFICIAL_SOURCES"; generation: "NOT_IMPLEMENTED";
  publicEnabled: false; filingReady: false;
};
const common: readonly IntakeField[] = [
  {key:"role",label:"Статус обратившегося",options:["заявитель","другая сторона","представитель","не знаю"]},
  {key:"event",label:"Что произошло (без лишних персональных данных)"},
  {key:"dates",label:"Ключевые даты, вручение документов и возможные сроки"},
  {key:"evidence",label:"Какие документы и доказательства существуют"},
  {key:"outcome",label:"Желаемый результат"}
];
const f = (key:string,label:string,options?:readonly string[]):IntakeField => ({key,label,...(options?{options}:{})});
const sc = (key:string,title:string,extra:readonly string[]=[]):ScenarioPlan =>
  ({key,title,requiredFields:[...common.map(item=>item.key),...extra],emergencyFirst:false});
const officialFamily = ["СК РФ", "ГК РФ", "ГПК РФ", "официальные тексты на pravo.gov.ru"];
const officialLabor = ["ТК РФ", "ГПК РФ", "официальные тексты на pravo.gov.ru"];
function make(
  id:string,area:Area,kind:Kind,title:string,qnaSignalHits:number,
  details:readonly IntakeField[],scenarios:readonly ScenarioPlan[],
  existingSlug:string|null=null,destinationArea:string|null=null
):FamilyLaborPlan{
  return {id,area,kind,title,qnaSignalHits,existingSlug,destinationArea,
    fields:kind==="CROSS_AREA_LINK"?[]:kind==="NEW_ROUTE"&&id==="family-emergency-safety"?[]:[...common,...details],
    scenarios,legalSources:area==="family"?officialFamily:officialLabor,
    legalReview:"PENDING_OFFICIAL_SOURCES",generation:"NOT_IMPLEMENTED",
    publicEnabled:false,filingReady:false};
}
const family = (id:string,title:string,hits:number,details:readonly IntakeField[],cases:readonly ScenarioPlan[]) =>
  make(id,"family","NEW_ROUTE",title,hits,details,cases);
const labor = (id:string,title:string,hits:number,details:readonly IntakeField[],cases:readonly ScenarioPlan[]) =>
  make(id,"labor","NEW_ROUTE",title,hits,details,cases);
const extend = (id:string,area:Area,slug:string,title:string,hits:number,details:readonly IntakeField[],cases:readonly ScenarioPlan[]) =>
  make(id,area,"EXISTING_ROUTE_EXTENSION",title,hits,details,cases,slug);
const link = (id:string,slug:string,title:string,hits:number,otherArea:string) =>
  make(id,"family","CROSS_AREA_LINK",title,hits,[],[],slug,otherArea);

/** 8 new proposals, 12 route extensions, 3 cross-area hand-offs. */
export const FAMILY_LABOR_PLANS:readonly FamilyLaborPlan[] = [
  family("cohabitation-property","Имущество фактических сожителей",555,
    [f("marriage","Был ли зарегистрирован брак?",["да","нет","не знаю"]),f("contributions","Вклады сторон и оформление имущества")],
    [sc("ownership","Собственность и доказательства вкладов",["marriage","contributions"]),sc("debts","Долги и совместные расходы без автоматического применения режима имущества супругов",["marriage","contributions"])]),
  family("adult-guardianship","Опека над совершеннолетним",315,
    [f("age","Совершеннолетний?",["да","нет","не знаю"]),f("capacityAct","Есть ли судебный акт о дееспособности?",["да","нет","не знаю"])],
    [sc("capacity","Проверка процедуры определения дееспособности",["age","capacityAct"]),sc("appointment","Назначение опекуна и полномочия",["age","capacityAct"]),sc("appeal","Обжалование действий органа опеки",["capacityAct"])]),
  family("family-emergency-safety","Насилие в семье: срочная защита",70,[],
    [{key:"immediate-danger",title:"Приоритет безопасности и экстренной помощи",requiredFields:[],emergencyFirst:true},
     {key:"safe-evidence",title:"Безопасное сохранение доказательств и профильные обращения",requiredFields:[],emergencyFirst:true}]),
  labor("maternity-leave","Беременность и отпуск по беременности и родам",1198,
    [f("leaveType","Отпуск по беременности и родам или уход за ребёнком?",["беременность и роды","уход за ребёнком","не знаю"]),f("medicalBasis","Медицинские документы и даты")],
    [sc("leave","Предоставление отпуска",["leaveType","medicalBasis"]),sc("benefits","Оформление выплат",["leaveType","medicalBasis"]),sc("guarantees","Трудовые гарантии",["leaveType"])]),
  labor("shifts-and-business-trips","Вахта, командировки, разъездная работа",279,
    [f("mode","Режим работы",["вахта","командировка","разъездная работа","не знаю"]),f("expenses","Спорные расходы, время или выплаты")],
    [sc("expenses","Расходы и компенсации",["mode","expenses"]),sc("schedule","Режим работы и отдыха",["mode"])]),
  labor("secondary-employment","Совместительство и совмещение",257,
    [f("mode","Как оформлена дополнительная работа?",["совместительство","совмещение","не знаю"]),f("consent","Договор, согласие и условия оплаты")],
    [sc("registration","Проверить различие двух правовых режимов",["mode","consent"]),sc("payment","Оплата и прекращение дополнительной работы",["mode","consent"])]),
  labor("minor-workers","Работа несовершеннолетних",176,
    [f("age","Возрастная группа",["до 14","14–15","16–17","не знаю"]),f("conditions","Характер работы и учебное время")],
    [sc("eligibility","Условия трудоустройства и гарантии",["age","conditions"]),sc("violation","Защита при нарушении ограничений",["age","conditions"])]),
  labor("foreign-workers","Иностранные работники",107,
    [f("status","Документы и статус пребывания"),f("employment","Регион, трудовой договор и основания работы")],
    [sc("eligibility","Разделить миграционные требования и трудовые права",["status","employment"]),sc("violation","Проверка способов защиты работника",["status","employment"])]),
  extend("alimony-order-objections","family","alimenty-na-rebenka","Отмена судебного приказа по алиментам",134,
    [f("receipt","Когда и как получен судебный приказ"),f("order","Суд и реквизиты приказа")],
    [sc("objections","Проверить вручение, срок и порядок возражений",["receipt","order"])]),
  extend("alimony-penalty","family","alimenty-na-rebenka","Неустойка за алиментную задолженность",52,
    [f("debt","Периоды, суммы и постановления о расчёте долга"),f("liability","Обстоятельства ответственности и возражения")],
    [sc("penalty","Расчёт по периодам с проверкой оснований и исключений",["debt","liability"])]),
  extend("alimony-enforcement","family","alimenty-na-rebenka","Исполнение алиментного решения",801,
    [f("proceeding","Номер или статус исполнительного производства"),f("bailiff","Действия и постановления пристава")],
    [sc("inaction","Бездействие пристава и адресат жалобы",["proceeding","bailiff"]),sc("balance","Расчёт задолженности и сведения об имуществе",["proceeding"])]),
  extend("parents-or-school","family","raznoglasiya-roditeley-po-vospitaniyu-i-obrazovaniyu",
    "Различить спор родителей и отказ образовательной организации",1075,
    [f("counterparty","С кем спор?",["второй родитель","школа/детсад","не знаю"])],
    [sc("jurisdiction","Выбор компетентного адресата",["counterparty"])]),
  extend("unpaid-leave","labor","ezhegodnyy-otpusk","Отпуск без сохранения заработной платы",164,
    [f("basis","Основание и даты запрашиваемого отпуска")],
    [sc("leave","Право, согласие и оформление отпуска",["basis"])]),
  extend("remote-work","labor","trudovoy-dogovor","Дистанционная работа",261,
    [f("mode","Постоянная, временная или комбинированная работа"),f("equipment","Оборудование, расходы и связь")],
    [sc("conditions","Договор и порядок взаимодействия",["mode","equipment"])]),
  extend("occupational-safety","labor","prava-i-obyazannosti-rabotodatelya","Охрана труда, медосмотры, травмы",127,
    [f("medical","Предоставлена медицинская помощь?",["да","нет","не знаю"]),f("incident","Документы и обстоятельства происшествия")],
    [sc("response","Медицинская помощь прежде процессуальных документов",["medical"]),sc("investigation","Расследование и доказательства",["incident"])]),
  extend("part-time-hours","labor","rabochee-vremya","Неполное рабочее время",118,
    [f("schedule","Основание и желаемый график")],
    [sc("schedule","Установление режима и гарантии",["schedule"])]),
  extend("study-leave","labor","ezhegodnyy-otpusk","Учебный отпуск",90,
    [f("education","Программа, форма обучения и подтверждающие документы")],
    [sc("study","Право, оформление и оплата",["education"])]),
  extend("hiring-refusal","labor","trudovoy-dogovor","Отказ в приёме на работу",67,
    [f("reason","Отказ, запрос причин и подтверждения")],
    [sc("refusal","Проверка обоснованности отказа",["reason"])]),
  extend("downtime","labor","zarabotnaya-plata","Простой и его оплата",60,
    [f("cause","Причина простоя и письменное оформление")],
    [sc("payment","Режим и расчёт оплаты",["cause"])]),
  extend("pre-retirement","labor","spory-s-rabotodatelem","Гарантии предпенсионерам",121,
    [f("employerAction","Какие действия работодателя оспариваются?")],
    [sc("guarantees","Проверка применимых гарантий",["employerAction"])]),
  link("child-benefits","alimenty-na-rebenka","Пособия и маткапитал → социальное обеспечение",921,"social"),
  link("child-registration","roditeli-i-rebenok-posle-razvoda","Регистрация ребёнка → жилищное право",397,"housing"),
  link("child-school","raznoglasiya-roditeley-po-vospitaniyu-i-obrazovaniyu",
    "Отказ в зачислении → образовательное право",1075,"education")
];
export function getFamilyLaborPlans(area?:Area):readonly FamilyLaborPlan[]{
  return area?FAMILY_LABOR_PLANS.filter(item=>item.area===area):FAMILY_LABOR_PLANS;
}
export function getFamilyLaborPlan(id:string):FamilyLaborPlan|null{
  return FAMILY_LABOR_PLANS.find(item=>item.id===id)??null;
}

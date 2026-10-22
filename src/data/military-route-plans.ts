/**
 * Military law first batch. Internal stage only: DO NOT register as published
 * legalProblems, documents or indexable routes before the legal acceptance gates.
 * The Q&A signal is a keyword overlap, not independently validated legal demand.
 */
export type MilitaryField = {
  key:string; label:string; values?:readonly string[];
};
export type MilitaryScenario = {
  key:string; title:string; required:readonly string[];
  kind:"CHECKLIST"|"DRAFT"|"URGENT_INSTRUCTION";
  sources:readonly MilitarySourceId[];
  safetyNotes:readonly string[];
  evidence:readonly string[];
};
export type MilitaryRoute = {
  id:string; slug:string; title:string; qnaSignalHits:number|null;
  fields:readonly MilitaryField[]; scenarios:readonly MilitaryScenario[];
  publicationApproved:false; legalRegistryReviewedAt:null; filingReady:false;
};
export type MilitarySourceId = "53fz"|"76fz"|"1237"|"647"|"306fz"|"565"|"574"|"kas"|"plenum8"|"plenum21";

export const MILITARY_SOURCES:Readonly<Record<MilitarySourceId,{name:string;url:string;verification:"PRIMARY_REFERENCE_FOUND_CASE_SCOPE_PENDING"|"PRIMARY_DOCUMENT_LINK_PENDING"}>>={
 "53fz":{name:"ФЗ № 53-ФЗ «О воинской обязанности и военной службе» (проверить действующую редакцию)",url:"https://mchs.gov.ru/dokumenty/814",verification:"PRIMARY_REFERENCE_FOUND_CASE_SCOPE_PENDING"},
 "76fz":{name:"ФЗ № 76-ФЗ «О статусе военнослужащих» (проверить действующую редакцию)",url:"https://mchs.gov.ru/dokumenty/812",verification:"PRIMARY_REFERENCE_FOUND_CASE_SCOPE_PENDING"},
 "1237":{name:"Указ Президента № 1237 «Вопросы прохождения военной службы» (проверить актуальные изменения)",url:"https://mchs.gov.ru/dokumenty/804",verification:"PRIMARY_REFERENCE_FOUND_CASE_SCOPE_PENDING"},
 "647":{name:"Указ Президента РФ от 21.09.2022 № 647 — официальное опубликование; действие во времени и специальные ограничения проверить",url:"https://publication.pravo.gov.ru/Document/View/0001202209210001",verification:"PRIMARY_REFERENCE_FOUND_CASE_SCOPE_PENDING"},
 "306fz":{name:"Федеральный закон от 07.11.2011 № 306-ФЗ — ведомственная публикация; актуальная редакция и выплаты требуют сверки",url:"https://rosguard.gov.ru/document/article/federalnyj-zakon-ot-07112011--306fz",verification:"PRIMARY_REFERENCE_FOUND_CASE_SCOPE_PENDING"},
 "565":{name:"Постановление № 565 о военно-врачебной экспертизе (сверить редакцию)",url:"https://mchs.gov.ru/dokumenty/553",verification:"PRIMARY_REFERENCE_FOUND_CASE_SCOPE_PENDING"},
 "574":{name:"Постановление № 574 о независимой военно-врачебной экспертизе",url:"https://mchs.gov.ru/dokumenty/693",verification:"PRIMARY_REFERENCE_FOUND_CASE_SCOPE_PENDING"},
 "kas":{name:"КАС РФ: возможный процессуальный порядок, определяется юристом",url:"https://pravo.gov.ru/",verification:"PRIMARY_DOCUMENT_LINK_PENDING"},
 "plenum8":{name:"Пленум ВС РФ № 8 от 29.05.2014, изменения от 28.10.2025 № 21 — подсудность и военная служба",url:"https://vsrf.ru/documents/own/8382/",verification:"PRIMARY_REFERENCE_FOUND_CASE_SCOPE_PENDING"},
 "plenum21":{name:"Пленум ВС РФ № 21 от 28.10.2025 — изменения разъяснений № 8",url:"https://www.vsrf.ru/documents/all/34814",verification:"PRIMARY_REFERENCE_FOUND_CASE_SCOPE_PENDING"}
};
const field=(key:string,label:string,values?:readonly string[]):MilitaryField=>({key,label,...(values?{values}:{})});
const common:readonly MilitaryField[]=[
 field("role","Кто обращается?",["военнослужащий","призывник","уволенный военнослужащий","член семьи","представитель","не знаю"]),
 field("regime","Правовой статус и вид службы",["контракт","призыв","мобилизация","уволен","доподготовка к призыву","добровольческое формирование","военные сборы","мобилизационный людской резерв","не знаю"]),
 field("event","Что произошло (без сведений о расположении части, задачах или личных данных других лиц)?"),
 field("dates","Даты события и получения решений: укажите известные, без автоматического исчисления сроков"),
 field("evidence","Документы, подтверждающие обстоятельства (без паспортных и медицинских данных)"),
 field("goal","Какой результат необходимо получить?")
];
const extra:Record<string,MilitaryField>={
 authority:field("authority","Известный по документам адресат (без адреса и номера части)"),
 contract:field("contract","Дата/вид контракта и подтверждающие документы"),
 order:field("order","Реквизиты известного приказа/решения или указание, что копии нет"),
 grounds:field("grounds","Предполагаемое основание и подтверждение; без правовой квалификации"),
 payments:field("payments","Какие начисления или выплаты вызывают вопросы, период"),
 decision:field("decision","Какое действие, ответ или бездействие рассматривается"),
 receipt:field("receipt","Когда фактически узнали о решении и как получили его"),
 medical:field("medical","Наличие заключения ВВК/медицинских документов (без диагноза)"),
 urgency:field("urgency","Нужна ли неотложная медицинская помощь?",["да","нет","не знаю"]),
 summons:field("summons","Вид и способ получения повестки/решения, дата"),
 deferment:field("deferment","Документально подтверждённое возможное основание отсрочки"),
 family:field("family","Какие семейные обстоятельства подтверждены документами")
};
const sc=(key:string,title:string,kind:MilitaryScenario["kind"],extras:readonly string[],sources:readonly MilitarySourceId[],safetyNotes:readonly string[],evidence:readonly string[]):MilitaryScenario=>({
 key,title,kind,required:kind==="URGENT_INSTRUCTION"?[]:[...common.map(f=>f.key),...extras],sources,safetyNotes,evidence
});
const baseNotes=[
 "Установите фактический статус и применимое регулирование на дату события.",
 "Не назначайте адресата, срок обжалования, суд, госпошлину или основание увольнения без исследования документов.",
 "При действии особых режимов, связанных с мобилизацией, требования обычного срока контракта могут не определять исход."
];
const make=(id:string,slug:string,title:string,hits:number|null,fields:readonly MilitaryField[],scenarios:readonly MilitaryScenario[]):MilitaryRoute=>({
 id,slug,title,qnaSignalHits:hits,fields:[...common,...fields],scenarios,publicationApproved:false,legalRegistryReviewedAt:null,filingReady:false
});
/** No published URL or filing-ready template is created from these entries. */
export const MILITARY_ROUTES:readonly MilitaryRoute[]=[
 make("service-contract","prokhozhdenie-voennoy-sluzhby-po-kontraktu","Контракт и прохождение военной службы",3028,[extra.contract,extra.order,extra.authority],[
  sc("contract-check","Заключение и условия контракта","CHECKLIST",["contract"],["53fz","1237","647"],baseNotes,["Подтверждение контракта и условий","Приказы и ответы"]),
  sc("service-order-copy","Получение копии приказа или ответа","DRAFT",["order","authority"],["53fz","76fz","1237"],baseNotes,["Реквизиты приказа или подтверждение обращения","Подтверждение полномочий"]),
  sc("transfer","Перевод и изменение условий службы","CHECKLIST",["contract","order"],["53fz","1237","647"],baseNotes,["Контракт, служебные документы и ответы"])
 ]),
 make("military-discharge","uvolnenie-s-voennoy-sluzhby","Увольнение с военной службы",null,[extra.grounds,extra.order,extra.medical],[
  sc("discharge-basis","Основания увольнения: предварительная проверка","CHECKLIST",["grounds"],["53fz","1237","647","plenum8","plenum21"],baseNotes,["Контракт, решения командования, документы об основаниях"]),
  sc("medical-discharge","Увольнение по состоянию здоровья","CHECKLIST",["medical"],["53fz","76fz","565","647"],[...baseNotes,"Не подменять заключение ВВК автоматическим решением об увольнении."],["Заключение ВВК, медицинские документы и приказы"]),
  sc("discharge-order","Получение приказа и расчёта при увольнении","CHECKLIST",["order"],["53fz","76fz","306fz"],baseNotes,["Приказ, данные об обеспечении и расчёте"])
 ]),
 make("military-pay","denezhnoe-dovolstvie-i-vyplaty","Денежное довольствие и выплаты военнослужащим",null,[extra.payments,extra.authority,extra.family],[
  sc("pay-breakdown","Запрос сведений о начислениях и удержаниях","DRAFT",["payments","authority"],["76fz","306fz"],baseNotes,["Расчётные сведения за указанные периоды","Подтверждение обращений"]),
  sc("benefits","Компенсации и дополнительные выплаты","CHECKLIST",["payments"],["76fz","306fz"],baseNotes,["Документы об основании выплаты и расчетные сведения"]),
  sc("family-benefits","Выплаты членам семьи","CHECKLIST",["family","payments"],["76fz","306fz"],[...baseNotes,"Отдельно проверить заявителя и доказательства права члена семьи."],["Документы о родстве и статусе, ответы ведомства"])
 ]),
 make("military-medical","voenno-vrachebnaya-komissiya","Военно-врачебная комиссия и состояние здоровья",null,[extra.medical,extra.urgency],[
  sc("medical-emergency","Неотложная медицинская помощь","URGENT_INSTRUCTION",[],["76fz","565"],["При угрозе жизни или здоровью незамедлительно обратитесь за экстренной медицинской помощью; анкету заполнять не требуется.","Не передавайте диагнозы, маршруты части или данные третьих лиц в публичный сервис."],[]),
  sc("vvk-conclusion","Проверка заключения военно-врачебной комиссии","CHECKLIST",["medical","urgency"],["53fz","76fz","565"],[...baseNotes,"Категория годности и медицинские основания требуют профильной экспертизы."],["Копия заключения ВВК","Медицинские документы из официальных источников"]),
  sc("independent-review","Независимая военно-врачебная экспертиза","CHECKLIST",["medical","urgency"],["565","574"],[...baseNotes,"Порядок и возможность независимой экспертизы уточняются индивидуально."],["Заключение ВВК и подтверждённые медицинские документы"])
 ]),
 make("command-appeal","obrashchenie-i-obzhalovanie-komandovaniya","Обращения и обжалование действий командования",null,[extra.decision,extra.receipt,extra.authority],[
  sc("request-explanation","Запрос письменного разъяснения","CHECKLIST",["decision","authority"],["76fz","1237"],baseNotes,["Предыдущие обращения, ответы, подтверждение вручения"]),
  sc("challenge-decision","Предварительная проверка обжалования решения","CHECKLIST",["decision","receipt"],["53fz","76fz","kas","plenum8","plenum21"],[...baseNotes,"Сроки и компетенцию суда либо ведомства нельзя угадывать по названию жалобы."],["Текст решения, дата получения и подтверждения"]),
  sc("inaction","Отсутствие ответа или действие командования","CHECKLIST",["decision","receipt"],["76fz","kas","plenum8","plenum21"],baseNotes,["Подтверждение направления обращения, ответы"])
 ]),
 make("mobilization-draft","prizyv-i-mobilizatsiya","Призыв, мобилизация и отсрочки",1658,[extra.summons,extra.deferment,extra.receipt],[
  sc("draft-notice","Повестка и решения комиссии: проверка обстоятельств","CHECKLIST",["summons"],["53fz","647"],[...baseNotes,"Не переносить правила обычного призыва на мобилизацию без проверки статуса."],["Повестка и решение комиссии, подтверждение вручения"]),
  sc("deferment","Проверка возможной отсрочки","CHECKLIST",["summons","deferment"],["53fz","647"],baseNotes,["Документы об основании отсрочки и сообщения органа"]),
  sc("challenge-draft","Обжалование решения о призыве: предварительный порядок","CHECKLIST",["summons","receipt"],["53fz","kas","647"],[...baseNotes,"Не обещать приостановления исполнения решения без анализа действующей нормы и процессуального положения."],["Решение, дата вручения, приложения"])
 ])
];
export function getMilitaryRoute(id:string):MilitaryRoute|null {return MILITARY_ROUTES.find(r=>r.id===id)??null;}
export function getMilitaryDocumentSlug(route:MilitaryRoute,scenario:MilitaryScenario):string|null{
 return scenario.kind==="URGENT_INSTRUCTION"?null:"military-"+route.id+"-"+scenario.key;
}

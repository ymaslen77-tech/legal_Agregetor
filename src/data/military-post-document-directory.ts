/**
 * Post-draft routing assistance, NOT an automatic determination of jurisdiction.
 * A residence region alone cannot identify military command, military prosecutor,
 * finance office, VVK or the recipient of an individual servicemember's document.
 * No personal facts, document text or region selection leave the browser.
 */
import {RUSSIAN_REGIONS} from "@/data/guardianship-territories";

export const MILITARY_DIRECTORY_REGIONS=RUSSIAN_REGIONS.map(r=>({id:r.id,label:r.label}));
export type MilitaryAgencyId="command"|"minoborony"|"military-prosecutor"|"sfr"|"commissariat"|"vvk"|"independent-expert"|"court";
export type MilitaryAgencyEntry={
 id:MilitaryAgencyId;
 title:string;
 purpose:string;
 lookupUrl:string;
 lookupLabel:string;
 onlineUrl?:string;
 onlineLabel?:string;
 regional:boolean;
 warning:string;
 sourceUrl:string;
};
type AgencyPlan={primary:readonly MilitaryAgencyId[];additional:readonly MilitaryAgencyId[];reason:string};
const agency=(data:MilitaryAgencyEntry)=>data;
export const MILITARY_AGENCIES:Readonly<Record<MilitaryAgencyId,MilitaryAgencyEntry>>={
 command:agency({
  id:"command",title:"Командование, кадровый или финансовый орган по месту службы",
  purpose:"Первичный адресат для личных приказов, рапортов, кадровых решений и расчётов, если это следует из документов о службе.",
  lookupUrl:"https://mil.ru/",lookupLabel:"Официальный сайт Минобороны: уточнить контакты подчинённого органа",
  regional:false,
  warning:"Получатель определяется видом службы, ведомственной принадлежностью, приказом и подчинённостью. Адрес части, должностное лицо и право заявителя на сведения нельзя выводить из региона проживания.",
  sourceUrl:"https://www.consultant.ru/document/cons_doc_LAW_175502/d0acb7be3741db537647c38a9941c1dc445b012f/"
 }),
 minoborony:agency({
  id:"minoborony",title:"Министерство обороны России: приём обращений граждан",
  purpose:"Обращение по вопросам, относящимся к компетенции Минобороны, когда получатель в подчинённом органе не установлен или требуется ведомственное разъяснение.",
  lookupUrl:"https://mil.ru/",lookupLabel:"Открыть официальный сайт Минобороны",
  onlineUrl:"https://lkg.mil.ru/",onlineLabel:"Перейти на портал Минобороны и найти электронную приёмную",
  regional:false,
  warning:"Для электронной подачи может требоваться вход через Госуслуги. Сервис не определяет орган военного управления автоматически; проверьте, что получатель принимает такие обращения.",
  sourceUrl:"https://www.consultant.ru/document/cons_doc_LAW_175502/d0acb7be3741db537647c38a9941c1dc445b012f/"
 }),
 "military-prosecutor":agency({
  id:"military-prosecutor",title:"Военная прокуратура: проверка нарушения прав",
  purpose:"Возможное обращение о нарушении закона в органе военного управления, в том числе после подтверждённого отказа или бездействия.",
  lookupUrl:"https://epp.genproc.gov.ru/ru/gprf/",lookupLabel:"Официальный справочник прокуратур, включая военные",
  onlineUrl:"https://epp.genproc.gov.ru/ru/gprf/internet-reception/",onlineLabel:"Открыть интернет-приёмную прокуратуры",
  regional:false,
  warning:"Военная прокуратура определяется военным округом, флотом, гарнизоном или поднадзорным органом, а не только субъектом проживания. На сайте выберите соответствующую военную прокуратуру; обращение не заменяет судебный иск.",
  sourceUrl:"https://epp.genproc.gov.ru/ru/gprf/documents/1730886-e5958487/"
 }),
 sfr:agency({
  id:"sfr",title:"Территориальное отделение Социального фонда России",
  purpose:"Только выплаты, пособия и меры социальной поддержки, назначение которых действительно входит в компетенцию СФР.",
  lookupUrl:"https://sfr.gov.ru/contacts",lookupLabel:"Найти региональное отделение, адрес и клиентскую службу СФР",
  onlineUrl:"https://sfr.gov.ru/eservices/send_appeal/",onlineLabel:"Направить электронное обращение в СФР",
  regional:true,
  warning:"Не всякая выплата военнослужащему или члену семьи назначается СФР. Выберите свой регион ещё раз на портале СФР и проверьте территориальный орган, адрес и перечень услуг.",
  sourceUrl:"https://sfr.gov.ru/eservices/send_appeal/"
 }),
 commissariat:agency({
  id:"commissariat",title:"Военный комиссариат / уполномоченная призывная комиссия",
  purpose:"Документы по воинскому учёту, обычному призыву, мобилизации, основаниям отсрочки и получению решений комиссии.",
  lookupUrl:"https://mil.ru/",lookupLabel:"Официальные контакты военного ведомства: уточнить военкомат",
  regional:true,
  warning:"Компетентный военкомат определяется местом воинского учёта и процедурой, а не автоматически местом нахождения пользователя. Не гарантирована возможность онлайн-подачи конкретного заявления.",
  sourceUrl:"https://www.consultant.ru/document/cons_doc_LAW_18260/d59956cb788efc251374ecb04c6d90f337a047fd/"
 }),
 vvk:agency({
  id:"vvk",title:"ВВК или вышестоящая военно-врачебная комиссия",
  purpose:"Ознакомление с заключением, заявление о пересмотре или выяснение возможности независимой военно-врачебной экспертизы.",
  lookupUrl:"https://mil.ru/",lookupLabel:"Через военное ведомство уточнить комиссию и порядок обращения",
  regional:false,
  warning:"Компетенция зависит от того, какая комиссия вынесла заключение и где проводилось освидетельствование. Регион проживания не подтверждает конкретную ВВК. Не отправляйте диагнозы через незащищённую форму.",
  sourceUrl:"https://www.consultant.ru/document/cons_doc_LAW_149096/b06f3fcb8a015f0a73e9a1d093f4277babecce16/"
 }),
 court:agency({
  id:"court",title:"Компетентный суд (после проверки подсудности)",
  purpose:"Судебная защита, когда она допустима и выбран надлежащий способ обращения, включая особые правила военной службы и призыва.",
  lookupUrl:"https://sudrf.ru/",lookupLabel:"Официальный портал судов: уточнить подсудность и контакты",
  regional:false,
  warning:"Это не автоматически рекомендованный суд и не готовый административный иск. Срок, вид производства, военная подсудность, порядок подачи и приложения требуют юридической проверки.",
  sourceUrl:"https://www.consultant.ru/document/cons_doc_LAW_176147/98b69fee6357343965f5b57193fcaaa54b0f21e4/"
 })
};
const p=(primary:MilitaryAgencyId[],additional:MilitaryAgencyId[],reason:string):AgencyPlan=>({primary,additional,reason});
export const MILITARY_POST_DOCUMENT_PLANS:Readonly<Record<string,AgencyPlan>>={
 "contract-check":p(["command","minoborony"],["military-prosecutor"],"Начните с договора и органа, оформившего условия службы."),
 "service-order-copy":p(["command","minoborony"],["military-prosecutor"],"Копию личного приказа обычно запрашивают у уполномоченного держателя документа."),
 transfer:p(["command","minoborony"],["military-prosecutor","court"],"Перевод оформляет компетентный кадровый орган; судебный порядок определяется отдельно."),
 "discharge-basis":p(["command","minoborony"],["military-prosecutor","court"],"Основание увольнения уточняется по режиму службы и кадровым документам."),
 "medical-discharge":p(["vvk","command"],["minoborony","court"],"Заключение ВВК и кадровое решение об увольнении относятся к разным процедурам."),
 "discharge-order":p(["command","minoborony"],["military-prosecutor"],"Приказ и финансовый расчёт могут находиться у разных уполномоченных подразделений."),
 "pay-breakdown":p(["command","minoborony"],["military-prosecutor"],"Денежное довольствие относится к финансовым органам по линии службы, а не автоматически к трудовой инспекции или СФР."),
 benefits:p(["command","minoborony"],["sfr","military-prosecutor"],"Сначала выясните нормативный акт и орган, который назначает конкретную выплату."),
 "family-benefits":p(["sfr","minoborony"],["military-prosecutor"],"Семейные выплаты могут администрироваться разными ведомствами: СФР подходит только для его компетенции."),
 "vvk-conclusion":p(["vvk","command"],["military-prosecutor","court"],"Нужна комиссия, вынесшая заключение, или компетентная вышестоящая ВВК."),
 "independent-review":p(["vvk"],["minoborony","court"],"Независимая экспертиза регулируется отдельным порядком; не подменяйте её обычной жалобой."),
 "request-explanation":p(["command","minoborony"],["military-prosecutor"],"Адресат зависит от того, какой орган принимал решение."),
 "challenge-decision":p(["command","military-prosecutor"],["court"],"Выберите ведомственное или судебное обжалование с учётом сроков; обращение в прокуратуру не обязательно заменяет иск."),
 inaction:p(["command","military-prosecutor"],["court"],"Подтвердите направление первого обращения и обязанность органа дать ответ."),
 "draft-notice":p(["commissariat"],["military-prosecutor","court"],"Обычно требуется комиссариат по месту воинского учёта, а не проживания."),
 deferment:p(["commissariat"],["court","military-prosecutor"],"Порядок отсрочки различается для обычного призыва и мобилизации."),
 "challenge-draft":p(["commissariat"],["court","military-prosecutor"],"Выберите процедуру обжалования конкретного решения; не предполагается автоматического приостановления исполнения.")
};
export function getMilitaryPostDocumentPlan(scenarioKey:string){
 const found=MILITARY_POST_DOCUMENT_PLANS[scenarioKey];
 if(!found)throw new Error("Missing post-document route: "+scenarioKey);
 return found;
}
export function selectMilitaryPostDocumentAgencies(scenarioKey:string){
 const plan=getMilitaryPostDocumentPlan(scenarioKey);
 return {recommended:plan.primary.map(id=>MILITARY_AGENCIES[id]),
 additional:plan.additional.map(id=>MILITARY_AGENCIES[id]),reason:plan.reason};
}

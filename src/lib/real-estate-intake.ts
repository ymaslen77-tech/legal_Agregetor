import { REAL_ESTATE_GROUPS, getRealEstateSituation } from "@/data/real-estate-route-plan";
import type { RealEstateSituation } from "@/data/real-estate-route-plan";

/**
 * Pure, local-only first-stage fact intake. No legal conclusions, persistence,
 * external calls or document generation. Answers must not be sent to a server.
 */
export type RealEstateField = Readonly<{
  key:string;label:string;kind:"choice"|"text"|"textarea"|"date";
  required:boolean;choices?:readonly string[];
}>;
export type RealEstateIntakeSpec = Readonly<{
  groupId:string;situationId:string;
  groupTitle:string;situationTitle:string;
  risk:RealEstateSituation["risk"];
  fields:readonly RealEstateField[];
  targetResult:RealEstateSituation["targetResult"];
  legalReviewRequired:true;
  canGenerateDocument:false;
}>;
export type RealEstateIntakeResult = Readonly<{
  status:"NEEDS_DETAILS"|"FACTS_COLLECTED"|"SPECIALIST_ROUTE";
  missing:readonly string[];
  invalid:readonly string[];
  manualReviewFlags:readonly string[];
  checklist:readonly string[];
  requiresLegalReview:true;
  canGenerateDocument:false;
  filingReady:false;
  documentText:null;
}>;
const roles=["собственник","покупатель","продавец","дольщик","арендатор","сосед","представитель","другое","не знаю"] as const;
const objects=["квартира","жилой дом","земельный участок","коммерческое помещение","строящийся объект","иное","не знаю"] as const;
const stages=["изучаю документы","обращение в орган","переговоры и претензия","получен отказ","судебное разбирательство","исполнение решения","не знаю"] as const;
const BASE_FIELDS:readonly RealEstateField[]=[
  {key:"role",label:"В каком качестве вы участвуете в ситуации?",kind:"choice",required:true,choices:roles},
  {key:"propertyType",label:"Какой объект недвижимости или земли затронут?",kind:"choice",required:true,choices:objects},
  {key:"stage",label:"На какой стадии находится вопрос или спор?",kind:"choice",required:true,choices:stages},
  {key:"summary",label:"Кратко опишите обстоятельства без фамилий, адресов и кадастровых номеров",kind:"textarea",required:true},
  {key:"eventDate",label:"Дата ключевого события, если известна",kind:"date",required:false},
  {key:"documents",label:"Какие документы и доказательства есть (без реквизитов)?",kind:"textarea",required:true},
  {key:"goal",label:"Какого результата вы хотите добиться?",kind:"textarea",required:true}
];
const registrationSuspensionFields:readonly RealEstateField[]=[
  {key:"registrationDecision",label:"Какие сведения есть о приостановлении учёта или регистрации?",kind:"choice",required:true,
    choices:["есть уведомление с основаниями","только статус без текста уведомления","документов нет или не знаю"]},
  {key:"registrationGround",label:"Указанный в уведомлении пункт статьи 26, если известен (без реквизитов и персональных данных)",kind:"text",required:false},
  {key:"correctionEvidence",label:"Представляли ли дополнительные документы для устранения причин?",kind:"choice",required:true,
    choices:["да, есть доказательства подачи","нет","не знаю"]},
  {key:"registrationDecisionDate",label:"Дата уведомления о приостановлении, если известна",kind:"date",required:false}
];
const registrationRefusalFields:readonly RealEstateField[]=[
  {key:"registrationDecision",label:"Имеется ли письменное решение об отказе?",kind:"choice",required:true,
    choices:["есть решение с основаниями","только статус без текста решения","документов нет или не знаю"]},
  {key:"priorSuspension",label:"Было ли до отказа уведомление о приостановлении?",kind:"choice",required:true,
    choices:["есть уведомление, причины известны","не было или не получено","не знаю"]},
  {key:"correctionEvidence",label:"Представляли ли документы для устранения причин приостановления?",kind:"choice",required:true,
    choices:["да, есть доказательства подачи","нет","не знаю"]},
  {key:"registrationGround",label:"Указанный пункт статьи 26, если известен (без личных реквизитов)",kind:"text",required:false},
  {key:"registrationDecisionDate",label:"Дата отказа, если известна",kind:"date",required:false}
];
const specialFields:Readonly<Record<string,readonly RealEstateField[]>>={
  "ownership-register/suspension-registration":registrationSuspensionFields,
  "cadastral-valuation/cadastre-suspension":registrationSuspensionFields,
  "ownership-register/registration-refusal":registrationRefusalFields,
  "build-renovation/building-register-refusal":registrationRefusalFields,
  "shared-ownership/share-sale":[
    {key:"transactionKind",label:"Что известно о характере сделки с долей?",kind:"choice",required:true,
      choices:["продажа постороннему лицу","продажа другому сособственнику","публичные торги","мена","другое или не знаю"]},
    {key:"shareNotice",label:"Направлялось ли письменное извещение остальным сособственникам?",kind:"choice",required:true,
      choices:["направлено, есть доказательства","извещение не направлялось","не знаю"]},
    {key:"specialLandStatus",label:"Есть ли особый режим объекта или земли?",kind:"choice",required:true,
      choices:["обычная недвижимость","земля сельскохозяйственного назначения","доля в общем имуществе","не знаю"]},
    {key:"noticeEventDate",label:"Дата документально подтверждённого извещения, если известна",kind:"date",required:false}
  ],
  "ownership-register/record-inaccurate":[
    {key:"registryErrorOrigin",label:"Где впервые обнаружено расхождение сведений?",kind:"choice",required:true,
      choices:["только запись ЕГРН","исходный документ или технический план","не установлено"]},
    {key:"thirdPartyRights",label:"Может ли исправление затронуть права других лиц?",kind:"choice",required:true,
      choices:["да","нет","не знаю"]}
  ],
  "land-boundaries/registry-boundary-error":[
    {key:"registryErrorOrigin",label:"Где впервые обнаружено расхождение сведений?",kind:"choice",required:true,
      choices:["только запись ЕГРН","исходный документ или межевой план","не установлено"]},
    {key:"thirdPartyRights",label:"Может ли исправление затронуть права других лиц?",kind:"choice",required:true,
      choices:["да","нет","не знаю"]}
  ],
  "cadastral-valuation/wrong-object-area":[
    {key:"registryErrorOrigin",label:"Какие документы подтверждают площадь?",kind:"choice",required:true,
      choices:["исходный документ отличается от ЕГРН","расхождение уже в техническом плане","не установлено"]},
    {key:"thirdPartyRights",label:"Может ли исправление затронуть права других лиц?",kind:"choice",required:true,
      choices:["да","нет","не знаю"]}
  ]
};
function manualReviewFlags(groupId:string,situationId:string,values:Readonly<Record<string,string|undefined>>):string[]{
  const result:string[]=[];
  if(groupId==="shared-ownership"&&situationId==="share-sale"){
    if(["публичные торги","другое или не знаю"].includes(values.transactionKind??""))
      result.push("Продажа с публичных торгов или неустановленный вид сделки: требуется индивидуальная проверка применимого режима и решений Конституционного Суда.");
    if(values.specialLandStatus==="земля сельскохозяйственного назначения")
      result.push("Земля сельскохозяйственного назначения: проверить специальные правила оборота и преимущественной покупки.");
    if(values.specialLandStatus==="доля в общем имуществе")
      result.push("Доля в общем имуществе: проверить применимость исключений статьи 250 ГК РФ.");
    if(["извещение не направлялось","не знаю"].includes(values.shareNotice??""))
      result.push("Не подтверждено извещение сособственников: проверить документы о направлении и вручении.");
  }
  if(["ownership-register/suspension-registration","cadastral-valuation/cadastre-suspension",
      "ownership-register/registration-refusal","build-renovation/building-register-refusal"].includes(groupId+"/"+situationId)){
    if(values.registrationDecision!=="есть уведомление с основаниями"
       && values.registrationDecision!=="есть решение с основаниями")
      result.push("Точный текст уведомления или решения отсутствует: нельзя проверить пункт статьи 26 или условия статьи 27 по одному статусу в кабинете.");
    if(values.priorSuspension==="не было или не получено"||values.priorSuspension==="не знаю")
      result.push("Не установлено предыдущее приостановление и его основания: необходимо проверить всю последовательность регистрационного производства.");
    if(values.correctionEvidence==="нет"||values.correctionEvidence==="не знаю")
      result.push("Не подтверждена подача документов для устранения причин: проверить историю обращений и сроки по конкретному делу.");
    if(!values.registrationGround?.trim())
      result.push("Не указан конкретный пункт статьи 26 закона № 218-ФЗ: правовое основание требует проверки по уведомлению.");
  }
  if(values.registryErrorOrigin==="не установлено"||values.thirdPartyRights==="не знаю")
    result.push("Нельзя определить порядок исправления записи ЕГРН без первичных документов и проверки прав других лиц.");
  if(values.thirdPartyRights==="да")
    result.push("Возможное затрагивание прав третьих лиц требует отдельной проверки допустимого способа исправления.");
  return result;
}
function isValidDate(v:string){
  if(!/^\d{4}-\d{2}-\d{2}$/.test(v))return false;
  const [y,m,d]=v.split("-").map(Number);
  const parsed=new Date(Date.UTC(y,m-1,d));
  return y>=1900&&y<=2100&&parsed.getUTCFullYear()===y&&parsed.getUTCMonth()===m-1&&parsed.getUTCDate()===d;
}
export function getRealEstateIntakeSpec(groupId:string,situationId:string):RealEstateIntakeSpec|null{
  const group=REAL_ESTATE_GROUPS.find(x=>x.id===groupId);
  const situation=getRealEstateSituation(groupId,situationId);
  if(!group||!situation)return null;
  return {
    groupId,situationId,groupTitle:group.title,situationTitle:situation.title,
    risk:situation.risk,targetResult:situation.targetResult,
    fields:[...BASE_FIELDS,{
      key:"caseDetails",label:"Дополнительные сведения по ситуации: "+situation.caseFacts,
      kind:"textarea",required:true
    },...(specialFields[groupId+"/"+situationId]??[])],
    legalReviewRequired:true,canGenerateDocument:false
  };
}
export function evaluateRealEstateIntake(
  spec:RealEstateIntakeSpec,values:Readonly<Record<string,string|undefined>>
):RealEstateIntakeResult{
  const missing:string[]=[],invalid:string[]=[];
  for(const field of spec.fields){
    const value=(values[field.key]??"").trim();
    if(!value){if(field.required)missing.push(field.key);continue;}
    if(value.length>(field.kind==="text"?250:3000) ||
      (field.kind==="choice" && !field.choices?.includes(value)) ||
      (field.kind==="date" && !isValidDate(value)))invalid.push(field.key);
  }
  const reviewFlags=manualReviewFlags(spec.groupId,spec.situationId,values);
  const status=missing.length||invalid.length?"NEEDS_DETAILS":
    spec.targetResult==="SPECIALIST_REFERRAL"||spec.targetResult==="CROSS_LINK"?
      "SPECIALIST_ROUTE":"FACTS_COLLECTED";
  return {
    status,missing,invalid,manualReviewFlags:reviewFlags,
    checklist:[
      "Сопоставить сведения с исходными документами об объекте и праве.",
      "Установить дату события, участников, возможные сроки и компетентный орган.",
      "Проверить точную норму в действующей редакции и исключения по трём независимым источникам.",
      "Не считать предварительную анкету юридическим заключением или готовым документом."
    ],
    requiresLegalReview:true,canGenerateDocument:false,
    filingReady:false,documentText:null
  };
}

import {getMilitaryDocumentBlueprint,MILITARY_DOCUMENT_BLUEPRINTS,type MilitaryDocumentBlueprint} from "@/data/military-document-blueprints";
import {prepareMilitaryOfficialDraft,type MilitaryDocumentFacts,type MilitaryReadyDraftKey,MILITARY_READY_DRAFT_KEYS} from "@/lib/military-official-document-drafts";

/**
 * Only generate named legal documents, never a factual guidance document.
 * Input remains entirely in the browser. The user supplies legal facts and
 * judicial requisites, rather than receiving invented persons, courts, dates
 * or facts. Readiness for filing is NEVER inferred from filled fields.
 */
export type MilitaryDocumentField={key:string;label:string;required:boolean;help?:string;multiline?:boolean;options?:readonly string[]};
const base:MilitaryDocumentField[]=[
 {key:"recipient",label:"Кому направляется документ (орган и должность)",required:true,help:"Получателя уточните по служебным документам и ведомственной компетенции."},
 {key:"applicantName",label:"Фамилия, имя и отчество заявителя",required:true},
 {key:"applicantPosition",label:"Правовой статус и должность заявителя",required:true,help:"Укажите только свой фактический статус; вид службы нельзя определять автоматически."},
 {key:"contactMethod",label:"Адрес для письменного ответа",required:true},
 {key:"date",label:"Дата составления документа",required:true},
 {key:"attachments",label:"Перечень приложенных документов",required:true,multiline:true,help:"Укажите «не прилагаются», если приложений нет."}
];
const judicial:MilitaryDocumentField[]=[
 {key:"courtName",label:"Наименование компетентного суда",required:true,help:"Подсудность определяется после проверки конкретного дела."},
 {key:"applicantName",label:"ФИО административного истца",required:true},
 {key:"applicantBirth",label:"Дата и место рождения административного истца",required:true},
 {key:"applicantAddress",label:"Место жительства или пребывания истца",required:true},
 {key:"contactMethod",label:"Контакт для судебных извещений (при наличии)",required:false},
 {key:"respondentName",label:"Орган или должностное лицо — административный ответчик",required:true},
 {key:"respondentAddress",label:"Адрес административного ответчика",required:true},
 {key:"actDate",label:"Дата оспариваемого решения либо период бездействия",required:true},
 {key:"awarenessDate",label:"Когда вы узнали о нарушении права",required:true},
 {key:"affectedRight",label:"Какое именно право нарушено и каким образом",required:true,multiline:true},
 {key:"priorComplaints",label:"Подача жалобы по подчинённости, результат и досудебный порядок",required:true,multiline:true,help:"Укажите «не подавалась» только если это соответствует действительности; обязательность досудебного порядка проверьте отдельно."},
 {key:"requestedRelief",label:"Какие требования предъявляете к ответчику",required:true,multiline:true,help:"Выберите допустимый способ судебной защиты после правовой проверки."},
 {key:"attachmentDelivery",label:"Чем подтверждается направление копий другим участникам",required:true,multiline:true,help:"Проверить статью 126 КАС РФ и допустимые способы уведомления."},
 {key:"courtFee",label:"Документ об уплате госпошлины либо законное основание освобождения/ходатайство",required:true,multiline:true},
 {key:"attachments",label:"Перечень доказательств и иных приложений",required:true,multiline:true},
 {key:"date",label:"Дата подписания административного иска",required:true}
];
const targeted={
 "service-order-copy":[],
 "pay-breakdown":[],
} as Record<string,MilitaryDocumentField[]>;
export function getMilitaryDocumentFields(scenarioKey:string):MilitaryDocumentField[]{
 const blueprint=getMilitaryDocumentBlueprint(scenarioKey);
 if(!blueprint)throw new Error("Unknown military legal document");
 if(MILITARY_READY_DRAFT_KEYS.includes(scenarioKey as MilitaryReadyDraftKey)){
  // Keep the previously individually verified request fields.
  const fields=blueprint.scenarioKey==="service-order-copy"
   ?["recipient","applicantName","applicantPosition","contactMethod","date","attachments","documentKind"]
   :["recipient","applicantName","applicantPosition","contactMethod","date","attachments","paymentPeriod","paymentKinds"];
  return fields.map(key=>({
   key,required:true,multiline:key==="attachments",
   label:({
    recipient:"Кому направляется рапорт (орган и должность)",
    applicantName:"ФИО военнослужащего",
    applicantPosition:"Статус и должность",
    contactMethod:"Адрес для ответа",
    date:"Дата рапорта",
    attachments:"Приложенные документы",
    documentKind:"Какую именно выписку из приказа хотите получить",
    paymentPeriod:"За какой период нужны сведения о денежном довольствии",
    paymentKinds:"Какие начисления или удержания требуется разъяснить"
   } as Record<string,string>)[key]
  }));
 }
 const common=blueprint.type==="Административное исковое заявление"?judicial:base;
 const facts=blueprint.facts.map((label,index)=>({
   key:"fact-"+index,label,required:!/если извест/i.test(label),multiline:label.length>75,
   help:"Укажите только подтверждённые документами обстоятельства, без предположений."
 }));
 return [...common,...facts,...(targeted[scenarioKey]??[])];
}
const normalize=(value:unknown)=>String(typeof value==="string"?value:"").replace(/[\u0000-\u001F<>]/g," ").trim();
const specificRequests:Readonly<Record<string,readonly string[]>>={
 "contract-check":["Предоставить письменное разъяснение указанного условия контракта и порядка его применения ко мне.","Сообщить реквизиты нормативных актов, на основании которых применяется спорное условие."],
 "transfer":["Рассмотреть вопрос о переводе с учётом изложенных обстоятельств и подтверждающих документов.","Предоставить мотивированный письменный ответ с указанием применимого порядка и полномочий должностного лица."],
 "discharge-basis":["Рассмотреть вопрос об увольнении с военной службы по указанному мной правовому основанию с учётом фактического вида службы.","Сообщить мотивированное решение и применённые нормы, в том числе с учётом особого правового режима, если он применим."],
 "medical-discharge":["Рассмотреть вопрос об увольнении по состоянию здоровья на основании официального заключения ВВК и применимых правовых норм.","Предоставить мотивированное решение о возможности и порядке увольнения по установленной процедуре."],
 "discharge-order":["Выдать относящуюся ко мне копию или выписку из приказа об увольнении, если предоставление предусмотрено применимым порядком.","Сообщить дату исключения из списков личного состава и порядок получения связанных документов, если эти сведения относятся ко мне."],
 benefits:["Рассмотреть вопрос о назначении или перерасчёте указанной выплаты в пределах компетенции адресата.","Сообщить мотивированное решение с применимыми нормами и расчётом, если он предусмотрен соответствующим порядком."],
 "family-benefits":["Рассмотреть заявление о назначении указанной выплаты члену семьи при наличии предусмотренных законом оснований.","Сообщить принятое решение, нормативное основание и порядок предоставления недостающих документов."],
 "vvk-conclusion":["Предоставить мне копию заключения ВВК либо письменно разъяснить предусмотренный порядок получения документа.","Сообщить реквизиты заключения и компетентную организацию, которая обеспечивает доступ к нему."],
 "independent-review":["Рассмотреть заявление о проведении независимой военно-врачебной экспертизы в установленном порядке.","Сообщить условия, место, порядок проведения и перечень документов, необходимых по применимому положению."],
 "request-explanation":["Предоставить письменное разъяснение указанного решения и нормативных оснований его принятия.","Сообщить установленный порядок дальнейшего обращения по данному вопросу."],
 "draft-notice":["Предоставить относящуюся ко мне копию решения указанной призывной комиссии либо разъяснить установленный законом способ ознакомления.","Сообщить дату, номер и основание решения, если они имеются."],
 deferment:["Рассмотреть заявление о предоставлении отсрочки от указанного вида призыва по подтверждаемому законом основанию.","Принять мотивированное решение с указанием применимого порядка и довести его до меня."],
 "challenge-decision":["Признать указанное решение административного ответчика незаконным в части нарушения изложенных прав.","Обязать административного ответчика устранить допущенное нарушение способом, допустимым по КАС РФ и уточнённым заявителем."],
 inaction:["Признать указанное бездействие административного ответчика незаконным.","Обязать административного ответчика совершить предусмотренные законом действия по рассмотрению обращения в пределах компетенции."],
 "challenge-draft":["Признать оспариваемое решение призывного органа незаконным при установлении перечисленных нарушений.","Обязать административного ответчика устранить нарушение способом, соответствующим установленной судебной компетенции."]
};
export type MilitaryComposedDocument={title:string;slug:string;text:string;requiresLegalReview:true;filingReady:false};
export function composeMilitaryDocument(
 scenarioKey:string,answers:Readonly<Record<string,string>>
):{missing:readonly string[];document:MilitaryComposedDocument|null}{
 const blueprint=getMilitaryDocumentBlueprint(scenarioKey);
 if(!blueprint)return {missing:["Документ не зарегистрирован"],document:null};
 const fields=getMilitaryDocumentFields(scenarioKey);
 const missing=fields.filter(field=>field.required && normalize(answers[field.key]).length<2).map(field=>field.label);
 if(missing.length)return {missing,document:null};
 if(MILITARY_READY_DRAFT_KEYS.includes(scenarioKey as MilitaryReadyDraftKey)){
  const response=prepareMilitaryOfficialDraft(scenarioKey as MilitaryReadyDraftKey,answers as MilitaryDocumentFacts);
  if(response.missing.length||!response.draft)return {missing:response.missing,document:null};
  return {missing:[],document:{title:blueprint.title,slug:blueprint.slug,text:response.draft,requiresLegalReview:true,filingReady:false}};
 }
 const facts=blueprint.facts.map((label,index)=>({label,value:normalize(answers["fact-"+index])})).filter(x=>Boolean(x.value)).map(x=>x.label+": "+x.value+".");
 const request=specificRequests[scenarioKey];
 if(!request||!request.length)throw Error("No specific legally researched demand for "+scenarioKey);
 const judicialDocument=blueprint.type==="Административное исковое заявление";
 const body=judicialDocument?[
  "В "+normalize(answers.courtName),
  "Административный истец: "+normalize(answers.applicantName),
  "Дата и место рождения: "+normalize(answers.applicantBirth),
  "Адрес: "+normalize(answers.applicantAddress),
  "Контакты: "+normalize(answers.contactMethod),
  "Административный ответчик: "+normalize(answers.respondentName),
  "Адрес ответчика: "+normalize(answers.respondentAddress),
  "",blueprint.title.toUpperCase(),"",
  "Обстоятельства, на которых основаны требования:",
  ...facts,
  "Дата решения (или период бездействия): "+normalize(answers.actDate)+".",
  "Когда стало известно о нарушении: "+normalize(answers.awarenessDate)+".",
  "Нарушенное право: "+normalize(answers.affectedRight)+".",
  "Сведения о досудебном обращении и жалобах: "+normalize(answers.priorComplaints)+".",
  "Правовые основания: статьи 124–126, 218–219 КАС РФ; применимость определяется обстоятельствами дела.",
  "С учётом изложенного и подтверждённых материалов ПРОШУ:",
  normalize(answers.requestedRelief)+".",
  ...request.map((line,index)=>(index+1)+". "+line),
  "",
  "Подтверждение направления копий другим участникам: "+normalize(answers.attachmentDelivery),
  "Государственная пошлина / освобождение / ходатайство: "+normalize(answers.courtFee),
  "Приложения: "+normalize(answers.attachments),
  "Дата: "+normalize(answers.date),
  "Подпись: __________________ /"+normalize(answers.applicantName)+"/"
 ]:[
  "Кому: "+normalize(answers.recipient),
  "От: "+normalize(answers.applicantName),
  "Статус / должность: "+normalize(answers.applicantPosition),
  "Адрес для ответа: "+normalize(answers.contactMethod),
  "",blueprint.title.toUpperCase(),"",
  "Обстоятельства обращения:",
  ...facts,
  "",
  "На основании подтверждённых мной сведений ПРОШУ:",
  ...request.map((line,index)=>(index+1)+". "+line),
  "",
  "Приложения: "+normalize(answers.attachments),
  "Дата: "+normalize(answers.date),
  "Подпись: __________________ /"+normalize(answers.applicantName)+"/"
 ];
 return {
  missing:[],
  document:{
   title:blueprint.title,slug:blueprint.slug,
   text:[...body,"","Перед направлением требуется проверить компетентный орган, применимые нормы, обстоятельства и приложения."].join("\n"),
   requiresLegalReview:true,filingReady:false
  }
 };
}
export const MILITARY_COMPOSABLE_SCENARIOS=MILITARY_DOCUMENT_BLUEPRINTS.map(d=>d.scenarioKey);

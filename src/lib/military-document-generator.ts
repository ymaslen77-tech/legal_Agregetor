import {getMilitaryDocumentSlug,type MilitaryRoute,type MilitaryScenario} from "@/data/military-route-plans";
import {documentResultSchema,DOCUMENT_RESULT_CONTRACT_VERSION,type DocumentResultV1} from "@/lib/document-result-contract";
import {getMilitaryPinpointLinks,militaryProvisionHref} from "@/data/military-provision-links";
import {resolveMilitaryIntakeAnswers,militaryIntakeQuestionLabel} from "@/data/military-intake-plans";

type Answers=Record<string,string|undefined>;
export type MilitaryValidation={missing:string[];invalid:string[];warnings:string[];complete:boolean};
const MIN_TEXT=4;
const UNSUPPORTED_MILITARY_REGIMES=new Set([
 "добровольческое формирование","военные сборы","мобилизационный людской резерв"
]);
function isUncertain(value:string):boolean {
 return ["не знаю","не уверен","неизвестно","нет данных","не указано","не установлен","неизвестен"].includes(value.toLowerCase());
}
function statusConflict(role:string|undefined,regime:string|undefined):boolean {
 if(role==="призывник" && ["контракт","уволен"].includes(regime??""))return true;
 if(role==="уволенный военнослужащий" && regime!=="уволен")return true;
 if(role==="военнослужащий" && regime==="доподготовка к призыву")return true;
 if(role==="гражданин в запасе" && !["мобилизация","доподготовка к призыву"].includes(regime??""))return true;
 return false;
}
export function validateMilitaryIntake(route:MilitaryRoute,scenario:MilitaryScenario,answers:Answers):MilitaryValidation {
 const data=resolveMilitaryIntakeAnswers(scenario.key,answers);
 const missing:string[]=[],invalid:string[]=[];
 if(scenario.kind==="URGENT_INSTRUCTION")return {missing:[],invalid:[],warnings:[],complete:true};
 const fields=new Map(route.fields.map(f=>[f.key,f]));
 for(const key of scenario.required){
  const f=fields.get(key);
  if(!f)throw new Error("Missing intake field definition: "+route.id+"/"+scenario.key+"/"+key);
  const value=(data[key]??"").trim();
  if(!value){missing.push(key);continue;}
  if(value.length>2000||/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(value)||
    (f.values&&!f.values.includes(value))||(!f.values&&value.length<MIN_TEXT))invalid.push(key);
 }
 const warnings:string[]=[];
 let blocked=false;
 const needsClarification=(message:string)=>{blocked=true;warnings.push(message);};
 if(isUncertain(data.role?.trim()??"")||isUncertain(data.regime?.trim()??""))
  needsClarification("Уточните, кто обращается и какой вид службы указан в документах.");
 if(UNSUPPORTED_MILITARY_REGIMES.has(data.regime??""))
  needsClarification("Для этого вида службы нужен другой порядок обращения. Обратитесь к юристу.");
 if(route.id==="military-medical"&&data.urgency!=="нет")
  needsClarification("Если медицинская помощь нужна сейчас, сначала обратитесь к врачу.");
 if(statusConflict(data.role,data.regime))
  needsClarification("Проверьте статус заявителя и вид службы: ответы не совпадают.");
 if(scenario.kind==="DRAFT"&&data.role!=="военнослужащий")
  warnings.push("Для получения личных документов необходимо подтвердить право на их запрос.");
 if(route.id==="mobilization-draft" &&
  !((data.role==="призывник" && ["доподготовка к призыву","призыв"].includes(data.regime??"")) ||
    (["военнослужащий","гражданин в запасе"].includes(data.role??"") && data.regime==="мобилизация")))
  needsClarification("Выбранная ситуация не соответствует указанному виду службы.");
 if(["mobilization-draft","military-discharge","military-medical"].includes(route.id))
  warnings.push("Проверьте, какие правила действовали на дату события.");
 return {missing,invalid,warnings,complete:!missing.length&&!invalid.length&&!blocked};
}
/**
 * Preliminary, non-filing information requests. No assumed entitlement,
 * jurisdiction, procedural stay, compensation amount or confirmed recipient.
 * Every request must be reviewed against the current legal regime before use.
 */
export const MILITARY_DRAFT_PURPOSES:Readonly<Record<string,{title:string;requests:readonly string[]}>>={
 "service-contract/contract-check":{title:"Обращение о разъяснении условий прохождения службы",requests:["Предоставить информацию об условиях моего контракта и документально оформленных изменениях, если такие сведения могут быть выданы мне по установленному порядку.","Разъяснить, какой порядок рассмотрения вопросов по условиям моей службы применяется к моему статусу."]},
 "service-contract/service-order-copy":{title:"Обращение о выдаче относящихся ко мне документов",requests:["Рассмотреть вопрос о предоставлении копии относящегося ко мне приказа или доступной выписки из него.","Если документ не может быть предоставлен, разъяснить допустимый порядок ознакомления и основания ограничения доступа."]},
 "service-contract/transfer":{title:"Обращение о разъяснении оснований служебного перевода",requests:["Сообщить доступные мне сведения о правовом основании и оформлении рассматриваемого перевода.","Разъяснить порядок ознакомления с относящимися ко мне приказами и подачи возражений, если такой порядок применим."]},
 "military-discharge/discharge-basis":{title:"Обращение о проверке оснований прекращения службы",requests:["Разъяснить, какие основания увольнения могут рассматриваться применительно к указанному мной виду службы и подтверждённым обстоятельствам.","Сообщить, какие документы и уполномоченные лица участвуют в процедуре принятия решения, если эта процедура применима."]},
 "military-discharge/medical-discharge":{title:"Обращение о порядке рассмотрения заключения ВВК",requests:["Разъяснить, каким образом официальное заключение ВВК учитывается при решении вопросов прохождения службы.","Сообщить порядок представления заключения компетентному органу и возможного пересмотра решения, если это предусмотрено применимыми нормами."]},
 "military-discharge/discharge-order":{title:"Обращение о предоставлении приказа и расчётных сведений",requests:["Предоставить доступную заявителю копию или выписку из решения об увольнении при наличии соответствующего документа.","Сообщить сведения о произведённом расчёте и порядке проверки начислений, относящихся ко мне."]},
 "military-pay/pay-breakdown":{title:"Обращение о расшифровке денежного довольствия",requests:["Предоставить относящиеся ко мне сведения о начислениях и удержаниях за указанный период.","Разъяснить документальные основания спорных начислений или порядок получения соответствующей выписки."]},
 "military-pay/benefits":{title:"Обращение о проверке основания выплаты",requests:["Разъяснить, относится ли указанный вид выплаты к моей ситуации и какие документы необходимо представить для её рассмотрения.","При наличии решения по обращению предоставить его копию или разъяснить порядок получения ответа."]},
 "military-pay/family-benefits":{title:"Обращение о порядке рассмотрения выплаты члену семьи",requests:["Разъяснить, предусмотрен ли порядок обращения члена семьи за указанной выплатой при подтверждении его статуса.","Сообщить перечень подтверждающих документов и компетентный орган без предположения о возникновении права на выплату."]},
 "military-medical/vvk-conclusion":{title:"Обращение о порядке ознакомления и пересмотра заключения ВВК",requests:["Разъяснить установленный порядок получения относящегося ко мне заключения ВВК.","Сообщить порядок обращения за пересмотром либо обжалованием заключения в зависимости от даты и компетенции соответствующего органа."]},
 "military-medical/independent-review":{title:"Обращение о разъяснении порядка независимой ВВЭ",requests:["Разъяснить, может ли быть применён порядок независимой военно-врачебной экспертизы к обозначенному случаю.","Сообщить требования к документам и способу обращения в соответствии с применимым порядком."]},
 "command-appeal/request-explanation":{title:"Обращение о письменном разъяснении принятого решения",requests:["Предоставить письменное разъяснение относительно обозначенного решения или действия, в части сведений, доступных заявителю.","Указать порядок получения копии решения и способа обращения при несогласии, если он предусмотрен."]},
 "command-appeal/challenge-decision":{title:"Обращение о документах и порядке оспаривания решения",requests:["Предоставить относящиеся ко мне сведения и доступную копию решения, которое я намерен проверить.","Разъяснить предусмотренный законом порядок обращения по поводу данного решения, не предрешая подсудность или сроки."]},
 "command-appeal/inaction":{title:"Повторное обращение о предоставлении ответа",requests:["Сообщить статус рассмотрения ранее направленного обращения и доступные сведения о принятом решении.","Если ответ был подготовлен, разъяснить дату и способ его направления либо предоставить доступную копию."]},
 "mobilization-draft/draft-notice":{title:"Обращение о разъяснении содержания повестки или решения",requests:["Разъяснить, к какому установленному порядку относится полученная повестка или решение с учётом моего подтверждённого статуса.","Сообщить порядок ознакомления с документом и проверки содержащихся в нём сведений."]},
 "mobilization-draft/deferment":{title:"Обращение о проверке документов для возможной отсрочки",requests:["Разъяснить порядок оценки указанных мною документов для возможной отсрочки применительно к виду призыва и моему статусу.","Сообщить орган, которому подаются документы, и допустимый порядок получения решения."]},
 "mobilization-draft/challenge-draft":{title:"Обращение о получении решения и порядке его пересмотра",requests:["Предоставить доступную мне копию решения призывного органа либо разъяснить способ ознакомления с ним.","Разъяснить действующий порядок возможного пересмотра или обжалования решения для указанного вида призыва, без предположений об автоматическом приостановлении его исполнения."]}
};
function factLines(route:MilitaryRoute,scenario:MilitaryScenario,answers:Answers):string[]{
 return scenario.required.map(key=>{
  const field=route.fields.find(f=>f.key===key)!;
  return militaryIntakeQuestionLabel(scenario.key,field)+": "+(answers[key]??"").trim();
 });
}
function heading(route:MilitaryRoute,scenario:MilitaryScenario):string{
 return route.title+" — "+scenario.title;
}
export function createMilitaryDocumentResult(
 route:MilitaryRoute,scenario:MilitaryScenario,answers:Answers,
 ids:{versionId:string;createdAt:string}
):DocumentResultV1{
 if(!route.scenarios.includes(scenario))throw new Error("Scenario does not belong to selected military route");
 if(scenario.kind==="URGENT_INSTRUCTION")throw new Error("Urgent instruction must not generate or export a document");
 const data=resolveMilitaryIntakeAnswers(scenario.key,answers);
 const check=validateMilitaryIntake(route,scenario,answers);
 if(check.missing.length||check.invalid.length||!check.complete)throw new Error("Проверьте данные в анкете: "+[...check.missing,...check.invalid,...check.warnings].join("; "));
 const purpose=MILITARY_DRAFT_PURPOSES[route.id+"/"+scenario.key];
 if(!purpose)throw new Error("Scenario-specific draft definition missing: "+route.id+"/"+scenario.key);
 const hasRecipient=Boolean(data.authority?.trim())&&!isUncertain((data.authority??"").trim());
 // Third-party standing is never assumed. A family member may request only
 // general procedural information about possible family benefits.
 const selfApplicant=["военнослужащий","призывник","уволенный военнослужащий"].includes(data.role??"");
 const familyApplicant=data.role==="член семьи"&&scenario.key==="family-benefits";
 const reserveApplicant=data.role==="гражданин в запасе"&&route.id==="mobilization-draft";
 const personalAccessRequest=["service-order-copy","pay-breakdown"].includes(scenario.key);
 const draftEligible=(selfApplicant||familyApplicant||reserveApplicant)&&
   (!personalAccessRequest||data.role==="военнослужащий")&&
   (!scenario.required.includes("authority")||hasRecipient);
 const sources=getMilitaryPinpointLinks(route.id,scenario.key,data.regime)
   .map(ref=>ref.citation+" — "+ref.pinpoint+": "+militaryProvisionHref(ref));
 const namedRecipient=hasRecipient?data.authority!.trim():"[уполномоченный адресат устанавливается по документам]";
 const reportedFacts=[
  "Вопрос: "+scenario.title+".",
  "Статус заявителя: "+data.role+"; вид службы: "+data.regime+".",
  ...scenario.required.filter(key=>!["role","regime","authority"].includes(key))
    .map(key=>{
      const field=route.fields.find(item=>item.key===key)!;
      return militaryIntakeQuestionLabel(scenario.key,field)+": "+(data[key]??"").trim()+".";
    })
 ];
 const draftText=draftEligible?[
  "ПРОЕКТ ДОКУМЕНТА — НЕ ГОТОВ К ПОДАЧЕ",
  "Кому: "+namedRecipient,
  "От: [ФИО и контактные данные заявитель вносит самостоятельно перед проверкой]",
  "Статус заявителя: "+data.role,
  "",
  purpose.title.toUpperCase(),
  "",
  "Обстоятельства",
  ...reportedFacts,
  "Цель обращения: "+purpose.title+".",
  "",
  "Правовые основания",
  "Ситуация связана со следующими нормами и разъяснениями. Проверьте редакцию на дату события и применимость:",
  ...sources.map(item=>"- "+item),
  "",
  "С учётом изложенного прошу:",
  ...purpose.requests.map((request,index)=>(index+1)+". "+request),
  "Прошу направить ответ по указанным в обращении контактам.",
  "",
  "Приложения (при наличии)",
  ...scenario.evidence.map(item=>"- "+item),
  ...(data.evidence?.trim()?["- Другие подтверждающие документы: "+data.evidence.trim()+"."]:[]),
  "",
  "Дата: [указать]     Подпись: [поставить перед отправкой]",
  "",
  "Перед направлением юрист должен проверить адресата, полномочия заявителя,",
  "правовые основания, сроки и приложения."
 ].join("\n"):[
  "ПРЕДВАРИТЕЛЬНЫЙ ЧЕК-ЛИСТ — НЕ ГОТОВ К ПОДАЧЕ",
  heading(route,scenario),"",
  "Сведения по выбранной ситуации:",...factLines(route,scenario,data),"",
  "Прежде чем готовить обращение, необходимо проверить:",
  ...scenario.safetyNotes.map((note,index)=>(index+1)+". "+note),
  ...(personalAccessRequest&&!selfApplicant?["Не подтверждено право запрашивать сведения о третьем лице."]:[]),
  ...(!hasRecipient&&scenario.required.includes("authority")?["Не определён адресат обращения."]:[]),
  "",
  "Доказательства для юридической проверки:",...scenario.evidence.map(item=>"- "+item),"",
  "Официальные материалы для проверки:",...sources.map(item=>"- "+item),"",
  "Это чек-лист, а не заявление, жалоба или рапорт. Подготовка обращения возможна после проверки полномочий, адресата и применимых правил."
 ].join("\n");
 const slug=getMilitaryDocumentSlug(route,scenario);
 if(!slug)throw new Error("Document slug missing");
 return documentResultSchema.parse({
   contractVersion:DOCUMENT_RESULT_CONTRACT_VERSION,
   versionId:ids.versionId,createdAt:ids.createdAt,
   categorySlug:"voennoe-pravo",routeSlug:route.slug,scenarioKey:scenario.key,
   documentSlug:slug,resultKind:draftEligible?"DRAFT":"CHECKLIST",source:"DETERMINISTIC",
   documentTitle:(draftEligible?"Предварительный проект обращения: ":"Чек-лист: ")+scenario.title,
   documentText:draftText,usedRuleIds:[],placeholders:[],
   legalRegistryReviewedAt:null,generatorVersion:"military-draft-4",
   filingReady:false,requiresLegalReview:true
 });
}

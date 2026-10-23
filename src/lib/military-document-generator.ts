import {getMilitaryDocumentSlug,type MilitaryRoute,type MilitaryScenario} from "@/data/military-route-plans";
import {documentResultSchema,DOCUMENT_RESULT_CONTRACT_VERSION,type DocumentResultV1} from "@/lib/document-result-contract";
import {getMilitaryCaseReview} from "@/data/military-case-reviews";
import {getMilitaryPinpointLinks,militaryProvisionHref} from "@/data/military-provision-links";

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
 return false;
}
export function validateMilitaryIntake(route:MilitaryRoute,scenario:MilitaryScenario,answers:Answers):MilitaryValidation {
 const missing:string[]=[],invalid:string[]=[];
 if(scenario.kind==="URGENT_INSTRUCTION")return {missing:[],invalid:[],warnings:[],complete:true};
 const fields=new Map(route.fields.map(f=>[f.key,f]));
 for(const key of scenario.required){
  const f=fields.get(key);
  if(!f)throw new Error("Missing intake field definition: "+route.id+"/"+scenario.key+"/"+key);
  const value=(answers[key]??"").trim();
  if(!value){missing.push(key);continue;}
  if(value.length>2000||/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/.test(value)||
    (f.values&&!f.values.includes(value))||(!f.values&&value.length<MIN_TEXT))invalid.push(key);
 }
 const warnings:string[]=[];
 if(isUncertain(answers.role?.trim()??"")||isUncertain(answers.regime?.trim()??""))
  warnings.push("Не установлен статус заявителя и/или режим службы; до уточнения генерация заблокирована.");
 if(UNSUPPORTED_MILITARY_REGIMES.has(answers.regime??""))
  warnings.push("Для добровольческих формирований, военных сборов и мобилизационного резерва требуется отдельная юридическая процедура; генерация заблокирована.");
 if(route.id==="military-medical"&&answers.urgency!=="нет")
  warnings.push("При угрозе здоровью или неясной срочности сначала медицинская помощь; генерация заблокирована.");
 if(statusConflict(answers.role,answers.regime))
  warnings.push("Указанные статусы заявителя и службы противоречат друг другу; генерация заблокирована.");
 if(scenario.kind==="DRAFT"&&answers.role!=="военнослужащий")
  warnings.push("Проект запроса сведений доступен только самому военнослужащему; полномочия иных заявителей подлежат проверке.");
 if(["mobilization-draft","military-discharge","military-medical"].includes(route.id))
  warnings.push("Обязательна индивидуальная оценка специальных правовых режимов и применимой редакции норм.");
 return {missing,invalid,warnings,complete:!missing.length&&!invalid.length&&!warnings.some(s=>s.includes("генерация заблокирована"))};
}
function factLines(route:MilitaryRoute,scenario:MilitaryScenario,answers:Answers):string[]{
 return scenario.required.map(key=>{
  const field=route.fields.find(f=>f.key===key)!;
  return field.label+": "+(answers[key]??"").trim();
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
 const check=validateMilitaryIntake(route,scenario,answers);
 if(check.missing.length||check.invalid.length||!check.complete)throw new Error("Заполните и подтвердите обязательные факты: "+[...check.missing,...check.invalid,...check.warnings].join("; "));
 const pinpointLinks=getMilitaryPinpointLinks(route.id,scenario.key,answers.regime);
 const sourceLines=pinpointLinks.map(ref=>"- "+ref.citation+" ("+ref.pinpoint+"): "+militaryProvisionHref(ref));
 const review=getMilitaryCaseReview(route.id,scenario.key);
 const questions=[
  "- Применимый режим: "+review.scopeToCheck,
  "- Полномочия заявителя: "+review.standingToCheck,
  "- Адресат и компетенция: "+review.addresseeToCheck,
  "- Срок и событие: "+review.timeToCheck,
  "- Исключения: "+review.exclusionToCheck
 ];
 // An unconfirmed addressee cannot receive an automatically addressed draft.
 const draftEligible=scenario.kind==="DRAFT"&&answers.role==="военнослужащий"&&
  ["контракт","мобилизация","призыв"].includes(answers.regime??"")&&
  Boolean(answers.authority?.trim())&&!isUncertain(answers.authority?.trim()??"");
 const checklistText=[
  "ПРЕДВАРИТЕЛЬНЫЙ ЧЕК-ЛИСТ — НЕ ГОТОВ К ПОДАЧЕ",
  heading(route,scenario),"",
  "Сведения заявителя (не проверены):",...factLines(route,scenario,answers),"",
  "Что необходимо проверить:",...scenario.safetyNotes.map((v,i)=>(i+1)+". "+v),"",
  "Индивидуальные вопросы юридической приёмки:",...questions,"",
  "Документы:",...scenario.evidence.map(s=>"- "+s),"",
  "Нормативные источники (применимость и действующая редакция ещё не согласованы):",
  ...sourceLines,"",
  "Не является заявлением, иском, жалобой, рапортом или юридическим заключением.",
  "Срок, компетентный орган, пошлина, статус заявителя и специальные исключения требуют индивидуального подтверждения."
 ].join("\n");
 const draftText=draftEligible?[
   "ПРЕДВАРИТЕЛЬНЫЙ ПРОЕКТ ЗАПРОСА — НЕ ГОТОВ К ПОДАЧЕ",
   "Адресат, указанный заявителем (не подтверждён): "+answers.authority!.trim(),
   heading(route,scenario),"",
   "Изложенные заявителем обстоятельства:",
   ...factLines(route,scenario,answers),"",
   "Прошу рассмотреть возможность предоставления мне следующих сведений:",
   scenario.key==="service-order-copy"
     ?"Копии относящегося ко мне приказа/решения и сведений о принятом по моему обращению решении."
     :"Сведений о начислениях и удержаниях за указанный период с расшифровкой оснований.",
   "",
   "Для юридической проверки необходимы:",...scenario.evidence.map(s=>"- "+s),"",
   "Неразрешённые правовые вопросы:",...questions,"",
   "Источники, применимость которых требует проверки:",...sourceLines,"",
   "Адресат, полномочия подписанта, нормы, срок и форма обращения не подтверждены.",
   "ПЕРЕД ИСПОЛЬЗОВАНИЕМ ОБЯЗАТЕЛЬНА ЮРИДИЧЕСКАЯ ПРОВЕРКА."
 ].join("\n"):checklistText;
 const slug=getMilitaryDocumentSlug(route,scenario);
 if(!slug)throw new Error("Document slug missing");
 return documentResultSchema.parse({
   contractVersion:DOCUMENT_RESULT_CONTRACT_VERSION,
   versionId:ids.versionId,createdAt:ids.createdAt,
   categorySlug:"voennoe-pravo",routeSlug:route.slug,scenarioKey:scenario.key,
   documentSlug:slug,resultKind:draftEligible?"DRAFT":"CHECKLIST",source:"DETERMINISTIC",
   documentTitle:(draftEligible?"Предварительный проект: ":"Чек-лист: ")+scenario.title,
   documentText:draftText,usedRuleIds:[],placeholders:[],
   legalRegistryReviewedAt:null,generatorVersion:"military-preview-1",
   filingReady:false,requiresLegalReview:true
 });
}

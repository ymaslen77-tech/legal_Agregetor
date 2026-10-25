import {getMilitaryDocumentSlug,type MilitaryRoute,type MilitaryScenario} from "@/data/military-route-plans";
import {documentResultSchema,DOCUMENT_RESULT_CONTRACT_VERSION,type DocumentResultV1} from "@/lib/document-result-contract";
import {getMilitaryCaseReview} from "@/data/military-case-reviews";
import {getMilitaryPinpointLinks,militaryProvisionHref} from "@/data/military-provision-links";
import {getMilitaryDraftPlan} from "@/data/military-draft-templates";

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
  warnings.push("Для заявителя с иным статусом обязательна отдельная проверка полномочий и выбранной процедуры до использования проекта.");
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
 // Every draft still needs a verified applicant status. A family member,
 // former servicemember or conscript must not inherit active servicemember powers.
 const activeSelf=answers.role==="военнослужащий" &&
   ["контракт","мобилизация","призыв"].includes(answers.regime??"");
 const dischargedSelf=route.id==="military-discharge" &&
   answers.role==="уволенный военнослужащий" && answers.regime==="уволен";
 const conscriptSelf=route.id==="mobilization-draft" &&
   answers.role==="призывник" && ["призыв","доподготовка к призыву","мобилизация"].includes(answers.regime??"");
 const familyApplicant=route.id==="military-pay" && scenario.key==="family-benefits" &&
   answers.role==="член семьи";
 const knownAddressee=Boolean(answers.authority?.trim()) &&
   !isUncertain(answers.authority?.trim()??"");
 const requiresNamedAddressee=["service-order-copy","pay-breakdown"].includes(scenario.key);
 const plan=getMilitaryDraftPlan(route.id,scenario.key);
 if(!plan)throw new Error("Не найден индивидуальный шаблон проекта: "+route.id+"/"+scenario.key);
 const draftEligible=scenario.kind==="DRAFT" &&
   (activeSelf||dischargedSelf||conscriptSelf||familyApplicant) &&
   (!requiresNamedAddressee||knownAddressee);
 const checklistText=[
  "ПРЕДВАРИТЕЛЬНЫЙ ЧЕК-ЛИСТ — НЕ ГОТОВ К ПОДАЧЕ",
  heading(route,scenario),"",
  "Подтверждённый для автоподготовки статус или необходимый адресат не установлен. Не следует создавать от имени пользователя неподтверждённое обращение.",
  "Проверьте сведения:",...factLines(route,scenario,answers),"",
  "Юридические вопросы:",...questions,"",
  "Документы для проверки:",...scenario.evidence.map(s=>"- "+s),"",
  "Источники для юридической сверки:",...sourceLines,"",
  "Заявление, жалоба или рапорт не сформированы. Нужна индивидуальная проверка полномочий и порядка обращения."
 ].join("\n");
 const addressee=knownAddressee
  ? "Указанный заявителем предполагаемый адресат (компетенция не проверена): "+answers.authority!.trim()
  : "Адресат: [определить компетентный орган и должностное лицо после юридической проверки]";
 const draftText=draftEligible?[
   "ПРЕДВАРИТЕЛЬНЫЙ ПРОЕКТ — НЕ ГОТОВ К ПОДАЧЕ",
   addressee,
   "От: [заявитель, данные и полномочия подлежат подтверждению при проверке]",
   "",
   plan.title.toUpperCase(),
   "",
   "ОБСТОЯТЕЛЬСТВА",
   "По сообщённым заявителем сведениям, произошло следующее: "+(answers.event??"").trim()+".",
   "Дата события и получения относящихся к нему решений: "+(answers.dates??"").trim()+".",
   "Сообщённый статус заявителя: "+(answers.role??"")+". Вид службы или правовой режим: "+(answers.regime??"")+".",
   "Имеющиеся подтверждающие сведения и документы: "+(answers.evidence??"").trim()+".",
   "Цель обращения со слов заявителя: "+(answers.goal??"").trim()+".",
   ...scenario.required.filter(key=>!["event","dates","role","regime","evidence","goal","authority"].includes(key))
     .map(key=>{const field=route.fields.find(x=>x.key===key);return (field?.label??key)+": "+(answers[key]??"").trim()+".";}),
   "",
   "ПРОШУ РАССМОТРЕТЬ (ПРОЕКТ ТРЕБОВАНИЙ)",
   ...plan.requests.map((item,index)=>(index+1)+". "+item),
   "",
   "ДОКУМЕНТЫ И ПРИЛОЖЕНИЯ ДЛЯ СВЕРКИ",
   ...scenario.evidence.map((item,index)=>(index+1)+". "+item+" (включить только при наличии и применимости)."),
   "",
   "ПРАВОВОЕ ОБОСНОВАНИЕ — ТРЕБУЕТ ПРОВЕРКИ",
   "Перед направлением определить, являются ли нормы ниже применимыми к указанному статусу, дате события и специальному режиму:",
   ...sourceLines,
   "Отдельно проверить полномочия, компетенцию адресата, сроки, порядок, пошлину (если применимо) и просительную часть.",
   "",
   "Дата: [заполнить при подписании]",
   "Подпись: [подпись заявителя после проверки]",
   "",
   "ПРОЕКТ НЕ ПОДЛЕЖИТ ПОДАЧЕ ДО ЮРИДИЧЕСКОЙ ПРОВЕРКИ."
 ].join("\n"):checklistText;
 const slug=getMilitaryDocumentSlug(route,scenario);
 if(!slug)throw new Error("Document slug missing");
 return documentResultSchema.parse({
   contractVersion:DOCUMENT_RESULT_CONTRACT_VERSION,
   versionId:ids.versionId,createdAt:ids.createdAt,
   categorySlug:"voennoe-pravo",routeSlug:route.slug,scenarioKey:scenario.key,
   documentSlug:slug,resultKind:draftEligible?"DRAFT":"CHECKLIST",source:"DETERMINISTIC",
   documentTitle:draftEligible?plan.title:"Чек-лист: "+scenario.title,
   documentText:draftText,usedRuleIds:[],placeholders:[],
   legalRegistryReviewedAt:null,generatorVersion:"military-draft-2",
   filingReady:false,requiresLegalReview:true
 });
}

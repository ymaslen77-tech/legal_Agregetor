import {
  REAL_ESTATE_GROUPS, getRealEstateSituation,
  type RealEstateResult
} from "@/data/real-estate-route-plan";
import { getReviewedRealEstateGuidance,renderReviewedRealEstateGuidance } from "@/data/real-estate-reviewed-guidance";
import { getRealEstateLegalReviewTask } from "@/data/real-estate-legal-review";
import { getRealEstateIntakeSpec, evaluateRealEstateIntake } from "@/lib/real-estate-intake";
import {
  DOCUMENT_RESULT_CONTRACT_VERSION, documentResultSchema,
  type DocumentResultV1
} from "@/lib/document-result-contract";
import { addDocumentVersion, type DocumentVersionEntry } from "@/lib/document-version-history";

/**
 * Closed-development-only deterministic prototypes. Source facts must be
 * synthetic; do not persist or transmit them. Neither candidate statutes nor
 * unapproved substantive claims enter the generated text.
 */
export const REAL_ESTATE_GENERATOR_VERSION = "real-estate-draft-1" as const;
export type RealEstateDraftInput = Readonly<{
  groupId: string;
  situationId: string;
  values: Readonly<Record<string, string | undefined>>;
  versionId?: string;
  createdAt?: string;
}>;
export type RealEstateDraftOutput = Readonly<{
  documentResult: DocumentResultV1;
  formData: Readonly<Record<string, string>>;
}>;
type RealEstateDocumentKind = "DRAFT" | "CHECKLIST" | "PREPARED_DATA" | "LEGAL_REVIEW_ONLY";
export type RealEstateDocumentPlan = Readonly<{
  groupId: string;
  situationId: string;
  documentSlug: string;
  documentTitle: string;
  resultKind: RealEstateDocumentKind;
  targetResult: RealEstateResult;
  filingReady: false;
  requiresLegalReview: true;
  legalRegistryReviewedAt: null;
}>;

const requestTypes = new Set<RealEstateResult>(["REQUEST_DRAFT", "COMPLAINT_DRAFT"]);
const reviewTypes = new Set<RealEstateResult>(["SPECIALIST_REFERRAL", "CROSS_LINK"]);
const requiredNotices: Readonly<Record<RealEstateDocumentKind,string>> = {
  DRAFT: "ПРОЕКТ — НЕ ГОТОВ К ПОДАЧЕ",
  CHECKLIST: "ПРЕДВАРИТЕЛЬНЫЙ ЧЕК-ЛИСТ — НЕ ДОКУМЕНТ ДЛЯ ПОДАЧИ",
  PREPARED_DATA: "ЛИСТ ПОДГОТОВЛЕННЫХ СВЕДЕНИЙ — НЕ ДОКУМЕНТ ДЛЯ ПОДАЧИ",
  LEGAL_REVIEW_ONLY: "ПАМЯТКА ДЛЯ ЮРИДИЧЕСКОЙ ПРОВЕРКИ — НЕ ДОКУМЕНТ ДЛЯ ПОДАЧИ"
};
const titlePrefix = {
  DRAFT: "Проект обращения",
  CHECKLIST: "Предварительный чек-лист",
  PREPARED_DATA: "Лист подготовленных сведений",
  LEGAL_REVIEW_ONLY: "Памятка для индивидуальной юридической проверки"
} as const;

function kindFor(type: RealEstateResult): RealEstateDocumentPlan["resultKind"] {
  if (requestTypes.has(type)) return "DRAFT";
  if (reviewTypes.has(type)) return "LEGAL_REVIEW_ONLY";
  if (type === "EVIDENCE_PLAN") return "PREPARED_DATA";
  return "CHECKLIST";
}
function clean(value: unknown, maxLength = 3000): string {
  return typeof value === "string"
    ? value.replace(/\r\n?/g, "\n").replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g, "").trim().slice(0, maxLength)
    : "";
}
export function getRealEstateDocumentPlan(groupId: string, situationId: string): RealEstateDocumentPlan | null {
  const situation = getRealEstateSituation(groupId, situationId);
  if (!situation || !getRealEstateLegalReviewTask(groupId, situationId)) return null;
  const kind = kindFor(situation.targetResult);
  return {
    groupId, situationId,
    documentSlug: "real-estate-" + groupId + "-" + situationId,
    documentTitle: titlePrefix[kind] + ": " + situation.title,
    resultKind: kind,
    targetResult: situation.targetResult,
    filingReady: false, requiresLegalReview: true, legalRegistryReviewedAt: null
  };
}
export function listRealEstateDocumentPlans(): readonly RealEstateDocumentPlan[] {
  return REAL_ESTATE_GROUPS.flatMap(g => g.situations.map(s => {
    const plan = getRealEstateDocumentPlan(g.id, s.id);
    if (!plan) throw new Error("Отсутствует план результата.");
    return plan;
  }));
}
/** Accepted legal text, not approval of individual facts or filing readiness. */
export const REAL_ESTATE_ACCEPTED_DRAFT_RULES=[
  {id:"sale-transfer-556-1",group:"property-transactions",scenario:"seller-no-transfer",asOf:"2026-11-27",
   statement:"В соответствии с пунктом 1 статьи 556 ГК РФ передача недвижимости оформляется передаточным актом или иным документом о передаче; уклонение продавца от подписания документа на договорных условиях признаётся отказом от исполнения обязанности по передаче.",
   sources:["https://www.consultant.ru/document/cons_doc_LAW_9027/3e859336194c50096387c5694f99883bed271e78/","https://base.garant.ru/483424196/7de16aeb618604b5f2bbfc08695b1044/","https://sudact.ru/law/gk-rf-chast2/razdel-iv/glava-30/ss-7/statia-556/"]},
  {id:"sale-payment-486-3",group:"property-transactions",scenario:"buyer-payment-delay",asOf:"2026-11-27",
   statement:"Согласно пункту 3 статьи 486 ГК РФ при просрочке оплаты переданного по договору товара продавец вправе требовать его оплаты.",
   sources:["https://www.consultant.ru/document/cons_doc_LAW_9027/2120e9b039b6f15a3d1c793f412f7df3ffcfbd33/","https://klerk.systems/docs/gk_rf/article/486/date20260319/","https://sudact.ru/law/gk-rf-chast2/razdel-iv/glava-30/ss-1/statia-486/"]}
,
  {id:"ddu-defect-remedy-7-2-6",group:"newbuild-ddu",scenario:"quality-defects",asOf:"2026-11-27",
   statement:"По части 1 статьи 7 Федерального закона от 30.12.2004 № 214-ФЗ качество объекта должно соответствовать договору и применимым обязательным требованиям. При предусмотренных частью 2 статьи 7 недостатках участник долевого строительства вправе, если договором не предусмотрено иное, потребовать их бесплатного устранения в разумный срок. Частью 6 статьи 7 предусмотрено письменное предъявление требований с указанием дефектов, выявленных в гарантийный период.",
   sources:["https://www.consultant.ru/document/cons_doc_LAW_51038/aeb9f2327f835ecc02fb71b9a0312ead0b844204/","https://base.garant.ru/12138267/e88847e78ccd9fdb54482c7fa15982bf/","https://zpp.rospotrebnadzor.ru/news/federal/573466"]}
,
{"id":"registration-refusal-27-29-kas","group":"ownership-register","scenario":"registration-refusal","asOf":"2026-11-27","statement":"Часть 1 статьи 27 Федерального закона от 13.07.2015 № 218-ФЗ связывает отказ с неустранением в срок приостановления причин, предусмотренных статьёй 26. Часть 12.2 статьи 29 этого закона предусматривает судебное обжалование отказа заинтересованным лицом. По статье 218 КАС РФ допускается оспаривание публичного решения, нарушающего права заявителя; статья 227 КАС РФ предусматривает признание незаконного решения и устранение нарушения при установлении судом соответствующих оснований.","sources":["https://www.consultant.ru/document/cons_doc_LAW_182661/57b5e78bd4909a6e15d4c3c0f17f15de22d885f5/","https://sudact.ru/law/federalnyi-zakon-ot-13072015-n-218-fz-o/glava-3/statia-27/","https://klerk.systems/docs/fz_218_2015/article/27/","https://www.consultant.ru/document/cons_doc_LAW_182661/02766c386c2ef725cc8490f38d46a143c994a039/","https://base.garant.ru/71129192/7a69fb6632f5876efd3160114758a106/","https://klerk.systems/docs/fz_218_2015/article/29/","https://www.consultant.ru/document/cons_doc_LAW_176147/98b69fee6357343965f5b57193fcaaa54b0f21e4/","https://sudact.ru/law/kas-rf/razdel-iv/glava-22/statia-218/?page=1","https://klerk.systems/docs/kas_rf/article/218/","https://www.consultant.ru/document/cons_doc_LAW_176147/16f896d97acce5061ac7b8840c57509292ae7859/","https://sudact.ru/law/kas-rf/razdel-iv/glava-22/statia-227/","https://klerk.systems/docs/kas_rf/article/227/"]},
{"id":"building-register-refusal-27-29-kas","group":"build-renovation","scenario":"building-register-refusal","asOf":"2026-11-27","statement":"Часть 1 статьи 27 Федерального закона от 13.07.2015 № 218-ФЗ связывает отказ с неустранением в срок приостановления причин, предусмотренных статьёй 26. Часть 12.2 статьи 29 этого закона предусматривает судебное обжалование отказа заинтересованным лицом. По статье 218 КАС РФ допускается оспаривание публичного решения, нарушающего права заявителя; статья 227 КАС РФ предусматривает признание незаконного решения и устранение нарушения при установлении судом соответствующих оснований.","sources":["https://www.consultant.ru/document/cons_doc_LAW_182661/57b5e78bd4909a6e15d4c3c0f17f15de22d885f5/","https://sudact.ru/law/federalnyi-zakon-ot-13072015-n-218-fz-o/glava-3/statia-27/","https://klerk.systems/docs/fz_218_2015/article/27/","https://www.consultant.ru/document/cons_doc_LAW_182661/02766c386c2ef725cc8490f38d46a143c994a039/","https://base.garant.ru/71129192/7a69fb6632f5876efd3160114758a106/","https://klerk.systems/docs/fz_218_2015/article/29/","https://www.consultant.ru/document/cons_doc_LAW_176147/98b69fee6357343965f5b57193fcaaa54b0f21e4/","https://sudact.ru/law/kas-rf/razdel-iv/glava-22/statia-218/?page=1","https://klerk.systems/docs/kas_rf/article/218/","https://www.consultant.ru/document/cons_doc_LAW_176147/16f896d97acce5061ac7b8840c57509292ae7859/","https://sudact.ru/law/kas-rf/razdel-iv/glava-22/statia-227/","https://klerk.systems/docs/kas_rf/article/227/"]}
] as const;
function acceptedDraftRule(group:string,scenario:string){
  return REAL_ESTATE_ACCEPTED_DRAFT_RULES.find(rule=>rule.group===group&&rule.scenario===scenario);
}
/** A claim is composed only where the facts expressly support this type of demand.
 * No assumed deadline, amount, personal identity or consumer-law penalty. */
function formatSaleClaim(plan:RealEstateDocumentPlan,data:Readonly<Record<string,string>>,createdAt:string):string|null{
  const transfer=plan.situationId==="seller-no-transfer";
  const payment=plan.situationId==="buyer-payment-delay";
  if(plan.groupId!=="property-transactions"||(!transfer&&!payment))return null;
  if(!data.saleContract?.trim()||!data.saleObject?.trim()||!data.saleDueDate||data.saleDueDate>=createdAt.slice(0,10)||data.saleBreachConfirmed!=="да")return null;
  const rule=acceptedDraftRule(plan.groupId,plan.situationId);
  if(!rule)return null;
  if(transfer&&(data.role!=="покупатель"||data.handoverPossession!=="нет"||data.handoverAct!=="нет"))return null;
  if(payment&&(data.role!=="продавец"||data.paymentEvidence!=="есть документы"||data.paymentTerms!=="единовременно"||data.saleTransferred!=="да"||!/^\d{1,12}(?:[.,]\d{1,2})?$/.test(data.saleDebt??"")||Number(data.saleDebt.replace(",","."))<=0))return null;
  const title=transfer?"ПРЕТЕНЗИЯ о передаче недвижимого имущества":"ПРЕТЕНЗИЯ об оплате недвижимого имущества";
  const basis=rule.statement;
  const demand=transfer
    ?"Прошу исполнить предусмотренную договором обязанность по передаче указанного объекта и согласовать дату подписания передаточного документа."
    :"Прошу погасить задолженность по договору в размере "+data.saleDebt.replace(".",",")+" руб.";
  return [
    requiredNotices.DRAFT,"","Кому: ____________________","От кого: ____________________","Адрес для ответа: ____________________","",title,"",
    "Договор купли-продажи: "+data.saleContract+".",
    "Объект недвижимости: "+data.saleObject+".",
    "Согласованный срок "+(transfer?"передачи":"оплаты")+": "+data.saleDueDate+".",
    data.summary,data.caseDetails,
    transfer?"На момент составления претензии объект не передан, передаточный документ не подписан.":"На момент составления претензии объект передан, согласованный срок оплаты истёк, задолженность не погашена.",
    "",basis,"",demand,"Прошу направить письменный ответ по указанному адресу.","",
    "Приложения: "+data.documents,"","Дата: ____________________","Подпись: ____________________"
  ].join("\n");
}
function formatDduDefectClaim(plan:RealEstateDocumentPlan,data:Readonly<Record<string,string>>,createdAt:string):string|null{
  if(plan.groupId!=="newbuild-ddu"||plan.situationId!=="quality-defects")return null;
  if(data.role!=="дольщик"||data.defectStage!=="после передачи"||data.defectEvidence!=="акт или письменное заключение")return null;
  if(!data.defectContract||!data.defectObject||!data.defectTransferDate||!data.defectFoundDate||!data.defectList||!data.defectBasis||!data.defectProof)return null;
  if(data.defectTransferDate<"2026-01-01"||data.defectFoundDate<data.defectTransferDate||data.defectFoundDate>createdAt.slice(0,10))return null;
  if(data.defectWarranty!=="да"||data.defectContractRemedy!=="да"||data.defectAttribution!=="да"||data.defectRemedy!=="безвозмездное устранение")return null;
  const rule=acceptedDraftRule(plan.groupId,plan.situationId);if(!rule)return null;
  return [
    requiredNotices.DRAFT,"","Кому: "+(data.defectDeveloper||"____________________"),"От кого: "+(data.defectApplicant||"____________________"),
    "Адрес для ответа: "+(data.defectReplyAddress||"____________________"),"",
    "ПРЕТЕНЗИЯ об устранении недостатков объекта долевого строительства","",
    "Договор участия в долевом строительстве: "+data.defectContract+".",
    "Объект: "+data.defectObject+".",
    "Дата передачи: "+data.defectTransferDate+". Дата выявления недостатков: "+data.defectFoundDate+".",
    "Обнаруженные недостатки: "+data.defectList,
    "Несоответствие договору или обязательным требованиям: "+data.defectBasis,
    "Подтверждающие документы: "+data.defectProof+".",
    data.summary,data.caseDetails,"",rule.statement,"",
    "Прошу безвозмездно устранить указанные недостатки в разумный срок, согласовать со мной срок и порядок выполнения работ, а также дату осмотра объекта.",
    "Прошу направить письменный ответ по указанному адресу.","",
    "Приложения: "+data.documents,"","Дата: ____________________","Подпись: ____________________"
  ].join("\n");
}
function formatRefusalClaim(plan:RealEstateDocumentPlan,data:Readonly<Record<string,string>>,createdAt:string):string|null{
  if(!["ownership-register/registration-refusal","build-renovation/building-register-refusal"].includes(plan.groupId+"/"+plan.situationId))return null;
  if(data.refusalScope!=="личное обращение гражданина к органу без спора о праве и предпринимательской деятельности"||data.refusalProcedure!=="да")return null;
  if(data.registrationDecision!=="есть решение с основаниями"||data.priorSuspension!=="есть уведомление, причины известны"||data.correctionEvidence!=="да, есть доказательства подачи")return null;
  if(!data.registrationDecisionDate||data.registrationDecisionDate<"2026-01-01"||!data.refusalKnownDate||data.refusalKnownDate<data.registrationDecisionDate||data.refusalKnownDate>createdAt.slice(0,10))return null;
  if(!["refusalCourt","refusalClaimant","refusalRespondent","refusalParties","refusalDecisionNumber","refusalApplication","refusalReason","refusalObjection","refusalRights","refusalPretrial","refusalFee","refusalService"].every(key=>data[key]?.trim()))return null;
  const rule=acceptedDraftRule(plan.groupId,plan.situationId);if(!rule)return null;
  return [requiredNotices.DRAFT,"","В "+data.refusalCourt,"Административный истец: "+data.refusalClaimant,"Административный ответчик: "+data.refusalRespondent,"Заинтересованные лица: "+data.refusalParties,"",
    "АДМИНИСТРАТИВНОЕ ИСКОВОЕ ЗАЯВЛЕНИЕ о признании незаконным решения об отказе в кадастровом учёте и (или) регистрации прав","",
    "Исходное заявление: "+data.refusalApplication,"Оспариваемое решение: "+data.refusalDecisionNumber+" от "+data.registrationDecisionDate+". Об отказе стало известно "+data.refusalKnownDate+".",
    data.summary,data.caseDetails,"Основания отказа согласно решению: "+data.refusalReason,"Возражения истца и доказательства: "+data.refusalObjection,"Нарушение прав и законных интересов: "+data.refusalRights,"Сведения о предыдущем обжаловании: "+data.refusalPretrial,"",rule.statement,"",
    "На основании изложенного прошу суд:",
    "1. Признать незаконным решение административного ответчика "+data.refusalDecisionNumber+" от "+data.registrationDecisionDate+".",
    "2. Обязать административного ответчика устранить нарушение прав административного истца путём повторного рассмотрения исходного заявления с учётом установленных судом обстоятельств.",
    "","Государственная пошлина: "+data.refusalFee,"Направление копий: "+data.refusalService,"Приложения: "+data.documents,"","Дата: ____________________","Подпись: ____________________"].join("\n");
}
function formatResult(plan: RealEstateDocumentPlan, data: Readonly<Record<string, string>>): string {
  const situation = getRealEstateSituation(plan.groupId, plan.situationId);
  const task = getRealEstateLegalReviewTask(plan.groupId, plan.situationId);
  if (!situation || !task || task.status !== "PENDING") throw new Error("Юридическая матрица не найдена.");
  const intakeSpec = getRealEstateIntakeSpec(plan.groupId, plan.situationId);
  if(!intakeSpec) throw new Error("Анкета ситуации не найдена.");
  const baseKeys=new Set(["role","propertyType","stage","summary","eventDate","documents","goal","caseDetails"]);
  const specialAnswers=intakeSpec.fields
    .filter(field=>!baseKeys.has(field.key)&&Boolean(data[field.key]))
    .map(field=>field.label+": "+data[field.key]);
  const assessment=evaluateRealEstateIntake(intakeSpec,data);
  const specificWarnings=assessment.manualReviewFlags.length?[
    "Вопросы для проверки:",
    ...assessment.manualReviewFlags.map((value,index)=>String(index+1)+". "+value)
  ]:[];
  const facts = [
    "Участник ситуации (по сведениям анкеты): " + data.role + ".",
    "Тип объекта: " + data.propertyType + ".",
    "Стадия: " + data.stage + ".",
    data.eventDate ? "Дата события, указанная заявителем: " + data.eventDate + "." : "",
    "Обстоятельства со слов заполняющего: " + data.summary,
    "Сведения, относящиеся к выбранной ситуации: " + data.caseDetails,
    "Имеющиеся подтверждения со слов заполняющего: " + data.documents,
    "Желаемый результат со слов заполняющего: " + data.goal,
    ...specialAnswers
  ].filter(Boolean);
  const reviewedGuidance=renderReviewedRealEstateGuidance(plan.groupId,plan.situationId,data);
  const check = [
    "Сопоставить описанные обстоятельства с первичными документами и записью о праве.",
    "Проверить применимую редакцию нормативных актов на даты событий и возможные исключения.",
    "Установить уполномоченного адресата, необходимую форму обращения и порядок подачи.",
    "Проверить необходимые сроки, расходы, полномочия заявителя и подтверждающие документы.",
    "Каждый материальный правовой вывод подтвердить по трём независимым проверенным источникам."
  ];
  if (plan.resultKind === "DRAFT") {
    const draftLabel = plan.targetResult === "COMPLAINT_DRAFT" ? "ПРОЕКТ ЖАЛОБЫ" : "ПРОЕКТ ОБРАЩЕНИЯ";
    return [
      "ПРОЕКТ — НЕ ГОТОВ К ПОДАЧЕ",
      "",
      "Адресат: [определяется после проверки компетенции]",
      "Заявитель: [заполнить только после правовой проверки и выбора защищённого способа подачи]",
      "",
      draftLabel,
      "По вопросу: " + situation.title,
      "",
      ...facts,
      "",
      "Прошу рассмотреть описанные обстоятельства и проверить возможность разрешения вопроса, обозначенного заявителем: " + data.goal,
      "Конкретный адресат и юридически допустимая просительная часть подлежат отдельной проверке.",
      "",
      "Приложения: перечислить только имеющиеся и относящиеся к вопросу документы после определения вида обращения.",
      "Дата: __________________",
      "Подпись: __________________",
      "",
      ...specificWarnings,
      "",
      "Примечания к предварительному проекту (не часть заявления):",
      ...check.map((v, i) => String(i + 1) + ". " + v),
      "Ни подсудность, ни правовое основание, ни госпошлина, ни срок подачи автоматически не установлены."
    ].join("\n");
  }
  return [
    plan.resultKind === "LEGAL_REVIEW_ONLY"
      ? "ПАМЯТКА ДЛЯ ЮРИДИЧЕСКОЙ ПРОВЕРКИ — НЕ ДОКУМЕНТ ДЛЯ ПОДАЧИ"
      : plan.resultKind === "PREPARED_DATA"
        ? "ЛИСТ ПОДГОТОВЛЕННЫХ СВЕДЕНИЙ — НЕ ДОКУМЕНТ ДЛЯ ПОДАЧИ"
        : "ПРЕДВАРИТЕЛЬНЫЙ ЧЕК-ЛИСТ — НЕ ДОКУМЕНТ ДЛЯ ПОДАЧИ",
    "",
    "Ситуация: " + situation.title,
    "",
    "СВЕДЕНИЯ ДЛЯ ИНДИВИДУАЛЬНОЙ ПРОВЕРКИ",
    ...facts,
    "",
    ...(reviewedGuidance.length?["Правовая оценка и дальнейшие действия:",...reviewedGuidance,""]:[]),
    ...specificWarnings,
    "",
    ...(reviewedGuidance.length?[]:["СЛЕДУЮЩИЕ ДЕЙСТВИЯ",...check.map((v, i) => String(i + 1) + ". " + v)]),
    "",
    "Не используйте этот результат как правовое заключение, иск или официальную форму."
  ].join("\n");
}

/** Accepts only completed, validated first-stage facts. */
export function createRealEstateDraftPrototype(input: RealEstateDraftInput): RealEstateDraftOutput {
  const spec = getRealEstateIntakeSpec(input.groupId, input.situationId);
  const plan = getRealEstateDocumentPlan(input.groupId, input.situationId);
  if (!spec || !plan) throw new Error("Неизвестная ситуация: документ не создан.");
  const normalized: Record<string, string> = {};
  for (const field of spec.fields) normalized[field.key] = clean(input.values[field.key], field.kind === "text" ? 250 : 3000);
  const assessment = evaluateRealEstateIntake(spec, normalized);
  if (assessment.missing.length || assessment.invalid.length) {
    throw new Error("Сначала заполните обязательные сведения и исправьте ошибки анкеты.");
  }
  const createdAt=input.createdAt??new Date().toISOString();
  const specificClaim=formatSaleClaim(plan,normalized,createdAt)??formatDduDefectClaim(plan,normalized,createdAt)??formatRefusalClaim(plan,normalized,createdAt);
  const rule=specificClaim?acceptedDraftRule(plan.groupId,plan.situationId):getReviewedRealEstateGuidance(plan.groupId,plan.situationId);
  const documentText=specificClaim??formatResult(plan,normalized);
  const result = documentResultSchema.parse({
    contractVersion: DOCUMENT_RESULT_CONTRACT_VERSION,
    versionId: input.versionId ?? crypto.randomUUID(),
    createdAt,
    categorySlug: "nedvizhimost-i-zemlya",
    routeSlug: plan.groupId,
    scenarioKey: plan.situationId,
    documentSlug: plan.documentSlug,
    resultKind: plan.resultKind,
    source: "DETERMINISTIC",
    documentTitle: plan.documentTitle,
    documentText,
    usedRuleIds: rule?[rule.id]:[],
    placeholders: [],
    legalRegistryReviewedAt: rule?.asOf??null,
    generatorVersion: REAL_ESTATE_GENERATOR_VERSION,
    filingReady: false,
    requiresLegalReview: true
  });
  return { documentResult: result, formData: normalized };
}
/** Rejects any other category, unapproved version or forged legal approval. */
export function isRealEstateDraftResult(input: unknown): input is DocumentResultV1 {
  const parsed = documentResultSchema.safeParse(input);
  if (!parsed.success) return false;
  const result = parsed.data;
  const plan = getRealEstateDocumentPlan(result.routeSlug, result.scenarioKey);
  const rule=acceptedDraftRule(result.routeSlug,result.scenarioKey)??getReviewedRealEstateGuidance(result.routeSlug,result.scenarioKey);
  const provenanceValid=(result.legalRegistryReviewedAt===null&&result.usedRuleIds.length===0)||
    (result.source==="DETERMINISTIC"&&!!rule&&result.usedRuleIds.length===1&&result.usedRuleIds[0]===rule.id&&result.legalRegistryReviewedAt===rule.asOf&&result.documentText.includes(rule.statement));
  return !!plan && result.categorySlug === "nedvizhimost-i-zemlya"
    && result.documentSlug === plan.documentSlug
    && result.documentTitle === plan.documentTitle
    && result.resultKind === plan.resultKind
    && result.generatorVersion === REAL_ESTATE_GENERATOR_VERSION
    && (result.source === "DETERMINISTIC" || result.source === "USER_EDITED")
    && !result.filingReady && result.requiresLegalReview
    && provenanceValid
    && result.documentText.startsWith(requiredNotices[plan.resultKind]);
}
/** User edits do not modify the previous immutable version. */
export function reviseRealEstateDraft(
  previous: RealEstateDraftOutput, editedText: string,
  options: Readonly<{versionId?: string;createdAt?: string}> = {}
): RealEstateDraftOutput {
  if (!isRealEstateDraftResult(previous.documentResult)) throw new Error("Несовместимый проект.");
  const safeText = clean(editedText, 35000);
  if (safeText.length < 120 || !safeText.startsWith(requiredNotices[previous.documentResult.resultKind as RealEstateDocumentKind])) {
    throw new Error("Сохраните предупреждение о статусе проекта и содержательный текст.");
  }
  const result = documentResultSchema.parse({
    ...previous.documentResult,
    versionId: options.versionId ?? crypto.randomUUID(),
    createdAt: options.createdAt ?? new Date().toISOString(),
    source: "USER_EDITED", documentText: safeText,
    filingReady: false, requiresLegalReview: true,
    legalRegistryReviewedAt: null, usedRuleIds: []
  });
  return { documentResult: result, formData: {...previous.formData} };
}
export function addRealEstateDraftVersion(
  prior: readonly DocumentVersionEntry<Readonly<Record<string,string>>>[],
  next: RealEstateDraftOutput
): DocumentVersionEntry<Readonly<Record<string,string>>>[] {
  if (!isRealEstateDraftResult(next.documentResult)) throw new Error("Несовместимая версия проекта.");
  return addDocumentVersion(prior, { documentResult: next.documentResult, payload: {...next.formData} });
}

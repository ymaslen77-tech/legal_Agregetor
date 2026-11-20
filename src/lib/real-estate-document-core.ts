import {
  REAL_ESTATE_GROUPS, getRealEstateSituation,
  type RealEstateResult
} from "@/data/real-estate-route-plan";
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
export type RealEstateDocumentPlan = Readonly<{
  groupId: string;
  situationId: string;
  documentSlug: string;
  documentTitle: string;
  resultKind: DocumentResultV1["resultKind"];
  targetResult: RealEstateResult;
  filingReady: false;
  requiresLegalReview: true;
  legalRegistryReviewedAt: null;
}>;

const requestTypes = new Set<RealEstateResult>(["REQUEST_DRAFT", "COMPLAINT_DRAFT"]);
const reviewTypes = new Set<RealEstateResult>(["SPECIALIST_REFERRAL", "CROSS_LINK"]);
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
function formatResult(plan: RealEstateDocumentPlan, data: Readonly<Record<string, string>>): string {
  const situation = getRealEstateSituation(plan.groupId, plan.situationId);
  const task = getRealEstateLegalReviewTask(plan.groupId, plan.situationId);
  if (!situation || !task || task.status !== "PENDING") throw new Error("Юридическая матрица не найдена.");
  const facts = [
    "Участник ситуации (по сведениям анкеты): " + data.role + ".",
    "Тип объекта: " + data.propertyType + ".",
    "Стадия: " + data.stage + ".",
    data.eventDate ? "Дата события, указанная заявителем: " + data.eventDate + "." : "",
    "Обстоятельства со слов заполняющего: " + data.summary,
    "Сведения, относящиеся к выбранной ситуации: " + data.caseDetails,
    "Имеющиеся подтверждения со слов заполняющего: " + data.documents,
    "Желаемый результат со слов заполняющего: " + data.goal
  ].filter(Boolean);
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
      "ИЗЛОЖЕНИЕ ОБСТОЯТЕЛЬСТВ",
      ...facts,
      "",
      "ПРЕДМЕТ ПРЕДПОЛАГАЕМОГО ОБРАЩЕНИЯ",
      "Прошу рассмотреть описанные обстоятельства и проверить возможность разрешения вопроса, обозначенного заявителем: " + data.goal,
      "Конкретный адресат и юридически допустимая просительная часть подлежат отдельной проверке.",
      "",
      "Приложения: перечислить только имеющиеся и относящиеся к вопросу документы после определения вида обращения.",
      "Дата: __________________",
      "Подпись: __________________",
      "",
      "ДО ПОДАЧИ НЕОБХОДИМО",
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
    "СЛЕДУЮЩИЕ ДЕЙСТВИЯ",
    ...check.map((v, i) => String(i + 1) + ". " + v),
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
  const documentText = formatResult(plan, normalized);
  const result = documentResultSchema.parse({
    contractVersion: DOCUMENT_RESULT_CONTRACT_VERSION,
    versionId: input.versionId ?? crypto.randomUUID(),
    createdAt: input.createdAt ?? new Date().toISOString(),
    categorySlug: "nedvizhimost-i-zemlya",
    routeSlug: plan.groupId,
    scenarioKey: plan.situationId,
    documentSlug: plan.documentSlug,
    resultKind: plan.resultKind,
    source: "DETERMINISTIC",
    documentTitle: plan.documentTitle,
    documentText,
    usedRuleIds: [],
    placeholders: [],
    legalRegistryReviewedAt: null,
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
  return !!plan && result.categorySlug === "nedvizhimost-i-zemlya"
    && result.documentSlug === plan.documentSlug
    && result.documentTitle === plan.documentTitle
    && result.resultKind === plan.resultKind
    && result.generatorVersion === REAL_ESTATE_GENERATOR_VERSION
    && (result.source === "DETERMINISTIC" || result.source === "USER_EDITED")
    && !result.filingReady && result.requiresLegalReview
    && result.legalRegistryReviewedAt === null
    && result.usedRuleIds.length === 0
    && /^(ПРОЕКТ|ПАМЯТКА|ЛИСТ ПОДГОТОВЛЕННЫХ|ПРЕДВАРИТЕЛЬНЫЙ)/.test(result.documentText);
}
/** User edits do not modify the previous immutable version. */
export function reviseRealEstateDraft(
  previous: RealEstateDraftOutput, editedText: string,
  options: Readonly<{versionId?: string;createdAt?: string}> = {}
): RealEstateDraftOutput {
  if (!isRealEstateDraftResult(previous.documentResult)) throw new Error("Несовместимый проект.");
  const safeText = clean(editedText, 35000);
  if (safeText.length < 120 || !/^(ПРОЕКТ|ПАМЯТКА|ЛИСТ ПОДГОТОВЛЕННЫХ|ПРЕДВАРИТЕЛЬНЫЙ)/.test(safeText)) {
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

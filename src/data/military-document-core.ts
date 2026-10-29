import { MILITARY_TOPICS } from "@/data/military-catalog";
import { getMilitaryDocumentCandidate, buildMilitaryDraft } from "@/data/military-document-candidates";
import { getMilitaryAdditionalComposition } from "@/data/military-document-compositions";
import { MILITARY_DOCUMENT_TARGETS, getMilitaryDocumentTarget } from "@/data/military-document-target-matrix";
import { MILITARY_LEGAL_CASE_CARDS } from "@/data/military-case-legal-matrix";
import { getMilitaryRelatedSituations, militarySituationHref } from "@/data/military-related-links";
import type { MilitaryDocumentSpecification, MilitaryLegalDocumentKind } from "@/data/military-family-parity-contract";
import type { LegalRouteInput } from "@/data/legal-route-standard";
import { DOCUMENT_RESULT_CONTRACT_VERSION, documentResultSchema, type DocumentResultV1 } from "@/lib/document-result-contract";
import { addDocumentVersion, type DocumentVersionEntry } from "@/lib/document-version-history";

/**
 * Stage 4: private, non-published engineering core compatible with the family
 * DOCUMENT_RESULT_V1 envelope. NOT a public generator registration.
 *
 * 121 target specifications, 18 legacy deterministic draft prototypes,
 * 83 missing individual document compositions (20 new unpublished prototypes). No approved legal rules.
 */
export const MILITARY_DOCUMENT_CORE_VERSION = "military-core-v1" as const;
export type MilitaryDraftPlan = Omit<MilitaryDocumentSpecification, "canonicalDocumentUrl"> & Readonly<{
  /** Null until a real, reviewed, registered document URL exists. */
  canonicalDocumentUrl: null;
  candidateImplemented: boolean;
  evidencePrompt: string;
  conditionalAlternativeKind: MilitaryLegalDocumentKind | null;
  generationEnabled: false;
}>;

const fields: readonly LegalRouteInput[] = [
  { key: "applicant", label: "Заявитель: ФИО и подтверждённый статус", required: true, type: "text" },
  { key: "recipient", label: "Адресат: орган или должностное лицо (проверить компетенцию)", required: true, type: "text" },
  { key: "facts", label: "Фактические обстоятельства, даты и события", required: true, type: "textarea" },
  { key: "caseReference", label: "Реквизиты решения, приказа или обращения (если есть)", required: false, type: "text" },
  { key: "evidence", label: "Имеющиеся доказательства (без вымышленных документов)", required: false, type: "textarea" },
  { key: "attachments", label: "Фактически прилагаемые документы", required: false, type: "textarea" }
];

function extraInputs(kind: MilitaryLegalDocumentKind): readonly LegalRouteInput[] {
  if (kind === "ADMINISTRATIVE_CLAIM" || kind === "CIVIL_CLAIM") return [
    {key:"defendant", label:"Ответчик (полное наименование и доступные реквизиты)",required:true,type:"text"},
    {key:"disputedDecision", label:"Оспариваемое решение и дата ознакомления",required:true,type:"textarea"},
    {key:"court", label:"Компетентный суд (подсудность проверить)",required:true,type:"text"}
  ];
  if (kind === "PROCEDURAL_APPEAL" || kind === "PROCEDURAL_COMPLAINT" || kind === "PROCEDURAL_MOTION") return [
    {key:"caseNumber",label:"Номер дела/производства и процессуальный статус",required:true,type:"text"},
    {key:"challengedAction",label:"Оспариваемое действие либо предмет ходатайства",required:true,type:"textarea"}
  ];
  return [];
}
function safe(value: unknown, max: number): string {
  if(typeof value!=="string") return "";
  return value.replace(/\r\n?/g,"\n").trim().slice(0,max);
}
function requestedValue(values: Readonly<Record<string,unknown>>, key: string): string {
  return safe(values[key],key==="facts" ? 2500 : key==="attachments" ? 1500 : 700);
}
function draftResultKind(kind: MilitaryLegalDocumentKind): MilitaryDocumentSpecification["resultKind"] {
  return kind==="AGREEMENT_DRAFT" ? "AGREEMENT_DRAFT" : kind==="OFFICIAL_FORM" ? "OFFICIAL_FORM" : "DRAFT";
}
function findTopicAndSituation(categorySlug:string,situationSlug:string) {
  const topic = MILITARY_TOPICS.find(x=>x.slug===categorySlug);
  const situation = topic?.situations.find(x=>x.slug===situationSlug);
  if(!topic || !situation) return null;
  return {topic,situation};
}

/** Documentation and field definitions only, not a live drafting endpoint. */
export function getMilitaryDraftPlan(categorySlug:string,situationSlug:string): MilitaryDraftPlan | null {
  const pair = findTopicAndSituation(categorySlug,situationSlug);
  const target = getMilitaryDocumentTarget(categorySlug,situationSlug);
  if(!pair || !target) return null;
  const card = MILITARY_LEGAL_CASE_CARDS.find(x=>x.topicSlug===categorySlug&&x.situationIndex===target.situationIndex);
  if(!card || card.legalReviewConfirmed) throw new Error("Unexpected military legal review state");
  const candidate = getMilitaryDocumentCandidate(pair.topic,pair.situation);
  const added = getMilitaryAdditionalComposition(categorySlug,target.situationIndex);
  if(candidate && added) throw new Error("Ambiguous document composition");
  return {
    categorySlug, situationSlug, kind: target.primaryKind,
    documentSlug: target.documentSlug, title: target.documentTitle,
    selectedSituationIsImplicit:true,
    requiredInputs: [...fields,...extraInputs(target.primaryKind),...(added?.additionalFields??[])],
    /** No invented demand for 103 documents without a verified individual composition. */
    documentRequest: candidate?.requestText ?? added?.candidate.requestText ?? "",
    competentRecipientRule: target.recipientToVerify,
    verifiedLegalRules: [],
    expectedAttachments: [],
    reviewStatus:"PENDING",
    resultKind:draftResultKind(target.primaryKind),
    filingReady:false, requiresLegalReview:true,
    canonicalDocumentUrl:null,
    relatedSituationUrls:getMilitaryRelatedSituations(pair.topic,pair.situation).map(x=>x.href),
    candidateImplemented:Boolean(candidate||added),
    evidencePrompt: target.caseSpecificEvidenceToConfirm,
    conditionalAlternativeKind:target.conditionalAlternativeKind,
    generationEnabled:false
  };
}
export function listMilitaryDraftPlans():readonly MilitaryDraftPlan[] {
  return MILITARY_DOCUMENT_TARGETS.map(x=>{
    const plan=getMilitaryDraftPlan(x.categorySlug,x.situationSlug);
    if(!plan) throw new Error("Unmapped plan "+x.documentSlug);
    return plan;
  });
}
export type MilitaryDraftInput = Readonly<{
  categorySlug:string;
  situationSlug:string;
  values: Readonly<Record<string,unknown>>;
  versionId?:string;
  createdAt?:string;
}>;
export type MilitaryDraftCoreOutput = Readonly<{
  documentResult:DocumentResultV1;
  /** Only in-memory state. No storage, URLs, logs or analytics. */
  formData:Readonly<Record<string,string>>;
}>;
/**
 * Internal prototype renderer. It fails closed for the 83 unimplemented
 * compositions, for informational pages, and for alternate judicial paths.
 * No user-supplied legal norm is ever treated as a verified rule.
 */
export function createMilitaryDraftPrototype(input:MilitaryDraftInput):MilitaryDraftCoreOutput {
  const plan=getMilitaryDraftPlan(input.categorySlug,input.situationSlug);
  const pair=findTopicAndSituation(input.categorySlug,input.situationSlug);
  if(!plan || !pair) throw new Error("No document outcome for this military situation");
  const existing = getMilitaryDocumentCandidate(pair.topic,pair.situation);
  const added = getMilitaryAdditionalComposition(input.categorySlug,pair.topic.situations.findIndex(s=>s.slug===input.situationSlug));
  if(existing && added) throw new Error("Ambiguous document composition");
  const candidate = existing ?? added?.candidate;
  if(!candidate || !plan.candidateImplemented) throw new Error("This military document does not yet have an individual approved composition prototype");
  const cleanValues:Record<string,string>={};
  for(const field of plan.requiredInputs) {
    const value=requestedValue(input.values,field.key);
    if(field.required && value.length<(field.key==="facts"?15:5)) throw new Error("Не заполнено обязательное поле: "+field.label);
    cleanValues[field.key]=value;
  }
  const facts = [
    cleanValues.facts,
    cleanValues.caseReference ? "Реквизиты: "+cleanValues.caseReference : "",
    cleanValues.evidence ? "Подтверждающие материалы: "+cleanValues.evidence : "",
    ...(added?.additionalFields.map(f=>f.label+": "+cleanValues[f.key])??[])
  ].filter(Boolean).join("\n");
  const documentText=buildMilitaryDraft(candidate,{
    applicant:cleanValues.applicant,
    recipient:cleanValues.recipient,
    facts,
    attachments:cleanValues.attachments
  });
  const parsed=documentResultSchema.parse({
    contractVersion:DOCUMENT_RESULT_CONTRACT_VERSION,
    versionId:input.versionId??crypto.randomUUID(),
    createdAt:input.createdAt??new Date().toISOString(),
    categorySlug:"voennoe-pravo",
    routeSlug:input.categorySlug,
    scenarioKey:input.situationSlug,
    documentSlug:plan.documentSlug,
    resultKind:"DRAFT",
    source:"DETERMINISTIC",
    documentTitle:plan.title,
    documentText,
    usedRuleIds:[],
    placeholders:[],
    legalRegistryReviewedAt:null,
    generatorVersion:MILITARY_DOCUMENT_CORE_VERSION,
    filingReady:false,
    requiresLegalReview:true
  });
  return {documentResult:parsed,formData:cleanValues};
}
/** In-tab only; no persistent server or browser storage of medical/service data. */
export function addMilitaryDraftVersion(
  history:readonly DocumentVersionEntry<Readonly<Record<string,string>>>[],
  next:MilitaryDraftCoreOutput
):DocumentVersionEntry<Readonly<Record<string,string>>>[]{
  return addDocumentVersion(history,{documentResult:next.documentResult,payload:next.formData});
}

/** User changes to a draft produce a new in-memory version, never legal approval. */
export function reviseMilitaryDraftPrototype(
  previous:MilitaryDraftCoreOutput,
  editedText:string,
  options:Readonly<{versionId?:string;createdAt?:string}>={}
):MilitaryDraftCoreOutput {
  const old=documentResultSchema.parse(previous.documentResult);
  const plan=getMilitaryDraftPlan(old.routeSlug,old.scenarioKey);
  if(old.categorySlug!=="voennoe-pravo" || old.resultKind!=="DRAFT" ||
     old.legalRegistryReviewedAt!==null || old.usedRuleIds.length!==0 ||
     old.filingReady!==false || old.requiresLegalReview!==true ||
     old.generatorVersion!==MILITARY_DOCUMENT_CORE_VERSION ||
     !plan?.candidateImplemented || plan.documentSlug!==old.documentSlug ||
     !["DETERMINISTIC","USER_EDITED"].includes(old.source)) {
    throw new Error("Нельзя редактировать неподтверждённый или чужой результат.");
  }
  const body=editedText.replace(/\r\n?/g,"\n").trim();
  if(body.length<40 || body.length>38000) throw new Error("Проверьте длину редактируемого черновика.");
  const text=body.replace(/^ЧЕРНОВИК[^\n]*\n(?:ТРЕБУЕТСЯ ЮРИДИЧЕСКАЯ ПРОВЕРКА[^\n]*\n)?/i,"").trim();
  const next=documentResultSchema.parse({
    ...old,
    versionId:options.versionId??crypto.randomUUID(),
    createdAt:options.createdAt??new Date().toISOString(),
    source:"USER_EDITED",
    documentText:"ЧЕРНОВИК — НЕ ГОТОВ К ПОДАЧЕ\nТРЕБУЕТСЯ ЮРИДИЧЕСКАЯ ПРОВЕРКА\n\n"+text,
    legalRegistryReviewedAt:null,
    usedRuleIds:[],
    filingReady:false,
    requiresLegalReview:true
  });
  return {documentResult:next,formData:{...previous.formData}};
}

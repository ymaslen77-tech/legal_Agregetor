import { documentResultSchema, type DocumentResultV1 } from "@/lib/document-result-contract";
import { getLegalRouteV1 } from "@/data/legal-route-standard";
import { getNavigatorDocument } from "@/data/documents";
import { getMilitaryDraftPlan, MILITARY_DOCUMENT_CORE_VERSION } from "@/data/military-document-core";
import { isMilitaryDraftPreviewEnabled } from "@/data/military-preview-access";

/** A client-side draft is always unverified. Do not accept arbitrary route links. */
export function validateSavedDocument(
  input: unknown,
  environment:Readonly<{NODE_ENV?:string;ENABLE_MILITARY_DRAFT_PREVIEW?:string}>=process.env
): DocumentResultV1 | null {
  const parsed = documentResultSchema.safeParse(input);
  if (!parsed.success) return null;
  const result = parsed.data;
  // An unpublished military draft is saved only from the opt-in local QA environment.
  // This is separate from, and must never relax, the legal publication gate.
  if (result.categorySlug === "voennoe-pravo") {
    if(!isMilitaryDraftPreviewEnabled(environment)) return null;
    const plan=getMilitaryDraftPlan(result.routeSlug,result.scenarioKey);
    if(!plan || !plan.candidateImplemented || result.documentSlug!==plan.documentSlug ||
       result.documentTitle!==plan.title || result.generatorVersion!==MILITARY_DOCUMENT_CORE_VERSION ||
       result.resultKind!=="DRAFT" || !["DETERMINISTIC","USER_EDITED"].includes(result.source) ||
       result.filingReady!==false || result.requiresLegalReview!==true ||
       result.legalRegistryReviewedAt!==null || result.usedRuleIds.length!==0 ||
       !result.documentText.startsWith("ЧЕРНОВИК — НЕ ГОТОВ К ПОДАЧЕ")) return null;
    return result;
  }
  const route = getLegalRouteV1(result.categorySlug, result.routeSlug);
  if (!route || !getNavigatorDocument(result.documentSlug)) return null;
  if (!route.scenarios.some((item) =>
    item.key === result.scenarioKey && item.documentSlug === result.documentSlug
  )) return null;
  if (result.filingReady !== false) return null;
  return result;
}

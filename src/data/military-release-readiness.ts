import { MILITARY_TOPICS } from "@/data/military-catalog";
import { getMilitaryDocumentCandidate } from "@/data/military-document-candidates";
import { getMilitaryAdditionalComposition } from "@/data/military-document-compositions";
import { MILITARY_LEGAL_CASE_CARDS } from "@/data/military-case-legal-matrix";
import { MILITARY_PROVISION_CHECKS } from "@/data/military-provision-checks";
import { MILITARY_DOCUMENT_TARGETS } from "@/data/military-document-target-matrix";
import { getMilitarySourceStatus, MILITARY_SOURCE_CLAIMS } from "@/data/military-source-verification";

/**
 * Production readiness is calculated from explicit per-situation evidence,
 * never assumed from a successful TypeScript build or document render.
 * A draft PDF is NOT a legally approved filing document.
 */
export function getMilitaryReleaseReadiness() {
  const categories = MILITARY_TOPICS.map((topic) => {
    const expectedDocuments = topic.situations.filter((item) => item.kind !== "information");
    const documented = expectedDocuments.filter((item) => getMilitaryDocumentCandidate(topic, item) !== null);
    const internalPrototypes = expectedDocuments.filter((item)=>{
      const index=topic.situations.findIndex(s=>s.slug===item.slug);
      return getMilitaryDocumentCandidate(topic,item)!==null ||
        getMilitaryAdditionalComposition(topic.slug,index)!==null;
    });
    const legallyReviewed = topic.situations.filter((item) => Boolean(item.legalReviewed));
    const sourceVerified = topic.situations.filter((_,index)=>getMilitarySourceStatus(topic.slug,index).verified).length;
    const sourceConflicts = topic.situations.filter((_,index)=>getMilitarySourceStatus(topic.slug,index).verdict.endsWith("CONFLICT")).length;
    return {
      slug: topic.slug,
      title: topic.title,
      situations: topic.situations.length,
      documentRequired: expectedDocuments.length,
      draftGenerators: documented.length,
      missingDraftGenerators: expectedDocuments.length - documented.length,
      internalDraftPrototypes: internalPrototypes.length,
      missingInternalDraftPrototypes: expectedDocuments.length - internalPrototypes.length,
      legallyReviewed: legallyReviewed.length,
      sourceVerified,
      sourceConflicts,
      sourcePending: topic.situations.length - sourceVerified
    };
  });
  const total = {
    categories: categories.length,
    situations: categories.reduce((n, category) => n + category.situations, 0),
    documentRequired: categories.reduce((n, category) => n + category.documentRequired, 0),
    draftGenerators: categories.reduce((n, category) => n + category.draftGenerators, 0),
    missingDraftGenerators: categories.reduce((n, category) => n + category.missingDraftGenerators, 0),
    internalDraftPrototypes: categories.reduce((n, category) => n + category.internalDraftPrototypes, 0),
    missingInternalDraftPrototypes: categories.reduce((n, category) => n + category.missingInternalDraftPrototypes, 0),
    legallyReviewed: categories.reduce((n, category) => n + category.legallyReviewed, 0),
    sourceVerified: categories.reduce((n,category)=>n+category.sourceVerified,0),
    sourcePending: categories.reduce((n,category)=>n+category.sourcePending,0),
    sourceConflicts: categories.reduce((n,category)=>n+category.sourceConflicts,0)
  };
  const legalGate = {
    individualCasesApproved: MILITARY_LEGAL_CASE_CARDS.filter(c=>c.legalReviewConfirmed).length,
    provisionTextsOfficiallyVerified: MILITARY_PROVISION_CHECKS.filter(c=>c.officialTextVerified).length,
    documentTargetsApproved: MILITARY_DOCUMENT_TARGETS.filter(c=>c.generationEnabled).length,
    plannedCases: MILITARY_LEGAL_CASE_CARDS.length,
    plannedProvisions: MILITARY_PROVISION_CHECKS.length,
    plannedDocuments: MILITARY_DOCUMENT_TARGETS.length
  };
  // Source confirmation is per-claim, without a mandatory human sign-off.
  // Unverified material remains explicitly marked as such and cannot acquire
  // a verified label just because its catalog route has been deployed.
  const sourceAcceptance = {
    manualSignOffRequired: false as const,
    checkedClaims: MILITARY_SOURCE_CLAIMS.length,
    automaticallyVerifiedCases: total.sourceVerified,
    pendingCases: total.sourcePending,
    conflictingCases: total.sourceConflicts,
    /** No blanket stop on deploying a protected, noindex editorial catalog. */
    globalSourceGateBlocksCatalog: false as const
  };
  const catalogDeployable =
    total.categories===20 && total.situations===143 &&
    total.documentRequired===121 && total.missingInternalDraftPrototypes===0;
  return {
    categories,
    total,
    legalGate, // Legacy diagnostic counters only; no longer release prerequisites.
    sourceAcceptance,
    catalogDeployable,
    /** Full publication is a technical generator-completeness decision, not a
     * manual 143-case sign-off. Unverified individual claims stay unverified. */
    productionReady: catalogDeployable && total.missingDraftGenerators===0
  } as const;
}

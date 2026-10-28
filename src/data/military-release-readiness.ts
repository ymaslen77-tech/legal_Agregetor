import { MILITARY_TOPICS } from "@/data/military-catalog";
import { getMilitaryDocumentCandidate } from "@/data/military-document-candidates";

/**
 * Production readiness is calculated from explicit per-situation evidence,
 * never assumed from a successful TypeScript build or document render.
 * A draft PDF is NOT a legally approved filing document.
 */
export function getMilitaryReleaseReadiness() {
  const categories = MILITARY_TOPICS.map((topic) => {
    const expectedDocuments = topic.situations.filter((item) => item.kind !== "information");
    const documented = expectedDocuments.filter((item) => getMilitaryDocumentCandidate(topic, item) !== null);
    const legallyReviewed = topic.situations.filter((item) => Boolean(item.legalReviewed));
    return {
      slug: topic.slug,
      title: topic.title,
      situations: topic.situations.length,
      documentRequired: expectedDocuments.length,
      draftGenerators: documented.length,
      missingDraftGenerators: expectedDocuments.length - documented.length,
      legallyReviewed: legallyReviewed.length
    };
  });
  const total = {
    categories: categories.length,
    situations: categories.reduce((n, category) => n + category.situations, 0),
    documentRequired: categories.reduce((n, category) => n + category.documentRequired, 0),
    draftGenerators: categories.reduce((n, category) => n + category.draftGenerators, 0),
    missingDraftGenerators: categories.reduce((n, category) => n + category.missingDraftGenerators, 0),
    legallyReviewed: categories.reduce((n, category) => n + category.legallyReviewed, 0)
  };
  return {
    categories,
    total,
    productionReady: total.categories === 20 &&
      total.situations === total.legallyReviewed &&
      total.missingDraftGenerators === 0
  } as const;
}

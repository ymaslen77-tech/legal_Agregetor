import { MILITARY_TOPICS } from "@/data/military-catalog";
import { MILITARY_DOCUMENT_TARGETS } from "@/data/military-document-target-matrix";
import type { MilitaryLegalDocumentKind } from "@/data/military-family-parity-contract";

/**
 * Catalog discovery records. All links target the already published military
 * situation pages; no duplicate /documents/[slug] routes are manufactured.
 * Drafts remain subject to legal review and MUST NOT be marked filing-ready.
 */
const typeLabels: Record<MilitaryLegalDocumentKind, string> = {
  RAPORT: "Рапорты",
  APPLICATION: "Заявления и обращения",
  COMPLAINT: "Жалобы",
  ADMINISTRATIVE_CLAIM: "Административные иски",
  CIVIL_CLAIM: "Иски",
  PROCEDURAL_MOTION: "Ходатайства",
  PROCEDURAL_APPEAL: "Апелляционные жалобы",
  PROCEDURAL_COMPLAINT: "Процессуальные жалобы",
  AGREEMENT_DRAFT: "Соглашения",
  OFFICIAL_FORM: "Официальные формы"
};

export const militaryDocumentsCatalog = MILITARY_DOCUMENT_TARGETS.map(target => {
  const topic = MILITARY_TOPICS.find(item => item.slug === target.categorySlug);
  if (!topic) throw new Error("Military category not found: " + target.categorySlug);
  const situation = topic.situations.find(item => item.slug === target.situationSlug);
  if (!situation || situation.kind === "information") {
    throw new Error("Military document missing a corresponding situation: " + target.documentSlug);
  }
  return {
    slug: target.documentSlug,
    href: `/voennoe-pravo/${target.categorySlug}/${target.situationSlug}/`,
    lawArea: "Военное право" as const,
    title: target.documentTitle,
    category: topic.title,
    documentType: typeLabels[target.primaryKind],
    shortDescription:
      "Онлайн-генератор проекта по ситуации «" + situation.title +
      "». Документ требует проверки юридических оснований и не готов к подаче без неё.",
    keywords: [topic.title, topic.description, situation.title, target.documentTitle, target.documentSlug],
    userQueries: [situation.title],
    relatedProblems: [{title: situation.title}]
  };
});

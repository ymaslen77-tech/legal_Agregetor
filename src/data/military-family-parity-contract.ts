import { MILITARY_TOPICS } from "@/data/military-catalog";
import { getMilitaryDocumentCandidate } from "@/data/military-document-candidates";
import type { DocumentResultV1 } from "@/lib/document-result-contract";
import type { LegalRouteInput } from "@/data/legal-route-standard";

/**
 * Stage 1: the family-reference CONTRACT, not an assertion that military cases
 * have passed legal review or that missing generators already exist.
 *
 * No questionnaire/checklist is a permitted military document outcome.
 * Official forms must be linked to their real approved templates.
 */
export const MILITARY_FAMILY_PARITY_VERSION = "MILITARY_FAMILY_PARITY_V1" as const;

export type MilitaryLegalDocumentKind =
  | "RAPORT"
  | "APPLICATION"
  | "COMPLAINT"
  | "ADMINISTRATIVE_CLAIM"
  | "CIVIL_CLAIM"
  | "PROCEDURAL_MOTION"
  | "PROCEDURAL_APPEAL"
  | "PROCEDURAL_COMPLAINT"
  | "AGREEMENT_DRAFT"
  | "OFFICIAL_FORM";

export type MilitaryRuleEvidence = Readonly<{
  ruleId: string;
  act: string;
  provision: string;
  exactSourceUrl: string;
  officialSource: boolean;
  reviewedAt: string;
  scope: string;
  limitations: string;
}>;

export type MilitaryDocumentSpecification = Readonly<{
  categorySlug: string;
  situationSlug: string;
  kind: MilitaryLegalDocumentKind;
  documentSlug: string;
  title: string;
  /** A user never needs to re-enter the selected situation or legal demand. */
  selectedSituationIsImplicit: true;
  requiredInputs: readonly LegalRouteInput[];
  documentRequest: string;
  competentRecipientRule: string;
  verifiedLegalRules: readonly MilitaryRuleEvidence[];
  expectedAttachments: readonly string[];
  reviewStatus: "PENDING" | "VERIFIED";
  /** Same metadata contract used by family; no false ready-to-file promise. */
  resultKind: DocumentResultV1["resultKind"];
  filingReady: false;
  requiresLegalReview: true;
  canonicalDocumentUrl: string;
  relatedSituationUrls: readonly string[];
}>;

/** A live inventory calculated from actual catalogue and registered generators. */
export function getMilitaryFamilyParityInventory() {
  const byCategory = MILITARY_TOPICS.map(topic => {
    const situations = topic.situations;
    const needingDocument = situations.filter(s => s.kind !== "information");
    const generators = needingDocument.filter(s => Boolean(getMilitaryDocumentCandidate(topic, s)));
    const linkedDocumentSlugs = situations.flatMap(s => s.documentSlugs);
    return {
      categorySlug: topic.slug,
      situationCount: situations.length,
      informationCount: situations.length - needingDocument.length,
      potentialDocumentCount: needingDocument.length,
      draftGeneratorCount: generators.length,
      missingDocumentGeneratorCount: needingDocument.length - generators.length,
      registryDocumentLinkCount: linkedDocumentSlugs.length,
      legallyReviewedCount: situations.filter(s => Boolean(s.legalReviewed)).length
    };
  });
  return {
    version: MILITARY_FAMILY_PARITY_VERSION,
    categories: byCategory,
    total: {
      categories: byCategory.length,
      situations: byCategory.reduce((sum, x) => sum + x.situationCount, 0),
      information: byCategory.reduce((sum, x) => sum + x.informationCount, 0),
      potentialDocuments: byCategory.reduce((sum, x) => sum + x.potentialDocumentCount, 0),
      draftGenerators: byCategory.reduce((sum, x) => sum + x.draftGeneratorCount, 0),
      missingDocumentGenerators: byCategory.reduce((sum, x) => sum + x.missingDocumentGeneratorCount, 0),
      documentSlugsInRegistry: byCategory.reduce((sum, x) => sum + x.registryDocumentLinkCount, 0),
      legallyReviewed: byCategory.reduce((sum, x) => sum + x.legallyReviewedCount, 0)
    }
  };
}

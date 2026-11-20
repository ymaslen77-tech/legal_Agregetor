import type { DocumentResultV1 } from "@/lib/document-result-contract";
import { isRealEstateDraftResult } from "@/lib/real-estate-document-core";
import { createMilitaryPdfBlob } from "@/lib/military-pdf";
import { buildGeneratedDocumentDocxBlob } from "@/lib/document-export";

/**
 * Client-only export. Visible text is the sole content source for both files.
 * No claim verification, official-form status or recipient is invented here.
 */
export function validateRealEstateExport(result: DocumentResultV1): DocumentResultV1 {
  if (!isRealEstateDraftResult(result) || result.filingReady ||
      result.legalRegistryReviewedAt !== null || result.usedRuleIds.length !== 0) {
    throw new Error("Нельзя экспортировать неподтверждённый результат как готовый документ.");
  }
  return result;
}
export function realEstateFileName(result: DocumentResultV1, ext: "pdf" | "docx"): string {
  const valid = validateRealEstateExport(result);
  return "proekt-" + valid.documentSlug + "-" + valid.versionId.slice(0, 8) + "." + ext;
}
export async function createRealEstatePdfBlob(result: DocumentResultV1): Promise<Blob> {
  const valid = validateRealEstateExport(result);
  return createMilitaryPdfBlob(valid.documentTitle, valid.documentText);
}
export async function createRealEstateDocxBlob(result: DocumentResultV1): Promise<Blob> {
  const valid = validateRealEstateExport(result);
  return buildGeneratedDocumentDocxBlob({
    title: valid.documentTitle,
    fileName: realEstateFileName(valid, "docx"),
    content: valid.documentText
  });
}

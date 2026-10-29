import { documentResultSchema, type DocumentResultV1 } from "@/lib/document-result-contract";
import { createMilitaryPdfBlob } from "@/lib/military-pdf";
import { buildGeneratedDocumentDocxBlob } from "@/lib/document-export";
import { getMilitaryDraftPlan } from "@/data/military-document-core";

/**
 * Stage 4: reuse existing family-style DOCX and military PDF renderers.
 * This is a draft-only export adapter; it never changes the legal status.
 */
export function validateMilitaryDraftExport(input:DocumentResultV1):DocumentResultV1 {
  const result=documentResultSchema.parse(input);
  if(result.categorySlug!=="voennoe-pravo" ||
     result.resultKind!=="DRAFT" ||
     result.filingReady!==false ||
     result.requiresLegalReview!==true ||
     result.legalRegistryReviewedAt!==null ||
     result.usedRuleIds.length!==0 ||
     !["DETERMINISTIC","USER_EDITED"].includes(result.source) ||
     !result.documentText.startsWith("ЧЕРНОВИК — НЕ ГОТОВ К ПОДАЧЕ")) {
    throw new Error("Экспорт неподтверждённого военного документа запрещён.");
  }
  const plan=getMilitaryDraftPlan(result.routeSlug,result.scenarioKey);
  if(!plan || !plan.candidateImplemented || plan.documentSlug!==result.documentSlug ||
     result.generatorVersion!=="military-core-v1") {
    throw new Error("Нет реализованного проекта для этой военной ситуации.");
  }
  return result;
}
export function militaryDraftExportText(result:DocumentResultV1):string {
  const checked=validateMilitaryDraftExport(result);
  return [
    "ПРОЕКТ — НЕ ГОТОВ К ПОДАЧЕ. ТРЕБУЕТСЯ ЮРИДИЧЕСКАЯ ПРОВЕРКА.",
    "Версия: "+checked.versionId,
    "Юридическая сверка реестра: не проведена.",
    "",
    checked.documentText
  ].join("\n");
}
export function militaryDraftExportFileName(result:DocumentResultV1,extension:"pdf"|"docx"):string {
  const checked=validateMilitaryDraftExport(result);
  return "proekt-"+checked.documentSlug+"-"+checked.versionId.slice(0,8)+"."+extension;
}
export async function createMilitaryDraftPdfBlob(result:DocumentResultV1):Promise<Blob>{
  const checked=validateMilitaryDraftExport(result);
  return createMilitaryPdfBlob(checked.documentTitle,militaryDraftExportText(checked));
}
export async function createMilitaryDraftDocxBlob(result:DocumentResultV1):Promise<Blob>{
  const checked=validateMilitaryDraftExport(result);
  return buildGeneratedDocumentDocxBlob({
    title:checked.documentTitle,
    fileName:militaryDraftExportFileName(checked,"docx"),
    content:militaryDraftExportText(checked)
  });
}

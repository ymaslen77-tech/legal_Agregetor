import { type DocumentResultV1 } from "@/lib/document-result-contract";
import { isCreditDebtDraftResult } from "@/lib/credit-debt-document-core";
import { createMilitaryPdfBlob } from "@/lib/military-pdf";
import { buildGeneratedDocumentDocxBlob } from "@/lib/document-export";

/**
 * Reuses the existing established PDF/DOCX renderers. Both use exactly
 * the visible version's documentText; no new legal claims enter the file.
 */
export function validateCreditDebtExport(result:DocumentResultV1):DocumentResultV1{
  if(!isCreditDebtDraftResult(result))throw new Error("Юридическая версия для экспорта не подтверждена.");
  if(result.filingReady!==false||result.legalRegistryReviewedAt!==null||
    result.usedRuleIds.length!==0)throw new Error("Нельзя экспортировать неподтверждённый юридический результат как готовый.");
  return result;
}
export function creditDebtFileName(result:DocumentResultV1,ext:"pdf"|"docx"):string{
  const r=validateCreditDebtExport(result);
  return "proekt-"+r.documentSlug+"-"+r.versionId.slice(0,8)+"."+ext;
}
export async function createCreditDebtPdfBlob(result:DocumentResultV1):Promise<Blob>{
  const r=validateCreditDebtExport(result);
  return createMilitaryPdfBlob(r.documentTitle,r.documentText);
}
export async function createCreditDebtDocxBlob(result:DocumentResultV1):Promise<Blob>{
  const r=validateCreditDebtExport(result);
  return buildGeneratedDocumentDocxBlob({
    title:r.documentTitle,
    fileName:creditDebtFileName(r,"docx"),
    content:r.documentText
  });
}

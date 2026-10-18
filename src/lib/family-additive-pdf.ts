import type { Content, TDocumentDefinitions } from "pdfmake/interfaces";
import { FAMILY_ADDITIVE_LEGAL_REVIEWED_AT, getFamilyAdditiveLegalRulesForScenario } from "@/data/family-additive-legal-review";
import type { FamilyAdditiveDecision } from "@/lib/family-additive-validator";

export async function createFamilyAdditivePdfBlob(decision: FamilyAdditiveDecision, documentText: string, versionId?: string) {
  const [pdfMakeModule, vfsModule] = await Promise.all([import("pdfmake/build/pdfmake"), import("pdfmake/build/vfs_fonts")]);
  const pdfMake = pdfMakeModule.default;
  (pdfMake as typeof pdfMake & { addVirtualFileSystem: (files: Record<string, string>) => void }).addVirtualFileSystem(vfsModule.default as unknown as Record<string, string>);
  const rules = getFamilyAdditiveLegalRulesForScenario(decision.routeSlug, decision.scenarioKey);
  // These hyperlinks are legal-reference metadata, not a new filing claim.
  // Keep the formal document's narrative and signatures intact.
  const content: Content[] = [
    { text: documentText, style: "document" },
    { text: "Нормативные источники (справочно, не часть обращения)", style: "sourcesHeading" },
    { ul: rules.map((rule) => ({
      text: [
        { text: `${rule.act}, ${rule.article}. ${rule.statement}\n` },
        { text: "Официальный источник: ", bold: true },
        { text: rule.url, link: rule.url, color: "#075985" },
        { text: `\nСверено: ${rule.checkedAt}. Граница применения: ${rule.limitation}` }
      ]
    })) }
  ];
  const definition: TDocumentDefinitions = {
    pageSize: "A4",
    pageMargins: [48, 52, 48, 62],
    defaultStyle: { font: "Roboto", fontSize: 10.5, lineHeight: 1.4, color: "#18181b" },
    footer: (page, pages) => ({ margin: [48, 10, 48, 0], columns: [{ text: `Правовая сверка: ${FAMILY_ADDITIVE_LEGAL_REVIEWED_AT}${versionId ? ` | Версия: ${versionId}` : ""}`, style: "footer" }, { text: `${page}/${pages}`, alignment: "right", style: "footer" }] }),
    content,
    styles: { document: { fontSize: 10.5, lineHeight: 1.45 }, sourcesHeading: { fontSize: 12, bold: true, margin: [0, 18, 0, 10] }, footer: { fontSize: 8, color: "#71717a" } },
    info: { title: decision.documentTitle, subject: "Юридический результат ПравоПоиска" }
  };
  return new Promise<Blob>((resolve, reject) => {
    try { pdfMake.createPdf(definition).getBlob(resolve); } catch (error) { reject(error); }
  });
}

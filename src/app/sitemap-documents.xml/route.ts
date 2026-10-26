import { urlSet, xmlResponse } from "@/lib/sitemap";
import { navigatorDocuments } from "@/data/documents";
import {FAMILY_LABOR_NEW_DOCUMENTS} from "@/data/family-labor-route-documents";
import {MILITARY_FIRST_DOCUMENT_PAGES} from "@/data/military-first-document-pages";

export async function GET() {
  // Генератор встроен в страницу документа, отдельных /generator/ URL больше нет.
  const pending=new Set([...FAMILY_LABOR_NEW_DOCUMENTS,...MILITARY_FIRST_DOCUMENT_PAGES].map(document=>document.slug));
  const documentPaths = navigatorDocuments.filter(document=>!pending.has(document.slug)).map((document) => `/documents/${document.slug}/`);

  return xmlResponse(urlSet(documentPaths));
}

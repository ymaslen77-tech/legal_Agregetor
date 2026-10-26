import { documentResultSchema, type DocumentResultV1 } from "@/lib/document-result-contract";
import { getLegalRouteV1 } from "@/data/legal-route-standard";
import { getNavigatorDocument } from "@/data/documents";
import {getMilitaryLegalDocument} from "@/data/military-legal-documents";
import {MILITARY_ROUTES} from "@/data/military-route-plans";

/** A client-side draft is always unverified. Do not accept arbitrary route links. */
export function validateSavedDocument(input: unknown): DocumentResultV1 | null {
  const parsed = documentResultSchema.safeParse(input);
  if (!parsed.success) return null;
  const result = parsed.data;
  if(result.categorySlug==="voennoe-pravo"){
    const document=getMilitaryLegalDocument(result.documentSlug);
    const route=MILITARY_ROUTES.find(route=>route.id===document?.routeId&&route.slug===result.routeSlug);
    if(!document||!route||!getNavigatorDocument(result.documentSlug))return null;
    if(document.scenarioKey!==result.scenarioKey||result.resultKind!=="DRAFT"||!result.requiresLegalReview)return null;
    if(result.filingReady!==false)return null;
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

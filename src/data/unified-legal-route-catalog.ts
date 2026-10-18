import { QNA_LEGAL_AREAS, type LegalQnaAreaId } from "@/data/legal-qna-taxonomy";
import { getLegalRouteRegistry, type LegalRouteV1 } from "@/data/legal-route-standard";
import { PROPOSED_LEGAL_ROUTES, type ProposedLegalRoute } from "@/data/legal-route-blueprints";
import { getFamilyLaborPlans, type FamilyLaborPlan } from "@/data/family-labor-route-expansion";

/**
 * One planning view over production V1 routes + unregistered research drafts.
 * This module does NOT add draft routes to Next.js navigation or public SEO.
 */
export type UnifiedLegalArea = {
  areaId:LegalQnaAreaId;
  name:string;
  sourceServiceSlugs:readonly string[];
  sourceQuestionCount20261015:number;
  currentRoutes:LegalRouteV1[];
  proposedRoutes:ProposedLegalRoute[];
  pendingExpansions:FamilyLaborPlan[];
  publicNavigatorEnabled:boolean;
};
export function getUnifiedLegalDevelopmentCatalog():UnifiedLegalArea[]{
  const existing=getLegalRouteRegistry();
  return QNA_LEGAL_AREAS.map(area=>({
    areaId:area.id,
    name:area.name,
    sourceServiceSlugs:area.sourceServiceSlugs,
    sourceQuestionCount20261015:area.baselineQuestions,
    currentRoutes:area.navigatorCategorySlug
      ? existing.filter(route=>route.categorySlug===area.navigatorCategorySlug)
      : [],
    proposedRoutes:PROPOSED_LEGAL_ROUTES.filter(route=>route.areaId===area.id),
    pendingExpansions:area.id==="family"||area.id==="labor"?[...getFamilyLaborPlans(area.id)]:[],
    publicNavigatorEnabled:area.releaseState==="EXISTING_ROUTES"
  }));
}
export function getUnifiedLegalCatalogStats(){
  const catalog=getUnifiedLegalDevelopmentCatalog();
  return {
    areas:catalog.length,
    legacyServices:new Set(catalog.flatMap(area=>area.sourceServiceSlugs)).size,
    baselineQuestions:catalog.reduce((sum,a)=>sum+a.sourceQuestionCount20261015,0),
    existingRoutes:catalog.reduce((sum,a)=>sum+a.currentRoutes.length,0),
    existingScenarios:catalog.reduce((sum,a)=>sum+a.currentRoutes.reduce((v,r)=>v+r.scenarios.length,0),0),
    proposedRoutes:catalog.reduce((sum,a)=>sum+a.proposedRoutes.length,0),
    proposedScenarios:catalog.reduce((sum,a)=>sum+a.proposedRoutes.reduce((v,r)=>v+r.scenarios.length,0),0),
    familyLaborPendingExpansions:catalog.reduce((sum,a)=>sum+a.pendingExpansions.length,0)
  };
}

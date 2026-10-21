/** Internal-only LEGAL_ROUTE_STANDARD_V1 projection; NOT registered in public legalProblems. */
import {MILITARY_ROUTES,getMilitaryDocumentSlug} from "@/data/military-route-plans";
import {LEGAL_ROUTE_STANDARD_VERSION,type LegalRouteV1,type LegalRouteScenarioV1} from "@/data/legal-route-standard";
export type MilitaryRouteV1=Omit<LegalRouteV1,"source">&{source:"military-preview"};
export function getMilitaryPreviewRoutes():MilitaryRouteV1[]{
 return MILITARY_ROUTES.map(route=>{
  const problemUrl="/problems/voennoe-pravo/"+route.slug+"/";
  const scenarios:LegalRouteScenarioV1[]=route.scenarios.map(s=>{
   const documentSlug=getMilitaryDocumentSlug(route,s);
   return {
    key:s.key,title:s.title,outcome:s.kind,documentSlug,
    inputs:s.required.map(key=>{
     const field=route.fields.find(x=>x.key===key);
     if(!field)throw new Error("Military field not registered: "+route.id+"/"+s.key+"/"+key);
     return {key,label:field.label,required:true,type:field.values?"select":"textarea"};
    }),
    scenarioUrl:problemUrl+"?scenario="+encodeURIComponent(s.key),
    documentUrl:documentSlug?"/documents/"+documentSlug+"/":null
   };
  });
  return {
   version:LEGAL_ROUTE_STANDARD_VERSION,categorySlug:"voennoe-pravo",problemSlug:route.slug,
   title:route.title,problemUrl,riskLevel:"high",urgency:"standard",
   legalReviewedAt:null,migrationStatus:"ADAPTED_V1",source:"military-preview",
   scenarios,relatedDocumentSlugs:scenarios.flatMap(s=>s.documentSlug?[s.documentSlug]:[])
  };
 });
}

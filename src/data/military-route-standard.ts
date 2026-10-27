/** Compatibility projection into the site's shared LEGAL_ROUTE_STANDARD_V1. */
import {MILITARY_ROUTES} from "@/data/military-route-plans";
import {MILITARY_LEGAL_DOCUMENTS,MILITARY_LEGAL_FIELDS,getMilitaryDocumentsForScenario} from "@/data/military-legal-documents";
import {militaryCanonicalRouteHref} from "@/lib/military-preview-navigation";
import {isMilitaryDocumentFieldRequired} from "@/lib/military-legal-document-generator";
import {LEGAL_ROUTE_STANDARD_VERSION,type LegalRouteV1,type LegalRouteScenarioV1} from "@/data/legal-route-standard";
export type MilitaryRouteV1=Omit<LegalRouteV1,"source">&{source:"military-preview"};
export function getMilitaryPreviewRoutes():MilitaryRouteV1[]{
 return MILITARY_ROUTES.map(route=>{
  const problemUrl=militaryCanonicalRouteHref(route.id);
  const scenarios:LegalRouteScenarioV1[]=route.scenarios.map(s=>{
   const primary=getMilitaryDocumentsForScenario(s.key)[0];
   const documentSlug=primary?.slug??null;
   return {
    key:s.key,title:s.title,outcome:s.kind==="URGENT_INSTRUCTION"?"URGENT_INSTRUCTION":"DRAFT",documentSlug,
    inputs:(primary?.fields??[]).map(key=>{
     const def=MILITARY_LEGAL_FIELDS[key];
     if(!def)throw new Error("Missing legal requisites: "+s.key+"/"+key);
     return {key,label:def.label,required:isMilitaryDocumentFieldRequired(key),type:["facts","proof","violation","grounds","desired"].includes(key)?"textarea":"text"};
    }),
    scenarioUrl:militaryCanonicalRouteHref(route.id,s.key),
    documentUrl:documentSlug?"/documents/"+documentSlug+"/":null
   };
  });
  return {
   version:LEGAL_ROUTE_STANDARD_VERSION,categorySlug:"voennoe-pravo",problemSlug:route.slug,
   title:route.title,problemUrl,riskLevel:"high",urgency:"standard",
   legalReviewedAt:null,migrationStatus:"ADAPTED_V1",source:"military-preview",
   scenarios,relatedDocumentSlugs:MILITARY_LEGAL_DOCUMENTS.filter(d=>d.routeId===route.id).map(d=>d.slug)
  };
 });
}

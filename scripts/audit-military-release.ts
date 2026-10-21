import assert from "node:assert/strict";
import {mkdirSync,writeFileSync} from "node:fs";
import {MILITARY_ROUTES,MILITARY_SOURCES,getMilitaryDocumentSlug} from "@/data/military-route-plans";
const CHECKS=[
 "primaryActCurrentText","statutoryScopeAndSpecialRegime","applicantStanding",
 "addresseeAndJurisdiction","deadlineAndReceiptDate","feesAndAmounts",
 "evidenceAndAttachments","documentRequestAndRelief","pdfDocxAndVersion",
 "negativeEmergencyAndExceptions","expertSignOff"
] as const;
const scenarios=MILITARY_ROUTES.flatMap(route=>route.scenarios.map(scenario=>{
 assert.ok(scenario.sources.every(key=>MILITARY_SOURCES[key]));
 assert.equal(route.publicationApproved,false);
 assert.equal(route.legalRegistryReviewedAt,null);
 assert.equal(route.filingReady,false);
 const checks=Object.fromEntries(CHECKS.map(k=>[k,k==="expertSignOff"?"NOT_GRANTED":"PENDING_CASE_BY_CASE_VERIFICATION"]));
 assert.equal(Object.values(checks).every(x=>x==="NOT_GRANTED"||x==="PENDING_CASE_BY_CASE_VERIFICATION"),true);
 return {routeId:route.id,canonicalProposedUrl:"/problems/voennoe-pravo/"+route.slug+"/",
  scenarioKey:scenario.key,plannedResult:scenario.kind,
  documentSlug:getMilitaryDocumentSlug(route,scenario),sources:scenario.sources,
  uiAndContract:"INTERNAL_PREVIEW",pdfDocx:scenario.kind==="URGENT_INSTRUCTION"?"NOT_APPLICABLE":"AWAITING_VISUAL_TEST",
  noPublicRegistry:true,legalAcceptanceChecklist:checks,filingReady:false,publicationApproved:false};
}));
assert.equal(scenarios.length,18);assert.equal(scenarios.filter(x=>x.plannedResult==="URGENT_INSTRUCTION").length,1);
const report={assessedAt:"2026-10-21",standard:"LEGAL_ROUTE_STANDARD_V1",result:"DOCUMENT_RESULT_V1",
 qnaBaselineMilitaryQuestions:13110,qnaBaselineCheckedAt:"2026-10-15",
 routes:MILITARY_ROUTES.length,scenarios:scenarios.length,legalChecksPerScenario:CHECKS.length,
 provisionalDrafts:scenarios.filter(x=>x.plannedResult==="DRAFT").length,
 preliminaryChecklists:scenarios.filter(x=>x.plannedResult==="CHECKLIST").length,
 emergencyInstructions:scenarios.filter(x=>x.plannedResult==="URGENT_INSTRUCTION").length,
 legallyApprovedScenarios:0,publishedRoutes:0,rows:scenarios};
mkdirSync("artifacts",{recursive:true});
writeFileSync("artifacts/military-legal-acceptance.json",JSON.stringify(report,null,2)+"\n");
console.log("MILITARY GATES: "+report.routes+" routes, "+report.scenarios+" scenarios, 11 mandatory checks, 0 approved; report saved");

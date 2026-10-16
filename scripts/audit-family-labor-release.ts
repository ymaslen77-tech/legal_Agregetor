import assert from "node:assert/strict";
import {mkdirSync,writeFileSync} from "node:fs";
import {FAMILY_LABOR_PLANS} from "@/data/family-labor-route-expansion";
import {SUPPORTED_PROVISIONAL_DRAFTS} from "@/lib/family-labor-provisional-draft";
import {getFamilyLaborDocumentSlug,getFamilyLaborRegistryScenarioKey,
  getFamilyLaborRouteSlug,familyLaborCategory} from "@/data/family-labor-implemented-routes";
import {getLegalRouteRegistry} from "@/data/legal-route-standard";
import {getNavigatorDocument} from "@/data/documents";

const registry=getLegalRouteRegistry();
const rows=FAMILY_LABOR_PLANS.flatMap(plan=>{
  const route=registry.find(x=>x.problemSlug===getFamilyLaborRouteSlug(plan) &&
    x.categorySlug===familyLaborCategory(plan));
  assert.ok(route,plan.id+": registered route required");
  return plan.scenarios.map(scenario=>{
    const key=getFamilyLaborRegistryScenarioKey(plan,scenario.key);
    const scenarioV1=route.scenarios.find(item=>item.key===key);
    assert.ok(scenarioV1,plan.id+"/"+scenario.key);
    const documentSlug=getFamilyLaborDocumentSlug(plan,scenario.key);
    const expected=SUPPORTED_PROVISIONAL_DRAFTS.some(id=>id===plan.id+"/"+scenario.key)
      ? "DRAFT" : scenario.emergencyFirst ? "URGENT_INSTRUCTION" : "CHECKLIST";
    assert.equal(scenarioV1.outcome,expected);
    assert.equal(scenarioV1.documentSlug,documentSlug);
    if(documentSlug){
      const document=getNavigatorDocument(documentSlug);
      assert.ok(document,documentSlug+": missing document page");
      assert.equal(document.resultKind,expected);
    }
    return {
      route:familyLaborCategory(plan)+"/"+getFamilyLaborRouteSlug(plan),
      planId:plan.id,scenario:scenario.key,
      routeKind:plan.kind,resultKind:expected,
      documentSlug,inputs:scenario.requiredFields.length,
      uiAndContract:"IMPLEMENTED",
      legalSourceReview:"PENDING_OFFICIAL_PRIMARY_SOURCES",
      specializedDocument:expected==="DRAFT"?"PROVISIONAL_UNAPPROVED":
        expected==="CHECKLIST"?"CHECKLIST_ONLY":"EMERGENCY_NO_DOCUMENT",
      pdfDocx:scenario.emergencyFirst?"NOT_APPLICABLE":"AVAILABLE",
      cabinet:scenario.emergencyFirst?"NOT_APPLICABLE":"DOCUMENT_RESULT_V1",
      filingReady:false,
      publicationApproved:false
    };
  });
});
assert.equal(registry.length,51);
assert.equal(FAMILY_LABOR_PLANS.filter(x=>x.kind==="NEW_ROUTE").length,8);
assert.equal(FAMILY_LABOR_PLANS.filter(x=>x.kind==="EXISTING_ROUTE_EXTENSION").length,12);
assert.equal(FAMILY_LABOR_PLANS.filter(x=>x.kind==="CROSS_AREA_LINK").length,3);
assert.equal(rows.filter(x=>x.resultKind==="DRAFT").length,SUPPORTED_PROVISIONAL_DRAFTS.length);
assert.equal(SUPPORTED_PROVISIONAL_DRAFTS.length,9);
assert.ok(rows.every(x=>!x.filingReady&&!x.publicationApproved));
const summary={
  assessedAt:"2026-10-16",
  existingRoutes:43,addedRoutes:8,extensions:12,crossAreaLinks:3,
  registeredRoutes:registry.length,
  scenariosAssessed:rows.length,
  provisionalDrafts:rows.filter(x=>x.resultKind==="DRAFT").length,
  preliminaryChecklists:rows.filter(x=>x.resultKind==="CHECKLIST").length,
  emergencyInstructions:rows.filter(x=>x.resultKind==="URGENT_INSTRUCTION").length,
  legalApproval:"BLOCKED_PENDING_INDIVIDUAL_PRIMARY_SOURCE_REVIEW",
  rollout:"NOT_AUTHORIZED",
  scenarios:rows
};
mkdirSync("artifacts",{recursive:true});
writeFileSync("artifacts/family-labor-readiness.json",JSON.stringify(summary,null,2)+"\n");
console.log("Family/labor readiness: "+summary.scenariosAssessed+" scenarios checked; "
  +summary.provisionalDrafts+" preliminary drafts; legal release remains BLOCKED.");

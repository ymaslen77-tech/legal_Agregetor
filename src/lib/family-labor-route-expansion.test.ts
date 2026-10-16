import assert from "node:assert/strict";
import {FAMILY_LABOR_PLANS,getFamilyLaborPlans} from "@/data/family-labor-route-expansion";
import {validateFamilyLaborIntake,validateFamilyLaborIntakeById} from "@/lib/family-labor-route-expansion";
import {getLegalRouteRegistry} from "@/data/legal-route-standard";
import {getUnifiedLegalDevelopmentCatalog} from "@/data/unified-legal-route-catalog";
const all=getLegalRouteRegistry();
const existing={
  family:new Set(all.filter(x=>x.categorySlug==="semya-i-deti").map(x=>x.problemSlug)),
  labor:new Set(all.filter(x=>x.categorySlug==="trudovoe-pravo").map(x=>x.problemSlug))
};
assert.equal(all.filter(x=>x.categorySlug==="semya-i-deti"&&x.source!=="family-labor-new").length,29);
assert.equal(all.filter(x=>x.categorySlug==="trudovoe-pravo"&&x.source!=="family-labor-new").length,14);
assert.equal(new Set(FAMILY_LABOR_PLANS.map(x=>x.id)).size,FAMILY_LABOR_PLANS.length);
assert.equal(FAMILY_LABOR_PLANS.length,23);
assert.equal(getFamilyLaborPlans("family").filter(x=>x.kind==="NEW_ROUTE").length,3);
assert.equal(getFamilyLaborPlans("labor").filter(x=>x.kind==="NEW_ROUTE").length,5);
assert.equal(FAMILY_LABOR_PLANS.filter(x=>x.kind==="EXISTING_ROUTE_EXTENSION").length,12);
assert.equal(FAMILY_LABOR_PLANS.filter(x=>x.kind==="CROSS_AREA_LINK").length,3);
for(const plan of FAMILY_LABOR_PLANS){
  assert.equal(plan.publicEnabled,false);
  assert.equal(plan.filingReady,false);
  assert.equal(plan.generation,"NOT_IMPLEMENTED");
  assert.equal(plan.legalReview,"PENDING_OFFICIAL_SOURCES");
  assert.ok(plan.legalSources.length>0);
  if(plan.kind==="NEW_ROUTE"){assert.equal(plan.existingSlug,null);assert.ok(plan.scenarios.length>0);}
  else {assert.ok(plan.existingSlug&&existing[plan.area].has(plan.existingSlug),plan.id);}
  if(plan.kind==="CROSS_AREA_LINK"){assert.ok(plan.destinationArea);assert.equal(plan.scenarios.length,0);continue;}
  const fieldKeys=plan.fields.map(f=>f.key);
  assert.equal(new Set(fieldKeys).size,fieldKeys.length,plan.id);
  assert.equal(new Set(plan.scenarios.map(s=>s.key)).size,plan.scenarios.length,plan.id);
  for(const scenario of plan.scenarios){
    assert.ok(scenario.requiredFields.every(k=>fieldKeys.includes(k)),plan.id);
    const empty=validateFamilyLaborIntake(plan,scenario.key,{});
    assert.equal(empty.filingReady,false);
    assert.equal(empty.documentGenerationAllowed,false);
    if(!scenario.emergencyFirst)assert.ok(empty.missing.length>=5);
    const answers:Record<string,string>={};
    for(const field of plan.fields)answers[field.key]=field.options?(field.options[0]??""):"Обезличенные учебные данные";
    const filled=validateFamilyLaborIntakeById(plan.id,scenario.key,answers);
    assert.equal(filled.dataComplete,true);
    assert.equal(filled.filingReady,false);
    assert.equal(filled.documentGenerationAllowed,false);
    const first=scenario.requiredFields[0];
    if(first){
      assert.deepEqual(validateFamilyLaborIntake(plan,scenario.key,{...answers,[first]:" "}).missing,[first]);
      assert.ok(validateFamilyLaborIntake(plan,scenario.key,{...answers,[first]:"x".repeat(2001)}).invalid.includes(first));
    }
  }
}
const safety=FAMILY_LABOR_PLANS.find(x=>x.id==="family-emergency-safety");
assert.ok(safety);
assert.ok(safety.scenarios.every(x=>x.emergencyFirst&&x.requiredFields.length===0));
assert.equal(validateFamilyLaborIntake(safety,"immediate-danger",{}).documentGenerationAllowed,false);
assert.throws(()=>validateFamilyLaborIntakeById("no-such-plan","x",{}));
const unified=getUnifiedLegalDevelopmentCatalog();
assert.equal(unified.find(x=>x.areaId==="family")?.pendingExpansions.length,getFamilyLaborPlans("family").length);
assert.equal(unified.find(x=>x.areaId==="labor")?.pendingExpansions.length,getFamilyLaborPlans("labor").length);
assert.equal(all.length,51,"8 new routes + original 43 registered");
console.log("Family/labor: 8 new proposals, 12 extensions, 3 cross-links; legal release gate enforced.");

import assert from "node:assert/strict";
import { FAMILY_LABOR_PLANS } from "@/data/family-labor-route-expansion";
import { FAMILY_LABOR_ACTS,FAMILY_LABOR_SCENARIO_REVIEW,getFamilyLaborScenarioReview } from "@/data/family-labor-scenario-review";
import { getFamilyLaborGuidance } from "@/lib/family-labor-route-guidance";
const scenarios=FAMILY_LABOR_PLANS.flatMap(plan=>plan.scenarios.map(s=>plan.id+"/"+s.key));
assert.equal(scenarios.length,32);
assert.equal(Object.keys(FAMILY_LABOR_SCENARIO_REVIEW).length,32);
assert.deepEqual(new Set(scenarios),new Set(Object.keys(FAMILY_LABOR_SCENARIO_REVIEW)));
for(const plan of FAMILY_LABOR_PLANS)for(const scenario of plan.scenarios){
  const gate=getFamilyLaborScenarioReview(plan.id,scenario.key);
  assert.equal(gate.filingApproved,false);
  assert.equal(gate.status,"NEEDS_CASE_SPECIFIC_LEGAL_REVIEW");
  assert.ok(gate.acts.length>0);
  assert.ok(gate.necessaryQualification.length>=2);
  assert.ok(gate.primaryProvisionsToConfirm.length>0);
  assert.ok(gate.primaryProvisionsToConfirm.every(rule=>rule.trim().length>10));

  assert.ok(gate.noAutomaticConclusion.length>25);
  assert.ok(gate.acts.every(key=>FAMILY_LABOR_ACTS[key].url.startsWith("https://")));
  const guidance=getFamilyLaborGuidance(plan,scenario.key,{});
  assert.equal(guidance.documentGenerationAllowed,false);
  assert.equal(guidance.legalOutcomeApproved,false);
  assert.equal(guidance.filingReady,false);
  assert.ok(guidance.guidance.some(g=>g.includes(gate.noAutomaticConclusion)));
  assert.ok(gate.primaryProvisionsToConfirm.every(rule=>guidance.guidance.some(line=>line.includes(rule))),
    plan.id+"/"+scenario.key+" must display the actual legal provisions to verify");

  assert.ok(gate.acts.every(key=>guidance.verificationSources.some(source=>source.url===FAMILY_LABOR_ACTS[key].url)));
}
for(const [planId,scenario,expectedSource] of [
  ["adult-guardianship","appeal","kas"],
  ["foreign-workers","eligibility","migration"],
  ["foreign-workers","violation","migration"],
  ["maternity-leave","benefits","insuranceInfo"]
] as const){
  const gate=getFamilyLaborScenarioReview(planId,scenario);
  assert.ok(gate.acts.includes(expectedSource),planId+"/"+scenario+" must link its distinct legal regime");
  assert.ok(getFamilyLaborGuidance(FAMILY_LABOR_PLANS.find(p=>p.id===planId)!,scenario,{}).verificationSources.some(s=>s.url===FAMILY_LABOR_ACTS[expectedSource].url));
}
assert.throws(()=>getFamilyLaborScenarioReview("unknown","scenario"));
console.log("Family/labor legal case matrix: 32/32 scenario source gates, all not approved to file.");

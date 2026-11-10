import assert from "node:assert/strict";
import {
  CREDIT_DEBT_BASELINE, CREDIT_DEBT_GROUPS, CREDIT_DEBT_SOURCE_CANDIDATES,
  CREDIT_DEBT_PUBLICATION_GATE, CREDIT_DEBT_COMMON_FACTS, getCreditDebtPlanStats,
  findCreditDebtSituation
} from "./credit-debt-route-plan";

const stats=getCreditDebtPlanStats();
assert.equal(CREDIT_DEBT_BASELINE.questions,12783);
assert.equal(CREDIT_DEBT_BASELINE.isTrafficMetric,false);
assert.equal(stats.groups,10);
assert.equal(stats.situations,60);
assert.equal(stats.publicationEnabled,false);
assert.ok(stats.crossLinks>=6);
assert.equal(CREDIT_DEBT_PUBLICATION_GATE.stage,"DESIGN_ONLY");
assert.equal(CREDIT_DEBT_PUBLICATION_GATE.publicNavigatorEnabled,false);
assert.equal(CREDIT_DEBT_PUBLICATION_GATE.documentGenerationAllowed,false);
assert.equal(CREDIT_DEBT_PUBLICATION_GATE.filingReady,false);
assert.match(CREDIT_DEBT_PUBLICATION_GATE.claimVerification,/PENDING_/);
assert.equal(CREDIT_DEBT_PUBLICATION_GATE.noFakeProfilesOrFixtureAnswers,true);

const keys=new Set<string>();
const allowedResults=new Set([
  "CHECKLIST","ELIGIBILITY_CHECK","CALCULATION_REVIEW","REQUEST_DRAFT",
  "COMPLAINT_DRAFT","OBJECTION_DRAFT","CLAIM_DRAFT","DATA_PREPARATION",
  "SAFETY_ESCALATION","FRAUD_REFERRAL","CROSS_LINK"
]);
const allowedRelated=new Set(["military","family","fraud","inheritance","enforcement","civil-process"]);
const commonKeys=CREDIT_DEBT_COMMON_FACTS.map(x=>x.key);
assert.equal(commonKeys.length,new Set(commonKeys).size);
assert.ok(commonKeys.includes("currentStage"));
const sourceKeys=new Set(Object.keys(CREDIT_DEBT_SOURCE_CANDIDATES));
for(const [key,source] of Object.entries(CREDIT_DEBT_SOURCE_CANDIDATES)){
  assert.ok(source.title.length>10,key);
  assert.equal(new URL(source.url).protocol,"https:");
  assert.ok(["pravo.gov.ru","www.cbr.ru"].includes(new URL(source.url).hostname));
}
const groupIds=new Set<string>();
let highRisk=0;
for(const group of CREDIT_DEBT_GROUPS){
  assert.match(group.id,/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  assert.ok(!groupIds.has(group.id),group.id);
  groupIds.add(group.id);
  assert.ok(group.title.length>12);
  assert.ok(group.description.length>15);
  assert.ok(group.specificFacts.length>=3);
  assert.ok(group.sourceKeys.length>=2);
  assert.ok(group.sourceKeys.every(key=>sourceKeys.has(key)),group.id);
  assert.ok(group.situations.length>=5 && group.situations.length<=8);
  for(const caseData of group.situations){
    const id=`${group.id}/${caseData.id}`;
    assert.match(caseData.id,/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.ok(!keys.has(id),id);
    keys.add(id);
    assert.ok(caseData.title.length>=20,id);
    assert.ok(caseData.caseFacts.length>=10,id);
    assert.ok(allowedResults.has(caseData.targetResult),id);
    assert.ok(["standard","high","critical"].includes(caseData.risk),id);
    if(caseData.risk!=="standard")highRisk++;
    if(caseData.crossLinkArea){
      assert.ok(allowedRelated.has(caseData.crossLinkArea),id);
      assert.ok(["CROSS_LINK","FRAUD_REFERRAL"].includes(caseData.targetResult),id);
    }
    assert.equal(findCreditDebtSituation(group.id,caseData.id),caseData);
  }
}
assert.ok(highRisk>=40,"High-risk cases require special gate before authoring");
assert.equal(findCreditDebtSituation("missing","missing"),null);
assert.equal(findCreditDebtSituation("bankruptcy","out-of-court-mfc")?.targetResult,"ELIGIBILITY_CHECK");
assert.equal(findCreditDebtSituation("court-debt","enforcement-after-court")?.crossLinkArea,"enforcement");
assert.equal(findCreditDebtSituation("payment-difficulties","military-special-benefits")?.crossLinkArea,"military");
assert.ok(!CREDIT_DEBT_GROUPS.some(g=>g.situations.some(x=>x.title.includes("Гарантированное списание"))));
console.log(`Credit and debt preparation verified: ${stats.groups} groups, ${stats.situations} situations, ${stats.crossLinks} cross-links, ${highRisk} elevated-risk cases; publication and generation disabled.`);

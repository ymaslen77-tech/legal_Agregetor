import assert from "node:assert/strict";
import { REAL_ESTATE_GROUPS, REAL_ESTATE_PUBLICATION_GATE } from "@/data/real-estate-route-plan";
import { REAL_ESTATE_LEGAL_REVIEW_TASKS,getRealEstateLegalReviewTask } from "./real-estate-legal-review";
assert.equal(REAL_ESTATE_LEGAL_REVIEW_TASKS.length,60);
assert.equal(new Set(REAL_ESTATE_LEGAL_REVIEW_TASKS.map(x=>x.key)).size,60);
assert.equal(REAL_ESTATE_PUBLICATION_GATE.filingReady,false);
assert.equal(REAL_ESTATE_PUBLICATION_GATE.documentGenerationAllowed,false);
assert.equal(REAL_ESTATE_PUBLICATION_GATE.indexable,false);
for(const group of REAL_ESTATE_GROUPS)for(const situation of group.situations){
  const key=group.id+"/"+situation.id;
  const task=getRealEstateLegalReviewTask(group.id,situation.id);
  assert.ok(task,key);
  assert.equal(task.status,"PENDING",key);
  assert.equal(task.filingReady,false,key);
  assert.deepEqual(task.acceptedClaims,[],key);
  assert.equal(task.sourcesVerifiedPerClaim,0,key);
  assert.ok(task.candidateActNames.length>=2,key);
  assert.ok(task.requiredChecks.length>=8,key);
  assert.ok(task.requiredChecks.some(text=>text.includes("трём независимым")),key);
  assert.ok(task.issueToVerify.includes(situation.caseFacts),key);
}
assert.equal(getRealEstateLegalReviewTask("missing","missing"),null);
console.log("Real estate legal gate PASS: 60 individual PENDING tasks, no accepted claims, no premature publication");

for(const group of REAL_ESTATE_GROUPS.filter(group=>group.id==="land-boundaries"))for(const scenario of group.situations){
  assert.ok(getRealEstateLegalReviewTask(group.id,scenario.id)?.candidateActNames.some(name=>name.includes("221-ФЗ")),scenario.id);
}

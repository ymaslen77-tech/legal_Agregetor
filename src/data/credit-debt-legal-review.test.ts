import assert from "node:assert/strict";
import { CREDIT_DEBT_GROUPS } from "@/data/credit-debt-route-plan";
import { getCreditDebtLegalSourceCandidates,getCreditDebtLegalReview } from "./credit-debt-legal-review";
let cases=0;
for(const group of CREDIT_DEBT_GROUPS){
  const sourceList=getCreditDebtLegalSourceCandidates(group.id);
  assert.ok(sourceList.length>=2,group.id);
  assert.ok(new Set(sourceList.map(x=>x.publisher)).size>=2,group.id);
  assert.ok(sourceList.every(source=>source.status==="CANDIDATE"),group.id);
  assert.ok(sourceList.every(source=>new URL(source.url).protocol==="https:"),group.id);
  assert.ok(sourceList.every(source=>source.title.length>14),group.id);
  for(const s of group.situations){
    const review=getCreditDebtLegalReview(group.id,s.id);
    assert.equal(review.reviewStatus,"PENDING");
    assert.equal(review.legallyReady,false);
    assert.equal(review.acceptedLegalClaims.length,0);
    assert.equal(review.officialVersionPriority,true);
    assert.equal(review.minIndependentSources,3);
    assert.deepEqual(review.candidateSources,sourceList);
    cases++;
  }
}
assert.equal(cases,60);
console.log("Credit/debt legal evidence gate PASS: 60 pending cases, 10 group source lists; no fake verified claim.");

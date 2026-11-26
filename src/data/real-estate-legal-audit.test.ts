import assert from "node:assert/strict";
import { REAL_ESTATE_CHECKED_CONTEXT } from "./real-estate-checked-context";
import { REAL_ESTATE_GROUPS } from "./real-estate-route-plan";
import { REAL_ESTATE_CASE_AUDIT,getRealEstateAuditSummary } from "./real-estate-legal-audit";
assert.equal(REAL_ESTATE_CASE_AUDIT.length,60);
assert.equal(new Set(REAL_ESTATE_CASE_AUDIT.map(row=>row.key)).size,60);
assert.equal(REAL_ESTATE_CHECKED_CONTEXT.length,4);
const summary=getRealEstateAuditSummary();
assert.deepEqual(summary,{
  scenarios:60,withGeneralContext:9,withoutGeneralContext:51,
  legallyApproved:0,filingReady:0,indexable:0
});
for(const group of REAL_ESTATE_GROUPS)for(const situation of group.situations){
  const key=group.id+"/"+situation.id;
  const row=REAL_ESTATE_CASE_AUDIT.find(x=>x.key===key);
  assert.ok(row,key);
  assert.equal(row.title,situation.title,key);
  assert.equal(row.reviewStatus,"PENDING",key);
  assert.equal(row.acceptedIndividualClaims,0,key);
  assert.equal(row.filingReady,false,key);
  assert.equal(row.indexable,false,key);
  assert.equal(row.nextAction,"THREE_SOURCE_CLAIM_AND_CASE_REVIEW",key);
  assert.ok(row.candidateActCount>=2,key);
  if(row.contextualClaimIds.length>0){
    assert.ok(row.contextualPublisherCount>=3,key);
    for(const id of row.contextualClaimIds){
      const ctx=REAL_ESTATE_CHECKED_CONTEXT.find(x=>x.id===id);
      assert.ok(ctx);
      assert.equal(ctx.status,"CONTEXT_ONLY_NOT_DOCUMENT_READY");
    }
  }else{
    assert.equal(row.contextualPublisherCount,0,key);
  }
}
console.log("REAL_ESTATE_LEGAL_COVERAGE="+JSON.stringify(summary));
console.log("REAL_ESTATE_CASE_AUDIT="+JSON.stringify(REAL_ESTATE_CASE_AUDIT));

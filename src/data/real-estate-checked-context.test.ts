import assert from "node:assert/strict";
import { REAL_ESTATE_CHECKED_CONTEXT,getRealEstateCheckedContext } from "./real-estate-checked-context";
import { getRealEstateLegalReviewTask } from "./real-estate-legal-review";
assert.ok(REAL_ESTATE_CHECKED_CONTEXT.length>0);
for(const item of REAL_ESTATE_CHECKED_CONTEXT){
  assert.equal(item.status,"CONTEXT_ONLY_NOT_DOCUMENT_READY");
  assert.match(item.proposition,/статьи 61/);
  assert.equal(new Set(item.sources.map(x=>x.publisher)).size,3);
  assert.ok(item.sources.every(x=>new URL(x.url).protocol==="https:"));
  assert.ok(item.sources.some(x=>x.type==="LAW_TEXT"));
  for(const key of item.appliesTo){
    const [groupId,situationId]=key.split("/");
    assert.ok(getRealEstateLegalReviewTask(groupId,situationId),key);
    assert.equal(getRealEstateLegalReviewTask(groupId,situationId)?.status,"PENDING",key);
    assert.ok(getRealEstateCheckedContext(groupId,situationId).some(x=>x.id===item.id));
  }
}
assert.deepEqual(getRealEstateCheckedContext("none","none"),[]);
console.log("Real estate registry context: independently compared publications, zero situation approvals");

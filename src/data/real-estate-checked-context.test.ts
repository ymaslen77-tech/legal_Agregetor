import assert from "node:assert/strict";
import { REAL_ESTATE_CHECKED_CONTEXT,getRealEstateCheckedContext } from "./real-estate-checked-context";
import { getRealEstateLegalReviewTask } from "./real-estate-legal-review";
assert.equal(REAL_ESTATE_CHECKED_CONTEXT.length,2);
for(const item of REAL_ESTATE_CHECKED_CONTEXT){
  assert.equal(item.status,"CONTEXT_ONLY_NOT_DOCUMENT_READY");
  assert.match(item.proposition,item.id==="registry-errors-distinction"?/статьи 61/:/статьи 250/);
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
const shareContext=getRealEstateCheckedContext("shared-ownership","share-sale");
assert.equal(shareContext.length,1);
assert.equal(shareContext[0].id,"share-sale-preemption");
assert.match(shareContext[0].limitations,/публичных торгов/);
assert.match(shareContext[0].limitations,/№ 23-П/);
assert.equal(getRealEstateLegalReviewTask("shared-ownership","share-sale")?.status,"PENDING");
assert.deepEqual(getRealEstateCheckedContext("none","none"),[]);
console.log("Real estate registry context: independently compared publications, zero situation approvals");

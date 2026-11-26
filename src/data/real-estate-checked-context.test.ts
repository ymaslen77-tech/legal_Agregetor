import assert from "node:assert/strict";
import { REAL_ESTATE_CHECKED_CONTEXT,getRealEstateCheckedContext } from "./real-estate-checked-context";
import { getRealEstateLegalReviewTask } from "./real-estate-legal-review";
assert.equal(REAL_ESTATE_CHECKED_CONTEXT.length,4);
for(const item of REAL_ESTATE_CHECKED_CONTEXT){
  assert.equal(item.status,"CONTEXT_ONLY_NOT_DOCUMENT_READY");
  const legalArticle:Record<string,RegExp>={
    "registry-errors-distinction":/статьи 61/,
    "share-sale-preemption":/статьи 250/,
    "registration-suspension-article26":/статьи 26/,
    "registration-refusal-article27":/статьи 27/
  };
  assert.match(item.proposition,legalArticle[item.id],"Unrecognized context entry "+item.id);
  assert.equal(item.sources.length,3);
  assert.equal(new Set(item.sources.map(x=>x.publisher)).size,3);
  if(item.id.startsWith("registration-"))assert.equal(
    new Set(item.sources.map(x=>new URL(x.url).hostname)).size,3
  );
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
for(const [group,situation,article] of [
  ["ownership-register","suspension-registration","registration-suspension-article26"],
  ["cadastral-valuation","cadastre-suspension","registration-suspension-article26"],
  ["ownership-register","registration-refusal","registration-refusal-article27"],
  ["build-renovation","building-register-refusal","registration-refusal-article27"]
]){
  const context=getRealEstateCheckedContext(group,situation);
  assert.equal(context.length,1,group+"/"+situation);
  assert.equal(context[0].id,article);
  assert.equal(getRealEstateLegalReviewTask(group,situation)?.filingReady,false);
}
assert.deepEqual(getRealEstateCheckedContext("none","none"),[]);
console.log("Real estate legal context PASS: 4 contexts, 3 publishers each, 9 covered situations but zero filing approvals");

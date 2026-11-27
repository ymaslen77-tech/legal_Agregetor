import assert from "node:assert/strict";
import { REAL_ESTATE_CHECKED_CONTEXT,getRealEstateCheckedContext } from "./real-estate-checked-context";
import { getRealEstateLegalReviewTask } from "./real-estate-legal-review";
assert.equal(REAL_ESTATE_CHECKED_CONTEXT.length,8);
for(const item of REAL_ESTATE_CHECKED_CONTEXT){
  assert.equal(item.status,"CONTEXT_ONLY_NOT_DOCUMENT_READY");
  const legalArticle:Record<string,RegExp>={
    "registry-errors-distinction":/статьи 61/,
    "share-sale-preemption":/статьи 250/,
    "registration-suspension-article26":/статьи 26/,
    "registration-refusal-article27":/статьи 27/,
    "ddu-contract-article4":/статьи 4/,
    "ddu-delay-article6":/статьи 6/,
    "ddu-quality-article7":/статьи 7/,
    "ddu-acceptance-article8":/статьи 8/
  };
  assert.match(item.proposition,legalArticle[item.id],"Unrecognized context entry "+item.id);
  assert.equal(item.sources.length,3);
  assert.equal(new Set(item.sources.map(x=>x.publisher)).size,3);
  if(item.id.startsWith("registration-")||item.id.startsWith("ddu-"))assert.equal(
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
console.log("Real estate legal context PASS: 8 contexts, 3 publishers each, 14 covered situations but zero filing approvals");

for(const [scenario,id] of [["ddu-signing","ddu-contract-article4"],["area-mismatch","ddu-contract-article4"],["developer-delay","ddu-delay-article6"],["quality-defects","ddu-quality-article7"],["act-acceptance-dispute","ddu-acceptance-article8"]]){
  const context=getRealEstateCheckedContext("newbuild-ddu",scenario);
  assert.equal(context.length,1,scenario);
  assert.equal(context[0].id,id);
  assert.equal(getRealEstateLegalReviewTask("newbuild-ddu",scenario)?.filingReady,false);
}
assert.deepEqual(getRealEstateCheckedContext("newbuild-ddu","developer-bankruptcy"),[]);

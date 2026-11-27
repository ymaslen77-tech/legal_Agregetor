import assert from "node:assert/strict";
import { REAL_ESTATE_CHECKED_CONTEXT,getRealEstateCheckedContext } from "./real-estate-checked-context";
import { getRealEstateLegalReviewTask } from "./real-estate-legal-review";
assert.equal(REAL_ESTATE_CHECKED_CONTEXT.length,16);
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
    "ddu-acceptance-article8":/статьи 8/,
    "boundary-plan-article22":/статьи 22/,
    "boundary-consent-article39":/Статья 39/,
    "boundary-act-article40":/статьи 40/,
    "private-servitude-article274":/статьи 274/,
    "build-notice-article51-1":/Статья 51\.1/,
    "build-simple-article70":/статьи 70/,
    "build-unauthorized-article222":/Статья 222/,
    "build-registration-article40":/Статья 40/
  };
  assert.match(item.proposition,legalArticle[item.id],"Unrecognized context entry "+item.id);
  assert.equal(item.sources.length,3);
  assert.equal(new Set(item.sources.map(x=>x.publisher)).size,3);
  if(item.id.startsWith("registration-")||item.id.startsWith("ddu-")||item.id.startsWith("boundary-")||item.id.startsWith("private-servitude-")||item.id.startsWith("build-"))assert.equal(
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
  assert.equal(context.length,group==="build-renovation"?2:1,group+"/"+situation);
  assert.equal(context[0].id,article);
  assert.equal(getRealEstateLegalReviewTask(group,situation)?.filingReady,false);
}
assert.deepEqual(getRealEstateCheckedContext("none","none"),[]);
console.log("Real estate legal context PASS: 16 contexts, 3 publishers each, 27 covered situations but zero filing approvals");

for(const [scenario,id] of [["ddu-signing","ddu-contract-article4"],["area-mismatch","ddu-contract-article4"],["developer-delay","ddu-delay-article6"],["quality-defects","ddu-quality-article7"],["act-acceptance-dispute","ddu-acceptance-article8"]]){
  const context=getRealEstateCheckedContext("newbuild-ddu",scenario);
  assert.equal(context.length,1,scenario);
  assert.equal(context[0].id,id);
  assert.equal(getRealEstateLegalReviewTask("newbuild-ddu",scenario)?.filingReady,false);
}
assert.deepEqual(getRealEstateCheckedContext("newbuild-ddu","developer-bankruptcy"),[]);

for(const group of ["land-boundaries","neighbors-servitudes"]){
  const expected=group==="land-boundaries"?["boundary-survey","neighbor-boundary-dispute","boundary-overlap","boundary-approval","registry-boundary-error","land-access"]:["blocked-drive","servitude-agreement","utilities-neighbor"];
  for(const scenario of expected){
    const context=getRealEstateCheckedContext(group,scenario);
    assert.ok(context.length>0,scenario);
    assert.equal(getRealEstateLegalReviewTask(group,scenario)?.filingReady,false);
  }
}
assert.equal(getRealEstateCheckedContext("land-boundaries","registry-boundary-error").length,2);

for(const scenario of ["house-notification","reconstruction-docs","unauthorized-building","demolition-order","unfinished-property","building-register-refusal"]){
  assert.ok(getRealEstateCheckedContext("build-renovation",scenario).length>0,scenario);
  assert.equal(getRealEstateLegalReviewTask("build-renovation",scenario)?.filingReady,false);
}

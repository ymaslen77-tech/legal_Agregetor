import assert from "node:assert/strict";
import { REAL_ESTATE_CHECKED_CONTEXT,getRealEstateCheckedContext } from "./real-estate-checked-context";
import { getRealEstateLegalReviewTask } from "./real-estate-legal-review";
assert.equal(REAL_ESTATE_CHECKED_CONTEXT.length,42);
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
    "build-registration-article40":/Статья 40/,
    "share-use-article247":/Статья 247/,
    "share-cost-article249":/Статья 249/,
    "share-division-article252":/Статья 252/,
    "transaction-protection-551":/Статья 551/,
    "transaction-protection-556":/Статья 556/,
    "transaction-protection-486":/Статья 486/,
    "transaction-protection-460":/Статья 460/,
    "transaction-protection-429":/Статья 429/,
    "transaction-protection-167":/Статья 167/,
    "transaction-protection-8.1":/Статья 8\.1/,
    "transaction-protection-14":/Статья 14/,
    "transaction-protection-301":/Статья 301/,
    "transaction-protection-304":/Статья 304/,
    "transaction-protection-1064":/Статья 1064/,
    "land-vri-14.1":/Статья 14\.1/,
    "land-zone-56":/Статья 56/,
    "land-lease-39.6":/Статья 39\.6/,
    "land-redistribution-39.28":/Статья 39\.28/,
    "land-agricultural-8":/Статья 8/,
    "land-withdrawal-49":/Статья 49/,
    "valuation-error-21":/Статья 21/,
    "valuation-market-22.1":/Статья 22\.1/,
    "developer-bankruptcy-201.4":/Статья 201\.4/,
    "property-lease-606":/Статья 606/,
    "civil-procedure-30":/Статья 30/,
    "registration-appeal-2026":/статьи 29/
  };
  assert.match(item.proposition,legalArticle[item.id],"Unrecognized context entry "+item.id);
  assert.equal(item.sources.length,3);
  assert.equal(new Set(item.sources.map(x=>x.publisher)).size,3);
  if(item.id.startsWith("registration-")||item.id.startsWith("ddu-")||item.id.startsWith("boundary-")||item.id.startsWith("private-servitude-")||item.id.startsWith("build-")||item.id.startsWith("transaction-protection-")||(item.id.startsWith("share-")&&item.id!=="share-sale-preemption"))assert.equal(
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
  assert.equal(context.length,group==="build-renovation"||situation.includes("suspension")?2:1,group+"/"+situation);
  assert.equal(context[0].id,article);
  assert.equal(getRealEstateLegalReviewTask(group,situation)?.filingReady,false);
}
assert.deepEqual(getRealEstateCheckedContext("none","none"),[]);
console.log("Real estate legal context PASS: 42 contexts, 3 publishers each, 60 covered situations but zero filing approvals");

for(const [scenario,id] of [["ddu-signing","ddu-contract-article4"],["area-mismatch","ddu-contract-article4"],["developer-delay","ddu-delay-article6"],["quality-defects","ddu-quality-article7"],["act-acceptance-dispute","ddu-acceptance-article8"]]){
  const context=getRealEstateCheckedContext("newbuild-ddu",scenario);
  assert.equal(context.length,1,scenario);
  assert.equal(context[0].id,id);
  assert.equal(getRealEstateLegalReviewTask("newbuild-ddu",scenario)?.filingReady,false);
}
assert.equal(getRealEstateCheckedContext("newbuild-ddu","developer-bankruptcy")[0]?.id,"developer-bankruptcy-201.4");

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

for(const scenario of ["use-arrangement","shared-costs","share-division","compensation-share"]){
  assert.ok(getRealEstateCheckedContext("shared-ownership",scenario).length>0,scenario);
  assert.equal(getRealEstateLegalReviewTask("shared-ownership",scenario)?.filingReady,false);
}
assert.equal(getRealEstateCheckedContext("shared-ownership","compensation-share").length,2);

for(const key of ["ownership-register/ownership-transfer","property-transactions/prepurchase-check","property-transactions/seller-no-transfer","property-transactions/buyer-payment-delay","property-transactions/hidden-encumbrance","property-transactions/preliminary-contract","property-transactions/invalidate-property-deal","ownership-register/encumbrance-record","property-litigation/contested-register-right","ownership-register/title-documents","shared-ownership/share-registration","cadastral-valuation/object-no-record","property-litigation/recognition-of-right","property-litigation/property-recovery","property-litigation/property-obstacle","neighbors-servitudes/fence-dispute","neighbors-servitudes/water-runoff","neighbors-servitudes/damage-neighbor-build"]){
  const [group,scenario]=key.split("/");
  assert.ok(getRealEstateCheckedContext(group,scenario).length>0,key);
  assert.equal(getRealEstateLegalReviewTask(group,scenario)?.filingReady,false,key);
}

for(const key of ["land-status-use/land-permitted-use","land-status-use/land-zone-limit","land-status-use/public-land-lease","land-status-use/land-redistribution","land-status-use/agricultural-plot","land-status-use/land-withdrawal","cadastral-valuation/cadastral-value-check","cadastral-valuation/cadastral-value-challenge","newbuild-ddu/developer-bankruptcy","property-litigation/property-lease-dispute","property-litigation/civil-court-procedure"]){
  const [group,scenario]=key.split("/");
  const context=getRealEstateCheckedContext(group,scenario);
  assert.ok(context.length>0,key);
  for(const entry of context)assert.equal(new Set(entry.sources.map(s=>new URL(s.url).hostname)).size,3,key);
  assert.equal(getRealEstateLegalReviewTask(group,scenario)?.filingReady,false,key);
}

for(const [group,scenario] of [["ownership-register","suspension-registration"],["cadastral-valuation","cadastre-suspension"]]){
  const entry=getRealEstateCheckedContext(group,scenario).find(x=>x.id==="registration-appeal-2026");
  assert.ok(entry);
  assert.match(entry.proposition,/15 рабочих дней/);
  assert.match(entry.limitations,/до 01\.01\.2026/);
  assert.match(entry.limitations,/окончательному отказу/);
}
assert.ok(!getRealEstateCheckedContext("ownership-register","registration-refusal").some(x=>x.id==="registration-appeal-2026"));

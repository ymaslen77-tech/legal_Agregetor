import assert from "node:assert/strict";
import { getQnaLegalArea } from "@/data/legal-qna-taxonomy";
import {
  REAL_ESTATE_BASELINE, REAL_ESTATE_GROUPS,
  REAL_ESTATE_SOURCE_FAMILIES, REAL_ESTATE_PUBLICATION_GATE,
  getRealEstateGroup, getRealEstateSituation, getRealEstatePlanStats
} from "./real-estate-route-plan";

const area=getQnaLegalArea("real-estate");
assert.equal(area.baselineQuestions,12220);
assert.equal(area.navigatorCategorySlug,null);
assert.equal(REAL_ESTATE_BASELINE.questionCount,area.baselineQuestions);
assert.equal(REAL_ESTATE_BASELINE.trafficMetric,false);
assert.equal(REAL_ESTATE_BASELINE.expertVerifiedCaseCount,null);
assert.deepEqual(REAL_ESTATE_PUBLICATION_GATE,{
  stage:"DESIGN_ONLY",
  publicNavigatorEnabled:false,
  publicUrlsEnabled:false,
  documentGenerationAllowed:false,
  filingReady:false,
  indexable:false,
  perClaimReview:"PENDING_THREE_INDEPENDENT_SOURCES",
  sourceVersionReview:"PENDING_EFFECTIVE_OFFICIAL_TEXT",
  personalDataCollectionAllowed:false
});
assert.equal(REAL_ESTATE_GROUPS.length,10);
const ids=new Set<string>(),groupIds=new Set<string>();
let elevated=0,links=0;
for(const group of REAL_ESTATE_GROUPS){
  assert.match(group.id,/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  assert.ok(!groupIds.has(group.id));
  groupIds.add(group.id);
  assert.equal(group.situations.length,6,group.id);
  assert.ok(group.sourceKeys.length>=2);
  assert.ok(group.sourceKeys.every(key=>Object.hasOwn(REAL_ESTATE_SOURCE_FAMILIES,key)));
  assert.ok(group.specificFacts.length>=3);
  assert.equal(getRealEstateGroup(group.id)?.id,group.id);
  for(const s of group.situations){
    const key=group.id+"/"+s.id;
    assert.ok(!ids.has(key),key);
    ids.add(key);
    assert.match(s.id,/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.ok(s.title.length>18,key);
    assert.ok(s.caseFacts.length>=12,key);
    assert.equal(getRealEstateSituation(group.id,s.id)?.title,s.title);
    if(s.risk!=="standard")elevated++;
    if(s.crossLinkArea){links++;assert.equal(s.targetResult,"CROSS_LINK",key);}
    assert.ok(!s.title.toLowerCase().includes("гарантирован"),key);
  }
}
assert.equal(ids.size,60);
assert.ok(elevated>=45);
assert.ok(links>=2);
assert.equal(getRealEstateGroup("wrong"),null);
assert.equal(getRealEstateSituation("shared-ownership","wrong"),null);
assert.deepEqual(getRealEstatePlanStats(),{
  groups:10,situations:60,crossLinks:links,baselineQna:12220,
  publicNavigatorEnabled:false,documentsReady:0
});
console.log("Real estate design PASS: 10 groups, 60 unique draft-only situations, 12,220 historical Q&A, no public release");

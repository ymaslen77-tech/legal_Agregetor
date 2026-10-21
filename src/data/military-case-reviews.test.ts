import assert from "node:assert/strict";
import {MILITARY_ROUTES,MILITARY_SOURCES} from "@/data/military-route-plans";
import {MILITARY_CASE_REVIEWS,getMilitaryCaseReview} from "@/data/military-case-reviews";
assert.equal(MILITARY_CASE_REVIEWS.length,18);
const keys=new Set<string>();
for(const route of MILITARY_ROUTES)for(const scenario of route.scenarios){
 const id=route.id+"/"+scenario.key;
 assert.ok(!keys.has(id));keys.add(id);
 const review=getMilitaryCaseReview(route.id,scenario.key);
 assert.equal(review.id,id);
 assert.equal(review.expertSignOff,"NOT_GRANTED");
 assert.equal(review.reviewState,"PENDING_PRIMARY_TEXT_AND_CASE_SCOPE");
 assert.ok(review.scopeToCheck.length>30);
 assert.ok(review.standingToCheck.length>20);
 assert.ok(review.timeToCheck.length>25);
 assert.ok(review.addresseeToCheck.length>20);
 assert.ok(review.exclusionToCheck.length>25);
 assert.ok(review.evidenceToCheck.length>0);
 assert.ok(review.sourceIds.every(x=>scenario.sources.includes(x)&&Boolean(MILITARY_SOURCES[x])));
}
assert.throws(()=>getMilitaryCaseReview("unknown","case"),/not registered/);
assert.equal(keys.size,18);
console.log("18 individualized military legal case reviews, source coverage, specific exclusions and sign-off gates PASS");

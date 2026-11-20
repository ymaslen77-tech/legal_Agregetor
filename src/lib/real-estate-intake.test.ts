import assert from "node:assert/strict";
import { REAL_ESTATE_GROUPS, getRealEstatePlanStats } from "@/data/real-estate-route-plan";
import { getRealEstateIntakeSpec, evaluateRealEstateIntake } from "./real-estate-intake";
let checked=0;
for(const group of REAL_ESTATE_GROUPS) for(const situation of group.situations){
  const key=group.id+"/"+situation.id;
  const spec=getRealEstateIntakeSpec(group.id,situation.id);
  assert.ok(spec,key);
  assert.equal(spec.canGenerateDocument,false);
  assert.equal(spec.legalReviewRequired,true);
  assert.equal(spec.situationTitle,situation.title);
  assert.ok(spec.fields.some(f=>f.key==="caseDetails"&&f.required));
  assert.equal(new Set(spec.fields.map(f=>f.key)).size,spec.fields.length,key);
  const empty=evaluateRealEstateIntake(spec,{});
  assert.equal(empty.status,"NEEDS_DETAILS");
  assert.ok(empty.missing.length>=6);
  assert.equal(empty.documentText,null);
  assert.equal(empty.filingReady,false);
  assert.equal(empty.canGenerateDocument,false);
  const values:Record<string,string>={};
  for(const field of spec.fields){
    values[field.key]=field.kind==="choice"?field.choices![0]:
      field.kind==="date"?"2026-11-01":"Искусственные тестовые факты без персональных данных";
  }
  const complete=evaluateRealEstateIntake(spec,values);
  assert.equal(complete.missing.length,0,key);
  assert.equal(complete.invalid.length,0,key);
  assert.ok(["FACTS_COLLECTED","SPECIALIST_ROUTE"].includes(complete.status));
  assert.equal(complete.documentText,null,key);
  assert.equal(complete.filingReady,false,key);
  const invalid={...values,eventDate:"2026-02-30"};
  const checkedDate=evaluateRealEstateIntake(spec,invalid);
  assert.ok(checkedDate.invalid.includes("eventDate"),key);
  const oversized={...values,summary:"a".repeat(3001)};
  assert.ok(evaluateRealEstateIntake(spec,oversized).invalid.includes("summary"),key);
  checked++;
}
const shareSpec=getRealEstateIntakeSpec("shared-ownership","share-sale");
assert.ok(shareSpec);
for(const key of ["transactionKind","shareNotice","specialLandStatus","noticeEventDate"])
  assert.ok(shareSpec.fields.some(x=>x.key===key),"Missing share-sale branch: "+key);
const sharedAnswers:Record<string,string>={};
for(const field of shareSpec.fields)if(field.required){
  sharedAnswers[field.key]=field.kind==="choice"?field.choices![0]:"Тестовые безличные обстоятельства";
}
sharedAnswers.transactionKind="публичные торги";
sharedAnswers.shareNotice="извещение не направлялось";
sharedAnswers.specialLandStatus="земля сельскохозяйственного назначения";
const sharedCheck=evaluateRealEstateIntake(shareSpec,sharedAnswers);
assert.equal(sharedCheck.status,"FACTS_COLLECTED");
assert.equal(sharedCheck.manualReviewFlags.length,3);
assert.ok(sharedCheck.manualReviewFlags.some(x=>x.includes("Конституционного Суда")));
assert.ok(sharedCheck.manualReviewFlags.some(x=>x.includes("сельскохозяйственного")));
assert.ok(sharedCheck.manualReviewFlags.some(x=>x.includes("извещение")));
for(const [group,caseId] of [
  ["ownership-register","record-inaccurate"],
  ["land-boundaries","registry-boundary-error"],
  ["cadastral-valuation","wrong-object-area"]
]){
  const spec=getRealEstateIntakeSpec(group,caseId);
  assert.ok(spec);
  assert.ok(spec.fields.some(field=>field.key==="registryErrorOrigin"));
  assert.ok(spec.fields.some(field=>field.key==="thirdPartyRights"));
}
assert.equal(checked,getRealEstatePlanStats().situations);
assert.equal(getRealEstateIntakeSpec("bad","bad"),null);
console.log("Real estate intake PASS: 60 case-specific forms, required fields, date checks, privacy-safe draft restrictions");

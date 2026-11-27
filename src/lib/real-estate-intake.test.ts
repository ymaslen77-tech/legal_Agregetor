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
for(const [group,scenario] of [
  ["ownership-register","suspension-registration"],
  ["cadastral-valuation","cadastre-suspension"],
  ["ownership-register","registration-refusal"],
  ["build-renovation","building-register-refusal"]
]){
  const spec=getRealEstateIntakeSpec(group,scenario);
  assert.ok(spec,group+"/"+scenario);
  assert.ok(spec.fields.some(x=>x.key==="registrationDecision"&&x.required));
  assert.ok(spec.fields.some(x=>x.key==="registrationGround"&&!x.required));
  assert.ok(spec.fields.some(x=>x.key==="correctionEvidence"&&x.required));
  assert.ok(spec.fields.some(x=>x.key==="registrationDecisionDate"&&!x.required));
  const values:Record<string,string>={};
  for(const field of spec.fields)if(field.required){
    values[field.key]=field.kind==="choice"?field.choices![0]:
      "Тестовые обезличенные обстоятельства регистрационного производства";
  }
  values.registrationDecision="только статус без текста уведомления";
  if(scenario.includes("refusal"))values.registrationDecision="только статус без текста решения";
  values.correctionEvidence="не знаю";
  values.registrationGround="";
  const result=evaluateRealEstateIntake(spec,values);
  assert.equal(result.invalid.length,0);
  assert.equal(result.missing.length,0);
  assert.ok(result.manualReviewFlags.some(x=>x.includes("статьи 26")),group+"/"+scenario);
  assert.ok(result.manualReviewFlags.some(x=>x.includes("статьи 27")),group+"/"+scenario);
  assert.ok(result.manualReviewFlags.some(x=>x.includes("историю обращений")),group+"/"+scenario);
  assert.ok(spec.fields.some(x=>x.key==="priorSuspension")===scenario.includes("refusal"));
}
assert.equal(checked,getRealEstatePlanStats().situations);
assert.equal(getRealEstateIntakeSpec("bad","bad"),null);
console.log("Real estate intake PASS: 60 case-specific forms, required fields, date checks, privacy-safe draft restrictions");

for(const [scenario,keys] of [["ddu-signing",["dduDraft","dduObject"]],["area-mismatch",["areaEvidence","areaPriceTerms"]],["developer-delay",["dduAmendment","dduTransfer"]],["quality-defects",["defectEvidence","defectStage"]],["act-acceptance-dispute",["acceptanceNotice","acceptanceAct"]]] as const){
  const spec=getRealEstateIntakeSpec("newbuild-ddu",scenario);
  assert.ok(spec,scenario);
  for(const key of keys)assert.ok(spec.fields.some(f=>f.key===key&&f.required),key);
  const values:Record<string,string>={};
  for(const field of spec.fields)if(field.required)values[field.key]=field.kind==="choice"?field.choices![field.choices!.length-1]:"Обезличенные тестовые обстоятельства";
  const result=evaluateRealEstateIntake(spec,values);
  assert.equal(result.invalid.length,0,scenario);
  assert.equal(result.missing.length,0,scenario);
  assert.ok(result.manualReviewFlags.length>0,scenario);
  assert.equal(result.filingReady,false,scenario);
  assert.equal(result.documentText,null,scenario);
}

for(const [caseKey,keys] of [["land-boundaries/boundary-survey",["boundaryRecord","boundaryPlan"]],["land-boundaries/neighbor-boundary-dispute",["boundaryNotice","boundaryObjection"]],["land-boundaries/boundary-overlap",["overlapEvidence","overlapRights"]],["land-boundaries/boundary-approval",["boundaryNotice","boundaryObjection","boundaryAct"]],["land-boundaries/land-access",["accessAlternative","accessAgreement","burdenedLand"]],["neighbors-servitudes/blocked-drive",["accessAlternative","accessAgreement","burdenedLand"]],["neighbors-servitudes/servitude-agreement",["accessAlternative","accessAgreement","burdenedLand"]],["neighbors-servitudes/utilities-neighbor",["accessAlternative","accessAgreement","burdenedLand"]]] as const){
  const [group,scenario]=caseKey.split("/");
  const spec=getRealEstateIntakeSpec(group,scenario);
  assert.ok(spec,caseKey);
  for(const key of keys)assert.ok(spec.fields.some(f=>f.key===key&&f.required),key);
  const values:Record<string,string>={};
  for(const field of spec.fields)if(field.required)values[field.key]=field.kind==="choice"?field.choices![field.choices!.length-1]:"Обезличенные тестовые обстоятельства";
  const result=evaluateRealEstateIntake(spec,values);
  assert.equal(result.invalid.length,0,caseKey);
  assert.equal(result.missing.length,0,caseKey);
  assert.ok(result.manualReviewFlags.length>0,caseKey);
  assert.equal(result.filingReady,false,caseKey);
}

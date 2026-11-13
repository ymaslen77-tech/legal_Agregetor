import assert from "node:assert/strict";
import { CREDIT_DEBT_CHECKED_CONTEXT,getCreditDebtCheckedContext } from "./credit-debt-verified-context";
import { getCreditDebtSkeletonSituation } from "@/lib/credit-debt-full-route";
assert.equal(CREDIT_DEBT_CHECKED_CONTEXT.length,13);
for(const item of CREDIT_DEBT_CHECKED_CONTEXT){
  assert.equal(item.status,"CONTEXT_ONLY_VERIFIED_NOT_SCENARIO_READY");
  assert.ok(["2026-11-10","2026-11-12"].includes(item.asOf));
  assert.ok(item.proposition.length>80);
  assert.ok(item.limitations.length>80);
  assert.ok(item.sources.length>=2);
  assert.ok(new Set(item.sources.map(x=>x.publisher)).size>=2,item.id);
  assert.ok(item.sources.every(x=>new URL(x.url).protocol==="https:"));
  assert.ok(item.sources.some(x=>x.type==="OFFICIAL_EXPLANATION"||x.type==="AUTHORITY_ACT"),item.id);
  assert.ok(item.sources.some(x=>x.type==="LEGAL_TEXT"));
  for(const relation of item.appliesTo){
    const [groupId,situationId]=relation.split("/");
    assert.ok(getCreditDebtSkeletonSituation(groupId,situationId),relation);
    assert.ok(getCreditDebtCheckedContext(groupId,situationId).includes(item));
  }
}
const courtOrderContext=CREDIT_DEBT_CHECKED_CONTEXT.find(item=>item.id==="court-order-objections");
assert.ok(courtOrderContext);
assert.equal(courtOrderContext.asOf,"2026-11-12");
assert.equal(new Set(courtOrderContext.sources.map(x=>x.publisher)).size,3);
assert.match(courtOrderContext.proposition,/десяти дней со дня получения/);
assert.match(courtOrderContext.proposition,/независящим от должника причинам/);
assert.match(courtOrderContext.limitations,/Нельзя автоматически обещать/);
const holidayContext=CREDIT_DEBT_CHECKED_CONTEXT.find(item=>item.id==="consumer-credit-holidays-income");
assert.ok(holidayContext);
assert.match(holidayContext.officialTextPriorityNote??"",/более чем на 30/);
assert.match(holidayContext.officialTextPriorityNote??"",/FAQ Банка России/);
assert.match(holidayContext.officialTextPriorityNote??"",/Ровно 30% не означает/);
assert.ok(!getCreditDebtCheckedContext("bankruptcy","bankruptcy-court").some(x=>x.id==="mfc-debt-range"),
  "MFC range does not automatically qualify judicial bankruptcy");
assert.ok(getCreditDebtCheckedContext("mortgage","mortgage-holidays").some(x=>x.id==="mortgage-holiday-special"),
  "Mortgage-specific legal context must be present");
assert.ok(!getCreditDebtCheckedContext("mortgage","mortgage-holidays").some(x=>x.id==="consumer-credit-holidays-income"),
  "Ordinary consumer holiday threshold must not be misapplied to mortgage");
for(const id of ["bankruptcy-court-debtor-no-duty-2026","bankruptcy-court-deposit-2026","mfc-bankruptcy-unlisted-creditors"]){
  const item=CREDIT_DEBT_CHECKED_CONTEXT.find(x=>x.id===id);
  assert.ok(item,id);
  assert.equal(item.asOf,"2026-11-12");
  assert.equal(item.sources.length,3,id);
  assert.equal(new Set(item.sources.map(x=>x.publisher)).size,3,id);
  assert.equal(item.status,"CONTEXT_ONLY_VERIFIED_NOT_SCENARIO_READY");
}
assert.ok(getCreditDebtCheckedContext("bankruptcy","bankruptcy-court").some(x=>x.id==="bankruptcy-court-deposit-2026"));
assert.ok(getCreditDebtCheckedContext("bankruptcy","out-of-court-mfc").some(x=>x.id==="mfc-bankruptcy-unlisted-creditors"));
console.log("Credit/debt independent source context PASS: 13 contextual principles; three 2026 bankruptcy checks have 3 sources; no release approval.");

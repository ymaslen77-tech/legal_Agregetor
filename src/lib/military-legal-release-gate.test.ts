import assert from "node:assert/strict";
import {MILITARY_ROUTES} from "@/data/military-route-plans";
import {MILITARY_ACCEPTANCE_CHECKS,reviewMilitaryAcceptance,auditMilitaryAcceptance,type MilitaryAcceptanceRecord} from "./military-legal-release-gate";
const all=MILITARY_ROUTES.flatMap(r=>r.scenarios.map(s=>r.id+"/"+s.key));
assert.equal(all.length,18);
assert.equal(MILITARY_ACCEPTANCE_CHECKS.length,11);
for(const scenarioId of all){
 const empty=reviewMilitaryAcceptance({scenarioId,checks:{}});
 assert.equal(empty.approved,false);
 assert.ok(empty.reasons.length>=12);
}
const goodText="Полный экспертный протокол с проверкой документа, источника, срока, адресата и исключений.";
const apparentlyComplete:MilitaryAcceptanceRecord={
 scenarioId:all[0],
 checks:Object.fromEntries(MILITARY_ACCEPTANCE_CHECKS.map(k=>[k,{
  status:"PASS",rationale:goodText,verifiedAt:"2026-10-22T08:00:00Z",
  evidenceUrls:["https://www.vsrf.ru/documents/all/8382"]
 }])),
 signOff:{reviewerName:"Тестовый эксперт",reviewerRole:"Юрист-рецензент",signedAt:"2026-10-22T08:00:00Z",sourceCommit:"a".repeat(40)}
};
assert.equal(reviewMilitaryAcceptance(apparentlyComplete).approved,false,"raw unverified checklist must never publish");
assert.ok(reviewMilitaryAcceptance(apparentlyComplete).reasons.some(r=>r.includes("feature gate")));
const missing={...apparentlyComplete,checks:{...apparentlyComplete.checks,expertSignOff:{status:"FAIL" as const,rationale:goodText,verifiedAt:"2026-10-22T08:00:00Z",evidenceUrls:["https://www.vsrf.ru/documents/all/8382"]}}};
assert.ok(reviewMilitaryAcceptance(missing).reasons.some(r=>r.includes("expertSignOff")));
const duplicate=auditMilitaryAcceptance([apparentlyComplete,apparentlyComplete]);
assert.equal(duplicate.approved,false);
assert.deepEqual(duplicate.duplicates,[all[0]]);
const unknown=reviewMilitaryAcceptance({...apparentlyComplete,scenarioId:"unregistered/route"});
assert.ok(unknown.reasons.includes("unknown scenario"));
assert.equal(auditMilitaryAcceptance(all.map(scenarioId=>({scenarioId,checks:{}}))).approved,false);
console.log("Military legal release gate: 18 routes protected, 11 evidence gates, duplicate and forged sign-offs blocked");

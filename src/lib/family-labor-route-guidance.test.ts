import assert from "node:assert/strict";
import { FAMILY_LABOR_PLANS } from "@/data/family-labor-route-expansion";
import { getFamilyLaborGuidance } from "@/lib/family-labor-route-guidance";

const pick=(id:string)=>{const plan=FAMILY_LABOR_PLANS.find(x=>x.id===id);assert.ok(plan,id);return plan;};
let checked=0;
for(const plan of FAMILY_LABOR_PLANS.filter(x=>x.kind!=="CROSS_AREA_LINK")){
  for(const scenario of plan.scenarios){
    checked++;
    const incomplete=getFamilyLaborGuidance(plan,scenario.key,{});
    assert.equal(incomplete.legalOutcomeApproved,false);
    assert.equal(incomplete.filingReady,false);
    assert.equal(incomplete.documentGenerationAllowed,false);
    assert.equal(incomplete.draftDocument,null);
    assert.ok(incomplete.guidance.length>0);
    assert.ok(incomplete.verificationSources.length>0);
    if(!scenario.emergencyFirst)assert.ok(incomplete.missing.length>0);
    else assert.equal(incomplete.missing.length,0);
  }
}
const order=pick("alimony-order-objections");
const orderGuide=getFamilyLaborGuidance(order,"objections",{});
assert.ok(orderGuide.guidance.some(line=>line.includes("10 дней")&&line.includes("получения")));
assert.ok(orderGuide.guidance.some(line=>line.includes("просроч")));
assert.equal(orderGuide.legalOutcomeApproved,false);
const penalty=pick("alimony-penalty");
const penaltyGuide=getFamilyLaborGuidance(penalty,"penalty",{});
assert.ok(penaltyGuide.guidance.some(line=>line.includes("вину")));
assert.ok(penaltyGuide.guidance.some(line=>line.includes("не рассчитывается")));
const bailiff=getFamilyLaborGuidance(pick("alimony-enforcement"),"inaction",{});
assert.ok(bailiff.verificationSources.some(x=>x.url.includes("minjust.gov.ru")));
const safety=getFamilyLaborGuidance(pick("family-emergency-safety"),"immediate-danger",{});
assert.equal(safety.statusLabel,"ЭКСТРЕННЫЙ ПОРЯДОК ДЕЙСТВИЙ");
assert.equal(safety.dataComplete,true);
assert.ok(safety.guidance.some(x=>x.includes("112")));
const cohabitation=getFamilyLaborGuidance(pick("cohabitation-property"),"ownership",{});
assert.ok(cohabitation.guidance.some(x=>x.includes("нельзя автоматически")));
const pregnancy=getFamilyLaborGuidance(pick("maternity-leave"),"leave",{});
assert.ok(pregnancy.guidance.some(x=>x.includes("разные")));
assert.throws(()=>getFamilyLaborGuidance(order,"unknown",{}));
const orderLate= getFamilyLaborGuidance(order,"objections",{
  role:"другая сторона",event:"Приказ",dates:"Дата обращения",evidence:"Уведомление",
  outcome:"Отмена",receipt:"Получено",order:"Мировой судья",roleInOrder:"должник",isLate:"да"
});
assert.equal(orderLate.dataComplete,false,"late objection requires a reason");
assert.ok(orderLate.missing.includes("lateReason"));
const orderClaimant=getFamilyLaborGuidance(order,"objections",{roleInOrder:"взыскатель"});
assert.ok(orderClaimant.guidance.some(x=>x.includes("относятся к должнику")));
const penaltyAgreement=getFamilyLaborGuidance(penalty,"penalty",{instrument:"нотариальное соглашение",fault:"не знаю"});
assert.ok(penaltyAgreement.guidance.some(x=>x.includes("ставку ответственности")));
assert.ok(penaltyAgreement.guidance.some(x=>x.includes("вины не подтверждены")));
const mandatoryPartTime=getFamilyLaborGuidance(pick("part-time-hours"),"schedule",{mandatoryBasis:"беременность"});
assert.ok(mandatoryPartTime.guidance.some(line=>line.includes("пяти рабочих дней")));
const ordinaryPartTime=getFamilyLaborGuidance(pick("part-time-hours"),"schedule",{mandatoryBasis:"по соглашению"});
assert.ok(ordinaryPartTime.guidance.some(line=>line.includes("не применяется автоматически")));
const notOpened=getFamilyLaborGuidance(pick("alimony-enforcement"),"inaction",{proceedingOpened:"нет"});
assert.ok(notOpened.guidance.some(x=>x.includes("не возбуждено")));

console.log("Preview guidance: "+checked+" guarded scenarios; no filing or document generation enabled.");

import assert from "node:assert/strict";
import { FAMILY_LABOR_PLANS } from "@/data/family-labor-route-expansion";
import { canBuildFamilyLaborDraft, createProvisionalFamilyLaborDraft, SUPPORTED_PROVISIONAL_DRAFTS } from "@/lib/family-labor-provisional-draft";
import { createFamilyLaborDocument } from "@/lib/family-labor-document-result";
import { getLegalRouteRegistry } from "@/data/legal-route-standard";
import { familyLaborCategory, getFamilyLaborRouteSlug, getFamilyLaborRegistryScenarioKey } from "@/data/family-labor-implemented-routes";
import { getNavigatorDocument } from "@/data/documents";
import { validateSavedDocument } from "@/lib/saved-document-validation";
const ids = {versionId:"11111111-1111-4111-8111-111111111111",createdAt:"2026-10-16T10:00:00.000Z"};
const plans=new Map(FAMILY_LABOR_PLANS.map(plan=>[plan.id,plan]));
const registry=getLegalRouteRegistry();
let checked=0;
for(const key of SUPPORTED_PROVISIONAL_DRAFTS){
  const [planId,scenarioKey]=key.split("/");
  const plan=plans.get(planId);
  assert.ok(plan,planId);
  const values:Record<string,string>={};
  for(const f of plan.fields)values[f.key]=f.options?(f.options.includes("нет")?"нет":f.options[0]):"Сведения из приложенных документов";
  values.role="заявитель";
  if(planId==="alimony-order-objections"){values.roleInOrder="должник";values.isLate="нет";}
  if(planId==="unpaid-leave")values.leaveGround="по соглашению сторон";
  if(planId==="part-time-hours")values.mandatoryBasis="по соглашению";
  if(planId==="maternity-leave")values.leaveType="беременность и роды";
  if(planId==="shifts-and-business-trips")values.mode="командировка";
  if(planId==="secondary-employment")values.mode="совмещение";
  if(planId==="alimony-enforcement"){values.partyStatus="взыскатель";values.proceedingOpened="да";}
  if(planId==="secondary-employment")values.mode="совмещение";
  assert.equal(canBuildFamilyLaborDraft(plan,scenarioKey,values),true,key);
  const document=createFamilyLaborDocument(plan,scenarioKey,values,ids).result;
  const draft=createProvisionalFamilyLaborDraft(plan,scenarioKey,values);
  assert.ok(draft,key);
  assert.equal(document.resultKind,"DRAFT",key);
  assert.equal(document.filingReady,false);
  assert.equal(document.legalRegistryReviewedAt,null);
  assert.equal(document.requiresLegalReview,true);
  assert.equal(document.source,"DETERMINISTIC");
  assert.ok(document.documentText.includes("ПРОЕКТ — НЕ ГОТОВ К ПОДАЧЕ"),key);
  assert.deepEqual(document.usedRuleIds,draft.ruleIds);
  assert.ok(document.usedRuleIds.length>0);
  assert.ok(document.usedRuleIds.every(x=>draft.references.some(r=>r.id===x)));
  assert.ok(draft.references.every(x=>x.sourceUrl.startsWith("https://pravo.gov.ru/")));
  assert.ok(document.placeholders.length>=3);
  assert.ok(document.documentText.includes("Сведения из приложенных документов"));
  assert.ok(validateSavedDocument(document),key);
  const route=registry.find(x=>x.categorySlug===familyLaborCategory(plan)&&x.problemSlug===getFamilyLaborRouteSlug(plan));
  assert.ok(route);
  const registryScenario=route.scenarios.find(x=>x.key===getFamilyLaborRegistryScenarioKey(plan,scenarioKey));
  assert.equal(registryScenario?.outcome,"DRAFT");
  const navDocument=getNavigatorDocument(document.documentSlug);
  assert.equal(navDocument?.resultKind,"DRAFT");
  checked++;
  if(planId==="alimony-order-objections"){
    for(const invalid of [
      {...values,roleInOrder:"взыскатель"},
      {...values,isLate:"да",lateReason:"Получено поздно"},
      {...values,isLate:"не знаю"}
    ]){
      assert.equal(canBuildFamilyLaborDraft(plan,scenarioKey,invalid),false);
      assert.equal(createFamilyLaborDocument(plan,scenarioKey,invalid,ids).result.resultKind,"CHECKLIST");
    }
  } else {
    const other={...values,role:"другая сторона"};
    assert.equal(canBuildFamilyLaborDraft(plan,scenarioKey,other),false);
    assert.equal(createFamilyLaborDocument(plan,scenarioKey,other,ids).result.resultKind,"CHECKLIST");
  }
  if(planId==="unpaid-leave"){
    assert.equal(canBuildFamilyLaborDraft(plan,scenarioKey,{...values,leaveGround:"не знаю"}),false);
    assert.equal(createFamilyLaborDocument(plan,scenarioKey,{...values,leaveGround:"не знаю"},ids).result.resultKind,"CHECKLIST");
    const emergencyLeave={...values,leaveGround:"чрезвычайная ситуация: нарушение условий жизнедеятельности и утрата имущества"};
    assert.equal(canBuildFamilyLaborDraft(plan,scenarioKey,emergencyLeave),false);
    const result=createFamilyLaborDocument(plan,scenarioKey,emergencyLeave,ids).result;
    assert.equal(result.resultKind,"CHECKLIST");
    assert.equal(result.filingReady,false);
    assert.equal(result.legalRegistryReviewedAt,null);
  }
  if(planId==="part-time-hours")
    assert.equal(canBuildFamilyLaborDraft(plan,scenarioKey,{...values,mandatoryBasis:"не знаю"}),false);
  if(planId==="maternity-leave")
    assert.equal(canBuildFamilyLaborDraft(plan,scenarioKey,{...values,leaveType:"уход за ребёнком"}),false);
  if(planId==="alimony-enforcement"){
    for(const invalid of [{...values,proceedingOpened:"нет"},{...values,partyStatus:"представитель"},{...values,partyStatus:"не знаю"}]){
      assert.equal(canBuildFamilyLaborDraft(plan,scenarioKey,invalid),false);
      assert.equal(createFamilyLaborDocument(plan,scenarioKey,invalid,ids).result.resultKind,"CHECKLIST");
    }
    assert.ok(document.documentText.includes("не является жалобой")||
      document.documentText.includes("не является иском"));
  }
  if(planId==="shifts-and-business-trips"){
    assert.equal(canBuildFamilyLaborDraft(plan,scenarioKey,{...values,mode:"не знаю"}),false);
    assert.equal(createProvisionalFamilyLaborDraft(plan,scenarioKey,{...values,mode:"не знаю"}),null);
  }
  if(planId==="maternity-leave" && scenarioKey==="benefits"){
    assert.equal(canBuildFamilyLaborDraft(plan,scenarioKey,{...values,leaveType:"уход за ребёнком"}),false);
  }
  if(planId==="secondary-employment"){
    if(scenarioKey==="payment"){
      assert.equal(canBuildFamilyLaborDraft(plan,scenarioKey,{...values,mode:"совместительство"}),false);
      assert.equal(createFamilyLaborDocument(plan,scenarioKey,{...values,mode:"совместительство"},ids).result.resultKind,"CHECKLIST");
    }else{
      assert.equal(canBuildFamilyLaborDraft(plan,scenarioKey,{...values,mode:"совместительство"}),true);
      const other=createProvisionalFamilyLaborDraft(plan,scenarioKey,{...values,mode:"совместительство"});
      assert.ok(other?.text.includes("самостоятельном трудовом договоре"));
      assert.ok(!other?.text.includes("совмещение, какой"));
    }
  }
}
assert.equal(checked,14);
const safety=plans.get("family-emergency-safety");
assert.ok(safety);
assert.equal(createProvisionalFamilyLaborDraft(safety,"immediate-danger",{}),null);
const penalty=plans.get("alimony-penalty");
assert.ok(penalty);
assert.equal(createProvisionalFamilyLaborDraft(penalty,"penalty",{}),null);
console.log("Fourteen provisional legal drafts: source IDs, archive, safe branches and downgrade tests passed.");

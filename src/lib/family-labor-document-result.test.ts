import assert from "node:assert/strict";
import {FAMILY_LABOR_PLANS} from "@/data/family-labor-route-expansion";
import {FAMILY_LABOR_NEW_ROUTES,FAMILY_LABOR_NEW_PROBLEMS,
  familyLaborCategory,getFamilyLaborRouteSlug,getFamilyLaborDocumentSlug,getFamilyLaborDocumentMatch,
  getFamilyLaborRegistryScenarioKey} from "@/data/family-labor-implemented-routes";
import {FAMILY_LABOR_NEW_DOCUMENTS} from "@/data/family-labor-route-documents";
import {createFamilyLaborChecklist} from "@/lib/family-labor-document-result";
import {getLegalRouteRegistry} from "@/data/legal-route-standard";
import {getNavigatorDocument} from "@/data/documents";
import {validateSavedDocument} from "@/lib/saved-document-validation";

const registered=getLegalRouteRegistry();
const canonical=new Set(registered.map(x=>x.categorySlug+"/"+x.problemSlug));
assert.equal(registered.length,51);
assert.equal(FAMILY_LABOR_NEW_ROUTES.length,8);
assert.equal(FAMILY_LABOR_NEW_PROBLEMS.length,8);
assert.equal(registered.filter(x=>x.source==="family-labor-new").length,8);
assert.equal(registered.filter(x=>x.source!=="family-labor-new").length,43);
for(const plan of FAMILY_LABOR_NEW_ROUTES){
  const slug=getFamilyLaborRouteSlug(plan);
  assert.ok(canonical.has(familyLaborCategory(plan)+"/"+slug));
}
let generated=0;
for(const plan of FAMILY_LABOR_PLANS){
  if(plan.kind==="CROSS_AREA_LINK")continue;
  const route=registered.find(x=>x.categorySlug===familyLaborCategory(plan)&&
    x.problemSlug===getFamilyLaborRouteSlug(plan));
  assert.ok(route,plan.id);
  for(const scenario of plan.scenarios){
    const documentSlug=getFamilyLaborDocumentSlug(plan,scenario.key);
    const registryKey=getFamilyLaborRegistryScenarioKey(plan,scenario.key);
    const registryScenario=route.scenarios.find(x=>x.key===registryKey);
    assert.ok(registryScenario,plan.id+"/"+scenario.key);
    assert.equal(registryScenario.documentSlug,documentSlug);
    if(!documentSlug){
      assert.equal(scenario.emergencyFirst,true);
      assert.equal(registryScenario.outcome,"URGENT_INSTRUCTION");
      assert.throws(()=>createFamilyLaborChecklist(plan,scenario.key,{},{
        versionId:"11111111-1111-4111-8111-111111111111",
        createdAt:"2026-10-16T07:00:00.000Z"
      }));
      continue;
    }
    assert.ok(getNavigatorDocument(documentSlug),documentSlug);
    const match=getFamilyLaborDocumentMatch(documentSlug);
    assert.ok(match);
    assert.equal(match.plan.id,plan.id);
    assert.equal(match.scenarioKey,scenario.key);
    const values:Record<string,string>={};
    for(const field of plan.fields){
      values[field.key]=field.options?(field.options.includes("нет")?"нет":field.options[0]):"Проверенные обезличенные сведения";
    }
    if(plan.id==="alimony-order-objections")values.isLate="нет";
    assert.throws(()=>createFamilyLaborChecklist(plan,scenario.key,{},{
      versionId:"11111111-1111-4111-8111-111111111111",createdAt:"2026-10-16T07:00:00.000Z"
    }));
    const created=createFamilyLaborChecklist(plan,scenario.key,values,{
      versionId:"11111111-1111-4111-8111-111111111111",
      createdAt:"2026-10-16T07:00:00.000Z"
    }).result;
    assert.equal(created.documentSlug,documentSlug);
    assert.equal(created.scenarioKey,registryKey);
    assert.equal(created.resultKind,"CHECKLIST");
    assert.equal(created.requiresLegalReview,true);
    assert.equal(created.filingReady,false);
    assert.match(created.documentText,/НЕ ГОТОВ К ПОДАЧЕ/);
    assert.ok(created.documentText.includes("Проверенные обезличенные сведения"));
    assert.deepEqual(created.usedRuleIds,[]);
    assert.ok(validateSavedDocument(created),documentSlug+" must be accepted by encrypted cabinet validator");
    assert.equal(validateSavedDocument({...created,filingReady:true}),null);
    generated++;
  }
}
assert.equal(FAMILY_LABOR_NEW_DOCUMENTS.length,generated);
assert.equal(new Set(FAMILY_LABOR_NEW_DOCUMENTS.map(x=>x.slug)).size,generated);
console.log("Family/labor standard: "+registered.length+" routes, "+generated+
  " provisional checklists, all version/save contracts valid, all filing flags false.");

import assert from "node:assert/strict";
import { QNA_LEGAL_AREAS, getQnaCatalogCoverage, getQnaLegalAreaByServiceSlug } from "@/data/legal-qna-taxonomy";
import { PROPOSED_LEGAL_ROUTES, getProposedRoute, getProposedRoutes } from "@/data/legal-route-blueprints";
import { assessProposedRouteInput, proposeRoutesForQna } from "@/lib/legal-qna-route-planning";
import { getUnifiedLegalDevelopmentCatalog, getUnifiedLegalCatalogStats } from "@/data/unified-legal-route-catalog";

const unified=getUnifiedLegalDevelopmentCatalog();
const stats=getUnifiedLegalCatalogStats();
assert.equal(stats.areas,19);
assert.equal(stats.legacyServices,76);
assert.equal(stats.baselineQuestions,171643);
assert.equal(stats.existingRoutes,43);
assert.equal(stats.existingScenarios,170);
assert.equal(stats.proposedRoutes,24);
assert.equal(stats.proposedScenarios,50);
assert.equal(unified.find(x=>x.areaId==="family")?.currentRoutes.length,29);
assert.equal(unified.find(x=>x.areaId==="labor")?.currentRoutes.length,14);
assert.equal(unified.find(x=>x.areaId==="consumer")?.currentRoutes.length,0);
assert.equal(unified.find(x=>x.areaId==="inheritance")?.publicNavigatorEnabled,false);

const expectedQuestions=171643;
assert.equal(QNA_LEGAL_AREAS.length,19);
assert.equal(getQnaCatalogCoverage().questions,expectedQuestions,"snapshot must reconcile with real Neon source count");
const allServiceSlugs=QNA_LEGAL_AREAS.flatMap(a=>a.sourceServiceSlugs);
assert.equal(allServiceSlugs.length,76,"every legacy service should be mapped exactly once");
assert.equal(new Set(allServiceSlugs).size,76,"a question must not be counted twice in distinct areas");
for(const area of QNA_LEGAL_AREAS){
  assert.ok(area.baselineQuestions>=0);
  assert.ok(area.name.trim().length>2);
  for(const slug of area.sourceServiceSlugs)assert.equal(getQnaLegalAreaByServiceSlug(slug)?.id,area.id);
}
assert.equal(getQnaLegalAreaByServiceSlug("service-unknown"),null);
assert.equal(getQnaLegalAreaByServiceSlug("zashchita-prav-potrebitelya")?.id,"consumer");
assert.equal(getQnaLegalAreaByServiceSlug("turizm")?.id,"consumer");
assert.equal(getQnaLegalAreaByServiceSlug("nasledstvo")?.id,"inheritance");
assert.equal(getQnaLegalAreaByServiceSlug("zhkh")?.id,"housing");
assert.equal(QNA_LEGAL_AREAS.find(a=>a.id==="family")?.baselineQuestions,28509);
assert.equal(QNA_LEGAL_AREAS.find(a=>a.id==="labor")?.baselineQuestions,14826);
assert.ok(QNA_LEGAL_AREAS.filter(a=>a.releaseState==="EXISTING_ROUTES").every(a=>a.navigatorCategorySlug!==null));
assert.ok(QNA_LEGAL_AREAS.filter(a=>a.releaseState!=="EXISTING_ROUTES").every(a=>a.navigatorCategorySlug===null));

assert.equal(PROPOSED_LEGAL_ROUTES.length,24);
assert.deepEqual([getProposedRoutes("consumer").length,getProposedRoutes("inheritance").length,
  getProposedRoutes("enforcement").length,getProposedRoutes("housing").length],[6,7,5,6]);
const ids=PROPOSED_LEGAL_ROUTES.map(r=>`${r.areaId}/${r.slug}`);
assert.equal(new Set(ids).size,ids.length);
let scenarioCount=0;
for(const route of PROPOSED_LEGAL_ROUTES) {
  assert.equal(route.sourceVerification,"PENDING_OFFICIAL_TEXT_REVIEW");
  assert.equal(route.generationStatus,"NOT_IMPLEMENTED");
  assert.equal(route.filingReady,false);
  assert.equal(getProposedRoute(route.areaId,route.slug),route);
  assert.ok(route.questionSignals.length>=2);
  assert.ok(route.authoritativeSourcesToVerify.some(s=>s.includes("pravo.gov.ru")));
  const keys=route.fields.map(f=>f.key);
  assert.equal(keys.length,new Set(keys).size,`${route.slug}: duplicate form field`);
  const scenarios=route.scenarios.map(s=>s.key);
  assert.equal(new Set(scenarios).size,scenarios.length,`${route.slug}: duplicate scenario`);
  for(const scenario of route.scenarios) {
    scenarioCount++;
    assert.ok(scenario.requiredFacts.length>=4);
    assert.ok(scenario.requiredFacts.every(key=>keys.includes(key)));
    const empty=assessProposedRouteInput(route,scenario.key,{});
    assert.ok(empty.missingFields.length>=4);
    assert.equal(empty.dataCollectionComplete,false);
    assert.equal(empty.documentGenerationAllowed,false);
    assert.equal(empty.filingReady,false);
    const complete:Record<string,string>={};
    for(const field of route.fields) {
      complete[field.key]=field.type==="choice"?(field.values?.[0]??""):field.type==="date"?"2026-10-15":"Подтверждённые синтетические сведения";
    }
    const assessed=assessProposedRouteInput(route,scenario.key,complete);
    assert.equal(assessed.dataCollectionComplete,true);
    assert.equal(assessed.requiresLegalReview,true);
    assert.equal(assessed.documentGenerationAllowed,false,"a complete draft questionnaire cannot bypass legal review");
    assert.equal(assessed.filingReady,false);
  }
}
assert.ok(scenarioCount>=48);

assert.ok(proposeRoutesForQna({
  serviceSlug:"zashchita-prav-potrebitelya",
  title:"Как вернуть некачественный товар продавцу по гарантии?",
  text:"После покупки обнаружен дефект товара."
}).some(r=>r.routeSlug==="nekachestvennyy-tovar"));
assert.ok(proposeRoutesForQna({
  serviceSlug:"nasledstvo",
  title:"Как восстановить срок наследства, если пропустил оформление?"
}).some(r=>r.routeSlug==="propushchennyy-srok-nasledstva"));
assert.ok(proposeRoutesForQna({
  serviceSlug:"ispolnitelnoe-proizvodstvo",
  title:"Как подать жалобу на пристава за бездействие?"
}).some(r=>r.routeSlug==="zhaloba-na-pristava"));
assert.ok(proposeRoutesForQna({
  serviceSlug:"zhkh",title:"Управляющая компания не реагирует на жалобы"
}).some(r=>r.routeSlug==="upravlyayushchaya-kompaniya"));
assert.deepEqual(proposeRoutesForQna({
  serviceSlug:"voennoe-pravo",title:"Банк просит возврат кредита после суда"
}),[],"a lawyer's service category does not independently establish legal intent");
assert.deepEqual(proposeRoutesForQna({serviceSlug:"nasledstvo",title:"Нужна консультация"}),[],"no strong signal, no guess");
assert.deepEqual(proposeRoutesForQna({serviceSlug:"none",title:"Как вернуть некачественный товар?"}),[]);
console.log(`Q&A taxonomy verified: 19 areas, 76 services, ${expectedQuestions} baseline questions, 24 proposed routes, ${scenarioCount} scenarios; no public or database writes.`);

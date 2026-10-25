import assert from "node:assert/strict";
import {MILITARY_ROUTES,MILITARY_SOURCES,getMilitaryDocumentSlug,getMilitaryRoute} from "@/data/military-route-plans";
import {validateMilitaryIntake,createMilitaryDocumentResult,MILITARY_DRAFT_PURPOSES} from "@/lib/military-document-generator";
import {documentResultSchema} from "@/lib/document-result-contract";

const id="11111111-1111-4111-8111-111111111111",stamp="2026-10-21T00:00:00.000Z";
const kasSource=MILITARY_SOURCES.kas;
assert.equal(kasSource.url,"https://publication.pravo.gov.ru/Document/View/0001201503090041");
assert.equal(kasSource.verification,"PRIMARY_REFERENCE_FOUND_CASE_SCOPE_PENDING");
assert.ok(kasSource.name.includes("действующая редакция"),"a historical primary publication is not a current consolidated text");
assert.ok(Object.values(MILITARY_SOURCES).every(source=>new URL(source.url).pathname!=="/"),"all listed military sources must identify a specific resource");
assert.equal(MILITARY_ROUTES.length,6);
assert.equal(MILITARY_ROUTES.flatMap(r=>r.scenarios).length,18);
assert.equal(Object.keys(MILITARY_DRAFT_PURPOSES).length,17);
const seenSlugs=new Set<string>();
let generated=0,emergencies=0,drafts=0;
for(const route of MILITARY_ROUTES){
 assert.equal(getMilitaryRoute(route.id),route);
 assert.equal(route.publicationApproved,false);
 assert.equal(route.legalRegistryReviewedAt,null);
 assert.equal(route.filingReady,false);
 assert.ok(route.fields.some(x=>x.key==="role"));
 assert.ok(route.fields.some(x=>x.key==="regime"));
 assert.ok(!seenSlugs.has(route.slug));seenSlugs.add(route.slug);
 const keys=new Set();
 for(const scenario of route.scenarios){
  assert.ok(!keys.has(scenario.key));keys.add(scenario.key);
  assert.ok(scenario.sources.length>=2,route.id+"/"+scenario.key+" has no legal registry");
  for(const id of scenario.sources)assert.ok(MILITARY_SOURCES[id]?.url.startsWith("https://"));
  const answers=Object.fromEntries(route.fields.map(f=>[f.key,
    f.key==="urgency"?"нет":f.values?f.values.find(x=>x!=="не знаю")!:"Документы подтверждают событие"]));
  const resultKind=scenario.kind;
  if(resultKind==="URGENT_INSTRUCTION"){
    emergencies++;
    assert.equal(getMilitaryDocumentSlug(route,scenario),null);
    assert.throws(()=>createMilitaryDocumentResult(route,scenario,answers,{versionId:id,createdAt:stamp}),/must not generate/);
    continue;
  }
  const status=validateMilitaryIntake(route,scenario,answers);
  assert.equal(status.complete,true,route.id+"/"+scenario.key+" "+JSON.stringify(status));
  const out=createMilitaryDocumentResult(route,scenario,answers,{versionId:id,createdAt:stamp});
  documentResultSchema.parse(out);
  assert.equal(out.resultKind,"DRAFT","all 17 direct-applicant scenarios must produce a coherent draft");
  assert.ok(out.documentText.includes("С учётом изложенного прошу:"), "draft has a concrete request");
  assert.ok(out.documentText.includes("Подпись:"), "draft has a signature field");
  assert.ok(out.documentText.includes("От: [ФИО"), "draft includes applicant placeholder");
  assert.ok(out.documentText.includes("Кому:"), "draft includes recipient placeholder");
  assert.equal(out.filingReady,false);
  assert.equal(out.requiresLegalReview,true);
  assert.equal(out.legalRegistryReviewedAt,null);
  assert.equal(out.versionId,id);
  assert.equal(out.categorySlug,"voennoe-pravo");
  assert.ok(out.documentText.includes("НЕ ГОТОВ К ПОДАЧЕ"));
  assert.ok(out.documentText.includes("провер"));
  assert.ok(!out.documentText.includes("Ваше заявление принято"));
  generated++;
  if(out.resultKind==="DRAFT")drafts++;
  const empty=validateMilitaryIntake(route,scenario,{});
  assert.equal(empty.complete,false);
  assert.ok(empty.missing.length>0);
  assert.throws(()=>createMilitaryDocumentResult(route,scenario,{}, {versionId:id,createdAt:stamp}));
  const unknown={...answers,role:"не знаю"};
  assert.equal(validateMilitaryIntake(route,scenario,unknown).complete,false);
  assert.throws(()=>createMilitaryDocumentResult(route,scenario,unknown,{versionId:id,createdAt:stamp}));
  const oversized={...answers,event:"X".repeat(2001)};
  assert.ok(validateMilitaryIntake(route,scenario,oversized).invalid.includes("event"));
 }
}
const medicalRoute=getMilitaryRoute("military-medical")!;
const medicalScenario=medicalRoute.scenarios.find(x=>x.key==="vvk-conclusion")!;
const urgentAnswers=Object.fromEntries(medicalRoute.fields.map(x=>[x.key,x.values?x.values[0]:"Есть документ"]));
urgentAnswers.urgency="да";
assert.equal(validateMilitaryIntake(medicalRoute,medicalScenario,urgentAnswers).complete,false);
assert.throws(()=>createMilitaryDocumentResult(medicalRoute,medicalScenario,urgentAnswers,{versionId:id,createdAt:stamp}),/генерация заблокирована/);
urgentAnswers.urgency="не знаю";
assert.equal(validateMilitaryIntake(medicalRoute,medicalScenario,urgentAnswers).complete,false);
for(const unsupportedRegime of ["добровольческое формирование","военные сборы","мобилизационный людской резерв"]){
 const route=MILITARY_ROUTES[0],scenario=route.scenarios[0];
 const answers=Object.fromEntries(route.fields.map(f=>[f.key,
   f.key==="regime"?unsupportedRegime:f.values?f.values[0]:"Подтверждённые сведения"]));
 assert.equal(validateMilitaryIntake(route,scenario,answers).complete,false,"unsupported special status must block output");
 assert.throws(()=>createMilitaryDocumentResult(route,scenario,answers,{versionId:id,createdAt:stamp}));
}
const conflicts=[
 {role:"призывник",regime:"контракт"},
 {role:"уволенный военнослужащий",regime:"мобилизация"},
 {role:"военнослужащий",regime:"доподготовка к призыву"}
];
for(const conflict of conflicts){
 const route=MILITARY_ROUTES[0],sc=route.scenarios[0];
 const values=Object.fromEntries(route.fields.map(f=>[f.key,f.values?f.values[0]:"Документированное обстоятельство"]));
 Object.assign(values,conflict);
 assert.equal(validateMilitaryIntake(route,sc,values).complete,false,"contradictory military status must fail");
 assert.throws(()=>createMilitaryDocumentResult(route,sc,values,{versionId:id,createdAt:stamp}));
}
const unknownAuthorityRoute=MILITARY_ROUTES[0],unknownAuthorityScenario=unknownAuthorityRoute.scenarios[1];
const draftFacts=Object.fromEntries(unknownAuthorityRoute.fields.map(f=>[f.key,f.values?f.values[0]:"Подтверждённый факт"]));
draftFacts.role="военнослужащий";
draftFacts.regime="контракт";
draftFacts.authority="не знаю";
assert.equal(createMilitaryDocumentResult(unknownAuthorityRoute,unknownAuthorityScenario,draftFacts,{versionId:id,createdAt:stamp}).resultKind,"CHECKLIST");
const requestRoute=MILITARY_ROUTES[0],requestScenario=requestRoute.scenarios[1];
const memberAnswers=Object.fromEntries(requestRoute.fields.map(x=>[x.key,x.values?x.values[0]:"Документированное обращение"]));
memberAnswers.role="член семьи";
const memberResult=createMilitaryDocumentResult(requestRoute,requestScenario,memberAnswers,{versionId:id,createdAt:stamp});
assert.equal(memberResult.resultKind,"CHECKLIST","Representative/family standing must not be auto-assumed for draft");
assert.equal(memberResult.filingReady,false);
assert.equal(generated,17);assert.equal(emergencies,1);assert.equal(drafts,17);
assert.throws(()=>documentResultSchema.parse({...createMilitaryDocumentResult(MILITARY_ROUTES[0],MILITARY_ROUTES[0].scenarios[0],
 Object.fromEntries(MILITARY_ROUTES[0].fields.map(f=>[f.key,f.values?f.values[0]:"Контрольные данные"])),
 {versionId:id,createdAt:stamp}),filingReady:true}),/false/);
console.log("MILITARY: 6 routes, 18 scenarios, 17 preview documents (17 conditional drafts), mandatory inputs, high-risk gates PASS");

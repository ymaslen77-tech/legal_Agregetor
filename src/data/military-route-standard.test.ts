import assert from "node:assert/strict";
import {getMilitaryPreviewRoutes} from "@/data/military-route-standard";
import {getLegalRouteRegistry} from "@/data/legal-route-standard";
import {isMilitaryDocumentFieldRequired} from "@/lib/military-legal-document-generator";
import {MILITARY_LEGAL_DOCUMENTS,MILITARY_LEGAL_FIELDS,getMilitaryDocumentsForScenario} from "@/data/military-legal-documents";
const list=getMilitaryPreviewRoutes();
assert.equal(list.length,6);
assert.equal(getLegalRouteRegistry().length,51,"Military routes are hosted separately from legacy problems registry");
const urls=new Set<string>(),docSlugs=new Set<string>();
let count=0;
for(const route of list){
 assert.equal(route.categorySlug,"voennoe-pravo");
 assert.equal(route.legalReviewedAt,null);
 assert.equal(route.migrationStatus,"ADAPTED_V1");
 assert.equal(route.riskLevel,"high");
 assert.ok(route.problemUrl.startsWith("/voennoe-pravo/"));
 assert.ok(!urls.has(route.problemUrl));urls.add(route.problemUrl);
 assert.ok(route.scenarios.length>=3);
 for(const scenario of route.scenarios){
  assert.equal(scenario.scenarioUrl,route.problemUrl+"?scenario="+encodeURIComponent(scenario.key));
  assert.ok(scenario.inputs.every(field=>field.key&&field.label&&field.required===isMilitaryDocumentFieldRequired(field.key)), "Contract must follow actual document requirements");
  const docs=getMilitaryDocumentsForScenario(scenario.key);
  if(scenario.outcome==="URGENT_INSTRUCTION"){
   assert.equal(scenario.documentSlug,null);assert.equal(scenario.documentUrl,null);
   assert.equal(docs.length,0);
  }else{
   assert.equal(scenario.outcome,"DRAFT");
   assert.equal(scenario.documentSlug,docs[0]?.slug);
   assert.equal(scenario.documentUrl,"/documents/"+scenario.documentSlug+"/");
   assert.ok(!docSlugs.has(scenario.documentSlug!));docSlugs.add(scenario.documentSlug!);
   assert.deepEqual(scenario.inputs.map(x=>x.key),docs[0].fields);
   assert.ok(scenario.inputs.every(x=>MILITARY_LEGAL_FIELDS[x.key]));
  }
  count++;
 }
 for(const slug of route.relatedDocumentSlugs)assert.ok(MILITARY_LEGAL_DOCUMENTS.some(d=>d.slug===slug));
}
assert.equal(count,18);assert.equal(docSlugs.size,17);
assert.equal(new Set(list.flatMap(route=>route.relatedDocumentSlugs)).size,23);
console.log("Military document route standard: 6 routes, 18 situations, 23 actual filings PASS");

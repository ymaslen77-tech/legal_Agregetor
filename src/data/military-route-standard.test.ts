import assert from "node:assert/strict";
import {getMilitaryPreviewRoutes} from "@/data/military-route-standard";
import {getLegalRouteRegistry} from "@/data/legal-route-standard";
const list=getMilitaryPreviewRoutes();
assert.equal(list.length,6);
assert.equal(getLegalRouteRegistry().length,51,"Military development must not change published legacy routes");
const urls=new Set<string>(),docSlugs=new Set<string>();
let count=0;
for(const r of list){
 assert.equal(r.categorySlug,"voennoe-pravo");
 assert.equal(r.legalReviewedAt,null);
 assert.equal(r.migrationStatus,"ADAPTED_V1");
 assert.equal(r.source,"military-preview");
 assert.equal(r.riskLevel,"high");
 assert.ok(!urls.has(r.problemUrl));urls.add(r.problemUrl);
 assert.ok(r.scenarios.length>=3);
 for(const s of r.scenarios){
  assert.equal(s.scenarioUrl,r.problemUrl+"?scenario="+encodeURIComponent(s.key));
  assert.ok(s.inputs.every(f=>f.required&&f.key&&f.label));
  if(s.outcome==="URGENT_INSTRUCTION"){
   assert.equal(s.documentSlug,null);assert.equal(s.documentUrl,null);
  }else{
   assert.ok(s.documentSlug);
   assert.equal(s.documentUrl,"/documents/"+s.documentSlug+"/");
   assert.ok(!docSlugs.has(s.documentSlug!));docSlugs.add(s.documentSlug!);
  }
  count++;
 }
}
assert.equal(count,18);assert.equal(docSlugs.size,17);
console.log("Military internal LEGAL_ROUTE_STANDARD_V1: 6 canonical routes, 18 scenarios, 17 document slugs PASS");

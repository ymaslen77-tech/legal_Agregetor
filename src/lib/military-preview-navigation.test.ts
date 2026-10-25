import assert from "node:assert/strict";
import {MILITARY_ROUTES} from "@/data/military-route-plans";
import {resolveMilitaryPreviewSelection,militaryPreviewHref,militaryPublicHref} from "./military-preview-navigation";
const urls=new Set<string>();
for(const route of MILITARY_ROUTES){
 for(const scenario of route.scenarios){
  const href=militaryPreviewHref(route.id,scenario.key);
  assert.ok(href.startsWith("/internal/military-preview/?"));
  const publicHref=militaryPublicHref(route.id,scenario.key);
  assert.ok(publicHref.startsWith("/voennoe-pravo/marshrut/?"));
  assert.ok(!publicHref.includes("documentText"));
  assert.ok(publicHref.endsWith(href.split("?")[1]));

  assert.ok(!href.includes("documentText"));
  const parsed=new URL(href,"https://preview.invalid");
  const chosen=resolveMilitaryPreviewSelection(parsed.searchParams.get("route")||undefined,
    parsed.searchParams.get("scenario")||undefined);
  assert.equal(chosen.route.id,route.id);
  assert.equal(chosen.scenario.key,scenario.key);
  assert.equal(chosen.invalidSelection,false);
  assert.ok(!urls.has(href)); urls.add(href);
 }
}
assert.equal(urls.size,18);
assert.equal(resolveMilitaryPreviewSelection("unknown","none").invalidSelection,true);
assert.throws(()=>militaryPreviewHref("unregistered"));
assert.throws(()=>militaryPreviewHref(MILITARY_ROUTES[0].id,"unknown"));
assert.throws(()=>militaryPreviewHref(MILITARY_ROUTES[0].id,"medical-emergency"));
console.log("Military review preview: all 18 deep links and URL whitelist PASS");

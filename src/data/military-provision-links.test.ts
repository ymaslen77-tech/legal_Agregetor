import assert from "node:assert/strict";
import { MILITARY_ROUTES } from "./military-route-plans";
import { getMilitaryPinpointLinks, MILITARY_PINPOINT_REFERENCES, MILITARY_SCENARIO_PROVISIONS } from "./military-provision-links";

const ids=MILITARY_ROUTES.flatMap(route=>route.scenarios.map(s=>route.id+"/"+s.key));
assert.equal(ids.length,18);
assert.deepEqual(Object.keys(MILITARY_SCENARIO_PROVISIONS).sort(),[...ids].sort(),"Every scenario must have a legal citation plan");
for(const id of ids){
 const [route,scenario]=id.split("/");
 const refs=getMilitaryPinpointLinks(route,scenario);
 for(const ref of refs){
  assert.equal(ref.checked,true,"Never expose unverified deep links");
  assert.ok(ref.url.startsWith("https://www.consultant.ru/document/cons_doc_LAW_"));
  assert.match(ref.url,/cons_doc_LAW_\d+\/[a-f0-9]{40}\/$/,"The checked link must target a specific provision page");
 }
}
assert.equal(getMilitaryPinpointLinks("military-discharge","discharge-basis").some(x=>x.id==="53-51"),true);
const deferment=getMilitaryPinpointLinks("mobilization-draft","deferment");
assert.ok(deferment.some(x=>x.id==="31-18"),"Mobilization requires its separate deferral law");
assert.ok(deferment.some(x=>x.id==="53-24"),"Ordinary conscription must not be conflated with mobilization");
assert.ok(Object.values(MILITARY_PINPOINT_REFERENCES).some(ref=>!ref.checked),"The source registry must honestly retain pending reviews");
console.log("Military citation integrity: 18 mapped cases and verified-only deeplinks");

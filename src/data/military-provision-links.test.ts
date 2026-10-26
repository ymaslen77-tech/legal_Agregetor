import assert from "node:assert/strict";
import { MILITARY_ROUTES } from "./military-route-plans";
import { getMilitaryPinpointLinks, MILITARY_PINPOINT_REFERENCES, MILITARY_SCENARIO_PROVISIONS } from "./military-provision-links";

const ids=MILITARY_ROUTES.flatMap(route=>route.scenarios.map(s=>route.id+"/"+s.key));
assert.equal(ids.length,18);
assert.deepEqual(Object.keys(MILITARY_SCENARIO_PROVISIONS).sort(),[...ids].sort(),"Every scenario must have a legal citation plan");
for(const id of ids){
 const [route,scenario]=id.split("/");
 const refs=getMilitaryPinpointLinks(route,scenario);
 assert.ok(refs.length>0,"Every scenario must expose a specific source: "+id);
 for(const ref of refs){
  assert.equal(ref.checked,true,"Never expose unverified deep links");
  const officialPlenum=ref.url==="https://vsrf.ru/documents/own/8382/" && ref.id.startsWith("plenum8-");
  assert.ok(officialPlenum||ref.url.startsWith("https://www.consultant.ru/document/cons_doc_LAW_"));
  assert.ok(officialPlenum||/cons_doc_LAW_\d+\/[a-f0-9]{40}\/$/.test(ref.url)||
   Boolean(ref.textFragment&&/cons_doc_LAW_\d+\/$/.test(ref.url)),"Reference must target verified article or official Plenum decision");
 }
}
assert.equal(getMilitaryPinpointLinks("military-discharge","discharge-basis").some(x=>x.id==="53-51"),true);
const deferment=getMilitaryPinpointLinks("mobilization-draft","deferment");
assert.ok(deferment.some(x=>x.id==="31-18"),"Mobilization requires its separate deferral law");
assert.ok(deferment.some(x=>x.id==="53-24"),"Ordinary conscription must not be conflated with mobilization");
const onlyMobilisation=getMilitaryPinpointLinks("mobilization-draft","deferment","мобилизация");
assert.ok(onlyMobilisation.some(x=>x.id==="31-18"));
assert.ok(onlyMobilisation.every(x=>x.id!=="53-24"),"Mobilisation must not cite ordinary draft deferment law");
const onlyOrdinary=getMilitaryPinpointLinks("mobilization-draft","deferment","призыв");
assert.ok(onlyOrdinary.some(x=>x.id==="53-24"));
assert.ok(onlyOrdinary.every(x=>x.id!=="31-18"&&x.id!=="647-9"),"Ordinary draft must exclude mobilisation deferment");
const mobAppeal=getMilitaryPinpointLinks("mobilization-draft","challenge-draft","мобилизация");
assert.ok(mobAppeal.some(x=>x.id==="kas-218"));
assert.ok(mobAppeal.every(x=>!x.id.startsWith("53-35")&&x.id!=="53-28"),"Mobilisation appeals must not be routed into conscription-only complaint procedure");
const ordinaryAppeal=getMilitaryPinpointLinks("mobilization-draft","challenge-draft","призыв");
assert.ok(ordinaryAppeal.some(x=>x.id==="53-35-1"&&x.checked));
const mobilizationNotice=getMilitaryPinpointLinks("mobilization-draft","draft-notice","мобилизация");
assert.ok(mobilizationNotice.some(x=>x.id==="647-2"));
assert.ok(mobilizationNotice.every(x=>x.id!=="53-28"));
assert.ok(Object.values(MILITARY_PINPOINT_REFERENCES).every(ref=>ref.checked),"All law reference targets must have verified destination");
console.log("Military citation integrity: 18 mapped cases and verified-only deeplinks");

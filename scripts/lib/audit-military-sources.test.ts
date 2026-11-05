import assert from "node:assert/strict";
import { buildMilitaryLiveAudit, inspectMilitaryEvidence, normalizeExcerpt } from "./audit-military-sources";
import { MILITARY_SOURCE_CLAIMS } from "../../src/data/military-source-verification";

const sources=MILITARY_SOURCE_CLAIMS[0].sources;
assert.equal(normalizeExcerpt("Призыв   — &nbsp; ежегодно"),"призыв - ежегодно");
const html="<html><script>Неверные сведения</script><main>"+sources[0].checkedExcerpt+"</main></html>";
const fakeFetch=async (input:RequestInfo|URL):Promise<Response>=>new Response(html,{
  headers:{"content-type":"text/html"}
});
const mock=async (input:RequestInfo|URL):Promise<Response>=>{
  const url=String(input);
  return Object.assign(new Response(html,{headers:{"content-type":"text/html"}}),{url});
};
const match=await inspectMilitaryEvidence(sources[0],mock as typeof fetch);
assert.equal(match.status,"MATCH");
const missing=async (input:RequestInfo|URL):Promise<Response>=>Object.assign(
  new Response("<p>Нет выдержки</p>",{headers:{"content-type":"text/html"}}),{url:String(input)}
);
assert.equal((await inspectMilitaryEvidence(sources[0],missing as typeof fetch)).status,"TEXT_MISMATCH");
const blocked=async(input:RequestInfo|URL):Promise<Response>=>Object.assign(
  new Response("Forbidden",{status:403,headers:{"content-type":"text/plain"}}),{url:String(input)}
);
assert.equal((await inspectMilitaryEvidence(sources[0],blocked as typeof fetch)).status,"UNAVAILABLE");
assert.equal((await inspectMilitaryEvidence({...sources[0],url:"http://consultant.ru/fake"},mock as typeof fetch)).status,"UNAVAILABLE");
const report=await buildMilitaryLiveAudit(mock as typeof fetch);
assert.equal(report.totalSituations,143);
assert.equal(report.recordedClaims,1);
assert.equal(report.liveTwoSourceMatches,1);
assert.equal(report.pendingCases,142);
assert.equal(report.claims[0].checks.length,2);
const degraded=await buildMilitaryLiveAudit(missing as typeof fetch);
assert.equal(degraded.liveTwoSourceMatches,0);
assert.equal(degraded.pendingCases,142);
console.log("Military live source audit: 143 queued, confirmed excerpts, mismatch, 403, and degraded sources PASS");

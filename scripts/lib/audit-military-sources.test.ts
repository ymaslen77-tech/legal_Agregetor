import assert from "node:assert/strict";
import { buildMilitaryLiveAudit, inspectMilitaryEvidence, normalizeExcerpt } from "./audit-military-sources";
import { MILITARY_SOURCE_CLAIMS } from "../../src/data/military-source-verification";

async function main(){
const sources=MILITARY_SOURCE_CLAIMS[0].sources;
assert.equal(normalizeExcerpt("Призыв   — &nbsp; ежегодно"),"призыв - ежегодно");
const html="<html><script>Неверные сведения</script><main>"+sources[0].checkedExcerpt+"</main></html>";
const withUrl=(body:string,url:string,status=200):Response=>{
  const response=new Response(body,{status,headers:{"content-type":"text/html"}});
  Object.defineProperty(response,"url",{value:url});
  return response;
};
const mock=async (input:RequestInfo|URL):Promise<Response>=>withUrl(html,String(input));
const match=await inspectMilitaryEvidence(sources[0],mock as typeof fetch);
assert.equal(match.status,"MATCH");
const missing=async (input:RequestInfo|URL):Promise<Response>=>withUrl("<p>Нет выдержки</p>",String(input));
assert.equal((await inspectMilitaryEvidence(sources[0],missing as typeof fetch)).status,"TEXT_MISMATCH");
const blocked=async(input:RequestInfo|URL):Promise<Response>=>withUrl("Forbidden",String(input),403);
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

}
main().catch(error=>{console.error(error);process.exitCode=1;});

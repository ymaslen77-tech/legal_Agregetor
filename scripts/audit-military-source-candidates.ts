/**
 * Read-only discovery of reachable legal reference candidates for all 143 military situations.
 * This is NOT an assertion that a source supports the case-specific legal proposition.
 * No results from this script set legalReviewed, filingReady or any verified flag.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { getMilitarySourceReviewQueue } from "../src/data/military-source-verification";

const domains = new Set([
  "pravo.gov.ru", "publication.pravo.gov.ru", "consultant.ru", "garant.ru",
  "base.garant.ru", "rg.ru", "vsrf.ru", "government.ru", "minjust.gov.ru",
  "kremlin.ru", "sudrf.ru", "ksrf.ru", "mchs.gov.ru", "rosguard.gov.ru"
]);
type Diagnostic = {url:string;host:string;state:"AVAILABLE"|"UNAVAILABLE"|"NOT_RESEARCH_SOURCE";reason:string};
function sourceHost(url:string):string|null {
  try {
    const u=new URL(url);
    const host=u.hostname.toLowerCase().replace(/^www\./,"");
    return u.protocol==="https:" && !u.username && !u.password && domains.has(host) &&
      u.pathname!=="/" ? host : null;
  } catch { return null; }
}
function family(host:string):string {
  if(host==="base.garant.ru")return "garant.ru";
  if(host==="publication.pravo.gov.ru")return "pravo.gov.ru";
  return host;
}
async function inspect(url:string):Promise<Diagnostic>{
  const host=sourceHost(url);
  if(!host)return {url,host:"",state:"NOT_RESEARCH_SOURCE",reason:"Untrusted, nonspecific, or unsupported URL"};
  try {
    const response=await fetch(url,{
      redirect:"manual",signal:AbortSignal.timeout(10000),
      headers:{"Accept":"text/html,text/plain;q=0.9","User-Agent":"PravopoiskLegalSourceAudit/1.0"}
    });
    const returned=response.url||url;
    if(sourceHost(returned)!==host||!response.ok)
      return {url,host,state:"UNAVAILABLE",reason:"HTTP "+response.status+" or redirected to a different source"};
    const contentType=response.headers.get("content-type")??"";
    if(!/text\/html|text\/plain/i.test(contentType))
      return {url,host,state:"UNAVAILABLE",reason:"Nontext response; exact provision not checked"};
    // Reachability is only a research hint, never evidence that the article text matches.
    await response.body?.cancel();
    return {url,host,state:"AVAILABLE",reason:"HTML/text response; legal content not validated"};
  } catch(error) {
    return {url,host,state:"UNAVAILABLE",reason:error instanceof Error?error.name:"Fetch error"};
  }
}
async function main(){
  const queue=getMilitarySourceReviewQueue();
  const unique=[...new Set(queue.flatMap(q=>q.candidateUrls))].sort();
  const results=new Map<string,Diagnostic>();
  let index=0;
  async function worker() {
    while(index<unique.length){
      const url=unique[index++];
      results.set(url,await inspect(url));
    }
  }
  await Promise.all(Array.from({length:Math.min(6,unique.length)},()=>worker()));
  const cases=queue.map(q=>{
    const sources=q.candidateUrls.map(url=>results.get(url)!).filter(Boolean);
    const available=sources.filter(s=>s.state==="AVAILABLE");
    return {
      topicSlug:q.topicSlug,situationIndex:q.situationIndex,
      verificationStatus:q.verificationStatus,
      sourceCandidates:sources,
      distinctAvailablePublishers:new Set(available.map(s=>family(s.host))).size,
      requiresClaimLevelComparison:!q.automaticallyVerified
    };
  });
  const summary={
    situations:cases.length,
    uniqueUrlsChecked:unique.length,
    availableUrls:[...results.values()].filter(s=>s.state==="AVAILABLE").length,
    candidateCasesWithTwoPublishers:cases.filter(c=>c.distinctAvailablePublishers>=2).length,
    currentlyUnverifiedCases:cases.filter(c=>c.requiresClaimLevelComparison).length,
    legalClaimApprovalsGranted:0,
    note:"Presence of HTML is NOT proof of the legal claim, its effective version, applicability, or filing readiness."
  };
  const dir="reports/military-source-audit";
  mkdirSync(dir,{recursive:true});
  writeFileSync(dir+"/candidates.json",JSON.stringify({summary,cases},null,2)+"\n");
  console.log(JSON.stringify(summary,null,2));
}
main().catch(error=>{console.error(error);process.exitCode=1;});

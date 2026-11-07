import { mkdirSync, writeFileSync } from "node:fs";
import { MILITARY_TOPICS } from "../src/data/military-catalog";

const site = (process.env.SEO_LIVE_BASE || "https://pravopoisk.ru").replace(/\/$/, "");
const topic = MILITARY_TOPICS[0];
const pages = [
  {path:"/",expected:"INDEX"},
  {path:"/documents/",expected:"INDEX"},
  {path:"/voennoe-pravo/",expected:"INDEX_AFTER_DEPLOY"},
  {path:`/voennoe-pravo/${topic.slug}/`,expected:"NOINDEX"},
  {path:`/voennoe-pravo/${topic.slug}/${topic.situations[0].slug}/`,expected:"NOINDEX"}
];
function attr(tag:string, key:string):string {
  const match=tag.match(new RegExp(`(?:^|\\s)${key}\\s*=\\s*["']([^"']*)["']`,"i"));
  return match?.[1]??"";
}
function getHeadTag(html:string, tag:string, key:string, value:string):string {
  const head=html.split(/<\/head>/i)[0]??html.slice(0,90000);
  return [...head.matchAll(new RegExp(`<${tag}\\b[^>]*>`,"gi"))]
    .map(hit=>hit[0]).find(found=>attr(found,key).toLowerCase()===value)??"";
}
async function request(path:string){
  try {
    const response=await fetch(site+path,{
      signal:AbortSignal.timeout(20000),
      redirect:"follow",
      headers:{"Accept":"text/html,application/xml,text/plain;q=0.8","User-Agent":"PravopoiskSeoReadOnlyAudit/1.0"}
    });
    const text=(await response.text()).slice(0,2_500_000);
    const meta=getHeadTag(text,"meta","name","robots");
    const canonical=getHeadTag(text,"link","rel","canonical");
    const robots=attr(meta,"content");
    const header=response.headers.get("x-robots-tag")??"";
    const combined=robots+" "+header;
    return {path,http:response.status,bytes:text.length,robots,header,canonical:attr(canonical,"href"),
      noindex:/\bnoindex\b/i.test(combined),text};
  }catch(error){return {path,http:0,bytes:0,robots:"",header:"",canonical:"",noindex:null,text:"",error:String(error)}}
}
async function main(){
  const results=await Promise.all(pages.map(async p=>({...p,...await request(p.path)})));
  const [robots,index,sitePages]=await Promise.all(["/robots.txt","/sitemap.xml","/sitemap-pages.xml"].map(request));
  const robotsText=robots.text;
  const sitemap=sitePages.text;
  const diagnostics={
    rootCrawlAllowed:robots.http===200 && !/^Disallow:\s*\/\s*$/mi.test(robotsText),
    sitemapIndexAvailable:index.http===200 && index.text.includes("sitemap-pages.xml"),
    militaryHubInPublishedSitemap:sitemap.includes(site+"/voennoe-pravo/"),
    fakePathsInPublishedSitemap:/\/(?:demo-lawyer|sample-lawyer|dev-city-lawyer|test-lawyer|fake-lawyer|fixture-lawyer)/i.test(sitemap),
    militaryUnverifiedUrlsInPublishedSitemap:sitemap.includes(site+`/voennoe-pravo/${topic.slug}/`)
  };
  const out={checkedAt:new Date().toISOString(),site,
    note:"Live read-only observation. INDEX_AFTER_DEPLOY may remain noindex until Coolify rebuild/release. A sitemap and indexable metadata do not guarantee search inclusion.",
    results:results.map(({text,...rest})=>rest),urls:[robots,index,sitePages].map(({text,...rest})=>rest),diagnostics};
  const dir="artifacts/public-seo-indexing";
  mkdirSync(dir,{recursive:true});
  writeFileSync(dir+"/live-report.json",JSON.stringify(out,null,2)+"\n");
  console.log(JSON.stringify(out,null,2));
  // Do not fail pre-deployment PR merely because current production still has noindex.
  // Regression is enforced by the build E2E tests and separate release review.
}
main().catch(error=>{console.error(error);process.exitCode=1;});

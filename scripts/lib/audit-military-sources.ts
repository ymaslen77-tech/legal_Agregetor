import { MILITARY_SOURCE_CLAIMS, getMilitarySourceReviewQueue, type MilitarySourceEvidence } from "../../src/data/military-source-verification";

export type LiveEvidenceCheck = {
  url: string;
  publisher: string;
  status: "MATCH" | "UNAVAILABLE" | "TEXT_MISMATCH" | "UNSUPPORTED_FORMAT";
  detail: string;
};
type FetchLike = typeof fetch;
const allowedHosts = new Set([
  "pravo.gov.ru","publication.pravo.gov.ru","minjust.gov.ru","government.ru",
  "kremlin.ru","sudrf.ru","vsrf.ru","ksrf.ru","consultant.ru",
  "storage.consultant.ru","garant.ru","base.garant.ru",
  "constitution.garant.ru","rg.ru"
]);
function safeHost(url: string): string | null {
  try {
    const value = new URL(url);
    if (value.protocol !== "https:" || value.username || value.password) return null;
    const host = value.hostname.toLowerCase().replace(/^www\./, "");
    return allowedHosts.has(host) ? host : null;
  } catch { return null; }
}
function publisherKey(host: string): string {
  if (host === "publication.pravo.gov.ru") return "pravo.gov.ru";
  if (host === "storage.consultant.ru") return "consultant.ru";
  if (host === "base.garant.ru" || host === "constitution.garant.ru") return "garant.ru";
  return host;
}
export function normalizeExcerpt(text: string): string {
  return text.replace(/&(?:nbsp|#160);/gi, " ")
    .replace(/&(?:mdash|ndash|#8211|#8212);/gi, "-")
    .replace(/&quot;/gi, '"').replace(/&#(?:34|39);/gi, "'")
    .replace(/&amp;/gi, "&").replace(/&#(\d+);/g, (_, n: string) => {
      const code = Number(n);
      return code >= 32 && code <= 0x10ffff ? String.fromCodePoint(code) : " ";
    })
    .replace(/[\u00a0\s]+/g, " ").replace(/[—–−]/g, "-").trim().toLocaleLowerCase("ru");
}
export function visibleHtml(html: string): string {
  return html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--([\s\S]*?)-->/g, " ")
    .replace(/<[^>]+>/g, " ");
}
export async function inspectMilitaryEvidence(e: MilitarySourceEvidence, get: FetchLike = fetch): Promise<LiveEvidenceCheck> {
  const host = safeHost(e.url);
  const base = {url:e.url,publisher:e.publisher};
  if (!host) return {...base,status:"UNAVAILABLE",detail:"Источник вне утверждённого HTTPS-списка"};
  if (e.url.toLowerCase().split("?")[0].endsWith(".pdf")) return {...base,status:"UNSUPPORTED_FORMAT",detail:"Для PDF нужна отдельная проверка текста"};
  try {
    const response = await get(e.url,{redirect:"follow",signal:AbortSignal.timeout(15000),
      headers:{"Accept":"text/html,text/plain;q=0.9","User-Agent":"PravopoiskLegalSourceAudit/1.0"}});
    const redirectedHost=safeHost(response.url);
    if (!response.ok || !redirectedHost || publisherKey(redirectedHost)!==publisherKey(host))
      return {...base,status:"UNAVAILABLE",detail:"HTTP "+response.status+" или непроверенный адрес перенаправления"};
    const type=response.headers.get("content-type")??"";
    if (!/text\/html|text\/plain/i.test(type)) return {...base,status:"UNSUPPORTED_FORMAT",detail:"Неподдерживаемый Content-Type: "+type.slice(0,100)};
    const declaredSize=Number(response.headers.get("content-length")??"0");
    if (declaredSize>2_000_000) return {...base,status:"UNAVAILABLE",detail:"Страница превышает ограничение 2 МБ"};
    const body=await response.text();
    if(body.length>2_000_000) return {...base,status:"UNAVAILABLE",detail:"Текст страницы превышает ограничение 2 МБ"};
    const found=normalizeExcerpt(visibleHtml(body)).includes(normalizeExcerpt(e.checkedExcerpt));
    return {...base,status:found?"MATCH":"TEXT_MISMATCH",detail:found?"Выдержка присутствует в доступном тексте":"Не удалось найти точную ранее сверенную выдержку"};
  } catch (error) {
    return {...base,status:"UNAVAILABLE",detail:error instanceof Error?error.name:"Ошибка чтения"};
  }
}
export async function buildMilitaryLiveAudit(get: FetchLike = fetch) {
  const queue=getMilitarySourceReviewQueue();
  const claims=[];
  for(const claim of MILITARY_SOURCE_CLAIMS){
    const checks=await Promise.all(claim.sources.map(source=>inspectMilitaryEvidence(source,get)));
    const matches=claim.sources.filter((_,index)=>checks[index].status==="MATCH");
    const independent=new Set(matches.map(source=>publisherKey(safeHost(source.url)??"")));
    const verifiedOffline=queue.find(x=>x.topicSlug===claim.topicSlug&&x.situationIndex===claim.situationIndex)?.automaticallyVerified??false;
    // An automated excerpt match only establishes traceability, NOT the legal correctness
    // of the claimed norm, its effective date, applicability or filing readiness.
    claims.push({topicSlug:claim.topicSlug,situationIndex:claim.situationIndex,
      claim:claim.claim,recordedSourceVerdict:verifiedOffline?"RECORDED_VERIFIED":"NEEDS_SOURCES",
      liveStatus:independent.size>=2?"TWO_EXCERPTS_FOUND":"RECHECK_REQUIRED",
      checks});
  }
  return {
    generatedAt:new Date().toISOString(),
    scope:"Source evidence accessibility and verbatim excerpts; not legal or filing approval",
    totalSituations:queue.length,
    recordedClaims:MILITARY_SOURCE_CLAIMS.length,
    liveTwoSourceMatches:claims.filter(c=>c.liveStatus==="TWO_EXCERPTS_FOUND").length,
    pendingCases:queue.filter(c=>!c.automaticallyVerified).length,
    claims,
    queue:queue.map(({topicSlug,situationIndex,verificationStatus,candidateUrls})=>({
      topicSlug,situationIndex,verificationStatus,candidateUrls
    }))
  };
}

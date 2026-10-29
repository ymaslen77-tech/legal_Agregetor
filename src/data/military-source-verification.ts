/**
 * Source-based editorial acceptance, not attorney sign-off.
 * An immutable, individually checked claim + 2 independent publishers is the
 * unit of acceptance. Links, search snippets and source *candidates* never count.
 * A recorded excerpt is an audit trace; this module does NOT fetch websites.
 */
export type MilitarySourceEvidence = Readonly<{
  publisher: string;
  title: string;
  url: string;
  kind: "OFFICIAL" | "REPUTABLE";
  /** The exact fact actually found at the referenced address. */
  checkedExcerpt: string;
  /** Article/paragraph and applicability, not just the law's homepage. */
  provision: string;
  /** The edition/as-of date that was inspected; no invented 'current' flag. */
  editionAsOf: string;
  checkedAt: string;
  stance: "SUPPORTS" | "CONTRADICTS";
  /** Official text was actually opened, not merely linked. */
  opened: boolean;
}>;
export type MilitarySourceClaim = Readonly<{
  topicSlug: string;
  situationIndex: number;
  claim: string;
  claimType: "LEGAL_NORM" | "PROCEDURE" | "PRACTICAL_GUIDANCE";
  checkedAt: string;
  sources: readonly MilitarySourceEvidence[];
}>;
export type MilitarySourceVerdict =
  "VERIFIED_OFFICIAL" | "VERIFIED_REPUTABLE" | "NEEDS_SOURCES" |
  "OFFICIAL_CONFLICT" | "SOURCE_CONFLICT";
export type MilitaryVerificationResult = Readonly<{
  verdict: MilitarySourceVerdict;
  verified: boolean;
  acceptedEvidence: number;
  officialPriorityApplied: boolean;
  sourceCount: number;
  remarks: readonly string[];
}>;

const publisherHosts: Readonly<Record<string,"OFFICIAL"|"REPUTABLE">> = {
  "pravo.gov.ru":"OFFICIAL",
  "publication.pravo.gov.ru":"OFFICIAL",
  "minjust.gov.ru":"OFFICIAL",
  "government.ru":"OFFICIAL",
  "kremlin.ru":"OFFICIAL",
  "sudrf.ru":"OFFICIAL",
  "vsrf.ru":"OFFICIAL",
  "ksrf.ru":"OFFICIAL",
  "consultant.ru":"REPUTABLE",
  "garant.ru":"REPUTABLE",
  "rg.ru":"REPUTABLE"
};
function hostFromUrl(url:string):string|null {
  try {
    const u=new URL(url);
    if(u.protocol!=="https:"||u.username||u.password)return null;
    return u.hostname.toLowerCase().replace(/^www\./,"");
  } catch {return null;}
}
function isValidEvidence(e:MilitarySourceEvidence):boolean {
  const host=hostFromUrl(e.url);
  return Boolean(host && publisherHosts[host]===e.kind &&
    e.publisher.trim().length>=4 && e.title.trim().length>=8 &&
    e.checkedExcerpt.trim().length>=35 && e.provision.trim().length>=3 &&
    /^20\d{2}-\d{2}-\d{2}$/.test(e.checkedAt) &&
    /^20\d{2}-\d{2}-\d{2}$/.test(e.editionAsOf) &&
    e.checkedAt>=e.editionAsOf && e.opened===true);
}
/** One publisher/host is one independent source, even with many separate URLs. */
export function evaluateMilitarySourceClaim(claim:MilitarySourceClaim):MilitaryVerificationResult {
  if(!claim.claim.trim() || claim.claim.trim().length<20 ||
     !/^20\d{2}-\d{2}-\d{2}$/.test(claim.checkedAt)) {
    return {verdict:"NEEDS_SOURCES",verified:false,acceptedEvidence:0,officialPriorityApplied:false,sourceCount:0,remarks:["Нет установленного конкретного проверяемого утверждения."]};
  }
  const considered=claim.sources.filter(e=>isValidEvidence(e)&&e.checkedAt<=claim.checkedAt);
  const unique=new Map<string,MilitarySourceEvidence>();
  for(const s of considered){
    const host=hostFromUrl(s.url)!;
    const key=host==="publication.pravo.gov.ru"?"pravo.gov.ru":host;
    // Opposite conclusions by the same publisher require resolution, not cherry-picking.
    const previous=unique.get(key);
    if(previous && previous.stance!==s.stance){
      return {verdict:"SOURCE_CONFLICT",verified:false,acceptedEvidence:0,officialPriorityApplied:false,sourceCount:unique.size,remarks:["Один источник даёт противоположные выводы по одной норме."]};
    }
    if(!previous)unique.set(key,s);
  }
  const sources=[...unique.values()];
  const official=sources.filter(s=>s.kind==="OFFICIAL");
  const officialSupports=official.filter(s=>s.stance==="SUPPORTS");
  const officialOpposes=official.filter(s=>s.stance==="CONTRADICTS");
  const verifiedSources=sources.filter(s=>s.stance==="SUPPORTS");
  const reputableOpposes=sources.filter(s=>s.kind==="REPUTABLE"&&s.stance==="CONTRADICTS");
  const common={acceptedEvidence:verifiedSources.length,sourceCount:sources.length};
  if(officialSupports.length && officialOpposes.length){
    return {...common,verdict:"OFFICIAL_CONFLICT",verified:false,officialPriorityApplied:false,remarks:["Официальные источники противоречат друг другу; требуется проверить редакции и сферу действия."]};
  }
  if(officialOpposes.length){
    return {...common,verdict:"OFFICIAL_CONFLICT",verified:false,officialPriorityApplied:true,remarks:["Официальный текст опровергает утверждение. Публикация утверждения недопустима."]};
  }
  if(verifiedSources.length<2){
    return {...common,verdict:"NEEDS_SOURCES",verified:false,officialPriorityApplied:false,remarks:["Нужны два независимых фактически сверенных подтверждения."]};
  }
  // A verified agreement between two independent reputable publishers is
  // sufficient, even when the official portal cannot be opened. A recorded
  // official source always takes precedence if the texts disagree.
  if(reputableOpposes.length && !officialSupports.length){
    return {...common,verdict:"SOURCE_CONFLICT",verified:false,officialPriorityApplied:false,remarks:["У независимых источников остались противоречия."]};
  }
  const priority=officialSupports.length>0&&reputableOpposes.length>0;
  return {
    ...common,
    verdict:officialSupports.length?"VERIFIED_OFFICIAL":"VERIFIED_REPUTABLE",
    verified:true,
    officialPriorityApplied:priority,
    remarks:priority?["Расхождение с неофициальной перепечаткой; приоритет отдан подтверждённому действующему официальному тексту."]:officialSupports.length?["Подтверждено двумя независимыми источниками, включая официальный; ручная подпись не требуется."]:["Два независимых авторитетных источника подтвердили тезис; официальная редакция отдельно не открывалась, при её расхождении приоритет за ней."]
  };
}

/** Record ONLY claims whose source passages were actually opened and compared.
 * Legacy candidate URLs in military-case-legal-matrix.ts do not count.
 * No auto-filled fake attestations are permitted.
 */
export const MILITARY_SOURCE_CLAIMS:readonly MilitarySourceClaim[]=[];

export function getMilitarySourceClaim(topicSlug:string,situationIndex:number) {
  return MILITARY_SOURCE_CLAIMS.find(x=>x.topicSlug===topicSlug&&x.situationIndex===situationIndex)??null;
}
export function getMilitarySourceStatus(topicSlug:string,situationIndex:number):MilitaryVerificationResult {
  const claim=getMilitarySourceClaim(topicSlug,situationIndex);
  return claim?evaluateMilitarySourceClaim(claim):{
    verdict:"NEEDS_SOURCES",verified:false,acceptedEvidence:0,officialPriorityApplied:false,sourceCount:0,
    remarks:["Предварительная правовая карта есть, но два сверенных источника по конкретному утверждению ещё не зафиксированы."]
  };
}

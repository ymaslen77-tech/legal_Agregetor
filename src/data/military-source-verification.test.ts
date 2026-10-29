import assert from "node:assert/strict";
import {
  evaluateMilitarySourceClaim, getMilitarySourceStatus, getMilitarySourceReviewQueue, MILITARY_SOURCE_CLAIMS,
  type MilitarySourceClaim, type MilitarySourceEvidence
} from "@/data/military-source-verification";
import { MILITARY_TOPICS } from "@/data/military-catalog";

const example=({
  publisher,kind,url,stance="SUPPORTS",excerpt="Проверенный фрагмент источника подтверждает применимость нормы и все указанные условия её действия.",
}:{
  publisher:string;kind:"OFFICIAL"|"REPUTABLE";url:string;
  stance?:"SUPPORTS"|"CONTRADICTS";excerpt?:string;
}):MilitarySourceEvidence=>({
  publisher,title:"Контрольная сверка текста по статье 51",kind,url,stance,checkedExcerpt:excerpt,provision:"статья 51, пункт 1",
  editionAsOf:"2026-10-29",checkedAt:"2026-10-29",opened:true
});
const official=example({publisher:"Государственная система правовой информации",kind:"OFFICIAL",url:"https://publication.pravo.gov.ru/document/0001202209210001"});
const consultant=example({publisher:"КонсультантПлюс",kind:"REPUTABLE",url:"https://www.consultant.ru/document/cons_doc_LAW_18260/"});
const garant=example({publisher:"Гарант",kind:"REPUTABLE",url:"https://www.garant.ru/products/ipo/prime/doc/12345/"});
const claim=(sources:MilitarySourceClaim["sources"],claimType:MilitarySourceClaim["claimType"]="LEGAL_NORM"):MilitarySourceClaim=>({
  topicSlug:"kontraktnaya-sluzhba",situationIndex:0,
  claim:"Вымышленный тестовый юридический тезис о конкретной статье и редакции, не для публикации.",
  claimType,checkedAt:"2026-10-29",sources
});
let verdict=evaluateMilitarySourceClaim(claim([official,consultant]));
assert.equal(verdict.verdict,"VERIFIED_OFFICIAL");
assert.equal(verdict.verified,true);
assert.equal(verdict.acceptedEvidence,2);
assert.equal(verdict.officialPriorityApplied,false);
assert.equal(evaluateMilitarySourceClaim(claim([consultant,garant])).verdict,"VERIFIED_REPUTABLE");
assert.equal(evaluateMilitarySourceClaim(claim([consultant,garant],"PRACTICAL_GUIDANCE")).verdict,"VERIFIED_REPUTABLE");
assert.equal(evaluateMilitarySourceClaim(claim([official])).verdict,"NEEDS_SOURCES");
assert.equal(evaluateMilitarySourceClaim(claim([official,{...consultant,opened:false}])).verdict,"NEEDS_SOURCES");
assert.equal(evaluateMilitarySourceClaim(claim([official,{...consultant,checkedExcerpt:" "}])).verdict,"NEEDS_SOURCES");
assert.equal(evaluateMilitarySourceClaim(claim([official,{...consultant,url:"https://example.com/fake"}])).verdict,"NEEDS_SOURCES");
assert.equal(evaluateMilitarySourceClaim(claim([official,{...consultant,url:"http://consultant.ru/"}])).verdict,"NEEDS_SOURCES");
assert.equal(evaluateMilitarySourceClaim(claim([official,{...consultant,kind:"OFFICIAL"}])).verdict,"NEEDS_SOURCES");
assert.equal(evaluateMilitarySourceClaim(claim([official,{...consultant,url:official.url}])).verdict,"NEEDS_SOURCES");
assert.equal(evaluateMilitarySourceClaim(claim([official,{...official,url:"https://www.pravo.gov.ru"}])).verdict,"NEEDS_SOURCES");
assert.equal(evaluateMilitarySourceClaim(claim([consultant,garant,{...official,stance:"CONTRADICTS"}])).verdict,"OFFICIAL_CONFLICT");
assert.equal(evaluateMilitarySourceClaim(claim([consultant,garant,{...official,stance:"CONTRADICTS"}])).verified,false);
assert.equal(evaluateMilitarySourceClaim(claim([consultant,{...consultant,stance:"CONTRADICTS"},official])).verdict,"SOURCE_CONFLICT");
verdict=evaluateMilitarySourceClaim(claim([official,consultant,{...garant,stance:"CONTRADICTS"}]));
assert.equal(verdict.verdict,"VERIFIED_OFFICIAL");
assert.equal(verdict.officialPriorityApplied,true);
assert.equal(verdict.verified,true);
const secondOfficial=example({publisher:"Минюст",kind:"OFFICIAL",url:"https://minjust.gov.ru/ru/appeals/faq/670/",stance:"CONTRADICTS"});
assert.equal(evaluateMilitarySourceClaim(claim([official,consultant,secondOfficial])).verdict,"OFFICIAL_CONFLICT");
// Current draft source URLs are candidates only: nothing is silently approved.
assert.equal(MILITARY_SOURCE_CLAIMS.length,1);
for(const topic of MILITARY_TOPICS){
  for(const i of topic.situations.keys()){
    const status=getMilitarySourceStatus(topic.slug,i);
    const firstVerified=topic.slug==="prizyv" && i===0;
    assert.equal(status.verified,firstVerified);
    assert.equal(status.verdict,firstVerified?"VERIFIED_REPUTABLE":"NEEDS_SOURCES");
  }
}
const queue=getMilitarySourceReviewQueue();
assert.equal(queue.length,143);
assert.equal(new Set(queue.map(x=>x.topicSlug+":"+x.situationIndex)).size,143);
assert.equal(queue.filter(x=>x.previouslyCrosscheckedUnofficially).length,64);
assert(queue.every(x=>x.candidateUrls.length>0));
assert.equal(queue.filter(x=>x.automaticallyVerified).length,1);
console.log(JSON.stringify({automaticTwoSourceDecision:true,officialPrecedence:true,noMassApproval:true,cases:143}));

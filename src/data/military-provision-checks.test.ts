import assert from "node:assert/strict";
import { MILITARY_TOPICS } from "@/data/military-catalog";
import { MILITARY_LEGAL_CASE_CARDS } from "@/data/military-case-legal-matrix";
import { getMilitaryDocumentCandidate } from "@/data/military-document-candidates";
import { getMilitaryProvisionCheck, getMilitaryProvisionCoverage, MILITARY_PROVISION_CHECKS, MILITARY_LEGAL_AUDIT_REFERENCE_LINKS } from "@/data/military-provision-checks";

const coverage=getMilitaryProvisionCoverage();
assert.equal(coverage.cases,143);
assert.equal(coverage.provisionsCrosschecked,21);
assert.equal(coverage.categoriesTouched,5);
assert.equal(coverage.officialTextVerified,0,"Do not claim to have read blocked official portal original");
assert.equal(coverage.legallyApproved,0);
const unique=new Set<string>();
for(const item of MILITARY_PROVISION_CHECKS){
 const topic=MILITARY_TOPICS.find(t=>t.slug===item.topicSlug);
 assert(topic,"Unknown topic: "+item.topicSlug);
 const situation=topic.situations[item.situationIndex];
 assert(situation,"Unknown situation: "+item.topicSlug+"/"+item.situationIndex);
 const key=item.topicSlug+":"+item.situationIndex;
 assert(!unique.has(key),"Duplicate provision check");
 unique.add(key);
 assert.equal(item.legalReviewConfirmed,false);
 assert.equal(item.officialTextVerified,false);
 assert.equal(item.checkedAt,"2026-10-28");
 assert.equal(item.sourceStatus,"CURRENT_THIRD_PARTY_TEXT_CROSSCHECKED_OFFICIAL_RECORD_NOT_OPENED");
 assert(item.provisions.length>0);
 for(const provision of item.provisions){
   assert(provision.article.startsWith("статья")||provision.article.startsWith("статьи")||provision.article.startsWith("пункт"));
   assert(provision.textUrl.startsWith("https://"));
   assert(provision.applicability.length>30);
 }
 const card=MILITARY_LEGAL_CASE_CARDS.find(c=>c.topicSlug===item.topicSlug&&c.situationIndex===item.situationIndex);
 assert(card);
 assert.equal(card.legalReviewConfirmed,false);
 assert.equal(card.officialPublicationChecked,false);
 assert.equal(getMilitaryProvisionCheck(item.topicSlug,item.situationIndex),item);
}
const requiredCases:readonly [string,number,string][]=[
 ["otsrochka-ot-sluzhby",1,"статья 24"],
 ["otsrochka-ot-sluzhby",2,"статья 24"],
 ["otsrochka-ot-sluzhby",3,"статья 24"],
 ["otsrochka-ot-sluzhby",5,"статья 24"],
 ["uvolnenie-s-voennoy-sluzhby",1,"статья 51"],
 ["uvolnenie-s-voennoy-sluzhby",2,"статья 51"],
 ["uvolnenie-s-voennoy-sluzhby",3,"статья 51"],
 ["uvolnenie-s-voennoy-sluzhby",4,"статья 51"],
 ["vvk-i-kategoriya-godnosti",2,"пункт 8"],
 ["vvk-i-kategoriya-godnosti",3,"пункт 8"],
 ["vvk-i-kategoriya-godnosti",5,"пункт 8"],
 ["vvk-i-kategoriya-godnosti",6,"пункт 8"],
 ["prizyv",8,"статья 35.3"]
];
for(const [slug,index,rule] of requiredCases){
 const item=getMilitaryProvisionCheck(slug,index);
 assert(item, "Missing legal research for "+slug+" #"+index);
 assert(item.provisions.some(p=>p.article.includes(rule)), "Wrong article: "+slug+" #"+index);
 assert(item.caution.length>45,"Missing caveat: "+slug+" #"+index);
}
const excerpt=MILITARY_LEGAL_CASE_CARDS.filter(c=>c.sourceCandidates.some(s=>s.id==="53"));
assert(excerpt.length>0);
for(const caseCard of excerpt){
 const stale=caseCard.sourceCandidates.filter(s=>s.id==="53");
 assert(stale.every(s=>s.type==="GOVERNMENT_REPRINT_STALE_NOT_CURRENT"),
   "Old government reprint must never be treated as a current statute: "+caseCard.situationTitle);
}
const prizyv=MILITARY_TOPICS.find(t=>t.slug==="prizyv")!;
const situation=prizyv.situations[4];
const doc=getMilitaryDocumentCandidate(prizyv,situation)!;
assert(doc);
assert(doc.requestText.includes("выписку из протокола"));
assert(doc.requestText.includes("пяти рабочих дней"));
assert(!doc.requestText.includes("Прошу предоставить копию решения"));
assert(MILITARY_LEGAL_CASE_CARDS.some(c=>c.topicSlug==="prizyv"&&c.situationIndex===4&&c.plannedResultToVerify?.includes("выписки из протокола")));
const vvkTopic=MILITARY_TOPICS.find(t=>t.slug==="vvk-i-kategoriya-godnosti")!;
for(const idx of [2,3]){
 const candidate=getMilitaryDocumentCandidate(vvkTopic,vvkTopic.situations[idx]);
 assert(candidate, "Existing VVK draft must remain accessible");
 assert(candidate.requestText.includes("пункта 8 Положения"));
 assert(candidate.requestText.includes("вышестоящую военно-врачебную комиссию"));
 assert(candidate.factsPrompt.includes("заключения ВВК"));
}
assert(MILITARY_LEGAL_AUDIT_REFERENCE_LINKS.article35_3.startsWith("https://"));
console.log(JSON.stringify({...coverage,staleGovReprintsFlagged:excerpt.length,wrongDecisionCopyGeneratorRemoved:true}));

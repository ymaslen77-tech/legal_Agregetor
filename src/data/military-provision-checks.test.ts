import assert from "node:assert/strict";
import { MILITARY_TOPICS } from "@/data/military-catalog";
import { MILITARY_LEGAL_CASE_CARDS } from "@/data/military-case-legal-matrix";
import { getMilitaryDocumentCandidate } from "@/data/military-document-candidates";
import { getMilitaryProvisionCheck, getMilitaryProvisionCoverage, MILITARY_PROVISION_CHECKS, MILITARY_LEGAL_AUDIT_REFERENCE_LINKS } from "@/data/military-provision-checks";

const coverage=getMilitaryProvisionCoverage();
assert.equal(coverage.cases,143);
assert.equal(coverage.provisionsCrosschecked,43);
assert.equal(coverage.categoriesTouched,11);
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
const nextBatch:readonly [string,number][]=[
 ["mobilizaciya",0],["mobilizaciya",1],["mobilizaciya",2],["mobilizaciya",3],
 ["mobilizaciya",4],["mobilizaciya",5],["mobilizaciya",6],
 ["gibel-i-vyplaty-seme",0],["gibel-i-vyplaty-seme",1],
 ["ranenie-travma-gospital",0],["ranenie-travma-gospital",4],["ranenie-travma-gospital",5],
 ["denezhnoe-dovolstvie",0],["denezhnoe-dovolstvie",1],
 ["vyplaty-za-uchastie-v-svo",0],["vyplaty-za-uchastie-v-svo",3]
];
for(const [topic,index] of nextBatch) {
 const entry=getMilitaryProvisionCheck(topic,index);
 assert(entry,"Missing researched case: "+topic+"/"+index);
 assert(entry.provisions.every(p=>p.textUrl.startsWith("https://")),"Invalid published text URL");
 assert(entry.caution.length>40,"Missing limitation "+topic+"/"+index);
}
for(const index of [0,1,2,3,4,5]){
 const leave=getMilitaryProvisionCheck("otpusk-voennosluzhashchego",index);
 assert(leave,"Missing leave legal case "+index);
 assert(leave.provisions.some(p=>p.article.startsWith("статья 11")));
 assert(leave.provisions.every(p=>p.act.includes("76-ФЗ")));
 assert.equal(leave.officialTextVerified,false);
}
assert(getMilitaryProvisionCheck("otpusk-voennosluzhashchego",1)!.provisions[0].applicability.includes("30, 35, 40 либо 45"));
assert(getMilitaryProvisionCheck("otpusk-voennosluzhashchego",2)!.provisions[0].applicability.includes("до 10 суток"));
const mHealth=getMilitaryProvisionCheck("mobilizaciya",4)!;
assert(mHealth.provisions.some(p=>p.applicability.includes("шести месяцев")));
assert(!mHealth.provisions.some(p=>p.applicability.includes("до одного года")));
const benefits=getMilitaryProvisionCheck("vyplaty-za-uchastie-v-svo",3)!;
assert(benefits.provisions.some(p=>p.applicability.includes("после получения всех необходимых документов")));
assert(benefits.caution.includes("30 дней"));
assert(getMilitaryProvisionCheck("gibel-i-vyplaty-seme",0)!.provisions.some(p=>p.act.includes("52-ФЗ")));
assert(nextBatch.every(([topic,index])=>getMilitaryProvisionCheck(topic,index)!.officialTextVerified===false));
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
 assert(/пункт(?:ом|а) 8 Положения/.test(candidate.requestText));
 assert(candidate.requestText.includes("вышестоящую военно-врачебную комиссию"));
 assert(candidate.factsPrompt.includes("заключения ВВК"));
}
assert(MILITARY_LEGAL_AUDIT_REFERENCE_LINKS.article35_3.startsWith("https://"));
console.log(JSON.stringify({...coverage,staleGovReprintsFlagged:excerpt.length,wrongDecisionCopyGeneratorRemoved:true}));

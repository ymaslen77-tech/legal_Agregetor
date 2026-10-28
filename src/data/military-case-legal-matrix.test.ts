import assert from "node:assert/strict";
import { MILITARY_TOPICS } from "@/data/military-catalog";
import { getMilitaryLegalCaseCard, MILITARY_LEGAL_CASE_CARDS } from "@/data/military-case-legal-matrix";

assert.equal(MILITARY_TOPICS.length,20);
assert.equal(MILITARY_LEGAL_CASE_CARDS.length,143);
const keys=new Set<string>();let draft=0,pending=0,documents=0;
for(const topic of MILITARY_TOPICS){
  for(let i=0;i<topic.situations.length;i++){
    const situation=topic.situations[i];
    const card=getMilitaryLegalCaseCard(topic.slug,situation.title);
    assert(card, "Missing card: "+topic.slug+"/"+situation.slug);
    assert.equal(card.topicTitle,topic.title);
    assert.equal(card.situationIndex,i);
    assert.equal(card.situationKind,situation.kind);
    const key=card.topicSlug+"|"+card.situationTitle;
    assert(!keys.has(key),"Duplicate legal work card: "+key);keys.add(key);
    assert.equal(card.legalReviewConfirmed,false);
    assert.equal(card.officialPublicationChecked,false);
    assert.equal(card.reviewedAt,null);
    if(situation.kind!=="information") documents++;
    if(card.status==="EDITORIAL_CASE_DRAFT"){
      draft++;
      assert(card.legalQuestion && card.legalQuestion.length>35);
      assert(card.evidenceToConfirm && card.evidenceToConfirm.length>25);
      assert(card.competentRecipientToVerify && card.competentRecipientToVerify.length>15);
      assert(card.plannedResultToVerify && card.plannedResultToVerify.length>15);
      assert(card.criticalLimitations && card.criticalLimitations.length>30);
      assert(card.sourceCandidates.length>=1);
      assert(card.sourceCandidates.every(s=>s.id && s.title && s.url.startsWith("https://")));
    }else{
      pending++;
      assert.equal(card.status,"AWAITING_INDIVIDUAL_REVIEW");
      assert.equal(card.legalQuestion,null);
      assert.equal(card.evidenceToConfirm,null);
      assert.equal(card.sourceCandidates.length,0);
    }
  }
}
assert.equal(keys.size,143);
assert.equal(documents,121);
assert.equal(draft,43);
assert.equal(pending,100);
console.log(JSON.stringify({categories:20,cases:143,caseSpecificEditorialDrafts:draft,pending,legalReviewed:0}));

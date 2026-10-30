import assert from "node:assert/strict";
import { MILITARY_TOPICS } from "@/data/military-catalog";
import { MILITARY_LEGAL_CASE_CARDS } from "@/data/military-case-legal-matrix";
import { getMilitaryDocumentCandidate } from "@/data/military-document-candidates";
import {
  MILITARY_DOCUMENT_TARGETS,
  getMilitaryDocumentTarget,
  getMilitaryDocumentTargetCoverage
} from "@/data/military-document-target-matrix";

const coverage=getMilitaryDocumentTargetCoverage();
assert.equal(coverage.categories,20);
assert.equal(coverage.situations,143);
assert.equal(coverage.informationOnly,22);
assert.equal(coverage.documentSituations,121);
assert.equal(coverage.plannedDocumentTargets,121);
assert.equal(coverage.conditionalAlternativeTargets,38);
assert.equal(coverage.draftPrototypes,18);
assert.equal(coverage.legallyApproved,0);
assert(coverage.byCategory.every(c=>c.planned===c.required));

const unique=new Set<string>();
const uniqueSlugs=new Set<string>();
for(const topic of MILITARY_TOPICS)for(const [i,situation] of topic.situations.entries()){
 const t=getMilitaryDocumentTarget(topic.slug,situation.slug);
 if(situation.kind==="information"){
   assert.equal(t,null,"Information case must not have a mandatory generator "+situation.slug);
   continue;
 }
 assert(t,"Missing individual document target "+topic.slug+":"+i);
 assert.equal(t.situationIndex,i);
 assert.equal(t.categorySlug,topic.slug);
 assert.equal(t.situationSlug,situation.slug);
 assert.equal(t.situationTitle,situation.title);
 assert.equal(t.situationKind,situation.kind);
 assert(t.documentTitle.length>15 && !t.documentTitle.includes("Информация без генератора"));
 assert(t.documentSlug.length<180);
 assert(t.legalQuestionToVerify.length>25);
 assert(t.recipientToVerify.length>12);
 assert(t.caseSpecificEvidenceToConfirm.length>10);
 assert(t.selectionGuard.length>20);
 assert(t.draftObjectiveToVerify.length>18);
 assert.equal(t.generationEnabled,false);
 assert.equal(t.filingReady,false);
 assert.equal(t.requiresLegalReview,true);
 assert.equal(t.selectedSituationIsImplicit,true);
 assert.equal(t.status,"EDITORIAL_TARGET_PENDING_LEGAL_REVIEW");
 const match=MILITARY_LEGAL_CASE_CARDS.find(card=>card.topicSlug===topic.slug&&card.situationIndex===i);
 assert(match);
 assert.equal(match.legalReviewConfirmed,false);
 assert.equal(t.existingDraftPrototype,Boolean(getMilitaryDocumentCandidate(topic,situation)));
 const key=topic.slug+":"+i;
 assert(!unique.has(key),"Duplicate target for case "+key);
 unique.add(key);
 assert(!uniqueSlugs.has(t.documentSlug),"Duplicate future document slug "+t.documentSlug);
 uniqueSlugs.add(t.documentSlug);
}
assert.equal(unique.size,121);
assert.equal(uniqueSlugs.size,121);

const prisonCase=MILITARY_DOCUMENT_TARGETS.find(x=>x.categorySlug==="samovolnoe-ostavlenie-chasti" && x.situationIndex===4)!;
assert.equal(prisonCase.primaryKind,"PROCEDURAL_MOTION");
assert.equal(prisonCase.conditionalAlternativeKind,"PROCEDURAL_COMPLAINT");
const vitalCare=MILITARY_DOCUMENT_TARGETS.find(x=>x.categorySlug==="ranenie-travma-gospital" && x.situationIndex===1)!;
assert.equal(vitalCare.primaryKind,"RAPORT");
assert(vitalCare.documentTitle.includes("не вместо экстренной помощи"));
const excerpt=MILITARY_DOCUMENT_TARGETS.find(x=>x.categorySlug==="prizyv" && x.situationIndex===4)!;
assert.equal(excerpt.primaryKind,"APPLICATION");
assert(excerpt.documentTitle.includes("выписки из протокола"));
const refusal=MILITARY_DOCUMENT_TARGETS.find(x=>x.categorySlug==="otsrochka-ot-sluzhby" && x.situationIndex===4)!;
assert.equal(refusal.primaryKind,"COMPLAINT");
assert.equal(refusal.conditionalAlternativeKind,"ADMINISTRATIVE_CLAIM");
const missing=MILITARY_DOCUMENT_TARGETS.find(x=>x.categorySlug==="gibel-i-vyplaty-seme" && x.situationIndex===4)!;
assert(missing.draftObjectiveToVerify.includes("суд"));
assert.equal(missing.generationEnabled,false);
console.log(JSON.stringify(coverage));

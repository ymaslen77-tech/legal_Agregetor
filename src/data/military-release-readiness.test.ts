import assert from "node:assert/strict";
import { MILITARY_TOPICS } from "@/data/military-catalog";
import { getMilitaryReleaseReadiness } from "@/data/military-release-readiness";
import { getMilitaryDocumentCandidate } from "@/data/military-document-candidates";

const readiness = getMilitaryReleaseReadiness();
assert.equal(readiness.total.categories, 20);
assert.equal(readiness.total.situations, 143);
assert.equal(readiness.total.documentRequired, 121);
assert.equal(readiness.total.draftGenerators, 18);
assert.equal(readiness.total.missingDraftGenerators, 103);
assert.equal(readiness.total.internalDraftPrototypes, 121);
assert.equal(readiness.total.missingInternalDraftPrototypes, 0);
assert(readiness.categories.every(x=>x.internalDraftPrototypes===x.documentRequired));
assert.equal(readiness.total.legallyReviewed, 0);
assert.equal(readiness.catalogDeployable,true,"Editorial catalog can deploy with noindex and guarded previews");
assert.equal(readiness.sourceAcceptance.manualSignOffRequired,false);
assert.equal(readiness.sourceAcceptance.globalSourceGateBlocksCatalog,false);
assert.equal(readiness.sourceAcceptance.checkedClaims,0);
assert.equal(readiness.sourceAcceptance.automaticallyVerifiedCases,0);
assert.equal(readiness.sourceAcceptance.pendingCases,143);
assert.equal(readiness.total.sourceVerified,0);
assert.equal(readiness.total.sourcePending,143);
assert.equal(readiness.total.sourceConflicts,0);
assert.equal(readiness.legalGate.plannedCases,143);
assert.equal(readiness.legalGate.plannedProvisions,143);
assert.equal(readiness.legalGate.plannedDocuments,121);
assert.equal(readiness.legalGate.individualCasesApproved,0);
assert.equal(readiness.legalGate.provisionTextsOfficiallyVerified,0);
assert.equal(readiness.legalGate.documentTargetsApproved,0);
assert.equal(readiness.productionReady, false);

const requestedTexts = new Set<string>();
for (const topic of MILITARY_TOPICS) {
  for (const situation of topic.situations) {
    const candidate = getMilitaryDocumentCandidate(topic, situation);
    if (!candidate) continue;
    assert(!requestedTexts.has(candidate.requestText), "Duplicate demand: " + situation.slug);
    assert(candidate.factsPrompt.length > 30);
    requestedTexts.add(candidate.requestText);
  }
}
assert.equal(requestedTexts.size, 18);
console.log(JSON.stringify({ releaseReady: readiness.productionReady, ...readiness.total }));

import assert from "node:assert/strict";
import { CREDIT_DEBT_GROUPS } from "@/data/credit-debt-route-plan";
import { CREDIT_DEBT_CHECKED_CONTEXT } from "@/data/credit-debt-verified-context";
import { getCreditDebtAcceptanceItem } from "@/data/credit-debt-acceptance-matrix";
import { getCreditDebtLegalReview } from "@/data/credit-debt-legal-review";
import { getCreditDebtDocumentPlan } from "@/lib/credit-debt-document-core";
import { getCreditDebtSeoEntry } from "@/data/credit-debt-seo";

/**
 * Independent release inventory. Source counts are CONTEXTUAL ONLY:
 * they can never certify a situation, a document or even an individual claim.
 * Failing closed is intentional until the substantive legal review is complete.
 */
type AuditRow = {
  key: string;
  contextClaims: number;
  contextClaimsWithThreePublishers: number;
  sourceCandidatePublishers: number;
  acceptedSituationClaims: number;
  legalStatus: "PENDING";
  filingReady: false;
  indexable: false;
};
const rows: AuditRow[] = [];
const reviewedContextIds = new Set<string>();
for (const group of CREDIT_DEBT_GROUPS) {
  for (const situation of group.situations) {
    const key = group.id + "/" + situation.id;
    const acceptance = getCreditDebtAcceptanceItem(group.id, situation.id);
    const review = getCreditDebtLegalReview(group.id, situation.id);
    const plan = getCreditDebtDocumentPlan(group.id, situation.id);
    const seo = getCreditDebtSeoEntry(group.id, situation.id);
    assert.ok(acceptance && plan && seo, key);
    const contextual = CREDIT_DEBT_CHECKED_CONTEXT.filter(x => x.appliesTo.includes(key));
    contextual.forEach(x => reviewedContextIds.add(x.id));
    const row: AuditRow = {
      key,
      contextClaims: contextual.length,
      contextClaimsWithThreePublishers: contextual.filter(x =>
        new Set(x.sources.map(s => s.publisher.trim().toLowerCase())).size >= 3
      ).length,
      sourceCandidatePublishers: new Set(review.candidateSources.map(s =>
        s.publisher.trim().toLowerCase()
      )).size,
      acceptedSituationClaims: review.acceptedLegalClaims.length,
      legalStatus: acceptance.status,
      filingReady: plan.filingReady,
      indexable: seo.indexable
    };
    assert.equal(row.legalStatus, "PENDING", key);
    assert.equal(row.acceptedSituationClaims, 0, key);
    assert.equal(row.filingReady, false, key);
    assert.equal(row.indexable, false, key);
    rows.push(row);
  }
}
assert.equal(rows.length, 60);
assert.equal(new Set(rows.map(x => x.key)).size, 60);
assert.equal(reviewedContextIds.size, CREDIT_DEBT_CHECKED_CONTEXT.length);
const summary = {
  date: "2026-11-12",
  totalSituations: rows.length,
  legallyAccepted: rows.filter(x => x.acceptedSituationClaims > 0).length,
  pending: rows.filter(x => x.legalStatus === "PENDING").length,
  contextsReferenced: reviewedContextIds.size,
  contextsWithThreePublishers: CREDIT_DEBT_CHECKED_CONTEXT.filter(x =>
    new Set(x.sources.map(s => s.publisher.trim().toLowerCase())).size >= 3
  ).length,
  noContextSituations: rows.filter(x => x.contextClaims === 0).length,
  releaseBlocked: true,
  rows
};
console.log("CREDIT_DEBT_RELEASE_AUDIT=" + JSON.stringify(summary));

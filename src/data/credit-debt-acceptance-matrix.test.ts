import assert from "node:assert/strict";
import { CREDIT_DEBT_GROUPS } from "@/data/credit-debt-route-plan";
import { CREDIT_DEBT_DOCUMENT_TARGETS } from "@/data/credit-debt-document-targets";
import { CREDIT_DEBT_ACCEPTANCE_ITEMS, getCreditDebtAcceptanceItem } from "@/data/credit-debt-acceptance-matrix";
import { getCreditDebtDocumentPlan } from "@/lib/credit-debt-document-core";
import { getCreditDebtSeoEntry } from "@/data/credit-debt-seo";

const keys=CREDIT_DEBT_GROUPS.flatMap(g=>g.situations.map(s=>g.id+"/"+s.id));
assert.equal(keys.length,60);
assert.equal(new Set(keys).size,60);
assert.equal(CREDIT_DEBT_ACCEPTANCE_ITEMS.length,60);
assert.equal(new Set(CREDIT_DEBT_ACCEPTANCE_ITEMS.map(x=>x.key)).size,60);
assert.deepEqual(new Set(CREDIT_DEBT_ACCEPTANCE_ITEMS.map(x=>x.key)),new Set(keys));
for(const target of CREDIT_DEBT_DOCUMENT_TARGETS){
  const acceptance=getCreditDebtAcceptanceItem(target.groupId,target.situationId);
  assert.ok(acceptance,target.key);
  assert.equal(acceptance?.key,target.key);
  assert.equal(acceptance?.status,"PENDING",target.key);
  assert.equal(acceptance?.documentKind,target.targetResult,target.key);
  assert.equal(acceptance?.recipientCandidate,target.recipientHint,target.key);
  assert.equal(acceptance?.independentSourcesRequired,3,target.key);
  assert.ok((acceptance?.reviewFocus.length??0)>=40,target.key);
  assert.ok((acceptance?.mandatoryChecks.length??0)>=8,target.key);
  assert.equal(acceptance?.filingReady,false,target.key);
  assert.equal(acceptance?.indexable,false,target.key);
  assert.equal(getCreditDebtDocumentPlan(target.groupId,target.situationId)?.filingReady,false,target.key);
  assert.equal(getCreditDebtSeoEntry(target.groupId,target.situationId)?.indexable,false,target.key);
}
assert.match(getCreditDebtAcceptanceItem("bankruptcy","out-of-court-mfc")?.reviewFocus??"",/исполнительные документы/);
assert.match(getCreditDebtAcceptanceItem("court-debt","court-order-objection")?.reviewFocus??"",/дату получения/);
assert.match(getCreditDebtAcceptanceItem("mortgage","mortgage-holidays")?.reviewFocus??"",/6\.1-1/);
assert.match(getCreditDebtAcceptanceItem("microloans","microloan-rate")?.reviewFocus??"",/дату/);
console.log("OK: 60 individual legal QA focus entries; 3 sources required; all filing and SEO gates remain closed.");

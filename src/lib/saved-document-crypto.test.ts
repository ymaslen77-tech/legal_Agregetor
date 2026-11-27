import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { createFamilyAIDraftDocumentResult } from "@/lib/document-result-contract";
import { decryptSavedDocument, encryptSavedDocument } from "@/lib/saved-document-crypto";
import { validateSavedDocument } from "@/lib/saved-document-validation";
import { createRealEstateDraftPrototype,reviseRealEstateDraft } from "@/lib/real-estate-document-core";
import { getRealEstateIntakeSpec } from "@/lib/real-estate-intake";

process.env.DOCUMENT_STORAGE_KEY = randomBytes(32).toString("base64");
const original = createFamilyAIDraftDocumentResult({
  routeSlug: "roditeli-i-rebenok-posle-razvoda",
  scenarioKey: "residence",
  documentSlug: "mesto-zhitelstva-rebenka-posle-razvoda",
  documentTitle: "Конфиденциальные сведения",
  documentText: "Личные данные заявителя и ребёнка",
  usedRuleIds: [], placeholders: [], legalReviewedAt: "2026-10-09"
});
assert.equal(validateSavedDocument(original)?.versionId, original.versionId);
assert.equal(validateSavedDocument({ ...original, scenarioKey: "unknown-scenario" }), null);
assert.equal(validateSavedDocument({ ...original, documentSlug: "unknown-document" }), null);
assert.equal(validateSavedDocument({ ...original, filingReady: true }), null);
const first = encryptSavedDocument(original, "owner-A");
const second = encryptSavedDocument(original, "owner-A");
assert.notEqual(first, second, "Every version encryption requires a fresh nonce");
assert.ok(!first.includes(original.documentText) && !first.includes(original.documentTitle));
assert.deepEqual(decryptSavedDocument(first, "owner-A", original.versionId), original);
assert.throws(() => decryptSavedDocument(first, "owner-B", original.versionId), "Wrong user must not decrypt");
assert.throws(() => decryptSavedDocument(first, "owner-A", crypto.randomUUID()), "Wrong version must not decrypt");
const modified = first.slice(0, -2) + (first.endsWith("Q") ? "AA" : "QQ");
assert.throws(() => decryptSavedDocument(modified, "owner-A", original.versionId), "Tampering must be rejected");
const spec=getRealEstateIntakeSpec("property-transactions","seller-no-transfer");
assert.ok(spec);
const answers:Record<string,string>={};
for(const field of spec.fields)if(field.required)answers[field.key]=field.kind==="choice"?field.choices![0]:"Синтетические данные для проверки архива";
Object.assign(answers,{role:"покупатель",saleContract:"договор от 01.10.2026",saleObject:"условный объект",saleDueDate:"2026-10-15",saleBreachConfirmed:"да",handoverAct:"нет",handoverPossession:"нет"});
const draft=createRealEstateDraftPrototype({groupId:"property-transactions",situationId:"seller-no-transfer",values:answers});
const revision=reviseRealEstateDraft(draft,draft.documentResult.documentText+"\nТестовая редакторская пометка.");
assert.notEqual(draft.documentResult.versionId,revision.documentResult.versionId);
const encryptedDraft=encryptSavedDocument(draft.documentResult,"real-estate-owner");
const encryptedRevision=encryptSavedDocument(revision.documentResult,"real-estate-owner");
assert.deepEqual(decryptSavedDocument(encryptedDraft,"real-estate-owner",draft.documentResult.versionId),draft.documentResult);
assert.deepEqual(decryptSavedDocument(encryptedRevision,"real-estate-owner",revision.documentResult.versionId),revision.documentResult);
assert.throws(()=>decryptSavedDocument(encryptedDraft,"other-owner",draft.documentResult.versionId));
assert.throws(()=>decryptSavedDocument(encryptedDraft,"real-estate-owner",revision.documentResult.versionId));
assert.equal(validateSavedDocument(draft.documentResult,{NODE_ENV:"production",ENABLE_REAL_ESTATE_PERSISTENCE:"true"}),null,"Unreleased archive intake remains blocked; crypto roundtrip alone is not public acceptance.");
delete process.env.DOCUMENT_STORAGE_KEY;
assert.throws(() => encryptSavedDocument(original, "owner-A"), "No weak fallback key in production or development");
console.log("Encrypted document archive: authenticated decryption, tamper checks and key requirement passed.");

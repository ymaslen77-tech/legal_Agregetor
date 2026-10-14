import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { createFamilyAIDraftDocumentResult } from "@/lib/document-result-contract";
import { decryptSavedDocument, encryptSavedDocument } from "@/lib/saved-document-crypto";

process.env.DOCUMENT_STORAGE_KEY = randomBytes(32).toString("base64");
const original = createFamilyAIDraftDocumentResult({
  routeSlug: "roditeli-i-rebenok-posle-razvoda",
  scenarioKey: "residence",
  documentSlug: "mesto-zhitelstva-rebenka-posle-razvoda",
  documentTitle: "Конфиденциальные сведения",
  documentText: "Личные данные заявителя и ребёнка",
  usedRuleIds: [], placeholders: [], legalReviewedAt: "2026-10-09"
});
const first = encryptSavedDocument(original, "owner-A");
const second = encryptSavedDocument(original, "owner-A");
assert.notEqual(first, second, "Every version encryption requires a fresh nonce");
assert.ok(!first.includes(original.documentText) && !first.includes(original.documentTitle));
assert.deepEqual(decryptSavedDocument(first, "owner-A", original.versionId), original);
assert.throws(() => decryptSavedDocument(first, "owner-B", original.versionId), "Wrong user must not decrypt");
assert.throws(() => decryptSavedDocument(first, "owner-A", crypto.randomUUID()), "Wrong version must not decrypt");
const modified = first.slice(0, -2) + (first.endsWith("Q") ? "AA" : "QQ");
assert.throws(() => decryptSavedDocument(modified, "owner-A", original.versionId), "Tampering must be rejected");
delete process.env.DOCUMENT_STORAGE_KEY;
assert.throws(() => encryptSavedDocument(original, "owner-A"), "No weak fallback key in production or development");
console.log("Encrypted document archive: authenticated decryption, tamper checks and key requirement passed.");

import assert from "node:assert/strict";
import { LABOR_DOCUMENTS, getLaborDocumentScenario } from "@/data/labor-documents";
import { buildLaborDocumentFields, validateLaborDocumentFacts } from "@/lib/labor-document-fields";

assert.equal(LABOR_DOCUMENTS.length, 50);

for (const document of LABOR_DOCUMENTS) {
  const selected = getLaborDocumentScenario(document.slug);
  assert.ok(selected, `${document.slug}: missing route/scenario`);
  const fields = buildLaborDocumentFields(selected);
  const facts = fields.map((field, index) => ({
    key: field.key,
    label: field.label,
    value: field.kind === "date" ? "2026-10-15" : `Подтверждённое значение ${index + 1}`
  }));

  assert.equal(new Set(fields.map((field) => field.key)).size, fields.length, document.slug);
  assert.equal(validateLaborDocumentFacts(selected, facts)?.length, facts.length, document.slug);
  assert.deepEqual(validateLaborDocumentFacts(selected, [...facts].reverse()), facts, document.slug);
  assert.equal(validateLaborDocumentFacts(selected, facts.slice(1)), null, `${document.slug}: missing field`);
  assert.equal(validateLaborDocumentFacts(selected, [...facts, facts[0]]), null, `${document.slug}: duplicate field`);
  assert.equal(validateLaborDocumentFacts(selected, facts.map((f, i) => i === 0 ? { ...f, key: "unrecognized" } : f)), null, `${document.slug}: foreign field`);
  assert.equal(validateLaborDocumentFacts(selected, facts.map((f, i) => i === 0 ? { ...f, label: "Подменённый вопрос" } : f)), null, `${document.slug}: changed label`);
  assert.equal(validateLaborDocumentFacts(selected, facts.map((f, i) => i === 0 ? { ...f, value: "  " } : f)), null, `${document.slug}: empty required value`);

  for (const invalid of ["2026-02-30", "2025-02-29", "2026-13-01", "2026-10-15T12:00:00Z", "15.10.2026", "0000-01-01"]) {
    assert.equal(validateLaborDocumentFacts(selected, facts.map((f) => f.key === "documentDate" ? { ...f, value: invalid } : f)), null, `${document.slug}: bad date ${invalid}`);
  }
  assert.ok(validateLaborDocumentFacts(selected, facts.map((f) => f.key === "documentDate" ? { ...f, value: "2024-02-29" } : f)), `${document.slug}: valid leap date`);
}

console.log("Labor request completeness and provenance: 50/50 scenarios, missing/duplicate/forged/empty/date cases passed.");

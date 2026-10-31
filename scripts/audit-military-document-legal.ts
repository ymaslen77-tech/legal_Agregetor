/**
 * A 121-document technical and legal-evidence audit.
 *
 * The script renders every draft with synthetic facts, checks basic document
 * completeness and records legal source gaps. It NEVER certifies correctness
 * of statutes, plenums, case jurisdiction, competence or filing readiness.
 *
 * Usage:
 *   npx tsx scripts/audit-military-document-legal.ts
 *   npx tsx scripts/audit-military-document-legal.ts --strict
 */
import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { MILITARY_TOPICS } from "../src/data/military-catalog";
import { MILITARY_DOCUMENT_TARGETS } from "../src/data/military-document-target-matrix";
import { MILITARY_LEGAL_CASE_CARDS } from "../src/data/military-case-legal-matrix";
import { MILITARY_PROVISION_CHECKS } from "../src/data/military-provision-checks";
import { getMilitarySourceStatus } from "../src/data/military-source-verification";
import { getMilitaryDraftPlan, createMilitaryDraftPrototype } from "../src/data/military-document-core";
import { militaryDraftExportText } from "../src/lib/military-document-export";

const reportDir = "reports/military-legal-qa";
const rows = [];
const normativeCitation = /(?:стать[ьяиюеи]|пункт[уае]?|част[ьиью])\s*\d+.{0,180}(?:№\s*\d+[-–][А-Яа-я\d]+|Федеральн|КАС|ГПК|Указ|постановлени)|(?:№\s*\d+[-–][А-Яа-я\d]+|Федеральн|КАС|ГПК|Указ|постановлени).{0,180}(?:стать[ьяиюеи]|пункт[уае]?|част[ьиью])\s*\d+/i;
const plenumReference = /Пленум[а-я\s]*Верховного\s+Суда|Постановлени[ея]\s+Пленума/i;
const isProcedural = (kind: string) => ["ADMINISTRATIVE_CLAIM", "CIVIL_CLAIM", "PROCEDURAL_APPEAL", "PROCEDURAL_COMPLAINT", "PROCEDURAL_MOTION"].includes(kind);

for (const target of MILITARY_DOCUMENT_TARGETS) {
  const topic = MILITARY_TOPICS.find(x => x.slug === target.categorySlug)!;
  const situation = topic.situations[target.situationIndex];
  const plan = getMilitaryDraftPlan(target.categorySlug, target.situationSlug)!;
  assert(plan && situation && situation.slug === target.situationSlug);
  const values: Record<string,string> = Object.fromEntries(plan.requiredInputs.map(field =>
    [field.key, "Проверочные синтетические данные для " + field.label + " от 31 октября 2026 года"]
  ));
  values.applicant = "Иванов Иван Иванович, заявитель (синтетические данные)";
  values.recipient = "В уполномоченный орган (компетенцию уточнить)";
  values.facts = "Синтетическая ситуация: документ № 7, получен 31 октября 2026 года. Прошу проверить законность решения.";
  const result = createMilitaryDraftPrototype({
    categorySlug: target.categorySlug, situationSlug: target.situationSlug,
    versionId:"550e8400-e29b-41d4-a716-446655440000",
    createdAt:"2026-10-31T10:00:00.000Z",
    values
  }).documentResult;
  const text = militaryDraftExportText(result);
  const sourceStatus = getMilitarySourceStatus(target.categorySlug, target.situationIndex);
  const caseCard = MILITARY_LEGAL_CASE_CARDS.find(x =>
    x.topicSlug === target.categorySlug && x.situationIndex === target.situationIndex
  );
  const provisions = MILITARY_PROVISION_CHECKS.find(x =>
    x.topicSlug === target.categorySlug && x.situationIndex === target.situationIndex
  );
  const blockers: string[] = [];
  if (!text.includes("ЧЕРНОВИК — НЕ ГОТОВ К ПОДАЧЕ") || !text.includes(plan.documentRequest)) blockers.push("DRAFT_RENDERING_INCOMPLETE");
  if (!sourceStatus.verified) blockers.push("TWO_INDEPENDENT_SOURCES_NOT_VERIFIED");
  if (!caseCard?.legalReviewConfirmed) blockers.push("CASE_SPECIFIC_LEGAL_APPROVAL_PENDING");
  if (!result.usedRuleIds.length || !plan.verifiedLegalRules.length) blockers.push("NO_APPROVED_IN_DOCUMENT_RULES");
  if (!normativeCitation.test(text)) blockers.push("NO_SPECIFIC_STATUTORY_CITATION_IN_RENDERED_TEXT");
  if (!provisions?.provisions.length) blockers.push("NO_CASE_SPECIFIC_PROVISION_MAPPING");
  if (isProcedural(plan.kind) && !plenumReference.test(text)) blockers.push("RELEVANT_COURT_GUIDANCE_NOT_EVALUATED_IN_DOCUMENT");
  if (result.filingReady || !result.requiresLegalReview) blockers.push("INVALID_LEGAL_SAFETY_STATUS");
  rows.push({
    categorySlug:target.categorySlug, situationSlug:target.situationSlug,
    title:plan.title, kind:plan.kind,
    generated:Boolean(result.documentText.length && text.length),
    exportMarkedDraft:text.startsWith("ПРОЕКТ — НЕ ГОТОВ К ПОДАЧЕ."),
    normativeCitationDetected:normativeCitation.test(text),
    plenumMentioned:plenumReference.test(text),
    evidenceStatus:sourceStatus.verdict,
    verifiedEvidenceCount:sourceStatus.acceptedEvidence,
    provisionalProvisionCount:provisions?.provisions.length??0,
    candidateSources:(caseCard?.sourceCandidates??[]).map(s=>({title:s.title,url:s.url,status:s.type})),
    provisionalProvisions:(provisions?.provisions??[]).map(p=>({act:p.act,article:p.article,textUrl:p.textUrl,applicability:p.applicability})),
    blockers
  });
}

assert.equal(rows.length,121,"Every planned document must be audited");
assert.equal(new Set(rows.map(x=>x.categorySlug+"|"+x.situationSlug)).size,121);
const blockersCount = rows.filter(x=>x.blockers.length>0).length;
const summary = {
  date:"2026-10-31",scope:"All 121 published military-law draft generators",
  docsAudited:rows.length,
  generated:rows.filter(x=>x.generated).length,
  exportMarkedDraft:rows.filter(x=>x.exportMarkedDraft).length,
  citationsPresent:rows.filter(x=>x.normativeCitationDetected).length,
  fullySourceVerified:rows.filter(x=>x.evidenceStatus==="VERIFIED_OFFICIAL"||x.evidenceStatus==="VERIFIED_REPUTABLE").length,
  provisionalProvisionMapping:rows.filter(x=>x.provisionalProvisionCount>0).length,
  blockedFromLegallyApprovedLabel:blockersCount,
  meaning:"Technical rendering is not legal validation. Candidate legal provisions are not verified citations."
};
mkdirSync(reportDir,{recursive:true});
writeFileSync(reportDir+"/result.json",JSON.stringify({summary,rows},null,2)+"\n");
const table=rows.map(x=>`| ${x.categorySlug} / ${x.situationSlug} | ${x.generated?"yes":"no"} | ${x.normativeCitationDetected?"yes":"no"} | ${x.verifiedEvidenceCount} | ${x.blockers.join(", ")} |`).join("\n");
writeFileSync(reportDir+"/result.md",[
"# Аудит юридических проектов военного права — 31.10.2026",
"Автоматически сформированные проекты (не юридическое заключение).",
"Проверка актуальности правовых норм, полномочий, судебной практики и фактов дела требует независимой сверки.",
"Постановления Пленума применяются только при соответствующем процессуальном и фактическом основании; ссылку без проверки не вставлять.",
"",
"## Итоги",
"```json",JSON.stringify(summary,null,2),"```",
"",
"| Ситуация | Сформирован | Есть точная нормативная ссылка в тексте | Подтверждённых источников | Незакрытые требования |",
"| --- | --- | --- | ---: | --- |",
table,""
].join("\n"));
console.log(JSON.stringify(summary,null,2));
console.log("Files: "+reportDir+"/result.json, "+reportDir+"/result.md");
if (process.argv.includes("--strict") && blockersCount>0) {
  console.error("LEGAL RELEASE GATE BLOCKED: "+blockersCount+" documents require per-case verification");
  process.exitCode=1;
}

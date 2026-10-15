import assert from "node:assert/strict";
import { getLaborRulesForArea, getLaborRulesForScenario } from "@/data/labor-legal-sources";
import { getLaborDocumentScenario, LABOR_DOCUMENTS } from "@/data/labor-documents";
import { LABOR_ROUTES } from "@/data/labor-routes";
import { buildLaborDocumentExportText } from "@/lib/labor-document-export";
import { buildLaborDocumentPrompts, validateLaborDocumentModelResult } from "@/lib/labor-document-contract";

const laborScenarios = LABOR_ROUTES.flatMap((route) => route.scenarios);
assert.equal(laborScenarios.length, 50);
assert.equal(laborScenarios.filter((scenario) => !scenario.documentSlug).length, 0);
assert.equal(LABOR_DOCUMENTS.length, laborScenarios.length);
assert.equal(new Set(LABOR_DOCUMENTS.map((document) => document.slug)).size, laborScenarios.length);
for (const scenario of laborScenarios) {
  assert.ok(scenario.documentSlug && getLaborDocumentScenario(scenario.documentSlug));
}

for (const document of LABOR_DOCUMENTS) {
  const configured = getLaborDocumentScenario(document.slug);
  assert.ok(configured);
  const configuredRules = getLaborRulesForArea(configured.route.areaId);
  assert.ok(configuredRules.length > 0);
  // Use an actual legal article, never a number from an amendment date.
  const configuredRule = configuredRules.find((candidate) =>
    candidate.provisions.some((provision) => /(?:стать(?:я|и|е|ю|ей|ям|ях|ями)|ст\.)\s*\d/iu.test(provision))
  );
  assert.ok(configuredRule, `${document.slug}: official rule with a real article required`);
  const article = configuredRule.provisions.join(" ").match(/(?:стать(?:я|и|е|ю|ей|ям|ях|ями)|ст\.)\s*(\d+(?:\.\d+)?)/iu)?.[1];
  assert.ok(article, `${document.slug}: could not parse cited article`);
  const checked = validateLaborDocumentModelResult({
    documentTitle: configured.scenario.resultTitle,
    draftText: `Работодателю ООО «Пример»\nот Иванова Ивана Ивановича\n\n${configured.scenario.resultTitle.toUpperCase()}\n\nПодтвержденные обстоятельства изложены заявителем. На основании статьи ${article} Трудового кодекса Российской Федерации прошу рассмотреть обращение и предоставить письменный ответ.\n\nПриложения: подтверждающие документы.\nДата: 07.10.2026\nПодпись: __________`,
    usedRuleIds: [configuredRule.id],
    placeholders: []
  }, { documentTitle: configured.scenario.resultTitle, rules: configuredRules });
  assert.equal(checked.documentTitle, configured.scenario.resultTitle);
}

const planned = getLaborDocumentScenario("zapros-osnovaniy-planiruemogo-uvolneniya");
assert.ok(planned);
const plannedRules = getLaborRulesForScenario(planned.route.areaId, planned.scenario.key, planned.scenario.legalRuleIds);
assert.deepEqual(
  new Set(plannedRules.map((rule) => rule.id)),
  new Set(["tc-62-employment-document-copies", "tc-81-employer-dismissal"]),
  "a preliminary inquiry must not cite redundancy, discipline, reinstatement or Plenum rulings by default"
);
const plannedBasis = plannedRules.find((rule) => rule.id === "tc-62-employment-document-copies");
assert.ok(plannedBasis?.url.startsWith("https://pravo.gov.ru/"));
const plannedPrompt = buildLaborDocumentPrompts({
  documentTitle: planned.scenario.resultTitle,
  documentType: "DRAFT",
  facts: [{ key: "applicant", label: "Заявитель", value: "Петров Пётр Петрович" }],
  rules: plannedRules, authority: ["Работодатель"], nextSteps: [],
  routeSlug: planned.route.slug, scenarioKey: planned.scenario.key
});
assert.match(plannedPrompt.user, /не.*обязывает заранее создать/iu);
const basePlannedText = "Работодателю ООО «Пример»\\nОт Петрова П. П.\\nЗАПРОС документов, связанных с работой\\nСсылаясь на статью 62 Трудового кодекса РФ, прошу выдать копии существующих связанных с моей работой документов, указанных в приложенном перечне.\\nДата: 15.10.2026\\nПодпись: __";
const basePlanned = {
  documentTitle: planned.scenario.resultTitle, draftText: basePlannedText,
  usedRuleIds: ["tc-62-employment-document-copies"], placeholders: []
};
assert.ok(validateLaborDocumentModelResult(basePlanned, {
  documentTitle: planned.scenario.resultTitle, rules: plannedRules,
  routeSlug: planned.route.slug, scenarioKey: planned.scenario.key
}));
assert.throws(() => validateLaborDocumentModelResult({
  ...basePlanned, draftText: basePlannedText + "\\nРаботодатель обязан предоставить письменное обоснование планируемого увольнения."
}, {
  documentTitle: planned.scenario.resultTitle, rules: plannedRules,
  routeSlug: planned.route.slug, scenarioKey: planned.scenario.key
}), /Нельзя требовать составления/, "do not invent employer duty to issue advance reasons");

const selected = getLaborDocumentScenario("trebovanie-o-vyplate-zarplaty");
assert.ok(selected);
const rules = getLaborRulesForArea(selected.route.areaId);
const rule = rules.find((item) => item.provisions.some((provision) => provision.includes("236"))) ?? rules[0];
const valid = validateLaborDocumentModelResult({
  documentTitle: selected.scenario.resultTitle,
  draftText: `Работодателю ООО «Пример»\nот Иванова Ивана Ивановича\n\n${selected.scenario.resultTitle.toUpperCase()}\n\nЗаработная плата за подтвержденный период не выплачена. На основании статьи ${rule.provisions.join(" ").match(/\d+(?:\.\d+)?/)?.[0]} Трудового кодекса Российской Федерации прошу выплатить подтвержденную задолженность.\n\nПриложения: расчетный листок.\nДата: 05.10.2026\nПодпись: __________`,
  usedRuleIds: [rule.id],
  placeholders: []
}, { documentTitle: selected.scenario.resultTitle, rules });
assert.equal(valid.usedRuleIds[0], rule.id);

const withoutGrounds = valid.draftText.replace(/На основании статьи \d+(?:\.\d+)? Трудового кодекса Российской Федерации/u, "На основании трудового законодательства");
assert.throws(
  () => validateLaborDocumentModelResult({ ...valid, draftText: withoutGrounds }, { documentTitle: selected.scenario.resultTitle, rules }),
  /отсутствует юридическое обоснование/,
  "AI cannot return a fluent request with no actual legal article"
);
assert.throws(
  () => validateLaborDocumentModelResult({
    ...valid,
    draftText: `${withoutGrounds}\nСправка после подписи: на основании статьи 236 ТК РФ.`
  }, { documentTitle: selected.scenario.resultTitle, rules }),
  /до подписи/,
  "legal basis after the signatory must not compensate for missing in-body citations"
);


const localizedKeys = validateLaborDocumentModelResult({
  название: valid.documentTitle,
  текст: valid.draftText,
  использованные_правовые_основания: valid.usedRuleIds,
  placeholders: []
}, { documentTitle: selected.scenario.resultTitle, rules });
assert.equal(localizedKeys.documentTitle, valid.documentTitle);
assert.deepEqual(localizedKeys.usedRuleIds, valid.usedRuleIds);

assert.throws(() => validateLaborDocumentModelResult({ ...valid, draftText: `${valid.draftText}\nСтатья 999 ТК РФ.` }, { documentTitle: selected.scenario.resultTitle, rules }), /неподтвержденная статья/);
const exactUsedRules = { documentTitle: selected.scenario.resultTitle, rules };
assert.ok(validateLaborDocumentModelResult({
  ...valid, draftText: `${valid.draftText}\nНа основании статей 142 и 236 Трудового кодекса РФ прошу выплатить причитающиеся суммы.`
}, exactUsedRules));
assert.throws(() => validateLaborDocumentModelResult({
  ...valid, draftText: `${valid.draftText}\nНа основании статей 142 и 999 ТК РФ заявлено требование.`
}, exactUsedRules), /неподтвержденная статья/, "catch second item in article enumeration");
assert.throws(() => validateLaborDocumentModelResult({
  ...valid, draftText: `${valid.draftText}\nНа основании статей 142, 999 ТК РФ заявлено требование.`
}, exactUsedRules), /неподтвержденная статья/, "catch comma-separated hallucinated citation");
assert.throws(() => validateLaborDocumentModelResult({
  ...valid, draftText: `${valid.draftText}\nПрименяются статьи 142–143 ТК РФ.`
}, exactUsedRules), /неподтвержденная статья/, "catch non-cited articles hidden inside a range");
assert.throws(() => validateLaborDocumentModelResult({
  ...valid, usedRuleIds: []
}, exactUsedRules), /неподтвержденная статья/, "a claimed article must be connected to an explicitly used legal rule");
assert.throws(() => validateLaborDocumentModelResult({ ...valid, draftText: `${valid.draftText}\nОтвет: да.` }, { documentTitle: selected.scenario.resultTitle, rules }), /анкетный текст/);
assert.throws(() => validateLaborDocumentModelResult({ ...valid, draftText: `${valid.draftText}\nТекст создан моделью.` }, { documentTitle: selected.scenario.resultTitle, rules }), /технический текст/);

const exportText = buildLaborDocumentExportText({ statusLabel: "ПРОЕКТ — ТРЕБУЕТСЯ ЮРИДИЧЕСКАЯ ПРОВЕРКА", documentTitle: valid.documentTitle, documentText: valid.draftText, rules: [rule], nextSteps: selected.scenario.nextSteps, reviewedAt: rule.reviewedAt });
assert.match(exportText, new RegExp(valid.documentTitle));
assert.match(exportText, /Правовые основания/);
assert.ok(exportText.includes(rule.url), "PDF/DOCX source appendix must expose a real official URL");
assert.match(exportText, /официальные источники/iu);
assert.match(exportText, /не часть обращения/iu);
assert.match(exportText, /Что делать дальше/);

console.log("Labor document contract and export parity validated.");

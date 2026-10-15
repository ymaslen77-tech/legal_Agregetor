import type { LaborDocumentScenario } from "@/data/labor-documents";
import type { LaborDocumentRequest } from "@/lib/labor-document-contract";

/**
 * Shared contract for the labor questionnaire and its server-side validation.
 * UI validation alone must never authorize a legal document generation request.
 */
export type LaborDocumentField = {
  key: string;
  label: string;
  hint: string;
  kind?: "date" | "textarea";
};

export function buildLaborDocumentFields(selected: LaborDocumentScenario): LaborDocumentField[] {
  const common: LaborDocumentField[] = [
    { key: "applicant", label: "ФИО работника или заявителя", hint: "Полностью, как в документах." },
    { key: "applicantContacts", label: "Адрес и контакты заявителя", hint: "Укажите только сведения, необходимые для документа и обратной связи." },
    { key: "employer", label: "Работодатель", hint: "Полное наименование организации или ФИО работодателя." },
    { key: "employerAddress", label: "Адрес работодателя", hint: "Юридический или подтвержденный адрес для направления документа." },
    { key: "recipient", label: "Подтвержденный адресат", hint: `Допустимый класс адресата: ${selected.scenario.authority.join(", ")}. Для суда или органа укажите точное наименование.` },
    { key: "recipientAddress", label: "Адрес получателя", hint: "Не указывайте предполагаемый адрес." },
    { key: "circumstances", label: "Подтвержденные обстоятельства", hint: "Краткая хронология с датами и документами без правовых предположений." },
    { key: "requestedOutcome", label: "Просьба или требования", hint: "Что именно должен сделать адресат." },
    { key: "attachments", label: "Приложения", hint: "Каждый документ с новой строки; если приложений нет, укажите это прямо." },
    { key: "documentDate", label: "Дата документа", hint: "Выберите дату. В генератор передаётся календарная дата в формате ГГГГ-ММ-ДД.", kind: "date" }
  ];

  return [
    ...common,
    ...selected.scenario.questions.map((label, index) => ({
      key: `scenario-${index + 1}`, label, hint: "Ответьте по имеющимся документам или переписке."
    }))
  ];
}

function isRealCalendarDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  if (year < 1900 || year > 2200 || month < 1 || month > 12 || day < 1 || day > 31) return false;
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() + 1 === month && date.getUTCDate() === day;
}

export type LaborSubmittedFact = LaborDocumentRequest["facts"][number];

/** Return facts in the canonical order only when every expected field is present exactly once. */
export function validateLaborDocumentFacts(
  selected: LaborDocumentScenario,
  facts: LaborSubmittedFact[]
): LaborSubmittedFact[] | null {
  const expected = buildLaborDocumentFields(selected);
  if (facts.length !== expected.length) return null;
  const byKey = new Map<string, LaborSubmittedFact>();
  for (const fact of facts) {
    if (byKey.has(fact.key) || !fact.value.trim()) return null;
    byKey.set(fact.key, fact);
  }
  const canonical: LaborSubmittedFact[] = [];
  for (const field of expected) {
    const fact = byKey.get(field.key);
    if (!fact || fact.label !== field.label) return null;
    if (field.kind === "date" && !isRealCalendarDate(fact.value)) return null;
    canonical.push({ key: field.key, label: field.label, value: fact.value.trim() });
  }
  return canonical;
}

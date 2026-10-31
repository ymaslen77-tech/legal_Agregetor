"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import type { DocumentResultV1 } from "@/lib/document-result-contract";
import { createMilitaryDraftPdfBlob, militaryDraftExportFileName } from "@/lib/military-document-export";

type ReviewReply = {
  ok?: boolean;
  id?: string;
  reviewStatus?: string;
  withdrawalToken?: string | null;
  message?: string;
};

export function MilitaryDraftLawyerReview({ result, disabled = false }: {
  result: DocumentResultV1;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [details, setDetails] = useState("");
  const [personalDataConsent, setPersonalDataConsent] = useState(false);
  const [transferConsent, setTransferConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [accepted, setAccepted] = useState<ReviewReply | null>(null);
  const [withdrawn, setWithdrawn] = useState(false);

  const sourcePage = `/voennoe-pravo/${result.routeSlug}/${result.scenarioKey}/`;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || disabled || accepted) return;
    if (!personalDataConsent || !transferConsent) {
      setError("Для передачи документа нужны оба отдельных согласия.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      // PDF is generated locally and is only sent when this form is submitted.
      // Never send raw facts to URL parameters, analytics, or unencrypted browser storage.
      const pdf = await createMilitaryDraftPdfBlob(result);
      if (pdf.size > 5 * 1024 * 1024) throw new Error("PDF больше допустимых 5 МБ.");
      const body = new FormData();
      body.append("attachment", pdf, militaryDraftExportFileName(result, "pdf"));
      body.append("name", name.trim());
      body.append("phone", phone.trim());
      body.append("email", email.trim());
      body.append("sourcePage", sourcePage);
      body.append("sourceType", "DOCUMENT_REVIEW");
      body.append("consent", "true");
      body.append("contactTransferConsent", "true");
      body.append("message", ("Прошу поручить профильному юристу проверку проекта: " + result.documentTitle +
        ". Проверить актуальность норм, адресата, сроки, требования и судебные разъяснения. " +
        details.trim()).slice(0, 3500));
      body.append("documentsNote", "Проект военного документа; не готов к подаче.");
      body.append("structuredPayload", JSON.stringify({
        categorySlug: "voennoe-pravo",
        routeSlug: result.routeSlug,
        situationSlug: result.scenarioKey,
        documentSlug: result.documentSlug,
        versionId: result.versionId,
        requiresLegalReview: true,
        filingReady: false
      }));
      const response = await fetch("/api/leads/", {
        method: "POST", credentials: "same-origin", cache: "no-store", body
      });
      const payload = await response.json().catch(() => null) as ReviewReply | null;
      if (!response.ok || !payload?.ok || !payload.id || !payload.withdrawalToken) {
        throw new Error(payload?.message || "Не удалось передать PDF на проверку.");
      }
      setAccepted(payload);
      setOpen(false);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Не удалось отправить документ.");
    } finally {
      setBusy(false);
    }
  }

  async function withdraw() {
    if (!accepted?.id || !accepted.withdrawalToken || busy) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`/api/leads/${encodeURIComponent(accepted.id)}/document-review/`, {
        method: "DELETE",
        credentials: "same-origin",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: accepted.withdrawalToken })
      });
      if (!response.ok) throw new Error("Не удалось отозвать согласие. Обратитесь к администратору.");
      setWithdrawn(true);
      setAccepted(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Ошибка отзыва согласия.");
    } finally {
      setBusy(false);
    }
  }

  return <section className="mt-5 border-t border-line pt-5" aria-label="Юридическая проверка документа">
    <h3 className="text-lg font-semibold text-ink">Проверка документа юристом</h3>
    <p className="mt-2 text-sm leading-6 text-zinc-700">
      Юрист проверит применимые статьи законов, актуальную редакцию, судебные разъяснения,
      требования, адресата и сроки. Это отдельная заявка, а не автоматическое юридическое одобрение.
      PDF будет передан платформе только с вашего явного согласия.
    </p>
    {accepted && !withdrawn ? <div role="status" className="mt-3 rounded-md border border-line p-4">
      <p className="font-semibold">Заявка принята платформой и ожидает назначения юриста.</p>
      <p className="mt-1 text-sm">Номер: {accepted.id}. Передача конкретному юристу ещё не подтверждена.</p>
      <p className="mt-2 text-sm">PDF хранится в закрытом хранилище до 30 дней; согласие можно отозвать.</p>
      <button type="button" disabled={busy} onClick={() => void withdraw()}
        className="mt-3 rounded-md border border-line px-4 py-2 text-sm font-semibold disabled:opacity-60">
        {busy ? "Обрабатываем…" : "Отозвать согласие и удалить PDF"}
      </button>
    </div> : null}
    {!accepted ? <>
      <button type="button" disabled={disabled || busy} onClick={() => setOpen(value => !value)}
        className="mt-4 min-h-11 rounded-md bg-trust px-5 py-3 font-semibold text-white hover:bg-ink disabled:opacity-50"
        data-testid="military-send-to-lawyer">
        Отправить документ на проверку юристу
      </button>
      {disabled ? <p className="mt-2 text-sm">Сначала сохраните новую редакцию черновика, чтобы отправить именно её.</p> : null}
      {withdrawn ? <p role="status" className="mt-2 text-sm">Согласие отозвано, переданный PDF удалён.</p> : null}
      {open && !disabled ? <form onSubmit={(event) => void submit(event)} className="mt-4 grid gap-3 rounded-lg border border-line p-4" data-testid="military-review-form">
        <label className="text-sm font-semibold">Как к вам обращаться
          <input required minLength={2} maxLength={150} value={name} onChange={e => setName(e.target.value)}
            className="mt-1 block min-h-11 w-full rounded-md border border-line px-3" autoComplete="name" />
        </label>
        <label className="text-sm font-semibold">Телефон для ответа
          <input required minLength={6} maxLength={60} value={phone} onChange={e => setPhone(e.target.value)}
            className="mt-1 block min-h-11 w-full rounded-md border border-line px-3" autoComplete="tel" type="tel" />
        </label>
        <label className="text-sm font-semibold">Email (необязательно)
          <input maxLength={160} value={email} onChange={e => setEmail(e.target.value)}
            className="mt-1 block min-h-11 w-full rounded-md border border-line px-3" autoComplete="email" type="email" />
        </label>
        <label className="text-sm font-semibold">Что особенно важно проверить? (необязательно)
          <textarea maxLength={1200} value={details} onChange={e => setDetails(e.target.value)}
            className="mt-1 block w-full rounded-md border border-line px-3 py-2" rows={3} />
        </label>
        <label className="flex items-start gap-2 text-sm">
          <input required type="checkbox" checked={personalDataConsent} onChange={e => setPersonalDataConsent(e.target.checked)} className="mt-1" />
          <span>Согласен на обработку предоставленных персональных данных для регистрации заявки.
            Ознакомился с <Link href="/legal/privacy/" className="underline">политикой конфиденциальности</Link>.</span>
        </label>
        <label className="flex items-start gap-2 text-sm">
          <input required type="checkbox" checked={transferConsent} onChange={e => setTransferConsent(e.target.checked)} className="mt-1" />
          <span>Отдельно согласен на передачу контактных данных и приложенного PDF назначенному юристу для проверки документа.</span>
        </label>
        <p className="text-xs leading-5 text-zinc-600">
          Не включайте в черновик сведения, составляющие государственную тайну, или иные данные с ограниченным законом распространением.
          Платформа примет заявку и направит её на назначение специалисту; проверка не мгновенная.
        </p>
        <button type="submit" disabled={busy} className="min-h-11 rounded-md bg-trust px-5 py-3 font-semibold text-white disabled:opacity-60">
          {busy ? "Отправляем PDF…" : "Подтвердить и отправить на проверку"}
        </button>
      </form> : null}
    </> : null}
    {error ? <p role="alert" className="mt-2 text-sm text-red-800">{error}</p> : null}
  </section>;
}

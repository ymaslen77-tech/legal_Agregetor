"use client";

import { useState } from "react";
import type { LegalDraftRequest, LegalDraftResponse } from "@/lib/legal-draft-contract";
import { documentResultSchema, type DocumentResultV1 } from "@/lib/document-result-contract";

export function LegalDraftGenerator({ input, onGenerated }: { input: LegalDraftRequest; onGenerated: (draft: string) => void }) {
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [draft, setDraft] = useState("");
  const [version, setVersion] = useState<DocumentResultV1 | null>(null);
  const [message, setMessage] = useState("");

  async function generate() {
    setStatus("loading");
    setMessage("");
    try {
      const response = await fetch("/api/legal-drafts/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(input) });
      const body = (await response.json().catch(() => null)) as { ok?: boolean; result?: LegalDraftResponse; documentResult?: DocumentResultV1; message?: string } | null;
      if (!response.ok || !body?.result) throw new Error(body?.message || "generation");
      const verifiedVersion = body.documentResult ? documentResultSchema.parse(body.documentResult) : null;
      if (verifiedVersion && (verifiedVersion.documentText !== body.result.draftText
        || verifiedVersion.scenarioKey !== input.scenario
        || input.route !== `/documents/${verifiedVersion.documentSlug}/`)) {
        throw new Error("Ошибка соответствия версии сформированного документа.");
      }
      setVersion(verifiedVersion);
      setDraft(body.result.draftText);
      onGenerated(body.result.draftText);
      setStatus("ready");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error && error.message !== "generation" ? error.message : "Не удалось сформировать текст документа. Собранные данные сохранены в текущей форме. Попробуйте ещё раз.");
    }
  }

  return (
    <section className="mt-6 border border-amber-300 bg-amber-50 p-4">
      <p className="font-semibold text-amber-950">Юридический черновик</p>
      <p className="mt-2 text-sm leading-6 text-amber-950">Для подготовки связного текста выбранные сведения передаются на защищённый сервер ПравоПоиск. Не добавляйте сведения, которые не нужны для этого документа.</p>
      {status !== "ready" ? <button type="button" onClick={generate} disabled={status === "loading"} className="mt-4 inline-flex min-h-11 items-center rounded-md bg-trust px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">{status === "loading" ? "Формируем черновик" : "Сформировать текст документа"}</button> : null}
      {version ? <p className="mt-3 break-all text-xs text-amber-950">ID исходной версии: {version.versionId}. Изменение текста вручную создаёт неподтверждённую редакцию без привязки к этому ID.</p> : null}
      {draft ? <textarea aria-label="Текст юридического черновика" value={draft} onChange={(event) => { setVersion(null); setDraft(event.target.value); onGenerated(event.target.value); }} className="mt-4 min-h-[28rem] w-full border border-line bg-white p-4 font-mono text-sm leading-6 text-ink outline-none focus:border-trust focus:ring-2 focus:ring-trust/20" /> : null}
      {message ? <p role="alert" className="mt-3 text-sm text-red-800">{message}</p> : null}
    </section>
  );
}

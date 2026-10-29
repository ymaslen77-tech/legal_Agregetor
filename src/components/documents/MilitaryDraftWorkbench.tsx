"use client";

import { useState, type FormEvent } from "react";
import type { MilitaryDraftPlan, MilitaryDraftCoreOutput } from "@/data/military-document-core";
import {
  createMilitaryDraftPrototype,
  reviseMilitaryDraftPrototype,
  addMilitaryDraftVersion
} from "@/data/military-document-core";
import type { DocumentVersionEntry } from "@/lib/document-version-history";
import { SaveLegalDocumentButton } from "@/components/documents/SaveLegalDocumentButton";
import {
  createMilitaryDraftPdfBlob,
  createMilitaryDraftDocxBlob,
  militaryDraftExportFileName
} from "@/lib/military-document-export";

/**
 * Unverified workbench rendered only behind an explicit server-side flag.
 * Never post user facts to an API and never persist them in localStorage/URLs.
 */
export function MilitaryDraftWorkbench({plan}:Readonly<{plan:MilitaryDraftPlan}>) {
  const [values,setValues]=useState<Record<string,string>>(()=>
    Object.fromEntries(plan.requiredInputs.map(field=>[field.key,""]))
  );
  const [versions,setVersions]=useState<DocumentVersionEntry<Readonly<Record<string,string>>>[]>([]);
  const [prepared,setPrepared]=useState<MilitaryDraftCoreOutput|null>(null);
  const [editedText,setEditedText]=useState("");
  const [error,setError]=useState<string|null>(null);
  const [busy,setBusy]=useState(false);

  function setField(key:string,value:string) {
    setValues(old=>({...old,[key]:value}));
    setPrepared(null);
    setEditedText("");
    setError(null);
  }
  function record(next:MilitaryDraftCoreOutput) {
    setPrepared(next);
    setEditedText(next.documentResult.documentText);
    setVersions(old=>addMilitaryDraftVersion(old,next));
    setError(null);
  }
  function generate(event:FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      record(createMilitaryDraftPrototype({
        categorySlug:plan.categorySlug,
        situationSlug:plan.situationSlug,
        values
      }));
    } catch(e) {
      setError(e instanceof Error?e.message:"Проверьте сведения для документа.");
    }
  }
  function saveRevision() {
    if(!prepared)return;
    try {
      record(reviseMilitaryDraftPrototype(prepared,editedText));
    } catch(e) {
      setError(e instanceof Error?e.message:"Не удалось сохранить исправленный проект.");
    }
  }
  function restore(version:DocumentVersionEntry<Readonly<Record<string,string>>>) {
    setValues({...version.payload});
    setPrepared({documentResult:version.documentResult,formData:version.payload});
    setEditedText(version.documentResult.documentText);
    setError(null);
  }
  async function download(format:"pdf"|"docx") {
    if(!prepared||busy)return;
    setBusy(true);
    setError(null);
    try {
      const result=prepared.documentResult;
      const blob=format==="pdf"
        ?await createMilitaryDraftPdfBlob(result)
        :await createMilitaryDraftDocxBlob(result);
      const url=URL.createObjectURL(blob);
      const a=document.createElement("a");
      a.href=url;
      a.download=militaryDraftExportFileName(result,format);
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      setError("Не удалось экспортировать черновик. Проверьте обязательные реквизиты.");
    } finally {
      setBusy(false);
    }
  }
  const labelStyle="block text-sm font-semibold text-ink";
  const inputStyle="mt-2 block w-full rounded-md border border-line px-3 py-2 text-base font-normal text-ink focus:border-trust focus:outline-none focus:ring-2 focus:ring-trust/25";
  return <section id="military-document-preparation" className="mt-8 rounded-lg border border-line bg-white p-5 sm:p-6" aria-labelledby="military-preview-heading" data-testid="military-draft-workbench">
    <p className="text-sm font-semibold uppercase text-trust">Конструктор черновиков документов</p>
    <h2 id="military-preview-heading" className="mt-2 text-xl font-semibold text-ink">{plan.title}</h2>
    <p role="status" className="mt-3 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm leading-6 text-amber-950">
      <strong>Черновик, не готовый к подаче.</strong> Проверка отдельного правового тезиса не подтверждает готовности персонального документа. Проверьте применимость нормы, срок и компетенцию адресата.
      До нажатия «Сохранить в мои документы» сведения остаются в памяти вкладки; только по вашему действию зашифрованная версия будет передана в архив учётной записи.
    </p>
    <p className="mt-3 text-sm leading-6 text-zinc-700"><strong>Предмет обращения:</strong> {plan.documentRequest}</p>
    <p className="mt-2 text-sm leading-6 text-zinc-600"><strong>Условия для проверки:</strong> {plan.competentRecipientRule}</p>
    <p className="mt-2 text-sm leading-6 text-zinc-600"><strong>Какие доказательства нужны:</strong> {plan.evidencePrompt}</p>
    {plan.conditionalAlternativeKind?<p className="mt-2 text-xs text-zinc-600">Иной вид документа возможен лишь после проверки юридических оснований и в этом конструкторе не выбирается автоматически.</p>:null}
    <form onSubmit={generate} className="mt-5 grid gap-4" data-testid="military-draft-form">
      {plan.requiredInputs.map(field=><label key={field.key} className={labelStyle}>
        <span>{field.label}{field.required?" *":""}</span>
        {field.type==="textarea"?
          <textarea className={inputStyle} rows={field.key==="facts"?5:3} required={field.required}
            minLength={field.required?(field.key==="facts"?15:5):undefined}
            maxLength={field.key==="facts"?2500:field.key==="attachments"?1500:700}
            value={values[field.key]??""} onChange={event=>setField(field.key,event.target.value)} data-field-key={field.key}/>:
          <input className={inputStyle} type="text" required={field.required}
            minLength={field.required?5:undefined} maxLength={700}
            value={values[field.key]??""} onChange={event=>setField(field.key,event.target.value)} data-field-key={field.key}/>}
      </label>)}
      <button type="submit" className="min-h-11 rounded-md bg-trust px-5 py-3 font-semibold text-white hover:bg-ink">Сформировать черновик</button>
    </form>
    {error?<p role="alert" className="mt-4 text-sm text-red-700">{error}</p>:null}
    {prepared?<section className="mt-6 border-t border-line pt-5" aria-label="Созданный черновик">
      <h3 className="text-lg font-semibold">Черновик для проверки и редактирования</h3>
      <p className="mt-2 text-xs text-zinc-500">Версия {prepared.documentResult.versionId.slice(0,8)} · {new Date(prepared.documentResult.createdAt).toLocaleString("ru-RU")}</p>
      <label className="mt-3 block text-sm font-semibold text-ink">
        Текст проекта (редактируется)
        <textarea className={inputStyle} rows={18} maxLength={38000} value={editedText} onChange={e=>setEditedText(e.target.value)} data-testid="military-draft-editor"/>
      </label>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" className="min-h-11 rounded-md border border-trust px-4 py-2 font-semibold text-trust" onClick={saveRevision} disabled={busy}>Сохранить новую версию</button>
        <button type="button" className="min-h-11 rounded-md border border-trust px-4 py-2 font-semibold text-trust disabled:opacity-60" onClick={()=>download("pdf")} disabled={busy}>Скачать PDF-черновик</button>
        <button type="button" className="min-h-11 rounded-md border border-trust px-4 py-2 font-semibold text-trust disabled:opacity-60" onClick={()=>download("docx")} disabled={busy}>Скачать DOCX-черновик</button>
      </div>
      <SaveLegalDocumentButton
        key={prepared.documentResult.versionId}
        result={prepared.documentResult}
        disabled={editedText!==prepared.documentResult.documentText}
      />
      {editedText!==prepared.documentResult.documentText?<p className="mt-2 text-xs text-amber-900">В тексте есть несохранённые изменения. Для экспорта исправленного текста сначала сохраните новую версию.</p>:null}
      <p className="mt-3 text-xs text-zinc-600">Редакция и выгруженные файлы всегда помечаются как не готовые к подаче. До юридической проверки нельзя использовать текст как окончательный документ.</p>
      {versions.length>1?<div className="mt-4 border-t border-line pt-4">
        <p className="text-sm font-semibold text-ink">История версий в этой вкладке (не более шести)</p>
        <div className="mt-3 flex flex-wrap gap-2">{versions.map(entry=><button type="button" key={entry.documentResult.versionId}
          aria-current={entry.documentResult.versionId===prepared.documentResult.versionId?"true":undefined}
          onClick={()=>restore(entry)} className="rounded-md border border-line px-3 py-2 text-xs text-trust hover:border-trust">
          {new Date(entry.documentResult.createdAt).toLocaleString("ru-RU")} · {entry.documentResult.versionId.slice(0,8)}
        </button>)}</div>
      </div>:null}
    </section>:null}
  </section>;
}

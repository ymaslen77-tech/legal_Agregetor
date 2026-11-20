"use client";

import { useState } from "react";
import {
  createRealEstateDraftPrototype, reviseRealEstateDraft,
  addRealEstateDraftVersion, type RealEstateDraftOutput
} from "@/lib/real-estate-document-core";
import {
  createRealEstatePdfBlob, createRealEstateDocxBlob, realEstateFileName
} from "@/lib/real-estate-document-export";
import type { RealEstateIntakeSpec, RealEstateIntakeResult } from "@/lib/real-estate-intake";
import type { DocumentVersionEntry } from "@/lib/document-version-history";

type Props=Readonly<{
  spec:RealEstateIntakeSpec;
  answers:Readonly<Record<string,string>>;
  assessment:RealEstateIntakeResult|null;
  inputRevision:number;
  restoreAnswers:(values:Readonly<Record<string,string>>)=>void;
}>;

/**
 * Development-only in-memory results, with explicit versioning. No uploads,
 * legal advice, fake lawyers, analytics, localStorage, or server actions.
 */
export function RealEstateDocumentWorkbench({
  spec,answers,assessment,inputRevision,restoreAnswers
}:Props){
  const [generated,setGenerated]=useState<RealEstateDraftOutput|null>(null);
  const [versions,setVersions]=useState<DocumentVersionEntry<Readonly<Record<string,string>>>[]>([]);
  const [editedText,setEditedText]=useState("");
  const [snapshotRevision,setSnapshotRevision]=useState<number|null>(null);
  const [error,setError]=useState("");
  const [busy,setBusy]=useState(false);
  const ready=!!assessment&&assessment.status!=="NEEDS_DETAILS"
    && assessment.missing.length===0&&assessment.invalid.length===0;
  const stale=!!generated&&snapshotRevision!==inputRevision;
  const changed=!!generated&&editedText!==generated.documentResult.documentText;
  const exportBlocked=!generated||busy||stale||changed;

  function store(next:RealEstateDraftOutput,revision:number){
    setGenerated(next);
    setVersions(previous=>addRealEstateDraftVersion(previous,next));
    setEditedText(next.documentResult.documentText);
    setSnapshotRevision(revision);
    setError("");
  }
  function generate(){
    if(!ready||busy)return;
    try{
      store(createRealEstateDraftPrototype({
        groupId:spec.groupId,situationId:spec.situationId,values:answers
      }),inputRevision);
    }catch(e){setError(e instanceof Error?e.message:"Результат не сформирован.");}
  }
  function saveRevision(){
    if(!generated||!changed||stale)return;
    try{store(reviseRealEstateDraft(generated,editedText),inputRevision);}
    catch(e){setError(e instanceof Error?e.message:"Редакция не сохранена.");}
  }
  function restore(entry:DocumentVersionEntry<Readonly<Record<string,string>>>){
    // Restore both the text and EXACT source facts captured for this version.
    const chosen=versions.find(x=>x.documentResult.versionId===entry.documentResult.versionId);
    if(!chosen)return;
    restoreAnswers(chosen.payload);
    setGenerated({documentResult:chosen.documentResult,formData:{...chosen.payload}});
    setEditedText(chosen.documentResult.documentText);
    setSnapshotRevision(inputRevision+1);
    setError("");
  }
  async function download(type:"pdf"|"docx"){
    if(!generated||exportBlocked)return;
    setBusy(true);setError("");
    try{
      const result=generated.documentResult;
      const blob=type==="pdf"?
        await createRealEstatePdfBlob(result):await createRealEstateDocxBlob(result);
      if(!blob.size)throw new Error("Получен пустой файл.");
      const url=URL.createObjectURL(blob);
      try{
        const link=document.createElement("a");
        link.href=url;
        link.download=realEstateFileName(result,type);
        document.body.appendChild(link);
        link.click();
        link.remove();
      }finally{URL.revokeObjectURL(url);}
    }catch(e){setError(e instanceof Error?e.message:"Скачать файл не удалось.");}
    finally{setBusy(false);}
  }

  return <section className="mt-8 rounded-lg border border-line bg-white p-5 sm:p-6"
    data-testid="real-estate-document-workbench" aria-label="Проект предварительного результата">
    <p className="text-sm font-semibold uppercase tracking-wide text-trust">Следующий шаг · предварительный проект</p>
    <h2 className="mt-2 text-2xl font-semibold text-ink">Тестовый результат и версии</h2>
    <p className="mt-3 text-sm leading-6 text-zinc-700">
      Результат создаётся только после проверки полноты анкеты. Ни один материал
      не прошёл индивидуальную юридическую приёмку. Здесь нельзя подготовить
      готовый к подаче иск, подтверждённую жалобу или официальную форму.
    </p>
    <button type="button" onClick={generate} disabled={!ready||busy}
      className="mt-5 min-h-11 rounded-md bg-trust px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">
      {generated?"Сформировать новую версию по анкете":"Сформировать предварительный проект"}
    </button>
    {!ready?<p className="mt-3 text-sm text-amber-900">
      Для формирования сначала заполните анкету и нажмите «Проверить полноту тестовых сведений».
    </p>:null}
    {error?<p role="alert" className="mt-3 text-sm font-semibold text-red-800">{error}</p>:null}
    {generated?<div className="mt-7 border-t border-line pt-6">
      <p className="text-sm font-bold text-amber-900">
        Черновик · не готов к подаче · версия {generated.documentResult.versionId.slice(0,8)}
      </p>
      <h3 className="mt-3 text-xl font-semibold text-ink">{generated.documentResult.documentTitle}</h3>
      {stale?<p role="status" className="mt-3 rounded-md bg-amber-50 p-3 text-sm text-amber-900">
        Анкета изменена. Предыдущий проект сохранён неизменным. Чтобы получить актуальную версию,
        повторно проверьте ответы и нажмите кнопку формирования.
      </p>:null}
      <label htmlFor="real-estate-document-editor" className="mt-5 block text-sm font-semibold text-ink">
        Текст результата
      </label>
      <textarea id="real-estate-document-editor" data-testid="real-estate-document-editor"
        className="mt-2 min-h-80 w-full rounded-md border border-line bg-white p-3 font-mono text-sm leading-6 text-ink"
        value={editedText} onChange={event=>setEditedText(event.currentTarget.value)}
        rows={22} maxLength={35000}/>
      {changed?<p className="mt-2 text-sm text-amber-900">
        Вы изменили текст. Чтобы скачать эту редакцию, явно сохраните новую версию.
      </p>:null}
      <button type="button" onClick={saveRevision} disabled={!changed||stale||busy}
        className="mt-3 min-h-11 rounded-md border border-trust px-4 py-2 text-sm font-semibold text-trust disabled:opacity-50">
        Сохранить новую редакцию
      </button>
      {versions.length>1?<div className="mt-5">
        <p className="text-sm font-semibold">Предыдущие версии в этой вкладке</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {versions.map(item=><button key={item.documentResult.versionId} type="button"
            data-testid="real-estate-version"
            onClick={()=>restore(item)}
            aria-current={item.documentResult.versionId===generated.documentResult.versionId?"true":undefined}
            className="min-h-10 rounded-md border border-line px-3 py-2 text-xs text-trust">
            {item.documentResult.versionId.slice(0,8)}
          </button>)}
        </div>
      </div>:null}
    </div>:null}
    <section className="mt-6 border-t border-line pt-6" aria-label="Дальнейшая проверка">
      <h3 className="text-lg font-semibold">Перед использованием результата</h3>
      <p className="mt-2 text-sm leading-6 text-zinc-700">
        Нужно уточнить факты, приложить документы, определить адресата, применимую редакцию
        нормы, сроки, полномочия, пошлину и исключения. Подбор юриста, сохранение в кабинете
        и передача материалов не подключены к этому закрытому прототипу.
      </p>
    </section>
    <section className="mt-6 border-t border-line pt-6" aria-label="Итоговые действия"
      data-testid="real-estate-final-actions">
      <h3 className="text-lg font-semibold">Итоговые действия</h3>
      <p className="mt-2 text-sm text-zinc-700">
        Доступен только тестовый файл с маркировкой «не готов к подаче». Личные данные не вводите.
      </p>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <button type="button" disabled={exportBlocked}
          onClick={()=>void download("pdf")}
          className="min-h-11 rounded-md bg-trust px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">
          {busy?"Подготовка PDF…":"Скачать PDF"}
        </button>
        <button type="button" disabled
          className="min-h-11 rounded-md border border-line bg-zinc-100 px-5 py-3 text-sm font-semibold text-zinc-600">
          Отправить на проверку юристу
        </button>
      </div>
      <details className="mt-4 text-sm text-zinc-700">
        <summary className="cursor-pointer font-semibold text-trust">
          Дополнительные форматы (тестовый DOCX)
        </summary>
        <button type="button" disabled={exportBlocked}
          onClick={()=>void download("docx")}
          className="mt-3 min-h-11 rounded-md border border-trust px-4 py-2 font-semibold text-trust disabled:opacity-50">
          Скачать DOCX-черновик
        </button>
      </details>
    </section>
  </section>;
}

"use client";

import { getCreditDebtAcceptanceItem } from "@/data/credit-debt-acceptance-matrix";

import Link from "next/link";
import { useEffect,useState,type FormEvent } from "react";
import { CreditDebtScenarioFlow,type CreditDebtRouteSnapshot } from "@/components/credit-debt/CreditDebtScenarioFlow";
import { SaveLegalDocumentButton } from "@/components/documents/SaveLegalDocumentButton";
import { DocumentReviewButton } from "@/components/documents/DocumentReviewButton";
import type { CreditDebtSkeletonSpec } from "@/lib/credit-debt-full-route";
import {
  getCreditDebtDocumentPlan,createCreditDebtDraftPrototype,reviseCreditDebtDraft,
  addCreditDebtDocumentVersion,type CreditDebtDocumentOutput
} from "@/lib/credit-debt-document-core";
import { createCreditDebtPdfBlob,createCreditDebtDocxBlob,creditDebtFileName } from "@/lib/credit-debt-document-export";
import type { DocumentVersionEntry } from "@/lib/document-version-history";
import { getCreditDebtCheckedContext } from "@/data/credit-debt-verified-context";

type Related=Readonly<{href:string;title:string}>;
const fieldClass="mt-2 block w-full rounded-md border border-line bg-white px-3 py-2 text-base font-normal leading-6 text-ink focus:border-trust focus:outline-none focus:ring-2 focus:ring-trust/25";

/** Complete visual route; identical shared navigator structure and file/review services. */
export function CreditDebtJourney({spec,related,backHref}:Readonly<{
  spec:CreditDebtSkeletonSpec;
  related:readonly Related[];
  backHref:string;
}>){
  const plan=getCreditDebtDocumentPlan(spec.groupId,spec.situationId);
  const checkedContext=getCreditDebtCheckedContext(spec.groupId,spec.situationId);
  const legalGate=getCreditDebtAcceptanceItem(spec.groupId,spec.situationId);
  const [intake,setIntake]=useState<CreditDebtRouteSnapshot|null>(null);
  const [values,setValues]=useState<Record<string,string>>({});
  const [generated,setGenerated]=useState<CreditDebtDocumentOutput|null>(null);
  const [versions,setVersions]=useState<DocumentVersionEntry<Readonly<Record<string,string>>>[]>([]);
  const [text,setText]=useState("");
  const [error,setError]=useState("");
  const [busy,setBusy]=useState(false);
  const [intakeVersion,setIntakeVersion]=useState<number|null>(null);
  const intakeReady=!!intake&&(
    intake.assessment.complete||
    intake.assessment.status==="URGENT_SAFETY_FIRST"
  );

  // Prefill only an empty fact field, never overwrite prior edits or versions.
  useEffect(()=>{
    if(!intake)return;
    setValues(previous=>({...previous,facts:previous.facts||intake.values.summary||""}));
  },[intake]);

  if(!plan)return <p role="alert">Для этой ситуации не настроен юридический результат.</p>;

  function record(result:CreditDebtDocumentOutput){
    setGenerated(result);
    setText(result.documentResult.documentText);
    setVersions(previous=>addCreditDebtDocumentVersion(previous,result));
    setError("");
    setIntakeVersion(intake?.number??null);
  }
  function generate(event:FormEvent<HTMLFormElement>){
    event.preventDefault();
    if(!intake||!intakeReady)return;
    try{
      record(createCreditDebtDraftPrototype({
        groupId:spec.groupId,situationId:spec.situationId,
        values,intakeValues:intake.values
      }));
    }catch(e){setError(e instanceof Error?e.message:"Не удалось подготовить юридический результат.");}
  }
  function revise(){
    if(!generated)return;
    try{record(reviseCreditDebtDraft(generated,text));}
    catch(e){setError(e instanceof Error?e.message:"Не удалось сохранить редакцию.");}
  }
  function restore(entry:DocumentVersionEntry<Readonly<Record<string,string>>>){
    const found=versions.find(v=>v.documentResult.versionId===entry.documentResult.versionId);
    if(!found)return;
    setGenerated({documentResult:found.documentResult,formData:{...found.payload}});
    setValues({...found.payload});
    setText(found.documentResult.documentText);
    setError("");
  }
  async function download(type:"pdf"|"docx"){
    if(!generated||busy||intakeVersion!==intake?.number)return;
    setBusy(true);setError("");
    try{
      const result=generated.documentResult;
      const blob=type==="pdf"?
        await createCreditDebtPdfBlob(result):
        await createCreditDebtDocxBlob(result);
      if(blob.size===0)throw new Error("Пустой файл.");
      const url=URL.createObjectURL(blob);
      try{
        const a=document.createElement("a");
        a.href=url;a.download=creditDebtFileName(result,type);
        document.body.appendChild(a);a.click();a.remove();
      }finally{URL.revokeObjectURL(url);}
    }catch(e){setError(e instanceof Error?e.message:"Не удалось скачать файл.");}
    finally{setBusy(false);}
  }
  const changed=!!generated&&text!==generated.documentResult.documentText;
  // Once the intake changes, neither editing nor export may silently turn an old
  // result into an apparently current document. The questionnaire must be regenerated.
  const stale=!!generated&&intakeVersion!==intake?.number;
  const title=plan.resultKind==="DRAFT"?"Сформировать проект документа":
    plan.resultKind==="URGENT_INSTRUCTION"?"Подготовить памятку безопасности":
    plan.resultKind==="PREPARED_DATA"?"Подготовить лист сведений":"Сформировать предварительный чек-лист";
  return <div data-testid="credit-debt-journey">
    <CreditDebtScenarioFlow spec={spec} onSnapshot={setIntake}/>
    <section className="mt-9 rounded-lg border border-line bg-white p-5 sm:p-6" aria-labelledby="credit-workbench-heading" data-testid="credit-debt-document-workbench">
      <p className="text-sm font-semibold uppercase tracking-wide text-trust">Шаг 3 · Подготовка результата</p>
      <h2 id="credit-workbench-heading" className="mt-2 text-2xl font-semibold text-ink">
        {plan.resultKind==="DRAFT"?"Проект юридического документа":"Предварительный информационный результат"}
      </h2>
      <p className="mt-3 text-sm leading-6 text-zinc-700">
        {plan.target.objective} Нормативные основания и правовые условия по этой ситуации ещё не утверждены.
        Файл остаётся черновиком и не считается готовым к подаче.
      </p>
      {!intakeReady?<p className="mt-4 text-sm text-zinc-600">
        {intake?"Для подготовки результата необходимо заполнить обязательные сведения анкеты или исправить ошибки.":"Сначала ответьте на уточняющие вопросы на шаге 1."}
      </p>:
        <form onSubmit={generate} className="mt-5 grid gap-4" data-testid="credit-debt-draft-form">
          {plan.inputs.map(f=><label className="text-sm font-semibold text-ink" key={f.key}>
            <span>{f.label}{f.required?" *":""}</span>
            <textarea className={fieldClass} rows={f.rows} value={values[f.key]??""} required={f.required}
              maxLength={f.key==="facts"?5000:f.key==="attachments"?1800:1200}
              minLength={f.required?f.key==="facts"?15:3:undefined}
              placeholder="В тестовом режиме используйте только вымышленные сведения"
              data-field-key={f.key} onChange={e=>{
                // React clears currentTarget after dispatch. Never read it from a queued updater.
                const value=e.currentTarget.value;
                setValues(prev=>({...prev,[f.key]:value}));
              }}/>
          </label>)}
          {error?<p className="text-sm text-red-800" role="alert">{error}</p>:null}
          <button type="submit" className="min-h-11 rounded-md bg-trust px-5 py-3 font-semibold text-white hover:bg-ink">{title}</button>
        </form>}
      {generated?<div className="mt-7 border-t border-line pt-6" aria-label="Версия результата">
        <p className="text-sm font-semibold uppercase tracking-wide text-amber-800">
          Черновик · не готов к подаче · версия {generated.documentResult.versionId.slice(0,8)}
        </p>
        {stale?<p role="status" className="mt-2 text-sm text-amber-900">
          Анкета была обновлена. Предыдущий документ не меняется автоматически — для новой версии повторно сформируйте результат.
        </p>:null}
        <label className="mt-5 block text-sm font-semibold text-ink">
          Текст результата (редактируется)
          <textarea className={fieldClass} value={text} onChange={e=>setText(e.currentTarget.value)}
            rows={19} maxLength={35000} data-testid="credit-debt-document-editor"/>
        </label>
        {changed?<p className="mt-2 text-sm text-amber-800">
          Есть несохранённые изменения. Для скачивания или передачи этой редакции сохраните новую версию.
        </p>:null}
        <button type="button" onClick={revise} disabled={!changed||busy||stale}
          className="mt-4 min-h-11 rounded-md border border-trust px-4 py-2 text-sm font-semibold text-trust disabled:opacity-50">
          Сохранить новую версию
        </button>
        {versions.length>1?<div className="mt-5 border-t border-line pt-4">
          <p className="text-sm font-semibold">Предыдущие версии в этой вкладке</p>
          <div className="mt-3 flex flex-wrap gap-2">{versions.map(entry=><button type="button"
            key={entry.documentResult.versionId} onClick={()=>restore(entry)}
            aria-current={entry.documentResult.versionId===generated.documentResult.versionId?"true":undefined}
            className="rounded-md border border-line px-3 py-2 text-xs text-trust hover:border-trust">
            {entry.documentResult.versionId.slice(0,8)}
          </button>)}</div>
        </div>:null}
      </div>:null}
    </section>
    <section className="mt-9 border-t border-line pt-7" aria-labelledby="credit-sources-heading">
      <h2 id="credit-sources-heading" className="text-2xl font-semibold text-ink">Правовые основания и источники</h2>
      <p className="mt-3 text-sm leading-6 text-zinc-700">
        Источники ниже приведены для сверки. Доступность ссылки не означает подтверждения применимой нормы.
        Для каждого юридически значимого утверждения требуется сравнение независимых источников
        с приоритетом действующей официальной редакции.
      </p>
      <ul className="mt-4 list-disc space-y-2 pl-6 text-sm text-trust">
        {spec.sourceCandidates.map((ref,i)=><li key={ref.label+i}>
          <a className="underline" href={ref.url} target="_blank" rel="noopener noreferrer">{ref.label}</a>
        </li>)}
      </ul>
      {checkedContext.length>0?<div className="mt-6 rounded-lg border border-line bg-zinc-50 p-5" data-testid="credit-debt-checked-context">
        <h3 className="text-lg font-semibold text-ink">Предварительно сопоставленные общие правовые положения</h3>
        <p className="mt-2 text-sm text-zinc-700">
          Каждое положение сопоставлено по двум независимым источникам.
          Это не завершённая проверка по трём источникам, не подтверждение права конкретного заявителя и не юридическая приёмка документа.
        </p>
        {checkedContext.map(item=><div key={item.id} className="mt-4 border-t border-line pt-4">
          <p className="font-semibold text-ink">{item.proposition}</p>
          <p className="mt-2 text-sm leading-6 text-zinc-700"><strong>Ограничения:</strong> {item.limitations}</p>
          {item.officialTextPriorityNote?<p className="mt-3 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm leading-6 text-amber-950" role="note">
            <strong>Приоритет официального текста:</strong> {item.officialTextPriorityNote}
          </p>:null}
          <ul className="mt-3 list-disc space-y-1 pl-6 text-sm">
            {item.sources.map(source=><li key={source.publisher+source.url}>
              <a className="text-trust underline" href={source.url} target="_blank" rel="noopener noreferrer">
                {source.publisher}: {source.supports}
              </a>
            </li>)}
          </ul>
        </div>)}
      </div>:null}
    </section>
    {legalGate?<section className="mt-9 rounded-lg border border-line bg-zinc-50 p-5 sm:p-6"
      aria-labelledby="credit-individual-review-heading" data-testid="credit-debt-legal-acceptance">
      <p className="text-sm font-semibold uppercase tracking-wide text-amber-900">Юридическая приёмка · ожидает проверки</p>
      <h2 id="credit-individual-review-heading" className="mt-2 text-xl font-semibold text-ink">
        Что проверить именно в этой ситуации
      </h2>
      <p className="mt-3 text-sm leading-6 text-zinc-800" data-testid="credit-debt-legal-focus">{legalGate.reviewFocus}</p>
      <p className="mt-3 text-sm leading-6 text-zinc-700">
        Требуется подтвердить каждое существенное правовое утверждение минимум по трём независимым источникам,
        сопоставить их с действующей официальной редакцией закона и проверить реквизиты и доказательства по делу.
        В частности, указанный выше предполагаемый адресат не считается подтверждённым: {legalGate.recipientCandidate}.
      </p>
      <details className="mt-4 text-sm text-zinc-800">
        <summary className="cursor-pointer font-semibold text-trust">Полный перечень условий юридической приёмки</summary>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          {legalGate.mandatoryChecks.map(item=><li key={item}>{item}</li>)}
        </ul>
      </details>
    </section>:null}
    <section className="mt-9 border-t border-line pt-7" aria-labelledby="credit-related-heading">
      <h2 id="credit-related-heading" className="text-2xl font-semibold text-ink">Связанные вопросы и следующие действия</h2>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {related.map(item=><Link key={item.href} href={item.href}
          className="block rounded-md border border-line bg-white p-4 text-sm font-semibold text-trust underline hover:border-trust">
          {item.title}
        </Link>)}
      </div>
      <p className="mt-7"><Link className="text-sm font-semibold text-trust underline" href={backHref}>Вернуться к вопросам подраздела</Link></p>
    </section>
    <section className="mt-9 border-t border-line pt-7" aria-labelledby="credit-lawyers-heading">
      <h2 id="credit-lawyers-heading" className="text-2xl font-semibold text-ink">Профильные юристы</h2>
      <p className="mt-3 text-sm leading-6 text-zinc-700">Подтверждённые специалисты для этого тестового раздела пока не подключены. Вымышленные профили не отображаются.</p>
    </section>
    <section className="mt-9 border-t border-line pt-7" aria-labelledby="credit-final-heading" data-testid="credit-debt-final-actions">
      <p className="text-sm font-semibold uppercase tracking-wide text-trust">Итоговые действия</p>
      <h2 id="credit-final-heading" className="mt-2 text-xl font-semibold text-ink">Документ и юридическая проверка</h2>
      <p className="mt-3 text-sm leading-6 text-zinc-700">Генератор не подтверждает готовность документа к подаче. Передача PDF допускается только после вашего отдельного согласия.</p>
      {!generated?<div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <button type="button" disabled className="min-h-11 rounded-md bg-zinc-200 px-5 py-3 text-sm font-semibold text-zinc-600">Скачать PDF</button>
        <button type="button" disabled className="min-h-11 rounded-md border border-line bg-zinc-50 px-5 py-3 text-sm font-semibold text-zinc-600">Отправить на проверку юристу</button>
      </div>:
        <div className="mt-5">
          <SaveLegalDocumentButton key={generated.documentResult.versionId} result={generated.documentResult} disabled={changed||stale}/>
          <details className="mt-4 text-sm text-zinc-700">
            <summary className="cursor-pointer font-semibold text-trust">Дополнительные форматы и технический экспорт</summary>
            <button type="button" disabled={changed||busy||stale} onClick={()=>void download("docx")}
              className="mt-3 min-h-11 rounded-md border border-line px-4 py-2 font-semibold text-trust disabled:opacity-50">
              Скачать DOCX-черновик
            </button>
          </details>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-start">
            <button type="button" disabled={changed||busy||stale} onClick={()=>void download("pdf")}
              className="min-h-11 rounded-md bg-trust px-5 py-3 text-sm font-semibold text-white hover:bg-ink disabled:opacity-50">
              {busy?"Готовим PDF…":"Скачать PDF"}
            </button>
            <DocumentReviewButton key={"review-"+generated.documentResult.versionId}
              result={generated.documentResult}
              createPdf={()=>createCreditDebtPdfBlob(generated.documentResult)}
              pdfFileName={creditDebtFileName(generated.documentResult,"pdf")}
              disabled={changed||busy||stale}/>
          </div>
        </div>}
    </section>
  </div>;
}

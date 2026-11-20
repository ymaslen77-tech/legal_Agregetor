"use client";
import { useState } from "react";
import { REAL_ESTATE_GROUPS } from "@/data/real-estate-route-plan";
import { evaluateRealEstateIntake, getRealEstateIntakeSpec } from "@/lib/real-estate-intake";
import type { RealEstateField, RealEstateIntakeResult } from "@/lib/real-estate-intake";
import { RealEstateDocumentWorkbench } from "@/components/real-estate/RealEstateDocumentWorkbench";
import { getRealEstateLegalReviewTask } from "@/data/real-estate-legal-review";
import { getRealEstateCheckedContext } from "@/data/real-estate-checked-context";

/** Local-only development prototype. No server actions, persistence or PDF. */
type PreviewProps=Readonly<{initialGroupId?:string;initialSituationId?:string}>;
export function RealEstatePreview({initialGroupId,initialSituationId}:PreviewProps={}){
  const initialGroup=REAL_ESTATE_GROUPS.find(g=>g.id===initialGroupId)??REAL_ESTATE_GROUPS[0];
  const initialSituation=initialGroup?.situations.find(s=>s.id===initialSituationId)??initialGroup?.situations[0];
  const [groupId,setGroupId]=useState<string>(initialGroup?.id??"");
  const [situationId,setSituationId]=useState<string>(initialSituation?.id??"");
  const [answers,setAnswers]=useState<Record<string,string>>({});
  const [result,setResult]=useState<RealEstateIntakeResult|null>(null);
  const [inputRevision,setInputRevision]=useState(0);
  const group=REAL_ESTATE_GROUPS.find(x=>x.id===groupId);
  const spec=getRealEstateIntakeSpec(groupId,situationId);
  const legalReview=getRealEstateLegalReviewTask(groupId,situationId);
  const checkedContext=getRealEstateCheckedContext(groupId,situationId);
  const onGroupChange=(next:string)=>{
    setGroupId(next);
    setSituationId(REAL_ESTATE_GROUPS.find(x=>x.id===next)?.situations[0]?.id??"");
    setAnswers({});setResult(null);setInputRevision(0);
  };
  const onSituationChange=(next:string)=>{
    setSituationId(next);setAnswers({});setResult(null);setInputRevision(0);
  };
  const onAnswerChange=(key:string,value:string)=>{
    setAnswers(previous=>({...previous,[key]:value}));
    setResult(null);
    setInputRevision(previous=>previous+1);
  };
  const restoreAnswers=(restored:Readonly<Record<string,string>>)=>{
    if(!spec)return;
    const copy={...restored};
    setAnswers(copy);
    setResult(evaluateRealEstateIntake(spec,copy));
    setInputRevision(previous=>previous+1);
  };
  function renderField(field:RealEstateField){
    const id="real-estate-"+field.key;
    const common="mt-2 block w-full rounded-md border border-line bg-white px-3 py-2 text-ink";
    return <div key={field.key}>
      <label htmlFor={id} className="block text-sm font-semibold text-ink">{field.label}{field.required?" *":""}</label>
      {field.kind==="choice"?
        <select id={id} value={answers[field.key]??""} className={common}
          onChange={e=>onAnswerChange(field.key,e.currentTarget.value)}>
          <option value="">Выберите вариант</option>
          {field.choices?.map(v=><option value={v} key={v}>{v}</option>)}
        </select>:
        field.kind==="textarea"?
        <textarea id={id} value={answers[field.key]??""} rows={3} maxLength={3000}
          className={common} onChange={e=>onAnswerChange(field.key,e.currentTarget.value)}
          placeholder="Тестовые факты без персональных сведений"/>:
        <input id={id} type={field.kind==="date"?"date":"text"} maxLength={250}
          value={answers[field.key]??""} className={common}
          onChange={e=>onAnswerChange(field.key,e.currentTarget.value)}/>}
    </div>;
  }
  return <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6" data-testid="real-estate-preview">
    <header className="rounded-xl border border-amber-300 bg-amber-50 p-5">
      <p className="text-sm font-bold text-amber-900">Только закрытый режим разработки — не юридическая консультация</p>
      <h1 className="mt-2 text-3xl font-semibold text-ink">Недвижимость и земельные споры</h1>
      <p className="mt-3 text-sm leading-6 text-zinc-800">
        10 тематических подразделов и 60 предварительных ситуаций. Анкеты выполняются только в браузере;
        ничего не сохраняется и не передаётся юристу. Не вводите ФИО, адреса, кадастровые номера,
        контактные данные или документы. В закрытом тестовом режиме можно сформировать проект PDF/DOCX. Готовые к подаче документы, кабинет,
        передача юристу и публичная индексация отключены.
      </p>
    </header>
    <div className="mt-7 grid gap-4 sm:grid-cols-2">
      <div>
        <label htmlFor="real-estate-group" className="block font-semibold">Подраздел</label>
        <select id="real-estate-group" className="mt-2 w-full rounded-md border border-line bg-white p-3"
          value={groupId} onChange={e=>onGroupChange(e.currentTarget.value)}>
          {REAL_ESTATE_GROUPS.map(g=><option key={g.id} value={g.id}>{g.title} ({g.situations.length})</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="real-estate-case" className="block font-semibold">Ситуация</label>
        <select id="real-estate-case" className="mt-2 w-full rounded-md border border-line bg-white p-3"
          value={situationId} onChange={e=>onSituationChange(e.currentTarget.value)}>
          {group?.situations.map(s=><option key={s.id} value={s.id}>{s.title}</option>)}
        </select>
      </div>
    </div>
    {spec?<div className="mt-8 grid items-start gap-6 lg:grid-cols-2">
      <section aria-label="Тестовая анкета" className="rounded-lg border border-line bg-white p-5">
        <h2 className="text-xl font-semibold">{spec.situationTitle}</h2>
        <p className="mt-2 text-sm text-zinc-600">Индивидуальная правовая проверка: ожидается. Риск: {spec.risk}.</p>
        <form className="mt-5 space-y-4" onSubmit={e=>{
          e.preventDefault();setResult(evaluateRealEstateIntake(spec,answers));
        }}>
          {spec.fields.map(renderField)}
          <button type="submit" className="w-full rounded-md bg-trust px-4 py-3 font-semibold text-white">
            Проверить полноту тестовых сведений
          </button>
        </form>
      </section>
      <section aria-live="polite" aria-label="Тестовый результат" className="rounded-lg border border-line bg-white p-5">
        <h2 className="text-xl font-semibold">Предварительный результат</h2>
        {!result?<p className="mt-3 text-sm text-zinc-600">После заполнения отобразится список недостающих фактов. Документ не создаётся.</p>:
          <div className="mt-4 space-y-4">
            <p className="font-semibold text-amber-800">Статус анкеты: {result.status}</p>
            {result.missing.length>0?<div>
              <h3 className="font-semibold">Нужно дополнить</h3>
              <ul className="mt-2 list-disc pl-5 text-sm">
                {result.missing.map(k=><li key={k}>{spec.fields.find(f=>f.key===k)?.label??k}</li>)}
              </ul>
            </div>:null}
            {result.invalid.length>0?<div>
              <h3 className="font-semibold">Недопустимые ответы</h3>
              <ul className="mt-2 list-disc pl-5 text-sm">
                {result.invalid.map(k=><li key={k}>{spec.fields.find(f=>f.key===k)?.label??k}</li>)}
              </ul>
            </div>:null}
            <h3 className="font-semibold">Что потребуется проверить</h3>
            <ul className="list-disc space-y-2 pl-5 text-sm text-zinc-700">
              {result.checklist.map(x=><li key={x}>{x}</li>)}
            </ul>
            <p className="text-sm text-zinc-700">Юридическая квалификация, сохранение в кабинете и отправка юристу пока недоступны. Ниже можно сформировать только тестовый черновик.</p>
          </div>}
      </section>
    </div>:null}
    {spec?<RealEstateDocumentWorkbench key={groupId+"/"+situationId}
      spec={spec} answers={answers} assessment={result}
      inputRevision={inputRevision} restoreAnswers={restoreAnswers}/>:null}
    {legalReview?<section className="mt-8 rounded-lg border border-line bg-zinc-50 p-5 sm:p-6"
      aria-label="Юридическая приёмка и проверка источников">
      <p className="text-sm font-bold uppercase tracking-wide text-amber-900">Юридическая приёмка: ожидает проверки</p>
      <h2 className="mt-2 text-xl font-semibold text-ink">Правовые вопросы по этой ситуации</h2>
      <p className="mt-3 text-sm leading-6 text-zinc-800">{legalReview.issueToVerify}</p>
      <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-zinc-700">
        {legalReview.requiredChecks.map(check=><li key={check}>{check}</li>)}
      </ul>
      <p className="mt-4 text-sm text-zinc-700">
        Нормативные акты-кандидаты: {legalReview.candidateActNames.join("; ")}.
        До индивидуальной сверки точных норм, сроков, адресата и приложений проект не подлежит подаче.
      </p>
      {checkedContext.length?checkedContext.map(item=><div key={item.id} className="mt-5 border-t border-line pt-4">
        <h3 className="font-semibold text-ink">Проверенное общее положение (не одобрение документа)</h3>
        <p className="mt-2 text-sm leading-6 text-zinc-800">{item.proposition}</p>
        <p className="mt-2 text-sm leading-6 text-zinc-700">{item.limitations}</p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">
          {item.sources.map(source=><li key={source.url}>
            <a href={source.url} target="_blank" rel="noopener noreferrer" className="text-trust underline">
              {source.publisher}: {source.supports}
            </a>
          </li>)}
        </ul>
      </div>):<p className="mt-4 text-sm text-zinc-600">
        Предметные источники для этой ситуации ещё не сопоставлены. Названия кодексов не считаются юридической проверкой.
      </p>}
    </section>:null}
  </main>;
}

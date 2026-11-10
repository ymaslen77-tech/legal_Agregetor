"use client";

import { useState } from "react";
import {
  evaluateCreditDebtSkeleton,type CreditDebtSkeletonSpec,
  type CreditDebtSkeletonAssessment
} from "@/lib/credit-debt-full-route";
import type { CreditDebtInputField } from "@/lib/credit-debt-stage-one";

type Snapshot={
  number:number;
  values:Readonly<Record<string,string>>;
  assessment:CreditDebtSkeletonAssessment;
};
const status:Record<CreditDebtSkeletonAssessment["status"],string>={
  NEEDS_DETAILS:"Нужны уточнения",
  CHECKLIST_ONLY:"Предварительный чек-лист",
  URGENT_SAFETY_FIRST:"Приоритет безопасности",
  SPECIALIST_ROUTE:"Связанный профильный маршрут"
};

/**
 * Reuses navigator field/button styles and the same two final action slots
 * as the established document routes. Buttons remain disabled until a
 * real, versioned legally reviewed PDF and referral exist.
 */
export function CreditDebtScenarioFlow({spec}:Readonly<{spec:CreditDebtSkeletonSpec}>){
  const [values,setValues]=useState<Record<string,string>>({});
  const [snapshot,setSnapshot]=useState<Snapshot|null>(null);
  const [revision,setRevision]=useState(0);
  const [editing,setEditing]=useState(true);
  const [error,setError]=useState<string|null>(null);
  function change(key:string,value:string){
    setValues(previous=>({...previous,[key]:value}));
    setError(null);
  }
  function submit(event:React.FormEvent<HTMLFormElement>){
    event.preventDefault();
    const result=evaluateCreditDebtSkeleton(spec,values);
    const next=revision+1;
    setRevision(next);
    setSnapshot({number:next,values:{...values},assessment:result});
    setEditing(result.status==="NEEDS_DETAILS");
    setError(result.invalid.length?"Проверьте формат указанных сведений.":null);
  }
  function fieldInput(field:CreditDebtInputField){
    const id="credit-"+field.key;
    const properties={
      id,name:field.key,value:values[field.key]??"",
      onChange:(event:React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>)=>
        change(field.key,event.currentTarget.value),
      className:"mt-2 block min-h-11 w-full rounded-md border border-line bg-white px-3 py-2 text-base font-normal leading-6 text-ink focus:border-trust focus:outline-none focus:ring-2 focus:ring-trust/25"
    };
    return <div key={field.key}>
      <label htmlFor={id} className="block text-sm font-semibold leading-6 text-ink">
        {field.label}{field.required?" *":""}
      </label>
      {field.kind==="choice"?
        <select {...properties}><option value="">Выберите ответ</option>{field.choices?.map(c=><option key={c} value={c}>{c}</option>)}</select>
        :field.kind==="textarea"?
        <textarea {...properties} rows={3} maxLength={2000} placeholder="Только условные тестовые сведения"/>
        :<input {...properties} type={field.kind==="date"?"date":"text"} maxLength={field.kind==="text"?250:undefined} autoComplete="off"/>}
    </div>;
  }
  const output=snapshot?.assessment;
  return <div className="mt-8 space-y-8" data-testid="credit-debt-scenario-flow">
    <section className="rounded-lg border border-line bg-white p-5 sm:p-6" aria-labelledby="credit-intake-heading">
      <p className="text-sm font-semibold uppercase tracking-wide text-trust">Шаг 1 · Уточнение обстоятельств</p>
      <h2 id="credit-intake-heading" className="mt-2 text-2xl font-semibold text-ink">Ответьте на несколько вопросов</h2>
      <p className="mt-3 text-sm leading-6 text-zinc-700">
        Это предварительная анкета. Не указывайте реальные паспортные данные, номера счетов, адреса и сведения о доходах.
        Ответы обрабатываются только в текущем окне браузера и не отправляются на сервер.
      </p>
      {snapshot&&!editing?<button type="button" className="mt-4 inline-flex min-h-11 items-center text-sm font-semibold text-trust underline underline-offset-4 focus:ring-2 focus:ring-trust/30"
        onClick={()=>setEditing(true)}>Изменить ответы</button>:null}
      {editing?<form className="mt-6 grid gap-5" onSubmit={submit}>
        {spec.fields.length?spec.fields.map(fieldInput):<p role="alert" className="rounded-md border-l-4 border-amber-400 bg-amber-50 p-4 text-sm leading-6 text-zinc-900">
          Если есть угроза или подозрение на мошеннический кредит, сначала необходимо оценить безопасность.
          Для получения первоочередных действий не нужно заполнять анкету.
        </p>}
        {error?<p role="alert" className="text-sm text-rose-700">{error}</p>:null}
        <button type="submit"
          className="inline-flex min-h-11 items-center justify-center rounded-md bg-trust px-5 py-3 text-sm font-semibold text-white hover:opacity-90 focus:ring-2 focus:ring-trust/30">
          {spec.fields.length?"Продолжить — проверить сведения":"Показать первоочередные действия"}
        </button>
      </form>:null}
    </section>
    {output?<section className="rounded-lg border border-line bg-white p-5 sm:p-6" aria-label="Предварительный результат" aria-live="polite" data-testid="credit-debt-result">
      <p className="text-sm font-semibold uppercase tracking-wide text-trust">Шаг 2 · Предварительный результат</p>
      <h2 className="mt-2 text-2xl font-semibold text-ink">{status[output.status]}</h2>
      <p className="mt-3 text-sm leading-6 text-zinc-700">
        Версия проверки № {snapshot.number}. Результат не является юридическим заключением или готовым документом.
      </p>
      {editing?<p className="mt-3 text-sm text-zinc-700">Изменения анкеты не меняют этот результат до кнопки продолжения.</p>:null}
      {output.missing.length>0?<div className="mt-5"><h3 className="text-lg font-semibold text-ink">Какие сведения уточнить</h3>
        <ul className="mt-3 list-disc space-y-2 pl-6 text-sm leading-6 text-zinc-700">
          {output.missing.map(key=><li key={key}>{spec.fields.find(f=>f.key===key)?.label??key}</li>)}
        </ul>
      </div>:null}
      {output.invalid.length>0?<div className="mt-5"><h3 className="text-lg font-semibold text-ink">Исправьте значения</h3>
        <ul className="mt-3 list-disc space-y-2 pl-6 text-sm leading-6 text-zinc-700">
          {output.invalid.map(key=><li key={key}>{spec.fields.find(f=>f.key===key)?.label??key}</li>)}
        </ul>
      </div>:null}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-ink">Порядок действий</h3>
        <ol className="mt-3 list-decimal space-y-2 pl-6 text-sm leading-6 text-zinc-700">
          {output.checklist.map(v=><li key={v}>{v}</li>)}
        </ol>
      </div>
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-ink">Какие документы подготовить</h3>
        <ul className="mt-3 list-disc space-y-2 pl-6 text-sm leading-6 text-zinc-700">
          {output.documentsToGather.map(v=><li key={v}>{v}</li>)}
        </ul>
      </div>
      {output.linkedArea?<p className="mt-5 rounded-md border border-line bg-zinc-50 p-4 text-sm text-zinc-700">
        Для этой ситуации предусмотрен переход к профильному маршруту «{output.linkedArea}». Автоматический переход без сверки обстоятельств не выполняется.
      </p>:null}
      <p className="mt-8 border-t border-line pt-6 text-sm leading-6 text-zinc-700">
        Итоговый юридический документ и передача юристу станут доступны только после проверки применимых норм,
        адресата, сроков, состава приложений, PDF и согласия пользователя.
        В тестовой версии формируется исключительно предварительный чек-лист.
      </p>
    </section>:null}
  </div>;
}

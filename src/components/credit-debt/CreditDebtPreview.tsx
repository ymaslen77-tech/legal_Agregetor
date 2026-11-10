"use client";

import { useState } from "react";
import {
  getCreditDebtIntakeSpec,
  getCreditDebtStageOneGroups,
  evaluateCreditDebtStageOne,
  type CreditDebtInputField,
  type CreditDebtIntakeAssessment
} from "@/lib/credit-debt-stage-one";

const groups=getCreditDebtStageOneGroups();

type PreviewReport = {
  groupId:string;
  situationId:string;
  revision:number;
  result:CreditDebtIntakeAssessment;
};

/**
 * Development-only intake sandbox. No backend, cookies, persistence, upload,
 * legal document generation, financial data processing or public navigation.
 */
export function CreditDebtPreview(){
  const [groupId,setGroupId]=useState(groups[0]?.id??"");
  const [situationId,setSituationId]=useState(groups[0]?.situations[0]?.id??"");
  const [values,setValues]=useState<Record<string,string>>({});
  const [report,setReport]=useState<PreviewReport|null>(null);
  const [changed,setChanged]=useState(false);
  const [revision,setRevision]=useState(0);
  const group=groups.find(g=>g.id===groupId);
  const spec=getCreditDebtIntakeSpec(groupId,situationId);
  function reset(groupNext:string,situationNext:string){
    setGroupId(groupNext);
    setSituationId(situationNext);
    setValues({});
    setReport(null);
    setChanged(false);
    setRevision(0);
  }
  function change(key:string,v:string){
    setValues(previous=>({...previous,[key]:v}));
    setChanged(true);
  }
  function check(){
    if(!spec)return;
    const next=revision+1;
    setReport({
      groupId:spec.groupId,situationId:spec.situationId,
      revision:next,result:evaluateCreditDebtStageOne(spec,values)
    });
    setRevision(next);
    setChanged(false);
  }
  function input(field:CreditDebtInputField){
    const id="credit-intake-"+field.key;
    const shared={
      id,name:field.key,value:values[field.key]??"",
      onChange:(event:React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>)=>change(field.key,event.currentTarget.value),
      className:"mt-2 block w-full rounded-md border border-line bg-white px-3 py-3 text-ink",
      "aria-required":field.required
    };
    return <div key={field.key}>
      <label htmlFor={id} className="block text-sm font-semibold text-ink">
        {field.label}{field.required?<span className="ml-1 text-rose-700">*</span>:null}
      </label>
      {field.kind==="choice"?
        <select {...shared}><option value="">Выберите ответ</option>{field.choices?.map(choice=><option key={choice} value={choice}>{choice}</option>)}</select>
       :field.kind==="textarea"?
        <textarea {...shared} rows={3} placeholder="Не вводите персональные данные в тестовую анкету"/>
       :<input {...shared} type={field.kind==="date"?"date":"text"} autoComplete="off"/>}
    </div>;
  }
  const output=report?.groupId===groupId&&report.situationId===situationId?report:null;
  return <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
    <header className="rounded-xl border border-amber-300 bg-amber-50 p-5">
      <p className="text-xs font-bold uppercase tracking-widest text-amber-900">Только локальный режим разработки</p>
      <h1 className="mt-2 text-3xl font-bold text-ink">Кредиты, долги и банкротство — тестовые анкеты</h1>
      <p className="mt-3 text-sm leading-6 text-zinc-800">
        Это внутреннее тестирование 35 ситуаций первого этапа. Здесь не формируются юридические документы,
        не рассчитываются законные суммы и не определяется право на льготы. Не вводите реальные персональные
        данные, финансовые реквизиты или документы. Введённые тестовые ответы не отправляются на сервер и не сохраняются.
      </p>
    </header>
    <section className="mt-7 grid gap-5 sm:grid-cols-2">
      <div>
        <label htmlFor="credit-group" className="font-semibold">Подраздел</label>
        <select id="credit-group" value={groupId}
          className="mt-2 w-full rounded-md border border-line bg-white p-3"
          onChange={e=>{
            const next=e.currentTarget.value;
            const first=groups.find(g=>g.id===next)?.situations[0]?.id??"";
            reset(next,first);
          }}>
          {groups.map(g=><option key={g.id} value={g.id}>{g.title} ({g.situations.length})</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="credit-situation" className="font-semibold">Ситуация</label>
        <select id="credit-situation" value={situationId}
          className="mt-2 w-full rounded-md border border-line bg-white p-3"
          onChange={e=>reset(groupId,e.currentTarget.value)}>
          {group?.situations.map(s=><option key={s.id} value={s.id}>{s.title}</option>)}
        </select>
      </div>
    </section>
    {spec?<div className="mt-8 grid items-start gap-8 lg:grid-cols-2">
      <section aria-label="Тестовая анкета" className="rounded-lg border border-line bg-white p-5">
        <h2 className="text-xl font-semibold text-ink">{spec.situationTitle}</h2>
        <p className="mt-2 text-sm text-zinc-600">Риск: {spec.risk}. Документ не создаётся.</p>
        {spec.fields.length?
          <div className="mt-6 space-y-5">
            {spec.fields.map(input)}
            <button type="button" onClick={check}
              className="w-full rounded-md bg-trust px-4 py-3 font-semibold text-white hover:opacity-90">
              Проверить заполненность и составить чек-лист
            </button>
          </div>:
          <div className="mt-6">
            <p className="text-sm text-rose-800">При угрозах и мошенническом займе не требуется заполнение анкеты.</p>
            <button type="button" onClick={check}
              className="mt-4 w-full rounded-md bg-trust px-4 py-3 font-semibold text-white">
              Показать безопасные первоочередные действия
            </button>
          </div>}
      </section>
      <section aria-label="Результат предварительной проверки" className="rounded-lg border border-line bg-white p-5" aria-live="polite">
        <h2 className="text-xl font-semibold text-ink">Предварительный результат</h2>
        {!output?<p className="mt-3 text-sm text-zinc-600">Выберите ситуацию и запустите проверку анкеты.</p>:
          <div className="mt-4 space-y-5">
            <p className="text-sm font-semibold text-amber-800">
              Версия проверки № {output.revision}: {output.result.status}. Не является юридическим заключением.
            </p>
            {changed?<p className="text-sm text-zinc-700">Ответы изменены. Старый результат останется неизменным до повторной проверки.</p>:null}
            {output.result.missing.length?
              <div><h3 className="font-semibold">Недостающие сведения</h3>
                <ul className="mt-2 list-disc pl-5 text-sm">
                  {output.result.missing.map(k=><li key={k}>{spec.fields.find(f=>f.key===k)?.label??k}</li>)}
                </ul>
              </div>:null}
            {output.result.invalid.length?
              <div><h3 className="font-semibold">Недопустимые значения</h3>
                <ul className="mt-2 list-disc pl-5 text-sm">
                  {output.result.invalid.map(k=><li key={k}>{spec.fields.find(f=>f.key===k)?.label??k}</li>)}
                </ul>
              </div>:null}
            <div><h3 className="font-semibold">Что проверить</h3>
              <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-zinc-800">
                {output.result.checklist.map(v=><li key={v}>{v}</li>)}
              </ul>
            </div>
            <div><h3 className="font-semibold">Какие документы найти</h3>
              <ul className="mt-2 list-disc pl-5 text-sm">
                {output.result.documentsToGather.map(v=><li key={v}>{v}</li>)}
              </ul>
            </div>
            {output.result.linkedArea?<p className="text-sm text-amber-800">
              Нужен переход к профильному маршруту: {output.result.linkedArea}. Автоматический документ не формируется.
            </p>:null}
            <p className="text-sm text-zinc-600">Подтверждение юридического содержания: ожидается сверка действующих норм по независимым источникам.</p>
            <h3 className="font-semibold">Источники-кандидаты (не являются подтверждением выводов)</h3>
            <ul className="list-disc pl-5 text-sm">
              {output.result.sourceCandidates.map((v,i)=><li key={v.label+"-"+i}>
                <a className="underline" href={v.url} rel="noopener noreferrer" target="_blank">{v.label}</a>
              </li>)}
            </ul>
          </div>}
      </section>
    </div>:null}
  </main>;
}

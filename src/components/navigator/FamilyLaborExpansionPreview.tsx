"use client";

import { useState } from "react";
import type { FamilyLaborPlan } from "@/data/family-labor-route-expansion";
import { getFamilyLaborGuidance, type FamilyLaborGuidance } from "@/lib/family-labor-route-guidance";

/**
 * Explicitly opt-in internal preview, rendered only when FAMILY_LABOR_PREVIEW=1.
 * Facts remain inside component state: no network request, persistence or exports.
 */
export function FamilyLaborExpansionPreview({ items }: { items: readonly FamilyLaborPlan[] }) {
  const [selectedId, setSelectedId] = useState("");
  const [scenarioKey, setScenarioKey] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<FamilyLaborGuidance | null>(null);
  const plans = items.filter(item => item.kind !== "CROSS_AREA_LINK");
  const selected = plans.find(item => item.id === selectedId);
  const scenario = selected?.scenarios.find(item => item.key === scenarioKey);
  const required = scenario ? selected?.fields.filter(field => scenario.requiredFields.includes(field.key)) ?? [] : [];

  function selectPlan(id: string) {
    const item = plans.find(plan => plan.id === id);
    setSelectedId(id);
    setScenarioKey(item?.scenarios[0]?.key ?? "");
    setAnswers({});
    setResult(null);
  }
  function selectScenario(key: string) {
    setScenarioKey(key);
    setAnswers({});
    setResult(null);
  }

  return (
    <aside className="mx-auto my-10 max-w-5xl rounded-lg border-2 border-amber-400 bg-amber-50 p-5 sm:p-7" data-family-labor-preview="true">
      <p className="text-xs font-semibold uppercase tracking-wide text-amber-900">Внутренняя проверка новых ситуаций</p>
      <h2 className="mt-2 text-2xl font-semibold text-ink">Дополнения к юридическому маршруту</h2>
      <p className="mt-3 text-sm leading-6 text-amber-950">
        Эта предварительная анкета пока не опубликована для пользователей. Результат не является иском, жалобой,
        проверенным юридическим заключением или готовым документом для подачи.
        Введённые сведения остаются в браузере этой страницы и никуда не отправляются.
      </p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {plans.map(plan => (
          <button
            key={plan.id} type="button" onClick={() => selectPlan(plan.id)}
            aria-pressed={selected?.id === plan.id}
            className={"min-h-12 rounded-md border p-4 text-left text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-trust/30 " +
              (selected?.id === plan.id ? "border-trust bg-white text-ink" : "border-amber-300 bg-amber-100 text-amber-950 hover:bg-white")}
          >
            {plan.title}
          </button>
        ))}
      </div>
      {selected && (
        <div className="mt-6 rounded-md border border-line bg-white p-5">
          <h3 className="text-xl font-semibold text-ink">{selected.title}</h3>
          {selected.scenarios.length > 1 && (
            <label className="mt-4 block text-sm font-semibold text-ink">
              Какую ситуацию проверяем?
              <select value={scenarioKey} onChange={event => selectScenario(event.target.value)}
                className="mt-2 min-h-11 w-full rounded-md border border-line bg-white p-2 font-normal">
                {selected.scenarios.map(item => <option key={item.key} value={item.key}>{item.title}</option>)}
              </select>
            </label>
          )}
          {scenario?.emergencyFirst ? (
            <div role="alert" className="mt-5 border-l-4 border-red-600 bg-red-50 p-4 text-sm text-red-950">
              <p className="font-semibold">Если опасность непосредственная, не заполняйте анкету.</p>
              <p className="mt-2">Перейдите в безопасное место и вызовите экстренную помощь (в России — 112). При травме обратитесь за медицинской помощью.</p>
            </div>
          ) : null}
          <p className="mt-3 text-sm leading-6 text-zinc-700">{scenario?.title}</p>
          {required.length > 0 && (
            <div className="mt-5 grid gap-4">
              {required.map(field => (
                <label key={field.key} className="block text-sm font-semibold text-ink">
                  {field.label}
                  {field.options ? (
                    <select className="mt-2 min-h-11 w-full rounded-md border border-line bg-white p-2 font-normal"
                      value={answers[field.key] ?? ""} onChange={event => {setAnswers(prev => ({...prev,[field.key]: event.target.value}));setResult(null);}}>
                      <option value="">Не выбрано</option>
                      {field.options.map(option => <option key={option} value={option}>{option}</option>)}
                    </select>
                  ) : (
                    <textarea rows={2} maxLength={2000} className="mt-2 w-full rounded-md border border-line bg-white p-3 font-normal"
                      value={answers[field.key] ?? ""} onChange={event => {setAnswers(prev => ({...prev,[field.key]: event.target.value}));setResult(null);}} />
                  )}
                </label>
              ))}
            </div>
          )}
          <button type="button" onClick={() => setResult(getFamilyLaborGuidance(selected, scenarioKey, answers))}
            className="mt-5 min-h-11 rounded-md bg-trust px-5 py-2 text-sm font-semibold text-white">
            {scenario?.emergencyFirst ? "Посмотреть безопасный порядок действий" : "Проверить данные и получить чек-лист"}
          </button>
          {result && (
            <section className="mt-6 border-t border-line pt-5" aria-live="polite">
              <h4 className="text-lg font-semibold text-ink">{result.statusLabel}</h4>
              {result.missing.length > 0 && <p className="mt-2 text-sm text-red-800">Не заполнено: {result.missing.map(key => selected.fields.find(field=>field.key===key)?.label ?? key).join("; ")}.</p>}
              {result.invalid.length > 0 && <p className="mt-2 text-sm text-red-800">Проверьте заполнение: {result.invalid.join("; ")}.</p>}
              <h5 className="mt-4 font-semibold">Предварительный порядок проверки</h5>
              <ol className="mt-2 list-decimal space-y-2 pl-5 text-sm leading-6">
                {result.guidance.map(item => <li key={item}>{item}</li>)}
              </ol>
              <h5 className="mt-5 font-semibold">Необходимые документы и сведения</h5>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6">
                {result.documentsToCheck.map(item => <li key={item}>{item}</li>)}
              </ul>
              <h5 className="mt-5 font-semibold">Нормы и источники для юридической проверки</h5>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
                {result.verificationSources.map(item => (
                  <li key={item.url}><a href={item.url} target="_blank" rel="noopener noreferrer" className="text-trust underline">{item.name}</a></li>
                ))}
              </ul>
              <p className="mt-4 text-sm font-medium text-amber-950">Генерация документа и отправка в суд недоступны до юридической приёмки.</p>
            </section>
          )}
        </div>
      )}
    </aside>
  );
}

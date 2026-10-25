"use client";

import Link from "next/link";
import {useMemo,useState} from "react";
import {MILITARY_ROUTES,type MilitaryRoute,type MilitaryScenario} from "@/data/military-route-plans";
import {getMilitaryPinpointLinks,militaryProvisionHref} from "@/data/military-provision-links";
import {getMilitaryCaseReview} from "@/data/military-case-reviews";
import {militaryPreviewHref,militaryPublicHref} from "@/lib/military-preview-navigation";
import {createMilitaryDocumentResult,validateMilitaryIntake} from "@/lib/military-document-generator";
import type {DocumentResultV1} from "@/lib/document-result-contract";
import {downloadGeneratedDocumentDocx} from "@/lib/document-export";
import {createFamilyLaborPdfBlob} from "@/lib/family-labor-pdf";
import {addDocumentVersion} from "@/lib/document-version-history";
import {DocumentResultSummary} from "@/components/documents/DocumentResultSummary";
import {DocumentVersionHistory} from "@/components/documents/DocumentVersionHistory";
import {LegalRouteJourney} from "@/components/documents/LegalRouteJourney";
import {LegalFormField} from "@/components/documents/LegalFormField";
import {MILITARY_ACCEPTANCE_CHECKS,MILITARY_ACCEPTANCE_LABELS} from "@/lib/military-legal-release-gate";

type Step="choose"|"facts"|"review"|"result";
type Snapshot={documentResult:DocumentResultV1;answers:Record<string,string>};
type Props={initialRouteId:string;initialScenarioKey:string;invalidSelection?:boolean;publicDraft?:boolean};

function safeLabel(kind:MilitaryScenario["kind"]):string {
 return kind==="DRAFT"?"Предварительный запрос сведений":kind==="CHECKLIST"?"Проверочный чек-лист":"Экстренная инструкция";
}
export function MilitaryPreviewForm({initialRouteId,initialScenarioKey,invalidSelection=false,publicDraft=false}:Props){
 const [routeId,setRouteId]=useState(initialRouteId);
 const route=MILITARY_ROUTES.find(x=>x.id===routeId)??MILITARY_ROUTES[0];
 const routeHref=publicDraft?militaryPublicHref:militaryPreviewHref;
 const [scenarioKey,setScenarioKey]=useState(initialScenarioKey);
 const scenario=route.scenarios.find(s=>s.key===scenarioKey)??route.scenarios[0];
 const [step,setStep]=useState<Step>("choose");
 const [answers,setAnswers]=useState<Record<string,string>>({});
 const [versions,setVersions]=useState<Snapshot[]>([]);
 const [selectedVersion,setSelectedVersion]=useState<string|null>(null);
 const [dirty,setDirty]=useState(true);
 const [acknowledged,setAcknowledged]=useState(false);
 const [message,setMessage]=useState("");
 const required=useMemo(()=>route.fields.filter(f=>scenario.required.includes(f.key)),[route,scenario]);
 const review=getMilitaryCaseReview(route.id,scenario.key);
 const validation=validateMilitaryIntake(route,scenario,answers);
 const active=versions.find(v=>v.documentResult.versionId===selectedVersion);
 const emergency=scenario.kind==="URGENT_INSTRUCTION";
 const completeCount=required.filter(f=>!validation.missing.includes(f.key)&&!validation.invalid.includes(f.key)).length;

 function resetFor(routeNext:MilitaryRoute,scenarioNext:MilitaryScenario){
  setRouteId(routeNext.id);setScenarioKey(scenarioNext.key);
  setAnswers({});setSelectedVersion(null);setDirty(true);setAcknowledged(false);
  setMessage("");setStep("choose");
 }
 function changeValue(key:string,value:string){
  setAnswers(previous=>({...previous,[key]:value}));setDirty(true);setAcknowledged(false);setMessage("");
 }
 function generate(){
  try {
   if(!acknowledged)throw new Error("Подтвердите, что проверили исходные сведения.");
   const result=createMilitaryDocumentResult(route,scenario,answers,{
    versionId:crypto.randomUUID(),createdAt:new Date().toISOString()
   });
   const snapshot={documentResult:result,answers:{...answers}};
   setVersions(previous=>addDocumentVersion(
    previous.map(item=>({documentResult:item.documentResult,payload:item})),
    {documentResult:result,payload:snapshot}
   ).map(item=>item.payload));
   setSelectedVersion(result.versionId);setDirty(false);setStep("result");
   setMessage("Создан предварительный результат. До правовой приёмки подавать его нельзя.");
  } catch (e) {setMessage(e instanceof Error?e.message:"Не удалось подготовить результат.");}
 }
 async function downloadPdf(){
  if(!active||dirty)return;
  try {
   const result=active.documentResult,blob=await createFamilyLaborPdfBlob(result);
   const url=URL.createObjectURL(blob),a=document.createElement("a");
   a.href=url;a.download=result.documentSlug+"-"+result.versionId+".pdf";
   document.body.appendChild(a);a.click();a.remove();
   URL.revokeObjectURL(url);setMessage("PDF выбранной версии сформирован.");
  }catch {setMessage("Не удалось сформировать PDF. Попробуйте ещё раз.");}
 }
 async function downloadDocx(){
  if(!active||dirty)return;
  try {
   const result=active.documentResult;
   await downloadGeneratedDocumentDocx({
    title:result.documentTitle,content:result.documentText,linkifyUrls:true,
    fileName:result.documentSlug+"-"+result.versionId+".docx"
   });setMessage("DOCX выбранной версии сформирован.");
  }catch {setMessage("Не удалось сформировать DOCX. Попробуйте ещё раз.");}
 }
 function selectVersion(id:string){
  const snapshot=versions.find(v=>v.documentResult.versionId===id);
  if(!snapshot)return;
  const nextRoute=MILITARY_ROUTES.find(r=>r.slug===snapshot.documentResult.routeSlug);
  if(!nextRoute)return;
  setRouteId(nextRoute.id);setScenarioKey(snapshot.documentResult.scenarioKey);
  setSelectedVersion(id);setAnswers({...snapshot.answers});setDirty(false);
  setAcknowledged(true);setStep("result");setMessage("Выбрана неизменённая версия в этой вкладке.");
 }
 function backToFacts(){setStep("facts");setMessage("");}
 function cancelEditing(){
  if(!active)return;
  setAnswers({...active.answers});
  setDirty(false);setAcknowledged(true);setStep("result");
  setMessage("Изменения отменены. Сформированная версия не изменена.");
 }
 return <>
  <LegalRouteJourney stage="document" title={route.title} activeStep={step==="choose"?1:step==="result"?3:2}/>
  <section className="mx-auto max-w-5xl min-w-0 px-4 py-5 sm:px-6 lg:px-8">
   <p className="text-xs font-semibold uppercase tracking-wide text-amber-900">{publicDraft?"ПРОЕКТ ДЛЯ ЮРИДИЧЕСКОЙ ПРОВЕРКИ — НЕ ГОТОВО К ПОДАЧЕ":"ЗАКРЫТЫЙ ПРЕДПРОСМОТР — НЕ ГОТОВО К ПОДАЧЕ"}</p>
   <h1 className="mt-1 text-2xl font-semibold text-ink sm:text-3xl">Военное право — юридические маршруты</h1>
   <p className="mt-2 text-sm leading-6 text-zinc-700">
    6 направлений · 18 сценариев. Документы не согласованы юристом.
    Не вводите ФИО, номера частей, местоположение, задачи подразделений, диагнозы и чужие данные.
    Анкета остаётся в памяти вкладки и не отправляется в Neon.
   </p>
   {invalidSelection?<p role="alert" className="mt-4 rounded-lg border border-amber-400 bg-amber-50 p-3">
    Неизвестный адрес сценария. Показан первый доступный вариант; выберите нужный маршрут.</p>:null}
   {step==="choose"?<section className="mt-5" aria-label="Выбор юридической ситуации">
    <div className="flex flex-wrap items-center justify-between gap-2">
     <h2 className="text-xl font-semibold">Выберите направление</h2>
     <a href="#military-related-questions" className="text-sm font-semibold text-trust underline underline-offset-2">Похожие вопросы ↓</a>
    </div>
    <div className="mt-3 grid gap-2 sm:grid-cols-2">
     {MILITARY_ROUTES.map(r=><Link key={r.id} href={routeHref(r.id)}
       aria-current={route.id===r.id?"page":undefined}
       className={`min-w-0 rounded-lg border px-4 py-3 text-sm hover:border-trust focus:ring-2 focus:ring-trust ${route.id===r.id?"border-trust bg-emerald-50":"border-line"}`}>
       <span className="font-semibold">{r.title}</span>
       <span className="mt-1 block text-xs text-zinc-600">{r.scenarios.length} сценария</span>
      </Link>)}
    </div>
    <h3 className="mt-5 text-lg font-semibold">Выберите ситуацию</h3>
    <ul className="mt-3 grid gap-2">
     {route.scenarios.map(s=><li key={s.key}>
       <Link href={routeHref(route.id,s.key)}
        aria-current={scenario.key===s.key?"page":undefined}
        className={`block min-w-0 rounded-lg border px-4 py-3 text-sm hover:border-trust ${scenario.key===s.key?"border-trust bg-emerald-50":"border-line"}`}>
        <span className="font-semibold">{s.title}</span>
        <span className="mt-1 block text-xs text-zinc-600">{safeLabel(s.kind)}</span>
       </Link>
      </li>)}
    </ul>
    <details className="mt-4 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm">
     <summary className="cursor-pointer font-semibold">Ограничения выбранной ситуации</summary>
     <p className="mt-2 leading-6">{review.exclusionToCheck}</p>
    </details>
    {emergency?<div className="mt-5 rounded-lg border-l-4 border-red-700 bg-red-50 p-5" role="alert">
      <h3 className="font-semibold text-red-950">Сначала неотложная помощь</h3>
      {scenario.safetyNotes.map(t=><p key={t} className="mt-2 text-sm text-red-950">{t}</p>)}
      <p className="mt-2 text-sm text-red-950">Заполнение анкеты и генерация файла не предусмотрены.</p>
     </div>:<button type="button" onClick={()=>setStep("facts")}
     className="mt-6 min-h-11 rounded-md bg-trust px-6 py-3 text-sm font-semibold text-white">Перейти к анкете</button>}
   </section>:null}

   {step==="facts"&&!emergency?<section className="mt-7" aria-label="Пошаговая анкета">
    <h2 className="text-xl font-semibold">Анкета</h2>
    <p className="mt-2 text-sm leading-6 text-zinc-700">Сценарий: <strong>{scenario.title}</strong>. 
     Только обезличенные сведения. Даты и правовой статус указывайте по документам, а не по предположениям.</p>
    <p className="mt-3 text-xs text-zinc-600">Заполнено: {completeCount} из {required.length} обязательных полей.</p>
    <div className="mt-5 grid min-w-0 gap-4">
     {required.map(field=><LegalFormField key={field.key} id={"military-"+field.key}
      label={field.label} value={answers[field.key]??""} required
      kind={field.values?"select":"textarea"} rows={2} maxLength={2000}
      options={field.values?.map(v=>({value:v,label:v}))}
      hint={field.key==="urgency"?"Если помощь требуется или вы не уверены, генерация будет остановлена.":
        field.key==="medical"?"Не указывайте диагноз и не прикладывайте медицинские файлы.":undefined}
      error={validation.invalid.includes(field.key)?"Проверьте корректность заполнения.":undefined}
      onChange={v=>changeValue(field.key,v)}/>)}
    </div>
    <div className="mt-5 flex flex-wrap gap-3">
     <button type="button" onClick={()=>setStep("choose")} className="min-h-11 rounded-md border border-line px-5 py-3 text-sm font-semibold">Назад к ситуации</button>
     {active?<button type="button" onClick={cancelEditing}
      className="min-h-11 rounded-md border border-line px-5 py-3 text-sm font-semibold">Отменить изменения</button>:null}
     <button type="button" onClick={()=>setStep("review")} className="min-h-11 rounded-md bg-trust px-5 py-3 text-sm font-semibold text-white">Проверить сведения</button>
    </div>
   </section>:null}

   {step==="review"&&!emergency?<section className="mt-7" aria-label="Проверка перед генерацией">
    <h2 className="text-xl font-semibold">Проверьте сведения и риски</h2>
    <p className="mt-2 text-sm text-zinc-700">Ниже — обязательные вопросы для последующей юридической проверки. Они не являются заключением эксперта.</p>
    {validation.missing.length?<p role="alert" className="mt-4 rounded-md bg-amber-50 p-3 text-sm">
      Не заполнено: {validation.missing.map(k=>route.fields.find(f=>f.key===k)?.label??k).join("; ")}</p>:null}
    {validation.invalid.length?<p role="alert" className="mt-3 rounded-md bg-red-50 p-3 text-sm text-red-950">
      Неверно заполнены поля: {validation.invalid.join("; ")}</p>:null}
    {validation.warnings.map(w=><p role="alert" key={w} className="mt-3 rounded-md bg-amber-50 p-3 text-sm text-amber-950">{w}</p>)}
    <details className="mt-4 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3">
     <summary className="cursor-pointer font-semibold">Юридическая приёмка: 0 из 11 — нужна проверка эксперта</summary>
     <p className="mt-2 text-sm">Все критерии требуют независимого письменного заключения. Автотесты не подтверждают актуальность правовых оснований.</p>
     <ol className="mt-3 list-decimal space-y-1 pl-6 text-sm">
      {MILITARY_ACCEPTANCE_CHECKS.map(key=><li key={key}>{MILITARY_ACCEPTANCE_LABELS[key]} — не подтверждено</li>)}
     </ol>
    </details>
    <details className="mt-4 rounded-lg border border-line bg-white px-4 py-3 text-sm">
     <summary className="cursor-pointer font-semibold">Правовые вопросы, доказательства и источники</summary>
     <h3 className="mt-4 font-semibold">Правовые вопросы конкретного сценария</h3>
    <ol className="mt-2 list-decimal space-y-2 pl-6 text-sm leading-6">
     {[review.scopeToCheck,review.standingToCheck,review.addresseeToCheck,review.timeToCheck,review.exclusionToCheck].map(t=><li key={t}>{t}</li>)}
    </ol>
    <h3 className="mt-5 font-semibold">Доказательства и приложения</h3>
    <ul className="mt-2 list-disc space-y-1 pl-6 text-sm">
     {review.evidenceToCheck.map(e=><li key={e}>{e}</li>)}
    </ul>
    <h3 className="mt-5 font-semibold">Нормативные источники — требуют сверки редакций</h3>
    <ul className="mt-2 list-disc space-y-2 pl-6 text-sm">{getMilitaryPinpointLinks(route.id,scenario.key,answers.regime).map(ref=><li key={ref.id}><a className="underline underline-offset-2" href={militaryProvisionHref(ref)} target="_blank" rel="noreferrer noopener">{ref.citation}</a><span className="ml-2 text-zinc-600">({ref.pinpoint}; применимость и редакция на дату события требуют проверки)</span></li>)}</ul>
    </details>
    <label className="mt-4 flex items-start gap-3 rounded-md border border-line p-4 text-sm leading-6">
     <input type="checkbox" checked={acknowledged} disabled={!validation.complete}
      onChange={e=>setAcknowledged(e.target.checked)} className="mt-1 h-5 w-5" />
     <span>Я проверил введённые факты по своим документам и понимаю, что это предварительный материал, который нельзя подавать без юридической проверки.</span>
    </label>
    <div className="mt-5 flex flex-wrap gap-3">
     <button type="button" onClick={backToFacts}
      className="min-h-11 rounded-md border border-line px-5 py-3 text-sm font-semibold">Изменить данные</button>
     {active?<button type="button" onClick={cancelEditing}
      className="min-h-11 rounded-md border border-line px-5 py-3 text-sm font-semibold">Отменить изменения</button>:null}
     <button type="button" disabled={!validation.complete||!acknowledged} onClick={generate}
      className="min-h-11 rounded-md bg-trust px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">
      Создать предварительную версию
     </button>
    </div>
    {message?<p role="status" className="mt-3 text-sm">{message}</p>:null}
   </section>:null}

   {step==="result"&&active?<section className="mt-7" aria-label="Предварительный результат">
    <h2 className="text-xl font-semibold">Предварительный результат</h2>
    <div className="mt-4"><DocumentResultSummary result={active.documentResult} showArchive={false}>
     <p className="mt-2 text-sm">Сохранение в общий кабинет недоступно до юридической приёмки. Версия остаётся в памяти этой вкладки.</p>
    </DocumentResultSummary></div>
    <h3 className="mt-6 font-semibold">Сформированный материал</h3>
    <pre className="mt-3 max-h-[38rem] min-w-0 overflow-y-auto whitespace-pre-wrap break-words [overflow-wrap:anywhere] rounded-md border border-line bg-zinc-50 p-4 font-serif text-sm leading-6">
     {active.documentResult.documentText}
    </pre>
    <section className="mt-6 rounded-lg border border-line bg-white p-4" aria-label="Дальнейшие действия">
     <h3 className="font-semibold">Что необходимо сделать до использования результата</h3>
     <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6">
      <li>Сверьте введённые факты, подтверждённый статус и даты с оригиналами документов. Если сведения неверны, измените анкету и сформируйте новую версию.</li>
      <li>Подготовьте доказательства для индивидуальной проверки: {review.evidenceToCheck.join("; ")}.</li>
      <li>Передайте проект компетентному юристу на проверку полномочий, адресата, сроков, особого режима и применимого порядка. Автоматическое определение подсудности не производится.</li>
     </ol>
     <p className="mt-3 text-sm font-medium text-amber-900">
      Экспертная приёмка не предоставлена (0 из 11 критериев). Нельзя считать этот материал готовым к направлению.
     </p>
    </section>
    <section className="mt-5" aria-label="Официальные источники для проверки">
     <h3 className="font-semibold">Нормативные источники для проверки</h3>
     <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">{getMilitaryPinpointLinks(route.id,scenario.key,answers.regime).map(ref=><li key={ref.id}><a className="break-words text-trust underline underline-offset-2" href={militaryProvisionHref(ref)} target="_blank" rel="noreferrer noopener">{ref.citation}</a> — {ref.pinpoint}</li>)}</ul>
     <p className="mt-2 text-sm text-zinc-700">Ссылки указывают на опубликованные материалы, но их актуальная редакция, действие во времени и применимость к ситуации не подтверждены.</p>
    </section>
    <p className="mt-5 text-sm text-zinc-700">
     Передача документа юристу из этого маршрута пока не подключена. Реальные подтверждённые специалисты не подменяются демонстрационными профилями.
    </p>
    <div className="mt-5 flex flex-wrap gap-3" aria-label="Экспорт предварительного документа">
     <button type="button" disabled={dirty} onClick={()=>void downloadDocx()}
      className="min-h-11 rounded-md border border-trust px-4 py-2 text-sm font-semibold disabled:opacity-50">Скачать DOCX</button>
     <button type="button" disabled={dirty} onClick={()=>void downloadPdf()}
      className="min-h-11 rounded-md bg-trust px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">Скачать PDF</button>
     <button type="button" onClick={backToFacts}
      className="min-h-11 rounded-md border border-line px-4 py-2 text-sm font-semibold">Изменить и создать новую версию</button>
    </div>
    <DocumentVersionHistory versions={versions.map(v=>v.documentResult)}
     currentVersionId={active.documentResult.versionId} onSelect={selectVersion}/>
   </section>:null}
   {message&&step==="result"?<p role="status" className="mt-3 text-sm">{message}</p>:null}
  </section>
 </>;
}

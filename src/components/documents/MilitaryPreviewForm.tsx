"use client";
import {useMemo,useState} from "react";
import {MILITARY_ROUTES,type MilitaryRoute,type MilitaryScenario} from "@/data/military-route-plans";
import {createMilitaryDocumentResult,validateMilitaryIntake} from "@/lib/military-document-generator";
import type {DocumentResultV1} from "@/lib/document-result-contract";
import {downloadGeneratedDocumentDocx} from "@/lib/document-export";
import {createFamilyLaborPdfBlob} from "@/lib/family-labor-pdf";
import {addDocumentVersion} from "@/lib/document-version-history";
import {DocumentResultSummary} from "@/components/documents/DocumentResultSummary";
import {DocumentVersionHistory} from "@/components/documents/DocumentVersionHistory";
type Snapshot={documentResult:DocumentResultV1;answers:Record<string,string>};
export function MilitaryPreviewForm(){
 const [routeId,setRouteId]=useState(MILITARY_ROUTES[0].id);
 const route=MILITARY_ROUTES.find(r=>r.id===routeId)??MILITARY_ROUTES[0];
 const [scenarioKey,setScenarioKey]=useState(route.scenarios[0].key);
 const scenario=route.scenarios.find(s=>s.key===scenarioKey)??route.scenarios[0];
 const [answers,setAnswers]=useState<Record<string,string>>({});
 const [versions,setVersions]=useState<Snapshot[]>([]);
 const [selectedVersion,setSelectedVersion]=useState<string|null>(null);
 const [dirty,setDirty]=useState(true);
 const [message,setMessage]=useState("");
 const required=useMemo(()=>route.fields.filter(f=>scenario.required.includes(f.key)),[route,scenario]);
 const validation=validateMilitaryIntake(route,scenario,answers);
 const active=versions.find(v=>v.documentResult.versionId===selectedVersion);
 function changeRoute(next:string){
  const item=MILITARY_ROUTES.find(r=>r.id===next);if(!item)return;
  setRouteId(next);setScenarioKey(item.scenarios[0].key);setAnswers({});setSelectedVersion(null);setDirty(true);setMessage("");
 }
 function changeScenario(next:string){
  setScenarioKey(next);setAnswers({});setSelectedVersion(null);setDirty(true);setMessage("");
 }
 function generate(){
  try{
   const result=createMilitaryDocumentResult(route,scenario,answers,
    {versionId:crypto.randomUUID(),createdAt:new Date().toISOString()});
   const snapshot={documentResult:result,answers:{...answers}};
   setVersions(prev=>addDocumentVersion(prev.map(item=>({documentResult:item.documentResult,payload:item})),{documentResult:result,payload:snapshot}).map(item=>item.payload));
   setSelectedVersion(result.versionId);setDirty(false);
   setMessage("Создана предварительная версия. Обязательная индивидуальная юридическая проверка не пройдена.");
  }catch(e){setMessage(e instanceof Error?e.message:"Невозможно подготовить документ");}
 }
 async function downloadPdf(){
  if(!active||dirty)return;
  try{
   const result=active.documentResult;
   const blob=await createFamilyLaborPdfBlob(result);
   const url=URL.createObjectURL(blob);const link=document.createElement("a");
   link.href=url;link.download=result.documentSlug+"-"+result.versionId+".pdf";document.body.appendChild(link);
   link.click();link.remove();URL.revokeObjectURL(url);
  }catch{setMessage("Не удалось сформировать PDF выбранной версии.");}
 }
 async function downloadDocx(){
  if(!active||dirty)return;
  try{
   const result=active.documentResult;
   await downloadGeneratedDocumentDocx({title:result.documentTitle,content:result.documentText,
    fileName:result.documentSlug+"-"+result.versionId+".docx"});
  }catch{setMessage("Не удалось сформировать DOCX выбранной версии.");}
 }
 function selectVersion(versionId:string){
  const match=versions.find(v=>v.documentResult.versionId===versionId);
  if(!match)return;const matchRoute=MILITARY_ROUTES.find(r=>r.slug===match.documentResult.routeSlug);
  if(matchRoute){setRouteId(matchRoute.id);setScenarioKey(match.documentResult.scenarioKey);}
  setSelectedVersion(versionId);setAnswers({...match.answers});setDirty(false);setMessage("Восстановлена выбранная локальная версия.");
 }
 return <section className="mx-auto max-w-5xl p-4 sm:p-8">
  <p className="text-sm font-semibold text-amber-900">ВНУТРЕННИЙ ПРОТОТИП — НЕ ОПУБЛИКОВАНО, НЕ ГОТОВО К ПОДАЧЕ</p>
  <h1 className="mt-2 text-3xl font-semibold">Военное право: маршруты и генераторы</h1>
  <p className="mt-4 text-sm leading-6">Режим внутренней технической проверки. Факты остаются в браузере, не отправляются в Neon.
    Нормы, компетенция, специальные режимы и сроки требуют экспертного подтверждения перед использованием.</p>
  <label className="mt-6 block font-semibold">Направление
   <select aria-label="Военный маршрут" value={routeId} onChange={e=>changeRoute(e.target.value)}
    className="mt-2 w-full rounded-md border p-3 font-normal">
    {MILITARY_ROUTES.map(r=><option key={r.id} value={r.id}>{r.title}</option>)}
   </select>
  </label>
  <label className="mt-4 block font-semibold">Ситуация
   <select aria-label="Сценарий военного права" value={scenario.key} onChange={e=>changeScenario(e.target.value)}
    className="mt-2 w-full rounded-md border p-3 font-normal">
    {route.scenarios.map(s=><option key={s.key} value={s.key}>{s.title}</option>)}
   </select>
  </label>
  {scenario.kind==="URGENT_INSTRUCTION"?<div role="alert" className="mt-6 rounded-md border border-red-500 bg-red-50 p-5">
   <h2 className="font-semibold text-red-900">Неотложная помощь</h2>
   {scenario.safetyNotes.map(x=><p className="mt-2 text-sm text-red-900" key={x}>{x}</p>)}
   <p className="mt-2 text-sm">Анкета и генерация документа для экстренного сценария не предусмотрены.</p>
  </div>:<>
   <div className="mt-6 grid gap-4" aria-label="Данные юридической анкеты">
    {required.map(field=><label key={field.key} className="block text-sm font-semibold">
     {field.label} *
     {field.values?<select value={answers[field.key]??""}
       onChange={e=>{setAnswers(a=>({...a,[field.key]:e.target.value}));setDirty(true);}}
       className="mt-2 block min-h-11 w-full rounded-md border p-3 font-normal">
       <option value="">Выберите значение</option>
       {field.values.map(v=><option key={v} value={v}>{v}</option>)}
      </select>:<textarea value={answers[field.key]??""} maxLength={2000} rows={2}
       onChange={e=>{setAnswers(a=>({...a,[field.key]:e.target.value}));setDirty(true);}}
       className="mt-2 block w-full rounded-md border p-3 font-normal"/>}
    </label>)}
   </div>
   {validation.missing.length>0?<p className="mt-3 text-sm text-amber-800" role="status">Не заполнено: {validation.missing.map(x=>route.fields.find(f=>f.key===x)?.label??x).join("; ")}</p>:null}
   {validation.invalid.length>0?<p className="mt-3 text-sm text-red-800" role="alert">Неверно заполнены поля: {validation.invalid.join(", ")}</p>:null}
   {validation.warnings.map(w=><p key={w} role="alert" className="mt-3 text-sm text-red-800">{w}</p>)}
   <button type="button" disabled={!validation.complete} onClick={generate} className="mt-5 min-h-11 rounded-md bg-slate-900 px-5 py-3 text-white disabled:opacity-50">
    Создать предварительную версию
   </button>
   <p className="mt-3 text-sm" role="status">{message}</p>
  </>}
  {active&&<section className="mt-7 border-t pt-5">
   <DocumentResultSummary result={active.documentResult}/>
   <h2 className="mt-5 text-xl font-semibold">Версия документа</h2>
   <pre className="mt-3 max-h-[38rem] overflow-y-auto whitespace-pre-wrap break-words rounded-md border bg-slate-50 p-4">{active.documentResult.documentText}</pre>
   <div className="mt-4 flex flex-wrap gap-3">
    <button disabled={dirty} onClick={()=>void downloadDocx()} className="rounded-md border p-3 disabled:opacity-50">Экспорт DOCX</button>
    <button disabled={dirty} onClick={()=>void downloadPdf()} className="rounded-md border p-3 disabled:opacity-50">Экспорт PDF</button>
   </div>
   <DocumentVersionHistory versions={versions.map(x=>x.documentResult)} currentVersionId={active.documentResult.versionId} onSelect={selectVersion}/>
  </section>}
 </section>;
}

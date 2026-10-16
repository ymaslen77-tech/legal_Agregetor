"use client";
import {useMemo,useState} from "react";
import type {FamilyLaborPlan} from "@/data/family-labor-route-expansion";
import {getFamilyLaborGuidance} from "@/lib/family-labor-route-guidance";
import {createFamilyLaborDocument} from "@/lib/family-labor-document-result";
import {SUPPORTED_PROVISIONAL_DRAFTS} from "@/lib/family-labor-provisional-draft";
import type {DocumentResultV1} from "@/lib/document-result-contract";
import {downloadGeneratedDocumentDocx} from "@/lib/document-export";
import {createFamilyLaborPdfBlob} from "@/lib/family-labor-pdf";
import {addDocumentVersion} from "@/lib/document-version-history";
import {DocumentVersionHistory} from "@/components/documents/DocumentVersionHistory";
import {DocumentResultSummary} from "@/components/documents/DocumentResultSummary";
import {SaveLegalDocumentButton} from "@/components/documents/SaveLegalDocumentButton";

type Snapshot={result:DocumentResultV1;values:Record<string,string>};
export function FamilyLaborDocumentForm({plan,scenarioKey}:{plan:FamilyLaborPlan;scenarioKey:string}){
  const scenario=plan.scenarios.find(s=>s.key===scenarioKey);
  const [values,setValues]=useState<Record<string,string>>({});
  const [versions,setVersions]=useState<Array<{documentResult:DocumentResultV1;payload:Snapshot}>>([]);
  const [active,setActive]=useState<Snapshot|null>(null);
  const [message,setMessage]=useState("");
  const [dirty,setDirty]=useState(true);
  const required=useMemo(()=>scenario?plan.fields.filter(field=>scenario.requiredFields.includes(field.key)):[],[plan,scenario]);
  if(!scenario)return <p role="alert">Выбранный сценарий не найден.</p>;
  const emergency=scenario.emergencyFirst;
  const emergencyInfo=emergency?getFamilyLaborGuidance(plan,scenarioKey,{}):null;
  function create(){
    try{
      const checklist=createFamilyLaborDocument(plan,scenarioKey,values,{
        versionId:crypto.randomUUID(),createdAt:new Date().toISOString()
      });
      const snapshot:Snapshot={result:checklist.result,values:{...values}};
      setVersions(prev=>addDocumentVersion(prev,{documentResult:snapshot.result,payload:snapshot}));
      setActive(snapshot);setDirty(false);setMessage(snapshot.result.resultKind==="DRAFT"?"Создан маркированный проект; перед использованием требуется юридическая проверка.":"Персональный чек-лист создан. Перед обращением требуется юридическая проверка.");
    }catch(e){setMessage(e instanceof Error?e.message:"Исправьте исходные сведения.");}
  }
  function selectVersion(id:string){
    const snapshot=versions.find(x=>x.documentResult.versionId===id)?.payload;
    if(!snapshot)return;
    setActive(snapshot);setValues({...snapshot.values});setDirty(false);setMessage("Выбрана сохранённая в этой вкладке версия.");
  }
  async function downloadDocx(){
    if(!active||dirty)return;
    await downloadGeneratedDocumentDocx({
      title:active.result.documentTitle,
      fileName:active.result.documentSlug+"-"+active.result.versionId+".docx",
      content:active.result.documentText
    });
  }
  async function downloadPdf(){
    if(!active||dirty)return;
    try{
      const blob=await createFamilyLaborPdfBlob(active.result);
      const url=URL.createObjectURL(blob);
      const link=document.createElement("a");
      link.href=url;
      link.download=active.result.documentSlug+"-"+active.result.versionId+".pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setMessage("PDF сформирован из выбранной версии.");
    }catch{
      setMessage("PDF не сформирован. Проверьте текущую версию и попробуйте снова.");
    }
  }
  if(emergency){
    return <section className="mt-6 border-l-4 border-red-600 bg-red-50 p-5" role="alert">
      <h3 className="text-xl font-semibold text-red-950">Сначала безопасность</h3>
      <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-6 text-red-950">
        {emergencyInfo?.guidance.map(item=><li key={item}>{item}</li>)}
      </ol>
      <p className="mt-4 text-sm text-red-950">Экстренная помощь не зависит от заполнения сведений. Судебный документ на этой странице автоматически не формируется.</p>
    </section>;
  }
  const result= getFamilyLaborGuidance(plan,scenarioKey,values);
  const supportsDraft=SUPPORTED_PROVISIONAL_DRAFTS.some(id=>id===plan.id+"/"+scenarioKey);
  return <section id="fill-online" className="mt-6 min-w-0 max-w-full scroll-mt-24 rounded-lg border border-line bg-white p-4 sm:p-5" aria-label="Пошаговая анкета">
    <h2 className="text-xl font-semibold text-ink">Шаг 1. Обстоятельства и документы</h2>
    <p className="mt-2 text-sm leading-6 text-zinc-700">Вводите только необходимые данные. Они не отправляются на сервер при заполнении. Проверяйте даты и правовой статус по оригиналам документов.</p>
    <div className="mt-5 grid min-w-0 gap-4">
      {required.map(field=><label key={field.key} className="block min-w-0 text-sm font-medium text-ink">
        {field.label} <span aria-hidden="true">*</span>
        {field.options?<select value={values[field.key]??""}
            onChange={e=>{setValues(prev=>({...prev,[field.key]:e.target.value}));setDirty(true);}}
            className="mt-2 min-h-11 min-w-0 w-full rounded-md border border-line bg-white p-2 text-base">
          <option value="">Выберите значение</option>
          {field.options.map(opt=><option key={opt} value={opt}>{opt}</option>)}
        </select>:<textarea value={values[field.key]??""} maxLength={2000} rows={2}
          onChange={e=>{setValues(prev=>({...prev,[field.key]:e.target.value}));setDirty(true);}}
          className="mt-2 min-w-0 w-full rounded-md border border-line p-3 text-base" />}
      </label>)}
      {plan.id==="alimony-order-objections" && values.isLate==="да" &&
        <label className="block text-sm font-medium text-ink">Почему невозможно было подать возражения в срок?
          <textarea rows={3} maxLength={2000} value={values.lateReason??""}
            onChange={e=>{setValues(prev=>({...prev,lateReason:e.target.value}));setDirty(true);}}
            className="mt-2 w-full rounded-md border border-line p-3"/>
        </label>}
    </div>
    <div className="mt-5 border-t border-line pt-5">
      <h2 className="text-xl font-semibold text-ink">Шаг 2. Проверка ограничений</h2>
      {result.missing.length>0?<p role="status" className="mt-3 text-sm text-amber-900">Осталось заполнить: {result.missing.map(key=>plan.fields.find(f=>f.key===key)?.label??key).join("; ")}.</p>:null}
      {result.invalid.length>0?<p role="alert" className="mt-3 text-sm text-red-900">Исправьте поля: {result.invalid.join("; ")}.</p>:null}
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-6 text-zinc-700">
        {result.guidance.map(item=><li key={item}>{item}</li>)}
      </ol>
      <h3 className="mt-4 font-semibold">Что проверить в документах</h3>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-zinc-700">
        {result.documentsToCheck.map(item=><li key={item}>{item}</li>)}
      </ul>
    </div>
    <div className="mt-5 border-t border-line pt-5">
      <h2 className="text-xl font-semibold text-ink">Шаг 3. Подготовка результата</h2>
      <p className="mt-2 text-sm leading-6 text-zinc-700">В большинстве ситуаций доступен предварительный чек-лист. В ограниченных, подтверждённых правилами сценариях система создаёт только маркированный проект обращения, который нельзя подавать без юридической проверки.</p>
      <button type="button" disabled={!result.dataComplete}
        onClick={create} className="mt-4 min-h-11 rounded-md bg-trust px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">
        Создать новую версию {supportsDraft?"документа":"чек-листа"}
      </button>
      {message?<p className="mt-3 text-sm" role="status">{message}</p>:null}
      {active?<section className="mt-6">
        <DocumentResultSummary result={active.result}>
          <p className="mt-2 text-sm">Документ не одобрен к подаче в суд или государственный орган.</p>
        </DocumentResultSummary>
        <h3 className="mt-5 text-lg font-semibold">Полученный документ</h3>
        <pre className="mt-3 max-h-[35rem] min-w-0 max-w-full overflow-y-auto whitespace-pre-wrap break-words [overflow-wrap:anywhere] rounded-md border border-line bg-zinc-50 p-3 font-serif text-sm leading-6 sm:p-4">{active.result.documentText}</pre>
        <div className="mt-4 flex flex-wrap gap-3">
          <button type="button" disabled={dirty} onClick={()=>void downloadDocx()}
            className="min-h-11 min-w-0 max-w-full rounded-md border border-trust px-4 py-2 text-sm font-semibold text-trust disabled:opacity-50">
            Скачать DOCX
          </button>
          <button type="button" disabled={dirty} onClick={()=>void downloadPdf()}
            className="min-h-11 rounded-md border border-trust px-4 py-2 font-semibold text-trust disabled:opacity-50">
            Скачать PDF
          </button>
        </div>
        <SaveLegalDocumentButton key={active.result.versionId} result={active.result} disabled={dirty}/>
        <DocumentVersionHistory versions={versions.map(x=>x.documentResult)}
          currentVersionId={active.result.versionId} onSelect={selectVersion}/>
      </section>:null}
    </div>
  </section>;
}

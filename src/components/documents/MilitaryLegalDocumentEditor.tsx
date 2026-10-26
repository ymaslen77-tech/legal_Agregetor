"use client";

import {useMemo,useState} from "react";
import type {DocumentResultV1} from "@/lib/document-result-contract";
import {createMilitaryLegalDocumentResult,validateMilitaryLegalDocument} from "@/lib/military-legal-document-generator";
import {MILITARY_LEGAL_FIELDS,type MilitaryLegalDocument} from "@/data/military-legal-documents";
import {MILITARY_ROUTES} from "@/data/military-route-plans";
import {MilitaryPostDocumentGuide} from "@/components/documents/MilitaryPostDocumentGuide";
import {DocumentResultSummary} from "@/components/documents/DocumentResultSummary";
import {DocumentVersionHistory} from "@/components/documents/DocumentVersionHistory";
import {downloadGeneratedDocumentDocx} from "@/lib/document-export";
import {createFamilyLaborPdfBlob} from "@/lib/family-labor-pdf";
import {addDocumentVersion} from "@/lib/document-version-history";

type Snapshot={result:DocumentResultV1;values:Record<string,string>};
export function MilitaryLegalDocumentEditor({document}: {document:MilitaryLegalDocument}){
 const [values,setValues]=useState<Record<string,string>>({});
 const [versions,setVersions]=useState<Snapshot[]>([]);
 const [selectedVersion,setSelectedVersion]=useState<string|null>(null);
 const [dirty,setDirty]=useState(true);
 const [message,setMessage]=useState("");
 const [legalAcknowledgement,setLegalAcknowledgement]=useState(false);
 const validation=useMemo(()=>validateMilitaryLegalDocument(document,values),[document,values]);
 const active=versions.find(v=>v.result.versionId===selectedVersion);
 const scenario=MILITARY_ROUTES.flatMap(route=>route.scenarios).find(s=>s.key===document.scenarioKey);
 function change(key:string,value:string){
  setValues(prev=>({...prev,[key]:value}));
  setDirty(true);setLegalAcknowledgement(false);setMessage("");
 }
 function generate(){
  try{
   if(!validation.complete)throw new Error("Заполните обязательные реквизиты документа.");
   if(!legalAcknowledgement)throw new Error("Подтвердите ознакомление с юридическим предупреждением.");
   const result=createMilitaryLegalDocumentResult(document.slug,values,{
    versionId:crypto.randomUUID(),createdAt:new Date().toISOString()
   });
   const snapshot={result,values:{...values}};
   setVersions(prev=>addDocumentVersion(
    prev.map(item=>({documentResult:item.result,payload:item})),
    {documentResult:result,payload:snapshot}
   ).map(item=>item.payload));
   setSelectedVersion(result.versionId);setDirty(false);
   setMessage("Подготовлен проект "+document.formLabel.toLowerCase()+". Проверьте его юридически до использования.");
  }catch(e){setMessage(e instanceof Error?e.message:"Документ не сформирован.");}
 }
 async function downloadPdf(){
  if(!active||dirty)return;
  try{
   const blob=await createFamilyLaborPdfBlob(active.result);
   const url=URL.createObjectURL(blob);
   const a=document.createElement("a");a.href=url;
   a.download=document.slug+"-"+active.result.versionId+".pdf";
   window.document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);
   setMessage("PDF проекта сформирован.");
  }catch{setMessage("Не удалось сформировать PDF.");}
 }
 async function downloadDocx(){
  if(!active||dirty)return;
  try{
   await downloadGeneratedDocumentDocx({
    title:active.result.documentTitle,
    content:active.result.documentText,
    fileName:document.slug+"-"+active.result.versionId+".docx"
   });
   setMessage("DOCX проекта сформирован.");
  }catch{setMessage("Не удалось сформировать DOCX.");}
 }
 function restore(id:string){
  const v=versions.find(item=>item.result.versionId===id);
  if(!v)return;
  setValues({...v.values});setSelectedVersion(id);setDirty(false);
  setLegalAcknowledgement(true);setMessage("Выбрана сохранённая версия.");
 }
 return <section id="fill-online" className="mt-8 scroll-mt-24 rounded-lg border border-line bg-white p-4 sm:p-6" aria-label="Подготовка юридического документа">
  <h2 className="text-2xl font-semibold text-ink">Сформировать {document.formLabel.toLowerCase()}</h2>
  <p className="mt-2 text-sm leading-6 text-zinc-700">
   Укажите реквизиты, необходимые для этого вида юридического документа. Не переписывайте секретные сведения, сведения о дислокации подразделений или медицинские диагнозы.
   Введённые данные остаются в браузере до явного сохранения или отправки.
  </p>
  <div className="mt-5 grid gap-4">
   {document.fields.map((key,index)=>{
    const def=MILITARY_LEGAL_FIELDS[key];
    if(!def)return null;
    const isLong=["facts","proof","violation","grounds","desired","disagreement"].includes(key);
    const id="military-document-"+document.slug+"-"+key;
    return <div key={key} className="min-w-0">
     <label htmlFor={id} className="text-sm font-semibold text-ink">{index+1}. {def.label} <span className="text-amber-900">*</span></label>
     {isLong?<textarea id={id} rows={3} maxLength={1600} required value={values[key]??""}
       onChange={e=>change(key,e.target.value)}
       aria-invalid={validation.invalid.includes(key)||undefined}
       className="mt-2 w-full rounded-md border border-line px-3 py-2 text-base"/>:
      <input id={id} type="text" maxLength={1600} required value={values[key]??""}
       onChange={e=>change(key,e.target.value)}
       placeholder={key==="date"||key==="birthDate"?"ДД.ММ.ГГГГ":undefined}
       aria-invalid={validation.invalid.includes(key)||undefined}
       className="mt-2 min-h-11 w-full rounded-md border border-line px-3 py-2 text-base"/>}
     <p className="mt-1 text-xs leading-5 text-zinc-600">{def.hint}</p>
     {validation.invalid.includes(key)?<p role="alert" className="mt-1 text-sm text-red-900">Проверьте формат или длину реквизита.</p>:null}
    </div>;
   })}
  </div>
  <div role="alert" className="mt-5 rounded-md border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
   <p className="font-semibold">Документ требует индивидуальной юридической проверки до подачи.</p>
   <p className="mt-2">{document.kind==="court"?
    "Судебная подсудность, допустимый вид производства, надлежащие стороны, срок, госпошлина, копии участникам и выбранные требования не подтверждаются автоматически.":
    "Необходимо проверить правовой статус, компетенцию адресата, применимость нормы, доказательства и способ подачи."}</p>
   <p className="mt-2">Используется структура опубликованных юридических образцов и нормативные требования; сервис не гарантирует удовлетворение заявления или принятие иска.</p>
  </div>
  <label className="mt-4 flex items-start gap-3 text-sm leading-6">
   <input type="checkbox" className="mt-1 h-5 w-5 shrink-0" checked={legalAcknowledgement}
      onChange={e=>setLegalAcknowledgement(e.target.checked)} />
   <span>Я проверил введённые сведения по документам и понимаю, что подготовленный проект необходимо проверить юридически до подачи.</span>
  </label>
  {validation.missing.length?<p role="status" className="mt-3 text-sm text-zinc-600">Осталось заполнить обязательных реквизитов: {validation.missing.length}.</p>:null}
  <button type="button" onClick={generate} disabled={!validation.complete||!legalAcknowledgement}
   className="mt-5 min-h-11 rounded-md bg-trust px-6 py-3 font-semibold text-white disabled:opacity-50">
   Сформировать {document.formLabel.toLowerCase()}
  </button>
  {message?<p role="status" className="mt-3 text-sm">{message}</p>:null}
  {active?<section className="mt-7 border-t border-line pt-6" aria-label="Сформированный юридический документ">
   <h3 className="text-xl font-semibold">Ваш документ: {active.result.documentTitle}</h3>
   <DocumentResultSummary result={active.result} hideVersionId/>
   <pre className="mt-4 max-h-[40rem] max-w-full overflow-y-auto whitespace-pre-wrap break-words rounded-md border border-line bg-zinc-50 p-4 font-serif text-sm leading-7">{active.result.documentText}</pre>
   <div className="mt-4 flex flex-wrap gap-3">
    <button type="button" disabled={dirty} onClick={()=>void downloadPdf()} className="min-h-11 rounded-md bg-trust px-5 py-3 font-semibold text-white disabled:opacity-50">Скачать PDF</button>
    <button type="button" disabled={dirty} onClick={()=>void downloadDocx()} className="min-h-11 rounded-md border border-trust px-5 py-3 font-semibold text-trust disabled:opacity-50">Скачать DOCX</button>
   </div>
   <DocumentVersionHistory versions={versions.map(x=>x.result)} currentVersionId={active.result.versionId} onSelect={restore} hideIds/>
   <MilitaryPostDocumentGuide key={active.result.versionId} scenarioKey={document.scenarioKey} resultKind={active.result.resultKind} evidence={scenario?.evidence??[]}/>
  </section>:null}
 </section>;
}

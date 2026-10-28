"use client";
import {useState} from "react";
import {downloadGeneratedDocumentDocx} from "@/lib/document-export";
import {createMilitaryPdfBlob} from "@/lib/military-pdf";
import {buildMilitaryDraft,type MilitaryDocumentCandidate} from "@/data/military-document-candidates";
type Props={candidate:MilitaryDocumentCandidate;slug:string};
type InputKey="applicant"|"recipient"|"facts"|"attachments";
type Snapshot={id:string;createdAt:string;text:string;values:Record<InputKey,string>};
export function MilitaryDraftForm({candidate,slug}:Props){
 const [values,setValues]=useState<Record<InputKey,string>>({applicant:"",recipient:"",facts:"",attachments:""});
 const [error,setError]=useState<string|null>(null);
 const [busy,setBusy]=useState(false);
 const [prepared,setPrepared]=useState<Snapshot|null>(null);
 const [versions,setVersions]=useState<Snapshot[]>([]);
 const set=(key:InputKey,value:string)=>{setValues(current=>({...current,[key]:value}));setPrepared(null);setError(null);};
 async function generate(event:React.FormEvent<HTMLFormElement>){
   event.preventDefault();setError(null);
   try{
     const snapshot:Snapshot={id:crypto.randomUUID(),createdAt:new Date().toISOString(),text:buildMilitaryDraft(candidate,values),values:{...values}};
     setVersions(prev=>[snapshot,...prev].slice(0,10));setPrepared(snapshot);
   }
   catch(e){setError(e instanceof Error?e.message:"Проверьте необходимые сведения.");}
 }
 async function downloadDocx(){
   if(!prepared)return;
   setBusy(true);setError(null);
   try{await downloadGeneratedDocumentDocx({title:candidate.title,fileName:"voennoe-pravo-"+slug+"-"+prepared.id+".docx",content:prepared.text});}
   catch{setError("Не удалось подготовить DOCX-файл.");}
   finally{setBusy(false);}
 }
 async function downloadPdf(){
   if(!prepared)return;
   setBusy(true);setError(null);
   try{
     const blob=await createMilitaryPdfBlob(candidate.title,prepared.text);
     const url=URL.createObjectURL(blob);
     const link=document.createElement("a");
     link.href=url;link.download="voennoe-pravo-"+slug+"-"+prepared.id+".pdf";
     document.body.appendChild(link);link.click();link.remove();URL.revokeObjectURL(url);
   }catch{setError("Не удалось сформировать PDF-файл.");}
   finally{setBusy(false);}
 }
 const fields:ReadonlyArray<{key:InputKey;label:string;hint:string;required:boolean;rows:number}>=[
   {key:"applicant",label:"Заявитель: ФИО, статус и данные для ответа",hint:"Реквизиты, которые должны быть отражены в обращении",required:true,rows:2},
   {key:"recipient",label:"Адресат: наименование органа или должность",hint:"Укажите проверенного получателя — компетенция зависит от обстоятельств",required:true,rows:2},
   {key:"facts",label:"Обстоятельства, даты и реквизиты для документа",hint:candidate.factsPrompt,required:true,rows:4},
   {key:"attachments",label:"Приложения, если имеются",hint:"Названия подтверждающих документов",required:false,rows:2}
 ];
 return <section className="mt-8 rounded-lg border border-line bg-white p-5 sm:p-6" aria-labelledby="military-document-preparation">
   <p className="text-sm font-semibold uppercase text-trust">Подготовка юридического документа</p>
   <h2 className="mt-2 text-xl font-semibold text-ink" id="military-document-preparation">{candidate.title}</h2>
   <p className="mt-3 text-sm leading-6 text-zinc-700">Это проект для проверки, а не готовое заявление для подачи. Заполняются только необходимые реквизиты документа и факты, которые не определяются выбранной ситуацией. Сведения обрабатываются в браузере и не отправляются на сервер этим компонентом.</p>
   <p className="mt-3 rounded-md border border-line bg-zinc-50 p-3 text-sm text-zinc-700"><strong>Требование для выбранной ситуации:</strong> {candidate.requestText}</p>
   <form onSubmit={generate} className="mt-5 grid gap-4">
      {fields.map(field=><label key={field.key} className="block text-sm font-semibold text-ink">
        <span>{field.label}{field.required?" *":""}</span>
        <textarea className="mt-2 block w-full rounded-md border border-line px-3 py-2 text-base font-normal leading-6 text-ink focus:border-trust focus:outline-none focus:ring-2 focus:ring-trust/25" required={field.required} minLength={field.required?field.key==="facts"?15:5:undefined} maxLength={field.key==="applicant"||field.key==="recipient"?500:field.key==="attachments"?1500:3000} rows={field.rows} value={values[field.key]} onChange={event=>set(field.key,event.target.value)} aria-describedby={"hint-"+field.key} />
        <span id={"hint-"+field.key} className="mt-1 block font-normal text-zinc-500">{field.hint}</span>
      </label>)}
      <button className="min-h-11 rounded-md bg-trust px-5 py-3 font-semibold text-white hover:bg-ink" type="submit">Сформировать проект документа</button>
   </form>
   {error?<p role="alert" className="mt-4 text-sm text-red-700">{error}</p>:null}
   {prepared?<section className="mt-6 border-t border-line pt-5">
      <h3 className="text-lg font-semibold">Предварительный проект</h3>
      <p className="mt-2 text-xs text-zinc-500">Версия: {prepared.id.slice(0,8)}; сформировано: {new Date(prepared.createdAt).toLocaleString("ru-RU")}</p>
      <pre className="mt-3 whitespace-pre-wrap break-words rounded-md bg-zinc-50 p-4 text-sm leading-6 text-zinc-800">{prepared.text}</pre>
      <div className="mt-4 flex flex-wrap gap-3">
        <button type="button" disabled={busy} onClick={downloadDocx} className="min-h-11 rounded-md border border-trust px-4 py-2 font-semibold text-trust disabled:opacity-60">Скачать DOCX</button>
        <button type="button" onClick={downloadPdf} className="min-h-11 rounded-md border border-trust px-4 py-2 font-semibold text-trust">Скачать PDF</button>
      </div>
      <p className="mt-3 text-xs text-zinc-600">Проверьте документ, ссылки на нормы, полномочия заявителя, реквизиты адресата и приложения перед использованием.</p>
      {versions.length>1?<div className="mt-4 border-t border-line pt-3">
        <p className="mb-2 text-sm font-semibold text-ink">Ранее сформированные версии (только в этой вкладке)</p>
        <div className="flex flex-wrap gap-2">{versions.map(version=>
          <button type="button" key={version.id} onClick={()=>{setValues({...version.values});setPrepared(version);setError(null);}}
            className="rounded-md border border-line px-3 py-2 text-xs hover:border-trust"
            aria-current={prepared.id===version.id?"true":undefined}>
            {new Date(version.createdAt).toLocaleString("ru-RU")} · {version.id.slice(0,8)}
          </button>)}</div>
      </div>:null}
    </section>:null}
 </section>;
}

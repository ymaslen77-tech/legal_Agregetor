"use client";
import {useState} from "react";
import {downloadGeneratedDocumentDocx,downloadGeneratedDocumentPdf} from "@/lib/document-export";
import {buildMilitaryDraft,type MilitaryDocumentCandidate} from "@/data/military-document-candidates";
type Props={candidate:MilitaryDocumentCandidate;slug:string};
type InputKey="applicant"|"recipient"|"facts"|"request"|"attachments";
export function MilitaryDraftForm({candidate,slug}:Props){
 const [values,setValues]=useState<Record<InputKey,string>>({applicant:"",recipient:"",facts:"",request:"",attachments:""});
 const [error,setError]=useState<string|null>(null);
 const [busy,setBusy]=useState(false);
 const [prepared,setPrepared]=useState<string|null>(null);
 const set=(key:InputKey,value:string)=>{setValues(current=>({...current,[key]:value}));setPrepared(null);setError(null);};
 async function generate(event:React.FormEvent<HTMLFormElement>){
   event.preventDefault();setError(null);
   try{setPrepared(buildMilitaryDraft(candidate,values));}
   catch(e){setError(e instanceof Error?e.message:"Проверьте необходимые сведения.");}
 }
 async function downloadDocx(){
   if(!prepared)return;
   setBusy(true);setError(null);
   try{await downloadGeneratedDocumentDocx({title:candidate.title,fileName:"voennoe-pravo-"+slug+"-proekt.docx",content:prepared});}
   catch{setError("Не удалось подготовить DOCX-файл.");}
   finally{setBusy(false);}
 }
 function printPdf(){
   if(!prepared)return;
   try{downloadGeneratedDocumentPdf({title:candidate.title,content:prepared});}
   catch{setError("Не удалось открыть окно печати. Разрешите всплывающие окна.");}
 }
 const fields:ReadonlyArray<{key:InputKey;label:string;hint:string;required:boolean;rows:number}>=[
   {key:"applicant",label:"Заявитель: ФИО, статус и данные для ответа",hint:"Реквизиты, которые должны быть отражены в обращении",required:true,rows:2},
   {key:"recipient",label:"Получатель: наименование органа или должность",hint:"Заполняется заявителем — сервис не определяет компетенцию автоматически",required:true,rows:2},
   {key:"facts",label:"Конкретные обстоятельства и даты",hint:"Только обстоятельства, важные для этого документа",required:true,rows:4},
   {key:"request",label:"Что именно просите",hint:"Сформулируйте юридическое требование своими словами",required:true,rows:3},
   {key:"attachments",label:"Приложения, если имеются",hint:"Названия подтверждающих документов",required:false,rows:2}
 ];
 return <section className="mt-8 rounded-lg border border-line bg-white p-5 sm:p-6" aria-labelledby="military-document-preparation">
   <p className="text-sm font-semibold uppercase text-trust">Подготовка юридического документа</p>
   <h2 className="mt-2 text-xl font-semibold text-ink" id="military-document-preparation">{candidate.title}</h2>
   <p className="mt-3 text-sm leading-6 text-zinc-700">Это проект для проверки, а не готовое заявление для подачи. Заполняются только реквизиты самого документа, без анкетирования. Сведения обрабатываются в браузере и не отправляются на сервер этим компонентом.</p>
   <form onSubmit={generate} className="mt-5 grid gap-4">
      {fields.map(field=><label key={field.key} className="block text-sm font-semibold text-ink">
        <span>{field.label}{field.required?" *":""}</span>
        <textarea className="mt-2 block w-full rounded-md border border-line px-3 py-2 text-base font-normal leading-6 text-ink focus:border-trust focus:outline-none focus:ring-2 focus:ring-trust/25" required={field.required} minLength={field.required?field.key==="facts"?15:field.key==="request"?10:5:undefined} maxLength={field.key==="applicant"||field.key==="recipient"?500:field.key==="attachments"?1500:3000} rows={field.rows} value={values[field.key]} onChange={event=>set(field.key,event.target.value)} aria-describedby={"hint-"+field.key} />
        <span id={"hint-"+field.key} className="mt-1 block font-normal text-zinc-500">{field.hint}</span>
      </label>)}
      <button className="min-h-11 rounded-md bg-trust px-5 py-3 font-semibold text-white hover:bg-ink" type="submit">Сформировать проект документа</button>
   </form>
   {error?<p role="alert" className="mt-4 text-sm text-red-700">{error}</p>:null}
   {prepared?<section className="mt-6 border-t border-line pt-5">
      <h3 className="text-lg font-semibold">Предварительный проект</h3>
      <pre className="mt-3 whitespace-pre-wrap break-words rounded-md bg-zinc-50 p-4 text-sm leading-6 text-zinc-800">{prepared}</pre>
      <div className="mt-4 flex flex-wrap gap-3">
        <button type="button" disabled={busy} onClick={downloadDocx} className="min-h-11 rounded-md border border-trust px-4 py-2 font-semibold text-trust disabled:opacity-60">Скачать DOCX</button>
        <button type="button" onClick={printPdf} className="min-h-11 rounded-md border border-trust px-4 py-2 font-semibold text-trust">Печать / сохранить PDF</button>
      </div>
      <p className="mt-3 text-xs text-zinc-600">Проверьте документ, ссылки на нормы, полномочия заявителя, реквизиты адресата и приложения перед использованием.</p>
    </section>:null}
 </section>;
}

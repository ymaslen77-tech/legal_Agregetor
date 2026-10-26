"use client";

import {useState,type FormEvent} from "react";
import Link from "next/link";
import {createFamilyLaborPdfBlob} from "@/lib/family-labor-pdf";
import type {DocumentResultV1} from "@/lib/document-result-contract";

type ReviewReply={ok?:boolean;id?:string;withdrawalToken?:string;message?:string};
export function MilitaryDocumentReviewForm({result}:{result:DocumentResultV1}){
 const [open,setOpen]=useState(false);
 const [name,setName]=useState("");
 const [phone,setPhone]=useState("");
 const [email,setEmail]=useState("");
 const [message,setMessage]=useState("Прошу проверить правовые основания, адресата, сроки и текст обращения.");
 const [personalConsent,setPersonalConsent]=useState(false);
 const [transferConsent,setTransferConsent]=useState(false);
 const [busy,setBusy]=useState(false);
 const [error,setError]=useState("");
 const [submitted,setSubmitted]=useState<{id:string;token:string}|null>(null);
 const [withdrawn,setWithdrawn]=useState(false);
 async function submit(event:FormEvent<HTMLFormElement>){
  event.preventDefault();
  if(busy||submitted)return;
  if(!personalConsent||!transferConsent){setError("Нужно подтвердить оба согласия.");return;}
  setBusy(true);setError("");
  try{
   const pdf=await createFamilyLaborPdfBlob(result);
   if(pdf.size>5*1024*1024)throw new Error("PDF превышает 5 МБ.");
   const data=new FormData();
   data.set("attachment",new File([pdf],result.documentSlug+"-"+result.versionId+".pdf",{type:"application/pdf"}));
   data.set("name",name.trim());
   data.set("phone",phone.trim());
   data.set("email",email.trim());
   data.set("message",message.trim());
   data.set("sourcePage","/voennoe-pravo/");
   data.set("sourceType","DOCUMENT_REVIEW");
   data.set("consent","true");
   data.set("contactTransferConsent","true");
   data.set("format","online");
   data.set("structuredPayload",JSON.stringify({
    legalArea:"military",routeSlug:result.routeSlug,scenarioKey:result.scenarioKey,
    documentVersion:result.versionId,documentStatus:"DRAFT_REQUIRES_LEGAL_REVIEW"
   }));
   const response=await fetch("/api/leads/",{method:"POST",body:data});
   const reply=(await response.json().catch(()=>({}))) as ReviewReply;
   if(!response.ok||!reply.ok||!reply.id||!reply.withdrawalToken)
    throw new Error(reply.message||"Не удалось отправить документ.");
   setSubmitted({id:reply.id,token:reply.withdrawalToken});
  }catch(e){setError(e instanceof Error?e.message:"Не удалось отправить документ.");}
  finally{setBusy(false);}
 }
 async function withdraw(){
  if(!submitted||busy)return;
  setBusy(true);setError("");
  try{
   const res=await fetch("/api/leads/"+encodeURIComponent(submitted.id)+"/document-review/",{
    method:"DELETE",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({token:submitted.token})
   });
   if(!res.ok)throw new Error("Не удалось отозвать согласие. Обратитесь в поддержку.");
   setWithdrawn(true);
  }catch(e){setError(e instanceof Error?e.message:"Не удалось отозвать согласие.");}
  finally{setBusy(false);}
 }
 return <div className="min-w-0">
  <button type="button" onClick={()=>setOpen(value=>!value)} disabled={!!submitted}
   className="min-h-11 rounded-md border border-trust bg-white px-4 py-2 text-sm font-semibold text-trust disabled:opacity-60">
   Отправить на проверку юристу
  </button>
  {open?<section className="mt-4 rounded-lg border border-line bg-white p-4" aria-label="Передача документа на юридическую проверку">
   {submitted?<div role="status" className="space-y-3 text-sm leading-6">
    <p className="font-semibold text-ink">{withdrawn?"Согласие отозвано, файл удалён.":"Документ принят платформой и ожидает назначения юриста."}</p>
    {!withdrawn?<><p>Это не означает, что юрист уже получил или проверил документ.</p>
     <button type="button" disabled={busy} onClick={()=>void withdraw()} className="min-h-11 rounded-md border border-line px-4 py-2 text-sm font-semibold">Отозвать согласие и удалить PDF</button></>:null}
   </div>:<form onSubmit={e=>void submit(e)} className="grid gap-3">
    <h3 className="text-lg font-semibold">Проверка документа юристом</h3>
    <p className="text-sm leading-6 text-zinc-700">Документ поступит администратору сервиса для назначения специалиста. Не указывайте воинскую часть, служебные сведения и диагнозы.</p>
    <label className="grid gap-1 text-sm font-medium">Имя
     <input required minLength={2} maxLength={120} value={name} onChange={e=>setName(e.target.value)} className="min-h-11 rounded-md border border-line px-3 py-2"/>
    </label>
    <label className="grid gap-1 text-sm font-medium">Телефон
     <input required minLength={6} maxLength={40} type="tel" value={phone} onChange={e=>setPhone(e.target.value)} className="min-h-11 rounded-md border border-line px-3 py-2"/>
    </label>
    <label className="grid gap-1 text-sm font-medium">Email (необязательно)
     <input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="min-h-11 rounded-md border border-line px-3 py-2"/>
    </label>
    <label className="grid gap-1 text-sm font-medium">Что проверить?
     <textarea required minLength={10} maxLength={1500} rows={3} value={message} onChange={e=>setMessage(e.target.value)} className="rounded-md border border-line p-3"/>
    </label>
    <label className="flex items-start gap-2 text-sm leading-6">
     <input type="checkbox" required checked={personalConsent} onChange={e=>setPersonalConsent(e.target.checked)} className="mt-1"/>
     <span>Согласен на <Link href="/legal/personal-data-consent/" target="_blank" rel="noopener noreferrer" className="text-trust underline">обработку персональных данных</Link>.</span>
    </label>
    <label className="flex items-start gap-2 text-sm leading-6">
     <input type="checkbox" required checked={transferConsent} onChange={e=>setTransferConsent(e.target.checked)} className="mt-1"/>
     <span>Согласен на передачу PDF и контактов специалисту после назначения. Файл хранится до 30 дней; согласие можно отозвать.</span>
    </label>
    <button type="submit" disabled={busy||!personalConsent||!transferConsent} className="min-h-11 rounded-md bg-trust px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
     {busy?"Отправляем…":"Подтвердить отправку PDF"}
    </button>
   </form>}
   {error?<p role="alert" className="mt-3 text-sm text-red-700">{error}</p>:null}
  </section>:null}
 </div>;
}

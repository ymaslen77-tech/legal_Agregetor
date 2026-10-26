"use client";
import {useState} from "react";
import {prepareMilitaryOfficialDraft,getMilitaryDraftFields,type MilitaryReadyDraftKey,type MilitaryDocumentFacts} from "@/lib/military-official-document-drafts";
import {getMilitaryDocumentBlueprint} from "@/data/military-document-blueprints";
import {downloadGeneratedDocumentDocx} from "@/lib/document-export";

export function MilitaryOfficialDocumentPage({documentKey}:{documentKey:MilitaryReadyDraftKey}){
 const blueprint=getMilitaryDocumentBlueprint(documentKey)!;
 const [values,setValues]=useState<Partial<MilitaryDocumentFacts>>({});
 const [generated,setGenerated]=useState<string|null>(null);
 const [notice,setNotice]=useState("");
 const fields=getMilitaryDraftFields(documentKey);
 function change(key:string,value:string){setValues(p=>({...p,[key]:value}));setGenerated(null);setNotice("");}
 function prepare(){
  const result=prepareMilitaryOfficialDraft(documentKey,values as MilitaryDocumentFacts);
  if(!result.draft){setNotice("Для составления документа заполните: "+result.missing.join("; "));return;}
  setGenerated(result.draft);
  setNotice("Рапорт составлен по введённым сведениям. Проверьте документ и полномочия адресата.");
 }
 async function pdf(){
  if(!generated)return;
  const {createFamilyLaborPdfBlob}=await import("@/lib/family-labor-pdf");
  const {documentResultSchema}=await import("@/lib/document-result-contract");
  const blob=await createFamilyLaborPdfBlob(documentResultSchema.parse({
   contractVersion:"DOCUMENT_RESULT_V1",
   versionId:crypto.randomUUID(),createdAt:new Date().toISOString(),
   categorySlug:"voennoe-pravo",routeSlug:"military-document",scenarioKey:documentKey,
   documentSlug:blueprint.slug,resultKind:"DRAFT",source:"DETERMINISTIC",
   documentTitle:blueprint.title,documentText:generated,usedRuleIds:[],
   placeholders:[],legalRegistryReviewedAt:null,generatorVersion:"military-official-draft-1",
   filingReady:false,requiresLegalReview:true
  }));
  const url=URL.createObjectURL(blob),a=document.createElement("a");
  a.href=url;a.download=blueprint.slug+".pdf";document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);
 }
 return <section id="fill-online" className="mt-7 scroll-mt-24 rounded-lg border border-line bg-white p-5" aria-label="Составление юридического документа">
  <h2 className="text-xl font-semibold">Составить {blueprint.title.toLowerCase()}</h2>
  <p className="mt-2 text-sm text-zinc-700">Укажите необходимые сведения из своих документов. Не вводите данные о месте дислокации, не относящиеся к обращению персональные сведения или секретную информацию.</p>
  <div className="mt-4 grid gap-4">
   {fields.map(field=><label key={field.key} className="text-sm font-semibold">{field.label}
    <input value={values[field.key as keyof MilitaryDocumentFacts]??""} onChange={e=>change(field.key,e.target.value)}
     className="mt-2 min-h-11 w-full rounded-md border border-line p-3 text-base font-normal" maxLength={700}/>
   </label>)}
  </div>
  <p className="mt-4 rounded-md border border-amber-300 bg-amber-50 p-3 text-sm text-amber-950">Обязательная проверка перед направлением: компетенция адресата, статус, сведения и приложения. Созданный файл не отправляется автоматически.</p>
  <button type="button" className="mt-4 min-h-11 rounded-md bg-trust px-5 py-3 text-sm font-semibold text-white" onClick={prepare}>Сформировать рапорт</button>
  {notice?<p role="status" className="mt-3 text-sm">{notice}</p>:null}
  {generated?<section className="mt-6" aria-label="Созданный рапорт">
   <h3 className="font-semibold">{blueprint.title}</h3>
   <pre className="mt-3 whitespace-pre-wrap break-words rounded-md border border-line bg-zinc-50 p-4 font-serif text-sm leading-6">{generated}</pre>
   <div className="mt-4 flex flex-wrap gap-3">
    <button type="button" onClick={()=>void pdf()} className="min-h-11 rounded-md border border-trust px-4 py-2 font-semibold text-trust">Скачать PDF</button>
    <button type="button" onClick={()=>void downloadGeneratedDocumentDocx({title:blueprint.title,content:generated,fileName:blueprint.slug+".docx"})} className="min-h-11 rounded-md border border-trust px-4 py-2 font-semibold text-trust">Скачать DOCX</button>
   </div>
  </section>:null}
 </section>;
}

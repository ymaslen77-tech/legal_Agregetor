"use client";
import {useState} from "react";
import {composeMilitaryDocument,getMilitaryDocumentFields} from "@/lib/military-document-composer";
import {getMilitaryDocumentBlueprint} from "@/data/military-document-blueprints";
import {downloadGeneratedDocumentDocx} from "@/lib/document-export";
import {documentResultSchema} from "@/lib/document-result-contract";
import {MilitaryPostDocumentGuide} from "@/components/documents/MilitaryPostDocumentGuide";

export function MilitaryOfficialDocumentPage({documentKey}:{documentKey:string}){
 const blueprint=getMilitaryDocumentBlueprint(documentKey)!;
 const [values,setValues]=useState<Record<string,string>>({});
 const [generated,setGenerated]=useState<string|null>(null);
 const [version,setVersion]=useState("");
 const [notice,setNotice]=useState("");
 const [approved,setApproved]=useState(false);
 const fields=getMilitaryDocumentFields(documentKey);
 function change(key:string,value:string){
  setValues(p=>({...p,[key]:value}));setGenerated(null);setVersion("");setNotice("");setApproved(false);
 }
 function prepare(){
  if(!approved){setNotice("Перед созданием документа подтвердите проверку исходных сведений.");return;}
  const result=composeMilitaryDocument(documentKey,values);
  if(!result.document){setNotice("Для составления документа укажите: "+result.missing.join("; "));return;}
  setGenerated(result.document.text);
  setVersion(crypto.randomUUID());
  setNotice("Документ сформирован. Проверьте текст, реквизиты и применимые правовые нормы перед использованием.");
 }
 async function downloadPdf(){
  if(!generated||!version)return;
  try{
   const {createMilitaryLegalDocumentPdfBlob}=await import("@/lib/military-legal-document-pdf");
   const blob=await createMilitaryLegalDocumentPdfBlob(documentResultSchema.parse({
    contractVersion:"DOCUMENT_RESULT_V1",
    versionId:version,createdAt:new Date().toISOString(),
    categorySlug:"voennoe-pravo",routeSlug:"military-documents",scenarioKey:documentKey,
    documentSlug:blueprint.slug,resultKind:"DRAFT",source:"DETERMINISTIC",
    documentTitle:blueprint.title,documentText:generated,
    usedRuleIds:[],placeholders:[],legalRegistryReviewedAt:null,
    generatorVersion:"military-document-1",filingReady:false,requiresLegalReview:true
   }));
   const url=URL.createObjectURL(blob),a=document.createElement("a");
   a.href=url;a.download=blueprint.slug+".pdf";
   document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);
   setNotice("PDF сформирован из текущей версии документа.");
  }catch{setNotice("Ошибка формирования PDF. Проверьте документ и попробуйте ещё раз.");}
 }
 async function downloadDocx(){
  if(!generated||!version)return;
  try{
   await downloadGeneratedDocumentDocx({
    title:blueprint.title,content:generated,fileName:blueprint.slug+".docx"
   });
   setNotice("DOCX сформирован из текущей версии документа.");
  }catch{setNotice("Ошибка формирования DOCX. Попробуйте ещё раз.");}
 }
 return <section id="fill-online" className="mt-7 scroll-mt-24 rounded-lg border border-line bg-white p-5" aria-label="Составление юридического документа">
  <p className="text-sm font-semibold uppercase tracking-wide text-trust">Подготовка документа</p>
  <h2 className="mt-2 text-xl font-semibold">Составить {blueprint.title.toLowerCase()}</h2>
  <p className="mt-2 text-sm text-zinc-700">Введите только необходимые факты из документов. Поля соответствуют виду обращения. Сведения в этом разделе не отправляются на сервер при заполнении.</p>
  <div className="mt-5 grid gap-4">
   {fields.map(field=><div key={field.key}>
    <label htmlFor={"military-doc-"+field.key} className="block text-sm font-semibold">{field.label}{field.required?" *":""}</label>
    {field.multiline?<textarea id={"military-doc-"+field.key} value={values[field.key]??""}
      onChange={e=>change(field.key,e.target.value)} rows={3} maxLength={2000}
      className="mt-2 w-full rounded-md border border-line p-3 text-base"/>:
     <input id={"military-doc-"+field.key} value={values[field.key]??""}
      onChange={e=>change(field.key,e.target.value)} maxLength={700}
      className="mt-2 min-h-11 w-full rounded-md border border-line p-3 text-base"/>}
    {field.help?<p className="mt-1 text-xs leading-5 text-zinc-600">{field.help}</p>:null}
   </div>)}
  </div>
  <label className="mt-5 flex items-start gap-3 rounded-md border border-amber-300 bg-amber-50 p-4 text-sm leading-6">
   <input type="checkbox" className="mt-1 h-4 w-4 shrink-0" checked={approved} onChange={e=>setApproved(e.target.checked)}/>
   <span>Я проверил введённые сведения по документам и понимаю, что перед направлением необходимо проверить юридическое основание, компетенцию адресата, сроки и приложения. Никакие документы не отправляются автоматически.</span>
  </label>
  <button type="button" className="mt-4 min-h-11 rounded-md bg-trust px-5 py-3 text-sm font-semibold text-white disabled:opacity-50" disabled={!approved} onClick={prepare}>Сформировать {blueprint.type==="Административное исковое заявление"?"административное исковое заявление":blueprint.type.toLowerCase()}</button>
  {notice?<p role="status" className="mt-3 text-sm">{notice}</p>:null}
  {generated?<section className="mt-6" aria-label="Сформированный юридический документ">
   <h3 className="font-semibold">{blueprint.title}</h3>
   <pre className="mt-3 whitespace-pre-wrap break-words rounded-md border border-line bg-zinc-50 p-4 font-serif text-sm leading-6">{generated}</pre>
   <div className="mt-4 flex flex-wrap gap-3">
    <button type="button" onClick={()=>void downloadPdf()} className="min-h-11 rounded-md border border-trust px-4 py-2 font-semibold text-trust">Скачать PDF</button>
    <button type="button" onClick={()=>void downloadDocx()} className="min-h-11 rounded-md border border-trust px-4 py-2 font-semibold text-trust">Скачать DOCX</button>
   </div>
   <MilitaryPostDocumentGuide key={version} scenarioKey={documentKey} resultKind="DRAFT" evidence={blueprint.evidence}/>
  </section>:null}
 </section>;
}

import Link from "next/link";
import type {NavigatorDocument} from "@/data/documents";
import {MILITARY_LEGAL_SOURCES,getMilitaryDocumentsForScenario,getMilitaryRouteForDocument,type MilitaryLegalDocument} from "@/data/military-legal-documents";
import {MilitaryLegalDocumentEditor} from "@/components/documents/MilitaryLegalDocumentEditor";
import {Breadcrumbs} from "@/components/Breadcrumbs";
import {JsonLd} from "@/components/JsonLd";
import {breadcrumbJsonLd} from "@/lib/jsonld";
import {absoluteUrl} from "@/lib/seo";

export function MilitaryLegalDocumentPage({document,seoDocument}:{document:MilitaryLegalDocument;seoDocument:NavigatorDocument}){
 const route=getMilitaryRouteForDocument(document);
 const siblingDocs=getMilitaryDocumentsForScenario(document.scenarioKey).filter(d=>d.slug!==document.slug);
 const path="/documents/"+document.slug+"/";
 const crumbs=[
  {name:"Главная",path:"/"},
  {name:"Военное право",path:"/voennoe-pravo/"},
  {name:document.title,path}
 ];
 return <>
  <JsonLd data={[breadcrumbJsonLd(crumbs),documentWebPageJsonLd(path,document.title,seoDocument.shortDescription)]}/>
  <Breadcrumbs items={crumbs}/>
  <article className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
   <header className="border-b border-line pb-7">
    <p className="text-sm font-semibold uppercase tracking-wide text-trust">Военное право · {document.formLabel}</p>
    <h1 className="mt-3 max-w-4xl text-3xl font-semibold leading-tight text-ink sm:text-5xl">{document.title}</h1>
    <p className="mt-4 max-w-3xl text-lg leading-8 text-zinc-700">{seoDocument.heroDescription}</p>
    <a href="#fill-online" className="mt-5 inline-flex min-h-11 items-center rounded-md bg-trust px-5 py-3 font-semibold text-white">Сформировать {document.formLabel.toLowerCase()}</a>
   </header>
   <section className="mt-7 grid gap-4 md:grid-cols-2" aria-label="Юридическая информация о документе">
    <div className="border-t-4 border-trust bg-white p-5 shadow-sm">
     <h2 className="text-lg font-semibold">Когда используется</h2>
     <p className="mt-3 text-sm leading-6">{document.subject}. Юридическое основание и статус заявителя проверяются на дату обстоятельств.</p>
    </div>
    <div className="border-t-4 border-line bg-white p-5 shadow-sm">
     <h2 className="text-lg font-semibold">Куда направлять</h2>
     <p className="mt-3 text-sm leading-6">{seoDocument.whereToFile} После подготовки доступен справочник ведомств и выбор региона.</p>
    </div>
    <div className="border-t-4 border-line bg-white p-5 shadow-sm">
     <h2 className="text-lg font-semibold">Что приготовить</h2>
     <ul className="mt-3 list-disc space-y-1 pl-5 text-sm leading-6">{seoDocument.whatToPrepare.map(item=><li key={item}>{item}</li>)}</ul>
    </div>
    <div className="border-t-4 border-line bg-white p-5 shadow-sm">
     <h2 className="text-lg font-semibold">Сроки и расходы</h2>
     <p className="mt-3 text-sm leading-6">{seoDocument.deadlinesAndFees.join(" ")}</p>
    </div>
   </section>
   <MilitaryLegalDocumentEditor document={document}/>
   <section className="mt-9 border-t border-line pt-6">
    <h2 className="text-2xl font-semibold">Правовые основания и образец структуры</h2>
    <p className="mt-3 text-sm leading-6 text-zinc-700">
     Источники помогают установить правовую основу, но их актуальная редакция, применимость к вашему статусу, порядок подачи и допустимость требования должны проверяться отдельно.
    </p>
    <ul className="mt-4 space-y-3">
     {document.sourceIds.map(id=>{
      const source=MILITARY_LEGAL_SOURCES[id];
      return source?<li key={id} className="border-l-2 border-line pl-4 text-sm">
       <a className="font-medium text-trust underline underline-offset-2" href={source.url} target="_blank" rel="noopener noreferrer">{source.title}</a>
      </li>:null;
     })}
    </ul>
    <div className="mt-5 rounded-md border border-line p-4">
     <h3 className="font-semibold">Опубликованный пример структуры документа</h3>
     <p className="mt-2 text-sm">Для определения реквизитов использован опубликованный пример. Это не официальное одобрение автоматически сформированного текста и не подтверждение применимости образца к вашей ситуации.</p>
     <a className="mt-2 inline-block text-sm font-semibold text-trust underline underline-offset-2" href={document.exampleUrl} target="_blank" rel="noopener noreferrer">Посмотреть источник примера</a>
    </div>
   </section>
   <section className="mt-9 border-t border-line pt-6">
    <h2 className="text-2xl font-semibold">Как подготовить и направить документ</h2>
    <ol className="mt-4 list-decimal space-y-2 pl-6 text-sm leading-6">{seoDocument.filingProcedure.map(x=><li key={x}>{x}</li>)}</ol>
    <p className="mt-4 text-sm leading-6 text-zinc-700">PDF и DOCX доступны после ввода юридически значимых реквизитов. Персональные сведения не включаются в URL и поисковые метаданные.</p>
   </section>
   {siblingDocs.length?<section className="mt-9 border-t border-line pt-6">
    <h2 className="text-xl font-semibold">Другие документы по этой ситуации</h2>
    <ul className="mt-3 space-y-2">{siblingDocs.map(item=><li key={item.slug}><Link href={"/documents/"+item.slug+"/"} className="font-medium text-trust underline underline-offset-2">{item.title}</Link></li>)}</ul>
   </section>:null}
   <section className="mt-9 border-t border-line pt-6">
    <h2 className="text-xl font-semibold">Частые вопросы</h2>
    {seoDocument.faq.map(faq=><details key={faq.question} className="mt-3 rounded-md border border-line px-4 py-3">
     <summary className="cursor-pointer font-semibold">{faq.question}</summary>
     <p className="mt-2 text-sm leading-6">{faq.answer}</p>
    </details>)}
   </section>
   {route?<Link href={"/voennoe-pravo/"+route.slug+"/?scenario="+encodeURIComponent(document.scenarioKey)}
    className="mt-8 inline-flex min-h-11 items-center font-semibold text-trust underline underline-offset-2">Вернуться к выбору документов</Link>:null}
  </article>
 </>;
}

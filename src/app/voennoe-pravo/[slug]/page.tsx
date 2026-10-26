import type {Metadata} from "next";
import Link from "next/link";
import {notFound} from "next/navigation";
import {Breadcrumbs} from "@/components/Breadcrumbs";
import {JsonLd} from "@/components/JsonLd";
import {breadcrumbJsonLd} from "@/lib/jsonld";
import {buildMetadata} from "@/lib/seo";
import {MILITARY_ROUTES,MILITARY_SOURCES} from "@/data/military-route-plans";
import {getMilitaryDocumentsForScenario} from "@/data/military-legal-documents";
import {militaryCanonicalRouteHref} from "@/lib/military-preview-navigation";
import {MilitaryRelatedQuestions} from "@/components/questions/MilitaryRelatedQuestions";

type Props={params:Promise<{slug:string}>;searchParams:Promise<{scenario?:string}>};
export const dynamicParams=false;
export const revalidate=3600;
export const generateStaticParams=()=>MILITARY_ROUTES.map(route=>({slug:route.slug}));
export async function generateMetadata({params}:Props):Promise<Metadata>{
 const {slug}=await params;
 const route=MILITARY_ROUTES.find(item=>item.slug===slug);
 if(!route)return {title:"Направление не найдено",robots:{index:false}};
 return buildMetadata({
  title:route.title+": рапорты, заявления, жалобы, судебные документы",
  description:route.title+". Подберите юридический документ, составьте его онлайн и скачайте PDF или DOCX. Официальные правовые основания, инструкция и порядок обращения.",
  path:"/voennoe-pravo/"+route.slug+"/",isIndexable:true
 });
}
export default async function MilitaryRoutePage({params,searchParams}:Props){
 const {slug}=await params;const {scenario:key}=await searchParams;
 const route=MILITARY_ROUTES.find(item=>item.slug===slug);
 if(!route)notFound();
 const scenario=route.scenarios.find(item=>item.key===key);
 if(key&&!scenario)notFound();
 const path=militaryCanonicalRouteHref(route.id);
 const crumbs=[
  {name:"Главная",path:"/"},
  {name:"Военное право",path:"/voennoe-pravo/"},
  {name:route.title,path}
 ];
 return <>
  <JsonLd data={breadcrumbJsonLd(crumbs)}/>
  <Breadcrumbs items={crumbs}/>
  <article className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
   <header className="border-b border-line pb-6">
    <p className="text-sm font-semibold uppercase tracking-wide text-trust">ПравоПоиск · военное право</p>
    <h1 className="mt-3 text-3xl font-semibold leading-tight text-ink sm:text-5xl">{route.title}</h1>
    <p className="mt-4 max-w-3xl text-lg leading-8 text-zinc-700">
     Выберите конкретную жизненную ситуацию и вид юридического документа.
     Для каждого доступны самостоятельная страница, необходимые реквизиты, правовые основания, PDF и DOCX.
    </p>
   </header>
   {!scenario?<section className="mt-7" aria-labelledby="military-choose-title">
    <h2 id="military-choose-title" className="text-2xl font-semibold">Выберите ситуацию</h2>
    <div className="mt-5 grid gap-4 sm:grid-cols-2">
     {route.scenarios.map(item=>{
      const docs=getMilitaryDocumentsForScenario(item.key);
      return <Link href={militaryCanonicalRouteHref(route.id,item.key)} key={item.key} className="rounded-lg border border-line bg-white p-5 shadow-sm hover:border-trust">
       <h3 className="font-semibold text-ink">{item.title}</h3>
       <p className="mt-2 text-sm leading-6 text-zinc-600">{item.kind==="URGENT_INSTRUCTION"?
        "Экстренная медицинская помощь не зависит от подготовки документа.":
        "Доступно документов: "+docs.length+". Перейдите к выбору заявления, рапорта или судебного обращения."}</p>
      </Link>;
     })}
    </div>
   </section>:<section className="mt-7">
    <Link href={path} className="font-semibold text-trust underline underline-offset-2">Выбрать другую ситуацию</Link>
    <h2 className="mt-5 text-2xl font-semibold text-ink">{scenario.title}</h2>
    {scenario.kind==="URGENT_INSTRUCTION"?
     <div role="alert" className="mt-5 border-l-4 border-red-700 bg-red-50 p-5">
      <h3 className="text-lg font-semibold text-red-950">Сначала неотложная помощь</h3>
      {scenario.safetyNotes.map(note=><p className="mt-2 text-sm leading-6" key={note}>{note}</p>)}
     </div>:
     <>
      <p className="mt-3 text-sm leading-6 text-zinc-700">Выберите вид обращения с учётом вашего статуса, имеющихся документов и стадии спора. Судебное обращение требует отдельной проверки подсудности и срока.</p>
      <div className="mt-5 grid gap-4">
       {getMilitaryDocumentsForScenario(scenario.key).map(doc=><section key={doc.slug} className="rounded-lg border border-line bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-trust">{doc.formLabel}</p>
        <h3 className="mt-2 text-xl font-semibold text-ink">{doc.title}</h3>
        <p className="mt-2 text-sm leading-6 text-zinc-700">{doc.subject}. {doc.kind==="court"?
          "Формируется предварительный проект для судебной правовой проверки.":
          "Формируется персональный текст по реквизитам документа."}</p>
        <Link href={"/documents/"+doc.slug+"/#fill-online"} target="_blank" rel="noopener noreferrer"
         className="mt-4 inline-flex min-h-11 items-center rounded-md bg-trust px-5 py-3 text-sm font-semibold text-white">
         Сформировать {doc.formLabel.toLowerCase()}
        </Link>
       </section>)}
      </div>
      <section className="mt-7 rounded-lg border border-line p-5">
       <h3 className="font-semibold">Правовые источники по ситуации</h3>
       <p className="mt-2 text-sm leading-6 text-zinc-700">Закон и редакция, действовавшие на момент события, должны быть проверены перед направлением документа.</p>
       <ul className="mt-3 list-disc space-y-2 pl-5 text-sm">{scenario.sources.map(id=><li key={id}>
        <a className="text-trust underline underline-offset-2" href={MILITARY_SOURCES[id].url} target="_blank" rel="noopener noreferrer">{MILITARY_SOURCES[id].name}</a>
       </li>)}</ul>
      </section>
     </>}
    <MilitaryRelatedQuestions routeId={route.id} scenarioKey={scenario.key}/>
   </section>}
   <footer className="mt-9 border-t border-line pt-6 text-sm leading-6 text-zinc-600">
    Юридический документ создаётся по подтверждённым сведениям. Проекты требуют проверки полномочий, реквизитов, действующего права, сроков и приложений до подачи.
   </footer>
  </article>
 </>;
}

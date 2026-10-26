import type {Metadata} from "next";
import Link from "next/link";
import {notFound} from "next/navigation";
import {Breadcrumbs} from "@/components/Breadcrumbs";
import {MILITARY_ROUTES} from "@/data/military-route-plans";
import {getMilitaryDocumentBlueprint} from "@/data/military-document-blueprints";
import {militaryCanonicalRouteHref} from "@/lib/military-preview-navigation";
import {MilitaryRelatedQuestions} from "@/components/questions/MilitaryRelatedQuestions";
type Props={params:Promise<{slug:string}>;searchParams:Promise<{scenario?:string}>};
export const dynamicParams=false;
export const dynamic="force-dynamic";
export const generateStaticParams=()=>MILITARY_ROUTES.map(r=>({slug:r.slug}));
export async function generateMetadata({params}:Props):Promise<Metadata>{
 const {slug}=await params;
 const route=MILITARY_ROUTES.find(r=>r.slug===slug);
 return {title:route?route.title+" — документы, рапорты и заявления | ПравоПоиск":"Ситуация не найдена",
  description:route?"Выберите ситуацию и подготовьте юридический документ: рапорт, заявление или административное исковое заявление. PDF и DOCX.":undefined,
  robots:{index:false,follow:true}};
}
export default async function Page({params,searchParams}:Props){
 const {slug}=await params;
 const {scenario:key}=await searchParams;
 const route=MILITARY_ROUTES.find(r=>r.slug===slug);
 if(!route)notFound();
 const scenario=route.scenarios.find(s=>s.key===key);
 if(key&&!scenario)notFound();
 const blueprint=scenario?getMilitaryDocumentBlueprint(scenario.key):null;
 return <>
  <Breadcrumbs items={[
   {name:"Главная",path:"/"},
   {name:"Правовой навигатор",path:"/problems/"},
   {name:"Военное право",path:"/voennoe-pravo/"},
   {name:route.title,path:militaryCanonicalRouteHref(route.id)}
  ]}/>
  <article className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
   <header className="border-b border-line pb-6">
    <h1 className="text-3xl font-semibold text-ink">{route.title}</h1>
    <p className="mt-3 text-zinc-700">Выберите ситуацию и подходящий юридический документ. Подготовка, PDF и DOCX доступны на отдельной странице документа.</p>
   </header>
   {!scenario?<section className="mt-7">
    <h2 className="text-xl font-semibold">Выберите правовую ситуацию</h2>
    <div className="mt-4 grid gap-3 sm:grid-cols-2">
     {route.scenarios.map(item=>{
      const doc=getMilitaryDocumentBlueprint(item.key);
      return <Link key={item.key} href={militaryCanonicalRouteHref(route.id,item.key)}
       className="block rounded-md border border-line bg-white p-5 hover:border-trust">
       <span className="font-semibold">{item.title}</span>
       <span className="mt-2 block text-sm leading-6 text-zinc-600">{doc?doc.title:"Инструкция по экстренному порядку обращения"}</span>
      </Link>;
     })}
    </div>
   </section>:<section className="mt-7">
    <Link className="text-sm font-semibold text-trust underline" href={militaryCanonicalRouteHref(route.id)}>Выбрать другую ситуацию</Link>
    <h2 className="mt-4 text-2xl font-semibold">{scenario.title}</h2>
    {blueprint?<>
     <p className="mt-3 text-zinc-700">{blueprint.intent}</p>
     <div className="mt-5 grid gap-4 md:grid-cols-2">
      <div className="rounded-lg border border-line bg-white p-5"><h3 className="font-semibold">Юридический документ</h3><p className="mt-2 text-sm">{blueprint.title}</p></div>
      <div className="rounded-lg border border-line bg-white p-5"><h3 className="font-semibold">Куда обращаться</h3><p className="mt-2 text-sm">{blueprint.submission}</p></div>
     </div>
     <h3 className="mt-6 text-lg font-semibold">Что подготовить</h3>
     <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6">{blueprint.evidence.map(e=><li key={e}>{e}</li>)}</ul>
     <Link href={"/documents/"+blueprint.slug+"/#fill-online"} target="_blank" rel="noopener noreferrer"
      className="mt-6 inline-flex min-h-11 items-center rounded-md bg-trust px-5 py-3 text-sm font-semibold text-white">
      Сформировать {blueprint.type==="Административное исковое заявление"?"административное исковое заявление":blueprint.type.toLowerCase()}
     </Link>
     <p className="mt-3 text-xs leading-5 text-zinc-600">Откроется отдельная страница документа. Перед направлением необходимо проверить применимое право, адресата и приложения.</p>
    </>:<section className="mt-5 border-l-4 border-red-700 bg-red-50 p-4" role="alert">
     <h3 className="font-semibold text-red-950">Неотложная медицинская помощь</h3>
     {scenario.safetyNotes.map(note=><p key={note} className="mt-2 text-sm">{note}</p>)}
     <p className="mt-2 text-sm">При угрозе жизни или здоровью обратитесь за неотложной помощью; оформление документа не должно откладывать её получение.</p>
    </section>}
    <MilitaryRelatedQuestions routeId={route.id} scenarioKey={scenario.key}/>
   </section>}
   <footer className="mt-8 border-t border-line pt-5 text-sm text-zinc-600">Перед подачей требуется индивидуальная правовая проверка компетенции адресата, соответствия документа процессуальному порядку и подтверждающих сведений.</footer>
  </article>
 </>;
}

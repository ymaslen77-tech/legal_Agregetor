import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { MILITARY_ROUTES } from '@/data/military-route-plans';
import { militaryCanonicalRouteHref } from '@/lib/military-preview-navigation';
import { MilitaryPreviewForm } from '@/components/documents/MilitaryPreviewForm';
import { MilitaryRelatedQuestions } from '@/components/questions/MilitaryRelatedQuestions';
type Props={params:Promise<{slug:string}>;searchParams:Promise<{scenario?:string}>};
export const dynamicParams=false;
export const generateStaticParams=()=>MILITARY_ROUTES.map(r=>({slug:r.slug}));
export async function generateMetadata({params}:Props):Promise<Metadata>{const {slug}=await params;const route=MILITARY_ROUTES.find(r=>r.slug===slug);return {title:route?.title??'Ситуация не найдена',robots:{index:false,follow:false}};}
export default async function Page({params,searchParams}:Props){
 const {slug}=await params;const {scenario:key}=await searchParams;
 const route=MILITARY_ROUTES.find(r=>r.slug===slug);if(!route)notFound();
 const scenario=route.scenarios.find(s=>s.key===key);if(key&&!scenario)notFound();
 return <><Breadcrumbs items={[{name:'Главная',path:'/'},{name:'Правовой навигатор',path:'/problems/'},{name:'Военное право',path:'/voennoe-pravo/'},{name:route.title,path:militaryCanonicalRouteHref(route.id)}]}/><article className='mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8'><header className='mt-6 border-b border-line pb-6'><h1 className='text-3xl font-semibold text-ink'>{route.title}</h1><p className='mt-3 text-zinc-700'>Выберите задачу, укажите обстоятельства и подготовьте документ для юридической проверки.</p></header>{scenario?<section className='mt-6'><Link href={militaryCanonicalRouteHref(route.id)} className='text-sm font-semibold text-trust underline'>Выбрать другую ситуацию</Link><h2 className='mt-4 text-2xl font-semibold'>{scenario.title}</h2><MilitaryPreviewForm key={route.id+'-'+scenario.key} initialRouteId={route.id} initialScenarioKey={scenario.key} publicDraft compactFlow
 reviewAvailable={Boolean(process.env.LEAD_ATTACHMENT_STORAGE_ROOT?.trim())}/><MilitaryRelatedQuestions routeId={route.id} scenarioKey={scenario.key}/></section>:<section className='mt-6'><h2 className='text-xl font-semibold text-ink'>Шаг 1. Выберите ситуацию</h2><div className='mt-4 grid gap-3 sm:grid-cols-2'>{route.scenarios.map(s=><Link key={s.key} href={militaryCanonicalRouteHref(route.id,s.key)} className='block rounded-md border border-line bg-white p-5 hover:border-trust'><span className='block font-semibold'>{s.title}</span><span className='mt-2 block text-sm text-zinc-600'>{s.kind==='URGENT_INSTRUCTION'?'Сначала неотложная помощь.':'Проверка фактов и подготовка документа.'}</span></Link>)}</div></section>}<footer className='mt-8 border-t border-line pt-5 text-sm text-zinc-600'>Документ требует юридической проверки перед использованием.</footer></article></>;
}

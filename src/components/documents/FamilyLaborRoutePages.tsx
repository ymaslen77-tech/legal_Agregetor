import Link from "next/link";
import type {FamilyLaborPlan} from "@/data/family-labor-route-expansion";
import {familyLaborCategory,getFamilyLaborRouteSlug,getFamilyLaborDocumentSlug}
  from "@/data/family-labor-implemented-routes";
import {FamilyLaborDocumentForm} from "@/components/documents/FamilyLaborDocumentForm";
import {Breadcrumbs} from "@/components/Breadcrumbs";
import {JsonLd} from "@/components/JsonLd";
import {breadcrumbJsonLd} from "@/lib/jsonld";

/** Standard route/situation/document journey for all eight new legal routes. */
export function FamilyLaborProblemPage({plan,scenarioKey}:{plan:FamilyLaborPlan;scenarioKey?:string}){
  const category=familyLaborCategory(plan),slug=getFamilyLaborRouteSlug(plan);
  const path="/problems/"+category+"/"+slug+"/";
  const scenario=plan.scenarios.find(s=>s.key===scenarioKey);
  const categoryName=category==="semya-i-deti"?"Семья и дети":"Трудовое право";
  const breadcrumbs=[
    {name:"Главная",path:"/"},
    {name:"Правовой навигатор",path:"/problems/"},
    {name:categoryName,path:"/problems/"+category+"/"},
    {name:plan.title,path}
  ];
  return <>
  <JsonLd data={breadcrumbJsonLd(breadcrumbs)}/>
  <Breadcrumbs items={breadcrumbs}/>
  <article className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
    <header className="mt-6 border-b border-line pb-6">
      <h1 className="text-3xl font-semibold text-ink">{plan.title}</h1>
      <p className="mt-3 text-zinc-700">Выберите задачу, укажите подтверждённые обстоятельства и подготовьте персональный чек-лист. После юридической проверки возможна разработка процессуального документа.</p>
    </header>
    {!scenario?<section className="mt-6">
      <h2 className="text-xl font-semibold text-ink">Шаг 1. Выберите ситуацию</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {plan.scenarios.map(s=><Link key={s.key} href={path+"?scenario="+encodeURIComponent(s.key)}
          className="block rounded-md border border-line bg-white p-5 hover:border-trust focus:ring-2 focus:ring-trust/20">
          <span className="block font-semibold">{s.title}</span>
          <span className="mt-2 block text-sm text-zinc-600">{s.emergencyFirst?"Экстренные действия без анкеты.":"Проверка фактов и подготовка чек-листа."}</span>
        </Link>)}
      </div>
    </section>:<section className="mt-6">
      <Link className="text-sm font-semibold text-trust underline" href={path}>Выбрать другую ситуацию</Link>
      <h2 className="mt-4 text-2xl font-semibold">{scenario.title}</h2>
      <FamilyLaborDocumentForm key={plan.id+"-"+scenario.key} plan={plan} scenarioKey={scenario.key}/>
      {getFamilyLaborDocumentSlug(plan,scenario.key)?<Link
        className="mt-4 inline-flex text-sm font-semibold text-trust underline"
        href={"/documents/"+getFamilyLaborDocumentSlug(plan,scenario.key)+"/"}>
        Открыть отдельную страницу чек-листа
      </Link>:null}
    </section>}
    <footer className="mt-8 border-t border-line pt-5 text-sm text-zinc-600">
      <p>Вопросы анкеты не являются подтверждением правовой позиции. Источники, подсудность и сроки требуют отдельной юридической проверки.</p>
    </footer>
  </article>
  </>;
}
/** Separate canonical document page; same state machine and export/save contract. */
export function FamilyLaborDocumentPage({plan,scenarioKey}:{plan:FamilyLaborPlan;scenarioKey:string}){
  const scenario=plan.scenarios.find(s=>s.key===scenarioKey);
  const slug=getFamilyLaborRouteSlug(plan),category=familyLaborCategory(plan);
  if(!scenario)return null;
  const docSlug=getFamilyLaborDocumentSlug(plan,scenarioKey);
  const problemUrl="/problems/"+category+"/"+slug+"/";
  const documentUrl=docSlug?"/documents/"+docSlug+"/":problemUrl;
  const crumbs=[
    {name:"Главная",path:"/"},
    {name:"Документы",path:"/documents/"},
    {name:scenario.title,path:documentUrl}
  ];
  return <>
  <JsonLd data={breadcrumbJsonLd(crumbs)}/>
  <Breadcrumbs items={crumbs}/>
  <article className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
    <Link className="text-sm font-semibold text-trust underline" href={problemUrl+"?scenario="+encodeURIComponent(scenarioKey)}>Вернуться к маршруту</Link>
    <h1 className="mt-5 text-3xl font-semibold text-ink">{scenario.title}</h1>
    <p className="mt-3 text-zinc-700">Заполните данные по документам. Экспортируется только персональный чек-лист, требующий правовой проверки.</p>
    <FamilyLaborDocumentForm plan={plan} scenarioKey={scenarioKey}/>
    <section className="mt-8 border-t border-line pt-6">
      <h2 className="text-lg font-semibold">Источники для проверки</h2>
      <p className="mt-2 text-sm text-zinc-700">Перечень правовых актов не означает, что они применимы без проверки к конкретным фактам. Актуальные редакции и особые условия требуется проверить перед подачей заявления.</p>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-zinc-700">
        {plan.legalSources.map(item=><li key={item}>{item}</li>)}
      </ul>
      <a className="mt-4 inline-flex text-sm font-semibold text-trust underline"
        href="https://pravo.gov.ru/" target="_blank" rel="noopener noreferrer">
        Официальный интернет-портал правовой информации
      </a>
    </section>
  </article>
  </>;
}

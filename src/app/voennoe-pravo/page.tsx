import type {Metadata} from "next";
import Link from "next/link";
import {Breadcrumbs} from "@/components/Breadcrumbs";
import {JsonLd} from "@/components/JsonLd";
import {breadcrumbJsonLd} from "@/lib/jsonld";
import {buildMetadata} from "@/lib/seo";
import {MILITARY_ROUTES} from "@/data/military-route-plans";
import {militaryCanonicalRouteHref} from "@/lib/military-preview-navigation";

const routeSummaries:Record<string,string>={
 "service-contract":"Условия контракта, получение приказов и перевод.",
 "military-discharge":"Основания увольнения, состояние здоровья и расчёт.",
 "military-pay":"Денежное довольствие, компенсации и выплаты членам семьи.",
 "military-medical":"Медицинская помощь, заключение ВВК и независимая экспертиза.",
 "command-appeal":"Обращения, решения командования и отсутствие ответа.",
 "mobilization-draft":"Повестки, отсрочки и обжалование решений."
};

export const metadata:Metadata=buildMetadata({
 title:"Военное право — юридические ситуации",
 description:"Военная служба, увольнение, выплаты, ВВК, обращения к командованию, призыв и мобилизация. Выберите ситуацию и подготовьте документ.",
 path:"/voennoe-pravo/",isIndexable:true
});

export default function MilitaryLawTopicsPage(){
 const crumbs=[
  {name:"Главная",path:"/"},
  {name:"Правовой навигатор",path:"/problems/"},
  {name:"Военное право",path:"/voennoe-pravo/"}
 ];
 return <>
  <JsonLd data={breadcrumbJsonLd(crumbs)}/>
  <Breadcrumbs items={crumbs}/>
  <main>
   <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
    <p className="text-sm font-semibold uppercase tracking-wide text-trust">Правовой навигатор</p>
    <h1 className="mt-2 text-4xl font-semibold text-ink">Военное право</h1>
    <p className="mt-4 max-w-3xl text-lg leading-8 text-zinc-700">Выберите жизненную ситуацию, чтобы получить порядок действий и подготовить документ для юридической проверки.</p>
   </section>
   <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8" aria-label="Юридические ситуации">
    <h2 className="text-2xl font-semibold text-ink">Ситуации</h2>
    <div className="mt-6 grid gap-4 md:grid-cols-2">
     {MILITARY_ROUTES.map(route=><article key={route.id} className="rounded-lg border border-line bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-ink">{route.title}</h3>
      <p className="mt-2 text-sm leading-6 text-zinc-600">{routeSummaries[route.id]}</p>
      <Link href={militaryCanonicalRouteHref(route.id)}
       className="mt-4 inline-flex min-h-11 items-center rounded-md border border-trust px-4 py-2 text-sm font-semibold text-trust hover:bg-emerald-50">
       Выбрать юридический документ
      </Link>
     </article>)}
    </div>
   </section>
  </main>
 </>;
}

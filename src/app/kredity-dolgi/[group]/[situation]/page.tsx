import type { Metadata } from "next";
import { creditDebtDraftMetadata } from "@/lib/credit-debt-metadata";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CreditDebtJourney } from "@/components/credit-debt/CreditDebtJourney";
import { getCreditDebtSkeletonGroups,getCreditDebtSkeletonSpec } from "@/lib/credit-debt-full-route";
import { getCreditDebtSeoEntry } from "@/data/credit-debt-seo";

type Props={params:Promise<{group:string;situation:string}>};
export const dynamic="force-dynamic";
const root="/kredity-dolgi/";
export async function generateMetadata({params}:Props):Promise<Metadata>{
  const {group,situation}=await params;
  const spec=getCreditDebtSkeletonSpec(group,situation);
  const seo=getCreditDebtSeoEntry(group,situation);
  if(!spec||!seo)notFound();
  return creditDebtDraftMetadata({title:seo.title,description:seo.description,path:seo.canonicalPath});
}
export default async function CreditDebtSituationPage({params}:Props){
  const {group:groupId,situation:situationId}=await params;
  const group=getCreditDebtSkeletonGroups().find(item=>item.id===groupId);
  const spec=getCreditDebtSkeletonSpec(groupId,situationId);
  if(!group||!spec)notFound();
  const base=root+group.id+"/";
  const crumbs=[
    {name:"Главная",path:"/"},
    {name:"Правовой навигатор",path:"/problems/"},
    {name:"Кредиты, долги и банкротство",path:root},
    {name:group.title,path:base},
    {name:spec.situationTitle,path:base+situationId+"/"}
  ];
  const related=group.situations.filter(item=>item.id!==situationId).slice(0,4)
    .map(item=>({title:item.title,href:base+item.id+"/"}));
  return <>
    <Breadcrumbs items={crumbs}/>
    <article className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8" data-testid="credit-debt-situation">
      <Link href={base} className="inline-flex min-h-11 items-center text-sm font-semibold text-trust underline">Изменить ситуацию</Link>
      <header className="mt-4 border-b border-line pb-7">
        <p className="text-sm font-semibold uppercase tracking-wide text-trust">{group.title}</p>
        <h1 className="mt-3 max-w-4xl text-3xl font-semibold leading-tight text-ink sm:text-5xl">{spec.situationTitle}</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-700">
          Уточните обстоятельства и подготовьте сведения для безопасного решения вопроса.
          Результаты ещё не подтверждены в качестве готовых к подаче документов.
        </p>
        <p className="mt-3 rounded-md border-l-4 border-amber-400 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
          Предварительный правовой маршрут. Скачанный PDF — проект для индивидуальной проверки, а не готовый к подаче документ.
        </p>
      </header>
      <section className="mt-7" aria-labelledby="credit-short-answer">
        <h2 id="credit-short-answer" className="text-2xl font-semibold text-ink">Краткий правовой ответ</h2>
        <p className="mt-3 leading-7 text-zinc-700">
          Для этой ситуации необходимо проверить фактические обстоятельства, роль сторон, договоры,
          дату спорных действий, стадию дела, доказательства и действующую редакцию закона.
          Тип и адресат документа определяются индивидуально, без автоматических обещаний результата.
        </p>
      </section>
      <CreditDebtJourney spec={spec} related={related} backHref={base}/>
    </article>
  </>;
}

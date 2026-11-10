import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { CreditDebtScenarioFlow } from "@/components/credit-debt/CreditDebtScenarioFlow";
import { getCreditDebtSkeletonGroups,getCreditDebtSkeletonSpec } from "@/lib/credit-debt-full-route";
import { isCreditDebtPreviewEnabled } from "@/lib/credit-debt-preview-access";

type Props={params:Promise<{group:string;situation:string}>};
export const dynamic="force-dynamic";
const root="/kredity-dolgi/";
export async function generateMetadata({params}:Props):Promise<Metadata>{
  const {group,situation}=await params;
  const spec=getCreditDebtSkeletonSpec(group,situation);
  return {title:spec?spec.situationTitle+" — кредиты и долги":"Ситуация не найдена",
    robots:{index:false,follow:false,noarchive:true}};
}
export default async function CreditDebtSituationPage({params}:Props){
  if(!isCreditDebtPreviewEnabled(process.env))notFound();
  const {group:groupId,situation:situationId}=await params;
  const group=getCreditDebtSkeletonGroups().find(x=>x.id===groupId);
  const spec=getCreditDebtSkeletonSpec(groupId,situationId);
  if(!group||!spec)notFound();
  const base=root+group.id+"/";
  const crumbs=[{name:"Главная",path:"/"},{name:"Правовой навигатор",path:"/problems/"},
    {name:"Кредиты, долги и банкротство",path:root},
    {name:group.title,path:base},
    {name:spec.situationTitle,path:base+situationId+"/"}];
  return <>
    <Breadcrumbs items={crumbs}/>
    <article className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8" data-testid="credit-debt-situation">
      <Link href={base} className="inline-flex min-h-11 items-center text-sm font-semibold text-trust underline">Изменить ситуацию</Link>
      <header className="mt-4 border-b border-line pb-7">
        <p className="text-sm font-semibold uppercase tracking-wide text-trust">{group.title}</p>
        <h1 className="mt-3 max-w-4xl text-3xl font-semibold leading-tight text-ink sm:text-5xl">{spec.situationTitle}</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-700">
          Уточните обстоятельства и подготовьте сведения для безопасного решения вопроса. Автоматическое правовое заключение и подача документа пока недоступны.
        </p>
        <p className="mt-3 rounded-md border-l-4 border-amber-400 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
          Тестовый маршрут. Правовые источники по конкретному вопросу проходят сверку; результат не является готовым юридическим документом.
        </p>
      </header>
      <section className="mt-7" aria-labelledby="credit-short-answer">
        <h2 id="credit-short-answer" className="text-2xl font-semibold text-ink">Краткий правовой ответ</h2>
        <p className="mt-3 leading-7 text-zinc-700">
          Для этой ситуации сначала необходимо проверить правовой статус участников, договоры, ключевые даты, стадию дела и доказательства.
          Применимые нормы, ограничения и способ обращения будут определены после сверки официальных источников.
        </p>
      </section>
      <CreditDebtScenarioFlow key={groupId+"/"+situationId} spec={spec}/>
      <section className="mt-9 border-t border-line pt-7" aria-labelledby="credit-source-heading">
        <h2 id="credit-source-heading" className="text-2xl font-semibold text-ink">Правовые основания и источники</h2>
        <p className="mt-3 text-sm leading-6 text-zinc-700">
          Ниже перечень источников для будущей проверки. Ссылка не означает, что норма уже подтверждена и применима к делу.
          Для каждого существенного утверждения потребуется сопоставление двух-трёх независимых источников и действующей официальной редакции.
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-6 text-sm text-trust">
          {spec.sourceCandidates.map((ref,index)=><li key={ref.label+index}>
            <a className="underline" href={ref.url} target="_blank" rel="noopener noreferrer">{ref.label}</a>
          </li>)}
        </ul>
      </section>
      <section className="mt-9 border-t border-line pt-7" aria-labelledby="credit-related-heading">
        <h2 id="credit-related-heading" className="text-2xl font-semibold text-ink">Связанные вопросы и следующие действия</h2>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {group.situations.filter(x=>x.id!==situationId).slice(0,4).map(item=><Link key={item.id}
            href={base+item.id+"/"} className="block rounded-md border border-line bg-white p-4 text-sm font-semibold text-trust underline hover:border-trust">
            {item.title}
          </Link>)}
        </div>
        <p className="mt-8"><Link href={base} className="text-sm font-semibold text-trust underline">Вернуться к вопросам подраздела</Link></p>
      </section>
    </article>
  </>;
}

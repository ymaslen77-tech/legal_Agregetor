import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { getCreditDebtSkeletonGroups } from "@/lib/credit-debt-full-route";
import { isCreditDebtPreviewEnabled } from "@/lib/credit-debt-preview-access";

type Props={params:Promise<{group:string}>};
export const dynamic="force-dynamic";
const root="/kredity-dolgi/";
export async function generateMetadata({params}:Props):Promise<Metadata>{
  const {group}=await params;
  const selected=getCreditDebtSkeletonGroups().find(x=>x.id===group);
  if(!isCreditDebtPreviewEnabled(process.env)||!selected)notFound();
  return {title:selected.title+" — кредиты и долги",
    robots:{index:false,follow:false,noarchive:true}};
}
export default async function CreditDebtGroupPage({params}:Props){
  if(!isCreditDebtPreviewEnabled(process.env))notFound();
  const {group:slug}=await params;
  const group=getCreditDebtSkeletonGroups().find(x=>x.id===slug);
  if(!group)notFound();
  const crumbs=[{name:"Главная",path:"/"},{name:"Правовой навигатор",path:"/problems/"},
    {name:"Кредиты, долги и банкротство",path:root},
    {name:group.title,path:root+group.id+"/"}];
  return <>
    <Breadcrumbs items={crumbs}/>
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8" data-testid="credit-debt-group">
      <Link href={root} className="inline-flex min-h-11 items-center text-sm font-semibold text-trust underline">Все темы кредитов и банкротства</Link>
      <header className="mt-4 border-b border-line pb-7">
        <p className="text-sm font-semibold uppercase tracking-wide text-trust">Правовой навигатор</p>
        <h1 className="mt-3 text-3xl font-semibold text-ink sm:text-4xl">{group.title}</h1>
        <p className="mt-3 leading-7 text-zinc-700">{group.description}</p>
        <p className="mt-3 text-sm text-zinc-600">Ситуации находятся в разработке; юридические документы не открыты к подаче.</p>
      </header>
      <section className="mt-8" aria-label="Конкретные ситуации">
        <h2 className="text-2xl font-semibold text-ink">Выберите, что произошло</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {group.situations.map(item=><article key={item.id} className="rounded-lg border border-line bg-white p-5 shadow-sm hover:border-trust">
            <h3 className="text-lg font-semibold text-ink">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-600">
              {item.targetResult==="CROSS_LINK"?"Связанный правовой маршрут":
                item.targetResult==="ELIGIBILITY_CHECK"?"Проверка применимых условий":
                item.targetResult==="CHECKLIST"?"Порядок действий и документы":"Предварительная анкета и порядок действий"}
            </p>
            <Link href={root+group.id+"/"+item.id+"/"}
              className="mt-4 inline-flex min-h-11 items-center rounded-md border border-trust px-4 py-2 text-sm font-semibold text-trust hover:bg-emerald-50">
              Выбрать ситуацию
            </Link>
          </article>)}
        </div>
      </section>
      <section className="mt-9 border-t border-line pt-7">
        <h2 className="text-xl font-semibold text-ink">Связанные темы</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {getCreditDebtSkeletonGroups().filter(g=>g.id!==group.id).slice(0,4).map(g=><li key={g.id}>
            <Link href={root+g.id+"/"} className="block rounded-md border border-line bg-white p-4 text-sm font-semibold text-trust underline hover:border-trust">{g.title}</Link>
          </li>)}
        </ul>
      </section>
    </main>
  </>;
}

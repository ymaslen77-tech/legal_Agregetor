import type { Metadata } from "next";
import { creditDebtDraftMetadata } from "@/lib/credit-debt-metadata";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SectionHeading } from "@/components/navigator/NavigatorBlocks";
import { CREDIT_DEBT_BASELINE } from "@/data/credit-debt-route-plan";
import { getCreditDebtSkeletonGroups } from "@/lib/credit-debt-full-route";

export const dynamic="force-dynamic";
export function generateMetadata():Metadata{
  return creditDebtDraftMetadata({
    title:"Кредиты, долги, ипотека и банкротство — юридические ситуации",
    description:"Правовой навигатор: кредитные договоры, МФО, коллекторы, судебные споры, ипотека и банкротство. 10 тем, 60 ситуаций.",
    path:"/kredity-dolgi/"
  });
}
const path="/kredity-dolgi/";
export default function CreditDebtTopicsPage(){
  const groups=getCreditDebtSkeletonGroups();
  const ordered=[...groups].sort((a,b)=>Number(b.id==="bankruptcy")-Number(a.id==="bankruptcy"));
  const breadcrumbs=[{name:"Главная",path:"/"},{name:"Правовой навигатор",path:"/problems/"},{name:"Кредиты, долги и банкротство",path}];
  return <>
    <Breadcrumbs items={breadcrumbs}/>
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8" data-testid="credit-debt-root">
      <header className="max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-trust">Правовой навигатор · Новый раздел</p>
        <h1 className="mt-2 text-4xl font-semibold text-ink">Кредиты, долги, ипотека и банкротство</h1>
        <p className="mt-4 text-lg leading-8 text-zinc-700">
          Выберите подраздел и жизненную ситуацию. Далее — уточняющие вопросы,
          предварительный порядок действий и подготовка к формированию юридического результата.
        </p>
        <p className="mt-3 rounded-md border border-amber-300 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
          Раздел открыт для ознакомления с ситуациями, подготовки черновиков и обращения за юридической проверкой.
          Результаты не являются готовыми к подаче документами: применимые нормы, сроки, реквизиты и доказательства требуют проверки перед использованием.
        </p>
      </header>
      <section className="mt-9" aria-label="Темы кредитов и банкротства">
        <SectionHeading eyebrow="Выберите тему" title="Правовые ситуации"
          description={`10 подразделов, 60 ситуаций. Основа классификации — ${CREDIT_DEBT_BASELINE.questions.toLocaleString("ru-RU")} исторических обращений Q&A, не фактические просмотры сайта.`}/>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {ordered.map(group=><article key={group.id} className="rounded-lg border border-line bg-white p-5 shadow-sm hover:border-trust">
            <h3 className="text-lg font-semibold text-ink">{group.title}</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-600">{group.description}</p>
            <Link href={path+group.id+"/"}
              className="mt-4 inline-flex min-h-11 items-center rounded-md border border-trust px-4 py-2 text-sm font-semibold text-trust hover:bg-emerald-50 focus:ring-2 focus:ring-trust/30">
              Посмотреть вопросы ({group.situations.length})
            </Link>
          </article>)}
        </div>
      </section>
      <section className="mt-10 border-t border-line pt-7">
        <h2 className="text-2xl font-semibold text-ink">Как устроен маршрут</h2>
        <ol className="mt-4 grid list-decimal gap-3 pl-6 text-zinc-700">
          <li>Выберите жизненную ситуацию.</li>
          <li>Уточните роль, дату события, документы и обстоятельства.</li>
          <li>Получите предварительный чек-лист и список необходимых подтверждений.</li>
          <li>Сформируйте редактируемый проект или чек-лист, скачайте PDF и при необходимости направьте на проверку юристу.</li>
        </ol>
      </section>
    </main>
  </>;
}

import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { buildMetadata } from "@/lib/seo";
import {MILITARY_ROUTES} from "@/data/military-route-plans";
import {militaryPublicDraftHref} from "@/lib/military-preview-navigation";

/**
 * Public informational index only. Do not import military generators, expose
 * internal Preview, register unapproved documents, or claim filing readiness.
 * Detailed routes remain behind the separate legal acceptance gate.
 */
export const metadata: Metadata = buildMetadata({
  title: "Военное право — вопросы и жизненные ситуации",
  description: "Каталог тем по военному праву: контракт, увольнение, довольствие, ВВК, командование, призыв и мобилизация. Подготовка юридических маршрутов продолжается.",
  path: "/voennoe-pravo/",
  isIndexable: false
});

export default function MilitaryLawTopicsPage() {
  return (
    <>
      <Breadcrumbs items={[
        { name: "Главная", path: "/" },
        { name: "Юридические ситуации", path: "/problems/" },
        { name: "Военное право", path: "/voennoe-pravo/" }
      ]} />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-amber-900">
          Предварительный информационный раздел
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-ink">Военное право</h1>
        <p className="mt-3 max-w-4xl text-sm leading-6 text-zinc-700">
          6 направлений и 18 тем. Выберите ситуацию, заполните анкету, проверьте факты и сформируйте предварительный документ.
          Результат остаётся черновиком: юридическая приёмка ещё не завершена, направлять документ без проверки нельзя.
        </p>
        <p className="mt-3 max-w-4xl text-sm leading-6 text-zinc-700">
          Правовой статус, особый режим, сроки, адресат и порядок защиты зависят от обстоятельств.
          Сведения из ответов на вопросы не заменяют индивидуальную оценку документов юристом.
          Не публикуйте номера частей, местоположение, служебные сведения, диагнозы или чужие персональные данные.
        </p>

        <div className="mt-7 grid gap-4 md:grid-cols-2">
          {MILITARY_ROUTES.map((topic) => (
            <section key={topic.title} className="rounded-lg border border-line bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-ink">{topic.title}</h2>
              <ul className="mt-3 space-y-2">
                {topic.scenarios.map((scenario) => (
                  <li key={scenario.key}>
                    <Link href={militaryPublicDraftHref(topic.id,scenario.key)}
                      className="flex min-h-11 items-center rounded-md border border-line px-3 py-2 text-sm leading-6 text-trust hover:border-trust hover:bg-zinc-50">
                      {scenario.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <section className="mt-8 border-t border-line pt-5" aria-label="Вопросы по военному праву">
          <h2 className="text-xl font-semibold text-ink">Похожие вопросы</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-700">
            Ссылки открывают поиск по опубликованным вопросам. Если база временно недоступна,
            результаты могут не отображаться. Демонстрационные ответы не подставляются.
          </p>
          <Link href="/questions/" className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-trust underline underline-offset-2">
            Все вопросы юристам
          </Link>
        </section>
      </main>
    </>
  );
}

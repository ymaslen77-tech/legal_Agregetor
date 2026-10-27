import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";
import { MILITARY_TOPICS } from "@/data/military-catalog";

export const metadata: Metadata = buildMetadata({
  title: "Военное право — юридические ситуации",
  description: "Военная служба, призыв, мобилизация, медицинская помощь, выплаты и защита прав. Тематический каталог юридических вопросов.",
  path: "/voennoe-pravo/",
  isIndexable: false
});

export default function MilitaryTopicsPage() {
  const crumbs = [
    { name: "Главная", path: "/" },
    { name: "Правовой навигатор", path: "/problems/" },
    { name: "Военное право", path: "/voennoe-pravo/" }
  ];
  return <>
    <JsonLd data={breadcrumbJsonLd(crumbs)} />
    <Breadcrumbs items={crumbs} />
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="max-w-4xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-trust">Правовой навигатор</p>
        <h1 className="mt-2 text-4xl font-semibold text-ink">Военное право</h1>
        <p className="mt-4 text-lg leading-8 text-zinc-700">Выберите тему и конкретный вопрос. Для справочных ситуаций достаточно информации; юридические документы будут доступны только там, где они необходимы и проверены.</p>
        <p className="mt-3 text-sm text-zinc-600">Новый раздел находится на юридической проверке. До завершения проверки генераторы документов не включены.</p>
      </header>
      <section className="mt-10" aria-label="Темы военного права">
        <h2 className="text-2xl font-semibold text-ink">Темы</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {MILITARY_TOPICS.map(topic => <article key={topic.slug} className="rounded-lg border border-line bg-white p-5 shadow-sm">
            <h3 className="text-lg font-semibold text-ink">{topic.title}</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-600">{topic.description}</p>
            <Link href={`/voennoe-pravo/${topic.slug}/`} className="mt-4 inline-flex min-h-11 items-center rounded-md border border-trust px-4 py-2 text-sm font-semibold text-trust hover:bg-emerald-50">Посмотреть вопросы ({topic.situations.length})</Link>
          </article>)}
        </div>
      </section>
    </main>
  </>;
}

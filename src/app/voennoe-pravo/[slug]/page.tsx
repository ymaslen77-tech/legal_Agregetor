import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { getMilitaryTopic, MILITARY_TOPICS, MILITARY_LEGACY_TOPIC_REDIRECTS } from "@/data/military-catalog";
type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() {
  return [...MILITARY_TOPICS.map(t => ({ slug: t.slug })), ...Object.keys(MILITARY_LEGACY_TOPIC_REDIRECTS).map(slug => ({ slug }))];
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const {slug} = await params;
  const topic = getMilitaryTopic(slug);
  return {title: topic ? `${topic.title} — военное право` : "Военное право", robots: {index: false, follow: true}};
}
export default async function MilitaryTopicPage({params}: Props) {
  const {slug} = await params;
  const replacement = MILITARY_LEGACY_TOPIC_REDIRECTS[slug];
  if (replacement) permanentRedirect(`/voennoe-pravo/${replacement}/`);
  const topic = getMilitaryTopic(slug);
  if (!topic) notFound();
  const crumbs = [
    {name:"Главная",path:"/"}, {name:"Военное право",path:"/voennoe-pravo/"},
    {name:topic.title,path:`/voennoe-pravo/${topic.slug}/`}
  ];
  return <>
    <Breadcrumbs items={crumbs}/>
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <Link href="/voennoe-pravo/" className="text-sm font-semibold text-trust underline">Все темы военного права</Link>
      <h1 className="mt-4 text-3xl font-semibold text-ink">{topic.title}</h1>
      <p className="mt-3 text-zinc-700">{topic.description}</p>
      <p className="mt-2 text-sm text-zinc-600">Ситуации готовятся к юридической проверке. Информационные страницы не требуют заполнения данных, генераторы пока не подключены.</p>
      <section className="mt-8" aria-label="Конкретные ситуации">
        <h2 className="text-xl font-semibold text-ink">Выберите вопрос</h2>
        <ul className="mt-4 grid gap-3">
          {topic.situations.map(situation => <li key={situation.slug}>
            <Link href={`/voennoe-pravo/${topic.slug}/${situation.slug}/`} className="block rounded-lg border border-line bg-white p-5 hover:border-trust">
              <span className="font-semibold text-ink">{situation.title}</span>
              <span className="mt-1 block text-sm text-zinc-600">{situation.kind === "information" ? "Информационная ситуация" : situation.kind === "document" ? "Возможное юридическое обращение" : "Информация и возможное обращение"}</span>
            </Link>
          </li>)}
        </ul>
      </section>
    </main>
  </>;
}

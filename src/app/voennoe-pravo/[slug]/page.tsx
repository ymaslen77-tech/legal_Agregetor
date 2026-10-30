import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { getMilitaryTopic, MILITARY_TOPICS, MILITARY_LEGACY_TOPIC_REDIRECTS } from "@/data/military-catalog";
import { getMilitaryGuide } from "@/data/military-guidance";
import { getMilitaryRelatedTopics } from "@/data/military-related-links";
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
  const guide = getMilitaryGuide(topic.slug);
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
      <p className="mt-2 text-sm text-zinc-600">Ситуации готовятся к юридической проверке. Информационные страницы не требуют заполнения данных. В отдельных ситуациях доступен проект документа без проверки права на его подачу.</p>
      <section className="mt-7 border-t border-line pt-6" aria-labelledby="military-topic-basics">
        <h2 className="text-xl font-semibold text-ink" id="military-topic-basics">Основные правовые вопросы</h2>
        <p className="mt-3 leading-7 text-zinc-700">{guide.context}</p>
        <h3 className="mt-5 font-semibold text-ink">На что обратить внимание</h3>
        <ol className="mt-3 grid list-decimal gap-2 pl-6 text-zinc-700">
          {guide.steps.map(step=><li key={step}>{step}</li>)}
        </ol>
        <p className="mt-4 text-sm leading-6 text-zinc-700">{guide.caution}</p>
        <p className="mt-4 text-sm font-semibold text-ink">Нормативные акты</p>
        <ul className="mt-2 list-disc pl-6 text-sm leading-6">
          {guide.sources.map(source=><li key={source.id}><a className="text-trust underline" href={source.url} target="_blank" rel="noopener noreferrer">{source.name}</a></li>)}
        </ul>
        <p className="mt-3 text-xs text-zinc-600">Ссылки приведены справочно. Редакцию и применимость нормы следует проверять на дату конкретного события.</p>
      </section>
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
      <section className="mt-9 border-t border-line pt-7" aria-labelledby="military-related-topics">
        <h2 id="military-related-topics" className="text-xl font-semibold text-ink">Связанные темы военного права</h2>
        <p className="mt-2 text-sm text-zinc-600">Другие разделы, которые могут потребоваться для защиты права или подготовки документов.</p>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {getMilitaryRelatedTopics(topic).map(link=><li key={link.href}>
            <Link href={link.href} className="block rounded-lg border border-line p-4 hover:border-trust focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-trust">
              <span className="block font-semibold text-trust underline underline-offset-2">{link.title}</span>
              <span className="mt-2 block text-sm text-zinc-600">{link.detail}</span>
            </Link>
          </li>)}
        </ul>
      </section>
      <p className="mt-8"><Link href={`/questions/?q=${encodeURIComponent(topic.title)}`} className="font-semibold text-trust underline">Искать вопросы и ответы по теме</Link></p>
    </main>
  </>;
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { getMilitaryTopic, getMilitarySituation, MILITARY_TOPICS } from "@/data/military-catalog";
type Props = { params: Promise<{slug: string; situation: string}> };
export const dynamicParams = false;
export function generateStaticParams() {
  return MILITARY_TOPICS.flatMap(t => t.situations.map(s => ({slug:t.slug,situation:s.slug})));
}
export async function generateMetadata({params}:Props):Promise<Metadata> {
  const {slug,situation} = await params;
  const topic = getMilitaryTopic(slug);
  const item = topic ? getMilitarySituation(topic,situation) : null;
  return {title:item ? `${item.title} — военное право`:"Ситуация не найдена",robots:{index:false,follow:true}};
}
export default async function MilitarySituationPage({params}:Props) {
  const {slug,situation:selection}=await params;
  const topic=getMilitaryTopic(slug);
  const situation=topic ? getMilitarySituation(topic,selection) : null;
  if(!topic || !situation) notFound();
  return <>
    <Breadcrumbs items={[
      {name:"Главная",path:"/"},
      {name:"Военное право",path:"/voennoe-pravo/"},
      {name:topic.title,path:`/voennoe-pravo/${topic.slug}/`},
      {name:situation.title,path:`/voennoe-pravo/${topic.slug}/${situation.slug}/`}
    ]}/>
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <Link href={`/voennoe-pravo/${topic.slug}/`} className="text-sm font-semibold text-trust underline">Вернуться к вопросам</Link>
      <h1 className="mt-4 text-3xl font-semibold text-ink">{situation.title}</h1>
      <p className="mt-4 text-zinc-700">Тема: {topic.title}.</p>
      <section className="mt-8 rounded-lg border border-line bg-white p-6">
        <h2 className="text-xl font-semibold text-ink">{situation.kind === "information" ? "Правовая информация" : "Порядок действий и юридические документы"}</h2>
        <p className="mt-3 leading-7 text-zinc-700">{situation.kind === "information"
          ? "Для этой ситуации предусмотрена информационная страница без анкеты и генератора документов. Содержание и ссылки на действующие правовые нормы добавляются после юридической сверки."
          : "Сначала будут проверены применимые нормы, условия обращения и компетентный орган. Генератор включим только для конкретного юридически необходимого документа после проверки; пока он недоступен."}</p>
      </section>
      <Link href="/questions/" className="mt-6 inline-flex text-sm font-semibold text-trust underline">Вопросы и ответы юристов</Link>
    </main>
  </>;
}

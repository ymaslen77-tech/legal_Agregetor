import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { getMilitaryTopic, getMilitarySituation, MILITARY_TOPICS } from "@/data/military-catalog";
import { getMilitaryGuide } from "@/data/military-guidance";
import { getMilitarySituationContent } from "@/lib/military-situation-content";
import { getMilitaryDocumentCandidate } from "@/data/military-document-candidates";
import { MilitaryDraftForm } from "@/components/documents/MilitaryDraftForm";

type Props={params:Promise<{slug:string;situation:string}>};
export const dynamicParams=false;
export function generateStaticParams(){
 return MILITARY_TOPICS.flatMap(t=>t.situations.map(s=>({slug:t.slug,situation:s.slug})));
}
export async function generateMetadata({params}:Props):Promise<Metadata>{
 const {slug,situation}=await params;const topic=getMilitaryTopic(slug);const item=topic?getMilitarySituation(topic,situation):null;
 return {title:item?`${item.title} — военное право`:"Ситуация не найдена",robots:{index:false,follow:true}};
}
export default async function MilitarySituationPage({params}:Props){
 const {slug,situation:selection}=await params;
 const topic=getMilitaryTopic(slug);
 const situation=topic?getMilitarySituation(topic,selection):null;
 if(!topic||!situation)notFound();
 const guide=getMilitaryGuide(topic.slug);
 const content=getMilitarySituationContent(topic,situation);
 const candidate=getMilitaryDocumentCandidate(topic,situation);
 return <>
   <Breadcrumbs items={[
     {name:"Главная",path:"/"},{name:"Военное право",path:"/voennoe-pravo/"},
     {name:topic.title,path:`/voennoe-pravo/${topic.slug}/`},
     {name:situation.title,path:`/voennoe-pravo/${topic.slug}/${situation.slug}/`}
   ]}/>
   <article className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
     <Link href={`/voennoe-pravo/${topic.slug}/`} className="text-sm font-semibold text-trust underline">Вернуться к вопросам</Link>
     <header className="mt-5 border-b border-line pb-6">
       <p className="text-sm font-semibold uppercase text-trust">{topic.title}</p>
       <h1 className="mt-3 text-3xl font-semibold text-ink">{situation.title}</h1>
     </header>
     <section className="mt-7" aria-labelledby="military-short-answer">
       <h2 className="text-xl font-semibold text-ink" id="military-short-answer">Краткий правовой ответ</h2>
       <p className="mt-3 leading-7 text-zinc-700">{content.shortAnswer}</p>
     </section>
     <section className="mt-7" aria-labelledby="military-steps">
       <h2 className="text-xl font-semibold text-ink" id="military-steps">Порядок действий</h2>
       <ol className="mt-4 grid list-decimal gap-3 pl-6 text-zinc-700">
         {content.steps.map((step,index)=><li key={index} className="pl-1 leading-7">{step}</li>)}
       </ol>
     </section>
     {situation.kind!=="information"?<section className="mt-7" aria-labelledby="military-evidence">
       <h2 className="text-xl font-semibold text-ink" id="military-evidence">Что подтверждает обстоятельства</h2>
       <ul className="mt-3 grid list-disc gap-2 pl-6 text-zinc-700">
         {content.evidence.map(item=><li key={item}>{item}</li>)}
       </ul>
       <p className="mt-3 text-sm text-zinc-600"><strong>Куда обращаться:</strong> {content.recipient}</p>
     </section>:null}
     {candidate?<MilitaryDraftForm key={situation.slug} candidate={candidate} slug={situation.slug}/>:situation.kind!=="information"?<p className="mt-7 rounded-md border border-line bg-zinc-50 p-4 text-sm leading-6 text-zinc-700">Для этого вопроса автоматический генератор ещё не подтверждён. Если требуется обращение, предварительно определите его правовую форму и компетентный орган. Универсальный документ здесь не подставляется.</p>:null}
     <section className="mt-8 border-t border-line pt-6" aria-labelledby="military-references">
       <h2 className="text-xl font-semibold text-ink" id="military-references">Нормативное регулирование</h2>
       <p className="mt-2 text-sm text-zinc-600">Ссылки на тексты нормативных актов приведены справочно. Применимость нормы и её редакцию необходимо проверить на дату обстоятельств.</p>
       <ul className="mt-4 grid gap-2">
         {guide.sources.map(source=><li key={source.id}><a className="font-medium text-trust underline underline-offset-2" href={source.url} target="_blank" rel="noopener noreferrer">{source.name}</a></li>)}
       </ul>
       <p className="mt-3 text-sm text-zinc-600">Официальные публикации и изменения: <a className="text-trust underline" href="https://pravo.gov.ru/" target="_blank" rel="noopener noreferrer">Официальный интернет-портал правовой информации</a>.</p>
     </section>
     <section className="mt-7 rounded-lg border-l-4 border-amber-500 bg-amber-50 p-4" aria-label="Важные ограничения">
       <h2 className="font-semibold text-amber-950">Что важно учесть</h2>
       <p className="mt-2 text-sm leading-6 text-amber-950">{content.limitation}</p>
       <p className="mt-2 text-sm leading-6 text-amber-950">Материал проходит индивидуальную юридическую проверку; окончательные выводы по праву на выплату, увольнение и судебную защиту из одного названия ситуации не следуют.</p>
     </section>
     <p className="mt-7"><Link href="/questions/" className="text-sm font-semibold text-trust underline">Посмотреть опубликованные вопросы и ответы</Link></p>
   </article>
 </>;
}

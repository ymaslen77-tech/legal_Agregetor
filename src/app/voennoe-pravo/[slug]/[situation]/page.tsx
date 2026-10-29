import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { getMilitaryTopic, getMilitarySituation, MILITARY_TOPICS } from "@/data/military-catalog";
import { getMilitaryGuide } from "@/data/military-guidance";
import { getMilitarySituationContent } from "@/lib/military-situation-content";
import { getMilitaryProvisionCheck } from "@/data/military-provision-checks";
import { getMilitaryLegalCaseCard } from "@/data/military-case-legal-matrix";
import { getMilitaryDocumentCandidate } from "@/data/military-document-candidates";
import { MilitaryDraftForm } from "@/components/documents/MilitaryDraftForm";
import { MilitaryDraftWorkbench } from "@/components/documents/MilitaryDraftWorkbench";
import { getMilitaryDraftPlan } from "@/data/military-document-core";
import { isMilitaryDraftPreviewEnabled } from "@/data/military-preview-access";
import { getMilitaryRelatedSituations, getMilitaryRelatedTopics, getMilitaryRelatedDocuments } from "@/data/military-related-links";

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
 const researchedProvisions=getMilitaryProvisionCheck(topic.slug,topic.situations.findIndex(item=>item.slug===situation.slug));
 const individualCase=getMilitaryLegalCaseCard(topic.slug,situation.title);
 const candidate=getMilitaryDocumentCandidate(topic,situation);
 const draftPlan=getMilitaryDraftPlan(topic.slug,situation.slug);
 const localPreview=isMilitaryDraftPreviewEnabled(process.env);
 const relatedQuestions=getMilitaryRelatedSituations(topic,situation);
 const relatedTopics=getMilitaryRelatedTopics(topic);
 const relatedDocuments=getMilitaryRelatedDocuments(topic,situation,localPreview);
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
     {individualCase?<section className="mt-7 rounded-lg border border-line bg-zinc-50 p-5" aria-labelledby="military-case-specific-checks">
       <h2 id="military-case-specific-checks" className="text-xl font-semibold text-ink">Что проверить именно по этому вопросу</h2>
       <p className="mt-2 text-sm leading-6 text-zinc-600">Индивидуальный план проверки, а не окончательное правовое заключение. Основания, редакции и правовой способ защиты ещё требуют подтверждения.</p>
       {individualCase.legalQuestion?<p className="mt-3 leading-7 text-zinc-800"><strong>Правовой вопрос:</strong> {individualCase.legalQuestion}</p>:null}
       {individualCase.evidenceToConfirm?<p className="mt-3 leading-7 text-zinc-800"><strong>Какие сведения подготовить:</strong> {individualCase.evidenceToConfirm}</p>:null}
       {individualCase.competentRecipientToVerify?<p className="mt-3 leading-7 text-zinc-800"><strong>Компетентный орган для проверки:</strong> {individualCase.competentRecipientToVerify}</p>:null}
       {individualCase.plannedResultToVerify?<p className="mt-3 leading-7 text-zinc-800"><strong>Предполагаемый результат:</strong> {individualCase.plannedResultToVerify}</p>:null}
       {individualCase.criticalLimitations?<p className="mt-3 text-sm leading-6 text-amber-900"><strong>Ограничение:</strong> {individualCase.criticalLimitations}</p>:null}
     </section>:null}
     {situation.kind!=="information"?<section className="mt-7" aria-labelledby="military-evidence">
       <h2 className="text-xl font-semibold text-ink" id="military-evidence">Что подтверждает обстоятельства</h2>
       <ul className="mt-3 grid list-disc gap-2 pl-6 text-zinc-700">
         {content.evidence.map(item=><li key={item}>{item}</li>)}
       </ul>
       <p className="mt-3 text-sm text-zinc-600"><strong>Куда обращаться:</strong> {content.recipient}</p>
     </section>:null}
     {localPreview&&draftPlan?<MilitaryDraftWorkbench key={situation.slug} plan={draftPlan}/>:candidate?<MilitaryDraftForm key={situation.slug} candidate={candidate} slug={situation.slug}/>:situation.kind!=="information"?<p className="mt-7 rounded-md border border-line bg-zinc-50 p-4 text-sm leading-6 text-zinc-700">Для этого вопроса автоматический генератор ещё не подтверждён. Если требуется обращение, предварительно определите его правовую форму и компетентный орган. Универсальный документ здесь не подставляется.</p>:null}
     <section className="mt-9 border-t border-line pt-7" aria-labelledby="military-related-questions">
       <h2 id="military-related-questions" className="text-xl font-semibold text-ink">Связанные вопросы и следующие действия</h2>
       <p className="mt-2 text-sm text-zinc-600">Смежные ситуации, подтверждающие документы и процедуры обжалования. Переход на другую страницу не означает, что её правовые условия автоматически применимы к вашему делу.</p>
       <ul className="mt-4 grid gap-3 sm:grid-cols-2">
         {relatedQuestions.map(link=><li key={link.href}>
           <Link href={link.href} className="block h-full rounded-lg border border-line p-4 hover:border-trust focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-trust">
             <span className="block font-semibold text-trust underline underline-offset-2">{link.title}</span>
             <span className="mt-2 block text-sm text-zinc-600">{link.detail}</span>
           </Link>
         </li>)}
       </ul>
     </section>
     {relatedDocuments.length>0?<section className="mt-8" aria-labelledby="military-related-documents">
       <h2 id="military-related-documents" className="text-xl font-semibold text-ink">Документы по смежным ситуациям</h2>
       <p className="mt-2 text-sm text-zinc-600">Ссылки ведут только к доступным на текущей странице черновым генераторам. Проекты требуют индивидуальной правовой проверки перед использованием.</p>
       <ul className="mt-4 grid gap-2">
         {relatedDocuments.map(link=><li key={link.href}>
           <Link href={link.href} className="inline-flex font-semibold text-trust underline underline-offset-2">{link.title}</Link>
           <p className="mt-1 text-sm text-zinc-600">{link.detail}</p>
         </li>)}
       </ul>
     </section>:null}
     <section className="mt-8" aria-labelledby="military-related-categories">
       <h2 id="military-related-categories" className="text-xl font-semibold text-ink">Другие связанные темы</h2>
       <ul className="mt-3 grid gap-2 sm:grid-cols-2">
         {relatedTopics.map(link=><li key={link.href}>
           <Link href={link.href} className="block rounded-lg border border-line p-3 font-medium text-trust hover:border-trust">
             {link.title}
           </Link>
         </li>)}
       </ul>
     </section>
     {researchedProvisions?<section className="mt-8 border-t border-line pt-6" aria-labelledby="military-individual-provisions">
       <h2 id="military-individual-provisions" className="text-xl font-semibold text-ink">Нормы для проверки по данной ситуации</h2>
       <p className="mt-2 text-sm leading-6 text-zinc-600">Подобраны отдельные положения с учётом действующего законодательства. Их применимость к вашему делу, редакция на дату события и официальные тексты ещё не подтверждены индивидуальной юридической проверкой. Не используйте этот список как окончательное правовое заключение.</p>
       <ul className="mt-4 grid gap-4">
         {researchedProvisions.provisions.map((rule,index)=><li key={index} className="rounded-md border border-line p-4">
           <a href={rule.textUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-trust underline underline-offset-2">{rule.act}, {rule.article}</a>
           <p className="mt-2 text-sm leading-6 text-zinc-700">{rule.applicability}</p>
           {rule.officialPublicationUrl?<p className="mt-2 text-xs"><a href={rule.officialPublicationUrl} target="_blank" rel="noopener noreferrer" className="text-trust underline underline-offset-2">Найти официальную публикацию этого акта</a> (её применимость к редакции не подтверждена)</p>:null}
         </li>)}
       </ul>
       <p className="mt-3 text-sm text-zinc-600"><strong>Ограничение:</strong> {researchedProvisions.caution}</p>
     </section>:null}
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

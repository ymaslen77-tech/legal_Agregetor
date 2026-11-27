import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getRealEstateGroup } from "@/data/real-estate-route-plan";
import { isRealEstatePreviewEnabled } from "@/lib/real-estate-preview-access";

type Props={params:Promise<{group:string}>};
export const dynamic="force-dynamic";
export const metadata:Metadata={
  title:"Предварительные ситуации — недвижимость и земля",
  robots:{index:false,follow:false,noarchive:true}
};
export default async function RealEstateGroupPage({params}:Props){
  if(!isRealEstatePreviewEnabled(process.env))notFound();
  const {group:groupId}=await params;
  const group=getRealEstateGroup(groupId);
  if(!group)notFound();
  const base="/dev/real-estate/"+group.id+"/";
  return <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6" data-testid="real-estate-group">
    <Link href="/dev/real-estate/" className="text-trust underline">Все подразделы</Link>
    <h1 className="mt-5 text-3xl font-semibold text-ink">{group.title}</h1>
    <p className="mt-3 text-zinc-700">{group.description}</p>
    <p className="mt-3 text-sm text-amber-800">Только локальный прототип: эти ситуации не являются юридическими решениями.</p>
    <section className="mt-8 grid gap-4 md:grid-cols-2" aria-label="Ситуации подраздела">
      {group.situations.map(s=><article key={s.id} className="rounded-lg border border-line bg-white p-5">
        <h2 className="text-lg font-semibold">{s.title}</h2>
        <p className="mt-2 text-sm text-zinc-600">Проверить: {s.caseFacts}</p>
        <Link href={base+s.id+"/"} className="mt-4 inline-block text-sm font-semibold text-trust underline">
          Открыть тестовую анкету
        </Link>
      </article>)}
    </section>
  </main>;
}

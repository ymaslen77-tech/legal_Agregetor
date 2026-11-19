import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { REAL_ESTATE_GROUPS } from "@/data/real-estate-route-plan";
import { RealEstatePreview } from "@/components/real-estate/RealEstatePreview";
import { isRealEstatePreviewEnabled } from "@/lib/real-estate-preview-access";

export const dynamic="force-dynamic";
export const metadata:Metadata={
  title:"Тестовый маршрут — недвижимость и земельные споры",
  robots:{index:false,follow:false,noarchive:true}
};
/** Production returns HTTP 404 even if this page is bundled in the image. */
export default function RealEstateDevelopmentPage(){
  if(!isRealEstatePreviewEnabled(process.env))notFound();
  return <>
    <section className="mx-auto max-w-6xl px-4 pt-8 sm:px-6" aria-label="Подразделы маршрута">
      <h2 className="text-2xl font-semibold text-ink">10 подразделов для проверки</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {REAL_ESTATE_GROUPS.map(g=><Link key={g.id} href={"/dev/real-estate/"+g.id+"/"}
          className="block rounded-lg border border-line bg-white p-4 hover:border-trust">
          <span className="font-semibold text-ink">{g.title}</span>
          <span className="mt-1 block text-sm text-zinc-600">{g.situations.length} предварительных ситуаций</span>
        </Link>)}
      </div>
    </section>
    <RealEstatePreview/>
  </>;
}

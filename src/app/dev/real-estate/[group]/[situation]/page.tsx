import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getRealEstateGroup,getRealEstateSituation } from "@/data/real-estate-route-plan";
import { RealEstatePreview } from "@/components/real-estate/RealEstatePreview";
import { isRealEstatePreviewEnabled } from "@/lib/real-estate-preview-access";

type Props={params:Promise<{group:string;situation:string}>};
export const dynamic="force-dynamic";
export const metadata:Metadata={
  title:"Тестовая анкета по недвижимости — требуется юридическая проверка",
  robots:{index:false,follow:false,noarchive:true}
};
export default async function RealEstateSituationPage({params}:Props){
  if(!isRealEstatePreviewEnabled(process.env))notFound();
  const {group:groupId,situation:situationId}=await params;
  const group=getRealEstateGroup(groupId);
  const situation=getRealEstateSituation(groupId,situationId);
  if(!group||!situation)notFound();
  return <>
    <nav className="mx-auto max-w-6xl px-4 pt-7 text-sm sm:px-6" aria-label="Возврат к списку">
      <Link href={"/dev/real-estate/"+group.id+"/"} className="font-semibold text-trust underline">
        Все ситуации подраздела «{group.title}»
      </Link>
    </nav>
    <RealEstatePreview initialGroupId={groupId} initialSituationId={situationId}/>
  </>;
}

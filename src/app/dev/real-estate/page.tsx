import type { Metadata } from "next";
import { notFound } from "next/navigation";
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
  return <RealEstatePreview/>;
}

import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {MilitaryPreviewForm} from "@/components/documents/MilitaryPreviewForm";
import {canOpenMilitaryPreview} from "@/lib/military-preview-access";
export const metadata:Metadata={title:"Внутренняя проверка военного права",robots:{index:false,follow:false}};
export const dynamic="force-dynamic";
/** Production always disabled. Vercel Preview requires preview-scoped opt-in and project SSO. */
export default function MilitaryInternalPage(){
 if(!canOpenMilitaryPreview(process.env))notFound();
 return <MilitaryPreviewForm/>;
}

import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {MilitaryPreviewForm} from "@/components/documents/MilitaryPreviewForm";
export const metadata:Metadata={title:"Внутренняя проверка военного права",robots:{index:false,follow:false}};
export const dynamic="force-dynamic";
/** Not available on any production build; only local development with an explicit flag. */
export default function MilitaryInternalPage(){
 if(process.env.NODE_ENV==="production" || process.env.MILITARY_PREVIEW!=="1")notFound();
 return <MilitaryPreviewForm/>;
}

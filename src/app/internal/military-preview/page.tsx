import type {Metadata} from "next";
import {notFound} from "next/navigation";
import {MilitaryPreviewForm} from "@/components/documents/MilitaryPreviewForm";
import {MilitaryRelatedQuestions} from "@/components/questions/MilitaryRelatedQuestions";
import {canOpenMilitaryPreview} from "@/lib/military-preview-access";
import {resolveMilitaryPreviewSelection} from "@/lib/military-preview-navigation";
export const metadata:Metadata={title:"Внутренняя проверка военного права",robots:{index:false,follow:false}};
export const dynamic="force-dynamic";
/** Production always disabled. Vercel Preview requires preview-scoped opt-in and project SSO. */
export default async function MilitaryInternalPage({searchParams}:{searchParams:Promise<{route?:string;scenario?:string}>}){
 if(!canOpenMilitaryPreview(process.env))notFound();
 const query=await searchParams;
 const selection=resolveMilitaryPreviewSelection(query.route,query.scenario);
 return <>
  <MilitaryPreviewForm initialRouteId={selection.route.id} initialScenarioKey={selection.scenario.key} invalidSelection={selection.invalidSelection}/>
  <MilitaryRelatedQuestions routeId={selection.route.id} scenarioKey={selection.scenario.key}/>
 </>;
}

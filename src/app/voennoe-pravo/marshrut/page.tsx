import type {Metadata} from "next";
import {MilitaryPreviewForm} from "@/components/documents/MilitaryPreviewForm";
import {MilitaryRelatedQuestions} from "@/components/questions/MilitaryRelatedQuestions";
import {resolveMilitaryPreviewSelection} from "@/lib/military-preview-navigation";

/** Public draft-mode route: read-only Q&A, browser-only answers and no auto-filing.
 * Excluded from SEO until legal review of all case-specific templates.
 * The internal reviewer preview remains separately protected.
 */
export const metadata:Metadata={
 title:"Военное право — подготовка предварительного документа | ПравоПоиск",
 description:"Пошаговая предварительная подготовка материалов по военной службе. Юридическая приёмка не завершена: документы нельзя подавать без проверки.",
 robots:{index:false,follow:false}
};
export const dynamic="force-dynamic";
export default async function MilitaryDraftWizard({
 searchParams
}:{searchParams:Promise<{route?:string;scenario?:string}>}){
 const query=await searchParams;
 const selection=resolveMilitaryPreviewSelection(query.route,query.scenario);
 return <>
  <MilitaryPreviewForm key={selection.route.id+"/"+selection.scenario.key}
   publicDraft initialRouteId={selection.route.id}
   initialScenarioKey={selection.scenario.key}
   invalidSelection={selection.invalidSelection}/>
  <MilitaryRelatedQuestions routeId={selection.route.id} scenarioKey={selection.scenario.key}/>
 </>;
}

import type {Metadata} from "next";
import {MilitaryPreviewForm} from "@/components/documents/MilitaryPreviewForm";
import {MilitaryRelatedQuestions} from "@/components/questions/MilitaryRelatedQuestions";
import {resolveMilitaryPreviewSelection} from "@/lib/military-preview-navigation";

/** Public draft workflow: no approved legal filing, no server-side intake persistence. */
export const metadata:Metadata={
 title:"Военное право — предварительный маршрут и проект документа",
 description:"Выбор ситуации, безопасная анкета, проверка и предварительный PDF. Документы требуют юридической проверки.",
 robots:{index:false,follow:false}
};
export const dynamic="force-dynamic";

export default async function MilitaryDraftRoute({searchParams}:{searchParams:Promise<{route?:string;scenario?:string}>}){
 const query=await searchParams;
 const selection=resolveMilitaryPreviewSelection(query.route,query.scenario);
 return <>
  <MilitaryPreviewForm key={selection.route.id+"/"+selection.scenario.key}
   initialRouteId={selection.route.id} initialScenarioKey={selection.scenario.key}
   invalidSelection={selection.invalidSelection} publicDraft/>
  <MilitaryRelatedQuestions routeId={selection.route.id} scenarioKey={selection.scenario.key}/>
 </>;
}

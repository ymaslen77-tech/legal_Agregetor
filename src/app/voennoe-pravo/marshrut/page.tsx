import {redirect} from "next/navigation";
import {resolveMilitaryPreviewSelection,militaryCanonicalRouteHref} from "@/lib/military-preview-navigation";

export const dynamic="force-dynamic";
export default async function MilitaryLegacyRedirect({searchParams}:{searchParams:Promise<{route?:string;scenario?:string}>}){
 const query=await searchParams;
 const selection=resolveMilitaryPreviewSelection(query.route,query.scenario);
 redirect(militaryCanonicalRouteHref(selection.route.id,selection.scenario.key));
}

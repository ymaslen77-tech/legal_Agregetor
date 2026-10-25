import {MILITARY_ROUTES,type MilitaryRoute,type MilitaryScenario} from "@/data/military-route-plans";
/** Only whitelisted route / scenario IDs are allowed into preview URLs. Never user facts. */
export function resolveMilitaryPreviewSelection(routeId?:string,scenarioKey?:string):{
 route:MilitaryRoute;scenario:MilitaryScenario;invalidSelection:boolean
}{
 const requested=routeId!==undefined||scenarioKey!==undefined;
 const route=MILITARY_ROUTES.find(x=>x.id===routeId)??MILITARY_ROUTES[0];
 const scenario=route.scenarios.find(x=>x.key===scenarioKey)??route.scenarios[0];
 return {route,scenario,invalidSelection:requested&&
   (routeId!==undefined&&route.id!==routeId ||
     scenarioKey!==undefined&&scenario.key!==scenarioKey)};
}
export function militaryPreviewHref(routeId:string,scenarioKey?:string):string {
 const route=MILITARY_ROUTES.find(x=>x.id===routeId);
 if(!route)throw new Error("Unknown military route");
 if(scenarioKey!==undefined&&!route.scenarios.some(x=>x.key===scenarioKey))
   throw new Error("Scenario does not belong to military route");
 const query=new URLSearchParams({route:route.id});
 if(scenarioKey)query.set("scenario",scenarioKey);
 return "/internal/military-preview/?"+query.toString();
}

/**
 * Public entry point into the same guarded, browser-only questionnaire.
 * Query parameters contain stable scenario IDs, never facts, identities or answers.
 */
export function militaryPublicHref(routeId:string,scenarioKey?:string):string {
 const preview=militaryPreviewHref(routeId,scenarioKey);
 return preview.replace("/internal/military-preview/","/voennoe-pravo/marshrut/");
}

import { prisma } from "@/lib/prisma";
import { normalizeText } from "@/lib/related-questions";
import { QNA_LEGAL_AREAS, getQnaLegalAreaByServiceSlug } from "@/data/legal-qna-taxonomy";
import { PROPOSED_LEGAL_ROUTES, type ProposedLegalRoute } from "@/data/legal-route-blueprints";

/**
 * Live aggregate counts only; never SELECT title/text/userName/email or
 * expose contact details in route planning and public analytics.
 * The source PostgreSQL remains unchanged.
 */
export async function getLiveQnaAreaCounts() {
  const [services, groupCounts, publicGroups] = await Promise.all([
    prisma.service.findMany({ select: { id: true, slug: true } }),
    prisma.question.groupBy({ by: ["serviceId"], _count: { _all: true } }),
    prisma.question.groupBy({
      by: ["serviceId"], where: { isIndexable: true },
      _count: { _all: true }
    })
  ]);
  const idToSlug = new Map(services.map(({ id, slug }) => [id, slug]));
  const countsBySlug = new Map<string, number>();
  const indexableBySlug = new Map<string, number>();
  const unknownServiceIds:string[] = [];
  for (const group of groupCounts) {
    const slug = idToSlug.get(group.serviceId ?? "");
    if (!slug) {
      if (group.serviceId) unknownServiceIds.push(group.serviceId);
      continue;
    }
    countsBySlug.set(slug,(countsBySlug.get(slug)??0)+group._count._all);
  }
  for (const group of publicGroups) {
    const slug = idToSlug.get(group.serviceId ?? "");
    if (slug) indexableBySlug.set(slug,(indexableBySlug.get(slug)??0)+group._count._all);
  }
  const covered = QNA_LEGAL_AREAS.map(area=>({
    id:area.id,
    name:area.name,
    count:area.sourceServiceSlugs.reduce((sum,slug)=>sum+(countsBySlug.get(slug)??0),0),
    indexable:area.sourceServiceSlugs.reduce((sum,slug)=>sum+(indexableBySlug.get(slug)??0),0)
  }));
  const unmappedServiceSlugs = services.filter(service=>!getQnaLegalAreaByServiceSlug(service.slug)).map(service=>service.slug);
  return {
    covered,
    questions:covered.reduce((sum,area)=>sum+area.count,0),
    unmappedServiceSlugs,
    unknownServiceIds
  };
}

export type RouteCandidate = {
  areaId: ProposedLegalRoute["areaId"];
  routeSlug:string;
  matchedSignals:string[];
  status:"CANDIDATE_ONLY_REVIEW_REQUIRED";
};

/**
 * Evidence-only shortlist: imported lawyer-service categories are insufficient
 * to infer the actual legal problem. Require at least one query-specific
 * phrase AND an existing scoped Service.slug.
 *
 * This is not a legal answer, public publication decision, or an automated
 * update of Question.serviceId / scenarioId.
 */
export function proposeRoutesForQna(input:{
  serviceSlug:string;
  title:string;
  text?:string;
}):RouteCandidate[]{
  const area=getQnaLegalAreaByServiceSlug(input.serviceSlug);
  if(!area)return[];
  // Source text remains ephemeral and must never be logged by a caller.
  const haystack=normalizeText(`${input.title} ${input.text??""}`);
  if(haystack.length<10)return[];
  return PROPOSED_LEGAL_ROUTES
    .filter(route=>route.areaId===area.id)
    .flatMap(route=>{
      if(route.excludedSignals.some(phrase=>haystack.includes(normalizeText(phrase))))return[];
      const matchedSignals=route.questionSignals.filter(phrase=>haystack.includes(normalizeText(phrase)));
      if(!matchedSignals.length)return[];
      return [{areaId:route.areaId,routeSlug:route.slug,matchedSignals,status:"CANDIDATE_ONLY_REVIEW_REQUIRED" as const}];
    });
}

export type DraftPreflight = {
  areaId:string;
  routeSlug:string;
  scenarioKey:string;
  missingFields:string[];
  invalidFields:string[];
  dataCollectionComplete:boolean;
  requiresLegalReview:true;
  filingReady:false;
  documentGenerationAllowed:false;
};

/**
 * Validates questionnaire input for research/mock UI; a complete questionnaire
 * does NOT authorize legal claims, document generation, or filing.
 */
export function assessProposedRouteInput(
  route:ProposedLegalRoute,
  scenarioKey:string,
  values:Record<string,string|undefined>
):DraftPreflight {
  const scenario=route.scenarios.find(s=>s.key===scenarioKey);
  if(!scenario)throw new Error(`Unknown proposed scenario ${route.areaId}/${route.slug}/${scenarioKey}`);
  const fieldByKey=new Map(route.fields.map(field=>[field.key,field]));
  const missingFields:string[]=[];
  const invalidFields:string[]=[];
  for(const key of scenario.requiredFacts){
    const field=fieldByKey.get(key);
    if(!field)throw new Error(`Missing field definition for ${route.slug}/${key}`);
    const value=values[key]?.trim()??"";
    if(!value){missingFields.push(key);continue;}
    if(value.length>2000){invalidFields.push(key);continue;}
    if(field.type==="choice"&&field.values&&!field.values.includes(value))invalidFields.push(key);
    if(field.type==="date"&&!/^\d{4}-\d{2}-\d{2}$/.test(value))invalidFields.push(key);
  }
  return {
    areaId:route.areaId,
    routeSlug:route.slug,
    scenarioKey,
    missingFields,
    invalidFields,
    dataCollectionComplete:missingFields.length===0&&invalidFields.length===0,
    requiresLegalReview:true,
    filingReady:false,
    documentGenerationAllowed:false
  };
}

import { REAL_ESTATE_GROUPS,REAL_ESTATE_PUBLICATION_GATE } from "@/data/real-estate-route-plan";
import { getRealEstateCheckedContext } from "@/data/real-estate-checked-context";
import { getRealEstateLegalReviewTask } from "@/data/real-estate-legal-review";

/**
 * Evidence audit, not an approval engine. A contextual legal proposition is
 * NEVER equivalent to approving the fact-pattern, claim or filing document.
 */
export type RealEstateCaseAuditRow=Readonly<{
  key:string;title:string;risk:string;
  candidateActCount:number;
  contextualClaimIds:readonly string[];
  contextualPublisherCount:number;
  acceptedIndividualClaims:number;
  reviewStatus:"PENDING";
  filingReady:false;
  indexable:false;
  nextAction:"THREE_SOURCE_CLAIM_AND_CASE_REVIEW";
}>;
export const REAL_ESTATE_CASE_AUDIT:readonly RealEstateCaseAuditRow[] =
  REAL_ESTATE_GROUPS.flatMap(group=>group.situations.map(situation=>{
    const task=getRealEstateLegalReviewTask(group.id,situation.id);
    if(!task)throw new Error("Missing legal review task for "+group.id+"/"+situation.id);
    const context=getRealEstateCheckedContext(group.id,situation.id);
    return {
      key:group.id+"/"+situation.id,
      title:situation.title,
      risk:situation.risk,
      candidateActCount:task.candidateActNames.length,
      contextualClaimIds:context.map(claim=>claim.id),
      contextualPublisherCount:new Set(context.flatMap(claim=>claim.sources.map(source=>source.publisher))).size,
      acceptedIndividualClaims:task.acceptedClaims.length,
      reviewStatus:task.status,
      filingReady:task.filingReady,
      indexable:REAL_ESTATE_PUBLICATION_GATE.indexable,
      nextAction:"THREE_SOURCE_CLAIM_AND_CASE_REVIEW" as const
    };
  }));
export function getRealEstateAuditSummary(){
  const withContext=REAL_ESTATE_CASE_AUDIT.filter(row=>row.contextualClaimIds.length>0).length;
  return {
    scenarios:REAL_ESTATE_CASE_AUDIT.length,
    withGeneralContext:withContext,
    withoutGeneralContext:REAL_ESTATE_CASE_AUDIT.length-withContext,
    legallyApproved:REAL_ESTATE_CASE_AUDIT.filter(row=>row.acceptedIndividualClaims>0).length,
    filingReady:REAL_ESTATE_CASE_AUDIT.filter(row=>row.filingReady).length,
    indexable:REAL_ESTATE_CASE_AUDIT.filter(row=>row.indexable).length
  } as const;
}

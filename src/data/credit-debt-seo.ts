import { CREDIT_DEBT_GROUPS } from "@/data/credit-debt-route-plan";
import { getCreditDebtDocumentTarget } from "@/data/credit-debt-document-targets";

/**
 * SEO publication policy for unreviewed legal material. Build metadata for all
 * sixty distinct cases without accidentally publishing thin/unverified pages.
 * This is not a sitemap generator and it never counts indexability as a passed test.
 */
export type CreditDebtSeoEntry=Readonly<{
  groupId:string;situationId:string;path:string;title:string;
  description:string;indexable:false;
  sourceReview:"PENDING";
  canonicalPath:string;
}>;
const ROOT="/kredity-dolgi/";
export const CREDIT_DEBT_SEO_ENTRIES:readonly CreditDebtSeoEntry[]=CREDIT_DEBT_GROUPS.flatMap(group=>
  group.situations.map(situation=>{
    const path=ROOT+group.id+"/"+situation.id+"/";
    const target=getCreditDebtDocumentTarget(group.id,situation.id);
    if(!target)throw new Error("Credit/debt SEO target has no document outcome");
    const intro=situation.title+". ";
    const detail=target.objective.replace(/^(?:Прошу |Проверить |Сверить |Подготовить |Уточнить |Сохранить |При )/i,"");
    const description=(intro+detail).slice(0,190).trim();
    return {
      groupId:group.id,situationId:situation.id,path,canonicalPath:path,
      title:situation.title+" — "+group.title,
      description,
      indexable:false as const,sourceReview:"PENDING" as const
    };
  }));
export function getCreditDebtSeoEntry(groupId:string,situationId:string):CreditDebtSeoEntry|null{
  return CREDIT_DEBT_SEO_ENTRIES.find(e=>e.groupId===groupId&&e.situationId===situationId)??null;
}
/**
 * The legal editorial gate remains a hard stop regardless of marketing goals.
 * A verified source may support a claim but does not by itself establish
 * document filing readiness or eligibility of each applicant.
 */
export function isCreditDebtPageIndexable(
  entry:CreditDebtSeoEntry,
  options:Readonly<{publicRoutesEnabled:boolean;claimVerified:boolean;factualContentReviewed:boolean}>
):boolean{
  return entry.indexable && options.publicRoutesEnabled&&options.claimVerified&&options.factualContentReviewed;
}

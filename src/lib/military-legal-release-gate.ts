import {MILITARY_ROUTES,MILITARY_SOURCES} from "@/data/military-route-plans";
import {MILITARY_CASE_REVIEWS} from "@/data/military-case-reviews";

/**
 * Fail-closed acceptance contract. A technical test, a bare source URL or a
 * reviewer name alone NEVER constitutes legal approval.
 */
export const MILITARY_ACCEPTANCE_CHECKS=[
  "primaryActCurrentText",
  "statutoryScopeAndSpecialRegime",
  "applicantStanding",
  "addresseeAndJurisdiction",
  "deadlineAndReceiptDate",
  "feesAndAmounts",
  "evidenceAndAttachments",
  "documentRequestAndRelief",
  "pdfDocxAndVersion",
  "negativeEmergencyAndExceptions",
  "expertSignOff"
] as const;
export type MilitaryAcceptanceCheck=typeof MILITARY_ACCEPTANCE_CHECKS[number];
/** Russian reviewer-visible names for the unchanged 11 LEGAL_ROUTE_STANDARD_V1 gates. */
export const MILITARY_ACCEPTANCE_LABELS:Record<MilitaryAcceptanceCheck,string>={
 primaryActCurrentText:"Официальный текст и действующая редакция нормы",
 statutoryScopeAndSpecialRegime:"Применимый режим и специальные исключения",
 applicantStanding:"Полномочия и правовой статус заявителя",
 addresseeAndJurisdiction:"Адресат, ведомство, компетенция суда",
 deadlineAndReceiptDate:"Сроки и документальное подтверждение начала срока",
 feesAndAmounts:"Госпошлина, расчёты и суммы, если применимо",
 evidenceAndAttachments:"Доказательства, реквизиты и приложения",
 documentRequestAndRelief:"Правильность требований и просительной части",
 pdfDocxAndVersion:"PDF/DOCX, реквизиты, формат и версия",
 negativeEmergencyAndExceptions:"Отрицательные, экстренные и особые случаи",
 expertSignOff:"Письменное заключение и подпись рецензента"
};

export type MilitaryReviewEvidence={
 status:"PASS"|"FAIL"|"PENDING";
 rationale:string;
 evidenceUrls:string[];
 verifiedAt:string;
};
export type MilitarySignOff={
 reviewerName:string;
 reviewerRole:string;
 signedAt:string;
 sourceCommit:string;
};
export type MilitaryAcceptanceRecord={
 scenarioId:string;
 checks:Partial<Record<MilitaryAcceptanceCheck,MilitaryReviewEvidence>>;
 signOff?:MilitarySignOff;
};
export type MilitaryAcceptanceResult={approved:boolean;reasons:string[]};
function validTime(value:string):boolean{
 return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(value)&&!Number.isNaN(Date.parse(value));
}
function verifiedSource(url:string):boolean{
 try{const parsed=new URL(url);
  return parsed.protocol==="https:" && parsed.hostname!=="localhost" &&
    !["example.com","example.org"].includes(parsed.hostname) &&
    parsed.pathname!=="/";
 }catch{return false;}
}
export function reviewMilitaryAcceptance(record:MilitaryAcceptanceRecord):MilitaryAcceptanceResult{
 const reasons:string[]=[];
 const known=MILITARY_ROUTES.flatMap(route=>route.scenarios.map(s=>route.id+"/"+s.key));
 if(!known.includes(record.scenarioId))reasons.push("unknown scenario");
 const caseReview=MILITARY_CASE_REVIEWS.find(c=>c.id===record.scenarioId);
 if(!caseReview)reasons.push("case-specific review missing");
 for(const check of MILITARY_ACCEPTANCE_CHECKS){
  const evidence=record.checks[check];
  if(!evidence || evidence.status!=="PASS"){reasons.push(check+": not passed");continue;}
  if(evidence.rationale.trim().length<35)reasons.push(check+": insufficient rationale");
  if(!validTime(evidence.verifiedAt))reasons.push(check+": no valid verification date");
  if(evidence.evidenceUrls.length===0 || !evidence.evidenceUrls.every(verifiedSource))
    reasons.push(check+": missing specific HTTPS evidence");
 }
 const sign=record.signOff;
 if(!sign || sign.reviewerName.trim().length<5||sign.reviewerRole.trim().length<4||
    !validTime(sign.signedAt)||!/^([0-9a-f]{40})$/.test(sign.sourceCommit))
   reasons.push("signed legal review and immutable code revision required");
 // A newly entered form cannot waive the fact that the primary source registry
 // still contains unspecific landing pages or a case remains unreviewed.
 if(caseReview?.reviewState!=="PENDING_PRIMARY_TEXT_AND_CASE_SCOPE"){
   reasons.push("unexpected original-review state: inspect migration");
 }
 const route=MILITARY_ROUTES.find(r=>r.scenarios.some(s=>r.id+"/"+s.key===record.scenarioId));
 const scenario=route?.scenarios.find(s=>route.id+"/"+s.key===record.scenarioId);
 if(scenario?.sources.some(id=>MILITARY_SOURCES[id].verification==="PRIMARY_DOCUMENT_LINK_PENDING"))
   reasons.push("registry contains unresolved primary document references");
 // Approval is intentionally impossible in this branch: primary law and
 // reviewer workflow must be independently implemented and verified first.
 reasons.push("military publication feature gate is locked until legal release");
 return {approved:false,reasons};
}
export function auditMilitaryAcceptance(records:readonly MilitaryAcceptanceRecord[]){
 const duplicates=records.map(r=>r.scenarioId).filter((id,i,all)=>all.indexOf(id)!==i);
 const results=records.map(record=>({scenarioId:record.scenarioId,...reviewMilitaryAcceptance(record)}));
 return {approved:results.length===18&&duplicates.length===0&&results.every(x=>x.approved),
  duplicates,results};
}

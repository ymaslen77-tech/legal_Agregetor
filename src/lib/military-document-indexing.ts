/**
 * Legal-release gate for military document SEO.
 * A working editor or a syntactically valid PDF is not legal publication approval.
 * No military filing is indexed until the complete scenario review is signed off.
 */
import {getMilitaryLegalDocument} from "@/data/military-legal-documents";
import {reviewMilitaryAcceptance} from "@/lib/military-legal-release-gate";

/**
 * No signed, verified military legal acceptance records exist in the registry.
 * An empty check set must fail closed; never use a deployment environment flag
 * or merely a document URL to waive independent source and legal checks.
 */
export function canIndexMilitaryLegalDocument(slug:string):boolean{
 const document=getMilitaryLegalDocument(slug);
 if(!document)return false;
 return reviewMilitaryAcceptance({
  scenarioId:document.routeId+"/"+document.scenarioKey,
  checks:{}
 }).approved;
}

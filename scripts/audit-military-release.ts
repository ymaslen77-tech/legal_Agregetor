import assert from "node:assert/strict";
import {mkdirSync,writeFileSync} from "node:fs";
import {MILITARY_ROUTES,MILITARY_SOURCES,getMilitaryDocumentSlug} from "@/data/military-route-plans";
import {getMilitaryCaseReview,MILITARY_CASE_REVIEWS} from "@/data/military-case-reviews";
import {auditMilitaryAcceptance,MILITARY_ACCEPTANCE_CHECKS} from "@/lib/military-legal-release-gate";
const CHECKS=[
 "primaryActCurrentText","statutoryScopeAndSpecialRegime","applicantStanding",
 "addresseeAndJurisdiction","deadlineAndReceiptDate","feesAndAmounts",
 "evidenceAndAttachments","documentRequestAndRelief","pdfDocxAndVersion",
 "negativeEmergencyAndExceptions","expertSignOff"
] as const;
const scenarios=MILITARY_ROUTES.flatMap(route=>route.scenarios.map(scenario=>{
 const review=getMilitaryCaseReview(route.id,scenario.key);
 assert.ok(scenario.sources.every(key=>MILITARY_SOURCES[key]));
 assert.ok(review.sourceIds.every(id=>scenario.sources.includes(id)),route.id+"/"+scenario.key+": legal source mismatch");
 assert.equal(review.expertSignOff,"NOT_GRANTED");
 assert.equal(review.reviewState,"PENDING_PRIMARY_TEXT_AND_CASE_SCOPE");
 assert.ok(review.legalQuestion.length>25);
 assert.ok(review.addresseeToCheck.length>25);
 assert.ok(review.timeToCheck.length>20);
 assert.ok(review.evidenceToCheck.length>0);
 assert.ok(review.exclusionToCheck.length>30);
 assert.equal(route.publicationApproved,false);
 assert.equal(route.legalRegistryReviewedAt,null);
 assert.equal(route.filingReady,false);
 const checks=Object.fromEntries(CHECKS.map(k=>[k,k==="expertSignOff"?"NOT_GRANTED":"PENDING_CASE_BY_CASE_VERIFICATION"]));
 assert.equal(Object.values(checks).every(x=>x==="NOT_GRANTED"||x==="PENDING_CASE_BY_CASE_VERIFICATION"),true);
 return {routeId:route.id,canonicalProposedUrl:"/problems/voennoe-pravo/"+route.slug+"/",
  scenarioKey:scenario.key,plannedResult:scenario.kind,
  documentSlug:getMilitaryDocumentSlug(route,scenario),sources:scenario.sources,
  caseSpecificReview:review,
  uiAndContract:"INTERNAL_PREVIEW",pdfDocx:scenario.kind==="URGENT_INSTRUCTION"?"NOT_APPLICABLE":"AWAITING_VISUAL_TEST",
  noPublicRegistry:true,legalAcceptanceChecklist:checks,filingReady:false,publicationApproved:false};
}));
const releaseGate=auditMilitaryAcceptance(scenarios.map(x=>({scenarioId:x.routeId+"/"+x.scenarioKey,checks:{}})));
assert.equal(releaseGate.approved,false);
assert.equal(MILITARY_ACCEPTANCE_CHECKS.length,11);
assert.equal(scenarios.length,18);assert.equal(MILITARY_CASE_REVIEWS.length,18);
assert.equal(new Set(MILITARY_CASE_REVIEWS.map(r=>r.id)).size,18);
assert.equal(scenarios.filter(x=>x.plannedResult==="URGENT_INSTRUCTION").length,1);
const report={assessedAt:"2026-10-21",standard:"LEGAL_ROUTE_STANDARD_V1",result:"DOCUMENT_RESULT_V1",
 qnaBaselineMilitaryQuestions:13110,qnaBaselineCheckedAt:"2026-10-15",
 routes:MILITARY_ROUTES.length,scenarios:scenarios.length,legalChecksPerScenario:CHECKS.length,
 provisionalDrafts:scenarios.filter(x=>x.plannedResult==="DRAFT").length,
 preliminaryChecklists:scenarios.filter(x=>x.plannedResult==="CHECKLIST").length,
 emergencyInstructions:scenarios.filter(x=>x.plannedResult==="URGENT_INSTRUCTION").length,
 legallyApprovedScenarios:0,publishedRoutes:0,caseSpecificReviewRows:18,releaseGate,rows:scenarios};
mkdirSync("artifacts",{recursive:true});
writeFileSync("artifacts/military-legal-acceptance.json",JSON.stringify(report,null,2)+"\n");
const mark=(label:string,value:string)=>label+": "+value;
const output=[
 "# Военное право — протокол юридической приёмки",
 "",
 "Подготовлено: 22.10.2026. Статус: ВСЕ 18 СЦЕНАРИЕВ ОЖИДАЮТ НЕЗАВИСИМОЙ ПРАВОВОЙ ПРОВЕРКИ.",
 "Этот документ является бланком и рабочим списком вопросов, а не заключением юриста.",
 "",
 "Для допуска необходимо проверить действующие редакции на дату события, специальные режимы,",
 "допустимость заявленного требования, доказательства, применимую процедуру, адресата, подсудность,",
 "сроки/дату вручения, пошлину, DOCX/PDF и подлинное решение проверяющего.",
 "",
 ...scenarios.flatMap((s,index)=>[
  "## "+(index+1)+". "+s.caseSpecificReview.id,
  "",
  mark("Маршрут",s.routeId),
  mark("Сценарий",s.scenarioKey),
  mark("Тип результата",s.plannedResult),
  mark("Вопрос",s.caseSpecificReview.legalQuestion),
  mark("Правовой режим",s.caseSpecificReview.scopeToCheck),
  mark("Полномочия",s.caseSpecificReview.standingToCheck),
  mark("Адресат",s.caseSpecificReview.addresseeToCheck),
  mark("Сроки и начало отсчёта",s.caseSpecificReview.timeToCheck),
  mark("Исключения",s.caseSpecificReview.exclusionToCheck),
  ...s.caseSpecificReview.evidenceToCheck.map((e:string)=>"- Документ: "+e),
  "",
  "### 11 независимых критериев, пока не подтверждены",
  ...CHECKS.map(check=>"- [ ] "+check+" — источник, редакция, применимость, вывод, доказательство, дата и проверяющий: НЕ ПРЕДОСТАВЛЕНЫ"),
  "",
  "Протокол и подпись проверяющего: НЕ ПРЕДОСТАВЛЕНЫ.",
  "Готовность к подаче: НЕТ. Разрешение публикации: НЕТ.",
  ""
 ])
];
assert.equal(output.filter(line=>line.includes("### 11 независимых критериев")).length,18);
assert.equal(output.filter(line=>line.includes("Протокол и подпись проверяющего: НЕ ПРЕДОСТАВЛЕНЫ.")).length,18);
writeFileSync("artifacts/military-legal-review-checklist.md",output.join("\n")+"\n");

console.log("MILITARY GATES: "+report.routes+" routes, "+report.scenarios+" scenarios, 11 mandatory checks, 0 approved; report saved");

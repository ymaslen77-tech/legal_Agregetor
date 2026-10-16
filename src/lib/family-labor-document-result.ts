import {DOCUMENT_RESULT_CONTRACT_VERSION,documentResultSchema,type DocumentResultV1} from "@/lib/document-result-contract";
import {type FamilyLaborPlan} from "@/data/family-labor-route-expansion";
import {familyLaborCategory,getFamilyLaborDocumentSlug,getFamilyLaborRegistryScenarioKey,getFamilyLaborRouteSlug}
  from "@/data/family-labor-implemented-routes";
import {getFamilyLaborGuidance} from "@/lib/family-labor-route-guidance";
import {createProvisionalFamilyLaborDraft} from "@/lib/family-labor-provisional-draft";

export type FamilyLaborChecklist = {result:DocumentResultV1; guidance:string[]};
/** Deterministic evidence checklist. No model, external transmission, law citation invention or submission. */
export function createFamilyLaborChecklist(plan:FamilyLaborPlan,scenarioKey:string,answers:Record<string,string|undefined>,
  ids:{versionId:string;createdAt:string}):FamilyLaborChecklist {
  const docSlug=getFamilyLaborDocumentSlug(plan,scenarioKey);
  if(!docSlug)throw new Error("This scenario does not support document generation");
  const review=getFamilyLaborGuidance(plan,scenarioKey,answers);
  if(!review.dataComplete || review.invalid.length || review.missing.length)
    throw new Error("Заполните обязательные сведения и исправьте ошибки.");
  const scenario=plan.scenarios.find(s=>s.key===scenarioKey);
  if(!scenario||scenario.emergencyFirst)throw new Error("Emergency instructions are not a document");
  const facts=scenario.requiredFields.map(key=>{
    const field=plan.fields.find(x=>x.key===key);
    if(!field)throw new Error("Field not registered: "+key);
    const value=answers[key]?.trim()??"";
    return field.label+": "+value;
  });
  const heading="ПРЕДВАРИТЕЛЬНЫЙ ЧЕК-ЛИСТ — НЕ ГОТОВ К ПОДАЧЕ";
  const documentText=[
    heading,
    scenario.title,
    "",
    "Исходные сведения (заполнены пользователем, не подтверждены сервисом):",
    ...facts.map((s,i)=>(i+1)+". "+s),
    "",
    "Предварительные действия:",
    ...review.guidance.map((s,i)=>(i+1)+". "+s),
    "",
    "Документы для проверки:",
    ...review.documentsToCheck.map(s=>"- "+s),
    "",
    "Правовые источники, требующие сверки по действующей редакции:",
    ...review.verificationSources.map(s=>"- "+s.name+": "+s.url),
    "",
    "Результат не является иском, заявлением, жалобой или юридическим заключением.",
    "Нормы, срок, размер требований, пошлина и подсудность не подтверждены.",
    "Перед подачей любого обращения требуется самостоятельная юридическая проверка."
  ].join("\n");
  return {result:documentResultSchema.parse({
    contractVersion:DOCUMENT_RESULT_CONTRACT_VERSION,
    versionId:ids.versionId,createdAt:ids.createdAt,
    categorySlug:familyLaborCategory(plan),routeSlug:getFamilyLaborRouteSlug(plan),
    scenarioKey:getFamilyLaborRegistryScenarioKey(plan,scenarioKey),documentSlug:docSlug,resultKind:"CHECKLIST",
    source:"DETERMINISTIC",documentTitle:"Чек-лист: "+scenario.title,
    documentText,usedRuleIds:[],placeholders:[],
    legalRegistryReviewedAt:null,
    generatorVersion:"family-labor-checklist-1",filingReady:false,
    requiresLegalReview:true
  }),guidance:review.guidance};
}

/**
 * Use an allowlisted, source-linked deterministic draft only in narrowly
 * qualified situations. All other scenarios retain the safer checklist.
 * The result is never filing-ready; the draft requires professional review.
 */
export function createFamilyLaborDocument(
  plan:FamilyLaborPlan,scenarioKey:string,answers:Record<string,string|undefined>,
  ids:{versionId:string;createdAt:string}
):FamilyLaborChecklist{
  const checklist=createFamilyLaborChecklist(plan,scenarioKey,answers,ids);
  const draft=createProvisionalFamilyLaborDraft(plan,scenarioKey,answers);
  if(!draft)return checklist;
  return {
    result:documentResultSchema.parse({
      ...checklist.result,
      resultKind:"DRAFT",
      documentTitle:"Проект: "+draft.title,
      documentText:draft.text,
      usedRuleIds:draft.ruleIds,
      placeholders:draft.placeholders,
      generatorVersion:"family-labor-draft-1",
      requiresLegalReview:true,
      filingReady:false
    }),
    guidance:checklist.guidance
  };
}

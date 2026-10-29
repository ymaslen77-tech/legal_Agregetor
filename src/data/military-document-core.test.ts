import assert from "node:assert/strict";
import { MILITARY_TOPICS } from "@/data/military-catalog";
import { MILITARY_DOCUMENT_TARGETS } from "@/data/military-document-target-matrix";
import { getMilitaryDocumentCandidate } from "@/data/military-document-candidates";
import { MILITARY_ADDITIONAL_COMPOSITIONS, getMilitaryAdditionalComposition } from "@/data/military-document-compositions";
import {
  MILITARY_DOCUMENT_CORE_VERSION,
  getMilitaryDraftPlan,
  listMilitaryDraftPlans,
  createMilitaryDraftPrototype,
  addMilitaryDraftVersion,
  reviseMilitaryDraftPrototype
} from "@/data/military-document-core";
import { MAX_OPEN_TAB_DOCUMENT_VERSIONS } from "@/lib/document-version-history";
import { DOCUMENT_RESULT_CONTRACT_VERSION, documentResultSchema } from "@/lib/document-result-contract";

const all=listMilitaryDraftPlans();
assert.equal(all.length,121);
assert.equal(new Set(all.map(x=>x.documentSlug)).size,121);
assert(all.every(x=>x.canonicalDocumentUrl===null));
assert(all.every(x=>!x.generationEnabled && !x.filingReady && x.requiresLegalReview && x.reviewStatus==="PENDING"));
assert(all.every(x=>x.verifiedLegalRules.length===0));
assert(all.every(x=>x.selectedSituationIsImplicit));
assert(all.every(x=>x.requiredInputs.filter(i=>i.required).length>=3));
assert(all.every(x=>x.requiredInputs.map(f=>f.key).every((key,i,keys)=>keys.indexOf(key)===i)));
assert.equal(all.filter(x=>x.candidateImplemented).length,121);
assert.equal(all.filter(x=>!x.candidateImplemented).length,0);
assert.equal(all.filter(x=>x.conditionalAlternativeKind!==null).length,38);
assert(all.every(x=>x.relatedSituationUrls.every(url=>url.startsWith("/voennoe-pravo/"))));
let prototypes=0,missing=0;
for(const topic of MILITARY_TOPICS)for(const situation of topic.situations){
  const plan=getMilitaryDraftPlan(topic.slug,situation.slug);
  if(situation.kind==="information"){
    assert.equal(plan,null,"Informational page must not get a document");
    assert.throws(()=>createMilitaryDraftPrototype({categorySlug:topic.slug,situationSlug:situation.slug,values:{}}));
    continue;
  }
  assert(plan);
  assert.equal(plan.candidateImplemented,Boolean(getMilitaryDocumentCandidate(topic,situation)||getMilitaryAdditionalComposition(topic.slug,topic.situations.indexOf(situation))));
  const input={
    categorySlug:topic.slug,situationSlug:situation.slug,
    values:{
      applicant:"Тестовый заявитель, военнослужащий",
      recipient:"Уполномоченному должностному лицу",
      facts:"Обстоятельства с датами, номером документа и конкретным предметом обращения.",
      caseReference:"Приказ № 7, дата 15.10.2026",
      evidence:"Подтверждающие документы имеются",
      attachments:"Копия обращения, копия решения",
      ...Object.fromEntries(plan.requiredInputs.filter(f=>f.required&&!["applicant","recipient","facts"].includes(f.key)).map(f=>[f.key,"Подтверждённые сведения для поля "+f.label+" от 29 октября 2026 года"]))
    },
    versionId:"550e8400-e29b-41d4-a716-446655440000",
    createdAt:"2026-10-29T10:00:00.000Z"
  };
  if(!plan.candidateImplemented) {
    missing++;
    assert.equal(plan.documentRequest,"");
    assert.throws(()=>createMilitaryDraftPrototype(input),/does not yet have an individual approved composition prototype/);
    continue;
  }
  prototypes++;
  assert(plan.documentRequest.length>40);
  const {documentResult,formData}=createMilitaryDraftPrototype(input);
  assert.equal(documentResultSchema.parse(documentResult).contractVersion,DOCUMENT_RESULT_CONTRACT_VERSION);
  assert.equal(documentResult.categorySlug,"voennoe-pravo");
  assert.equal(documentResult.routeSlug,topic.slug);
  assert.equal(documentResult.scenarioKey,situation.slug);
  assert.equal(documentResult.documentSlug,plan.documentSlug);
  assert.equal(documentResult.generatorVersion,MILITARY_DOCUMENT_CORE_VERSION);
  assert.equal(documentResult.legalRegistryReviewedAt,null);
  assert.equal(documentResult.filingReady,false);
  assert.equal(documentResult.requiresLegalReview,true);
  assert.deepEqual(documentResult.usedRuleIds,[]);
  assert.equal(documentResult.source,"DETERMINISTIC");
  assert(documentResult.documentText.includes("ЧЕРНОВИК — НЕ ГОТОВ К ПОДАЧЕ"));
  assert(documentResult.documentText.includes("Приказ № 7"));
  assert(documentResult.documentText.includes(plan.documentRequest));
  assert(documentResult.documentText.includes("Подтверждающие документы имеются"));
  assert.equal(formData.caseReference,"Приказ № 7, дата 15.10.2026");
}
assert.equal(prototypes,121);
assert.equal(missing,0);
// All 103 new hand-curated internal templates cannot conflict with legacy eighteen.
assert.equal(MILITARY_ADDITIONAL_COMPOSITIONS.length,103);
assert.equal(new Set(MILITARY_ADDITIONAL_COMPOSITIONS.map(c=>c.topicSlug+":"+c.situationIndex)).size,103);
assert(MILITARY_ADDITIONAL_COMPOSITIONS.every(c=>!c.legalReviewConfirmed&&!c.officialTextVerified));
for(const comp of MILITARY_ADDITIONAL_COMPOSITIONS){
 const topic=MILITARY_TOPICS.find(t=>t.slug===comp.topicSlug)!;
 const situation=topic.situations[comp.situationIndex];
 assert(situation && situation.kind!=="information");
 assert(!getMilitaryDocumentCandidate(topic,situation),"New prototype conflicts with old one");
 assert.equal(comp.candidate.title,situation.title);
 assert(comp.candidate.requestText.length>90);
 assert(comp.additionalFields.length>0);
 const plan=getMilitaryDraftPlan(topic.slug,situation.slug)!;
 assert(plan.candidateImplemented);
 assert(comp.additionalFields.every(f=>f.required&&plan.requiredInputs.some(p=>p.key===f.key)));
 assert(comp.additionalFields.every(f=>!["facts","recipient","applicant"].includes(f.key)));
 const sharedValues={
   applicant:"Тестовый заявитель",
   recipient:"Уполномоченному должностному лицу",
   facts:"Обстоятельства для индивидуального обращения с указанием времени и события."
 };
 assert.throws(()=>createMilitaryDraftPrototype({categorySlug:topic.slug,situationSlug:situation.slug,values:sharedValues}),/обязательное поле/);
 const individualValues=Object.fromEntries(plan.requiredInputs.filter(f=>f.required&&!["applicant","recipient","facts"].includes(f.key)).map(f=>[f.key,"Сведения по вопросу: "+f.label+" — по подтверждённым документам"]));
 const drafted=createMilitaryDraftPrototype({categorySlug:topic.slug,situationSlug:situation.slug,values:{...sharedValues,...individualValues}});
 assert(drafted.documentResult.documentText.includes(comp.candidate.requestText));
 assert(drafted.documentResult.documentText.includes(comp.additionalFields[0].label));
 assert.equal(drafted.documentResult.legalRegistryReviewedAt,null);
 assert.deepEqual(drafted.documentResult.usedRuleIds,[]);
 assert.equal(drafted.documentResult.filingReady,false);
}

// No mandatory form for the 22 information-only questions. Court and
// criminal-process compositions require type-specific particulars and
// remain unapproved, regardless of a successful render.
const procedure = MILITARY_ADDITIONAL_COMPOSITIONS.filter(c=>
 ["ADMINISTRATIVE_CLAIM","PROCEDURAL_MOTION","PROCEDURAL_COMPLAINT","PROCEDURAL_APPEAL"].includes(c.candidate.kind));
assert.equal(procedure.length,10);
for(const c of procedure){
 const topic=MILITARY_TOPICS.find(t=>t.slug===c.topicSlug)!;
 const situation=topic.situations[c.situationIndex];
 const plan=getMilitaryDraftPlan(topic.slug,situation.slug)!;
 const required=plan.requiredInputs.filter(x=>x.required);
 assert(required.some(x=>x.key==="caseNumber"||x.key==="court"));
 const values=Object.fromEntries(required.map(x=>[x.key,"Документально подтверждено: "+x.label+" по материалам дела"])) as Record<string,string>;
 const out=createMilitaryDraftPrototype({categorySlug:topic.slug,situationSlug:situation.slug,values});
 assert(out.documentResult.documentText.includes(c.candidate.requestText));
 assert(out.documentResult.documentText.includes(c.additionalFields[0].label));
 assert(out.documentResult.documentText.includes("ПРЕДВАРИТЕЛЬНАЯ ПОДГОТОВКА"));
 assert.equal(out.documentResult.filingReady,false);
 assert.equal(out.documentResult.legalRegistryReviewedAt,null);
}
const special=MILITARY_DOCUMENT_TARGETS.find(x=>x.categorySlug==="prizyv" && x.situationIndex===4)!;
assert(special);
const valid={
  categorySlug:special.categorySlug,situationSlug:special.situationSlug,
  values:{applicant:"Тестовый заявитель",recipient:"Военному комиссару",facts:"Заседание состоялось, требуется выписка из протокола."},
  versionId:"550e8400-e29b-41d4-a716-446655440000",createdAt:"2026-10-29T10:00:00.000Z"
};
assert.throws(()=>createMilitaryDraftPrototype({...valid,values:{...valid.values,applicant:""}}),/обязательное поле/);
assert.throws(()=>createMilitaryDraftPrototype({...valid,values:{...valid.values,facts:"кратко"}}),/обязательное поле/);
assert.throws(()=>createMilitaryDraftPrototype({...valid,versionId:"INVALID"}));
assert.throws(()=>createMilitaryDraftPrototype({...valid,createdAt:"INVALID"}));
let history:ReturnType<typeof addMilitaryDraftVersion>=[];
for(let i=0;i<MAX_OPEN_TAB_DOCUMENT_VERSIONS+2;i++){
  const z=createMilitaryDraftPrototype({...valid,versionId:"550e8400-e29b-41d4-a716-"+String(i).padStart(12,"0"),values:{...valid.values,facts:"Факты и обстоятельства для версии "+i+" описаны в отдельной редакции."}});
  history=addMilitaryDraftVersion(history,z);
}
assert.equal(history.length,MAX_OPEN_TAB_DOCUMENT_VERSIONS);
assert.equal(history[0].payload.facts,"Факты и обстоятельства для версии 7 описаны в отдельной редакции.");
assert.equal(new Set(history.map(x=>x.documentResult.versionId)).size,history.length);
const reopened=addMilitaryDraftVersion(history,{documentResult:history[2].documentResult,formData:history[2].payload});
assert.equal(reopened.length,MAX_OPEN_TAB_DOCUMENT_VERSIONS);
assert.equal(reopened[0].documentResult.versionId,history[2].documentResult.versionId);
const modified=reviseMilitaryDraftPrototype(createMilitaryDraftPrototype(valid),
  "Исправленное заявление с индивидуально уточнёнными обстоятельствами и просьбой предоставить выписку из протокола.",{
    versionId:"550e8400-e29b-41d4-a716-446655440099",
    createdAt:"2026-10-29T12:00:00.000Z"
  });
assert.equal(modified.documentResult.source,"USER_EDITED");
assert.equal(modified.documentResult.filingReady,false);
assert.equal(modified.documentResult.legalRegistryReviewedAt,null);
assert.deepEqual(modified.documentResult.usedRuleIds,[]);
assert(modified.documentResult.documentText.startsWith("ЧЕРНОВИК — НЕ ГОТОВ К ПОДАЧЕ"));
assert(modified.documentResult.documentText.includes("Исправленное заявление"));
assert.throws(()=>reviseMilitaryDraftPrototype(createMilitaryDraftPrototype(valid),"коротко"));
assert.throws(()=>reviseMilitaryDraftPrototype(createMilitaryDraftPrototype(valid),
  "Текст изменения достаточно длинный для проекта заявления с фактическими обстоятельствами.",{versionId:"invalid"}));
console.log(JSON.stringify({stage4DraftCore:true,mapped:all.length,draftPrototypes:prototypes,missingCompositions:missing,conditionalAlternatives:38,filingReady:0,legalApproved:0}));

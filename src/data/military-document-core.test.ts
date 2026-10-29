import assert from "node:assert/strict";
import { MILITARY_TOPICS } from "@/data/military-catalog";
import { MILITARY_DOCUMENT_TARGETS } from "@/data/military-document-target-matrix";
import { getMilitaryDocumentCandidate } from "@/data/military-document-candidates";
import {
  MILITARY_DOCUMENT_CORE_VERSION,
  getMilitaryDraftPlan,
  listMilitaryDraftPlans,
  createMilitaryDraftPrototype,
  addMilitaryDraftVersion
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
assert.equal(all.filter(x=>x.candidateImplemented).length,18);
assert.equal(all.filter(x=>!x.candidateImplemented).length,103);
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
  assert.equal(plan.candidateImplemented,Boolean(getMilitaryDocumentCandidate(topic,situation)));
  const input={
    categorySlug:topic.slug,situationSlug:situation.slug,
    values:{
      applicant:"Тестовый заявитель, военнослужащий",
      recipient:"Уполномоченному должностному лицу",
      facts:"Обстоятельства с датами, номером документа и конкретным предметом обращения.",
      caseReference:"Приказ № 7, дата 15.10.2026",
      evidence:"Подтверждающие документы имеются",
      attachments:"Копия обращения, копия решения"
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
assert.equal(prototypes,18);
assert.equal(missing,103);
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
console.log(JSON.stringify({stage4DraftCore:true,mapped:all.length,draftPrototypes:prototypes,missingCompositions:missing,conditionalAlternatives:38,filingReady:0,legalApproved:0}));

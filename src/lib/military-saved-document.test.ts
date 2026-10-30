import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { getMilitaryDraftPlan, listMilitaryDraftPlans, createMilitaryDraftPrototype, reviseMilitaryDraftPrototype } from "@/data/military-document-core";
import { validateSavedDocument } from "@/lib/saved-document-validation";
import { encryptSavedDocument, decryptSavedDocument } from "@/lib/saved-document-crypto";

const qa={NODE_ENV:"development",ENABLE_MILITARY_DRAFT_PREVIEW:"true"};
const noFlag={NODE_ENV:"development",ENABLE_MILITARY_DRAFT_PREVIEW:"false"};
const production={NODE_ENV:"production",ENABLE_MILITARY_DRAFT_PREVIEW:"true"};
const productionEnabled={NODE_ENV:"production",ENABLE_MILITARY_PUBLIC_DRAFTS:"true"};
const all=listMilitaryDraftPlans();
assert.equal(all.length,121);
process.env.DOCUMENT_STORAGE_KEY=randomBytes(32).toString("base64");
try {
  for(const plan of all) {
    const values=Object.fromEntries(plan.requiredInputs.map(f=>[
      f.key,"Тестовые факты, документы и даты из синтетического дела: "+f.label
    ])) as Record<string,string>;
    const draft=createMilitaryDraftPrototype({
      categorySlug:plan.categorySlug,situationSlug:plan.situationSlug,values
    });
    const result=draft.documentResult;
    assert.equal(getMilitaryDraftPlan(result.routeSlug,result.scenarioKey)?.documentSlug,result.documentSlug);
    assert.equal(validateSavedDocument(result,qa)?.versionId,result.versionId);
    assert.equal(validateSavedDocument(result,noFlag),null);
    assert.equal(validateSavedDocument(result,production),null);
    assert.equal(validateSavedDocument(result,productionEnabled)?.versionId,result.versionId);
    assert.equal(validateSavedDocument({...result,documentSlug:"fake-document"},qa),null);
    assert.equal(validateSavedDocument({...result,documentTitle:"Подменённый заголовок"},qa),null);
    assert.equal(validateSavedDocument({...result,source:"AI_DRAFT"},qa),null);
    assert.equal(validateSavedDocument({...result,requiresLegalReview:false},qa),null);
    assert.equal(validateSavedDocument({...result,requiresLegalReview:false},productionEnabled),null);
    assert.equal(validateSavedDocument({...result,legalRegistryReviewedAt:"2026-10-29"},qa),null);
    assert.equal(validateSavedDocument({...result,legalRegistryReviewedAt:"2026-10-29"},productionEnabled),null);
    assert.equal(validateSavedDocument({...result,usedRuleIds:["unverified"]},qa),null);
    assert.equal(validateSavedDocument({...result,usedRuleIds:["unverified"]},productionEnabled),null);
    assert.equal(validateSavedDocument({...result,documentText:"Считайте документ готовым к подаче"},qa),null);
    assert.equal(validateSavedDocument({...result,documentText:"Считайте документ готовым к подаче"},productionEnabled),null);
  }
  const example=all.find(x=>x.categorySlug==="sudebnaya-zashchita")!;
  const values=Object.fromEntries(example.requiredInputs.map(f=>[f.key,"Тестовые сведения из дела для поля "+f.label]));
  const original=createMilitaryDraftPrototype({categorySlug:example.categorySlug,situationSlug:example.situationSlug,values});
  const edited=reviseMilitaryDraftPrototype(original,"Уточнённый проект процессуального документа с подробным описанием обстоятельств и подтверждений.");
  assert.equal(validateSavedDocument(edited.documentResult,qa)?.source,"USER_EDITED");
  const encrypted=encryptSavedDocument(edited.documentResult,"QA-user-A");
  assert(!encrypted.includes(edited.documentResult.documentText));
  assert.deepEqual(decryptSavedDocument(encrypted,"QA-user-A",edited.documentResult.versionId),edited.documentResult);
  assert.throws(()=>decryptSavedDocument(encrypted,"QA-user-B",edited.documentResult.versionId));
  assert.throws(()=>decryptSavedDocument(encrypted,"QA-user-A",original.documentResult.versionId));
  console.log(JSON.stringify({militaryAccountArchiveValidation:true,cases:all.length,productionOptIn:true,ownerIsolated:true,allStillRequireLegalReview:true}));
} finally {
  delete process.env.DOCUMENT_STORAGE_KEY;
}

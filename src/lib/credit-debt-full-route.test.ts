import assert from "node:assert/strict";
import { CREDIT_DEBT_GROUPS,CREDIT_DEBT_PUBLICATION_GATE } from "@/data/credit-debt-route-plan";
import {
  evaluateCreditDebtSkeleton,getCreditDebtSkeletonGroups,
  getCreditDebtSkeletonSpec,getCreditDebtSkeletonSituation
} from "./credit-debt-full-route";
import { isCreditDebtPreviewEnabled } from "./credit-debt-preview-access";

assert.equal(isCreditDebtPreviewEnabled({NODE_ENV:"production",ENABLE_CREDIT_DEBT_PREVIEW:"true"}),false);
assert.equal(isCreditDebtPreviewEnabled({NODE_ENV:"development",ENABLE_CREDIT_DEBT_PREVIEW:"false"}),false);
assert.equal(isCreditDebtPreviewEnabled({NODE_ENV:"development",ENABLE_CREDIT_DEBT_PREVIEW:"true"}),true);
assert.equal(getCreditDebtSkeletonGroups().length,10);
assert.equal(CREDIT_DEBT_PUBLICATION_GATE.publicUrlsEnabled,false);

const keys=new Set<string>();
let checked=0, bankruptcy=0, emergency=0,linked=0;
for(const group of CREDIT_DEBT_GROUPS){
  for(const situation of group.situations){
    const id=group.id+"/"+situation.id;
    assert.ok(!keys.has(id),"Duplicate "+id);
    keys.add(id);
    assert.equal(getCreditDebtSkeletonSituation(group.id,situation.id),situation);
    const spec=getCreditDebtSkeletonSpec(group.id,situation.id);
    assert.ok(spec,id);
    assert.equal(spec.groupTitle,group.title);
    assert.equal(spec.situationTitle,situation.title);
    assert.equal(spec.publicationEnabled,false);
    assert.equal(spec.documentGenerationAllowed,false);
    assert.ok(spec.sourceCandidates.length>=2);
    assert.ok(spec.sourceCandidates.every(x=>new URL(x.url).protocol==="https:"));
    assert.equal(spec.fields.length,new Set(spec.fields.map(x=>x.key)).size,id);
    const empty=evaluateCreditDebtSkeleton(spec,{});
    assert.equal(empty.filingReady,false);
    assert.equal(empty.canGenerateDocument,false);
    assert.equal(empty.documentText,null);
    assert.equal(empty.requiresLegalVerification,true);
    const urgent=["SAFETY_ESCALATION","FRAUD_REFERRAL"].includes(situation.targetResult);
    if(urgent){
      emergency++;
      assert.equal(empty.status,"URGENT_SAFETY_FIRST");
      assert.equal(empty.missing.length,0);
    }else{
      assert.ok(empty.missing.length>=6,id);
      assert.ok(spec.fields.length>=7,id);
      const complete:Record<string,string>={};
      for(const field of spec.fields){
        complete[field.key]=field.kind==="choice"?(field.choices?.find(x=>x!=="да")??field.choices?.[0]??""):
          field.kind==="date"?"2026-11-10":"Синтетический ответ только для теста";
      }
      if(group.id==="collectors")complete.threatsNow="нет";
      const review=evaluateCreditDebtSkeleton(spec,complete);
      assert.equal(review.missing.length,0,id);
      assert.equal(review.invalid.length,0,id);
      assert.equal(review.complete,true,id);
      assert.equal(review.canGenerateDocument,false);
      assert.equal(review.filingReady,false);
      if(group.id==="bankruptcy"){
        bankruptcy++;
        assert.ok(spec.fields.some(x=>x.key==="bankruptcyPath"),id);
        assert.ok(review.checklist.some(x=>x.toLowerCase().includes("банкротств")),id);
      }
      const invalid=evaluateCreditDebtSkeleton(spec,{...complete,role:"неверный статус"});
      assert.ok(invalid.invalid.includes("role"),id);
    }
    if(situation.crossLinkArea)linked++;
    checked++;
  }
}
assert.equal(checked,60);
assert.equal(bankruptcy,8);
assert.equal(linked,8);
assert.ok(emergency>=4);
assert.equal(getCreditDebtSkeletonSituation("bad","bad"),null);
assert.equal(getCreditDebtSkeletonSpec("bad","bad"),null);
console.log(`Credit/debt 10x60 skeleton PASS: ${checked} cases, ${bankruptcy} bankruptcy, ${emergency} urgent, ${linked} links; all gated, zero filing-ready.`);

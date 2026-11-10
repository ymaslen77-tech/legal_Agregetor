import assert from "node:assert/strict";
import {
  CREDIT_DEBT_STAGE_ONE_GROUP_IDS, evaluateCreditDebtStageOne,
  getCreditDebtIntakeSpec, getCreditDebtStageOneGroups
} from "./credit-debt-stage-one";
import { CREDIT_DEBT_PUBLICATION_GATE, CREDIT_DEBT_GROUPS } from "@/data/credit-debt-route-plan";

const groups=getCreditDebtStageOneGroups();
assert.equal(groups.length,6);
assert.deepEqual(groups.map(g=>g.id),CREDIT_DEBT_STAGE_ONE_GROUP_IDS);
const stageOneCaseCount=groups.reduce((n,g)=>n+g.situations.length,0);
assert.equal(stageOneCaseCount,35);
assert.equal(CREDIT_DEBT_GROUPS.reduce((n,g)=>n+g.situations.length,0),60);
assert.equal(CREDIT_DEBT_PUBLICATION_GATE.publicNavigatorEnabled,false);
assert.equal(CREDIT_DEBT_PUBLICATION_GATE.publicUrlsEnabled,false);
assert.equal(CREDIT_DEBT_PUBLICATION_GATE.documentGenerationAllowed,false);

let evaluated=0,urgentCases=0,crossLinks=0;
for(const group of groups){
  for(const situation of group.situations){
    const spec=getCreditDebtIntakeSpec(group.id,situation.id);
    assert.ok(spec,group.id+"/"+situation.id);
    assert.equal(spec.groupTitle,group.title);
    assert.equal(spec.situationTitle,situation.title);
    assert.equal(spec.publicationEnabled,false);
    assert.equal(spec.documentGenerationAllowed,false);
    assert.equal(spec.linkedArea,situation.crossLinkArea);
    assert.ok(spec.sourceCandidates.length>=2);
    assert.ok(spec.sourceCandidates.every(s=>new URL(s.url).protocol==="https:"));
    const fields=spec.fields;
    assert.equal(new Set(fields.map(f=>f.key)).size,fields.length);
    assert.ok(fields.every(f=>f.label.length>8));
    assert.ok(fields.every(f=>f.kind!=="choice"||Boolean(f.choices?.length)));
    const empty=evaluateCreditDebtStageOne(spec,{});
    assert.equal(empty.filingReady,false);
    assert.equal(empty.documentText,null);
    assert.equal(empty.canGenerateDocument,false);
    assert.equal(empty.requiresLegalVerification,true);
    const urgent=["SAFETY_ESCALATION","FRAUD_REFERRAL"].includes(situation.targetResult);
    if(urgent){
      urgentCases++;
      assert.equal(spec.fields.length,0);
      assert.equal(empty.status,"URGENT_SAFETY_FIRST");
      assert.equal(empty.complete,false);
      assert.equal(empty.missing.length,0);
    }else{
      assert.ok(spec.fields.length>=8);
      assert.ok(empty.missing.length>=8);
      assert.equal(empty.status,situation.targetResult==="CROSS_LINK"?"SPECIALIST_ROUTE":"NEEDS_DETAILS");
      const full:Record<string,string>={};
      for(const field of spec.fields) {
        full[field.key]=field.kind==="choice"?(field.choices?.[0]??""):
          field.kind==="date"?"2026-11-10":"Сведения для тестирования без реальных персональных данных";
      }
      if(group.id==="collectors")full.threatsNow="нет";
      const complete=evaluateCreditDebtStageOne(spec,full);
      assert.equal(complete.missing.length,0);
      assert.equal(complete.invalid.length,0);
      assert.equal(complete.complete,true);
      assert.equal(complete.status,situation.targetResult==="CROSS_LINK"?"SPECIALIST_ROUTE":"CHECKLIST_ONLY");
      assert.equal(complete.canGenerateDocument,false);
      assert.equal(complete.filingReady,false);
      const withBadValue={...full,role:"неизвестный статус"};
      const wrong=evaluateCreditDebtStageOne(spec,withBadValue);
      assert.ok(wrong.invalid.includes("role"));
      assert.equal(wrong.canGenerateDocument,false);
      if(group.id==="court-debt"){
        const invalid=evaluateCreditDebtStageOne(spec,{...full,receiptDate:"2026-02-30"});
        assert.ok(invalid.invalid.includes("receiptDate"));
        assert.equal(invalid.complete,false);
      }
      if(group.id==="collectors"){
        const threatened=evaluateCreditDebtStageOne(spec,{...full,threatsNow:"да"});
        assert.equal(threatened.status,"URGENT_SAFETY_FIRST");
        assert.equal(threatened.filingReady,false);
      }
    }
    if(situation.crossLinkArea)crossLinks++;
    evaluated++;
  }
}
assert.equal(evaluated,35);
assert.ok(urgentCases>=2);
assert.ok(crossLinks>=3);
assert.equal(getCreditDebtIntakeSpec("not-a-group","missing"),null);
assert.equal(getCreditDebtIntakeSpec("bankruptcy","bankruptcy-court"),null);
assert.equal(getCreditDebtIntakeSpec("court-debt","not-a-case"),null);
console.log(`Credit/debt stage-one QA PASS: ${evaluated} situations, ${urgentCases} urgent, ${crossLinks} cross links; invalid dates/choices, mandatory facts, and no-publication gate verified.`);

import assert from "node:assert/strict";
import { CREDIT_DEBT_GROUPS } from "@/data/credit-debt-route-plan";
import { CREDIT_DEBT_DOCUMENT_TARGETS,getCreditDebtDocumentTarget } from "@/data/credit-debt-document-targets";
import { getCreditDebtDocumentPlan,listCreditDebtDocumentPlans,
  createCreditDebtDraftPrototype,reviseCreditDebtDraft,isCreditDebtDraftResult,
  addCreditDebtDocumentVersion,CREDIT_DEBT_GENERATOR_VERSION
} from "@/lib/credit-debt-document-core";
import { validateCreditDebtExport,creditDebtFileName } from "@/lib/credit-debt-document-export";
import { validateSavedDocument } from "@/lib/saved-document-validation";
import { documentResultSchema } from "@/lib/document-result-contract";

assert.equal(CREDIT_DEBT_DOCUMENT_TARGETS.length,60);
assert.equal(listCreditDebtDocumentPlans().length,60);
assert.equal(new Set(CREDIT_DEBT_DOCUMENT_TARGETS.map(x=>x.key)).size,60);
const ids=new Set<string>();
let draftCount=0,infoCount=0,bankruptcy=0;
const dev={NODE_ENV:"development",ENABLE_CREDIT_DEBT_PREVIEW:"true"};
const prod={NODE_ENV:"production",ENABLE_CREDIT_DEBT_PREVIEW:"true"};
for(const group of CREDIT_DEBT_GROUPS){
  for(const situation of group.situations){
    const key=group.id+"/"+situation.id;
    const target=getCreditDebtDocumentTarget(group.id,situation.id);
    const plan=getCreditDebtDocumentPlan(group.id,situation.id);
    assert.ok(target,key);
    assert.ok(plan,key);
    assert.equal(plan.title,situation.title);
    assert.equal(plan.target.key,key);
    assert.equal(plan.target.targetResult,situation.targetResult);
    assert.equal(plan.filingReady,false);
    assert.equal(plan.legalRegistryReviewedAt,null);
    assert.ok(plan.inputs.every(x=>x.label.length>15));
    assert.equal(new Set(plan.inputs.map(x=>x.key)).size,plan.inputs.length);
    const values:Record<string,string>={};
    for(const f of plan.inputs) values[f.key]=f.required?
      "Синтетические реквизиты и факты для проверки генератора, без персональных данных":
      "";
    const result=createCreditDebtDraftPrototype({
      groupId:group.id,situationId:situation.id,values,
      versionId:"11111111-1111-4111-8111-111111111111",
      createdAt:"2026-11-10T12:00:00.000Z"
    });
    const doc=result.documentResult;
    const parsed=documentResultSchema.parse(doc);
    assert.equal(doc.categorySlug,"kredity-dolgi");
    assert.equal(doc.generatorVersion,CREDIT_DEBT_GENERATOR_VERSION);
    assert.equal(doc.documentSlug,plan.documentSlug);
    assert.equal(doc.documentTitle,plan.title);
    assert.equal(doc.versionId,parsed.versionId);
    assert.ok(doc.documentText.includes(situation.title),key);
    assert.ok(doc.documentText.includes(target.objective),key);
    assert.ok(doc.documentText.includes("Индивидуальная юридическая проверка:") ||
      doc.documentText.includes("Юридическая проверка данной ситуации:") ||
      doc.resultKind==="URGENT_INSTRUCTION",key);
    assert.equal(doc.filingReady,false);
    assert.equal(doc.requiresLegalReview,true);
    assert.equal(doc.legalRegistryReviewedAt,null);
    assert.deepEqual(doc.usedRuleIds,[]);
    assert.deepEqual(doc.placeholders,[]);
    assert.ok(isCreditDebtDraftResult(doc),key);
    assert.ok(doc.documentText.length>200,key);
    if(plan.target.targetResult==="CLAIM_DRAFT"){
      assert.ok(plan.inputs.some(f=>f.key==="counterparty"&&f.required),key);
      assert.ok(plan.inputs.some(f=>f.key==="disputedAmount"&&f.required),key);
      assert.ok(plan.inputs.some(f=>f.key==="proceduralDate"&&f.required),key);
      assert.ok(doc.documentText.includes("ВНИМАНИЕ: до подачи иска"),key);
      assert.ok(doc.documentText.includes("ПРОЕКТ ИСКОВОГО ЗАЯВЛЕНИЯ"),key);
    }
    if(plan.target.targetResult==="OBJECTION_DRAFT"){
      assert.ok(plan.inputs.some(f=>f.key==="counterparty"&&f.required),key);
      assert.ok(plan.inputs.some(f=>f.key==="proceduralDate"&&f.required),key);
      assert.ok(doc.documentText.includes("ВНИМАНИЕ: по статьям 128–129 ГПК РФ"),key);
      assert.ok(doc.documentText.includes("Подача поздних возражений не гарантирует их принятия"),key);
    }
    if(plan.resultKind==="DRAFT"){
      assert.ok(doc.documentText.includes("Излагаю обстоятельства для проверки"),key);
      assert.ok(doc.documentText.includes("Фактические обстоятельства:"),key);
      draftCount++;
      assert.ok(doc.documentText.startsWith("ПРОЕКТ ОБРАЩЕНИЯ — НЕ ГОТОВ К ПОДАЧЕ"));
      assert.ok(doc.documentText.includes("ПРОШУ:"));
      assert.ok(doc.documentText.includes("Дата:"));
      assert.ok(doc.documentText.includes("Подпись:"));
    } else {
      infoCount++;
      assert.ok(!doc.documentText.includes("ПРОШУ:"),key);
      assert.notEqual(doc.resultKind,"DRAFT");
    }
    assert.deepEqual(validateSavedDocument(doc,prod),doc,"Production archive accepts strictly non-filing drafts");
    assert.deepEqual(validateSavedDocument(doc,dev),doc);
    assert.equal(validateSavedDocument({...doc,filingReady:true},dev),null);
    assert.equal(validateSavedDocument({...doc,filingReady:true},prod),null);
    assert.equal(validateSavedDocument({...doc,usedRuleIds:["invented-rule"]},dev),null);
    assert.equal(validateSavedDocument({...doc,legalRegistryReviewedAt:"2026-11-10"},dev),null);
    assert.equal(validateSavedDocument({...doc,documentSlug:"wrong"},dev),null);
    assert.equal(validateCreditDebtExport(doc),doc);
    assert.match(creditDebtFileName(doc,"pdf"),/\.pdf$/);
    assert.match(creditDebtFileName(doc,"docx"),/\.docx$/);
    if(plan.inputs.some(f=>f.required)){
      const missing={...values};
      const required=plan.inputs.find(f=>f.required)!;
      missing[required.key]="";
      assert.throws(()=>createCreditDebtDraftPrototype({groupId:group.id,situationId:situation.id,values:missing}),/обязательное поле/);
    }
    const revised=reviseCreditDebtDraft(result,doc.documentText+"\nНовая фактическая деталь для проверки.",{
      versionId:"22222222-2222-4222-8222-222222222222",createdAt:"2026-11-10T13:00:00.000Z"
    });
    assert.notEqual(revised.documentResult.versionId,doc.versionId);
    assert.equal(revised.documentResult.source,"USER_EDITED");
    assert.equal(revised.documentResult.resultKind,doc.resultKind);
    assert.equal(revised.documentResult.filingReady,false);
    assert.ok(isCreditDebtDraftResult(revised.documentResult),key);
    assert.equal(validateSavedDocument(revised.documentResult,dev)?.versionId,revised.documentResult.versionId);
    const versions=addCreditDebtDocumentVersion([],result);
    const next=addCreditDebtDocumentVersion(versions,revised);
    assert.equal(next.length,2);
    assert.equal(next[1].documentResult.documentText,doc.documentText);
    assert.equal(next[0].documentResult.versionId,revised.documentResult.versionId);
    ids.add(doc.documentSlug);
    if(group.id==="bankruptcy"){
      bankruptcy++;
      assert.ok(!doc.documentText.includes("гарантированное списание"));
      if(situation.id==="out-of-court-mfc")assert.equal(doc.resultKind,"CHECKLIST");
      if(situation.id==="bankruptcy-court")assert.equal(doc.resultKind,"CHECKLIST");
    }
  }
}
const intakeSnapshotPlan=getCreditDebtDocumentPlan("contract-terms","early-repayment");
assert.ok(intakeSnapshotPlan);
const factValues=Object.fromEntries(intakeSnapshotPlan.inputs.map(f=>[f.key,
  f.required?"Синтетическое значение для отдельной проверки версии":"" ]));
const beforeIntake=createCreditDebtDraftPrototype({
  groupId:"contract-terms",situationId:"early-repayment",values:factValues,
  intakeValues:{summary:"Первая синтетическая история платежа"}
});
const afterIntake=createCreditDebtDraftPrototype({
  groupId:"contract-terms",situationId:"early-repayment",values:factValues,
  intakeValues:{summary:"Исправленная синтетическая история платежа"}
});
assert.match(beforeIntake.documentResult.documentText,/Первая синтетическая история платежа/);
assert.match(afterIntake.documentResult.documentText,/Исправленная синтетическая история платежа/);
assert.ok(!afterIntake.documentResult.documentText.includes("Первая синтетическая история платежа"));
assert.equal(ids.size,60);
assert.equal(bankruptcy,8);
assert.ok(draftCount>=20);
assert.ok(infoCount>=20);
assert.equal(getCreditDebtDocumentPlan("bad","case"),null);
assert.equal(getCreditDebtDocumentTarget("bankruptcy","bad"),null);
assert.equal(isCreditDebtDraftResult({foo:"bar"}),false);
console.log(`Credit-debt 60 document outcomes PASS: ${draftCount} draft and ${infoCount} non-filing informational, 8 bankruptcy, versions, export and archive opt-in safeguards.`);

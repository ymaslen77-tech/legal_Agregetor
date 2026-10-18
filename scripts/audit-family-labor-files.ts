/**
 * Binary export acceptance for ALL 30 non-emergency family/labor additions.
 * Only synthetic data. NEVER grants filing approval or legal accuracy.
 */
import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { FAMILY_LABOR_PLANS } from "@/data/family-labor-route-expansion";
import { createFamilyLaborDocument } from "@/lib/family-labor-document-result";
import { createFamilyLaborPdfBlob } from "@/lib/family-labor-pdf";
import { buildGeneratedDocumentDocxBlob } from "@/lib/document-export";
import { validateSavedDocument } from "@/lib/saved-document-validation";
import { SUPPORTED_PROVISIONAL_DRAFTS } from "@/lib/family-labor-provisional-draft";

async function main(): Promise<void> {
const outDir = "artifacts/family-labor-file-audit";
mkdirSync(outDir, { recursive: true });
type Row = {
  scenario: string; resultKind: string;
  pdfBytes: number; docxBytes: number;
  pdfPath: string; docxPath: string;
  filingReady: false; legalReviewedAt: null;
};
const rows: Row[] = [];
const versionId="11111111-1111-4111-8111-111111111111";
const createdAt="2026-10-18T08:00:00.000Z";
for (const plan of FAMILY_LABOR_PLANS) {
  if (plan.kind==="CROSS_AREA_LINK") continue;
  for (const scenario of plan.scenarios) {
    if (scenario.emergencyFirst) continue;
    const input: Record<string,string>={};
    for (const field of plan.fields) {
      input[field.key]=field.options
        ? field.options.includes("нет") ? "нет" : field.options[0] ?? ""
        : "Обезличенные сведения для автоматического теста";
    }
    input.role="заявитель";
    if(plan.id==="alimony-order-objections") {input.roleInOrder="должник";input.isLate="нет";}
    if(plan.id==="unpaid-leave") input.leaveGround="по соглашению сторон";
    if(plan.id==="part-time-hours") input.mandatoryBasis="по соглашению";
    if(plan.id==="maternity-leave") input.leaveType="беременность и роды";
    if(plan.id==="secondary-employment") input.mode="совмещение";
    if(plan.id==="shifts-and-business-trips") input.mode="командировка";
    if(plan.id==="alimony-enforcement") {input.partyStatus="взыскатель";input.proceedingOpened="да";}
    const {result}=createFamilyLaborDocument(plan,scenario.key,input,{versionId,createdAt});
    const key=plan.id+"/"+scenario.key;
    const expected=SUPPORTED_PROVISIONAL_DRAFTS.includes(key as (typeof SUPPORTED_PROVISIONAL_DRAFTS)[number])?"DRAFT":"CHECKLIST";
    assert.equal(result.resultKind,expected,key+" wrong document type");
    assert.equal(result.filingReady,false,key);
    assert.equal(result.requiresLegalReview,true,key);
    assert.equal(result.legalRegistryReviewedAt,null,key);
    assert.equal(result.versionId,versionId,key);
    assert.ok(validateSavedDocument(result),key+" invalid saved-document contract");
    assert.ok(result.documentText.includes("НЕ ГОТОВ К ПОДАЧЕ"),key);
    if(expected==="DRAFT"){
      assert.ok(result.usedRuleIds.length>0,key+" missing traceable legal provisions");
    }else{
      assert.deepEqual(result.usedRuleIds,[],key+" checklist invented legal-rule IDs");
    }
    const pdf=await createFamilyLaborPdfBlob(result);
    const docx=await buildGeneratedDocumentDocxBlob({
      title:result.documentTitle,content:result.documentText,
      fileName:result.documentSlug+"-"+result.versionId+".docx"
    });
    const pdfBuffer=Buffer.from(await pdf.arrayBuffer());
    const docxBuffer=Buffer.from(await docx.arrayBuffer());
    assert.equal(pdfBuffer.subarray(0,5).toString("ascii"),"%PDF-",key+" PDF signature");
    assert.equal(docxBuffer.subarray(0,2).toString("ascii"),"PK",key+" DOCX signature");
    assert.ok(pdfBuffer.byteLength>=1200,key+" PDF is too small");
    assert.ok(docxBuffer.byteLength>=1200,key+" DOCX is too small");
    const base=(plan.id+"-"+scenario.key).replace(/[^a-z0-9_-]/g,"-");
    const pdfPath=join(outDir,base+".pdf"),docxPath=join(outDir,base+".docx");
    writeFileSync(pdfPath,pdfBuffer);
    writeFileSync(docxPath,docxBuffer);
    rows.push({
      scenario:key,resultKind:result.resultKind,
      pdfBytes:pdfBuffer.length,docxBytes:docxBuffer.length,
      pdfPath,docxPath,filingReady:false,legalReviewedAt:null
    });
  }
}
assert.equal(rows.length,30,"expected 30 non-emergency scenarios");
assert.equal(rows.filter(row=>row.resultKind==="DRAFT").length,14);
assert.equal(rows.filter(row=>row.resultKind==="CHECKLIST").length,16);
const summary={
  scope:"BINARY_EXPORT_AND_SAVED_DOCUMENT_CONTRACT_ONLY",
  legalSignOff:"NOT_GRANTED",
  scenarios:rows.length,provisionalDrafts:14,checklists:16,
  emergencyInstructionsExcluded:2,
  passed:rows.length,results:rows
};
writeFileSync(join(outDir,"manifest.json"),JSON.stringify(summary,null,2)+"\n");
console.log("Family/labor PDF/DOCX audit: "+rows.length+"/"+rows.length+
  " exports structurally valid; all flagged NOT READY TO FILE.");

}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});

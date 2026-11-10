import { expect, test, type Page } from "@playwright/test";
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { CREDIT_DEBT_GROUPS } from "../../src/data/credit-debt-route-plan";

/**
 * Acceptance smoke-test all 60 user journeys in a development-only environment.
 * Legal filing readiness is deliberately false; this checks operational coverage,
 * the exact case heading and outcome, not whether a claim is legally justified.
 */
async function fillIntake(page:Page){
  const intake=page.getByTestId("credit-debt-scenario-flow");
  const fields=intake.locator("select,input,textarea");
  const count=await fields.count();
  for(let i=0;i<count;i++){
    const element=fields.nth(i);
    if(await element.evaluate(node=>node.tagName==="SELECT")){
      const choices=await element.locator("option").evaluateAll(nodes=>
        nodes.map(x=>(x as HTMLOptionElement).value).filter(x=>x!=="" && x!=="да"));
      expect(choices.length).toBeGreaterThan(0);
      await element.selectOption(choices[0]);
    }else if(await element.getAttribute("type")==="date"){
      await element.fill("2026-11-10");
    }else{
      await element.fill("Тестовые обстоятельства и даты без персональных финансовых сведений");
    }
  }
  await intake.getByRole("button",{name:count?"Продолжить — проверить сведения":"Показать первоочередные действия"}).click();
  const result=page.getByTestId("credit-debt-result");
  await expect(result).toBeVisible();
  await expect(result).not.toContainText("Нужны уточнения");
}
async function fillDocument(page:Page){
  const form=page.getByTestId("credit-debt-draft-form");
  const inputs=form.locator("textarea");
  for(let i=0;i<await inputs.count();i++){
    const element=inputs.nth(i);
    const field=await element.getAttribute("data-field-key");
    if(field==="recipient")await element.fill("Условный адресат, компетенция требует проверки");
    else if(field==="applicant")await element.fill("Условный заявитель без персональных данных");
    else if(field==="facts")await element.fill("Обстоятельства синтетического тестового спора по кредиту, без паспортных сведений и реального номера договора.");
    else if(field==="specificFacts")await element.fill("Сведения по ситуации для проверки текста и структуры документа.");
    else if(field==="attachments")await element.fill("Условные копии платежных документов");
    else await element.fill("Синтетические сведения для теста, без личных данных");
  }
  await form.locator('button[type="submit"]').click();
}

test("60 distinct credit/debt and bankruptcy outcomes: end-to-end intake, generation and non-filing PDF actions", async ({page})=>{
  test.setTimeout(1_000_000);
  let completed=0,drafts=0,nonDrafts=0,urgent=0;
  for(const group of CREDIT_DEBT_GROUPS){
    for(const situation of group.situations){
      const path=`/kredity-dolgi/${group.id}/${situation.id}/`;
      const result=await page.goto(path,{waitUntil:"domcontentloaded"});
      expect(result?.status(),path).toBe(200);
      await expect(page.getByRole("heading",{level:1,name:situation.title})).toBeVisible();
      await fillIntake(page);
      const form=page.getByTestId("credit-debt-draft-form");
      await expect(form).toBeVisible();
      await fillDocument(page);
      const text=await page.getByTestId("credit-debt-document-editor").inputValue();
      expect(text,path).toContain(situation.title);
      const action=page.getByTestId("credit-debt-final-actions");
      await expect(action.getByRole("button",{name:"Скачать PDF"})).toBeEnabled();
      await expect(action.getByRole("button",{name:"Отправить на проверку юристу"})).toBeEnabled();
      const downloaded=page.waitForEvent("download");
      await action.getByRole("button",{name:"Скачать PDF"}).click();
      const artifact=await downloaded;
      const file=await artifact.path();
      expect(file,path).toBeTruthy();
      const bytes=readFileSync(file!);
      expect(bytes.subarray(0,5).toString(),path).toBe("%PDF-");
      expect(bytes.length,path).toBeGreaterThan(1200);
      const extracted=execFileSync("pdftotext",[file!,"-"],{encoding:"utf8"})
        .replace(/\\s+/g," ").trim();
      expect(extracted,path).toContain(situation.title);
      expect(extracted.length,path).toBeGreaterThan(100);

      await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content",/noindex/);
      if(["FRAUD_REFERRAL","SAFETY_ESCALATION"].includes(situation.targetResult)){
        urgent++;
        expect(text,path).not.toContain("ПРОШУ:");
      } else if(["REQUEST_DRAFT","COMPLAINT_DRAFT","OBJECTION_DRAFT","CLAIM_DRAFT"].includes(situation.targetResult)){
        drafts++;
        expect(text,path).toContain("НЕ ГОТОВ К ПОДАЧЕ");
        expect(text,path).toContain("ПРОШУ:");
      } else {
        nonDrafts++;
        expect(text,path).not.toContain("ПРОШУ:");
      }
      completed++;
    }
  }
  expect(completed).toBe(60);
  expect(drafts).toBeGreaterThan(20);
  expect(nonDrafts).toBeGreaterThan(15);
  expect(urgent).toBeGreaterThanOrEqual(2);
});

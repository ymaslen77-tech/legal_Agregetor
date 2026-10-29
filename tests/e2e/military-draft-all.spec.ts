import {expect,test} from "@playwright/test";
import {listMilitaryDraftPlans} from "../../src/data/military-document-core";

test.skip(process.env.ENABLE_MILITARY_DRAFT_PREVIEW!=="true",
 "Unreviewed military drafts only run in explicitly enabled local dev QA.");

const plans=listMilitaryDraftPlans();
if(plans.length!==121)throw new Error("Expected 121 military draft plans");

for(const [i,plan] of plans.entries()) {
 test(`Military draft #${String(i+1).padStart(3,"0")}: ${plan.categorySlug}/${plan.situationSlug}`,async({page})=>{
  const errors:string[]=[];
  page.on("pageerror",error=>errors.push(error.message));
  await page.goto(`/voennoe-pravo/${plan.categorySlug}/${plan.situationSlug}/`);
  const form=page.getByTestId("military-draft-workbench");
  await expect(form).toBeVisible();
  await expect(form).toContainText("Черновик, не готовый к подаче");
  await expect(form.locator("[data-field-key]")).toHaveCount(plan.requiredInputs.length);
  for(const field of plan.requiredInputs.filter(x=>x.required)){
    const input=form.locator(`[data-field-key="${field.key}"]`);
    await input.fill("Синтетические данные тестового дела, даты, доказательства: "+field.label+" — 29.10.2026.");
  }
  await form.getByRole("button",{name:"Сформировать черновик"}).click();
  await expect(form.getByLabel("Созданный черновик")).toBeVisible();
  const text=await form.getByTestId("military-draft-editor").inputValue();
  expect(text).toContain("ЧЕРНОВИК — НЕ ГОТОВ К ПОДАЧЕ");
  expect(text).toContain(plan.documentRequest);
  expect(text).not.toContain("undefined");
  await expect(form.getByRole("button",{name:"Скачать PDF-черновик"})).toBeEnabled();
  await expect(form.getByRole("button",{name:"Скачать DOCX-черновик"})).toBeEnabled();
  expect(errors).toEqual([]);
 });
}

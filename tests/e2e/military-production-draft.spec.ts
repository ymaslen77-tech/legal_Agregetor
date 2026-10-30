import {expect,test} from "@playwright/test";
import {MILITARY_TOPICS} from "../../src/data/military-catalog";
import {getMilitaryDraftPlan} from "../../src/data/military-document-core";

test.skip(process.env.CI!=="true" || process.env.ENABLE_MILITARY_PUBLIC_DRAFTS!=="true" ||
  process.env.ENABLE_MILITARY_DRAFT_PREVIEW==="true",
  "Run only in the separate opted-in production build.");
test("production opt-in exposes draft forms in all 20 categories but noindex",async({page})=>{
  const errors:string[]=[];
  page.on("pageerror",error=>errors.push(error.message));
  for(const topic of MILITARY_TOPICS){
    const situation=topic.situations.find(item=>item.kind!=="information")!;
    const plan=getMilitaryDraftPlan(topic.slug,situation.slug)!;
    await page.goto("/voennoe-pravo/"+topic.slug+"/"+situation.slug+"/");
    const form=page.getByTestId("military-draft-workbench");
    await expect(form).toBeVisible();
    await expect(form).toContainText("Черновик, не готовый к подаче");
    await expect(form.locator("[data-field-key]")).toHaveCount(plan.requiredInputs.length);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content",/noindex/);
    await expect(page.locator('a[href$="#military-document-preparation"]').first()).toBeVisible();
  }
  expect(errors).toEqual([]);
});
test("production draft generation and PDF/DOCX remain unapproved",async({page})=>{
  const topic=MILITARY_TOPICS.find(item=>item.slug==="raporty-i-obrashcheniya")!;
  const situation=topic.situations[3];
  const plan=getMilitaryDraftPlan(topic.slug,situation.slug)!;
  await page.goto("/voennoe-pravo/"+topic.slug+"/"+situation.slug+"/");
  const form=page.getByTestId("military-draft-workbench");
  for(const field of plan.requiredInputs.filter(item=>item.required)){
    await form.locator('[data-field-key="'+field.key+'"]').fill("Синтетические обстоятельства дела: "+field.label+" — 29 октября 2026 года.");
  }
  await form.getByRole("button",{name:"Сформировать черновик"}).click();
  await expect(form.getByTestId("military-draft-editor")).toHaveValue(/ЧЕРНОВИК — НЕ ГОТОВ К ПОДАЧЕ/);
  for(const extension of ["pdf","docx"] as const){
    const download=page.waitForEvent("download");
    await form.getByRole("button",{name:extension==="pdf"?"Скачать PDF-черновик":"Скачать DOCX-черновик"}).click();
    expect((await download).suggestedFilename()).toMatch(new RegExp("^proekt-.*\\."+extension+"$"));
  }
});

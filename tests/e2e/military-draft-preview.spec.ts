import {expect,test} from "@playwright/test";
import {MILITARY_TOPICS} from "../../src/data/military-catalog";
import {getMilitaryDraftPlan} from "../../src/data/military-document-core";

test.skip(process.env.ENABLE_MILITARY_DRAFT_PREVIEW!=="true",
  "Unreviewed drafts may be exercised only with ENABLE_MILITARY_DRAFT_PREVIEW=true in a local dev server.");

const examples = [
  {topic:"raporty-i-obrashcheniya",index:3},
  {topic:"denezhnoe-dovolstvie",index:5},
  {topic:"gibel-i-vyplaty-seme",index:5},
  {topic:"samovolnoe-ostavlenie-chasti",index:2},
  {topic:"sudebnaya-zashchita",index:1}
];
for(const example of examples) {
 test("development-only military draft: "+example.topic+" #"+example.index,async({page})=>{
  const topic=MILITARY_TOPICS.find(x=>x.slug===example.topic)!;
  const situation=topic.situations[example.index];
  const plan=getMilitaryDraftPlan(topic.slug,situation.slug)!;
  await page.goto("/voennoe-pravo/"+topic.slug+"/"+situation.slug+"/");
  const workbench=page.getByTestId("military-draft-workbench");
  await expect(workbench).toBeVisible();
  await expect(workbench).toContainText("не готовый к подаче");
  await expect(workbench.locator('[data-field-key]')).toHaveCount(plan.requiredInputs.length);
  for(const input of plan.requiredInputs.filter(f=>f.required)) {
    await workbench.locator('[data-field-key="'+input.key+'"]').fill(
      "Проверенные тестовые факты и реквизиты по делу: "+input.label+" — 29 октября 2026 года."
    );
  }
  await workbench.getByRole("button",{name:"Сформировать черновик"}).click();
  await expect(workbench.getByLabel("Созданный черновик")).toBeVisible();
  await expect(workbench.getByTestId("military-draft-editor")).toHaveValue(/ЧЕРНОВИК — НЕ ГОТОВ К ПОДАЧЕ/);
  expect((await workbench.getByTestId("military-draft-editor").inputValue()).includes(plan.documentRequest)).toBe(true);
  await workbench.getByTestId("military-draft-editor").fill(
    "Исправленный индивидуальный черновик с обстоятельствами дела и уточнённым предметом обращения для тестирования редактора."
  );
  await workbench.getByRole("button",{name:"Сохранить новую версию"}).click();
  await expect(workbench).toContainText("История версий в этой вкладке");
  await expect(workbench.getByTestId("military-draft-editor")).toHaveValue(/ТРЕБУЕТСЯ ЮРИДИЧЕСКАЯ ПРОВЕРКА/);
 });
}
test("informational situation never opens preview form",async({page})=>{
 const topic=MILITARY_TOPICS.find(x=>x.situations.some(s=>s.kind==="information"))!;
 const info=topic.situations.find(s=>s.kind==="information")!;
 await page.goto("/voennoe-pravo/"+topic.slug+"/"+info.slug+"/");
 await expect(page.getByTestId("military-draft-workbench")).toHaveCount(0);
});

test("encrypted cabinet saving is opt-in, version-specific and never a legal approval",async({page})=>{
 const topic=MILITARY_TOPICS.find(x=>x.slug==="raporty-i-obrashcheniya")!;
 const situation=topic.situations[3];
 const plan=getMilitaryDraftPlan(topic.slug,situation.slug)!;
 const captured: Array<{documentResult:Record<string,unknown>}>=[];
 await page.route("**/api/account/documents/**",async route=>{
   if(route.request().method()!=="POST"){await route.continue();return;}
   const body=route.request().postDataJSON() as {documentResult:Record<string,unknown>};
   captured.push(body);
   await route.fulfill({status:201,contentType:"application/json",
     headers:{"Cache-Control":"no-store"},body:JSON.stringify({saved:true,versionId:body.documentResult.versionId})});
 });
 await page.goto("/voennoe-pravo/"+topic.slug+"/"+situation.slug+"/");
 const workbench=page.getByTestId("military-draft-workbench");
 for(const field of plan.requiredInputs.filter(f=>f.required)){
   await workbench.locator('[data-field-key="'+field.key+'"]').fill("Синтетические документы и даты: "+field.label+" 29.10.2026.");
 }
 await workbench.getByRole("button",{name:"Сформировать черновик"}).click();
 await expect(workbench.getByLabel("Созданный черновик")).toBeVisible();
 expect(captured).toHaveLength(0);
 await workbench.getByRole("button",{name:"Сохранить в мои документы"}).click();
 await expect(workbench.getByRole("button",{name:"Версия сохранена"})).toBeVisible();
 expect(captured).toHaveLength(1);
 expect(captured[0].documentResult.categorySlug).toBe("voennoe-pravo");
 expect(captured[0].documentResult.filingReady).toBe(false);
 expect(captured[0].documentResult.requiresLegalReview).toBe(true);
 expect(captured[0].documentResult.usedRuleIds).toEqual([]);
 expect(captured[0].documentResult.legalRegistryReviewedAt).toBe(null);
 await workbench.getByTestId("military-draft-editor").fill(
   "Новая индивидуальная редакция черновика со сведениями по обращению и подтверждающими материалами. Проверена только структура."
 );
 await expect(workbench.getByRole("button",{name:"Версия сохранена"})).toBeDisabled();
 await workbench.getByRole("button",{name:"Сохранить новую версию"}).click();
 await expect(workbench.getByRole("button",{name:"Сохранить в мои документы"})).toBeEnabled();
 await workbench.getByRole("button",{name:"Сохранить в мои документы"}).click();
 await expect(workbench.getByRole("button",{name:"Версия сохранена"})).toBeVisible();
 expect(captured).toHaveLength(2);
 expect(captured[0].documentResult.versionId).not.toBe(captured[1].documentResult.versionId);
 expect(captured[1].documentResult.source).toBe("USER_EDITED");
 expect(captured[1].documentResult.legalRegistryReviewedAt).toBe(null);
});

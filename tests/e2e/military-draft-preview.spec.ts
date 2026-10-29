import {expect,test} from "@playwright/test";
import {MILITARY_TOPICS} from "../../src/data/military-catalog";
import {getMilitaryDraftPlan} from "../../src/data/military-document-core";

test.skip(process.env.CI==="true" || process.env.ENABLE_MILITARY_DRAFT_PREVIEW!=="true",
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
  await expect(workbench.getByTestId("military-draft-editor")).toContainText("ЧЕРНОВИК — НЕ ГОТОВ К ПОДАЧЕ");
  await expect(workbench.getByTestId("military-draft-editor")).toContainText(plan.documentRequest);
  await workbench.getByTestId("military-draft-editor").fill(
    "Исправленный индивидуальный черновик с обстоятельствами дела и уточнённым предметом обращения для тестирования редактора."
  );
  await workbench.getByRole("button",{name:"Сохранить новую версию"}).click();
  await expect(workbench).toContainText("История версий в этой вкладке");
  await expect(workbench.getByTestId("military-draft-editor")).toContainText("ТРЕБУЕТСЯ ЮРИДИЧЕСКАЯ ПРОВЕРКА");
 });
}
test("informational situation never opens preview form",async({page})=>{
 const topic=MILITARY_TOPICS.find(x=>x.situations.some(s=>s.kind==="information"))!;
 const info=topic.situations.find(s=>s.kind==="information")!;
 await page.goto("/voennoe-pravo/"+topic.slug+"/"+info.slug+"/");
 await expect(page.getByTestId("military-draft-workbench")).toHaveCount(0);
});

import { expect, test } from "@playwright/test";
import { MILITARY_TOPICS } from "../../src/data/military-catalog";
import { getMilitaryDraftPlan } from "../../src/data/military-document-core";

test.skip(process.env.CI !== "true" || process.env.ENABLE_MILITARY_PUBLIC_DRAFTS !== "true",
  "Runs only against an opted-in disposable production build");

test("draft is only sent after explicit personal-data and transfer consents", async ({ page }) => {
  const topic = MILITARY_TOPICS.find(x=>x.slug==="raporty-i-obrashcheniya")!;
  const scenario = topic.situations[3];
  const plan = getMilitaryDraftPlan(topic.slug, scenario.slug)!;
  const calls: {type:string;payload:Buffer}[] = [];
  await page.route("**/api/leads/", async route => {
    const req=route.request();
    calls.push({
      type:req.headers()["content-type"]??"",
      payload:req.postDataBuffer()??Buffer.alloc(0)
    });
    await route.fulfill({
      status:200, contentType:"application/json",
      body:JSON.stringify({ok:true,id:"synthetic-review-id",reviewStatus:"AWAITING_LAWYER_ASSIGNMENT",withdrawalToken:"synthetic-withdrawal-token-1234567890123456789"})
    });
  });
  await page.goto(`/voennoe-pravo/${topic.slug}/${scenario.slug}/`);
  const workbench=page.getByTestId("military-draft-workbench");
  for(const field of plan.requiredInputs.filter(x=>x.required)) {
    await workbench.locator(`[data-field-key="${field.key}"]`).fill("Синтетические обстоятельства подтверждены: "+field.label+" от 31.10.2026");
  }
  await workbench.getByRole("button",{name:"Сформировать черновик"}).click();
  expect(calls).toHaveLength(0);
  await workbench.getByTestId("military-send-to-lawyer").click();
  await expect(workbench.getByTestId("military-review-form")).toBeVisible();
  expect(calls).toHaveLength(0);
  const review=workbench.getByTestId("military-review-form");
  await review.getByLabel("Как к вам обращаться").fill("Тестовый заявитель");
  await review.getByLabel("Телефон для ответа").fill("+79990000000");
  await review.getByLabel(/Согласен на обработку/).check();
  await review.getByLabel(/Отдельно согласен на передачу/).check();
  await review.getByRole("button",{name:"Подтвердить и отправить на проверку"}).click();
  await expect(workbench.getByText("Заявка принята платформой и ожидает назначения юриста.")).toBeVisible();
  expect(calls).toHaveLength(1);
  expect(calls[0].type).toMatch(/multipart\/form-data/);
  const payload=calls[0].payload.toString("latin1");
  expect(payload).toContain("%PDF-");
  expect(payload).toContain('name="sourceType"');
  expect(payload).toContain("DOCUMENT_REVIEW");
  expect(payload).toContain('name="contactTransferConsent"');
  expect(payload).toContain("true");
  expect(payload).toContain('name="attachment"');
  expect(payload).toContain(".pdf");
  expect(payload).not.toContain("DATABASE_URL");
});

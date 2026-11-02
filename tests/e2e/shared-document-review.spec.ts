import { expect, test } from "@playwright/test";

test.skip(process.env.CI !== "true" || process.env.ENABLE_MILITARY_PUBLIC_DRAFTS !== "true",
  "Run on an isolated production build with synthetic data only");

test("family and military routes use the same document review control", async ({ page }) => {
  const captured: Array<{ payload: string; type: string }> = [];
  await page.route("**/api/leads/", async route => {
    captured.push({
      payload: route.request().postDataBuffer()?.toString("latin1") ?? "",
      type: route.request().headers()["content-type"] ?? ""
    });
    await route.fulfill({status:200,contentType:"application/json",
      body:JSON.stringify({ok:true,id:"synthetic-family-review",withdrawalToken:"synthetic-revocation-token-for-testing-only"})});
  });

  await page.goto("/documents/proverka-prava-na-soderzhanie-sovershennoletnego-rebenka/");
  const section = page.locator("#fill-online");
  await section.locator("#family-additive-childAgeStatus").selectOption("yes");
  await section.locator("#family-additive-incapacityConfirmed").selectOption("yes");
  await section.locator("#family-additive-needConfirmed").selectOption("yes");
  await section.locator("#family-additive-studyOnly").selectOption("no");
  await section.getByRole("button",{name:"Сформировать документ",exact:true}).click();

  await expect(section.getByTestId("document-review-button")).toHaveCount(1);
  await section.getByTestId("document-review-button").click();
  const review=section.getByTestId("document-review-form");
  await expect(review).toBeVisible();
  expect(captured).toHaveLength(0);
  await review.getByLabel("Как к вам обращаться").fill("Тестовый заявитель");
  await review.getByLabel("Телефон для ответа").fill("+79990000000");
  await review.getByLabel(/Согласен на обработку/).check();
  await review.getByLabel(/Отдельно согласен на передачу/).check();
  await review.getByRole("button",{name:"Подтвердить и отправить на проверку"}).click();
  await expect(section.getByText("Заявка принята платформой и ожидает назначения юриста.")).toBeVisible();

  expect(captured).toHaveLength(1);
  expect(captured[0].type).toMatch(/multipart\/form-data/);
  expect(captured[0].payload).toContain("DOCUMENT_REVIEW");
  expect(captured[0].payload).toContain("%PDF-");
  expect(captured[0].payload).toContain('name="structuredPayload"');
  expect(captured[0].payload).not.toContain("DATABASE_URL");
});

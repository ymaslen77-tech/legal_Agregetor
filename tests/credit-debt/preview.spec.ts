import { test, expect } from "@playwright/test";

test("35-situation development preview: incomplete, completed checklist, and explicit revision",async ({page})=>{
  const response=await page.goto("/dev/credit-debt/");
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("heading",{name:/Кредиты, долги и банкротство/})).toBeVisible();
  await expect(page.getByText(/внутреннее тестирование 35 ситуаций/)).toBeVisible();
  await page.getByRole("button",{name:/Проверить заполненность/}).click();
  await expect(page.getByText("NEEDS_DETAILS")).toBeVisible();
  await expect(page.getByText("Недостающие сведения")).toBeVisible();

  const fields=page.locator('section[aria-label="Тестовая анкета"] select,section[aria-label="Тестовая анкета"] input,section[aria-label="Тестовая анкета"] textarea');
  const n=await fields.count();
  expect(n).toBeGreaterThanOrEqual(10);
  for(let i=0;i<n;i++){
    const f=fields.nth(i);
    if(await f.evaluate(node=>node.tagName==="SELECT")){
      const values=await f.locator("option").evaluateAll(options=>options.map(x=>(x as HTMLOptionElement).value).filter(Boolean));
      await f.selectOption(values[0]);
    } else if(await f.getAttribute("type")==="date"){
      await f.fill("2026-11-10");
    } else {
      await f.fill("Тестовое описание без персональных данных и банковских реквизитов");
    }
  }
  await page.getByRole("button",{name:/Проверить заполненность/}).click();
  await expect(page.getByText("CHECKLIST_ONLY")).toBeVisible();
  await expect(page.getByText(/Версия проверки № 2/)).toBeVisible();
  await expect(page.getByText(/Нельзя.*автоматическ|Не является юридическим заключением/)).toBeVisible();

  await page.locator('textarea[name="summary"]').fill("Новая тестовая ситуация — изменённое описание");
  await expect(page.getByText(/Старый результат останется неизменным/)).toBeVisible();
  await expect(page.getByText(/Версия проверки № 2/)).toBeVisible();
  await page.getByRole("button",{name:/Проверить заполненность/}).click();
  await expect(page.getByText(/Версия проверки № 3/)).toBeVisible();
});

test("collectors: threats stop document route, no automatic claim",async ({page})=>{
  await page.goto("/dev/credit-debt/");
  await page.locator("#credit-group").selectOption("collectors");
  await page.locator("#credit-situation").selectOption("threats-and-pressure");
  await page.getByRole("button",{name:/Показать безопасные первоочередные действия/}).click();
  await expect(page.getByText("URGENT_SAFETY_FIRST")).toBeVisible();
  await expect(page.getByText(/При непосредственной угрозе жизни/)).toBeVisible();
  await expect(page.getByText(/Документ не создаётся/)).toBeVisible();
});

test("microloan fraud: no personal data intake and no court document",async ({page})=>{
  await page.goto("/dev/credit-debt/");
  await page.locator("#credit-group").selectOption("microloans");
  await page.locator("#credit-situation").selectOption("microloan-not-mine");
  await expect(page.locator('section[aria-label="Тестовая анкета"] input')).toHaveCount(0);
  await page.getByRole("button",{name:/Показать безопасные первоочередные действия/}).click();
  await expect(page.getByText("URGENT_SAFETY_FIRST")).toBeVisible();
  await expect(page.getByText(/не передавайте коды доступа/i)).toBeVisible();
});

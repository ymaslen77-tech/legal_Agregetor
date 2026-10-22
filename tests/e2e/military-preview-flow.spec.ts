import {expect,test} from "@playwright/test";
// The normal production E2E must not open internal preview. A separate CI job starts a protected preview.
test.skip(process.env.MILITARY_PREVIEW!=="1" || process.env.MILITARY_PREVIEW_SCOPE!=="military-feature-preview","Preview-only flow");
test("authenticated-preview-style military generator completes safe four-step journey and versions",async({page})=>{
 test.setTimeout(90_000);
 const response=await page.goto("/internal/military-preview/?route=service-contract&scenario=contract-check");
 expect(response?.status()).toBe(200);
 await expect(page.getByRole("heading",{name:/Военное право — юридические маршруты/})).toBeVisible();
 await expect(page.getByRole("navigation",{name:"Этапы юридического маршрута"})).toBeVisible();
 await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content",/noindex/);
 await expect(page.getByText(/18 сценариев/).first()).toBeVisible();
 await page.getByRole("button",{name:"Перейти к анкете"}).click();
 const form=page.getByRole("region",{name:"Пошаговая анкета"});
 await expect(form).toBeVisible();
 for(const select of await form.locator("select").all()){
  const opts=await select.locator("option").allTextContents();
  const desired=opts.includes("военнослужащий")?"военнослужащий":opts.includes("контракт")?"контракт":
   opts.find(s=>s&&s!=="Выберите значение");
  expect(desired).toBeTruthy();
  await select.selectOption({label:desired!});
 }
 for(const field of await form.locator("textarea").all())await field.fill("Подтверждённые обезличенные сведения по документам");
 await page.getByRole("button",{name:"Проверить сведения"}).click();
 await expect(page.getByRole("region",{name:"Проверка перед генерацией"})).toBeVisible();
 await page.getByRole("checkbox").check();
 const generate=page.getByRole("button",{name:"Создать предварительную версию"});
 await expect(generate).toBeEnabled();await generate.click();
 const result=page.getByRole("region",{name:"Предварительный результат"});
 await expect(result).toContainText("НЕ ГОТОВ К ПОДАЧЕ");
 await expect(result).toContainText("Индивидуальные вопросы юридической приёмки");
 await expect(result.getByRole("button",{name:"Скачать PDF"})).toBeEnabled();
 await expect(result.getByRole("button",{name:"Скачать DOCX"})).toBeEnabled();
 await result.getByRole("button",{name:"Изменить и создать новую версию"}).click();
 await page.getByRole("button",{name:"Проверить сведения"}).click();
 await page.getByRole("checkbox").check();
 await page.getByRole("button",{name:"Создать предварительную версию"}).click();
 await expect(page.getByRole("region",{name:"Версии сформированного результата"})).toContainText("Версии документа");
 await expect(page.getByRole("button",{name:"Открыть версию"})).toHaveCount(1);
});
test("medical emergency never exposes a generator",async({page})=>{
 const response=await page.goto("/internal/military-preview/?route=military-medical&scenario=medical-emergency");
 expect(response?.status()).toBe(200);
 await expect(page.getByRole("alert")).toContainText("Сначала неотложная помощь");
 await expect(page.getByRole("button",{name:"Перейти к анкете"})).toHaveCount(0);
 await expect(page.getByRole("button",{name:"Создать предварительную версию"})).toHaveCount(0);
});

import {expect,test} from "@playwright/test";

test("full credit/debt route matches existing navigator structure with ten cards",async ({page})=>{
  const r=await page.goto("/kredity-dolgi/");
  expect(r?.status()).toBe(200);
  await expect(page.getByRole("heading",{name:"Кредиты, долги, ипотека и банкротство"})).toBeVisible();
  await expect(page.getByRole("navigation",{name:"Хлебные крошки"})).toBeVisible();
  const cards=page.locator("section[aria-label='Темы кредитов и банкротства'] article");
  await expect(cards).toHaveCount(10);
  await expect(page.getByRole("link",{name:"Посмотреть вопросы (8)"})).toHaveCount(1);
  await expect(page.locator("meta[name='robots']")).toHaveAttribute("content",/noindex/);
  await page.getByRole("link",{name:"Посмотреть вопросы (8)"}).click();
  await expect(page.getByRole("heading",{name:"Банкротство физических лиц"})).toBeVisible();
  await expect(page.locator("section[aria-label='Конкретные ситуации'] article")).toHaveCount(8);
});

test("bankruptcy has its own case, questionnaire and two familiar final buttons",async ({page})=>{
  await page.goto("/kredity-dolgi/bankruptcy/");
  await page.getByRole("link",{name:"Выбрать ситуацию"}).first().click();
  await expect(page.getByTestId("credit-debt-situation")).toBeVisible();
  await expect(page.getByRole("heading",{name:"Краткий правовой ответ"})).toBeVisible();
  await expect(page.getByRole("heading",{name:"Правовые основания и источники"})).toBeVisible();
  await expect(page.getByRole("heading",{name:"Связанные вопросы и следующие действия"})).toBeVisible();
  await page.getByRole("button",{name:"Продолжить — проверить сведения"}).click();
  await expect(page.getByRole("heading",{name:"Нужны уточнения"})).toBeVisible();
  await expect(page.getByRole("button",{name:"Скачать PDF"})).toBeDisabled();
  await expect(page.getByRole("button",{name:"Отправить на проверку юристу"})).toBeDisabled();

  const fields=page.getByTestId("credit-debt-scenario-flow").locator("select,input,textarea");
  expect(await fields.count()).toBeGreaterThanOrEqual(10);
  for(let i=0;i<await fields.count();i++){
    const field=fields.nth(i);
    if(await field.evaluate(el=>el.tagName==="SELECT")){
      const options=await field.locator("option").evaluateAll(items=>
        items.map(x=>(x as HTMLOptionElement).value).filter(v=>v&&v!=="да"));
      await field.selectOption(options[0]);
    }else if(await field.getAttribute("type")==="date")await field.fill("2026-11-10");
    else await field.fill("Тестовое описание без персональных сведений");
  }
  await page.getByRole("button",{name:"Продолжить — проверить сведения"}).click();
  await expect(page.getByRole("heading",{name:"Предварительный чек-лист"})).toBeVisible();
  await expect(page.getByText(/Версия проверки № 2/)).toBeVisible();
  await page.getByRole("button",{name:"Изменить ответы"}).click();
  await page.locator("textarea[name='summary']").fill("Обновлённые условные сведения");
  await expect(page.getByText(/Версия проверки № 2/)).toBeVisible();
  await page.getByRole("button",{name:"Продолжить — проверить сведения"}).click();
  await expect(page.getByText(/Версия проверки № 3/)).toBeVisible();
  await expect(page.getByRole("button",{name:"Скачать PDF"})).toBeDisabled();
});

test("all ten topic groups and sixty situation links resolve without public index",async ({page})=>{
  test.setTimeout(240_000);
  const groups=[
    ["contract-terms",6],["fees-addons",6],["payment-difficulties",6],
    ["microloans",5],["collectors",6],["court-debt",6],
    ["mortgage",6],["history-fraud",6],["guarantors",5],["bankruptcy",8]
  ] as const;
  for(const [slug,expected] of groups){
    const response=await page.goto("/kredity-dolgi/"+slug+"/");
    expect(response?.status(),slug).toBe(200);
    await expect(page.locator("section[aria-label='Конкретные ситуации'] article")).toHaveCount(expected);
    const links=await page.locator("section[aria-label='Конкретные ситуации'] a").evaluateAll(
      nodes=>nodes.map(x=>(x as HTMLAnchorElement).getAttribute("href")).filter(Boolean)
    );
    expect(links.length).toBe(expected);
    for(const href of links){
      const res=await page.request.get(href!);
      expect(res.status(),href!).toBe(200);
      expect(await res.text(),href!).toContain("noindex");
    }
  }
});

test("unknown group or situation has a 404",async ({page})=>{
  expect((await page.goto("/kredity-dolgi/unknown/"))?.status()).toBe(404);
  expect((await page.goto("/kredity-dolgi/bankruptcy/no-such-case/"))?.status()).toBe(404);
});

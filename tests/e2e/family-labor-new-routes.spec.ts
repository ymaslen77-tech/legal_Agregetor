import {expect,test} from "@playwright/test";
import {FAMILY_LABOR_NEW_ROUTES,familyLaborCategory,getFamilyLaborRouteSlug,
  getFamilyLaborDocumentSlug} from "../../src/data/family-labor-implemented-routes";
import {FAMILY_LABOR_PLANS} from "../../src/data/family-labor-route-expansion";

test("all eight new legal routes use one accessible journey and remain noindex",async({page})=>{
  test.setTimeout(180_000);
  for(const plan of FAMILY_LABOR_NEW_ROUTES){
    const url="/problems/"+familyLaborCategory(plan)+"/"+getFamilyLaborRouteSlug(plan)+"/";
    const response=await page.goto(url);
    expect(response?.status(),url).toBe(200);
    const journey=page.getByRole("navigation",{name:"Этапы юридического маршрута"});
    await expect(journey).toHaveCount(1);
    await expect(journey.getByRole("listitem")).toHaveCount(5);
    await expect(page.getByRole("heading",{level:1})).toHaveCount(1);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content",/noindex/);
  }
});
test("sitemaps exclude every new unaccepted legal route and draft document",async({request})=>{
  const [routes,docs]=await Promise.all([
    request.get("/sitemap-problems.xml").then(x=>x.text()),
    request.get("/sitemap-documents.xml").then(x=>x.text())
  ]);
  for(const plan of FAMILY_LABOR_NEW_ROUTES){
    expect(routes).not.toContain("/problems/"+familyLaborCategory(plan)+"/"+getFamilyLaborRouteSlug(plan)+"/");
  }
  for(const plan of FAMILY_LABOR_PLANS){
    for(const scenario of plan.scenarios){
      const slug=getFamilyLaborDocumentSlug(plan,scenario.key);
      if(slug)expect(docs).not.toContain("/documents/"+slug+"/");
    }
  }
});
test("new document pages expose exactly one route journey and noindex",async({page})=>{
  const first=FAMILY_LABOR_NEW_ROUTES.find(x=>x.id==="cohabitation-property");
  expect(first).toBeDefined();
  const doc=getFamilyLaborDocumentSlug(first!,first!.scenarios[0].key);
  expect(doc).toBeTruthy();
  const response=await page.goto("/documents/"+doc+"/");
  expect(response?.status()).toBe(200);
  await expect(page.getByRole("navigation",{name:"Этапы юридического маршрута"})).toHaveCount(1);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content",/noindex/);
});
test("provisional draft forms keep source references, document version and filing guard",async({page})=>{
  test.setTimeout(180_000);
  for(const id of ["alimony-order-objections","unpaid-leave","part-time-hours","hiring-refusal","maternity-leave","secondary-employment","downtime","remote-work","study-leave"]){
    const plan=FAMILY_LABOR_PLANS.find(x=>x.id===id);
    expect(plan).toBeDefined();
    const scenario=({ "maternity-leave":"leave", "secondary-employment":"payment", "downtime":"payment", "remote-work":"conditions", "study-leave":"study" } as Record<string,string>)[id]??plan!.scenarios[0].key;
    const slug=getFamilyLaborDocumentSlug(plan!,scenario);
    expect(slug).toBeTruthy();
    const resp=await page.goto("/documents/"+slug+"/");
    expect(resp?.status()).toBe(200);
    const form=page.getByRole("region",{name:"Пошаговая анкета"});
    await expect(form).toBeVisible();
    for(const select of await form.locator("select").all()){
      const choices=await select.locator("option").allTextContents();
      const choice=choices.find(c=>c==="совмещение")||choices.find(c=>c==="заявитель")||
        choices.find(c=>c==="должник")||
        choices.find(c=>c==="нет")||
        choices.find(c=>c==="беременность и роды")||choices.find(c=>c!=="Выберите значение");
      expect(choice).toBeTruthy();
      await select.selectOption({label:choice!});
    }
    for(const input of await form.locator("textarea").all())await input.fill("Подтверждённые сведения из документов");
    const generate=form.getByRole("button",{name:/Создать новую версию/});
    await expect(generate).toBeEnabled();
    await generate.click();
    const result=form.locator("pre");
    await expect(result).toContainText("ПРОЕКТ — НЕ ГОТОВ К ПОДАЧЕ");
    await expect(result).toContainText("статья");
    await expect(form.getByRole("button",{name:"Скачать PDF"})).toBeEnabled();
    await expect(form.getByRole("button",{name:"Скачать DOCX"})).toBeEnabled();
  }
});


test("new guarded information requests generate source-linked preliminary drafts in a real browser",async({page})=>{
  test.setTimeout(180_000);
  const cases=[
    ["maternity-leave","benefits"],
    ["shifts-and-business-trips","expenses"],
    ["secondary-employment","registration"],
    ["alimony-enforcement","inaction"],
    ["alimony-enforcement","balance"]
  ] as const;
  for(const [planId,scenarioKey] of cases){
    const plan=FAMILY_LABOR_PLANS.find(p=>p.id===planId);
    expect(plan,planId).toBeDefined();
    const slug=getFamilyLaborDocumentSlug(plan!,scenarioKey);
    expect(slug).toBeTruthy();
    const resp=await page.goto("/documents/"+slug+"/");
    expect(resp?.status()).toBe(200);
    const form=page.getByRole("region",{name:"Пошаговая анкета"});
    await expect(form).toBeVisible();
    for(const select of await form.locator("select").all()){
      const options=await select.locator("option").allTextContents();
      const choice=["взыскатель","да","командировка","совместительство",
        "беременность и роды","заявитель","бездействие","нет"]
        .find(x=>options.includes(x))??options.find(x=>x!=="Выберите значение");
      expect(choice,planId+" should have a valid answer option").toBeTruthy();
      await select.selectOption({label:choice!});
    }
    for(const input of await form.locator("textarea").all())
      await input.fill("Обезличенные подтверждённые сведения из документов");
    await form.getByRole("button",{name:/Создать новую версию/}).click();
    const result=form.locator("pre");
    await expect(result).toContainText("ПРОЕКТ — НЕ ГОТОВ К ПОДАЧЕ");
    if(planId==="alimony-enforcement"){
      await expect(result).toContainText("Федеральный закон № 229-ФЗ");
      if(scenarioKey==="inaction")await expect(result).toContainText("не является жалобой");
      else await expect(result).toContainText("не является иском");
    }else{
      await expect(result).toContainText("ТК РФ");
    }
    await expect(form.getByRole("button",{name:"Скачать PDF"})).toBeEnabled();
    await expect(form.getByRole("button",{name:"Скачать DOCX"})).toBeEnabled();
  }
});

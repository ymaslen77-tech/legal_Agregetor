import {expect,test} from "@playwright/test";
import {MILITARY_ROUTES} from "../../src/data/military-route-plans";
import {MILITARY_LEGAL_DOCUMENTS,getMilitaryDocumentsForScenario} from "../../src/data/military-legal-documents";
import {militaryCanonicalRouteHref,militaryPublicDraftHref} from "../../src/lib/military-preview-navigation";

test("all 18 military situations link to named legal documents on dedicated SEO pages",async({page})=>{
 test.setTimeout(180000);
 await page.goto("/voennoe-pravo/");
 await expect(page.getByRole("heading",{level:1,name:"Военное право"})).toBeVisible();
 for(const route of MILITARY_ROUTES){
  const href=militaryCanonicalRouteHref(route.id);
  await expect(page.locator(`a[href="${href}"]`)).toHaveCount(1);
  await page.goto(href);
  await expect(page.getByRole("heading",{level:1,name:route.title})).toBeVisible();
  await expect(page.getByRole("heading",{name:"Выберите ситуацию"})).toBeVisible();
  for(const scenario of route.scenarios){
   const scenarioHref=militaryCanonicalRouteHref(route.id,scenario.key);
   await expect(page.locator(`a[href="${scenarioHref}"]`)).toHaveCount(1);
   const res=await page.goto(scenarioHref);
   expect(res?.status()).toBe(200);
   await expect(page.getByRole("heading",{level:2,name:scenario.title})).toBeVisible();
   if(scenario.kind==="URGENT_INSTRUCTION"){
    await expect(page.getByRole("heading",{name:"Сначала неотложная помощь"})).toBeVisible();
    await expect(page.locator('a[href^="/documents/"]')).toHaveCount(0);
   }else{
    const docs=getMilitaryDocumentsForScenario(scenario.key);
    for(const doc of docs){
     await expect(page.locator(`a[href="/documents/${doc.slug}/#fill-online"]`)).toHaveCount(1);
    }
    await expect(page.getByText("Пошаговая анкета")).toHaveCount(0);
    await expect(page.getByText("Создать новую версию документа")).toHaveCount(0);
   }
   await page.goto(href);
  }
  await page.goto("/voennoe-pravo/");
 }
});

test("all 23 documents publish canonical SEO destination and actual generator",async({page})=>{
 test.setTimeout(180000);
 for(const doc of MILITARY_LEGAL_DOCUMENTS){
  const response=await page.goto("/documents/"+doc.slug+"/");
  expect(response?.status(),doc.slug).toBe(200);
  await expect(page.getByRole("heading",{level:1,name:doc.title})).toBeVisible();
  await expect(page.getByRole("region",{name:"Подготовка юридического документа"})).toBeVisible();
  await expect(page.locator('meta[name="description"]')).toHaveAttribute("content",/воен|рапорт|заявлен|жалоб|исков/i);
  await expect(page.locator('meta[name="robots"]')).not.toHaveAttribute("content",/noindex/);
 }
});

test("downloadable report uses legally necessary fields, regional guide and no form POST",async({page})=>{
 const requests:string[]=[];
 page.on("request",request=>{if(request.method()==="POST")requests.push(request.url());});
 const doc=MILITARY_LEGAL_DOCUMENTS.find(d=>d.scenarioKey==="service-order-copy")!;
 await page.goto(militaryCanonicalRouteHref("service-contract","service-order-copy"));
 await expect(page.getByRole("link",{name:/Сформировать рапорт/})).toBeVisible();
 await page.goto("/documents/"+doc.slug+"/#fill-online");
 const editor=page.getByRole("region",{name:"Подготовка юридического документа"});
 for(const key of doc.fields){
  const input=editor.locator('[id="military-document-'+doc.slug+'-'+key+'"]');
  await input.fill("Подтверждённые сведения заявителя по документу");
 }
 await editor.getByRole("checkbox",{name:/Я проверил введённые сведения/}).check();
 await editor.getByRole("button",{name:/Сформировать рапорт/}).click();
 const result=editor.getByRole("region",{name:"Сформированный юридический документ"});
 await expect(result).toContainText("РАПОРТ");
 await expect(result).toContainText("ПРОШУ");
 await expect(result.getByRole("button",{name:"Скачать PDF"})).toBeEnabled();
 await expect(result.getByRole("button",{name:"Скачать DOCX"})).toBeEnabled();
 const guide=result.getByRole("region",{name:"Памятка после формирования военного документа"});
 await expect(guide.getByRole("heading",{name:"Памятка: что делать с документом дальше"})).toBeVisible();
 await guide.getByLabel("В каком регионе вы находитесь или планируете обращаться?").selectOption("region-moscow");
 await expect(guide.getByText("Выбрано: Москва")).toBeVisible();
 await expect(guide.getByRole("link",{name:/Перейти на портал Минобороны/})).toHaveCount(0);
 await guide.getByRole("checkbox",{name:/Я понимаю, что документ требует/}).check();
 await expect(guide.getByRole("link",{name:/Перейти на портал Минобороны/})).toBeVisible();
 expect(requests).toEqual([]);
});

test("court filing has mandatory court and party requisites and does not claim filing readiness",async({page})=>{
 const doc=MILITARY_LEGAL_DOCUMENTS.find(d=>d.kind==="court"&&d.scenarioKey==="challenge-decision")!;
 await page.goto("/documents/"+doc.slug+"/");
 const editor=page.getByRole("region",{name:"Подготовка юридического документа"});
 for(const key of doc.fields){
  const value=["birthDate","date"].includes(key)?"01.10.2026":"Подтверждённый реквизит по процессуальному документу";
  await editor.locator('[id="military-document-'+doc.slug+'-'+key+'"]').fill(value);
 }
 await editor.getByRole("checkbox",{name:/Я проверил введённые сведения/}).check();
 await editor.getByRole("button",{name:/Сформировать административное исковое заявление/}).click();
 const result=editor.getByRole("region",{name:"Сформированный юридический документ"});
 await expect(result).toContainText("Административный истец:");
 await expect(result).toContainText("Административный ответчик:");
 await expect(result).toContainText("ПРОШУ СУД:");
 await expect(result).toContainText("статьям 125 и 126 КАС РФ");
 await expect(result).toContainText("юридическ");
});

test("legacy URLs redirect to the document-selection route",async({page})=>{
 await page.goto(militaryPublicDraftHref("service-contract","service-order-copy"));
 await expect(page).toHaveURL(/\/voennoe-pravo\/prokhozhdenie-voennoy-sluzhby-po-kontraktu\/\?scenario=service-order-copy/);
 await expect(page.getByRole("link",{name:/Сформировать рапорт/})).toBeVisible();
});

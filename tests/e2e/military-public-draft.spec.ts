import {expect,test} from "@playwright/test";
import {MILITARY_ROUTES} from "../../src/data/military-route-plans";
import {MILITARY_DOCUMENT_BLUEPRINTS,getMilitaryDocumentBlueprint} from "../../src/data/military-document-blueprints";
import {militaryCanonicalRouteHref,militaryPublicDraftHref} from "../../src/lib/military-preview-navigation";

test("all military situations link to their own named legal document page",async({page})=>{
 test.setTimeout(180000);
 await page.goto("/voennoe-pravo/");
 await expect(page.getByRole("heading",{level:1,name:"Военное право"})).toBeVisible();
 for(const route of MILITARY_ROUTES){
  const routeHref=militaryCanonicalRouteHref(route.id);
  await expect(page.locator(`a[href="${routeHref}"]`)).toHaveCount(1);
  await page.goto(routeHref);
  await expect(page.getByRole("heading",{level:1,name:route.title})).toBeVisible();
  await expect(page.getByRole("heading",{name:"Выберите правовую ситуацию"})).toBeVisible();
  for(const scenario of route.scenarios){
   const href=militaryCanonicalRouteHref(route.id,scenario.key);
   await expect(page.locator(`a[href="${href}"]`)).toHaveCount(1);
   const response=await page.goto(href);
   expect(response?.status()).toBe(200);
   await expect(page.getByRole("heading",{level:2,name:scenario.title})).toBeVisible();
   await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content",/noindex/);
   const doc=getMilitaryDocumentBlueprint(scenario.key);
   if(doc){
    await expect(page.locator(`a[href="/documents/${doc.slug}/#fill-online"]`)).toHaveCount(1);
    await expect(page.getByText(doc.title,{exact:true})).toBeVisible();
   }else{
    await expect(page.getByRole("heading",{name:"Неотложная медицинская помощь"})).toBeVisible();
    await expect(page.locator('a[href*="/documents/"]')).toHaveCount(0);
   }
   await expect(page.getByText(/анкета|чек-лист|опросник/iu)).toHaveCount(0);
   await page.goto(routeHref);
  }
  await page.goto("/voennoe-pravo/");
 }
});

test("all 17 SEO document URLs have unique H1, canonical metadata and dedicated inputs",async({page})=>{
 test.setTimeout(180000);
 for(const item of MILITARY_DOCUMENT_BLUEPRINTS){
  const response=await page.goto("/documents/"+item.slug+"/");
  expect(response?.status(),item.slug).toBe(200);
  await expect(page.getByRole("heading",{level:1,name:item.title})).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content",/noindex/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href",new RegExp(item.slug));
  const title=await page.title();
  expect(title).toMatch(/(скачать|PDF)/iu);
  await expect(page.getByRole("region",{name:"Составление юридического документа"})).toBeVisible();
  await expect(page.getByText(/анкета|опросник|чек-лист/iu)).toHaveCount(0);
 }
});

test("legacy links redirect to canonical document-selection scenario",async({page})=>{
 await page.goto(militaryPublicDraftHref("service-contract","service-order-copy"));
 await expect(page).toHaveURL(/\/voennoe-pravo\/prokhozhdenie-voennoy-sluzhby-po-kontraktu\/\?scenario=service-order-copy/);
 await expect(page.getByRole("link",{name:"Сформировать рапорт"})).toBeVisible();
});

test("official military raports generate text, PDF action, region guide and no input posts",async({page})=>{
 const posts:string[]=[];
 page.on("request",request=>{if(request.method()==="POST")posts.push(request.url());});
 const item=getMilitaryDocumentBlueprint("pay-breakdown")!;
 await page.goto("/documents/"+item.slug+"/");
 const doc=page.getByRole("region",{name:"Составление юридического документа"});
 for(const field of await doc.locator('input:not([type="checkbox"]),textarea').all()){
  await field.fill("Сведения, подтверждённые документами");
 }
 await doc.getByRole("checkbox",{name:/Я проверил введённые сведения/}).check();
 await doc.getByRole("button",{name:"Сформировать рапорт"}).click();
 await expect(doc.getByRole("region",{name:"Сформированный юридический документ"})).toContainText(item.title.toUpperCase());
 await expect(doc.getByRole("button",{name:"Скачать PDF"})).toBeEnabled();
 await expect(doc.getByRole("button",{name:"Скачать DOCX"})).toBeEnabled();
 const guide=doc.getByRole("region",{name:"Памятка после формирования военного документа"});
 await expect(guide).toBeVisible();
 await guide.getByLabel("В каком регионе вы находитесь или планируете обращаться?").selectOption("region-moscow");
 await expect(guide.getByText("Выбрано: Москва")).toBeVisible();
 expect(posts).toEqual([]);
});

test("administrative claims have court-specific requisites and block incomplete generation",async({page})=>{
 const item=getMilitaryDocumentBlueprint("inaction")!;
 await page.goto("/documents/"+item.slug+"/");
 const doc=page.getByRole("region",{name:"Составление юридического документа"});
 await expect(doc.getByLabel("Наименование компетентного суда")).toBeVisible();
 await expect(doc.getByLabel("Орган или должностное лицо — административный ответчик")).toBeVisible();
 await expect(doc.getByLabel("Чем подтверждается направление копий другим участникам")).toBeVisible();
 await doc.getByRole("checkbox",{name:/Я проверил введённые сведения/}).check();
 await doc.getByRole("button",{name:"Сформировать административное исковое заявление"}).click();
 await expect(doc.getByRole("status")).toContainText("Для составления документа укажите:");
 await expect(doc.getByRole("region",{name:"Сформированный юридический документ"})).toHaveCount(0);
});

test("emergency situation cannot create a legal document before urgent care",async({page})=>{
 await page.goto(militaryCanonicalRouteHref("military-medical","medical-emergency"));
 await expect(page.getByRole("heading",{name:"Неотложная медицинская помощь"})).toBeVisible();
 await expect(page.getByRole("button",{name:/Сформировать/})).toHaveCount(0);
 await expect(page.getByRole("button",{name:"Скачать PDF"})).toHaveCount(0);
});

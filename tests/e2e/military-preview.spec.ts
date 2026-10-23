import {expect,test} from "@playwright/test";
import {MILITARY_ROUTES} from "../../src/data/military-route-plans";
import {militaryPreviewHref} from "../../src/lib/military-preview-navigation";

/** Run against the built app with BOTH branch-preview flags, not public Production. */
test("@military-preview all military route and scenario pages resolve with noindex and shared journey",async({page})=>{
 test.setTimeout(180_000);
 let seen=0;
 for(const route of MILITARY_ROUTES)for(const scenario of route.scenarios){
  const res=await page.goto(militaryPreviewHref(route.id,scenario.key));
  expect(res?.status(),route.id+"/"+scenario.key).toBe(200);
  await expect(page.getByRole("heading",{name:"Военное право — юридические маршруты"})).toBeVisible();
  await expect(page.getByRole("navigation",{name:"Этапы юридического маршрута"})).toHaveCount(1);
  await expect(page.getByRole("navigation",{name:"Этапы юридического маршрута"}).getByRole("listitem")).toHaveCount(5);
  await expect(page.getByRole("navigation",{name:"Этапы заполнения военного маршрута"})).toHaveCount(0);
  await expect(page.getByRole("heading",{name:"Похожие вопросы"})).toHaveCount(1);
  await expect(page.getByRole("link",{name:new RegExp(scenario.title.slice(0,20))})).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content",/noindex/);
  await expect(page.getByText("ЗАКРЫТЫЙ ПРЕДПРОСМОТР")).toBeVisible();
  seen++;
 }
 expect(seen).toBe(18);
});
test("@military-preview contract document flows through facts, safety checks and versioned preliminary result without archive",async({page})=>{
 const networkPosts:string[]=[];
 page.on("request",request=>{if(request.method()==="POST")networkPosts.push(request.url());});
 await page.goto(militaryPreviewHref("service-contract","service-order-copy"));
 await page.getByRole("button",{name:"Перейти к анкете"}).click();
 const form=page.getByRole("region",{name:"Пошаговая анкета"});
 await expect(form).toBeVisible();
 await form.getByLabel("Кто обращается?").selectOption("военнослужащий");
 await form.getByLabel("Правовой статус и вид службы").selectOption("контракт");
 for(const area of await form.locator("textarea").all())await area.fill("Подтверждённые сведения без личных данных");
 await form.getByRole("button",{name:"Проверить сведения"}).click();
 const audit=page.getByRole("region",{name:"Проверка перед генерацией"});
 await expect(audit).toContainText("Правовые вопросы конкретного сценария");
 const go=audit.getByRole("button",{name:"Создать предварительную версию"});
 await expect(go).toBeDisabled();
 await audit.getByRole("checkbox").check();
 await expect(go).toBeEnabled();
 await go.click();
 const result=page.getByRole("region",{name:"Предварительный результат"});
 await expect(result).toContainText("НЕ ГОТОВ К ПОДАЧЕ");
 await expect(result).toContainText("ID версии:");
 await expect(result.getByRole("button",{name:"Скачать PDF"})).toBeEnabled();
 await expect(result.getByRole("button",{name:"Скачать DOCX"})).toBeEnabled();
 await expect(result.getByRole("button",{name:"Сохранить в мои документы"})).toHaveCount(0);
 expect(networkPosts).toEqual([]);
});
test("@military-preview urgent medical scenario gives help without questionnaire or PDF",async({page})=>{
 await page.goto(militaryPreviewHref("military-medical","medical-emergency"));
 await expect(page.getByRole("heading",{name:"Сначала неотложная помощь"})).toBeVisible();
 await expect(page.getByRole("button",{name:"Перейти к анкете"})).toHaveCount(0);
 await expect(page.getByRole("button",{name:"Скачать PDF"})).toHaveCount(0);
});
test("@military-preview invalid route is safely reset without reflecting private facts",async({page})=>{
 const response=await page.goto("/internal/military-preview/?route=not-found&scenario=bad");
 expect(response?.status()).toBe(200);
 await expect(page.getByText("Неизвестный адрес сценария.",{exact:false})).toBeVisible();
 await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content",/noindex/);
});

test("@military-preview six military routes are readable without horizontal scrolling at phone width",async({page})=>{
 test.setTimeout(120_000);
 await page.setViewportSize({width:320,height:740});
 for(const route of MILITARY_ROUTES){
  await page.goto(militaryPreviewHref(route.id));
  await expect(page.getByRole("heading",{name:"Военное право — юридические маршруты"})).toBeVisible();
  const horizontalOverflow=await page.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+1);
  expect(horizontalOverflow,route.id+" must not overflow 320px width").toBe(false);
 }
});

test("@military-preview route switching updates form and related-question context without reusing previous answers",async({page})=>{
 await page.goto(militaryPreviewHref("service-contract","contract-check"));
 await page.getByRole("link",{name:/Увольнение с военной службы/}).first().click();
 await expect(page.getByRole("navigation",{name:"Этапы юридического маршрута"})).toContainText("Увольнение с военной службы");
 await page.getByRole("link",{name:/Увольнение по состоянию здоровья/}).click();
 await expect(page).toHaveURL(/scenario=medical-discharge/);
 await expect(page.getByRole("heading",{name:"Похожие вопросы"})).toBeVisible();
 await page.getByRole("button",{name:"Перейти к анкете"}).click();
 const form=page.getByRole("region",{name:"Пошаговая анкета"});
 await expect(form).toContainText("Увольнение по состоянию здоровья");
 await expect(form.locator("textarea").first()).toBeEmpty();
});

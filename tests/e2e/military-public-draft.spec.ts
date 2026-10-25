import {expect,test} from "@playwright/test";
import {MILITARY_ROUTES} from "../../src/data/military-route-plans";
import {militaryPublicDraftHref} from "../../src/lib/military-preview-navigation";

test("all 18 military topic links open their correct draft-only intake",async({page})=>{
 test.setTimeout(180000);
 await page.goto("/voennoe-pravo/");
 const scope=page.getByRole("main");
 for(const route of MILITARY_ROUTES){
  for(const scenario of route.scenarios){
   const href=militaryPublicDraftHref(route.id,scenario.key);
   await expect(scope.locator(`a[href="${href}"]`)).toHaveCount(1);
   const res=await page.goto(href);
   expect(res?.status(),href).toBe(200);
   await expect(page.getByRole("heading",{name:"Военное право — юридические маршруты"})).toBeVisible();
   await expect(page.getByRole("heading",{name:"Похожие вопросы"})).toBeVisible();
   await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content",/noindex/);
   await expect(page.getByRole("link",{name:scenario.title})).toHaveAttribute("aria-current","page");
   await page.goto("/voennoe-pravo/");
  }
 }
});

test("military public draft route cannot produce an emergency PDF",async({page})=>{
 await page.goto(militaryPublicDraftHref("military-medical","medical-emergency"));
 await expect(page.getByRole("heading",{name:"Сначала неотложная помощь"})).toBeVisible();
 await expect(page.getByRole("button",{name:"Создать предварительную версию"})).toHaveCount(0);
 await expect(page.getByRole("button",{name:"Скачать PDF"})).toHaveCount(0);
});

test("military public draft route preserves incomplete status and has no persistence",async({page})=>{
 const posts:string[]=[];
 page.on("request",request=>{if(request.method()==="POST")posts.push(request.url());});
 await page.goto(militaryPublicDraftHref("service-contract","service-order-copy"));
 await page.getByRole("button",{name:"Перейти к анкете"}).click();
 const form=page.getByRole("region",{name:"Пошаговая анкета"});
 await form.getByLabel("Кто обращается?").selectOption("военнослужащий");
 await form.getByLabel("Правовой статус и вид службы").selectOption("контракт");
 for(const input of await form.locator("textarea").all()){
   await input.fill("Подтвержденные обезличенные обстоятельства по документам");
 }
 await page.getByRole("button",{name:"Проверить сведения"}).click();
 const audit=page.getByRole("region",{name:"Проверка перед генерацией"});
 await audit.getByRole("checkbox").check();
 await audit.getByRole("button",{name:"Создать предварительную версию"}).click();
 const result=page.getByRole("region",{name:"Предварительный результат"});
 await expect(result).toContainText("НЕ ГОТОВ К ПОДАЧЕ");
 await expect(result.getByRole("button",{name:"Скачать PDF"})).toBeEnabled();
 await expect(result.getByRole("button",{name:"Сохранить в мои документы"})).toHaveCount(0);
 expect(posts).toEqual([]);
});

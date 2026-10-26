import {expect,test} from "@playwright/test";
import {MILITARY_ROUTES} from "../../src/data/military-route-plans";
import {militaryCanonicalRouteHref,militaryPublicDraftHref} from "../../src/lib/military-preview-navigation";

test("all 18 military situations follow family category, situation, questionnaire layout",async({page})=>{
 test.setTimeout(180000);
 await page.goto("/voennoe-pravo/");
 await expect(page.getByRole("heading",{level:1,name:"Военное право"})).toBeVisible();
 for(const route of MILITARY_ROUTES){
  const routeHref=militaryCanonicalRouteHref(route.id);
  await expect(page.locator(`a[href="${routeHref}"]`)).toHaveCount(1);
  await page.goto(routeHref);
  await expect(page.getByRole("heading",{level:1,name:route.title})).toBeVisible();
  await expect(page.getByRole("heading",{name:"Шаг 1. Выберите ситуацию"})).toBeVisible();
  for(const scenario of route.scenarios){
   const href=militaryCanonicalRouteHref(route.id,scenario.key);
   await expect(page.locator(`a[href="${href}"]`)).toHaveCount(1);
   const res=await page.goto(href);
   expect(res?.status(),href).toBe(200);
   await expect(page.getByRole("heading",{level:2,name:scenario.title})).toBeVisible();
   await expect(page.getByRole("heading",{name:"Похожие вопросы"})).toBeVisible();
   await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content",/noindex/);
   await expect(page.getByRole("navigation",{name:"Этапы юридического маршрута"})).toHaveCount(scenario.kind==="URGENT_INSTRUCTION"?0:1);
   await expect(page.getByRole("heading",{name:"Шаг 1. Выберите ситуацию"})).toHaveCount(0);
   if(scenario.kind!=="URGENT_INSTRUCTION"){
    await expect(page.getByRole("heading",{name:"Шаг 1. Обстоятельства и документы"})).toBeVisible();
    await expect(page.getByRole("heading",{name:"Шаг 2. Проверка ограничений"})).toBeVisible();
   }
   await page.goto(routeHref);
  }
  await page.goto("/voennoe-pravo/");
 }
});

test("legacy wizard URLs redirect to canonical family-style scenario",async({page})=>{
 await page.goto(militaryPublicDraftHref("service-contract","service-order-copy"));
 await expect(page).toHaveURL(/\/voennoe-pravo\/prokhozhdenie-voennoy-sluzhby-po-kontraktu\/\?scenario=service-order-copy/);
});

test("emergency military scenario prioritizes immediate care without document",async({page})=>{
 await page.goto(militaryCanonicalRouteHref("military-medical","medical-emergency"));
 await expect(page.getByRole("heading",{name:"Сначала неотложная помощь"})).toBeVisible();
 await expect(page.getByRole("button",{name:/Создать новую версию документа/})).toHaveCount(0);
 await expect(page.getByRole("button",{name:"Скачать PDF"})).toHaveCount(0);
});

test("military draft retains legal status and sends no questionnaire posts",async({page})=>{
 const posts:string[]=[];
 page.on("request",request=>{if(request.method()==="POST")posts.push(request.url());});
 await page.goto(militaryCanonicalRouteHref("service-contract","service-order-copy"));
 const form=page.getByRole("region",{name:"Пошаговая анкета"});
 await form.getByLabel("Кто обращается?").selectOption("военнослужащий");
 await form.getByLabel("Правовой статус и вид службы").selectOption("контракт");
 for(const input of await form.locator("textarea").all()){
  await input.fill("Подтвержденные обезличенные обстоятельства по документам");
 }
 const review=page.getByRole("region",{name:"Проверка перед генерацией"});
 await review.getByRole("checkbox").check();
 await review.getByRole("button",{name:/Создать новую версию документа/}).click();
 const result=page.getByRole("region",{name:"Предварительный результат"});
 await expect(result).toContainText("НЕ ГОТОВ К ПОДАЧЕ");
 await expect(result.getByRole("button",{name:"Скачать PDF"})).toBeEnabled();
 await expect(result.getByRole("button",{name:"Сохранить в мои документы"})).toHaveCount(0);
 expect(posts).toEqual([]);
});

test("military PDF review requires two consents and supports secure withdrawal",async({page})=>{
 test.skip(process.env.E2E_SUBMIT_REVIEW!=="true","Only the isolated review test database may accept a submission");
 await page.goto(militaryCanonicalRouteHref("service-contract","service-order-copy"));
 const form=page.getByRole("region",{name:"Пошаговая анкета"});
 await form.getByLabel("Кто обращается?").selectOption("военнослужащий");
 await form.getByLabel("Правовой статус и вид службы").selectOption("контракт");
 for(const input of await form.locator("textarea").all())
  await input.fill("Подтверждённые обстоятельства по документам, без личных сведений");
 const check=page.getByRole("region",{name:"Проверка перед генерацией"});
 await check.getByRole("checkbox").check();
 await check.getByRole("button",{name:"Создать новую версию документа"}).click();
 const result=page.getByRole("region",{name:"Предварительный результат"});
 await result.getByRole("button",{name:"Отправить на проверку юристу"}).click();
 const review=page.getByRole("region",{name:"Передача документа на юридическую проверку"});
 await review.getByLabel("Имя").fill("Тестовый заявитель");
 await review.getByLabel("Телефон").fill("+79990000000");
 const send=review.getByRole("button",{name:"Подтвердить отправку PDF"});
 await expect(send).toBeDisabled();
 await review.getByRole("checkbox").nth(0).check();
 await expect(send).toBeDisabled();
 await review.getByRole("checkbox").nth(1).check();
 await expect(send).toBeEnabled();
 await send.click();
 await expect(review).toContainText("ожидает назначения юриста");
 await review.getByRole("button",{name:"Отозвать согласие и удалить PDF"}).click();
 await expect(review).toContainText("Согласие отозвано, файл удалён.");
});

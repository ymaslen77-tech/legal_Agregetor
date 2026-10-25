import {expect,test} from "@playwright/test";
import {MILITARY_ROUTES} from "../../src/data/military-route-plans";
import {militaryPublicHref} from "../../src/lib/military-preview-navigation";

test("@military-preview public wizard exposes 18 unique noindex scenarios, never redirects into Q&A",async({page})=>{
 test.setTimeout(180_000);
 let count=0;
 for(const route of MILITARY_ROUTES)for(const scenario of route.scenarios){
  const href=militaryPublicHref(route.id,scenario.key);
  const response=await page.goto(href);
  expect(response?.status(),href).toBe(200);
  await expect(page.getByRole("heading",{name:"Военное право — юридические маршруты"})).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content",/noindex/);
  await expect(page.getByText("ПРОЕКТ ДЛЯ ЮРИДИЧЕСКОЙ ПРОВЕРКИ",{exact:false})).toBeVisible();
  await expect(page.getByRole("heading",{name:"Похожие вопросы"})).toHaveCount(1);
  await expect(page.getByRole("navigation",{name:"Этапы юридического маршрута"})).toHaveCount(1);
  await expect(page.getByRole("link",{name:scenario.title})).toBeVisible();
  if(scenario.kind==="URGENT_INSTRUCTION"){
   await expect(page.getByRole("heading",{name:"Сначала неотложная помощь"})).toBeVisible();
   await expect(page.getByRole("button",{name:"Перейти к анкете"})).toHaveCount(0);
  }else{
   await expect(page.getByRole("button",{name:"Перейти к анкете"})).toBeVisible();
  }
  count++;
 }
 expect(count).toBe(18);
});

test("@military-preview public wizard generates review-only document, PDF and versions without posting facts",async({page})=>{
 const posts:string[]=[];
 page.on("request",req=>{if(req.method()==="POST")posts.push(req.url());});
 await page.goto(militaryPublicHref("command-appeal","challenge-decision"));
 await page.getByRole("button",{name:"Перейти к анкете"}).click();
 const form=page.getByRole("region",{name:"Пошаговая анкета"});
 await form.getByLabel("Кто обращается?").selectOption("военнослужащий");
 await form.getByLabel("Правовой статус и вид службы").selectOption("контракт");
 for(const field of await form.locator("textarea").all())await field.fill("Подтвержденные сведения для проверки документов");
 await form.getByRole("button",{name:"Проверить сведения"}).click();
 const review=page.getByRole("region",{name:"Проверка перед генерацией"});
 await review.getByRole("checkbox").check();
 await review.getByRole("button",{name:"Создать предварительную версию"}).click();
 const result=page.getByRole("region",{name:"Предварительный результат"});
 await expect(result).toContainText("ПРОШУ РАССМОТРЕТЬ");
 await expect(result).toContainText("НЕ ГОТОВ К ПОДАЧЕ");
 await expect(result.getByRole("button",{name:"Скачать PDF"})).toBeEnabled();
 await expect(result.getByRole("button",{name:"Скачать DOCX"})).toBeEnabled();
 await expect(result.getByRole("button",{name:"Сохранить в мои документы"})).toHaveCount(0);
 const snapshot=await result.locator("pre").textContent();
 await result.getByRole("button",{name:"Изменить и создать новую версию"}).click();
 await form.locator("textarea").first().fill("Исправленное подтвержденное обстоятельство");
 await page.getByRole("button",{name:"Отменить изменения"}).click();
 await expect(result.locator("pre")).toHaveText(snapshot!);
 expect(posts).toEqual([]);
});

test("@military-preview unsupported applicant gets checklist rather than false legal draft",async({page})=>{
 await page.goto(militaryPublicHref("service-contract","service-order-copy"));
 await page.getByRole("button",{name:"Перейти к анкете"}).click();
 const form=page.getByRole("region",{name:"Пошаговая анкета"});
 await form.getByLabel("Кто обращается?").selectOption("член семьи");
 await form.getByLabel("Правовой статус и вид службы").selectOption("контракт");
 for(const field of await form.locator("textarea").all())await field.fill("Подтвержденные обстоятельства без персональных данных");
 await form.getByRole("button",{name:"Проверить сведения"}).click();
 const review=page.getByRole("region",{name:"Проверка перед генерацией"});
 await review.getByRole("checkbox").check();
 await review.getByRole("button",{name:"Создать предварительную версию"}).click();
 const result=page.getByRole("region",{name:"Предварительный результат"});
 await expect(result).toContainText("ПРЕДВАРИТЕЛЬНЫЙ ЧЕК-ЛИСТ");
 await expect(result).not.toContainText("ПРОШУ РАССМОТРЕТЬ");
});

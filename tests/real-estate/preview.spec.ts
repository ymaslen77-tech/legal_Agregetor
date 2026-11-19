import {expect,test} from "@playwright/test";
import { REAL_ESTATE_GROUPS } from "../../src/data/real-estate-route-plan";

test("private root contains all ten groups and is noindex",async ({page})=>{
  const response=await page.goto("/dev/real-estate/");
  expect(response?.status()).toBe(200);
  await expect(page.getByTestId("real-estate-preview")).toBeVisible();
  await expect(page.getByRole("heading",{name:"Недвижимость и земельные споры"})).toBeVisible();
  await expect(page.locator('section[aria-label="Подразделы маршрута"] a')).toHaveCount(10);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content",/noindex/);
});

test("all 60 individual dev-only routes resolve and show their intended situation",async ({page,request})=>{
  test.setTimeout(300_000);
  let count=0;
  for(const group of REAL_ESTATE_GROUPS){
    const groupPath="/dev/real-estate/"+group.id+"/";
    const g=await request.get(groupPath);
    expect(g.status(),groupPath).toBe(200);
    const groupPage=await g.text();
    expect(groupPage).toContain("noindex");
    for(const situation of group.situations){
      const path=groupPath+situation.id+"/";
      const response=await request.get(path);
      expect(response.status(),path).toBe(200);
      const text=await response.text();
      expect(text,path).toContain(situation.title);
      expect(text,path).toContain("noindex");
      count++;
    }
  }
  expect(count).toBe(60);
  await page.goto("/dev/real-estate/land-boundaries/neighbor-boundary-dispute/");
  await expect(page.getByTestId("real-estate-preview")).toBeVisible();
  await expect(page.locator("#real-estate-group")).toHaveValue("land-boundaries");
  await expect(page.locator("#real-estate-case")).toHaveValue("neighbor-boundary-dispute");
});

test("first-stage intake never generates a legal document and invalidates stale results",async ({page})=>{
  await page.goto("/dev/real-estate/ownership-register/registration-refusal/");
  const submit=page.getByRole("button",{name:"Проверить полноту тестовых сведений"});
  await submit.click();
  await expect(page.getByText("Статус анкеты: NEEDS_DETAILS")).toBeVisible();
  await page.locator("#real-estate-role").selectOption("собственник");
  await page.locator("#real-estate-propertyType").selectOption("квартира");
  await page.locator("#real-estate-stage").selectOption("получен отказ");
  for(const key of ["summary","documents","goal","caseDetails"]){
    await page.locator("#real-estate-"+key).fill("Искусственное описание для теста без персональных данных");
  }
  await submit.click();
  await expect(page.getByText("Статус анкеты: FACTS_COLLECTED")).toBeVisible();
  await expect(page.getByText(/Подготовка PDF\/DOCX/)).toBeVisible();
  await page.locator("#real-estate-summary").fill("Обновленные искусственные обстоятельства");
  await expect(page.getByText("Статус анкеты: FACTS_COLLECTED")).toHaveCount(0);
});

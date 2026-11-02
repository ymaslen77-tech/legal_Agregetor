import { expect, test } from "@playwright/test";
import { MILITARY_TOPICS } from "../../src/data/military-catalog";
import { MILITARY_DOCUMENT_TARGETS } from "../../src/data/military-document-target-matrix";

test("unified documents catalog lists 121 military draft generators and 20 selectable topics", async ({page}) => {
  await page.goto("/documents/");
  await expect(page.getByRole("heading", {name: /Военное право — 121 генератор/})).toBeVisible();
  await page.getByRole("button", {name: "Показать все 121 документов"}).click();
  await expect(page.getByText("Найдено документов: 121 из", {exact:false})).toBeVisible();
  const cards = page.locator("article");
  await expect(cards).toHaveCount(121);
  await expect(page.getByLabel("Раздел военного права").locator("option")).toHaveCount(21);
  for (const topic of MILITARY_TOPICS) {
    const option = page.getByLabel("Раздел военного права").locator("option", {hasText:topic.title});
    await expect(option).toHaveCount(1);
  }
  const topic = MILITARY_TOPICS[0];
  await page.getByLabel("Раздел военного права").selectOption({label:topic.title});
  await expect(cards).toHaveCount(MILITARY_DOCUMENT_TARGETS.filter(target => target.categorySlug === topic.slug).length);
  await page.getByRole("button", {name:/Сбросить фильтры/}).click();
  await page.getByLabel("Вид права").selectOption("Военное право");
  const target = MILITARY_DOCUMENT_TARGETS[0];
  await page.getByRole("searchbox", {name:"Поиск документов"}).fill(target.documentTitle);
  const exact = page.locator("article").filter({has: page.getByRole("heading", {name:target.documentTitle, exact:true})});
  await expect(exact).toHaveCount(1);
  await expect(exact.getByRole("link", {name:"Открыть документ"})).toHaveAttribute(
    "href", `/voennoe-pravo/${target.categorySlug}/${target.situationSlug}/`
  );
  await exact.getByRole("link", {name:"Открыть документ"}).click();
  await expect(page).toHaveURL(new RegExp(`/voennoe-pravo/${target.categorySlug}/${target.situationSlug}/`));
  await expect(page.getByTestId("military-draft-workbench")).toBeVisible();
});

test("informational military situations are never listed as document generators",async ({page})=>{
  const info = MILITARY_TOPICS.flatMap(topic => topic.situations
    .filter(situation => situation.kind === "information")
    .map(situation => ({topic,situation})));
  expect(info).toHaveLength(22);
  await page.goto("/documents/");
  await page.getByLabel("Вид права").selectOption("Военное право");
  await expect(page.locator("article")).toHaveCount(121);
  for(const item of info) {
    await expect(page.locator(`article a[href="/voennoe-pravo/${item.topic.slug}/${item.situation.slug}/"]`)).toHaveCount(0);
  }
});

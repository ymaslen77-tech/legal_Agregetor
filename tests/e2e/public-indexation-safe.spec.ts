import { expect, test } from "@playwright/test";
import { MILITARY_TOPICS } from "../../src/data/military-catalog";

test("verified public navigation may be indexed; draft legal situations stay noindex", async ({ page }) => {
  const response = await page.goto("/voennoe-pravo/");
  expect(response?.status()).toBe(200);
  const robots = await page.locator('meta[name="robots"]').getAttribute("content");
  expect(robots).toMatch(/(?:^|[,\s])index(?:[,\s]|$)/i);
  expect(robots).not.toMatch(/noindex/i);
  const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
  expect(canonical).toMatch(/\/voennoe-pravo\/$/);
  await expect(page.locator('section[aria-label="Темы военного права"] article')).toHaveCount(20);

  const topic = MILITARY_TOPICS[0];
  await page.goto(`/voennoe-pravo/${topic.slug}/`);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/i);

  const situation = topic.situations[0];
  await page.goto(`/voennoe-pravo/${topic.slug}/${situation.slug}/`);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/i);
});

test("sitemaps include the safe hub but exclude unverified drafts, fake profiles and private paths", async ({ request }) => {
  const root = await request.get("/sitemap.xml");
  expect(root.status()).toBe(200);
  const index = await root.text();
  expect(index).toContain("/sitemap-pages.xml");

  const sitemap = await request.get("/sitemap-pages.xml");
  expect(sitemap.status()).toBe(200);
  const xml = await sitemap.text();
  expect(xml).toMatch(/<loc>https?:\/\/[^<]+\/voennoe-pravo\/<\/loc>/);
  expect(xml).not.toContain("/voennoe-pravo/kontraktnaya-sluzhba/");
  expect(xml).not.toMatch(/\/(?:account|admin|api|test|debug|dev)\//);
  expect(xml).not.toMatch(/(?:demo-lawyer|sample-lawyer|dev-city-lawyer|test-lawyer|fake-lawyer)/);

  const robots = await request.get("/robots.txt");
  expect(robots.status()).toBe(200);
  const text = await robots.text();
  expect(text).toMatch(/Allow:\s*\//i);
  expect(text).toMatch(/Disallow:\s*\/account\//i);
  expect(text).not.toMatch(/Disallow:\s*\/\s*(?:\r?\n|$)/);
});

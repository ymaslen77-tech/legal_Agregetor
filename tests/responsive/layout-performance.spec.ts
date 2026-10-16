import { expect, test } from "@playwright/test";
import { appendFileSync, mkdirSync } from "node:fs";

/** Smoke paths spanning the shell, searchable listings and two legal workflows. */
const pages = [
  "/",
  "/problems/",
  "/documents/",
  "/problems/semya-i-deti/alimenty-na-rebenka/",
  "/problems/trudovoe-pravo/trudovoy-dogovor/"
] as const;

for (const path of pages) {
  test(`responsive + lab performance: ${path}`, async ({ page }, testInfo) => {
    const response = await page.goto(path, { waitUntil: "domcontentloaded" });
    expect(response?.status(), path).toBe(200);
    await expect(page.locator("h1").first()).toBeVisible();
    const metric = await page.evaluate(() => {
      const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
      const viewport = document.documentElement.clientWidth;
      return {
        viewport,
        innerWidth: window.innerWidth,
        documentWidth: document.documentElement.scrollWidth,
        bodyWidth: document.body.scrollWidth,
        viewportMeta: document.querySelector('meta[name="viewport"]')?.getAttribute("content") ?? "",
        ttfbMs: Math.round(nav?.responseStart ?? 0),
        domContentLoadedMs: Math.round(nav?.domContentLoadedEventEnd ?? 0),
        totalResources: performance.getEntriesByType("resource").length,
        inputFontSizes: Array.from(document.querySelectorAll("main input, main select, main textarea"))
          .filter((element) => {
            const rect = element.getBoundingClientRect();
            return rect.width > 0 && rect.height > 0 && getComputedStyle(element).visibility !== "hidden";
          })
          .map((element) => Number.parseFloat(getComputedStyle(element).fontSize))
      };
    });
    if (metric.documentWidth > metric.innerWidth + 2) {
      const offenders = await page.evaluate(() =>
        Array.from(document.querySelectorAll("body *"))
          .map((element) => {
            const rect = element.getBoundingClientRect();
            return { tag: element.tagName.toLowerCase(),
              cls: typeof element.className === "string" ? element.className.slice(0,100) : "",
              right: Math.round(rect.right), width: Math.round(rect.width),
              text: (element.textContent ?? "").trim().slice(0,55)
            };
          })
          .filter((element) => element.right > innerWidth + 2 && element.width > 0)
          .sort((a,b) => b.right-a.right)
          .slice(0, 20)
      );
      console.log("RESPONSIVE_OVERFLOW_OFFENDERS "+testInfo.project.name+" "+path+" "+JSON.stringify(offenders));
    }
    const item = { project: testInfo.project.name, path, ...metric };
    mkdirSync("artifacts", { recursive: true });
    appendFileSync("artifacts/responsive-metrics.ndjson", JSON.stringify(item) + "\n");
    console.log("RESPONSIVE_LAB_METRIC " + JSON.stringify(item));

    expect(metric.viewportMeta).toContain("width=device-width");
    expect(metric.viewport).toBeLessThanOrEqual(metric.innerWidth + 2);
    expect(metric.documentWidth, "document must fit screen; inner navigations may scroll").toBeLessThanOrEqual(metric.innerWidth + 2);
    expect(metric.bodyWidth, "body must not have global horizontal scrolling").toBeLessThanOrEqual(metric.innerWidth + 2);
    // Generous safety ceiling for cold CI, not a claim of good real-world CWV.
    expect(metric.ttfbMs).toBeLessThan(15_000);
    expect(metric.domContentLoadedMs).toBeLessThan(25_000);
    if (metric.innerWidth <= 640) {
      expect(metric.inputFontSizes.every((size) => size >= 16), "mobile form font must not trigger iOS auto zoom").toBe(true);
    }
  });
}

test("responsive city picker stays within the screen and is operable", async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", error => errors.push("pageerror: "+error.message));
  page.on("requestfailed", request => errors.push(request.url()+": "+(request.failure()?.errorText??"request failed")));
  page.on("console", message => { if (message.type()==="error") errors.push("console: "+message.text()); });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const opener = page.locator("header button[aria-expanded]").first();
  await expect(opener).toBeVisible();
  try {
    await expect(opener).toHaveAttribute("data-hydrated", "true");
  } catch (error) {
    console.log("HYDRATION_ERRORS "+testInfo.project.name+" "+JSON.stringify(errors.slice(0,15)));
    throw error;
  }
  await expect(opener).toHaveAttribute("aria-expanded", "false");
  await opener.click();
  await expect(opener).toHaveAttribute("aria-expanded", "true");
  const search = page.getByPlaceholder("Поиск города...");
  await expect(search).toBeVisible();
  const coords = await search.evaluate((node) => {
    const rect = node.closest(".shadow-xl")?.getBoundingClientRect();
    return { left: rect?.left ?? -1, right: rect?.right ?? Number.POSITIVE_INFINITY, vw: window.innerWidth };
  });
  expect(coords.left).toBeGreaterThanOrEqual(-1);
  expect(coords.right).toBeLessThanOrEqual(coords.vw + 1);
  await page.getByRole("button", { name: "Закрыть выбор города" }).click();
  await expect(search).toBeHidden();
});


test("mobile content and long data remain navigable without page overflow", async ({ page }) => {
  await page.goto("/documents/", { waitUntil: "domcontentloaded" });
  const fit = await page.evaluate(() => {
    const vw = document.documentElement.clientWidth;
    const main = document.querySelector("main");
    if (!main) return { vw, mainWidth: 0, overflow: true, broken: true };
    const mainWidth = Math.ceil(main.getBoundingClientRect().width);
    const overflow = document.documentElement.scrollWidth > vw + 2;
    const broken = Array.from(main.querySelectorAll("img, video, canvas"))
      .some(el => el.getBoundingClientRect().width > vw + 2);
    return { vw, mainWidth, overflow, broken };
  });
  expect(fit.mainWidth).toBeGreaterThan(0);
  expect(fit.overflow, "no global overflow at any supported viewport").toBe(false);
  expect(fit.broken, "media must scale to available viewport").toBe(false);
});

test("mobile text can zoom naturally and keeps interactive controls visible", async ({ page }, testInfo) => {
  await page.goto("/documents/", { waitUntil: "domcontentloaded" });
  const data = await page.evaluate(() => ({
    viewport: document.querySelector('meta[name="viewport"]')?.getAttribute("content") ?? "",
    mainFont: Number.parseFloat(getComputedStyle(document.querySelector("main")!).fontSize),
    controls: Array.from(document.querySelectorAll("main button, main input, main select, main textarea"))
      .filter(el => { const r=el.getBoundingClientRect(); return r.width>0 && r.height>0; })
      .map(el => ({ width: Math.round(el.getBoundingClientRect().width), font: Number.parseFloat(getComputedStyle(el).fontSize) }))
  }));
  expect(data.viewport).toContain("width=device-width");
  expect(data.viewport).not.toMatch(/user-scalable\s*=\s*no|maximum-scale\s*=\s*1/i);
  expect(data.mainFont).toBeGreaterThanOrEqual(14);
  if (testInfo.project.name.includes("phone") && !testInfo.project.name.includes("landscape")) {
    expect(data.controls.every(x => x.font >= 16), "mobile forms must avoid Safari input auto-zoom").toBe(true);
  }
});

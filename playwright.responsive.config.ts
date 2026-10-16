import { defineConfig, devices } from "@playwright/test";

const port = Number(process.env.PLAYWRIGHT_PORT || 3703);
const baseURL = process.env.PLAYWRIGHT_BASE_URL || `http://127.0.0.1:${port}`;

/**
 * Run against the same production build/temporary PostgreSQL as the standard E2E,
 * not against Vercel previews protected by SSO. Scores are CI lab timings, not
 * field Core Web Vitals or Lighthouse scores.
 */
export default defineConfig({
  testDir: "./tests/responsive",
  timeout: 90_000,
  expect: { timeout: 12_000 },
  fullyParallel: false,
  reporter: process.env.CI
    ? [["line"], ["json", { outputFile: "artifacts/responsive-browser-results.json" }]]
    : "line",
  use: { baseURL, trace: "retain-on-failure", screenshot: "only-on-failure" },
  projects: [
    { name: "chrome-phone-320", use: { ...devices["Desktop Chrome"], viewport: { width: 320, height: 720 }, isMobile: true, hasTouch: true } },
    { name: "chrome-phone-360", use: { ...devices["Desktop Chrome"], viewport: { width: 360, height: 780 }, isMobile: true, hasTouch: true } },
    { name: "chrome-phone-landscape-844", use: { ...devices["Desktop Chrome"], viewport: { width: 844, height: 390 }, isMobile: true, hasTouch: true } },
    { name: "chrome-phone-390", use: { ...devices["Desktop Chrome"], viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
    { name: "chrome-tablet-768", use: { ...devices["Desktop Chrome"], viewport: { width: 768, height: 1024 }, isMobile: true, hasTouch: true } },
    { name: "chrome-laptop-1024", use: { ...devices["Desktop Chrome"], viewport: { width: 1024, height: 768 } } },
    { name: "chrome-desktop-1440", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "firefox-phone-390", use: { ...devices["Desktop Firefox"], viewport: { width: 390, height: 844 } } },
    { name: "firefox-desktop-1440", use: { ...devices["Desktop Firefox"], viewport: { width: 1440, height: 900 } } },
    { name: "safari-phone-390", use: { ...devices["Desktop Safari"], viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
    { name: "safari-desktop-1440", use: { ...devices["Desktop Safari"], viewport: { width: 1440, height: 900 } } }
  ],
  webServer: process.env.PLAYWRIGHT_BASE_URL ? undefined : {
    command: process.env.CI ? `npm run start -- -p ${port}` : `npm run dev -- -p ${port}`,
    url: baseURL, reuseExistingServer: !process.env.CI, timeout: 120_000
  }
});

import { defineConfig } from "@playwright/test";

/** Isolated local-development preview; never run these tests against production. */
export default defineConfig({
  testDir:"./tests/credit-debt",
  timeout:60_000,
  expect:{timeout:15_000},
  fullyParallel:false,
  reporter:process.env.CI ? "line" : "list",
  use:{
    baseURL:"http://127.0.0.1:3703",
    browserName:"chromium",
    trace:"retain-on-failure",
    screenshot:"only-on-failure"
  }
});

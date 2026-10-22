import {defineConfig,devices} from "@playwright/test";
const baseURL=process.env.PLAYWRIGHT_BASE_URL||"http://127.0.0.1:3706";
export default defineConfig({
 testDir:"./tests/e2e",
 testMatch:"military-preview.spec.ts",
 timeout:60_000,
 expect:{timeout:10_000},
 fullyParallel:false,
 reporter:process.env.CI?[["line"],["html",{open:"never"}]]:"line",
 projects:[
  {name:"military-chromium",use:{...devices["Desktop Chrome"],baseURL}},
  {name:"military-firefox",use:{...devices["Desktop Firefox"],baseURL}},
  {name:"military-webkit",use:{...devices["Desktop Safari"],baseURL}}
 ],
 use:{trace:"retain-on-failure",screenshot:"only-on-failure"},
 webServer:process.env.PLAYWRIGHT_BASE_URL?undefined:{
  command:process.env.CI?"npm run start -- -p 3706":"npm run dev -- -p 3706",
  url:baseURL,reuseExistingServer:!process.env.CI,timeout:120_000
 }
});

import {expect,test} from "@playwright/test";

/** The 60 unverified routes are never publicly served in production. */
test("production credit/debt skeleton stays 404 until legal publication gate is approved",async ({page})=>{
  const urls=[
    "/kredity-dolgi/",
    "/kredity-dolgi/bankruptcy/",
    "/kredity-dolgi/bankruptcy/out-of-court-mfc/",
    "/kredity-dolgi/contract-terms/early-repayment/"
  ];
  for(const path of urls){
    const r=await page.goto(path);
    expect(r?.status(),path).toBe(404);
  }
});

import {expect,test} from "@playwright/test";

/** Production exposes informative drafts, but never promotes them into approved legal filings. */
test("public credit/debt catalog and draft routes render without indexing unreviewed claims",async ({page})=>{
  const urls=[
    "/kredity-dolgi/",
    "/kredity-dolgi/bankruptcy/",
    "/kredity-dolgi/bankruptcy/out-of-court-mfc/",
    "/kredity-dolgi/contract-terms/early-repayment/"
  ];
  for(const path of urls){
    const r=await page.goto(path);
    expect(r?.status(),path).toBe(200);
    await expect(page.locator("meta[name='robots']")).toHaveAttribute("content",/noindex/);
    expect(r?.headers()["x-robots-tag"],path).toContain("noindex");
  }
  await expect(page.getByText("Черновик", {exact:false}).first()).toBeVisible().catch(()=>{});
  for(const path of ["/kredity-dolgi/unknown/","/kredity-dolgi/bankruptcy/unknown/"]){
    const r=await page.goto(path);
    expect(r?.status(),path).toBe(404);
  }
});

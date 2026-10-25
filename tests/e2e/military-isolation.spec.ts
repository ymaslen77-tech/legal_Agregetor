import {expect,test} from "@playwright/test";
import {MILITARY_ROUTES,getMilitaryDocumentSlug} from "../../src/data/military-route-plans";

test("military unpublished development route is 404 in production",async({page})=>{
 const response=await page.goto("/internal/military-preview/");
 expect(response?.status()).toBe(404);
 expect(response?.headers()["x-robots-tag"]).toContain("noindex");
 expect(response?.headers()["cache-control"]).toContain("no-store");
 await expect(page.getByText("Not Found")).toBeVisible();
});

test("unapproved military routes and drafts never enter public SEO or navigation",async({request})=>{
 const [p,d,index]=await Promise.all([
  request.get("/sitemap-problems.xml").then(r=>r.text()),
  request.get("/sitemap-documents.xml").then(r=>r.text()),
  request.get("/problems/").then(r=>r.text())
 ]);
 for(const route of MILITARY_ROUTES){
  expect(p).not.toContain("/problems/voennoe-pravo/"+route.slug+"/");
  expect(index).not.toContain(route.slug);
  for(const scenario of route.scenarios){
   const slug=getMilitaryDocumentSlug(route,scenario);
   if(slug)expect(d).not.toContain("/documents/"+slug+"/");
  }
 }
});

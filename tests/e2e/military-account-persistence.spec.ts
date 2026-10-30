import {expect,test} from "@playwright/test";
import {randomUUID} from "node:crypto";
import {prisma} from "../../src/lib/prisma";
import {AUTH_COOKIE_NAME,createSessionToken} from "../../src/lib/auth";
import {MILITARY_TOPICS} from "../../src/data/military-catalog";
import {getMilitaryDraftPlan} from "../../src/data/military-document-core";

test.skip(process.env.ENABLE_MILITARY_DRAFT_PREVIEW!=="true" || process.env.CI!=="true",
 "Real archive integration is allowed only in isolated CI Postgres with synthetic user accounts.");

test("real encrypted cabinet saves, isolates, retrieves and deletes a military draft",async({page,context})=>{
 const suffix=randomUUID();
 const userA=await prisma.user.create({
   data:{email:`military-archive-a-${suffix}@example.invalid`,passwordHash:"NOT_A_VALID_LOGIN_PASSWORD",role:"USER"}
 });
 const userB=await prisma.user.create({
   data:{email:`military-archive-b-${suffix}@example.invalid`,passwordHash:"NOT_A_VALID_LOGIN_PASSWORD",role:"USER"}
 });
 const base=process.env.PLAYWRIGHT_BASE_URL || "http://127.0.0.1:"+(process.env.PLAYWRIGHT_PORT||3703);
 async function asUser(user:{id:string;email:string}){
   const token=await createSessionToken({sub:user.id,email:user.email,role:"USER"});
   await context.clearCookies();
   await context.addCookies([{name:AUTH_COOKIE_NAME,value:token,url:base,httpOnly:true,sameSite:"Lax"}]);
 }
 try {
   await asUser(userA);
   const topic=MILITARY_TOPICS.find(x=>x.slug==="raporty-i-obrashcheniya")!;
   const situation=topic.situations[3];
   const plan=getMilitaryDraftPlan(topic.slug,situation.slug)!;
   await page.goto("/voennoe-pravo/"+topic.slug+"/"+situation.slug+"/");
   const workbench=page.getByTestId("military-draft-workbench");
   await expect(workbench).toBeVisible();
   for(const field of plan.requiredInputs.filter(f=>f.required)){
     await workbench.locator('[data-field-key="'+field.key+'"]').fill(
       "Синтетическое обращение с датой и подтверждающими сведениями: "+field.label
     );
   }
   await workbench.getByRole("button",{name:"Сформировать черновик"}).click();
   await expect(workbench.getByRole("button",{name:"Сохранить в мои документы"})).toBeVisible();
   await workbench.getByRole("button",{name:"Сохранить в мои документы"}).click();
   await expect(workbench.getByRole("button",{name:"Версия сохранена"})).toBeVisible();
   const response=await page.request.get("/api/account/documents/");
   expect(response.status()).toBe(200);
   const listings=await response.json() as {documents:{versionId:string;categorySlug:string}[]};
   const row=listings.documents.find(x=>x.categorySlug==="voennoe-pravo");
   expect(row).toBeTruthy();
   const versionId=row!.versionId;
   await page.goto("/account/documents/");
   const analyticsDialog=page.getByRole("dialog",{name:"Настройки аналитики"});
   await expect(analyticsDialog).toBeVisible();
   await analyticsDialog.getByRole("button",{name:"Отклонить"}).click();
   await expect(analyticsDialog).toHaveCount(0);
   await expect(page.getByRole("heading",{name:plan.title})).toBeVisible();
   await expect(page.getByRole("option",{name:"Военное право (черновики)"})).toHaveCount(1);
   const mine=await page.request.get("/api/account/documents/"+versionId+"/");
   expect(mine.status()).toBe(200);
   const mineBody=await mine.json() as {documentResult:{documentText:string;filingReady:boolean;legalRegistryReviewedAt:null}};
   expect(mineBody.documentResult.documentText).toContain("ЧЕРНОВИК — НЕ ГОТОВ К ПОДАЧЕ");
   expect(mineBody.documentResult.filingReady).toBe(false);
   expect(mineBody.documentResult.legalRegistryReviewedAt).toBe(null);
   // Reopen archived text and save an independent USER_EDITED revision.
   await page.getByRole("button",{name:"Открыть версию"}).click();
   const editor=page.getByTestId("military-archive-editor");
   await expect(editor).toBeVisible();
   await editor.getByTestId("military-archive-editor-text").fill(
     "Новая версия синтетического документа с изменённым описанием обстоятельств и подтверждениями. Исходный черновик сохранён отдельно."
   );
   await editor.getByRole("button",{name:"Создать новую редакцию"}).click();
   await expect(editor.getByRole("button",{name:"Сохранить в мои документы"})).toBeVisible();
   await editor.getByRole("button",{name:"Сохранить в мои документы"}).click();
   await expect(editor.getByRole("button",{name:"Версия сохранена"})).toBeVisible();
   const updated=await page.request.get("/api/account/documents/");
   const updatedBody=await updated.json() as {documents:{versionId:string;categorySlug:string}[]};
   const revision=updatedBody.documents.find(x=>x.categorySlug==="voennoe-pravo"&&x.versionId!==versionId);
   expect(revision).toBeTruthy();
   const revisionId=revision!.versionId;
   const revisionResponse=await page.request.get("/api/account/documents/"+revisionId+"/");
   expect(revisionResponse.status()).toBe(200);
   const revisionBody=await revisionResponse.json() as {documentResult:{source:string;legalRegistryReviewedAt:null;documentText:string}};
   expect(revisionBody.documentResult.source).toBe("USER_EDITED");
   expect(revisionBody.documentResult.legalRegistryReviewedAt).toBe(null);
   expect(revisionBody.documentResult.documentText).toContain("Новая версия синтетического документа");
   const oldResponse=await page.request.get("/api/account/documents/"+versionId+"/");
   expect((await oldResponse.json()).documentResult.documentText).toBe(mineBody.documentResult.documentText);
   await asUser(userB);
   expect((await page.request.get("/api/account/documents/"+revisionId+"/")).status()).toBe(404);
   expect((await page.request.get("/api/account/documents/"+versionId+"/")).status()).toBe(404);
   expect((await page.request.get("/api/account/documents/")).status()).toBe(200);
   await asUser(userA);
   const deleted=await page.request.delete("/api/account/documents/"+versionId+"/",{headers:{Origin:base}});
   expect(deleted.status()).toBe(200);
   expect((await page.request.get("/api/account/documents/"+versionId+"/")).status()).toBe(404);
   const deleteRevision=await page.request.delete("/api/account/documents/"+revisionId+"/",{headers:{Origin:base}});
   expect(deleteRevision.status()).toBe(200);
   expect((await page.request.get("/api/account/documents/"+revisionId+"/")).status()).toBe(404);
 } finally {
   // Synthetic CI users are deleted; the archived version also cascades if needed.
   await prisma.user.deleteMany({where:{id:{in:[userA.id,userB.id]}}});
   await prisma.$disconnect();
 }
});

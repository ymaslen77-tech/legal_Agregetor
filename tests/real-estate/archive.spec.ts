import {expect,test} from "@playwright/test";
import {randomUUID} from "node:crypto";
import {execFileSync} from "node:child_process";
import {AUTH_COOKIE_NAME,createSessionToken} from "../../src/lib/auth";
import {prisma} from "../../src/lib/prisma";
import {encryptSavedDocument} from "../../src/lib/saved-document-crypto";
import {createRealEstateDraftPrototype,reviseRealEstateDraft} from "../../src/lib/real-estate-document-core";
import {getRealEstateIntakeSpec} from "../../src/lib/real-estate-intake";

/** Only run against the dedicated ephemeral CI database, never production. */
test("real estate encrypted archive: two versions, owner-only access, PDF and DOCX",async({browser,baseURL})=>{
  test.skip(process.env.ENABLE_REAL_ESTATE_ARCHIVE_E2E!=="true","Requires dedicated isolated archive fixture");
  test.setTimeout(150_000);
  expect(process.env.DATABASE_URL).toMatch(/@127\.0\.0\.1:5432\/real_estate_archive_test\?schema=public$/);
  expect(baseURL).toBe("http://127.0.0.1:3903");
  const origin=baseURL!;
  const ownerId="real-estate-archive-"+randomUUID(),otherId="real-estate-archive-"+randomUUID();
  const ownerEmail=ownerId+"@example.test",otherEmail=otherId+"@example.test";
  const owner=await browser.newContext(),other=await browser.newContext();
  try{
    await prisma.user.create({data:{id:ownerId,email:ownerEmail,passwordHash:"test-only",role:"USER"}});
    await prisma.user.create({data:{id:otherId,email:otherEmail,passwordHash:"test-only",role:"USER"}});
    for(const [context,id,email] of [[owner,ownerId,ownerEmail],[other,otherId,otherEmail]] as const){
      const token=await createSessionToken({sub:id,email,role:"USER"});
      await context.addCookies([{name:AUTH_COOKIE_NAME,value:token,url:origin,httpOnly:true,sameSite:"Lax"}]);
    }
    const spec=getRealEstateIntakeSpec("property-transactions","seller-no-transfer");
    if(!spec)throw Error("Missing test intake");
    const values:Record<string,string>={};
    for(const field of spec.fields)if(field.required)values[field.key]=field.kind==="choice"?field.choices![0]:"Синтетические обстоятельства для изолированной проверки";
    Object.assign(values,{role:"покупатель",saleContract:"договор от 01.10.2026",saleObject:"условный объект",saleDueDate:"2026-10-15",saleBreachConfirmed:"да",handoverAct:"нет",handoverPossession:"нет"});
    const draft=createRealEstateDraftPrototype({groupId:"property-transactions",situationId:"seller-no-transfer",values,createdAt:"2026-11-27T12:00:00.000Z"});
    const revision=reviseRealEstateDraft(draft,draft.documentResult.documentText+"\nТестовая редакторская пометка.");
    const versions=[draft.documentResult,revision.documentResult];
    // No bypass of release gate: authenticated POST must still fail before release.
    const rejected=await owner.request.post(origin+"/api/account/documents/",{headers:{Origin:origin},data:{documentResult:versions[0]}});
    expect(rejected.status()).toBe(400);
    // Seed only synthetic encrypted fixture records, to test actual downstream archive behavior.
    for(const result of versions)await prisma.savedLegalDocument.create({data:{userId:ownerId,versionId:result.versionId,encryptedPayload:encryptSavedDocument(result,ownerId)}});
    const owned=await owner.request.get(origin+"/api/account/documents/");
    expect(owned.status()).toBe(200);
    expect((await owned.json()).documents.map((d:{versionId:string})=>d.versionId).sort()).toEqual(versions.map(v=>v.versionId).sort());
    const foreign=await other.request.get(origin+"/api/account/documents/");
    expect(foreign.status()).toBe(200);
    expect((await foreign.json()).documents).toEqual([]);
    for(const result of versions){
      const endpoint=origin+"/api/account/documents/"+result.versionId+"/";
      const restored=await owner.request.get(endpoint);
      expect(restored.status()).toBe(200);
      expect((await restored.json()).documentResult).toEqual(result);
      expect((await other.request.get(endpoint)).status()).toBe(404);
      expect((await other.request.delete(endpoint,{headers:{Origin:origin}})).status()).toBe(404);
    }
    const page=await owner.newPage();
    await page.goto(origin+"/account/documents/");
    await expect(page.getByRole("button",{name:"Открыть версию"})).toHaveCount(2);
    await page.getByText("Версия: "+versions[0].versionId,{exact:true}).locator("..").getByRole("button",{name:"Открыть версию"}).click();
    await expect(page.getByText("ID версии: "+versions[0].versionId,{exact:true})).toBeVisible();
    const pdfPromise=page.waitForEvent("download");
    await page.getByRole("button",{name:"Скачать архивную копию PDF"}).click();
    const pdf=await pdfPromise;
    const path=await pdf.path();expect(path).toBeTruthy();
    const extracted=execFileSync("pdftotext",[path!,"-"],{encoding:"utf8"}).replace(/\s+/g," ");
    expect(extracted).toContain("статьи 556 ГК РФ");
    expect(extracted).not.toContain("Тестовая редакторская пометка");
    const docxPromise=page.waitForEvent("download");
    await page.getByRole("button",{name:"Скачать архивную копию DOCX"}).click();
    const docx=await docxPromise;
    const docxPath=await docx.path();expect(docxPath).toBeTruthy();
    const xml=execFileSync("unzip",["-p",docxPath!,"word/document.xml"],{encoding:"utf8"});
    expect(xml).toContain("статьи 556 ГК РФ");
    expect(xml).not.toContain("Тестовая редакторская пометка");
    await page.getByText("Версия: "+versions[1].versionId,{exact:true}).locator("..").getByRole("button",{name:"Открыть версию"}).click();
    await expect(page.getByText("ID версии: "+versions[1].versionId,{exact:true})).toBeVisible();
    await expect(page.locator("pre")).toContainText("Тестовая редакторская пометка");
    expect((await owner.request.delete(origin+"/api/account/documents/"+versions[0].versionId+"/",{headers:{Origin:origin}})).status()).toBe(200);
    expect((await owner.request.get(origin+"/api/account/documents/"+versions[0].versionId+"/")).status()).toBe(404);
    expect((await owner.request.get(origin+"/api/account/documents/"+versions[1].versionId+"/")).status()).toBe(200);
  }finally{
    await Promise.allSettled([owner.close(),other.close()]);
    await prisma.savedLegalDocument.deleteMany({where:{userId:{in:[ownerId,otherId]}}});
    await prisma.user.deleteMany({where:{id:{in:[ownerId,otherId]}}});
  }
});

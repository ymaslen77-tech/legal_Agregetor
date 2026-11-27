import { readFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import {expect,test} from "@playwright/test";
import { REAL_ESTATE_GROUPS } from "../../src/data/real-estate-route-plan";

async function completeRegistrationRefusalFacts(page:import("@playwright/test").Page){
  await page.locator("#real-estate-registrationDecision").selectOption("есть решение с основаниями");
  await page.locator("#real-estate-priorSuspension").selectOption("есть уведомление, причины известны");
  await page.locator("#real-estate-correctionEvidence").selectOption("да, есть доказательства подачи");
  await page.locator("#real-estate-registrationGround").fill("условное основание в тестовом уведомлении");
}


test("private root contains all ten groups and is noindex",async ({page})=>{
  const response=await page.goto("/dev/real-estate/");
  expect(response?.status()).toBe(200);
  await expect(page.getByTestId("real-estate-preview")).toBeVisible();
  await expect(page.getByRole("heading",{name:"Недвижимость и земельные споры"})).toBeVisible();
  await expect(page.locator('section[aria-label="Подразделы маршрута"] a')).toHaveCount(10);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content",/noindex/);
  await expect(page.getByTestId("real-estate-legal-coverage")).toContainText("60 из 60");
  await expect(page.getByTestId("real-estate-legal-coverage")).toContainText("0");
});

test("all 60 individual dev-only routes resolve and show their intended situation",async ({page,request})=>{
  test.setTimeout(300_000);
  let count=0;
  for(const group of REAL_ESTATE_GROUPS){
    const groupPath="/dev/real-estate/"+group.id+"/";
    const g=await request.get(groupPath);
    expect(g.status(),groupPath).toBe(200);
    const groupPage=await g.text();
    expect(groupPage).toContain("noindex");
    for(const situation of group.situations){
      const path=groupPath+situation.id+"/";
      const response=await request.get(path);
      expect(response.status(),path).toBe(200);
      const text=await response.text();
      expect(text,path).toContain(situation.title);
      expect(text,path).toContain("noindex");
      count++;
    }
  }
  expect(count).toBe(60);
  await page.goto("/dev/real-estate/land-boundaries/neighbor-boundary-dispute/");
  await expect(page.getByTestId("real-estate-preview")).toBeVisible();
  await expect(page.locator("#real-estate-group")).toHaveValue("land-boundaries");
  await expect(page.locator("#real-estate-case")).toHaveValue("neighbor-boundary-dispute");
});

test("first-stage intake never generates a legal document and invalidates stale results",async ({page})=>{
  await page.goto("/dev/real-estate/ownership-register/registration-refusal/");
  const submit=page.getByRole("button",{name:"Проверить полноту тестовых сведений"});
  await submit.click();
  await expect(page.getByText("Статус анкеты: NEEDS_DETAILS")).toBeVisible();
  await page.locator("#real-estate-role").selectOption("собственник");
  await page.locator("#real-estate-propertyType").selectOption("квартира");
  await page.locator("#real-estate-stage").selectOption("получен отказ");
  for(const key of ["summary","documents","goal","caseDetails"]){
    await page.locator("#real-estate-"+key).fill("Искусственное описание для теста без персональных данных");
  }
  await completeRegistrationRefusalFacts(page);
  await submit.click();
  await expect(page.getByText("Статус анкеты: FACTS_COLLECTED")).toBeVisible();
  await expect(page.getByText(/Ниже можно сформировать только тестовый черновик/)).toBeVisible();
  await page.locator("#real-estate-summary").fill("Обновленные искусственные обстоятельства");
  await expect(page.getByText("Статус анкеты: FACTS_COLLECTED")).toHaveCount(0);
});

test("document workbench keeps versions immutable and exports an actual draft PDF",async ({page})=>{
  test.setTimeout(150_000);
  await page.goto("/dev/real-estate/ownership-register/registration-refusal/");
  await page.locator("#real-estate-role").selectOption("собственник");
  await page.locator("#real-estate-propertyType").selectOption("квартира");
  await page.locator("#real-estate-stage").selectOption("получен отказ");
  for(const key of ["summary","documents","goal","caseDetails"]){
    await page.locator("#real-estate-"+key).fill("Искусственные сведения для теста версии, без персональных данных и реквизитов");
  }
  await completeRegistrationRefusalFacts(page);
  await page.getByRole("button",{name:"Проверить полноту тестовых сведений"}).click();
  await page.getByRole("button",{name:"Сформировать предварительный проект"}).click();
  const editor=page.getByTestId("real-estate-document-editor");
  await expect(editor).toHaveValue(/ПРОЕКТ — НЕ ГОТОВ К ПОДАЧЕ/);
  const pdf=page.getByRole("button",{name:"Скачать PDF"});
  await expect(pdf).toBeEnabled();
  const downloadPromise=page.waitForEvent("download");
  await pdf.click();
  const download=await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^proekt-real-estate-ownership-register-registration-refusal-.*\.pdf$/);
  const local=await download.path();
  expect(local).toBeTruthy();
  const bytes=await readFile(local!);
  expect(bytes.subarray(0,4).toString()).toBe("%PDF");
  expect(bytes.length).toBeGreaterThan(500);
  const extracted=execFileSync("pdftotext",[local!,"-"],{encoding:"utf8"});
  expect(extracted).toContain("Росреестр отказал");
  expect(extracted).toContain("НЕ ГОТОВ К ПОДАЧЕ");
  expect(extracted.match(/НЕ ГОТОВ К ПОДАЧЕ/g)).toHaveLength(1);
  expect(extracted).not.toContain("ИЗЛОЖЕНИЕ ОБСТОЯТЕЛЬСТВ");
  await page.getByText("Дополнительные форматы (тестовый DOCX)").click();
  const docxPromise=page.waitForEvent("download");
  await page.getByRole("button",{name:"Скачать DOCX-черновик"}).click();
  const docx=await docxPromise;
  expect(docx.suggestedFilename()).toMatch(/\.docx$/);
  const docxPath=await docx.path();
  expect(docxPath).toBeTruthy();
  const docxBytes=await readFile(docxPath!);
  expect(docxBytes.subarray(0,2).toString()).toBe("PK");
  const xml=execFileSync("unzip",["-p",docxPath!,"word/document.xml"],{encoding:"utf8"});
  expect(xml).toContain("Росреестр отказал");
  expect(xml.match(/НЕ ГОТОВ К ПОДАЧЕ/g)).toHaveLength(1);
  expect(xml).not.toContain("ИЗЛОЖЕНИЕ ОБСТОЯТЕЛЬСТВ");
  await editor.fill((await editor.inputValue())+"\nТестовая редакторская пометка.");
  await expect(pdf).toBeDisabled();
  await page.getByRole("button",{name:"Сохранить новую редакцию"}).click();
  await expect(pdf).toBeEnabled();
  await expect(page.getByTestId("real-estate-version")).toHaveCount(2);
  const before=await editor.inputValue();
  await page.locator("#real-estate-summary").fill("Обновлены исходные тестовые сведения после сохранения версии");
  await expect(editor).toHaveValue(before);
  await expect(pdf).toBeDisabled();
  await expect(page.getByRole("status")).toContainText("Предыдущий проект сохранён неизменным");
  await page.getByRole("button",{name:"Проверить полноту тестовых сведений"}).click();
  await page.getByRole("button",{name:"Сформировать новую версию по анкете"}).click();
  await expect(pdf).toBeEnabled();
  await expect(editor).toHaveValue(/Обновлены исходные тестовые сведения/);
  await expect(page.getByTestId("real-estate-version")).toHaveCount(3);
  await page.getByTestId("real-estate-version").last().click();
  await expect(page.locator("#real-estate-summary")).toHaveValue(
    "Искусственные сведения для теста версии, без персональных данных и реквизитов"
  );
  await expect(pdf).toBeEnabled();
  await expect(editor).not.toHaveValue(/Обновлены исходные тестовые сведения/);
});

test("a share sale by auction with agricultural land is flagged for manual legal review",async ({page})=>{
  await page.goto("/dev/real-estate/shared-ownership/share-sale/");
  await page.locator("#real-estate-role").selectOption("собственник");
  await page.locator("#real-estate-propertyType").selectOption("земельный участок");
  await page.locator("#real-estate-stage").selectOption("переговоры и претензия");
  for(const field of ["summary","documents","goal","caseDetails"]){
    await page.locator("#real-estate-"+field).fill("Обезличенные тестовые обстоятельства сделки с долей");
  }
  await page.locator("#real-estate-transactionKind").selectOption("публичные торги");
  await page.locator("#real-estate-shareNotice").selectOption("извещение не направлялось");
  await page.locator("#real-estate-specialLandStatus").selectOption("земля сельскохозяйственного назначения");
  await page.getByRole("button",{name:"Проверить полноту тестовых сведений"}).click();
  const warnings=page.getByTestId("real-estate-review-flags");
  await expect(warnings).toBeVisible();
  await expect(warnings).toContainText("публичных");
  await expect(warnings).toContainText("сельскохозяйственного");
  await expect(warnings).toContainText("извещение");
  await page.getByRole("button",{name:"Сформировать предварительный проект"}).click();
  const editor=page.getByTestId("real-estate-document-editor");
  await expect(editor).toHaveValue(/публичные торги/);
  await expect(editor).toHaveValue(/сельскохозяйственного/);
  await expect(editor).toHaveValue(/НЕ ДОКУМЕНТ ДЛЯ ПОДАЧИ/);
  await expect(page.getByRole("button",{name:"Отправить на проверку юристу"})).toBeDisabled();
});

test("suspension and refusal lead to separate source-backed fact checks, never automatic legal conclusions",async ({page})=>{
  const scenarios=[
    {path:"/dev/real-estate/ownership-register/suspension-registration/",
      evidence:"только статус без текста уведомления",notice:"Проверенное общее положение"},
    {path:"/dev/real-estate/ownership-register/registration-refusal/",
      evidence:"только статус без текста решения",notice:"Проверенное общее положение"}
  ];
  for(const s of scenarios){
    await page.goto(s.path);
    await page.locator("#real-estate-role").selectOption("собственник");
    await page.locator("#real-estate-propertyType").selectOption("квартира");
    await page.locator("#real-estate-stage").selectOption("получен отказ");
    for(const key of ["summary","documents","goal","caseDetails"]){
      await page.locator("#real-estate-"+key).fill("Синтетические обстоятельства для проверки решения регистратора без личных реквизитов");
    }
    await page.locator("#real-estate-registrationDecision").selectOption(s.evidence);
    await page.locator("#real-estate-correctionEvidence").selectOption("не знаю");
    if(s.path.includes("registration-refusal")){
      await page.locator("#real-estate-priorSuspension").selectOption("не знаю");
    }else{
      await page.locator("#real-estate-registrationDecisionDate").fill("2026-11-20");
      await page.locator("#real-estate-suspensionAppealStage").selectOption("обжаловано в суд");
    }
    await page.getByRole("button",{name:"Проверить полноту тестовых сведений"}).click();
    const flags=page.getByTestId("real-estate-review-flags");
    await expect(flags).toContainText("статьи 26");
    await expect(flags).toContainText("статьи 27");
    await expect(flags).toContainText("историю обращений");
    await page.getByRole("button",{name:"Сформировать предварительный проект"}).click();
    const editor=page.getByTestId("real-estate-document-editor");
    await expect(editor).toHaveValue(/НЕ ГОТОВ К ПОДАЧЕ/);
    await expect(editor).toHaveValue(/статьи 26/);
    await expect(page.getByRole("heading",{name:s.notice}).first()).toBeVisible();
    if(s.path.includes("suspension-registration")){
      await expect(flags).toContainText("15 рабочих дней");
      await expect(flags).toContainText("Судебное обжалование препятствует");
      await expect(editor).toHaveValue(/15 рабочих дней/);
    }else{
      await expect(flags).not.toContainText("15 рабочих дней");
    }
    await expect(page.getByRole("button",{name:"Отправить на проверку юристу"})).toBeDisabled();
  }
});

test("DDU delay distinguishes notice from agreement without calculating penalties",async ({page})=>{
  await page.goto("/dev/real-estate/newbuild-ddu/developer-delay/");
  await page.locator("#real-estate-role").selectOption("дольщик");
  await page.locator("#real-estate-propertyType").selectOption("квартира");
  await page.locator("#real-estate-stage").selectOption("переговоры и претензия");
  for(const key of ["summary","documents","goal","caseDetails"]){
    await page.locator("#real-estate-"+key).fill("Обезличенные сведения для проверки срока передачи");
  }
  await page.locator("#real-estate-dduAmendment").selectOption("только уведомление или предложения");
  await page.locator("#real-estate-dduTransfer").selectOption("не передан");
  await page.getByRole("button",{name:"Проверить полноту тестовых сведений"}).click();
  const flags=page.getByTestId("real-estate-review-flags");
  await expect(flags).toContainText("договорный срок");
  await expect(flags).toContainText("временные правила");
  await expect(page.getByRole("heading",{name:"Проверенное общее положение"})).toBeVisible();
  await page.getByRole("button",{name:"Сформировать предварительный проект"}).click();
  const editor=page.getByTestId("real-estate-document-editor");
  await expect(editor).toHaveValue(/НЕ ДОКУМЕНТ ДЛЯ ПОДАЧИ/);
  await expect(editor).toHaveValue(/только уведомление или предложения/);
  await expect(page.getByRole("button",{name:"Отправить на проверку юристу"})).toBeDisabled();
});

test("boundary consent without notice is not treated as consent",async ({page})=>{
  await page.goto("/dev/real-estate/land-boundaries/boundary-approval/");
  await page.locator("#real-estate-role").selectOption("собственник");
  await page.locator("#real-estate-propertyType").selectOption("земельный участок");
  await page.locator("#real-estate-stage").selectOption("переговоры и претензия");
  for(const key of ["summary","documents","goal","caseDetails"])await page.locator("#real-estate-"+key).fill("Обезличенные сведения о границе участка");
  await page.locator("#real-estate-boundaryNotice").selectOption("доказательств нет или не знаю");
  await page.locator("#real-estate-boundaryObjection").selectOption("возражений нет или не знаю");
  await page.locator("#real-estate-boundaryAct").selectOption("не знаю");
  await page.getByRole("button",{name:"Проверить полноту тестовых сведений"}).click();
  await expect(page.getByTestId("real-estate-review-flags")).toContainText("не означает автоматически согласие");
  await page.getByRole("button",{name:"Сформировать предварительный проект"}).click();
  await expect(page.getByTestId("real-estate-document-editor")).toHaveValue(/НЕ ДОКУМЕНТ ДЛЯ ПОДАЧИ/);
  await expect(page.getByRole("button",{name:"Отправить на проверку юристу"})).toBeDisabled();
});


test("a sale claim exports the exact text with verified statute and no questionnaire headings",async ({page})=>{
  await page.goto("/dev/real-estate/property-transactions/seller-no-transfer/");
  await page.locator("#real-estate-role").selectOption("покупатель");
  await page.locator("#real-estate-propertyType").selectOption("квартира");
  await page.locator("#real-estate-stage").selectOption("переговоры и претензия");
  for(const key of ["summary","documents","goal","caseDetails"])await page.locator("#real-estate-"+key).fill("Синтетическое описание обстоятельств для проверки претензии");
  await page.locator("#real-estate-saleContract").fill("договор от 01.10.2026");
  await page.locator("#real-estate-saleObject").fill("условный объект");
  await page.locator("#real-estate-saleDueDate").fill("2026-10-15");
  await page.locator("#real-estate-saleBreachConfirmed").selectOption("да");
  await page.locator("#real-estate-handoverAct").selectOption("нет");
  await page.locator("#real-estate-handoverPossession").selectOption("нет");
  await page.getByRole("button",{name:"Проверить полноту тестовых сведений"}).click();
  await page.getByRole("button",{name:"Сформировать предварительный проект"}).click();
  const editor=page.getByTestId("real-estate-document-editor");
  await expect(editor).toHaveValue(/статьи 556 ГК РФ/);
  await expect(editor).not.toHaveValue(/ИЗЛОЖЕНИЕ ОБСТОЯТЕЛЬСТВ|ДО ПОДАЧИ НЕОБХОДИМО|Вопросы для проверки/);
  const pdfPromise=page.waitForEvent("download");
  await page.getByRole("button",{name:"Скачать PDF"}).click();
  const pdf=await pdfPromise;
  const pdfPath=await pdf.path();expect(pdfPath).toBeTruthy();
  const extracted=execFileSync("pdftotext",[pdfPath!,"-"],{encoding:"utf8"});
  expect(extracted.replace(/\s+/g," ")).toContain("статьи 556 ГК РФ");
  expect(extracted.match(/НЕ ГОТОВ К ПОДАЧЕ/g)).toHaveLength(1);
  await page.getByText("Дополнительные форматы (тестовый DOCX)").click();
  const docxPromise=page.waitForEvent("download");
  await page.getByRole("button",{name:"Скачать DOCX-черновик"}).click();
  const docx=await docxPromise;
  const docxPath=await docx.path();expect(docxPath).toBeTruthy();
  const xml=execFileSync("unzip",["-p",docxPath!,"word/document.xml"],{encoding:"utf8"});
  expect(xml).toContain("статьи 556 ГК РФ");
  expect(xml.match(/НЕ ГОТОВ К ПОДАЧЕ/g)).toHaveLength(1);
  await expect(page.getByRole("button",{name:"Сохранить в мои документы"})).toHaveCount(0);
});

import {test,expect} from "@playwright/test";
import {readFileSync} from "node:fs";

async function fillQuestions(page:import("@playwright/test").Page){
  const section=page.getByTestId("credit-debt-scenario-flow");
  const fields=section.locator("select,input,textarea");
  for(let i=0;i<await fields.count();i++){
    const field=fields.nth(i);
    if(await field.evaluate(el=>el.tagName==="SELECT")){
      const choices=await field.locator("option").evaluateAll(options=>
        options.map(x=>(x as HTMLOptionElement).value).filter(value=>value!==""));
      await field.selectOption(choices.find(value=>value!=="да")??choices[0]);
    }else if(await field.getAttribute("type")==="date")await field.fill("2026-11-10");
    else await field.fill("Условная ситуация для тестирования без реальных персональных данных");
  }
  await page.getByRole("button",{name:"Продолжить — проверить сведения"}).click();
  await expect(page.getByRole("heading",{name:"Предварительный чек-лист"})).toBeVisible();
}
async function fillDocument(page:import("@playwright/test").Page){
  const fields=page.getByTestId("credit-debt-draft-form").locator("textarea");
  const n=await fields.count();
  expect(n).toBeGreaterThanOrEqual(6);
  for(let i=0;i<n;i++){
    const field=fields.nth(i);
    const key=await field.getAttribute("data-field-key");
    if(key==="facts")await field.fill("Условное описание фактических обстоятельств, даты обращения и обстоятельств исполнения обязательства.");
    else if(key==="applicant")await field.fill("Тестовый заявитель, без личных данных");
    else if(key==="recipient")await field.fill("Условная финансовая организация, компетенция требует проверки");
    else if(key==="attachments")await field.fill("Копия условного договора, условная выписка");
    else if(key==="evidence")await field.fill("Выписка и договор для тестирования");
    else await field.fill("Условный номер договора без персональных данных");
  }
}
test("credit draft: original navigator actions, editable revisions, PDF/DOCX and review consent",async ({page})=>{
  test.setTimeout(150000);
  await page.goto("/kredity-dolgi/contract-terms/early-repayment/");
  await fillQuestions(page);
  await expect(page.getByTestId("credit-debt-document-workbench")).toBeVisible();
  await fillDocument(page);
  await page.getByRole("button",{name:"Сформировать проект документа"}).click();
  const editor=page.getByTestId("credit-debt-document-editor");
  await expect(editor).toBeVisible();
  await expect(editor).toHaveValue(/ПРОЕКТ ОБРАЩЕНИЯ/);
  await expect(editor).toHaveValue(/Досрочное погашение и перерасчёт процентов/);
  const actions=page.getByTestId("credit-debt-final-actions");
  await expect(actions.getByRole("button",{name:"Скачать PDF"})).toBeEnabled();
  await expect(actions.getByRole("button",{name:"Отправить на проверку юристу"})).toBeEnabled();
  await expect(actions.getByRole("button",{name:"Сохранить в мои документы"})).toBeVisible();
  await expect(actions.getByText(/Дополнительные форматы/)).toBeVisible();

  await editor.fill((await editor.inputValue())+"\nДополнение к условным обстоятельствам.");
  await expect(actions.getByRole("button",{name:"Скачать PDF"})).toBeDisabled();
  await expect(actions.getByRole("button",{name:"Отправить на проверку юристу"})).toBeDisabled();
  await page.getByRole("button",{name:"Сохранить новую версию"}).click();
  await expect(actions.getByRole("button",{name:"Скачать PDF"})).toBeEnabled();
  await expect(page.getByText("Предыдущие версии в этой вкладке")).toBeVisible();

  const pdfEvent=page.waitForEvent("download");
  await actions.getByRole("button",{name:"Скачать PDF"}).click();
  const pdf=await pdfEvent;
  expect(pdf.suggestedFilename()).toMatch(/^proekt-credit-debt-.*\.pdf$/);
  const raw=readFileSync(await pdf.path());
  expect(raw.subarray(0,5).toString()).toBe("%PDF-");
  expect(raw.length).toBeGreaterThan(1500);
  await actions.getByText(/Дополнительные форматы/).click();
  const docxEvent=page.waitForEvent("download");
  await actions.getByRole("button",{name:"Скачать DOCX-черновик"}).click();
  const docx=await docxEvent;
  expect(docx.suggestedFilename()).toMatch(/\.docx$/);
  const docxBytes=readFileSync(await docx.path());
  expect(docxBytes.subarray(0,2).toString()).toBe("PK");
  expect(docxBytes.length).toBeGreaterThan(1500);
  await actions.getByRole("button",{name:"Отправить на проверку юристу"}).click();
  await expect(actions.getByTestId("document-review-form")).toBeVisible();
  await expect(actions.getByRole("checkbox")).toHaveCount(2);
});

test("bankruptcy through MFC produces only checklist with safe PDF and no false court application",async ({page})=>{
  test.setTimeout(120000);
  await page.goto("/kredity-dolgi/bankruptcy/out-of-court-mfc/");
  await fillQuestions(page);
  await fillDocument(page);
  await page.getByRole("button",{name:"Сформировать предварительный чек-лист"}).click();
  const editor=page.getByTestId("credit-debt-document-editor");
  await expect(editor).toHaveValue(/ПРЕДВАРИТЕЛЬНЫЙ ЧЕК-ЛИСТ/);
  await expect(editor).toHaveValue(/МФЦ/);
  await expect(editor).not.toHaveValue(/ИСКОВОЕ ЗАЯВЛЕНИЕ/);
  await expect(page.getByTestId("credit-debt-final-actions").getByRole("button",{name:"Скачать PDF"})).toBeEnabled();
  await expect(page.locator("meta[name='robots']")).toHaveAttribute("content",/noindex/);
});

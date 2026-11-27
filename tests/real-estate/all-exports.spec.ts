import {expect,test} from "@playwright/test";
import {execFileSync} from "node:child_process";
import {readFile} from "node:fs/promises";
import {REAL_ESTATE_GROUPS} from "../../src/data/real-estate-route-plan";
import {getRealEstateIntakeSpec} from "../../src/lib/real-estate-intake";

const normalize=(text:string)=>text.replace(/\s+/g," ").trim();
for(const group of REAL_ESTATE_GROUPS){
  test("all PDF/DOCX exports: "+group.id,async({page})=>{
    test.setTimeout(300_000);
    for(const situation of group.situations){
      const key=group.id+"/"+situation.id;
      const spec=getRealEstateIntakeSpec(group.id,situation.id);
      if(!spec)throw Error(key);
      await page.goto("/dev/real-estate/"+key+"/");
      const marker="Контрольный текст "+situation.id;
      for(const field of spec.fields){
        if(!field.required)continue;
        const input=page.locator("#real-estate-"+field.key);
        if(field.kind==="choice")await input.selectOption(field.choices![0]);
        else await input.fill(field.kind==="date"?"2026-10-15":marker);
      }
      await page.getByRole("button",{name:"Проверить полноту тестовых сведений"}).click();
      await page.getByRole("button",{name:"Сформировать предварительный проект"}).click();
      const editor=page.getByTestId("real-estate-document-editor");
      await expect(editor).toHaveValue(new RegExp(marker));
      const text=await editor.inputValue();
      const first=text.split("\n")[0];
      const pdfPromise=page.waitForEvent("download");
      await page.getByRole("button",{name:"Скачать PDF"}).click();
      const pdf=await pdfPromise;
      const pdfPath=await pdf.path();expect(pdfPath,key).toBeTruthy();
      const pdfBytes=await readFile(pdfPath!);expect(pdfBytes.subarray(0,4).toString(),key).toBe("%PDF");
      const extracted=normalize(execFileSync("pdftotext",[pdfPath!,"-"],{encoding:"utf8"}));
      expect(extracted,key).toContain(normalize(first));
      expect(extracted,key).toContain(marker);
      expect(extracted.split(normalize(first)).length-1,key).toBe(1);
      await page.getByText("Дополнительные форматы (тестовый DOCX)").click();
      const docxPromise=page.waitForEvent("download");
      await page.getByRole("button",{name:"Скачать DOCX-черновик"}).click();
      const docx=await docxPromise;
      const docxPath=await docx.path();expect(docxPath,key).toBeTruthy();
      const xml=execFileSync("unzip",["-p",docxPath!,"word/document.xml"],{encoding:"utf8"});
      expect(xml,key).toContain(first);
      expect(xml,key).toContain(marker);
      expect(xml.split(first).length-1,key).toBe(1);
      await expect(page.getByRole("button",{name:"Отправить на проверку юристу"})).toBeDisabled();
    }
  });
}

import { mkdirSync, writeFileSync } from "node:fs";
import { buildMilitaryLiveAudit } from "./lib/audit-military-sources";

async function main() {
  const result=await buildMilitaryLiveAudit();
  const dir="reports/military-source-audit";
  mkdirSync(dir,{recursive:true});
  writeFileSync(dir+"/result.json",JSON.stringify(result,null,2)+"\n");
  const lines=[
    "# Контроль первоисточников военного права",
    "",
    "Проверяются доступность ранее зафиксированных источников и наличие точных выдержек.",
    "Этот отчёт не подтверждает юридическую применимость нормы или готовность документа к подаче.",
    "",
    "- Ситуаций в очереди: "+result.totalSituations,
    "- Тезисов с записанными подтверждениями: "+result.recordedClaims,
    "- Тезисов с двумя доступными совпадающими выдержками: "+result.liveTwoSourceMatches,
    "- Ситуаций без записанной полноценной сверки: "+result.pendingCases,
    "",
    "| Ситуация | Результат | Источники |",
    "| --- | --- | --- |"
  ];
  for(const claim of result.claims) lines.push(
    "| "+claim.topicSlug+" / "+claim.situationIndex+" | "+claim.liveStatus+" | "+
    claim.checks.map(c=>c.publisher+": "+c.status).join("; ")+" |"
  );
  lines.push("","Остальные ситуации доступны в result.json как очередь проверки без присвоения статуса «проверено».","");
  writeFileSync(dir+"/result.md",lines.join("\n"));
  console.log(JSON.stringify({totalSituations:result.totalSituations,recordedClaims:result.recordedClaims,
    liveTwoSourceMatches:result.liveTwoSourceMatches,pendingCases:result.pendingCases},null,2));
  console.log("Report: "+dir+"/result.json");
}
main().catch(error=>{console.error(error);process.exitCode=1;});

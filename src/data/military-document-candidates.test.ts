import assert from "node:assert/strict";
import { MILITARY_TOPICS } from "@/data/military-catalog";
import { getMilitaryDocumentCandidate, buildMilitaryDraft, militaryDraftCandidateCount } from "@/data/military-document-candidates";
assert.equal(militaryDraftCandidateCount(),18);
let enabled=0,informational=0;
for(const topic of MILITARY_TOPICS)for(const situation of topic.situations){
 const doc=getMilitaryDocumentCandidate(topic,situation);
 if(situation.kind==="information"){informational++;assert.equal(doc,null);}
 if(!doc)continue;enabled++;
 const content=buildMilitaryDraft(doc,{applicant:"Тестовый заявитель, статус",recipient:"Командиру части",facts:"Сведения об обстоятельствах, даты и номера документов.",request:"Прошу предоставить мотивированный ответ",attachments:"Копии обращений"});
 assert(content.includes("ЧЕРНОВИК — НЕ ГОТОВ К ПОДАЧЕ"));
 assert(content.includes(doc.subject));
 assert(doc.factsPrompt.length>30);
 assert(doc.requestText.length>40);
 assert(content.includes(doc.requestText));
 assert(doc.sourceRefs && doc.sourceRefs.length > 0);
 assert(content.includes("ИСТОЧНИКИ ДЛЯ ПРАВОВОЙ СВЕРКИ"));
 assert(content.includes(doc.sourceRefs[0].url));
 assert(!content.includes("Прошу предоставить мотивированный ответ"),"Generator must use a case-specific request, not a generic input");
 assert(content.includes("Приложения:"));
}
assert.equal(enabled,18);
assert(informational>0);
console.log(JSON.stringify({enabled,informational}));

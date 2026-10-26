import assert from "node:assert/strict";
import {MILITARY_DOCUMENT_BLUEPRINTS,getMilitaryDocumentBlueprint} from "@/data/military-document-blueprints";
import {MILITARY_ROUTES} from "@/data/military-route-plans";
import {MILITARY_READY_DRAFT_KEYS,getMilitaryDraftFields,prepareMilitaryOfficialDraft} from "@/lib/military-official-document-drafts";

const scenarioKeys=MILITARY_ROUTES.flatMap(route=>route.scenarios.filter(s=>s.kind!=="URGENT_INSTRUCTION").map(s=>s.key));
assert.deepEqual([...MILITARY_DOCUMENT_BLUEPRINTS.map(b=>b.scenarioKey)].sort(),[...scenarioKeys].sort());
assert.equal(new Set(MILITARY_DOCUMENT_BLUEPRINTS.map(b=>b.slug)).size,MILITARY_DOCUMENT_BLUEPRINTS.length);
for(const b of MILITARY_DOCUMENT_BLUEPRINTS){
 assert.match(b.title,/^(Рапорт|Заявление|Административное исковое заявление)/);
 assert.ok(b.facts.length>=2,b.scenarioKey);
 assert.ok(b.requiredRequisites.length>=6,b.scenarioKey);
 assert.ok(b.legalSources.length>=1,b.scenarioKey);
 assert.ok(b.legalSources.every(s=>s.url.startsWith("https://")));
 assert.ok(b.needsIndividualLegalReview&&!b.isPubliclyReleased);
 assert.ok(!/чек-лист|анкета|опросник/iu.test(b.title));
 if(b.type==="Административное исковое заявление"){
  assert.ok(b.requiredRequisites.includes("Административный ответчик и адрес"));
  assert.ok(b.legalSources.some(s=>s.citation.includes("КАС")));
 }
}
assert.equal(MILITARY_READY_DRAFT_KEYS.length,2);
for(const key of MILITARY_READY_DRAFT_KEYS){
 assert.ok(getMilitaryDocumentBlueprint(key));
 assert.ok(getMilitaryDraftFields(key).length>=7);
 const blank=prepareMilitaryOfficialDraft(key,{
  recipient:"",applicantName:"",applicantPosition:"",contactMethod:"",date:"",attachments:""
 });
 assert.equal(blank.draft,null);
 assert.ok(blank.missing.length>=7);
 const filled=prepareMilitaryOfficialDraft(key,{
  recipient:"Начальнику уполномоченного финансового органа",
  applicantName:"Иванов Иван Иванович",
  applicantPosition:"Военнослужащий",
  contactMethod:"Почтовый адрес для ответа",
  date:"26.10.2026",
  attachments:"Нет",
  documentKind:"Выписка из приказа о назначении на должность",
  paymentPeriod:"Январь — март 2026",
  paymentKinds:"Ежемесячная надбавка"
 });
 assert.equal(filled.missing.length,0);
 assert.ok(filled.draft?.includes("Иванов Иван Иванович"));
 assert.ok(filled.draft?.includes("Подпись:"));
 assert.ok(filled.draft?.includes(key==="pay-breakdown"?"Январь — март 2026":"Выписка из приказа"));
 assert.ok(!/ПРЕДВАРИТЕЛЬНЫЙ ЧЕК-ЛИСТ/u.test(filled.draft??""));
}
console.log("Military 17-document blueprint and 2 service drafts: PASS");

import assert from "node:assert/strict";
import {MILITARY_DOCUMENT_BLUEPRINTS,getMilitaryDocumentBlueprint} from "@/data/military-document-blueprints";
import {MILITARY_ROUTES} from "@/data/military-route-plans";
import {MILITARY_READY_DRAFT_KEYS,getMilitaryDraftFields,prepareMilitaryOfficialDraft} from "@/lib/military-official-document-drafts";
import {MILITARY_COMPOSABLE_SCENARIOS,getMilitaryDocumentFields,composeMilitaryDocument} from "@/lib/military-document-composer";
import {MILITARY_FIRST_DOCUMENT_PAGES} from "@/data/military-first-document-pages";

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

assert.equal(MILITARY_COMPOSABLE_SCENARIOS.length,17);
assert.equal(MILITARY_FIRST_DOCUMENT_PAGES.length,17);
for(const blueprint of MILITARY_DOCUMENT_BLUEPRINTS){
 const fields=getMilitaryDocumentFields(blueprint.scenarioKey);
 const fieldMap=new Map(fields.map(field=>[field.key,field]));
 assert.equal(fieldMap.size,fields.length,"Duplicate input field in "+blueprint.scenarioKey);
 const empty=composeMilitaryDocument(blueprint.scenarioKey,{});
 assert.equal(empty.document,null,"Incomplete legal document must not be fabricated");
 assert.ok(empty.missing.length>0);
 const answers=Object.fromEntries(fields.map(f=>[f.key,
  f.key==="date"?"26.10.2026":
  f.key==="applicantName"?"Иванов Иван Иванович":
  f.key==="applicantBirth"?"01.01.1985, город Москва":
  f.key==="fact-0"?"Конкретное документально подтверждённое обстоятельство":
  "Подтверждённые сведения из документов"
 ]));
 const result=composeMilitaryDocument(blueprint.scenarioKey,answers);
 assert.deepEqual(result.missing,[],"All required facts covered: "+blueprint.scenarioKey);
 assert.ok(result.document,"Document not generated: "+blueprint.scenarioKey);
 assert.equal(result.document!.title,blueprint.title);
 assert.equal(result.document!.slug,blueprint.slug);
 assert.ok(result.document!.text.includes("Подпись:"));
 assert.doesNotMatch(result.document!.text,/чек-лист|анкета|опросник/iu);
 assert.equal(result.document!.filingReady,false);
 const seo=MILITARY_FIRST_DOCUMENT_PAGES.find(doc=>doc.slug===blueprint.slug);
 assert.ok(seo,"Canonical document metadata missing: "+blueprint.scenarioKey);
 assert.ok(seo!.seoTitle?.includes("скачать PDF"));
 assert.ok(seo!.seoDescription&&seo!.seoDescription.length>80);
 if(blueprint.type==="Административное исковое заявление"){
  assert.match(result.document!.text,/КАС РФ/);
  assert.match(result.document!.text,/Административный ответчик/);
 }
}
console.log("Military document-first migration: 17 unique legal-document drafts and SEO metadata PASS");


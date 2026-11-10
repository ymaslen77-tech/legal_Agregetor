import assert from "node:assert/strict";
import { CREDIT_DEBT_QNA_SIGNALS,proposeCreditDebtQnaSituations } from "./credit-debt-qna-matcher";
import { getCreditDebtStageOneGroups } from "./credit-debt-stage-one";

const items=getCreditDebtStageOneGroups().flatMap(g=>g.situations.map(s=>g.id+"/"+s.id));
assert.equal(items.length,35);
assert.deepEqual(Object.keys(CREDIT_DEBT_QNA_SIGNALS).sort(),[...items].sort());
for(const [id,signals] of Object.entries(CREDIT_DEBT_QNA_SIGNALS)){
  assert.ok(signals.length>=2,id);
  assert.ok(signals.every(p=>p.trim().length>=15&&p.includes(" ")),id);
}
const search=(text:string,slug="kredity-dolgi")=>proposeCreditDebtQnaSituations({serviceSlug:slug,title:text});
assert.ok(search("Подскажите, банк неправильно начислил проценты").some(x=>x.situationId==="interest-calculation"));
assert.ok(search("МФО отказалась: микрозайм оформили без моего согласия", "kreditnye-voprosy-i-spory").some(x=>x.situationId==="microloan-not-mine"));
assert.ok(search("Пожалуйста помогите, коллекторы звонят родственникам!").some(x=>x.situationId==="contact-third-parties"));
assert.ok(search("Как оформить кредитные каникулы через банк?").some(x=>x.situationId==="credit-holidays-request"));
assert.ok(search("Нужно подать возражения на судебный приказ по кредиту").some(x=>x.situationId==="court-order-objection"));
assert.deepEqual(search("Мне нужен юрист по долгу"),[],"Generic credit title must not be classified");
assert.deepEqual(search("Кредитные каникулы военнослужащего","voennoe-pravo"),[],"Mismatched historical taxonomy must not be forcibly reclassified");
assert.deepEqual(search("Банк неправильно начислил проценты","unknown-service"),[]);
assert.deepEqual(search("банк неправильно начислил проценты".repeat(1500)),[]);
assert.ok(search("Коллекторы угрожают расправой").every(c=>c.status==="CANDIDATE_ONLY_REVIEW_REQUIRED"));
console.log("Credit/debt Q&A candidate matcher PASS: 35 exact signal sets; strong title/text match, conservative unknown and cross-category behavior.");

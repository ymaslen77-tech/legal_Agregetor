import type { MilitarySituation, MilitaryTopic } from "@/data/military-catalog";
export type MilitaryDocumentType = "REQUEST_COPY"|"VVK_REVIEW"|"REPORT"|"COMPLAINT"|"PAYMENT_REQUEST";
export type MilitaryDocumentCandidate = Readonly<{kind:MilitaryDocumentType;subject:string;title:string}>;
const candidates:Readonly<Record<string,MilitaryDocumentCandidate>>={
  "kontraktnaya-sluzhba|Как получить копию заключённого контракта?":{kind:"REQUEST_COPY",subject:"Копия контракта о прохождении военной службы",title:"Как получить копию заключённого контракта?"},
  "prizyv|Как получить копию решения призывной комиссии?":{kind:"REQUEST_COPY",subject:"Копия решения призывной комиссии",title:"Как получить копию решения призывной комиссии?"},
  "vvk-i-kategoriya-godnosti|Как получить копию заключения ВВК?":{kind:"REQUEST_COPY",subject:"Копия заключения военно-врачебной комиссии",title:"Как получить копию заключения ВВК?"},
  "vvk-i-kategoriya-godnosti|Как пройти повторную ВВК при ухудшении состояния здоровья?":{kind:"VVK_REVIEW",subject:"Направление на контрольное обследование и повторное освидетельствование",title:"Как пройти повторную ВВК при ухудшении состояния здоровья?"},
  "vvk-i-kategoriya-godnosti|Как обжаловать заключение ВВК?":{kind:"VVK_REVIEW",subject:"Проверка заключения ВВК вышестоящей комиссией",title:"Как обжаловать заключение ВВК?"},
  "raporty-i-obrashcheniya|Как подать рапорт командиру воинской части?":{kind:"REPORT",subject:"Рассмотрение рапорта командованием",title:"Как подать рапорт командиру воинской части?"},
  "raporty-i-obrashcheniya|Что делать, если командир не принимает рапорт?":{kind:"COMPLAINT",subject:"Отказ в принятии рапорта",title:"Что делать, если командир не принимает рапорт?"},
  "raporty-i-obrashcheniya|Как получить письменное решение по поданному обращению?":{kind:"REQUEST_COPY",subject:"Письменное решение по поданному обращению",title:"Как получить письменное решение по поданному обращению?"},
  "uvolnenie-s-voennoy-sluzhby|Как подать рапорт об увольнении по семейным обстоятельствам?":{kind:"REPORT",subject:"Рассмотрение вопроса об увольнении по семейным обстоятельствам",title:"Как подать рапорт об увольнении по семейным обстоятельствам?"},
  "uvolnenie-s-voennoy-sluzhby|Что делать, если командование не рассматривает рапорт об увольнении?":{kind:"COMPLAINT",subject:"Бездействие при рассмотрении рапорта об увольнении",title:"Что делать, если командование не рассматривает рапорт об увольнении?"},
  "perevod-v-druguyu-chast|Как подать рапорт о переводе в другую воинскую часть?":{kind:"REPORT",subject:"Рассмотрение вопроса о переводе в другую воинскую часть",title:"Как подать рапорт о переводе в другую воинскую часть?"},
  "otpusk-voennosluzhashchego|Как получить основной отпуск военнослужащему?":{kind:"REPORT",subject:"Предоставление основного отпуска",title:"Как получить основной отпуск военнослужащему?"},
  "otpusk-voennosluzhashchego|Как получить отпуск по семейным обстоятельствам?":{kind:"REPORT",subject:"Предоставление отпуска по семейным обстоятельствам",title:"Как получить отпуск по семейным обстоятельствам?"},
  "denezhnoe-dovolstvie|Как получить расчётные документы о начислениях и удержаниях?":{kind:"REQUEST_COPY",subject:"Расчётные сведения о начислениях и удержаниях денежного довольствия",title:"Как получить расчётные документы о начислениях и удержаниях?"},
  "denezhnoe-dovolstvie|Как оспорить неправильный расчёт выплат?":{kind:"PAYMENT_REQUEST",subject:"Проверка расчёта и перерасчёт денежных выплат",title:"Как оспорить неправильный расчёт выплат?"},
  "denezhnoe-dovolstvie|Что делать, если военнослужащему не выплачивают денежное довольствие?":{kind:"PAYMENT_REQUEST",subject:"Проверка задолженности по денежному довольствию",title:"Что делать, если военнослужащему не выплачивают денежное довольствие?"},
  "ranenie-travma-gospital|Что делать, если командование не направляет на лечение?":{kind:"REPORT",subject:"Направление для оказания необходимой медицинской помощи",title:"Что делать, если командование не направляет на лечение?"},
  "voinskiy-uchet-i-dokumenty|Что делать при отказе в выдаче военного билета?":{kind:"COMPLAINT",subject:"Отказ в выдаче документа воинского учёта",title:"Что делать при отказе в выдаче военного билета?"},
};
/**
 * Exact allowlist only. Most situations have NO generic generator.
 * Every output is a non-filing-ready draft; no generator determines entitlement.
 */
export function getMilitaryDocumentCandidate(topic:MilitaryTopic,situation:MilitarySituation):MilitaryDocumentCandidate|null {
 if(situation.kind==="information")return null;
 return candidates[topic.slug+"|"+situation.title]??null;
}
export function militaryDraftCandidateCount(){return Object.keys(candidates).length;}
export type MilitaryDraftInput=Readonly<{applicant:string;recipient:string;facts:string;request:string;attachments?:string}>;
function clean(value:string,max=3000){return value.trim().slice(0,max);}
export function buildMilitaryDraft(candidate:MilitaryDocumentCandidate,input:MilitaryDraftInput):string{
 const applicant=clean(input.applicant,500),recipient=clean(input.recipient,500),facts=clean(input.facts),request=clean(input.request),attachments=clean(input.attachments??"",1500);
 if(applicant.length<5||recipient.length<5||facts.length<15||request.length<10)throw new Error("Не заполнены необходимые реквизиты и факты обращения.");
 const heading=candidate.kind==="REPORT"?"РАПОРТ":candidate.kind==="COMPLAINT"?"ЖАЛОБА":"ЗАЯВЛЕНИЕ";
 const intro=candidate.kind==="REQUEST_COPY"?"Прошу предоставить документ или сведения по следующему вопросу:"
 :candidate.kind==="VVK_REVIEW"?"Прошу рассмотреть обращение о проверке заключения военно-врачебной комиссии:"
 :candidate.kind==="PAYMENT_REQUEST"?"Прошу провести проверку начисления и выплаты денежного довольствия:"
 :candidate.kind==="COMPLAINT"?"Прошу проверить обстоятельства нарушения и принять решение в пределах компетенции:"
 :"Прошу рассмотреть следующий вопрос в установленном порядке:";
 const date=new Intl.DateTimeFormat("ru-RU").format(new Date());
 return [
  "ЧЕРНОВИК — НЕ ГОТОВ К ПОДАЧЕ. ТРЕБУЕТСЯ ЮРИДИЧЕСКАЯ ПРОВЕРКА.","",
  "Кому: "+recipient,
  "От: "+applicant,"",heading,"",
  "Предмет обращения: "+candidate.subject,"",
  "Обстоятельства:",facts,"",
  intro,request,"",
  ...(attachments?["Приложения:",attachments,""]:[]),
  "Дата: "+date,"Подпись: __________________","",
  "Примечание: перед направлением проверьте компетенцию адресата, полномочия заявителя, форму обращения и действующие нормы."
 ].join("\n");
}

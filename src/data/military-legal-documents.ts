import type {NavigatorDocument} from "@/data/documents";
import {MILITARY_ROUTES} from "@/data/military-route-plans";

/**
 * Curated legal documents, not diagnostic surveys. Based on published examples
 * and statutes; each court filing still requires individual jurisdiction review.
 * Never put user-entered data into slugs, metadata or analytics.
 */
export type MilitaryDocumentKind="report"|"statement"|"complaint"|"court";
export type MilitaryLegalDocument={
 scenarioKey:string;routeId:string;slug:string;title:string;formLabel:string;
 kind:MilitaryDocumentKind;subject:string;request:string;fields:readonly string[];
 sourceIds:readonly string[];exampleUrl:string;
};
export const MILITARY_LEGAL_FIELDS:Readonly<Record<string,{label:string;hint:string}>>={
  "recipient": {
    "label": "Наименование компетентного получателя",
    "hint": "Укажите командира, руководителя, комиссию или орган, принимающий именно этот документ. Уточните по служебным документам или официальному справочнику."
  },
  "applicant": {
    "label": "Фамилия, имя и отчество заявителя",
    "hint": "Данные лица, от имени которого направляется документ."
  },
  "postal": {
    "label": "Почтовый адрес для ответа",
    "hint": "Адрес для направления ответа; допускается дополнить контактами самостоятельно."
  },
  "service": {
    "label": "Звание, должность или подтверждённый статус",
    "hint": "Укажите фактический статус; номер воинской части и её дислокацию не размещайте в открытых источниках."
  },
  "instrument": {
    "label": "Какой приказ, решение, контракт или обращение относится к делу?",
    "hint": "Дата, номер и наименование, если известны. Если реквизитов нет, назовите вид документа."
  },
  "date": {
    "label": "Когда получили решение либо узнали о нарушении?",
    "hint": "Дата существенна для проверки срока обращения, особенно в суд."
  },
  "facts": {
    "label": "Подтверждённые обстоятельства по документам",
    "hint": "Кратко опишите юридически значимые факты, не дублируя выбранную ситуацию и не раскрывая секретные сведения."
  },
  "grounds": {
    "label": "Точное основание по документам",
    "hint": "Укажите основание, подтверждающий документ и обстоятельства; не предполагайте автоматического права."
  },
  "proof": {
    "label": "Какие документы приложите в подтверждение?",
    "hint": "Перечислите имеющиеся доказательства и их даты. Не прикладывайте медицинские данные на сайте."
  },
  "desired": {
    "label": "Уточнение просьбы или требований",
    "hint": "Сформулируйте точный объём того, что хотите получить, в рамках указанной правовой процедуры."
  },
  "period": {
    "label": "За какой период нужны сведения?",
    "hint": "Например, с 01.2026 по 04.2026."
  },
  "payment": {
    "label": "Какая выплата, надбавка или удержание оспаривается?",
    "hint": "Укажите её название, период и известный расчёт, если он есть."
  },
  "relation": {
    "label": "Кем вы приходитесь военнослужащему?",
    "hint": "Укажите юридически значимое родство и документ, его подтверждающий."
  },
  "vvk": {
    "label": "Реквизиты заключения ВВК",
    "hint": "Дата, номер при наличии, категория годности или вывод без записи диагноза."
  },
  "disagreement": {
    "label": "С каким конкретным выводом ВВК вы не согласны?",
    "hint": "Не переписывайте диагнозы. Назовите вывод и предмет несогласия."
  },
  "registration": {
    "label": "Военный комиссариат по месту воинского учёта",
    "hint": "Регион проживания не обязательно совпадает с местом воинского учёта."
  },
  "violation": {
    "label": "Какое право нарушено и каким образом?",
    "hint": "Опишите конкретное нарушение, подтверждаемое документами."
  },
  "prior": {
    "label": "Подавалась ли жалоба выше и каков результат?",
    "hint": "Если не подавали, укажите «не подавалась». Досудебный порядок определяется нормой для вашего дела."
  },
  "court": {
    "label": "Наименование компетентного суда",
    "hint": "Проверьте вид суда и подсудность по КАС РФ и военным правилам; сервис не назначает суд автоматически."
  },
  "defendant": {
    "label": "Наименование или ФИО административного ответчика",
    "hint": "Укажите орган или должностное лицо, принявшее оспариваемое решение; не подменяйте ответчика другим ведомством."
  },
  "defendantAddress": {
    "label": "Адрес нахождения административного ответчика",
    "hint": "Укажите адрес органа по официальным реквизитам."
  },
  "birthDate": {
    "label": "Дата рождения административного истца",
    "hint": "Требование к данным истца по статье 125 КАС РФ."
  },
  "birthPlace": {
    "label": "Место рождения административного истца",
    "hint": "Требование к данным истца по статье 125 КАС РФ."
  }
};
export const MILITARY_LEGAL_SOURCES:Readonly<Record<string,{title:string;url:string}>>={
  "565": {
    "title": "Постановление Правительства № 565 — Положение о ВВЭ",
    "url": "https://mchs.gov.ru/dokumenty/553"
  },
  "574": {
    "title": "Постановление Правительства № 574 — независимая ВВЭ",
    "url": "https://mchs.gov.ru/dokumenty/693"
  },
  "647": {
    "title": "Указ Президента № 647 — особенности правового режима мобилизации",
    "url": "https://publication.pravo.gov.ru/Document/View/0001202209210001"
  },
  "1237": {
    "title": "Указ Президента № 1237 — Положение о порядке прохождения военной службы",
    "url": "https://www.consultant.ru/document/cons_doc_LAW_24400/"
  },
  "53fz": {
    "title": "Федеральный закон № 53-ФЗ — воинская обязанность, служба и призыв",
    "url": "https://www.consultant.ru/document/cons_doc_LAW_18260/"
  },
  "76fz": {
    "title": "Федеральный закон № 76-ФЗ — статус военнослужащих",
    "url": "https://www.consultant.ru/document/cons_doc_LAW_18853/"
  },
  "306fz": {
    "title": "Федеральный закон № 306-ФЗ — денежное довольствие и отдельные выплаты",
    "url": "https://www.consultant.ru/document/cons_doc_LAW_121273/"
  },
  "31fz": {
    "title": "Федеральный закон № 31-ФЗ, статья 18 — отсрочки от мобилизации",
    "url": "https://www.consultant.ru/document/cons_doc_LAW_13454/"
  },
  "kas": {
    "title": "КАС РФ — статьи 125, 126, 218 и 219 (проверить вид производства)",
    "url": "https://www.consultant.ru/document/cons_doc_LAW_176147/bebad06c9038fc6556a1f0e652969414cf2e57f1/"
  },
  "plenum8": {
    "title": "Пленум Верховного Суда РФ от 29.05.2014 № 8 — военная служба и подсудность",
    "url": "https://www.vsrf.ru/documents/all/8382"
  },
  "plenum21": {
    "title": "Пленум Верховного Суда РФ от 28.10.2025 № 21 — изменения к Пленуму № 8",
    "url": "https://www.vsrf.ru/documents/all/34814"
  }
};
export const MILITARY_LEGAL_DOCUMENTS:readonly MilitaryLegalDocument[]=[
  {
    "scenarioKey": "contract-check",
    "slug": "zayavlenie-o-razyasnenii-usloviy-voennogo-kontrakta",
    "title": "Заявление о разъяснении условий контракта о военной службе",
    "formLabel": "Заявление",
    "kind": "statement",
    "subject": "Условия и пункт контракта",
    "request": "Уточнить условия контракта и получить письменный ответ.",
    "fields": [
      "recipient",
      "applicant",
      "postal",
      "service",
      "instrument",
      "facts",
      "desired"
    ],
    "sourceIds": [
      "53fz",
      "76fz"
    ],
    "exampleUrl": "https://www.consultant.ru/document/cons_doc_LAW_366472/aee65f8f17d20f9db400318e25f5fd7d34c210e6/",
    "routeId": "service-contract"
  },
  {
    "scenarioKey": "service-order-copy",
    "slug": "raport-o-vydache-kopii-prikaza-voennosluzhaschemu",
    "title": "Рапорт о выдаче копии приказа военнослужащему",
    "formLabel": "Рапорт",
    "kind": "report",
    "subject": "Какой приказ или выписка необходимы",
    "request": "Выдать заверенную копию или выписку из указанного приказа.",
    "fields": [
      "recipient",
      "applicant",
      "service",
      "instrument",
      "period",
      "desired"
    ],
    "sourceIds": [
      "53fz",
      "76fz"
    ],
    "exampleUrl": "https://www.consultant.ru/document/cons_doc_LAW_366472/aee65f8f17d20f9db400318e25f5fd7d34c210e6/",
    "routeId": "service-contract"
  },
  {
    "scenarioKey": "transfer",
    "slug": "raport-o-rassmotrenii-perevoda-voennosluzhaschego",
    "title": "Рапорт о рассмотрении вопроса о переводе военнослужащего",
    "formLabel": "Рапорт",
    "kind": "report",
    "subject": "Обстоятельства перевода",
    "request": "Рассмотреть возможность перевода в установленном порядке и сообщить решение.",
    "fields": [
      "recipient",
      "applicant",
      "service",
      "facts",
      "proof",
      "desired"
    ],
    "sourceIds": [
      "53fz",
      "1237"
    ],
    "exampleUrl": "https://voensud-mo.ru/sample/duty",
    "routeId": "service-contract"
  },
  {
    "scenarioKey": "discharge-basis",
    "slug": "raport-ob-uvolnenii-s-voennoy-sluzhby",
    "title": "Рапорт об увольнении с военной службы по указанному основанию",
    "formLabel": "Рапорт",
    "kind": "report",
    "subject": "Основание увольнения и подтверждающий документ",
    "request": "Рассмотреть вопрос об увольнении по указанному подтверждённому основанию и направить мотивированный ответ.",
    "fields": [
      "recipient",
      "applicant",
      "service",
      "grounds",
      "instrument",
      "facts",
      "desired"
    ],
    "sourceIds": [
      "53fz",
      "1237",
      "647"
    ],
    "exampleUrl": "https://www.consultant.ru/document/cons_doc_LAW_18260/d8ba8171f6e944b1dc563df7d03c02836a574238/",
    "routeId": "military-discharge"
  },
  {
    "scenarioKey": "medical-discharge",
    "slug": "raport-ob-uvolnenii-po-zaklyucheniyu-vvk",
    "title": "Рапорт об увольнении с военной службы по заключению ВВК",
    "formLabel": "Рапорт",
    "kind": "report",
    "subject": "Заключение ВВК и категория годности",
    "request": "Рассмотреть вопрос об увольнении с учётом заключения ВВК и сообщить правовое решение.",
    "fields": [
      "recipient",
      "applicant",
      "service",
      "vvk",
      "instrument",
      "facts",
      "desired"
    ],
    "sourceIds": [
      "53fz",
      "565",
      "647"
    ],
    "exampleUrl": "https://www.consultant.ru/document/cons_doc_LAW_18260/d8ba8171f6e944b1dc563df7d03c02836a574238/",
    "routeId": "military-discharge"
  },
  {
    "scenarioKey": "discharge-order",
    "slug": "raport-o-vydache-prikaza-ob-uvolnenii-i-rascheta",
    "title": "Рапорт о выдаче приказа об увольнении и сведений об окончательном расчёте",
    "formLabel": "Рапорт",
    "kind": "report",
    "subject": "Приказ об увольнении и дата исключения",
    "request": "Выдать копию приказа об увольнении и сведения о произведённом расчёте.",
    "fields": [
      "recipient",
      "applicant",
      "service",
      "instrument",
      "date",
      "desired"
    ],
    "sourceIds": [
      "76fz",
      "1237",
      "306fz"
    ],
    "exampleUrl": "https://base.garant.ru/1969893/",
    "routeId": "military-discharge"
  },
  {
    "scenarioKey": "pay-breakdown",
    "slug": "raport-o-predostavlenii-rascheta-denezhnogo-dovolstviya",
    "title": "Рапорт о предоставлении расчёта денежного довольствия",
    "formLabel": "Рапорт",
    "kind": "report",
    "subject": "Период начислений и спорная выплата",
    "request": "Выдать сведения о начислениях, удержаниях и основаниях расчёта за указанный период.",
    "fields": [
      "recipient",
      "applicant",
      "service",
      "period",
      "payment",
      "desired"
    ],
    "sourceIds": [
      "76fz",
      "306fz"
    ],
    "exampleUrl": "https://www.consultant.ru/document/cons_doc_LAW_121273/",
    "routeId": "military-pay"
  },
  {
    "scenarioKey": "benefits",
    "slug": "zayavlenie-o-naznachenii-vyplaty-voennosluzhaschemu",
    "title": "Заявление о назначении выплаты военнослужащему",
    "formLabel": "Заявление",
    "kind": "statement",
    "subject": "Выплата и событие, с которым она связана",
    "request": "Рассмотреть право на названную выплату, проверить представленные документы и сообщить решение.",
    "fields": [
      "recipient",
      "applicant",
      "postal",
      "service",
      "payment",
      "facts",
      "proof",
      "desired"
    ],
    "sourceIds": [
      "76fz",
      "306fz"
    ],
    "exampleUrl": "https://www.consultant.ru/document/cons_doc_LAW_121273/",
    "routeId": "military-pay"
  },
  {
    "scenarioKey": "family-benefits",
    "slug": "zayavlenie-o-vyplate-chlenu-semi-voennosluzhaschego",
    "title": "Заявление о предоставлении выплаты члену семьи военнослужащего",
    "formLabel": "Заявление",
    "kind": "statement",
    "subject": "Родство, основание и вид выплаты",
    "request": "Проверить основания выплаты члену семьи и принять решение по заявлению.",
    "fields": [
      "recipient",
      "applicant",
      "postal",
      "relation",
      "payment",
      "facts",
      "proof",
      "desired"
    ],
    "sourceIds": [
      "76fz",
      "306fz"
    ],
    "exampleUrl": "https://www.consultant.ru/document/cons_doc_LAW_121273/",
    "routeId": "military-pay"
  },
  {
    "scenarioKey": "vvk-conclusion",
    "slug": "zayavlenie-o-peresmotre-zaklyucheniya-vvk",
    "title": "Заявление о пересмотре заключения военно-врачебной комиссии",
    "formLabel": "Заявление",
    "kind": "statement",
    "subject": "Дата и вывод ВВК, предмет несогласия",
    "request": "Разъяснить предусмотренный порядок пересмотра заключения ВВК и рассмотреть обращение в пределах компетенции.",
    "fields": [
      "recipient",
      "applicant",
      "postal",
      "service",
      "vvk",
      "disagreement",
      "instrument",
      "desired"
    ],
    "sourceIds": [
      "565",
      "76fz"
    ],
    "exampleUrl": "https://www.consultant.ru/document/cons_doc_LAW_149096/92d969e26a4326c5d02fa79b8f9cf4994ee5633b/",
    "routeId": "military-medical"
  },
  {
    "scenarioKey": "independent-review",
    "slug": "zayavlenie-o-nezavisimoy-voenno-vrachebnoy-ekspertize",
    "title": "Заявление о проведении независимой военно-врачебной экспертизы",
    "formLabel": "Заявление",
    "kind": "statement",
    "subject": "Заключение ВВК и основания несогласия",
    "request": "Разъяснить порядок и возможность проведения независимой военно-врачебной экспертизы.",
    "fields": [
      "recipient",
      "applicant",
      "postal",
      "service",
      "vvk",
      "disagreement",
      "proof",
      "desired"
    ],
    "sourceIds": [
      "574",
      "565"
    ],
    "exampleUrl": "https://www.consultant.ru/document/cons_doc_LAW_149096/92d969e26a4326c5d02fa79b8f9cf4994ee5633b/",
    "routeId": "military-medical"
  },
  {
    "scenarioKey": "request-explanation",
    "slug": "raport-o-pismennom-razyasnenii-resheniya-komandovaniya",
    "title": "Рапорт о письменном разъяснении решения командования",
    "formLabel": "Рапорт",
    "kind": "report",
    "subject": "Решение, которое требуется разъяснить",
    "request": "Разъяснить содержание и правовые основания названного решения в письменном виде.",
    "fields": [
      "recipient",
      "applicant",
      "service",
      "instrument",
      "facts",
      "desired"
    ],
    "sourceIds": [
      "76fz",
      "1237"
    ],
    "exampleUrl": "https://voensud-mo.ru/sample/duty",
    "routeId": "command-appeal"
  },
  {
    "scenarioKey": "challenge-decision",
    "slug": "zhaloba-na-reshenie-komandovaniya-voennosluzhaschego",
    "title": "Жалоба на решение командования, затрагивающее права военнослужащего",
    "formLabel": "Жалоба",
    "kind": "complaint",
    "subject": "Решение командования и нарушение прав",
    "request": "Проверить законность указанного решения и направить мотивированный ответ в пределах компетенции.",
    "fields": [
      "recipient",
      "applicant",
      "postal",
      "service",
      "instrument",
      "date",
      "violation",
      "facts",
      "desired"
    ],
    "sourceIds": [
      "76fz",
      "kas"
    ],
    "exampleUrl": "https://www.consultant.ru/document/cons_doc_LAW_176147/bebad06c9038fc6556a1f0e652969414cf2e57f1/",
    "routeId": "command-appeal"
  },
  {
    "scenarioKey": "inaction",
    "slug": "zhaloba-na-bezdeystvie-komandovaniya-voennosluzhaschego",
    "title": "Жалоба на бездействие командования по обращению военнослужащего",
    "formLabel": "Жалоба",
    "kind": "complaint",
    "subject": "Первое обращение, дата направления и отсутствие ответа",
    "request": "Проверить соблюдение обязанности рассмотреть обращение и сообщить о принятых мерах.",
    "fields": [
      "recipient",
      "applicant",
      "postal",
      "service",
      "instrument",
      "date",
      "proof",
      "violation",
      "desired"
    ],
    "sourceIds": [
      "76fz",
      "kas"
    ],
    "exampleUrl": "https://www.consultant.ru/document/cons_doc_LAW_176147/bebad06c9038fc6556a1f0e652969414cf2e57f1/",
    "routeId": "command-appeal"
  },
  {
    "scenarioKey": "draft-notice",
    "slug": "zayavlenie-o-vydache-resheniya-prizyvnoy-komissii",
    "title": "Заявление о выдаче копии решения призывной комиссии",
    "formLabel": "Заявление",
    "kind": "statement",
    "subject": "Какое решение призывного органа требуется",
    "request": "Выдать копию решения либо разъяснить порядок ознакомления с ним.",
    "fields": [
      "recipient",
      "applicant",
      "postal",
      "registration",
      "instrument",
      "date",
      "desired"
    ],
    "sourceIds": [
      "53fz",
      "31fz"
    ],
    "exampleUrl": "https://www.consultant.ru/document/cons_doc_LAW_18260/fbe9593051ae34e2a8eb27f73b923ffee40296b7/",
    "routeId": "mobilization-draft"
  },
  {
    "scenarioKey": "deferment",
    "slug": "zayavlenie-o-predostavlenii-otsrochki-ot-prizyva",
    "title": "Заявление о предоставлении отсрочки от призыва на военную службу",
    "formLabel": "Заявление",
    "kind": "statement",
    "subject": "Законное основание отсрочки",
    "request": "Рассмотреть документы, подтверждающие основание отсрочки, и принять предусмотренное решение.",
    "fields": [
      "recipient",
      "applicant",
      "postal",
      "registration",
      "grounds",
      "proof",
      "desired"
    ],
    "sourceIds": [
      "53fz"
    ],
    "exampleUrl": "https://www.consultant.ru/document/cons_doc_LAW_18260/fbe9593051ae34e2a8eb27f73b923ffee40296b7/",
    "routeId": "mobilization-draft"
  },
  {
    "scenarioKey": "deferment",
    "slug": "zayavlenie-o-predostavlenii-otsrochki-po-mobilizatsii",
    "title": "Заявление о предоставлении отсрочки от призыва по мобилизации",
    "formLabel": "Заявление",
    "kind": "statement",
    "subject": "Основание отсрочки по мобилизации",
    "request": "Рассмотреть документы на отсрочку по мобилизации и вынести решение в установленном порядке.",
    "fields": [
      "recipient",
      "applicant",
      "postal",
      "registration",
      "grounds",
      "proof",
      "desired"
    ],
    "sourceIds": [
      "31fz",
      "647"
    ],
    "exampleUrl": "https://base.garant.ru/55741630/",
    "routeId": "mobilization-draft"
  },
  {
    "scenarioKey": "challenge-draft",
    "slug": "zhaloba-na-reshenie-prizyvnoy-komissii",
    "title": "Жалоба на решение призывной комиссии",
    "formLabel": "Жалоба",
    "kind": "complaint",
    "subject": "Оспариваемое решение и дата ознакомления",
    "request": "Проверить законность указанного решения призывного органа и сообщить о порядке пересмотра.",
    "fields": [
      "recipient",
      "applicant",
      "postal",
      "registration",
      "instrument",
      "date",
      "violation",
      "facts",
      "desired"
    ],
    "sourceIds": [
      "53fz",
      "31fz",
      "kas"
    ],
    "exampleUrl": "https://base.garant.ru/55741630/",
    "routeId": "mobilization-draft"
  },
  {
    "scenarioKey": "challenge-decision",
    "slug": "administrativnyy-isk-ob-osparivanii-resheniya-komandovaniya",
    "title": "Административное исковое заявление об оспаривании решения командира",
    "formLabel": "Административное исковое заявление",
    "kind": "court",
    "subject": "Решение командира и нарушение прав",
    "request": "Признать незаконным указанное решение в оспариваемой части и обязать устранить нарушение права, если для этого есть законные основания.",
    "fields": [
      "court",
      "applicant",
      "postal",
      "birthDate",
      "birthPlace",
      "defendant",
      "defendantAddress",
      "instrument",
      "date",
      "violation",
      "facts",
      "proof",
      "prior",
      "desired"
    ],
    "sourceIds": [
      "kas",
      "76fz",
      "plenum8",
      "plenum21"
    ],
    "exampleUrl": "https://base.garant.ru/1969894/",
    "routeId": "command-appeal"
  },
  {
    "scenarioKey": "inaction",
    "slug": "administrativnyy-isk-o-bezdeystvii-komandovaniya",
    "title": "Административное исковое заявление об оспаривании бездействия командования",
    "formLabel": "Административное исковое заявление",
    "kind": "court",
    "subject": "Когда направлено обращение и в чём бездействие",
    "request": "Признать бездействие незаконным и обязать рассмотреть обращение при подтверждении обязанности и срока.",
    "fields": [
      "court",
      "applicant",
      "postal",
      "birthDate",
      "birthPlace",
      "defendant",
      "defendantAddress",
      "instrument",
      "date",
      "violation",
      "facts",
      "proof",
      "prior",
      "desired"
    ],
    "sourceIds": [
      "kas",
      "76fz",
      "plenum8",
      "plenum21"
    ],
    "exampleUrl": "https://www.consultant.ru/document/cons_doc_LAW_176147/bebad06c9038fc6556a1f0e652969414cf2e57f1/",
    "routeId": "command-appeal"
  },
  {
    "scenarioKey": "discharge-basis",
    "slug": "administrativnyy-isk-ob-osparivanii-uvolneniya-voennosluzhaschego",
    "title": "Административное исковое заявление об оспаривании увольнения с военной службы",
    "formLabel": "Административное исковое заявление",
    "kind": "court",
    "subject": "Приказ об увольнении и основание оспаривания",
    "request": "Признать оспариваемое решение незаконным в указанной части и рассмотреть предусмотренные законом последствия.",
    "fields": [
      "court",
      "applicant",
      "postal",
      "birthDate",
      "birthPlace",
      "defendant",
      "defendantAddress",
      "instrument",
      "date",
      "violation",
      "facts",
      "proof",
      "prior",
      "desired"
    ],
    "sourceIds": [
      "kas",
      "53fz",
      "1237",
      "647",
      "plenum8",
      "plenum21"
    ],
    "exampleUrl": "https://base.garant.ru/1969893/",
    "routeId": "military-discharge"
  },
  {
    "scenarioKey": "pay-breakdown",
    "slug": "administrativnyy-isk-o-nevyplate-denezhnogo-dovolstviya",
    "title": "Административное исковое заявление об оспаривании невыплаты денежного довольствия",
    "formLabel": "Административное исковое заявление",
    "kind": "court",
    "subject": "Сумма и период невыплаты, действие финансового органа",
    "request": "Признать незаконным оспариваемое решение либо бездействие в части неначисления или невыплаты денежного довольствия за указанный период и обязать устранить установленное нарушение в пределах компетенции административного ответчика.",
    "fields": [
      "court",
      "applicant",
      "postal",
      "birthDate",
      "birthPlace",
      "defendant",
      "defendantAddress",
      "period",
      "payment",
      "instrument",
      "date",
      "violation",
      "facts",
      "proof",
      "prior",
      "desired"
    ],
    "sourceIds": [
      "kas",
      "306fz",
      "76fz",
      "plenum8",
      "plenum21"
    ],
    "exampleUrl": "https://www.consultant.ru/document/cons_doc_LAW_163741/56e49299dd50770bff421e4049e824a54c2d6200/",
    "routeId": "military-pay"
  },
  {
    "scenarioKey": "challenge-draft",
    "slug": "administrativnyy-isk-ob-osparivanii-resheniya-prizyvnoy-komissii",
    "title": "Административное исковое заявление об оспаривании решения призывной комиссии",
    "formLabel": "Административное исковое заявление",
    "kind": "court",
    "subject": "Оспариваемое решение призывной комиссии и основание",
    "request": "Признать незаконным конкретное решение призывной комиссии и обязать устранить нарушение, если требования допустимы.",
    "fields": [
      "court",
      "applicant",
      "postal",
      "birthDate",
      "birthPlace",
      "defendant",
      "defendantAddress",
      "registration",
      "instrument",
      "date",
      "violation",
      "facts",
      "proof",
      "prior",
      "desired"
    ],
    "sourceIds": [
      "kas",
      "53fz",
      "plenum8",
      "plenum21"
    ],
    "exampleUrl": "https://www.consultant.ru/document/cons_doc_LAW_176147/bebad06c9038fc6556a1f0e652969414cf2e57f1/",
    "routeId": "mobilization-draft"
  }
];
export function getMilitaryLegalDocument(slug:string){return MILITARY_LEGAL_DOCUMENTS.find(d=>d.slug===slug)??null;}
export function getMilitaryDocumentsForScenario(key:string){return MILITARY_LEGAL_DOCUMENTS.filter(d=>d.scenarioKey===key);}
export function getMilitaryRouteForDocument(doc:MilitaryLegalDocument){
 return MILITARY_ROUTES.find(route=>route.id===doc.routeId);
}
export const MILITARY_NAVIGATOR_DOCUMENTS:NavigatorDocument[]=MILITARY_LEGAL_DOCUMENTS.map(doc=>{
 const route=getMilitaryRouteForDocument(doc);
 const legalBasis=doc.sourceIds.map(k=>MILITARY_LEGAL_SOURCES[k]?.title??k);
 const note=doc.kind==="court"
   ?"Вид судопроизводства, подсудность, стороны, срок обращения, направление копий участникам и пошлина проверяются до подачи."
   :"Адресат, статус заявителя, применимость норм и допустимый способ направления уточняются по документам.";
 const description=doc.title+". "+doc.subject+". "+note;
 const scenarioHref="/voennoe-pravo/"+(route?.slug??"")+"/";
 return {
  slug:doc.slug,title:doc.title,shortTitle:doc.title,category:"военное право",
  documentType:doc.formLabel,documentTypeAccusative:doc.formLabel.toLowerCase(),titleAccusative:doc.title.toLowerCase(),
  shortIntro:doc.subject,shortDescription:description,description,
  heroDescription:doc.subject+". Подготовьте проект на основе подтверждённых обстоятельств, скачайте PDF или DOCX и проверьте его перед направлением.",
  whenToUse:[doc.subject,"При наличии документов и фактов, подтверждающих соответствующее право обращения."],
  whenNotToUse:["Если фактический вид службы, орган или вид производства отличается от указанного в документе.","Если отсутствует документ, на котором основано соответствующее требование."],
  beforeFillingChecklist:["Уточните компетентного адресата по официальным сведениям.","Подготовьте документы, подтверждающие обстоятельства.","Сверьте правовой режим и сроки на дату события."],
  requiredData:doc.fields.filter(k=>k!=="desired").map(k=>MILITARY_LEGAL_FIELDS[k]?.label??k),
  whatToPrepare:["Подтверждающие правовой статус и обстоятельства документы.","Копии решений, приказов и ответов при наличии."],
  whatToInclude:[doc.subject,"Конкретное требование и правовые основания.","Реквизиты адресата, дата, подпись и приложения."],
  howToFill:["Укажите только подтверждённые юридические факты.","Проверьте компетенцию выбранного ведомства или суда.","Если обязательное сведение неизвестно, уточните его до подготовки проекта."],
  whereToFile:doc.kind==="court"?"В компетентный суд после проверки подсудности и порядка обращения.":"В уполномоченный орган, установленный по виду службы и конкретной выплате либо решению.",
  whereToSubmit:doc.kind==="court"?"Компетентный суд; ссылка на официальный поиск судов представлена в разделе подачи.":"Уполномоченный военный орган или ведомство после уточнения адресата.",
  filingProcedure:["Сверьте проект с правовыми и фактическими документами.","Уточните адресата, сроки и порядок направления.","Сохраните подтверждение подачи и контроля ответа."],
  howToSubmit:["Сверьте официальный способ подачи с выбранным адресатом.","Сохраните квитанцию, входящий номер или электронное подтверждение."],
  legalBasis,deadlinesAndFees:["Срок и пошлина определяются конкретным правовым режимом и видом документа; не рассчитаны автоматически."],
  deadlines:["Проверьте применимый срок на дату получения решения."],stateDuty:["Пошлина при необходимости проверяется индивидуально."],
  afterFiling:["Сохраните подтверждение подачи.","Отслеживайте ответ по официальному каналу.","При отказе проверьте допустимость и сроки обжалования."],
  importantFactsToFix:doc.fields.map(k=>MILITARY_LEGAL_FIELDS[k]?.label??k),
  mistakes:["Направлять документ некомпетентному адресату.","Указывать неподтверждённые нормы или факты.","Пропустить срок обращения или приложения."],
  commonMistakes:["Указывать неподтверждённого ответчика или адресата.","Подавать проект без проверки оформления и приложений."],
  documentsToAttach:["Копии документов, подтверждающих обстоятельства и полномочия.","Другие документы в зависимости от конкретного требования."],
  attachments:["Копии приказов, решений, ответов и доказательств при наличии."],
  relatedProblems:[{title:route?.title??"Военное право",slug:route?.slug}],
  relatedSituations:[{title:route?.title??"Военное право",slug:route?.slug}],
  relatedDocuments:MILITARY_LEGAL_DOCUMENTS.filter(other=>other.scenarioKey===doc.scenarioKey&&other.slug!==doc.slug).map(other=>({title:other.title,slug:other.slug})),
  faq:[
   {question:"Куда направить "+doc.formLabel.toLowerCase()+"?",answer:"Компетентный орган зависит от вида службы, оспариваемого решения и адресата документа. Проверьте справочник после подготовки."},
   {question:"Можно ли скачать PDF и DOCX?",answer:"Да, оба формата доступны для подготовленного проекта; перед подачей требуется юридическая проверка."},
   {question:"Что проверить перед отправкой?",answer:note}
  ],
  relatedProblemSlugs:route?[route.slug]:[],legalReferenceKeys:[],
  seoTitle:doc.title+": составить проект онлайн, скачать PDF и DOCX",
  seoDescription:doc.title+". "+doc.subject+". Подготовьте проект по подтверждённым сведениям, скачайте PDF или DOCX. Правовые основания, адресат, сроки и порядок подачи.",
  generatorSeoTitle:"Сформировать "+doc.title.toLowerCase()+" онлайн",
  generatorSeoDescription:"Укажите необходимые сведения для "+doc.title.toLowerCase()+" и скачайте проект в PDF или DOCX.",
  keywords:[doc.title.toLowerCase(),doc.formLabel.toLowerCase()+" военнослужащего",doc.slug.replaceAll("-"," ")],
  userQueries:[doc.title.toLowerCase(),"скачать "+doc.title.toLowerCase()+" pdf","образец "+doc.title.toLowerCase()],
  // Date of checking the public statutory references and specimen structure; NOT lawyer sign-off.
  lastReviewedAt:"2026-10-26",
  disclaimer:"Проект носит предварительный характер. Законность требования, статус заявителя, адресат и сроки подлежат юридической проверке."
 };
});

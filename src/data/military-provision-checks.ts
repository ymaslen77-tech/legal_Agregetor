import { MILITARY_TOPICS } from "@/data/military-catalog";

/**
 * Evidence of article-level research, not a legal approval. Exact current
 * statutory text was compared with current third-party reproductions.
 * Official publication record IDs are referenced, but official PDF pages
 * could not be opened in this audit; do NOT flag these as officially verified.
 */
export type MilitaryProvisionCheck = Readonly<{
  topicSlug: string;
  situationIndex: number;
  checkedAt: "2026-10-28";
  sourceStatus: "CURRENT_THIRD_PARTY_TEXT_CROSSCHECKED_OFFICIAL_RECORD_NOT_OPENED";
  legalReviewConfirmed: false;
  officialTextVerified: false;
  provisions: readonly Readonly<{
    act: string;
    article: string;
    applicability: string;
    textUrl: string;
    officialPublicationUrl?: string;
  }>[];
  caution: string;
}>;

const FZ53 = "Федеральный закон от 28.03.1998 № 53-ФЗ";
const U647 = "Указ Президента РФ от 21.09.2022 № 647";
const U998 = "Указ Президента РФ от 29.12.2025 № 998";
const art32 = "https://www.consultant.ru/document/cons_doc_LAW_18260/083f4e80303ab0460e020b32948cf1d6c2c98352/";
const art51 = "https://www.consultant.ru/document/Cons_doc_LAW_18260/d8ba8171f6e944b1dc563df7d03c02836a574238/";
const art28 = "https://www.consultant.ru/document/cons_doc_LAW_18260/d59956cb788efc251374ecb04c6d90f337a047fd/";
const art26 = "https://www.consultant.ru/document/cons_doc_LAW_18260/43e7684503f391be83e45eac537860d972f84864/";
const art352 = "https://www.consultant.ru/document/cons_doc_LAW_18260/9625cc2616db7078d1c4dfeff645112b3391631c/";
const art353 = "https://www.consultant.ru/document/cons_doc_LAW_18260/6411e2c26b6cb59e0de6dedd9c62758a537833f3/";
const decree647 = "https://www.consultant.ru/document/cons_doc_LAW_426999/";
const decree998 = "https://base.garant.ru/413383684/";
const fz412 = "https://www.consultant.ru/document/cons_doc_LAW_518062/";
const pub212 = "https://publication.pravo.gov.ru/document/0001202507070032";
const pub647 = "https://publication.pravo.gov.ru/document/0001202209210001";
const pub412 = "https://publication.pravo.gov.ru/document/0001202511040014";
const pub998 = "https://publication.pravo.gov.ru/document/0001202512290111";

export const MILITARY_PROVISION_CHECKS: readonly MilitaryProvisionCheck[] = [
  {
    topicSlug:"kontraktnaya-sluzhba",situationIndex:0,checkedAt:"2026-10-28",
    sourceStatus:"CURRENT_THIRD_PARTY_TEXT_CROSSCHECKED_OFFICIAL_RECORD_NOT_OPENED",legalReviewConfirmed:false,officialTextVerified:false,
    provisions:[
      {act:FZ53,article:"статья 32, пункты 1–3",applicability:"Письменный контракт, добровольность, срок, обязанности и гарантии; круг лиц скорректирован № 212-ФЗ от 07.07.2025.",textUrl:art32,officialPublicationUrl:pub212},
      {act:FZ53,article:"статья 33",applicability:"Проверить медицинские и профессиональные требования к конкретному кандидату.",textUrl:"https://www.consultant.ru/document/cons_doc_LAW_18260/5fb6a22bf26bcb71626538d9c577cfd2c304fbd2/"}
    ],
    caution:"Типовая форма и порядок отбора уточняются по ведомству; нельзя считать заявление обязательным для любого кандидата."
  },
  {
    topicSlug:"kontraktnaya-sluzhba",situationIndex:1,checkedAt:"2026-10-28",
    sourceStatus:"CURRENT_THIRD_PARTY_TEXT_CROSSCHECKED_OFFICIAL_RECORD_NOT_OPENED",legalReviewConfirmed:false,officialTextVerified:false,
    provisions:[{act:FZ53,article:"статья 32, пункты 2–5",applicability:"Условия, добровольность и срок контракта; поправки № 212-ФЗ действуют с июля 2025 года.",textUrl:art32,officialPublicationUrl:pub212}],
    caution:"Нельзя считать устаревшую государственную перепечатку закона актуальной редакцией, когда она не содержит изменений 2025 года."
  },
  {
    topicSlug:"kontraktnaya-sluzhba",situationIndex:5,checkedAt:"2026-10-28",
    sourceStatus:"CURRENT_THIRD_PARTY_TEXT_CROSSCHECKED_OFFICIAL_RECORD_NOT_OPENED",legalReviewConfirmed:false,officialTextVerified:false,
    provisions:[
      {act:U647,article:"пункт 4",applicability:"Продолжение контрактов в предусмотренный указом период; нужно отдельно проверять действие режима на дату решения.",textUrl:decree647,officialPublicationUrl:pub647},
      {act:FZ53,article:"статья 51",applicability:"Основания увольнения и особые исключения подлежат отдельной проверке.",textUrl:art51}
    ],
    caution:"Факт отсутствия согласия на продление не даёт автоматического основания для прекращения службы."
  },
  {
    topicSlug:"kontraktnaya-sluzhba",situationIndex:6,checkedAt:"2026-10-28",
    sourceStatus:"CURRENT_THIRD_PARTY_TEXT_CROSSCHECKED_OFFICIAL_RECORD_NOT_OPENED",legalReviewConfirmed:false,officialTextVerified:false,
    provisions:[
      {act:U647,article:"пункты 4 и 5",applicability:"Специальный порядок сохранения контракта и увольнения, с учётом индивидуального статуса и применимых исключений.",textUrl:decree647,officialPublicationUrl:pub647},
      {act:FZ53,article:"статья 51",applicability:"Общие основания увольнения; необходимо учитывать специальные нормативные режимы.",textUrl:art51}
    ],
    caution:"Дата окончания контракта сама по себе не доказывает наступление обязанности уволить."
  },
  {
    topicSlug:"prizyv",situationIndex:0,checkedAt:"2026-10-28",
    sourceStatus:"CURRENT_THIRD_PARTY_TEXT_CROSSCHECKED_OFFICIAL_RECORD_NOT_OPENED",legalReviewConfirmed:false,officialTextVerified:false,
    provisions:[
      {act:FZ53,article:"статьи 22, 26 и 26.1",applicability:"Круг призываемых и разграничение круглогодичных мероприятий с периодами отправки, действующими с 01.01.2026.",textUrl:art26,officialPublicationUrl:pub412},
      {act:U998,article:"пункт 1",applicability:"Мероприятия призыва на 2026 год с 1 января по 31 декабря; отправка в сроки закона.",textUrl:decree998,officialPublicationUrl:pub998}
    ],
    caution:"Не распространять правила призыва 2026 года на мобилизационный призыв."
  },
  {
    topicSlug:"prizyv",situationIndex:1,checkedAt:"2026-10-28",
    sourceStatus:"CURRENT_THIRD_PARTY_TEXT_CROSSCHECKED_OFFICIAL_RECORD_NOT_OPENED",legalReviewConfirmed:false,officialTextVerified:false,
    provisions:[{act:FZ53,article:"статья 28, пункт 1",applicability:"Закон перечисляет виды решений призывной комиссии; автоматически не определять решение по данным заявителя.",textUrl:art28,officialPublicationUrl:pub412}],
    caution:"Смешение отсрочки, освобождения от призыва и освобождения от воинской обязанности юридически недопустимо."
  },
  {
    topicSlug:"prizyv",situationIndex:2,checkedAt:"2026-10-28",
    sourceStatus:"CURRENT_THIRD_PARTY_TEXT_CROSSCHECKED_OFFICIAL_RECORD_NOT_OPENED",legalReviewConfirmed:false,officialTextVerified:false,
    provisions:[
      {act:FZ53,article:"статья 28, пункт 7",applicability:"Отсылочная норма об обжаловании по разделу V.1.",textUrl:art28},
      {act:FZ53,article:"статьи 35.2 и 35.3",applicability:"Порядок досудебной жалобы, адресат и обязательные реквизиты; нельзя подменять это старой статьёй 28 из гос. перепечатки.",textUrl:art352}
    ],
    caution:"Уточнить процедуру, сроки и последствия выбранного способа оспаривания; отдельно сверить с действующим КАС РФ."
  },
  {
    topicSlug:"prizyv",situationIndex:4,checkedAt:"2026-10-28",
    sourceStatus:"CURRENT_THIRD_PARTY_TEXT_CROSSCHECKED_OFFICIAL_RECORD_NOT_OPENED",legalReviewConfirmed:false,officialTextVerified:false,
    provisions:[{act:FZ53,article:"статья 28, пункт 6",applicability:"Военный комиссариат по письменному заявлению выдаёт выписку из протокола решения (заключения) в течение пяти рабочих дней либо направляет заказным письмом.",textUrl:art28,officialPublicationUrl:pub412}],
    caution:"Запрашивать именно выписку из протокола заседания, не обещать автоматически выдачу полной копии протокола или решения."
  },
  {"topicSlug":"otsrochka-ot-sluzhby","situationIndex":1,"provisions":[{"act":"Федеральный закон № 53-ФЗ","article":"статья 24, пункт 1, подпункт «а»","applicability":"Отсрочка по состоянию здоровья основана на признании временно не годным к службе в установленном порядке; срок до одного года; нужно решение компетентной комиссии, не диагноз пользователя.","textUrl":"https://www.consultant.ru/document/cons_doc_LAW_18260/fbe9593051ae34e2a8eb27f73b923ffee40296b7/"},{"act":"Постановление Правительства РФ № 565","article":"пункт 13(2) и раздел II","applicability":"Заключение о годности и медицинские документы оформляются уполномоченными медицинскими специалистами; редакция включает изменения № 312 от 24.03.2026.","textUrl":"https://www.consultant.ru/document/cons_doc_LAW_149096/b29a8a7e90d241e0f4eb4bbff0d993e7b49cfa9b/"}],"caution":"Не смешивать отсрочку на ограниченный срок и полное освобождение; заключение врача не заменяет установленное решение.","checkedAt":"2026-10-28","sourceStatus":"CURRENT_THIRD_PARTY_TEXT_CROSSCHECKED_OFFICIAL_RECORD_NOT_OPENED","legalReviewConfirmed":false,"officialTextVerified":false},
  {"topicSlug":"otsrochka-ot-sluzhby","situationIndex":2,"provisions":[{"act":"Федеральный закон № 53-ФЗ","article":"статья 24, пункт 2, подпункт «а»","applicability":"Отсрочка обучающимся зависит от формы обучения, аккредитации программы, уровня образования, допустимого срока и ранее использованного права.","textUrl":"https://www.consultant.ru/document/cons_doc_LAW_18260/fbe9593051ae34e2a8eb27f73b923ffee40296b7/"},{"act":"Федеральный закон от 10.06.2026 № 179-ФЗ","article":"изменения к статье 24","applicability":"В 2026 году добавлены отдельные основания для лиц со специальными званиями, поступивших на службу в органы внутренних дел; к обычному студенту автоматически не применяются.","textUrl":"https://www.pravo.gov.ru/novye-postupleniya/"}],"caution":"Не выдавать отсрочку всем студентам независимо от формы обучения; отдельное основание МВД не равнозначно общей учебной отсрочке.","checkedAt":"2026-10-28","sourceStatus":"CURRENT_THIRD_PARTY_TEXT_CROSSCHECKED_OFFICIAL_RECORD_NOT_OPENED","legalReviewConfirmed":false,"officialTextVerified":false},
  {"topicSlug":"otsrochka-ot-sluzhby","situationIndex":3,"provisions":[{"act":"Федеральный закон № 53-ФЗ","article":"статья 24, пункт 1, подпункты «б», «б.1», «в», «г», «д», «и»","applicability":"Основания по уходу, опеке, воспитанию ребёнка и составу семьи различаются; каждое имеет собственные юридические условия.","textUrl":"https://www.consultant.ru/document/cons_doc_LAW_18260/fbe9593051ae34e2a8eb27f73b923ffee40296b7/"}],"caution":"Само наличие супруги, родственников или ребёнка не создаёт универсальную отсрочку.","checkedAt":"2026-10-28","sourceStatus":"CURRENT_THIRD_PARTY_TEXT_CROSSCHECKED_OFFICIAL_RECORD_NOT_OPENED","legalReviewConfirmed":false,"officialTextVerified":false},
  {"topicSlug":"otsrochka-ot-sluzhby","situationIndex":5,"provisions":[{"act":"Федеральный закон № 53-ФЗ","article":"статья 24, пункт 1, подпункт «б»","applicability":"Для ухода за указанным родственником проверяются подтверждённая потребность в постоянном постороннем уходе по заключению федерального учреждения МСЭ, отсутствие других обязанных содержать лиц и полного гособеспечения.","textUrl":"https://www.consultant.ru/document/cons_doc_LAW_18260/fbe9593051ae34e2a8eb27f73b923ffee40296b7/"}],"caution":"Совместное проживание или медицинская справка без требуемого заключения МСЭ не подтверждают основания.","checkedAt":"2026-10-28","sourceStatus":"CURRENT_THIRD_PARTY_TEXT_CROSSCHECKED_OFFICIAL_RECORD_NOT_OPENED","legalReviewConfirmed":false,"officialTextVerified":false},
  {"topicSlug":"uvolnenie-s-voennoy-sluzhby","situationIndex":1,"provisions":[{"act":"Федеральный закон № 53-ФЗ","article":"статья 51, пункт 1, подпункты «в», «г», «г.1»; пункт 3, подпункт «б»","applicability":"Разные основания увольнения по здоровью зависят от категории годности, вида службы и воинской должности; при специальных правовых режимах необходима отдельная проверка.","textUrl":"https://www.consultant.ru/document/cons_doc_LAW_18260/d8ba8171f6e944b1dc563df7d03c02836a574238/"},{"act":"Постановление Правительства РФ № 565","article":"пункт 8 и применимое Расписание болезней","applicability":"Медицинское заключение и процедура пересмотра устанавливаются ВВК, а не по свободному описанию состояния.","textUrl":"https://www.consultant.ru/document/cons_doc_LAW_149096/b06f3fcb8a015f0a73e9a1d093f4277babecce16/"}],"caution":"Нельзя подменять медицинское заключение самостоятельным диагнозом или обещать увольнение по любому ограничению годности.","checkedAt":"2026-10-28","sourceStatus":"CURRENT_THIRD_PARTY_TEXT_CROSSCHECKED_OFFICIAL_RECORD_NOT_OPENED","legalReviewConfirmed":false,"officialTextVerified":false},
  {"topicSlug":"uvolnenie-s-voennoy-sluzhby","situationIndex":2,"provisions":[{"act":"Федеральный закон № 53-ФЗ","article":"статья 51, пункт 3, подпункт «в»","applicability":"Семейные основания перечислены отдельно: медицинская невозможность проживания члена семьи по месту службы, перевод супруга-военнослужащего, постоянный уход при наличии заключения МСЭ и отсутствии иных обязанных лиц, воспитание ребёнка без другого родителя, предусмотренная опека.","textUrl":"https://www.consultant.ru/document/cons_doc_LAW_18260/d8ba8171f6e944b1dc563df7d03c02836a574238/"},{"act":"Указ Президента РФ № 647","article":"пункт 5","applicability":"Нужно определить применимость специального режима увольнения, вид службы и действующие исключения на дату решения.","textUrl":"https://www.consultant.ru/document/cons_doc_LAW_426999/"}],"caution":"Наличие семейного обстоятельства нельзя считать гарантией увольнения в условиях специального режима.","checkedAt":"2026-10-28","sourceStatus":"CURRENT_THIRD_PARTY_TEXT_CROSSCHECKED_OFFICIAL_RECORD_NOT_OPENED","legalReviewConfirmed":false,"officialTextVerified":false},
  {"topicSlug":"uvolnenie-s-voennoy-sluzhby","situationIndex":3,"provisions":[{"act":"Федеральный закон № 53-ФЗ","article":"статья 51, пункт 1, подпункт «б»","applicability":"Общее основание истечения срока контракта необходимо сопоставлять с действующим особым порядком службы.","textUrl":"https://www.consultant.ru/document/cons_doc_LAW_18260/d8ba8171f6e944b1dc563df7d03c02836a574238/"},{"act":"Указ Президента РФ № 647","article":"пункты 4 и 5","applicability":"При действии специального режима условия продолжения контракта и исключения из порядка увольнения требуют самостоятельной проверки.","textUrl":"https://www.consultant.ru/document/cons_doc_LAW_426999/"}],"caution":"Нельзя автоматически подготавливать требование о безусловном увольнении по дате окончания контракта.","checkedAt":"2026-10-28","sourceStatus":"CURRENT_THIRD_PARTY_TEXT_CROSSCHECKED_OFFICIAL_RECORD_NOT_OPENED","legalReviewConfirmed":false,"officialTextVerified":false},
  {"topicSlug":"uvolnenie-s-voennoy-sluzhby","situationIndex":4,"provisions":[{"act":"Федеральный закон № 53-ФЗ","article":"статья 51, пункт 1, подпункт «а»","applicability":"Возрастное основание зависит от применимого предельного возраста, категории службы и специальных временных правил.","textUrl":"https://www.consultant.ru/document/cons_doc_LAW_18260/d8ba8171f6e944b1dc563df7d03c02836a574238/"}],"caution":"Возраст в паспорте не устанавливает право увольнения без проверки звания, даты и действующего режима.","checkedAt":"2026-10-28","sourceStatus":"CURRENT_THIRD_PARTY_TEXT_CROSSCHECKED_OFFICIAL_RECORD_NOT_OPENED","legalReviewConfirmed":false,"officialTextVerified":false},
  {"topicSlug":"vvk-i-kategoriya-godnosti","situationIndex":2,"provisions":[{"act":"Постановление Правительства РФ № 565","article":"пункт 8 Положения о ВВЭ","applicability":"Повторное обследование до истечения действия прежнего заключения возможно по заявлению в вышестоящую ВВК при изменении здоровья, дающем основания для пересмотра; решение принимает компетентная комиссия.","textUrl":"https://www.consultant.ru/document/cons_doc_LAW_149096/b06f3fcb8a015f0a73e9a1d093f4277babecce16/"}],"caution":"Не представлять повторную ВВК как безусловное право требовать немедленного изменения категории годности.","checkedAt":"2026-10-28","sourceStatus":"CURRENT_THIRD_PARTY_TEXT_CROSSCHECKED_OFFICIAL_RECORD_NOT_OPENED","legalReviewConfirmed":false,"officialTextVerified":false},
  {"topicSlug":"vvk-i-kategoriya-godnosti","situationIndex":3,"provisions":[{"act":"Постановление Правительства РФ № 565","article":"пункт 8 Положения о ВВЭ","applicability":"Заключение ВВК может быть обжаловано в вышестоящую ВВК или суд; надо уточнить подведомственность и факты нарушений.","textUrl":"https://www.consultant.ru/document/cons_doc_LAW_149096/b06f3fcb8a015f0a73e9a1d093f4277babecce16/"}],"caution":"Жалоба на ВВК и административный иск имеют разные адресаты, реквизиты и правовые последствия.","checkedAt":"2026-10-28","sourceStatus":"CURRENT_THIRD_PARTY_TEXT_CROSSCHECKED_OFFICIAL_RECORD_NOT_OPENED","legalReviewConfirmed":false,"officialTextVerified":false},
  {"topicSlug":"vvk-i-kategoriya-godnosti","situationIndex":5,"provisions":[{"act":"Постановление Правительства РФ № 565","article":"пункт 8 Положения о ВВЭ","applicability":"При несогласии с заключением ВВК или результатом освидетельствования возможна независимая ВВЭ по специальному порядку.","textUrl":"https://www.consultant.ru/document/cons_doc_LAW_149096/b06f3fcb8a015f0a73e9a1d093f4277babecce16/"},{"act":"Постановление Правительства РФ № 574","article":"пункт 1 Положения о независимой ВВЭ","applicability":"Полномочия организации и правила проведения независимой экспертизы проверяются по актуальным требованиям.","textUrl":"https://www.consultant.ru/document/cons_doc_LAW_78918/19f4acd5a5e55451273e3efb3df17b4712650235/"}],"caution":"Независимое заключение не отменяет автоматически заключение ведомственной ВВК.","checkedAt":"2026-10-28","sourceStatus":"CURRENT_THIRD_PARTY_TEXT_CROSSCHECKED_OFFICIAL_RECORD_NOT_OPENED","legalReviewConfirmed":false,"officialTextVerified":false},
  {"topicSlug":"vvk-i-kategoriya-godnosti","situationIndex":6,"provisions":[{"act":"Постановление Правительства РФ № 565","article":"пункт 8 Положения о ВВЭ","applicability":"Вышестоящая комиссия вправе отменить заключение нижестоящей ВВК при существенном нарушении порядка освидетельствования и решить вопрос о повторном освидетельствовании.","textUrl":"https://www.consultant.ru/document/cons_doc_LAW_149096/b06f3fcb8a015f0a73e9a1d093f4277babecce16/"}],"caution":"Наличие медицинских документов само по себе не доказывает, что комиссия нарушила процессуальные правила.","checkedAt":"2026-10-28","sourceStatus":"CURRENT_THIRD_PARTY_TEXT_CROSSCHECKED_OFFICIAL_RECORD_NOT_OPENED","legalReviewConfirmed":false,"officialTextVerified":false},
  {"topicSlug":"prizyv","situationIndex":8,"provisions":[{"act":"Федеральный закон № 53-ФЗ","article":"статьи 35.2 и 35.3","applicability":"Досудебная жалоба подаётся в комиссию субъекта РФ через предусмотренный электронный сервис или МФЦ; состав реквизитов определён статьёй 35.3.","textUrl":"https://www.consultant.ru/document/cons_doc_LAW_18260/9625cc2616db7078d1c4dfeff645112b3391631c/"},{"act":"Федеральный закон № 53-ФЗ","article":"статья 35.3, пункт 1","applicability":"Нужны реквизиты обжалуемого решения, сведения о заявителе, основания несогласия и конкретное требование.","textUrl":"https://www.consultant.ru/document/cons_doc_LAW_18260/6411e2c26b6cb59e0de6dedd9c62758a537833f3/"}],"caution":"Не переносить правила этого досудебного порядка на мобилизационные решения или уголовные дела.","checkedAt":"2026-10-28","sourceStatus":"CURRENT_THIRD_PARTY_TEXT_CROSSCHECKED_OFFICIAL_RECORD_NOT_OPENED","legalReviewConfirmed":false,"officialTextVerified":false}
];

export function getMilitaryProvisionCheck(topicSlug:string,situationIndex:number) {
 return MILITARY_PROVISION_CHECKS.find(check=>check.topicSlug===topicSlug&&check.situationIndex===situationIndex)??null;
}
export const MILITARY_LEGAL_AUDIT_REFERENCE_LINKS = Object.freeze({
 article35_3:art353,
 law412:fz412,
 official212:pub212,
 governmentReprintKnownStale:"https://rosguard.gov.ru/document/article/federalnyj-zakon-ot-28-marta-1998-g--53fz"
});

export function getMilitaryProvisionCoverage() {
 const categories = new Set(MILITARY_PROVISION_CHECKS.map(x=>x.topicSlug));
 return {
   cases:MILITARY_TOPICS.reduce((n,topic)=>n+topic.situations.length,0),
   provisionsCrosschecked:MILITARY_PROVISION_CHECKS.length,
   categoriesTouched:categories.size,
   officialTextVerified:MILITARY_PROVISION_CHECKS.filter(x=>x.officialTextVerified).length,
   legallyApproved:MILITARY_PROVISION_CHECKS.filter(x=>x.legalReviewConfirmed).length
 };
}

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
const FZ412 = "Федеральный закон от 04.11.2025 № 412-ФЗ";
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
  }
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

/**
 * Stage 2: legal-case work queue. No case may be treated as legally approved.
 * 143 individual editorial draft cards exist; legal verification is still pending.
 * Source candidates are NOT authenticated per-case legal citations or proof
 * of official publication. Only an explicit subsequent review can change this.
 */
export type MilitaryLegalCaseCard = Readonly<{
  topicSlug:string;topicTitle:string;situationIndex:number;situationTitle:string;
  situationKind:"information"|"document"|"mixed";
  status:"EDITORIAL_CASE_DRAFT"|"AWAITING_INDIVIDUAL_REVIEW";
  legalQuestion:string|null;evidenceToConfirm:string|null;
  competentRecipientToVerify:string|null;plannedResultToVerify:string|null;
  sourceCandidates:readonly Readonly<{id:string;title:string;url:string;type:string}>[];
  criticalLimitations:string|null;legalReviewConfirmed:false;
  officialPublicationChecked:false;reviewedAt:null;note:string;
}>;
export const MILITARY_LEGAL_CASE_CARDS:readonly MilitaryLegalCaseCard[] = [
  {
    "topicSlug": "kontraktnaya-sluzhba",
    "topicTitle": "Контракт и прохождение военной службы",
    "situationIndex": 0,
    "situationTitle": "Как заключить контракт о прохождении военной службы?",
    "situationKind": "mixed",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Подтвердить добровольность волеизъявления, критерии отбора и действующую процедуру; служебные условия не подменять правилами срочного призыва.",
    "evidenceToConfirm": "Личные документы, подтверждения образования и квалификации, проект контракта.",
    "competentRecipientToVerify": "Пункт отбора или уполномоченный кадровый орган.",
    "plannedResultToVerify": "Заявление о поступлении на службу, только если его требует актуальная процедура.",
    "sourceCandidates": [
      {
        "id": "53",
        "title": "Федеральный закон № 53-ФЗ",
        "url": "https://rosguard.gov.ru/document/article/federalnyj-zakon-ot-28-marta-1998-g--53fz",
        "type": "GOVERNMENT_REPRINT_STALE_NOT_CURRENT"
      },
      {
        "id": "76",
        "title": "Федеральный закон № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "1237",
        "title": "Указ Президента РФ № 1237",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "Не обещать заключение контракта без проверки требований.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный правовой план, не юридическое заключение; перед публикацией сверить редакцию норм и точный порядок."
  },
  {
    "topicSlug": "kontraktnaya-sluzhba",
    "topicTitle": "Контракт и прохождение военной службы",
    "situationIndex": 1,
    "situationTitle": "Какие условия обязательно должны быть отражены в контракте?",
    "situationKind": "information",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Проверить, какие условия и гарантии обязательны именно для данного вида контракта и даты его подписания.",
    "evidenceToConfirm": "Текст или проект контракта, сведения о должности и сроке.",
    "competentRecipientToVerify": "Кадровый орган и заявитель.",
    "plannedResultToVerify": "Информационное разъяснение без генератора.",
    "sourceCandidates": [
      {
        "id": "53",
        "title": "Федеральный закон № 53-ФЗ",
        "url": "https://rosguard.gov.ru/document/article/federalnyj-zakon-ot-28-marta-1998-g--53fz",
        "type": "GOVERNMENT_REPRINT_STALE_NOT_CURRENT"
      },
      {
        "id": "76",
        "title": "Федеральный закон № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "1237",
        "title": "Указ Президента РФ № 1237",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "Не приравнивать типовые условия контракта к самостоятельному основанию увольнения.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный правовой план, не юридическое заключение; перед публикацией сверить редакцию норм и точный порядок."
  },
  {
    "topicSlug": "kontraktnaya-sluzhba",
    "topicTitle": "Контракт и прохождение военной службы",
    "situationIndex": 2,
    "situationTitle": "Можно ли отказаться от подписания контракта?",
    "situationKind": "mixed",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Определить, существует ли обязательство до подписания; отличить отказ подписать договор от отказа исполнить законный приказ.",
    "evidenceToConfirm": "Проект контракта, переписка, сведения о служебном статусе.",
    "competentRecipientToVerify": "Орган, предлагающий заключить контракт.",
    "plannedResultToVerify": "Письменное уведомление о неподписании, если это процессуально требуется.",
    "sourceCandidates": [
      {
        "id": "53",
        "title": "Федеральный закон № 53-ФЗ",
        "url": "https://rosguard.gov.ru/document/article/federalnyj-zakon-ot-28-marta-1998-g--53fz",
        "type": "GOVERNMENT_REPRINT_STALE_NOT_CURRENT"
      },
      {
        "id": "1237",
        "title": "Указ Президента РФ № 1237",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "Не советовать неисполнение уже возникших служебных обязанностей.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный правовой план, не юридическое заключение; перед публикацией сверить редакцию норм и точный порядок."
  },
  {
    "topicSlug": "kontraktnaya-sluzhba",
    "topicTitle": "Контракт и прохождение военной службы",
    "situationIndex": 3,
    "situationTitle": "Как получить копию заключённого контракта?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Подтвердить право заявителя на выдачу копии именно его подписанного контракта и уполномоченного держателя документа.",
    "evidenceToConfirm": "Реквизиты контракта, дата подписания, регистрация обращения.",
    "competentRecipientToVerify": "Кадровый орган воинской части.",
    "plannedResultToVerify": "Заявление о выдаче заверенной копии контракта.",
    "sourceCandidates": [
      {
        "id": "53",
        "title": "Федеральный закон № 53-ФЗ",
        "url": "https://rosguard.gov.ru/document/article/federalnyj-zakon-ot-28-marta-1998-g--53fz",
        "type": "GOVERNMENT_REPRINT_STALE_NOT_CURRENT"
      },
      {
        "id": "76",
        "title": "Федеральный закон № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "1237",
        "title": "Указ Президента РФ № 1237",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "Не запрашивать документы с ограниченным доступом сверх прав заявителя.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный правовой план, не юридическое заключение; перед публикацией сверить редакцию норм и точный порядок."
  },
  {
    "topicSlug": "kontraktnaya-sluzhba",
    "topicTitle": "Контракт и прохождение военной службы",
    "situationIndex": 4,
    "situationTitle": "Можно ли изменить условия действующего контракта?",
    "situationKind": "mixed",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Разграничить изменение договорных условий и кадровое решение командования по действующим правилам прохождения службы.",
    "evidenceToConfirm": "Контракт, дополнительные соглашения, приказ, заявленное основание.",
    "competentRecipientToVerify": "Кадровый орган и командование.",
    "plannedResultToVerify": "Рапорт о рассмотрении изменений с конкретным правовым основанием.",
    "sourceCandidates": [
      {
        "id": "53",
        "title": "Федеральный закон № 53-ФЗ",
        "url": "https://rosguard.gov.ru/document/article/federalnyj-zakon-ot-28-marta-1998-g--53fz",
        "type": "GOVERNMENT_REPRINT_STALE_NOT_CURRENT"
      },
      {
        "id": "76",
        "title": "Федеральный закон № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "1237",
        "title": "Указ Президента РФ № 1237",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "Не обещать право одностороннего изменения условий.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный правовой план, не юридическое заключение; перед публикацией сверить редакцию норм и точный порядок."
  },
  {
    "topicSlug": "kontraktnaya-sluzhba",
    "topicTitle": "Контракт и прохождение военной службы",
    "situationIndex": 5,
    "situationTitle": "Что делать, если контракт продлён без согласия военнослужащего?",
    "situationKind": "mixed",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Выяснить дату окончания, специальное регулирование продления и содержание конкретного приказа.",
    "evidenceToConfirm": "Подписанный контракт, приказ о продлении, даты и доказательства вручения.",
    "competentRecipientToVerify": "Командование и уполномоченный вышестоящий орган.",
    "plannedResultToVerify": "Жалоба на конкретное решение; судебный документ только после выбора процедуры.",
    "sourceCandidates": [
      {
        "id": "53",
        "title": "Федеральный закон № 53-ФЗ",
        "url": "https://rosguard.gov.ru/document/article/federalnyj-zakon-ot-28-marta-1998-g--53fz",
        "type": "GOVERNMENT_REPRINT_STALE_NOT_CURRENT"
      },
      {
        "id": "1237",
        "title": "Указ Президента РФ № 1237",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "647",
        "title": "Указ Президента РФ № 647",
        "url": "https://publication.pravo.gov.ru/Document/View/0001202209210001",
        "type": "OFFICIAL_RECORD_CANDIDATE"
      },
      {
        "id": "kas",
        "title": "КАС РФ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "Отсутствие согласия само по себе может не прекращать контракт при специальных правилах.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный правовой план, не юридическое заключение; перед публикацией сверить редакцию норм и точный порядок."
  },
  {
    "topicSlug": "kontraktnaya-sluzhba",
    "topicTitle": "Контракт и прохождение военной службы",
    "situationIndex": 6,
    "situationTitle": "Можно ли прекратить службу после окончания срока контракта?",
    "situationKind": "mixed",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Отличить окончание календарного срока контракта от юридического основания увольнения при действующем правовом режиме.",
    "evidenceToConfirm": "Контракт, сведения о виде службы, приказы, документ об основании увольнения.",
    "competentRecipientToVerify": "Командование и кадровый орган.",
    "plannedResultToVerify": "Рапорт на увольнение только при подтверждённом законном основании.",
    "sourceCandidates": [
      {
        "id": "53",
        "title": "Федеральный закон № 53-ФЗ",
        "url": "https://rosguard.gov.ru/document/article/federalnyj-zakon-ot-28-marta-1998-g--53fz",
        "type": "GOVERNMENT_REPRINT_STALE_NOT_CURRENT"
      },
      {
        "id": "1237",
        "title": "Указ Президента РФ № 1237",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "647",
        "title": "Указ Президента РФ № 647",
        "url": "https://publication.pravo.gov.ru/Document/View/0001202209210001",
        "type": "OFFICIAL_RECORD_CANDIDATE"
      },
      {
        "id": "76",
        "title": "Федеральный закон № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "Не гарантировать увольнение исключительно по окончании срока.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный правовой план, не юридическое заключение; перед публикацией сверить редакцию норм и точный порядок."
  },
  {
    "topicSlug": "kontraktnaya-sluzhba",
    "topicTitle": "Контракт и прохождение военной службы",
    "situationIndex": 7,
    "situationTitle": "Как оспорить незаконные условия контракта?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Установить содержание спорного условия, права заявителя и надлежащий порядок его оспаривания.",
    "evidenceToConfirm": "Контракт, дополнительное соглашение, письменное решение, подтверждения нарушения.",
    "competentRecipientToVerify": "Вышестоящее командование или компетентный суд после проверки подсудности.",
    "plannedResultToVerify": "Мотивированная жалоба либо административный иск при наличии оснований.",
    "sourceCandidates": [
      {
        "id": "53",
        "title": "Федеральный закон № 53-ФЗ",
        "url": "https://rosguard.gov.ru/document/article/federalnyj-zakon-ot-28-marta-1998-g--53fz",
        "type": "GOVERNMENT_REPRINT_STALE_NOT_CURRENT"
      },
      {
        "id": "76",
        "title": "Федеральный закон № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "1237",
        "title": "Указ Президента РФ № 1237",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "kas",
        "title": "КАС РФ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "Не выбирать суд до уточнения предмета и статуса спора.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный правовой план, не юридическое заключение; перед публикацией сверить редакцию норм и точный порядок."
  },
  {
    "topicSlug": "kontraktnaya-sluzhba",
    "topicTitle": "Контракт и прохождение военной службы",
    "situationIndex": 8,
    "situationTitle": "Что делать, если военнослужащего назначили на должность без его согласия?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Проверить, какие кадровые назначения требуют согласия, и применимы ли исключения к данной должности.",
    "evidenceToConfirm": "Приказ о назначении, предыдущая должность, сведения о звании и состоянии здоровья.",
    "competentRecipientToVerify": "Кадровый орган и командование.",
    "plannedResultToVerify": "Жалоба на приказ; административный иск при наличии условий.",
    "sourceCandidates": [
      {
        "id": "53",
        "title": "Федеральный закон № 53-ФЗ",
        "url": "https://rosguard.gov.ru/document/article/federalnyj-zakon-ot-28-marta-1998-g--53fz",
        "type": "GOVERNMENT_REPRINT_STALE_NOT_CURRENT"
      },
      {
        "id": "1237",
        "title": "Указ Президента РФ № 1237",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "76",
        "title": "Федеральный закон № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "kas",
        "title": "КАС РФ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "Не предполагать обязательность согласия при любом назначении.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный правовой план, не юридическое заключение; перед публикацией сверить редакцию норм и точный порядок."
  },
  {
    "topicSlug": "mobilizaciya",
    "topicTitle": "Мобилизация",
    "situationIndex": 0,
    "situationTitle": "Кого могут призвать на военную службу по мобилизации?",
    "situationKind": "information",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Проверить критерии мобилизационного призыва на конкретную дату, статус гражданина и особые основания отсрочки.",
    "evidenceToConfirm": "Документы воинского учёта, сведения о пребывании в запасе, решения.",
    "competentRecipientToVerify": "Военный комиссариат и мобилизационная призывная комиссия.",
    "plannedResultToVerify": "Информация без генератора.",
    "sourceCandidates": [
      {
        "id": "31",
        "title": "Федеральный закон № 31-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "53",
        "title": "Федеральный закон № 53-ФЗ",
        "url": "https://rosguard.gov.ru/document/article/federalnyj-zakon-ot-28-marta-1998-g--53fz",
        "type": "GOVERNMENT_REPRINT_STALE_NOT_CURRENT"
      },
      {
        "id": "647",
        "title": "Указ Президента РФ № 647",
        "url": "https://publication.pravo.gov.ru/Document/View/0001202209210001",
        "type": "OFFICIAL_RECORD_CANDIDATE"
      }
    ],
    "criticalLimitations": "Не смешивать с призывом на срочную службу.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный правовой план, не юридическое заключение; перед публикацией сверить редакцию норм и точный порядок."
  },
  {
    "topicSlug": "mobilizaciya",
    "topicTitle": "Мобилизация",
    "situationIndex": 1,
    "situationTitle": "Какие правовые последствия возникают при мобилизации?",
    "situationKind": "information",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Определить дату и правовые последствия решения о мобилизации для трудового, служебного и семейного статуса.",
    "evidenceToConfirm": "Решение о призыве по мобилизации, приказ, воинский статус.",
    "competentRecipientToVerify": "Соответствующий орган по предмету вопроса.",
    "plannedResultToVerify": "Информация без генератора.",
    "sourceCandidates": [
      {
        "id": "31",
        "title": "Федеральный закон № 31-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "647",
        "title": "Указ Президента РФ № 647",
        "url": "https://publication.pravo.gov.ru/Document/View/0001202209210001",
        "type": "OFFICIAL_RECORD_CANDIDATE"
      },
      {
        "id": "76",
        "title": "Федеральный закон № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "Не распространять льготы разных категорий по аналогии.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный правовой план, не юридическое заключение; перед публикацией сверить редакцию норм и точный порядок."
  },
  {
    "topicSlug": "mobilizaciya",
    "topicTitle": "Мобилизация",
    "situationIndex": 2,
    "situationTitle": "Как обжаловать решение о призыве по мобилизации?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Установить предмет обжалования, момент уведомления и допустимость внесудебного и судебного пути.",
    "evidenceToConfirm": "Решение комиссии, извещение, документы о нарушенном праве.",
    "competentRecipientToVerify": "Вышестоящая комиссия либо компетентный суд по проверенной процедуре.",
    "plannedResultToVerify": "Жалоба либо административное исковое заявление.",
    "sourceCandidates": [
      {
        "id": "31",
        "title": "Федеральный закон № 31-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "647",
        "title": "Указ Президента РФ № 647",
        "url": "https://publication.pravo.gov.ru/Document/View/0001202209210001",
        "type": "OFFICIAL_RECORD_CANDIDATE"
      },
      {
        "id": "kas",
        "title": "КАС РФ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "Жалоба не должна автоматически объявляться приостанавливающей исполнение решения.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный правовой план, не юридическое заключение; перед публикацией сверить редакцию норм и точный порядок."
  },
  {
    "topicSlug": "mobilizaciya",
    "topicTitle": "Мобилизация",
    "situationIndex": 3,
    "situationTitle": "Что делать при ошибочной мобилизации?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Определить фактическую ошибку в идентификации, учёте или применении освобождения.",
    "evidenceToConfirm": "Извещение, выписка решения, документы об ошибке.",
    "competentRecipientToVerify": "Уполномоченная призывная комиссия по мобилизации.",
    "plannedResultToVerify": "Заявление об исправлении решения и приложенные доказательства.",
    "sourceCandidates": [
      {
        "id": "31",
        "title": "Федеральный закон № 31-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "53",
        "title": "Федеральный закон № 53-ФЗ",
        "url": "https://rosguard.gov.ru/document/article/federalnyj-zakon-ot-28-marta-1998-g--53fz",
        "type": "GOVERNMENT_REPRINT_STALE_NOT_CURRENT"
      },
      {
        "id": "647",
        "title": "Указ Президента РФ № 647",
        "url": "https://publication.pravo.gov.ru/Document/View/0001202209210001",
        "type": "OFFICIAL_RECORD_CANDIDATE"
      }
    ],
    "criticalLimitations": "Не считать любую ошибку безусловным основанием отмены.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный правовой план, не юридическое заключение; перед публикацией сверить редакцию норм и точный порядок."
  },
  {
    "topicSlug": "mobilizaciya",
    "topicTitle": "Мобилизация",
    "situationIndex": 4,
    "situationTitle": "Как добиться проверки законности мобилизации по состоянию здоровья?",
    "situationKind": "mixed",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Разграничить оценку состояния здоровья, полномочия ВВК и оспаривание решения по мобилизации.",
    "evidenceToConfirm": "Медицинские заключения, дата освидетельствования, мобилизационное решение.",
    "competentRecipientToVerify": "Военный комиссариат/ВВК по применимому порядку.",
    "plannedResultToVerify": "Заявление о проведении или проверке освидетельствования.",
    "sourceCandidates": [
      {
        "id": "31",
        "title": "Федеральный закон № 31-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "565",
        "title": "Постановление Правительства РФ № 565",
        "url": "https://mchs.gov.ru/dokumenty/553",
        "type": "GOVERNMENT_REPRINT"
      },
      {
        "id": "647",
        "title": "Указ Президента РФ № 647",
        "url": "https://publication.pravo.gov.ru/Document/View/0001202209210001",
        "type": "OFFICIAL_RECORD_CANDIDATE"
      }
    ],
    "criticalLimitations": "Не ставить диагноз и не назначать категорию годности автоматически.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный правовой план, не юридическое заключение; перед публикацией сверить редакцию норм и точный порядок."
  },
  {
    "topicSlug": "mobilizaciya",
    "topicTitle": "Мобилизация",
    "situationIndex": 5,
    "situationTitle": "Как получить освобождение или отсрочку от мобилизации при наличии законных оснований?",
    "situationKind": "mixed",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Проверить точный вид отсрочки или освобождения именно в мобилизационном законодательстве.",
    "evidenceToConfirm": "Документы о запасе, семье, работе, здоровье и решении.",
    "competentRecipientToVerify": "Мобилизационная комиссия либо иной уполномоченный орган.",
    "plannedResultToVerify": "Заявление об отсрочке/освобождении с точным основанием.",
    "sourceCandidates": [
      {
        "id": "31",
        "title": "Федеральный закон № 31-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "647",
        "title": "Указ Президента РФ № 647",
        "url": "https://publication.pravo.gov.ru/Document/View/0001202209210001",
        "type": "OFFICIAL_RECORD_CANDIDATE"
      }
    ],
    "criticalLimitations": "Не переносить основания срочного призыва в мобилизационный без нормы.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный правовой план, не юридическое заключение; перед публикацией сверить редакцию норм и точный порядок."
  },
  {
    "topicSlug": "mobilizaciya",
    "topicTitle": "Мобилизация",
    "situationIndex": 6,
    "situationTitle": "Как оформить обращение по семейным обстоятельствам мобилизованного?",
    "situationKind": "mixed",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Уточнить вид службы после мобилизации и правовой механизм обращения по семейному основанию.",
    "evidenceToConfirm": "Семейные документы, приказ, подтверждение необходимости ухода.",
    "competentRecipientToVerify": "Командование или компетентная мобилизационная комиссия по ситуации.",
    "plannedResultToVerify": "Рапорт либо заявление по надлежащему основанию.",
    "sourceCandidates": [
      {
        "id": "31",
        "title": "Федеральный закон № 31-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "76",
        "title": "Федеральный закон № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "647",
        "title": "Указ Президента РФ № 647",
        "url": "https://publication.pravo.gov.ru/Document/View/0001202209210001",
        "type": "OFFICIAL_RECORD_CANDIDATE"
      },
      {
        "id": "1237",
        "title": "Указ Президента РФ № 1237",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "Семейное обстоятельство не равно автоматическому увольнению.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный правовой план, не юридическое заключение; перед публикацией сверить редакцию норм и точный порядок."
  },
  {
    "topicSlug": "mobilizaciya",
    "topicTitle": "Мобилизация",
    "situationIndex": 7,
    "situationTitle": "Как добиться пересмотра решения о направлении на службу?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Выделить первичное решение, его адресата и основание пересмотра.",
    "evidenceToConfirm": "Решение о направлении, подтверждение вручения, новое доказательство.",
    "competentRecipientToVerify": "Орган, вынесший решение, вышестоящий орган либо суд.",
    "plannedResultToVerify": "Жалоба на конкретное решение; административный иск при применимости.",
    "sourceCandidates": [
      {
        "id": "31",
        "title": "Федеральный закон № 31-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "647",
        "title": "Указ Президента РФ № 647",
        "url": "https://publication.pravo.gov.ru/Document/View/0001202209210001",
        "type": "OFFICIAL_RECORD_CANDIDATE"
      },
      {
        "id": "kas",
        "title": "КАС РФ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "Не использовать универсальный срок обжалования без проверки специальной нормы.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный правовой план, не юридическое заключение; перед публикацией сверить редакцию норм и точный порядок."
  },
  {
    "topicSlug": "prizyv",
    "topicTitle": "Призыв на срочную военную службу",
    "situationIndex": 0,
    "situationTitle": "Кто подлежит призыву на срочную военную службу?",
    "situationKind": "information",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Проверить возраст, статус воинского учёта и условия призыва по редакции закона на дату события.",
    "evidenceToConfirm": "Паспорт, сведения воинского учёта, документы об отсрочке.",
    "competentRecipientToVerify": "Призывная комиссия и военный комиссариат.",
    "plannedResultToVerify": "Информация без генератора.",
    "sourceCandidates": [
      {
        "id": "53",
        "title": "Федеральный закон № 53-ФЗ",
        "url": "https://rosguard.gov.ru/document/article/federalnyj-zakon-ot-28-marta-1998-g--53fz",
        "type": "GOVERNMENT_REPRINT_STALE_NOT_CURRENT"
      },
      {
        "id": "412-2025",
        "title": "Федеральный закон от 04.11.2025 № 412-ФЗ",
        "url": "https://publication.pravo.gov.ru/document/0001202511040014",
        "type": "OFFICIAL_RECORD_CANDIDATE_UNCONFIRMED"
      },
      {
        "id": "998-2025",
        "title": "Указ Президента РФ от 29.12.2025 № 998",
        "url": "https://publication.pravo.gov.ru/document/0001202512290111",
        "type": "OFFICIAL_RECORD_CANDIDATE_UNCONFIRMED"
      }
    ],
    "criticalLimitations": "Общая информация не определяет персональную подлежимость призыву.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный правовой план, не юридическое заключение; перед публикацией сверить редакцию норм и точный порядок."
  },
  {
    "topicSlug": "prizyv",
    "topicTitle": "Призыв на срочную военную службу",
    "situationIndex": 1,
    "situationTitle": "Какие решения вправе принимать призывная комиссия?",
    "situationKind": "information",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Установить виды решений призывной комиссии, их содержание и последствия.",
    "evidenceToConfirm": "Извещение о заседании, решение комиссии.",
    "competentRecipientToVerify": "Призывная комиссия.",
    "plannedResultToVerify": "Информация без генератора.",
    "sourceCandidates": [
      {
        "id": "53",
        "title": "Федеральный закон № 53-ФЗ",
        "url": "https://rosguard.gov.ru/document/article/federalnyj-zakon-ot-28-marta-1998-g--53fz",
        "type": "GOVERNMENT_REPRINT_STALE_NOT_CURRENT"
      },
      {
        "id": "565",
        "title": "Постановление Правительства РФ № 565",
        "url": "https://mchs.gov.ru/dokumenty/553",
        "type": "GOVERNMENT_REPRINT"
      },
      {
        "id": "412-2025",
        "title": "Федеральный закон от 04.11.2025 № 412-ФЗ",
        "url": "https://publication.pravo.gov.ru/document/0001202511040014",
        "type": "OFFICIAL_RECORD_CANDIDATE_UNCONFIRMED"
      }
    ],
    "criticalLimitations": "Не подменять решение комиссии выводами сервиса.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный правовой план, не юридическое заключение; перед публикацией сверить редакцию норм и точный порядок."
  },
  {
    "topicSlug": "prizyv",
    "topicTitle": "Призыв на срочную военную службу",
    "situationIndex": 2,
    "situationTitle": "Как обжаловать решение призывной комиссии?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Уточнить обжалуемый акт, реквизиты и специальный порядок/срок обжалования решения.",
    "evidenceToConfirm": "Копия решения призывной комиссии, доказательства нарушений.",
    "competentRecipientToVerify": "Вышестоящая призывная комиссия либо компетентный суд.",
    "plannedResultToVerify": "Жалоба либо административный иск после процессуальной квалификации.",
    "sourceCandidates": [
      {
        "id": "53",
        "title": "Федеральный закон № 53-ФЗ",
        "url": "https://rosguard.gov.ru/document/article/federalnyj-zakon-ot-28-marta-1998-g--53fz",
        "type": "GOVERNMENT_REPRINT_STALE_NOT_CURRENT"
      },
      {
        "id": "412-2025",
        "title": "Федеральный закон от 04.11.2025 № 412-ФЗ",
        "url": "https://publication.pravo.gov.ru/document/0001202511040014",
        "type": "OFFICIAL_RECORD_CANDIDATE_UNCONFIRMED"
      },
      {
        "id": "kas",
        "title": "КАС РФ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "Проверить влияние обжалования на исполнение решения по действующей редакции.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный правовой план, не юридическое заключение; перед публикацией сверить редакцию норм и точный порядок."
  },
  {
    "topicSlug": "prizyv",
    "topicTitle": "Призыв на срочную военную службу",
    "situationIndex": 3,
    "situationTitle": "Что делать, если призывают при наличии заболевания?",
    "situationKind": "mixed",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Выяснить вид заболевания, наличие документов и процесс освидетельствования.",
    "evidenceToConfirm": "Медицинские выписки, результаты обследований, повестка.",
    "competentRecipientToVerify": "Призывная комиссия, медицинская комиссия.",
    "plannedResultToVerify": "Заявление о приобщении медицинских сведений/направлении на обследование.",
    "sourceCandidates": [
      {
        "id": "53",
        "title": "Федеральный закон № 53-ФЗ",
        "url": "https://rosguard.gov.ru/document/article/federalnyj-zakon-ot-28-marta-1998-g--53fz",
        "type": "GOVERNMENT_REPRINT_STALE_NOT_CURRENT"
      },
      {
        "id": "565",
        "title": "Постановление Правительства РФ № 565",
        "url": "https://mchs.gov.ru/dokumenty/553",
        "type": "GOVERNMENT_REPRINT"
      }
    ],
    "criticalLimitations": "Не формировать категорию годности на основании пользовательского текста.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный правовой план, не юридическое заключение; перед публикацией сверить редакцию норм и точный порядок."
  },
  {
    "topicSlug": "prizyv",
    "topicTitle": "Призыв на срочную военную службу",
    "situationIndex": 4,
    "situationTitle": "Как получить копию решения призывной комиссии?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Проверить дату принятия решения и полномочия заявителя получить его копию.",
    "evidenceToConfirm": "Дата заседания, военкомат, данные заявителя.",
    "competentRecipientToVerify": "Военный комиссариат и призывная комиссия.",
    "plannedResultToVerify": "Заявление о выдаче выписки из протокола заседания призывной комиссии по пункту 6 статьи 28 Закона № 53-ФЗ.",
    "sourceCandidates": [
      {
        "id": "53",
        "title": "Федеральный закон № 53-ФЗ",
        "url": "https://rosguard.gov.ru/document/article/federalnyj-zakon-ot-28-marta-1998-g--53fz",
        "type": "GOVERNMENT_REPRINT_STALE_NOT_CURRENT"
      },
      {
        "id": "412-2025",
        "title": "Федеральный закон от 04.11.2025 № 412-ФЗ",
        "url": "https://publication.pravo.gov.ru/document/0001202511040014",
        "type": "OFFICIAL_RECORD_CANDIDATE_UNCONFIRMED"
      }
    ],
    "criticalLimitations": "Действующая статья 28 предусматривает выписку из протокола по письменному запросу в военный комиссариат; срок — пять рабочих дней. Не обещать полную копию протокола.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный правовой план, не юридическое заключение; перед публикацией сверить редакцию норм и точный порядок."
  },
  {
    "topicSlug": "prizyv",
    "topicTitle": "Призыв на срочную военную службу",
    "situationIndex": 5,
    "situationTitle": "Что делать, если военкомат не учитывает медицинские документы?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Подтвердить подачу медицинских документов и отсутствие оценки комиссией.",
    "evidenceToConfirm": "Входящий номер, копии медицинских документов, решение комиссии.",
    "competentRecipientToVerify": "Призывная комиссия или вышестоящая комиссия.",
    "plannedResultToVerify": "Жалоба на непринятие или неучёт документов.",
    "sourceCandidates": [
      {
        "id": "53",
        "title": "Федеральный закон № 53-ФЗ",
        "url": "https://rosguard.gov.ru/document/article/federalnyj-zakon-ot-28-marta-1998-g--53fz",
        "type": "GOVERNMENT_REPRINT_STALE_NOT_CURRENT"
      },
      {
        "id": "565",
        "title": "Постановление Правительства РФ № 565",
        "url": "https://mchs.gov.ru/dokumenty/553",
        "type": "GOVERNMENT_REPRINT"
      }
    ],
    "criticalLimitations": "Не утверждать, что любое отсутствие конкретного обследования незаконно без нормы.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный правовой план, не юридическое заключение; перед публикацией сверить редакцию норм и точный порядок."
  },
  {
    "topicSlug": "prizyv",
    "topicTitle": "Призыв на срочную военную службу",
    "situationIndex": 6,
    "situationTitle": "Как оспорить установленную категорию годности?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Отделить несогласие с категорией от оспаривания итогового призывного решения.",
    "evidenceToConfirm": "Заключение о годности, обследования, решение комиссии.",
    "competentRecipientToVerify": "Вышестоящая комиссия, ВВК или суд по компетенции.",
    "plannedResultToVerify": "Жалоба на заключение/решение с уточнением объекта оспаривания.",
    "sourceCandidates": [
      {
        "id": "53",
        "title": "Федеральный закон № 53-ФЗ",
        "url": "https://rosguard.gov.ru/document/article/federalnyj-zakon-ot-28-marta-1998-g--53fz",
        "type": "GOVERNMENT_REPRINT_STALE_NOT_CURRENT"
      },
      {
        "id": "565",
        "title": "Постановление Правительства РФ № 565",
        "url": "https://mchs.gov.ru/dokumenty/553",
        "type": "GOVERNMENT_REPRINT"
      },
      {
        "id": "kas",
        "title": "КАС РФ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "Вид обследования и порядок пересмотра зависят от статуса призывника.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный правовой план, не юридическое заключение; перед публикацией сверить редакцию норм и точный порядок."
  },
  {
    "topicSlug": "prizyv",
    "topicTitle": "Призыв на срочную военную службу",
    "situationIndex": 7,
    "situationTitle": "Что делать при нарушении процедуры вручения повестки?",
    "situationKind": "mixed",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Проверить способ уведомления, официальный учёт повестки и последствия вручения по актуальной редакции.",
    "evidenceToConfirm": "Сведения реестра/повестки, документы об уведомлении.",
    "competentRecipientToVerify": "Военный комиссариат, орган рассмотрения жалобы.",
    "plannedResultToVerify": "Жалоба на конкретное нарушение процедуры, если есть правовое основание.",
    "sourceCandidates": [
      {
        "id": "53",
        "title": "Федеральный закон № 53-ФЗ",
        "url": "https://rosguard.gov.ru/document/article/federalnyj-zakon-ot-28-marta-1998-g--53fz",
        "type": "GOVERNMENT_REPRINT_STALE_NOT_CURRENT"
      },
      {
        "id": "412-2025",
        "title": "Федеральный закон от 04.11.2025 № 412-ФЗ",
        "url": "https://publication.pravo.gov.ru/document/0001202511040014",
        "type": "OFFICIAL_RECORD_CANDIDATE_UNCONFIRMED"
      }
    ],
    "criticalLimitations": "Не предполагать недействительность электронного извещения без проверки.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный правовой план, не юридическое заключение; перед публикацией сверить редакцию норм и точный порядок."
  },
  {
    "topicSlug": "prizyv",
    "topicTitle": "Призыв на срочную военную службу",
    "situationIndex": 8,
    "situationTitle": "Как обжаловать отказ в освобождении от призыва?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Установить конкретное основание освобождения, отказ и его форму.",
    "evidenceToConfirm": "Письменный отказ, медицинские либо иные подтверждения.",
    "competentRecipientToVerify": "Призывная комиссия либо компетентный суд.",
    "plannedResultToVerify": "Жалоба или административный иск.",
    "sourceCandidates": [
      {
        "id": "53",
        "title": "Федеральный закон № 53-ФЗ",
        "url": "https://rosguard.gov.ru/document/article/federalnyj-zakon-ot-28-marta-1998-g--53fz",
        "type": "GOVERNMENT_REPRINT_STALE_NOT_CURRENT"
      },
      {
        "id": "565",
        "title": "Постановление Правительства РФ № 565",
        "url": "https://mchs.gov.ru/dokumenty/553",
        "type": "GOVERNMENT_REPRINT"
      },
      {
        "id": "kas",
        "title": "КАС РФ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "Не путать освобождение от призыва с временной отсрочкой.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный правовой план, не юридическое заключение; перед публикацией сверить редакцию норм и точный порядок."
  },
  {
    "topicSlug": "otsrochka-ot-sluzhby",
    "topicTitle": "Отсрочка и освобождение от военной службы",
    "situationIndex": 0,
    "situationTitle": "Какие законные основания предусмотрены для отсрочки и освобождения?",
    "situationKind": "information",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Разграничить отсрочку, освобождение от призыва и освобождение от исполнения воинской обязанности.",
    "evidenceToConfirm": "Статус воинского учёта, сведения об учёбе, семье и здоровье.",
    "competentRecipientToVerify": "Призывная комиссия.",
    "plannedResultToVerify": "Информация без генератора.",
    "sourceCandidates": [
      {
        "id": "53",
        "title": "Федеральный закон № 53-ФЗ",
        "url": "https://rosguard.gov.ru/document/article/federalnyj-zakon-ot-28-marta-1998-g--53fz",
        "type": "GOVERNMENT_REPRINT_STALE_NOT_CURRENT"
      },
      {
        "id": "565",
        "title": "Постановление Правительства РФ № 565",
        "url": "https://mchs.gov.ru/dokumenty/553",
        "type": "GOVERNMENT_REPRINT"
      }
    ],
    "criticalLimitations": "Одинаковые формулировки могут иметь разный правовой результат.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный правовой план, не юридическое заключение; перед публикацией сверить редакцию норм и точный порядок."
  },
  {
    "topicSlug": "otsrochka-ot-sluzhby",
    "topicTitle": "Отсрочка и освобождение от военной службы",
    "situationIndex": 1,
    "situationTitle": "Как получить отсрочку от призыва по состоянию здоровья?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Установить соответствующую временную категорию годности и требуемую процедуру.",
    "evidenceToConfirm": "Медицинские справки, заключение, решение комиссии.",
    "competentRecipientToVerify": "Призывная комиссия и уполномоченная ВВК.",
    "plannedResultToVerify": "Заявление о предоставлении отсрочки по состоянию здоровья.",
    "sourceCandidates": [
      {
        "id": "53",
        "title": "Федеральный закон № 53-ФЗ",
        "url": "https://rosguard.gov.ru/document/article/federalnyj-zakon-ot-28-marta-1998-g--53fz",
        "type": "GOVERNMENT_REPRINT_STALE_NOT_CURRENT"
      },
      {
        "id": "565",
        "title": "Постановление Правительства РФ № 565",
        "url": "https://mchs.gov.ru/dokumenty/553",
        "type": "GOVERNMENT_REPRINT"
      }
    ],
    "criticalLimitations": "Не считать диагноз достаточным без решения ВВК.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный правовой план, не юридическое заключение; перед публикацией сверить редакцию норм и точный порядок."
  },
  {
    "topicSlug": "otsrochka-ot-sluzhby",
    "topicTitle": "Отсрочка и освобождение от военной службы",
    "situationIndex": 2,
    "situationTitle": "Как оформить отсрочку в связи с обучением?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Проверить аккредитацию, форму обучения, уровень образования и статус заявителя.",
    "evidenceToConfirm": "Справка организации об обучении, сведения об аккредитации.",
    "competentRecipientToVerify": "Призывная комиссия.",
    "plannedResultToVerify": "Заявление об отсрочке в связи с обучением.",
    "sourceCandidates": [
      {
        "id": "53",
        "title": "Федеральный закон № 53-ФЗ",
        "url": "https://rosguard.gov.ru/document/article/federalnyj-zakon-ot-28-marta-1998-g--53fz",
        "type": "GOVERNMENT_REPRINT_STALE_NOT_CURRENT"
      },
      {
        "id": "412-2025",
        "title": "Федеральный закон от 04.11.2025 № 412-ФЗ",
        "url": "https://publication.pravo.gov.ru/document/0001202511040014",
        "type": "OFFICIAL_RECORD_CANDIDATE_UNCONFIRMED"
      }
    ],
    "criticalLimitations": "Не гарантировать отсрочку по любой форме обучения.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный правовой план, не юридическое заключение; перед публикацией сверить редакцию норм и точный порядок."
  },
  {
    "topicSlug": "otsrochka-ot-sluzhby",
    "topicTitle": "Отсрочка и освобождение от военной службы",
    "situationIndex": 3,
    "situationTitle": "Как получить отсрочку по семейным обстоятельствам?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Проверить конкретный семейный состав и прямо предусмотренное законом основание.",
    "evidenceToConfirm": "Свидетельства, документы о статусе членов семьи, решение комиссии.",
    "competentRecipientToVerify": "Призывная комиссия.",
    "plannedResultToVerify": "Заявление об отсрочке по семейному основанию.",
    "sourceCandidates": [
      {
        "id": "53",
        "title": "Федеральный закон № 53-ФЗ",
        "url": "https://rosguard.gov.ru/document/article/federalnyj-zakon-ot-28-marta-1998-g--53fz",
        "type": "GOVERNMENT_REPRINT_STALE_NOT_CURRENT"
      }
    ],
    "criticalLimitations": "Сам факт наличия семьи не подтверждает отсрочку.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный правовой план, не юридическое заключение; перед публикацией сверить редакцию норм и точный порядок."
  },
  {
    "topicSlug": "otsrochka-ot-sluzhby",
    "topicTitle": "Отсрочка и освобождение от военной службы",
    "situationIndex": 4,
    "situationTitle": "Что делать, если отказали в предоставлении отсрочки?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Установить основание отказа, срок и порядок оспаривания.",
    "evidenceToConfirm": "Отказ, заявление и подтверждение его получения, документы об основании.",
    "competentRecipientToVerify": "Призывная комиссия вышестоящего уровня или суд.",
    "plannedResultToVerify": "Жалоба либо административный иск.",
    "sourceCandidates": [
      {
        "id": "53",
        "title": "Федеральный закон № 53-ФЗ",
        "url": "https://rosguard.gov.ru/document/article/federalnyj-zakon-ot-28-marta-1998-g--53fz",
        "type": "GOVERNMENT_REPRINT_STALE_NOT_CURRENT"
      },
      {
        "id": "kas",
        "title": "КАС РФ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "Не выдавать общей жалобы за правильный процессуальный документ при любом отказе.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный правовой план, не юридическое заключение; перед публикацией сверить редакцию норм и точный порядок."
  },
  {
    "topicSlug": "otsrochka-ot-sluzhby",
    "topicTitle": "Отсрочка и освобождение от военной службы",
    "situationIndex": 5,
    "situationTitle": "Как подтвердить право на отсрочку при уходе за родственником?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Подтвердить наличие предусмотренного законом ухода и отсутствие законных препятствий.",
    "evidenceToConfirm": "Медицинское заключение об уходе, документы о родстве, сведения о других обязанных лицах.",
    "competentRecipientToVerify": "Призывная комиссия.",
    "plannedResultToVerify": "Заявление об отсрочке по необходимости ухода.",
    "sourceCandidates": [
      {
        "id": "53",
        "title": "Федеральный закон № 53-ФЗ",
        "url": "https://rosguard.gov.ru/document/article/federalnyj-zakon-ot-28-marta-1998-g--53fz",
        "type": "GOVERNMENT_REPRINT_STALE_NOT_CURRENT"
      }
    ],
    "criticalLimitations": "Не предполагать право только из совместного проживания.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный правовой план, не юридическое заключение; перед публикацией сверить редакцию норм и точный порядок."
  },
  {
    "topicSlug": "otsrochka-ot-sluzhby",
    "topicTitle": "Отсрочка и освобождение от военной службы",
    "situationIndex": 6,
    "situationTitle": "Как оформить освобождение от призыва при наличии законных оснований?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Разграничить законные основания полного освобождения и отсрочки.",
    "evidenceToConfirm": "Документ, подтверждающий предусмотренное основание; решение комиссии.",
    "competentRecipientToVerify": "Призывная комиссия.",
    "plannedResultToVerify": "Заявление об освобождении от призыва.",
    "sourceCandidates": [
      {
        "id": "53",
        "title": "Федеральный закон № 53-ФЗ",
        "url": "https://rosguard.gov.ru/document/article/federalnyj-zakon-ot-28-marta-1998-g--53fz",
        "type": "GOVERNMENT_REPRINT_STALE_NOT_CURRENT"
      },
      {
        "id": "565",
        "title": "Постановление Правительства РФ № 565",
        "url": "https://mchs.gov.ru/dokumenty/553",
        "type": "GOVERNMENT_REPRINT"
      }
    ],
    "criticalLimitations": "Не оформлять бессрочное освобождение по временному обстоятельству.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный правовой план, не юридическое заключение; перед публикацией сверить редакцию норм и точный порядок."
  },
  {
    "topicSlug": "otsrochka-ot-sluzhby",
    "topicTitle": "Отсрочка и освобождение от военной службы",
    "situationIndex": 7,
    "situationTitle": "Как обжаловать отмену ранее предоставленной отсрочки?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Определить акт отмены, новые обстоятельства и правовую процедуру пересмотра.",
    "evidenceToConfirm": "Первое решение об отсрочке, новый акт об отмене, подтверждения.",
    "competentRecipientToVerify": "Вышестоящая комиссия или суд.",
    "plannedResultToVerify": "Жалоба об отмене ранее предоставленной отсрочки.",
    "sourceCandidates": [
      {
        "id": "53",
        "title": "Федеральный закон № 53-ФЗ",
        "url": "https://rosguard.gov.ru/document/article/federalnyj-zakon-ot-28-marta-1998-g--53fz",
        "type": "GOVERNMENT_REPRINT_STALE_NOT_CURRENT"
      },
      {
        "id": "kas",
        "title": "КАС РФ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "Проверить специальный срок и последствия обжалования.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный правовой план, не юридическое заключение; перед публикацией сверить редакцию норм и точный порядок."
  },
  {
    "topicSlug": "vvk-i-kategoriya-godnosti",
    "topicTitle": "ВВК и категория годности",
    "situationIndex": 0,
    "situationTitle": "Какие решения принимает военно-врачебная комиссия?",
    "situationKind": "information",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Уточнить вид службы и правомочия ВВК в соответствующей процедуре.",
    "evidenceToConfirm": "Заключение комиссии, документы об освидетельствовании.",
    "competentRecipientToVerify": "ВВК по установленной компетенции.",
    "plannedResultToVerify": "Информация без генератора.",
    "sourceCandidates": [
      {
        "id": "565",
        "title": "Постановление Правительства РФ № 565",
        "url": "https://mchs.gov.ru/dokumenty/553",
        "type": "GOVERNMENT_REPRINT"
      }
    ],
    "criticalLimitations": "ВВК не решает все кадровые и социальные вопросы.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный правовой план, не юридическое заключение; перед публикацией сверить редакцию норм и точный порядок."
  },
  {
    "topicSlug": "vvk-i-kategoriya-godnosti",
    "topicTitle": "ВВК и категория годности",
    "situationIndex": 1,
    "situationTitle": "Как добиться направления на военно-врачебную комиссию?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Определить лицо, уполномоченное направить на ВВК, и законное основание направления.",
    "evidenceToConfirm": "Медицинские документы и сведения о военной службе.",
    "competentRecipientToVerify": "Командование, военный комиссариат или уполномоченный орган по статусу.",
    "plannedResultToVerify": "Рапорт о направлении на ВВК.",
    "sourceCandidates": [
      {
        "id": "565",
        "title": "Постановление Правительства РФ № 565",
        "url": "https://mchs.gov.ru/dokumenty/553",
        "type": "GOVERNMENT_REPRINT"
      },
      {
        "id": "76",
        "title": "Федеральный закон № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "53",
        "title": "Федеральный закон № 53-ФЗ",
        "url": "https://rosguard.gov.ru/document/article/federalnyj-zakon-ot-28-marta-1998-g--53fz",
        "type": "GOVERNMENT_REPRINT_STALE_NOT_CURRENT"
      }
    ],
    "criticalLimitations": "Нельзя универсально направлять через командира гражданина, не проходящего службу.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный правовой план, не юридическое заключение; перед публикацией сверить редакцию норм и точный порядок."
  },
  {
    "topicSlug": "vvk-i-kategoriya-godnosti",
    "topicTitle": "ВВК и категория годности",
    "situationIndex": 2,
    "situationTitle": "Как пройти повторную ВВК при ухудшении состояния здоровья?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Установить новое или изменившееся медицинское состояние и порядок повторного освидетельствования.",
    "evidenceToConfirm": "Старое заключение, новые меддокументы, обращения за лечением.",
    "competentRecipientToVerify": "Уполномоченный орган направления и ВВК.",
    "plannedResultToVerify": "Рапорт/заявление о повторном освидетельствовании.",
    "sourceCandidates": [
      {
        "id": "565",
        "title": "Постановление Правительства РФ № 565",
        "url": "https://mchs.gov.ru/dokumenty/553",
        "type": "GOVERNMENT_REPRINT"
      }
    ],
    "criticalLimitations": "Не гарантировать изменение категории по жалобе.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный правовой план, не юридическое заключение; перед публикацией сверить редакцию норм и точный порядок."
  },
  {
    "topicSlug": "vvk-i-kategoriya-godnosti",
    "topicTitle": "ВВК и категория годности",
    "situationIndex": 3,
    "situationTitle": "Как обжаловать заключение ВВК?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Разграничить проверку заключения вышестоящей ВВК, независимую экспертизу и судебное обжалование.",
    "evidenceToConfirm": "Заключение ВВК, дата ознакомления, медицинские возражения.",
    "competentRecipientToVerify": "Вышестоящая ВВК или суд по применимым правилам.",
    "plannedResultToVerify": "Жалоба на заключение ВВК.",
    "sourceCandidates": [
      {
        "id": "565",
        "title": "Постановление Правительства РФ № 565",
        "url": "https://mchs.gov.ru/dokumenty/553",
        "type": "GOVERNMENT_REPRINT"
      },
      {
        "id": "574",
        "title": "Постановление Правительства РФ № 574",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "kas",
        "title": "КАС РФ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "Не использовать судебный путь автоматически без установления подсудности.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный правовой план, не юридическое заключение; перед публикацией сверить редакцию норм и точный порядок."
  },
  {
    "topicSlug": "vvk-i-kategoriya-godnosti",
    "topicTitle": "ВВК и категория годности",
    "situationIndex": 4,
    "situationTitle": "Как изменить категорию годности при наличии медицинских оснований?",
    "situationKind": "mixed",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Уточнить категорию лица и медицинские основания её изменения.",
    "evidenceToConfirm": "Старое заключение, новые обследования, документы о статусе.",
    "competentRecipientToVerify": "ВВК и направляющий орган.",
    "plannedResultToVerify": "Заявление о пересмотре категории годности.",
    "sourceCandidates": [
      {
        "id": "565",
        "title": "Постановление Правительства РФ № 565",
        "url": "https://mchs.gov.ru/dokumenty/553",
        "type": "GOVERNMENT_REPRINT"
      }
    ],
    "criticalLimitations": "Ни изменение диагноза, ни длительность лечения не определяют категорию автоматически.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный правовой план, не юридическое заключение; перед публикацией сверить редакцию норм и точный порядок."
  },
  {
    "topicSlug": "vvk-i-kategoriya-godnosti",
    "topicTitle": "ВВК и категория годности",
    "situationIndex": 5,
    "situationTitle": "Как провести независимую военно-врачебную экспертизу?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Проверить законный порядок независимой экспертизы, перечень учреждений и процесс оформления.",
    "evidenceToConfirm": "Заключение ВВК, документы об обследованиях.",
    "competentRecipientToVerify": "Организация с необходимыми полномочиями на независимую ВВЭ.",
    "plannedResultToVerify": "Заявление о проведении независимой военно-врачебной экспертизы.",
    "sourceCandidates": [
      {
        "id": "574",
        "title": "Постановление Правительства РФ № 574",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "565",
        "title": "Постановление Правительства РФ № 565",
        "url": "https://mchs.gov.ru/dokumenty/553",
        "type": "GOVERNMENT_REPRINT"
      }
    ],
    "criticalLimitations": "Не выдумывать список аккредитованных центров и цену.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный правовой план, не юридическое заключение; перед публикацией сверить редакцию норм и точный порядок."
  },
  {
    "topicSlug": "vvk-i-kategoriya-godnosti",
    "topicTitle": "ВВК и категория годности",
    "situationIndex": 6,
    "situationTitle": "Что делать, если ВВК не учитывает результаты обследований?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Проверить, какие документы представлены ВВК и должна ли комиссия учитывать их в данной процедуре.",
    "evidenceToConfirm": "Опись медицинских документов, акт ВВК и сведения о вручении.",
    "competentRecipientToVerify": "ВВК и вышестоящий орган.",
    "plannedResultToVerify": "Жалоба на неполное рассмотрение медицинских сведений.",
    "sourceCandidates": [
      {
        "id": "565",
        "title": "Постановление Правительства РФ № 565",
        "url": "https://mchs.gov.ru/dokumenty/553",
        "type": "GOVERNMENT_REPRINT"
      }
    ],
    "criticalLimitations": "Не подменять обжалование заключения жалобой на неподходящее учреждение.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный правовой план, не юридическое заключение; перед публикацией сверить редакцию норм и точный порядок."
  },
  {
    "topicSlug": "vvk-i-kategoriya-godnosti",
    "topicTitle": "ВВК и категория годности",
    "situationIndex": 7,
    "situationTitle": "Как получить копию заключения ВВК?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Подтвердить право на получение копии конкретного заключения и его держателя.",
    "evidenceToConfirm": "Дата освидетельствования, идентификатор заключения, сведения заявителя.",
    "competentRecipientToVerify": "Соответствующая ВВК/орган, располагающий заключением.",
    "plannedResultToVerify": "Заявление о выдаче копии заключения ВВК.",
    "sourceCandidates": [
      {
        "id": "565",
        "title": "Постановление Правительства РФ № 565",
        "url": "https://mchs.gov.ru/dokumenty/553",
        "type": "GOVERNMENT_REPRINT"
      }
    ],
    "criticalLimitations": "Учитывать правила доступа к медицинской информации.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный правовой план, не юридическое заключение; перед публикацией сверить редакцию норм и точный порядок."
  },
  {
    "topicSlug": "vvk-i-kategoriya-godnosti",
    "topicTitle": "ВВК и категория годности",
    "situationIndex": 8,
    "situationTitle": "Как обжаловать отказ в направлении на обследование?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Уточнить кто отказал в направлении, его полномочия и медицинские основания обследования.",
    "evidenceToConfirm": "Письменный отказ, история обращения, документы о состоянии здоровья.",
    "competentRecipientToVerify": "Командование, направляющий орган, вышестоящий орган либо суд.",
    "plannedResultToVerify": "Жалоба на отказ в направлении.",
    "sourceCandidates": [
      {
        "id": "565",
        "title": "Постановление Правительства РФ № 565",
        "url": "https://mchs.gov.ru/dokumenty/553",
        "type": "GOVERNMENT_REPRINT"
      },
      {
        "id": "76",
        "title": "Федеральный закон № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "kas",
        "title": "КАС РФ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "Отсутствие направления не всегда означает нарушение без подтверждённого показания.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный правовой план, не юридическое заключение; перед публикацией сверить редакцию норм и точный порядок."
  },
  {
    "topicSlug": "raporty-i-obrashcheniya",
    "topicTitle": "Рапорты и обращения военнослужащих",
    "situationIndex": 0,
    "situationTitle": "Каков общий порядок рассмотрения рапортов военнослужащих?",
    "situationKind": "information",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Разграничить виды рапортов и внутренний порядок подачи.",
    "evidenceToConfirm": "Приказы, локальный порядок рассмотрения.",
    "competentRecipientToVerify": "Командование, канцелярия либо уполномоченное должностное лицо; при споре компетенцию проверить отдельно.",
    "plannedResultToVerify": "Информация без генератора.",
    "sourceCandidates": [
      {
        "id": "76",
        "title": "ФЗ № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "1237",
        "title": "Указ № 1237",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "Не применять единый срок ко всем служебным рапортам.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный план по конкретной ситуации, без подтверждения юридической применимости."
  },
  {
    "topicSlug": "raporty-i-obrashcheniya",
    "topicTitle": "Рапорты и обращения военнослужащих",
    "situationIndex": 1,
    "situationTitle": "Как подать рапорт командиру воинской части?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Определить требование и компетенцию командования.",
    "evidenceToConfirm": "Статус заявителя, факты и необходимые приложения.",
    "competentRecipientToVerify": "Командование, канцелярия либо уполномоченное должностное лицо; при споре компетенцию проверить отдельно.",
    "plannedResultToVerify": "Рапорт с конкретным требованием.",
    "sourceCandidates": [
      {
        "id": "76",
        "title": "ФЗ № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "1237",
        "title": "Указ № 1237",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "Не создавать пустое требование 'прошу рассмотреть вопрос'.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный план по конкретной ситуации, без подтверждения юридической применимости."
  },
  {
    "topicSlug": "raporty-i-obrashcheniya",
    "topicTitle": "Рапорты и обращения военнослужащих",
    "situationIndex": 2,
    "situationTitle": "Что делать, если командир не принимает рапорт?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Подтвердить факт непринятия служебного обращения.",
    "evidenceToConfirm": "Копия рапорта и сведения об отказе.",
    "competentRecipientToVerify": "Командование, канцелярия либо уполномоченное должностное лицо; при споре компетенцию проверить отдельно.",
    "plannedResultToVerify": "Жалоба на отказ в принятии рапорта.",
    "sourceCandidates": [
      {
        "id": "76",
        "title": "ФЗ № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "1237",
        "title": "Указ № 1237",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "Не считать отсутствие номера автоматическим отказом.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный план по конкретной ситуации, без подтверждения юридической применимости."
  },
  {
    "topicSlug": "raporty-i-obrashcheniya",
    "topicTitle": "Рапорты и обращения военнослужащих",
    "situationIndex": 3,
    "situationTitle": "Как добиться регистрации поданного рапорта?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Выяснить способ подтверждения регистрации документа.",
    "evidenceToConfirm": "Копия рапорта, почтовые или канцелярские отметки.",
    "competentRecipientToVerify": "Командование, канцелярия либо уполномоченное должностное лицо; при споре компетенцию проверить отдельно.",
    "plannedResultToVerify": "Заявление о регистрации поданного рапорта.",
    "sourceCandidates": [
      {
        "id": "76",
        "title": "ФЗ № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "1237",
        "title": "Указ № 1237",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "Не подменять установленную ведомственную процедуру.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный план по конкретной ситуации, без подтверждения юридической применимости."
  },
  {
    "topicSlug": "raporty-i-obrashcheniya",
    "topicTitle": "Рапорты и обращения военнослужащих",
    "situationIndex": 4,
    "situationTitle": "Что делать, если командование не отвечает на рапорт?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Установить срок рассмотрения для данного вида обращения.",
    "evidenceToConfirm": "Дата подачи, доказательство регистрации, переписка.",
    "competentRecipientToVerify": "Командование, канцелярия либо уполномоченное должностное лицо; при споре компетенцию проверить отдельно.",
    "plannedResultToVerify": "Жалоба на бездействие командования.",
    "sourceCandidates": [
      {
        "id": "76",
        "title": "ФЗ № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "1237",
        "title": "Указ № 1237",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "Общий срок гражданских обращений может не применяться.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный план по конкретной ситуации, без подтверждения юридической применимости."
  },
  {
    "topicSlug": "raporty-i-obrashcheniya",
    "topicTitle": "Рапорты и обращения военнослужащих",
    "situationIndex": 5,
    "situationTitle": "Как получить письменное решение по поданному обращению?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Проверить право получить письменное решение по поданному рапорту.",
    "evidenceToConfirm": "Реквизиты рапорта, входящий номер, данные об ответе.",
    "competentRecipientToVerify": "Командование, канцелярия либо уполномоченное должностное лицо; при споре компетенцию проверить отдельно.",
    "plannedResultToVerify": "Заявление о выдаче письменного решения.",
    "sourceCandidates": [
      {
        "id": "76",
        "title": "ФЗ № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "1237",
        "title": "Указ № 1237",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "Доступ к отдельным материалам может ограничиваться законом.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный план по конкретной ситуации, без подтверждения юридической применимости."
  },
  {
    "topicSlug": "raporty-i-obrashcheniya",
    "topicTitle": "Рапорты и обращения военнослужащих",
    "situationIndex": 6,
    "situationTitle": "Как обжаловать отказ командования?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Выяснить точный отказ и его правовую природу.",
    "evidenceToConfirm": "Оригинал отказа, рапорт, подтверждающие документы.",
    "competentRecipientToVerify": "Командование, канцелярия либо уполномоченное должностное лицо; при споре компетенцию проверить отдельно.",
    "plannedResultToVerify": "Жалоба или административный иск.",
    "sourceCandidates": [
      {
        "id": "76",
        "title": "ФЗ № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "1237",
        "title": "Указ № 1237",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "Не выбирать суд до квалификации спора.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный план по конкретной ситуации, без подтверждения юридической применимости."
  },
  {
    "topicSlug": "uvolnenie-s-voennoy-sluzhby",
    "topicTitle": "Увольнение с военной службы",
    "situationIndex": 0,
    "situationTitle": "Какие основания увольнения применимы к различным видам военной службы?",
    "situationKind": "information",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Разграничить основания увольнения по виду и периоду службы.",
    "evidenceToConfirm": "Контракт, служебный статус и применимый режим.",
    "competentRecipientToVerify": "Командование и кадровый орган; при обжаловании — вышестоящий орган или надлежащий суд.",
    "plannedResultToVerify": "Информация без генератора.",
    "sourceCandidates": [
      {
        "id": "53",
        "title": "ФЗ № 53-ФЗ",
        "url": "https://rosguard.gov.ru/document/article/federalnyj-zakon-ot-28-marta-1998-g--53fz",
        "type": "GOVERNMENT_REPRINT_STALE_NOT_CURRENT"
      },
      {
        "id": "76",
        "title": "ФЗ № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "1237",
        "title": "Указ № 1237",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "647",
        "title": "Указ № 647",
        "url": "https://publication.pravo.gov.ru/Document/View/0001202209210001",
        "type": "OFFICIAL_RECORD_CANDIDATE"
      }
    ],
    "criticalLimitations": "Истечение контракта не гарантирует увольнения.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный план по конкретной ситуации, без подтверждения юридической применимости."
  },
  {
    "topicSlug": "uvolnenie-s-voennoy-sluzhby",
    "topicTitle": "Увольнение с военной службы",
    "situationIndex": 1,
    "situationTitle": "Как уволиться с военной службы по состоянию здоровья?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Проверить медицинское основание и требования заключения ВВК.",
    "evidenceToConfirm": "Заключение ВВК, медицинские документы и контракт.",
    "competentRecipientToVerify": "Командование и кадровый орган; при обжаловании — вышестоящий орган или надлежащий суд.",
    "plannedResultToVerify": "Рапорт об увольнении по здоровью.",
    "sourceCandidates": [
      {
        "id": "53",
        "title": "ФЗ № 53-ФЗ",
        "url": "https://rosguard.gov.ru/document/article/federalnyj-zakon-ot-28-marta-1998-g--53fz",
        "type": "GOVERNMENT_REPRINT_STALE_NOT_CURRENT"
      },
      {
        "id": "76",
        "title": "ФЗ № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "1237",
        "title": "Указ № 1237",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "647",
        "title": "Указ № 647",
        "url": "https://publication.pravo.gov.ru/Document/View/0001202209210001",
        "type": "OFFICIAL_RECORD_CANDIDATE"
      }
    ],
    "criticalLimitations": "Диагноз не равен подтверждённому основанию увольнения.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный план по конкретной ситуации, без подтверждения юридической применимости."
  },
  {
    "topicSlug": "uvolnenie-s-voennoy-sluzhby",
    "topicTitle": "Увольнение с военной службы",
    "situationIndex": 2,
    "situationTitle": "Как подать рапорт об увольнении по семейным обстоятельствам?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Установить законное семейное основание для данной категории военнослужащего.",
    "evidenceToConfirm": "Документы о семье, нуждаемости в уходе, статус службы.",
    "competentRecipientToVerify": "Командование и кадровый орган; при обжаловании — вышестоящий орган или надлежащий суд.",
    "plannedResultToVerify": "Рапорт об увольнении по семейным обстоятельствам.",
    "sourceCandidates": [
      {
        "id": "53",
        "title": "ФЗ № 53-ФЗ",
        "url": "https://rosguard.gov.ru/document/article/federalnyj-zakon-ot-28-marta-1998-g--53fz",
        "type": "GOVERNMENT_REPRINT_STALE_NOT_CURRENT"
      },
      {
        "id": "76",
        "title": "ФЗ № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "1237",
        "title": "Указ № 1237",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "647",
        "title": "Указ № 647",
        "url": "https://publication.pravo.gov.ru/Document/View/0001202209210001",
        "type": "OFFICIAL_RECORD_CANDIDATE"
      }
    ],
    "criticalLimitations": "Семейная ситуация не всегда создаёт право на увольнение.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный план по конкретной ситуации, без подтверждения юридической применимости."
  },
  {
    "topicSlug": "uvolnenie-s-voennoy-sluzhby",
    "topicTitle": "Увольнение с военной службы",
    "situationIndex": 3,
    "situationTitle": "Можно ли уволиться после окончания срока контракта?",
    "situationKind": "mixed",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Сверить специальные правила службы на дату окончания контракта.",
    "evidenceToConfirm": "Контракт, календарный срок, служебные приказы.",
    "competentRecipientToVerify": "Командование и кадровый орган; при обжаловании — вышестоящий орган или надлежащий суд.",
    "plannedResultToVerify": "Рапорт по законному основанию или информационный ответ.",
    "sourceCandidates": [
      {
        "id": "53",
        "title": "ФЗ № 53-ФЗ",
        "url": "https://rosguard.gov.ru/document/article/federalnyj-zakon-ot-28-marta-1998-g--53fz",
        "type": "GOVERNMENT_REPRINT_STALE_NOT_CURRENT"
      },
      {
        "id": "76",
        "title": "ФЗ № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "1237",
        "title": "Указ № 1237",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "647",
        "title": "Указ № 647",
        "url": "https://publication.pravo.gov.ru/Document/View/0001202209210001",
        "type": "OFFICIAL_RECORD_CANDIDATE"
      }
    ],
    "criticalLimitations": "Не гарантировать прекращение службы по одной календарной дате.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный план по конкретной ситуации, без подтверждения юридической применимости."
  },
  {
    "topicSlug": "uvolnenie-s-voennoy-sluzhby",
    "topicTitle": "Увольнение с военной службы",
    "situationIndex": 4,
    "situationTitle": "Как добиться увольнения при достижении предельного возраста?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Определить применимый возраст по воинскому званию и статусу.",
    "evidenceToConfirm": "Паспорт, воинское звание, контракт, кадровые документы.",
    "competentRecipientToVerify": "Командование и кадровый орган; при обжаловании — вышестоящий орган или надлежащий суд.",
    "plannedResultToVerify": "Рапорт об увольнении по возрасту.",
    "sourceCandidates": [
      {
        "id": "53",
        "title": "ФЗ № 53-ФЗ",
        "url": "https://rosguard.gov.ru/document/article/federalnyj-zakon-ot-28-marta-1998-g--53fz",
        "type": "GOVERNMENT_REPRINT_STALE_NOT_CURRENT"
      },
      {
        "id": "76",
        "title": "ФЗ № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "1237",
        "title": "Указ № 1237",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "647",
        "title": "Указ № 647",
        "url": "https://publication.pravo.gov.ru/Document/View/0001202209210001",
        "type": "OFFICIAL_RECORD_CANDIDATE"
      }
    ],
    "criticalLimitations": "Специальные режимы могут изменять обычные возрастные пределы.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный план по конкретной ситуации, без подтверждения юридической применимости."
  },
  {
    "topicSlug": "uvolnenie-s-voennoy-sluzhby",
    "topicTitle": "Увольнение с военной службы",
    "situationIndex": 5,
    "situationTitle": "Как оспорить отказ в увольнении?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Проверить мотивы отказа и допустимый порядок оспаривания.",
    "evidenceToConfirm": "Рапорт, письменный отказ, доказательства оснований.",
    "competentRecipientToVerify": "Командование и кадровый орган; при обжаловании — вышестоящий орган или надлежащий суд.",
    "plannedResultToVerify": "Жалоба на отказ или административный иск.",
    "sourceCandidates": [
      {
        "id": "53",
        "title": "ФЗ № 53-ФЗ",
        "url": "https://rosguard.gov.ru/document/article/federalnyj-zakon-ot-28-marta-1998-g--53fz",
        "type": "GOVERNMENT_REPRINT_STALE_NOT_CURRENT"
      },
      {
        "id": "76",
        "title": "ФЗ № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "1237",
        "title": "Указ № 1237",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "647",
        "title": "Указ № 647",
        "url": "https://publication.pravo.gov.ru/Document/View/0001202209210001",
        "type": "OFFICIAL_RECORD_CANDIDATE"
      }
    ],
    "criticalLimitations": "Без надлежащего ответчика и подсудности иск не формировать.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный план по конкретной ситуации, без подтверждения юридической применимости."
  },
  {
    "topicSlug": "uvolnenie-s-voennoy-sluzhby",
    "topicTitle": "Увольнение с военной службы",
    "situationIndex": 6,
    "situationTitle": "Что делать, если командование не рассматривает рапорт об увольнении?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Определить обязанность рассмотрения и факт бездействия.",
    "evidenceToConfirm": "Поданный рапорт, входящий номер и даты.",
    "competentRecipientToVerify": "Командование и кадровый орган; при обжаловании — вышестоящий орган или надлежащий суд.",
    "plannedResultToVerify": "Жалоба на нерассмотрение рапорта об увольнении.",
    "sourceCandidates": [
      {
        "id": "53",
        "title": "ФЗ № 53-ФЗ",
        "url": "https://rosguard.gov.ru/document/article/federalnyj-zakon-ot-28-marta-1998-g--53fz",
        "type": "GOVERNMENT_REPRINT_STALE_NOT_CURRENT"
      },
      {
        "id": "76",
        "title": "ФЗ № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "1237",
        "title": "Указ № 1237",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "647",
        "title": "Указ № 647",
        "url": "https://publication.pravo.gov.ru/Document/View/0001202209210001",
        "type": "OFFICIAL_RECORD_CANDIDATE"
      }
    ],
    "criticalLimitations": "Бездействие не доказывает само право на увольнение.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный план по конкретной ситуации, без подтверждения юридической применимости."
  },
  {
    "topicSlug": "uvolnenie-s-voennoy-sluzhby",
    "topicTitle": "Увольнение с военной службы",
    "situationIndex": 7,
    "situationTitle": "Как оспорить незаконный приказ об увольнении?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Установить законность приказа и процессуальную форму защиты.",
    "evidenceToConfirm": "Приказ об увольнении, дата вручения, статус службы.",
    "competentRecipientToVerify": "Командование и кадровый орган; при обжаловании — вышестоящий орган или надлежащий суд.",
    "plannedResultToVerify": "Административный иск об оспаривании приказа при допустимости.",
    "sourceCandidates": [
      {
        "id": "53",
        "title": "ФЗ № 53-ФЗ",
        "url": "https://rosguard.gov.ru/document/article/federalnyj-zakon-ot-28-marta-1998-g--53fz",
        "type": "GOVERNMENT_REPRINT_STALE_NOT_CURRENT"
      },
      {
        "id": "76",
        "title": "ФЗ № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "1237",
        "title": "Указ № 1237",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "647",
        "title": "Указ № 647",
        "url": "https://publication.pravo.gov.ru/Document/View/0001202209210001",
        "type": "OFFICIAL_RECORD_CANDIDATE"
      }
    ],
    "criticalLimitations": "Сроки обращения проверять по виду спора.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный план по конкретной ситуации, без подтверждения юридической применимости."
  },
  {
    "topicSlug": "uvolnenie-s-voennoy-sluzhby",
    "topicTitle": "Увольнение с военной службы",
    "situationIndex": 8,
    "situationTitle": "Как получить документы и окончательный расчёт при увольнении?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Разделить требование о документах и расчёте при увольнении.",
    "evidenceToConfirm": "Приказ, расчётные сведения, документы о выслуге.",
    "competentRecipientToVerify": "Командование и кадровый орган; при обжаловании — вышестоящий орган или надлежащий суд.",
    "plannedResultToVerify": "Заявление о выдаче документов и расчёте.",
    "sourceCandidates": [
      {
        "id": "53",
        "title": "ФЗ № 53-ФЗ",
        "url": "https://rosguard.gov.ru/document/article/federalnyj-zakon-ot-28-marta-1998-g--53fz",
        "type": "GOVERNMENT_REPRINT_STALE_NOT_CURRENT"
      },
      {
        "id": "76",
        "title": "ФЗ № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "1237",
        "title": "Указ № 1237",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "647",
        "title": "Указ № 647",
        "url": "https://publication.pravo.gov.ru/Document/View/0001202209210001",
        "type": "OFFICIAL_RECORD_CANDIDATE"
      }
    ],
    "criticalLimitations": "Не выдумывать размер не начисленных выплат.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный план по конкретной ситуации, без подтверждения юридической применимости."
  },
  {
    "topicSlug": "perevod-v-druguyu-chast",
    "topicTitle": "Перевод в другую воинскую часть",
    "situationIndex": 0,
    "situationTitle": "В каких случаях допускается перевод военнослужащего?",
    "situationKind": "information",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Проверить основания добровольного и служебного перевода.",
    "evidenceToConfirm": "Должность, категория службы и служебные приказы.",
    "competentRecipientToVerify": "Кадровый орган, командование либо вышестоящий орган по предмету требования.",
    "plannedResultToVerify": "Информация без генератора.",
    "sourceCandidates": [
      {
        "id": "53",
        "title": "ФЗ № 53-ФЗ",
        "url": "https://rosguard.gov.ru/document/article/federalnyj-zakon-ot-28-marta-1998-g--53fz",
        "type": "GOVERNMENT_REPRINT_STALE_NOT_CURRENT"
      },
      {
        "id": "76",
        "title": "ФЗ № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "1237",
        "title": "Указ № 1237",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "Перевод по просьбе не является безусловным правом.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный план по конкретной ситуации, без подтверждения юридической применимости."
  },
  {
    "topicSlug": "perevod-v-druguyu-chast",
    "topicTitle": "Перевод в другую воинскую часть",
    "situationIndex": 1,
    "situationTitle": "Как подать рапорт о переводе в другую воинскую часть?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Выяснить компетенцию кадрового органа и основания перевода.",
    "evidenceToConfirm": "Служебные обстоятельства, сведения о месте службы.",
    "competentRecipientToVerify": "Кадровый орган, командование либо вышестоящий орган по предмету требования.",
    "plannedResultToVerify": "Рапорт о переводе в другую часть.",
    "sourceCandidates": [
      {
        "id": "53",
        "title": "ФЗ № 53-ФЗ",
        "url": "https://rosguard.gov.ru/document/article/federalnyj-zakon-ot-28-marta-1998-g--53fz",
        "type": "GOVERNMENT_REPRINT_STALE_NOT_CURRENT"
      },
      {
        "id": "76",
        "title": "ФЗ № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "1237",
        "title": "Указ № 1237",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "Желаемая часть может не принять военнослужащего.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный план по конкретной ситуации, без подтверждения юридической применимости."
  },
  {
    "topicSlug": "perevod-v-druguyu-chast",
    "topicTitle": "Перевод в другую воинскую часть",
    "situationIndex": 2,
    "situationTitle": "Как оформить перевод по состоянию здоровья?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Проверить заключение ВВК и необходимость медицинского перевода.",
    "evidenceToConfirm": "Заключение ВВК и документы о доступной должности.",
    "competentRecipientToVerify": "Кадровый орган, командование либо вышестоящий орган по предмету требования.",
    "plannedResultToVerify": "Рапорт о переводе по состоянию здоровья.",
    "sourceCandidates": [
      {
        "id": "53",
        "title": "ФЗ № 53-ФЗ",
        "url": "https://rosguard.gov.ru/document/article/federalnyj-zakon-ot-28-marta-1998-g--53fz",
        "type": "GOVERNMENT_REPRINT_STALE_NOT_CURRENT"
      },
      {
        "id": "76",
        "title": "ФЗ № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "1237",
        "title": "Указ № 1237",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "Не подменять заключение врача заявлением.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный план по конкретной ситуации, без подтверждения юридической применимости."
  },
  {
    "topicSlug": "perevod-v-druguyu-chast",
    "topicTitle": "Перевод в другую воинскую часть",
    "situationIndex": 3,
    "situationTitle": "Как добиться перевода по семейным обстоятельствам?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Проверить предусмотренность перевода по конкретным семейным обстоятельствам.",
    "evidenceToConfirm": "Свидетельства о родстве и документы о необходимости переезда.",
    "competentRecipientToVerify": "Кадровый орган, командование либо вышестоящий орган по предмету требования.",
    "plannedResultToVerify": "Рапорт о переводе по семейному основанию.",
    "sourceCandidates": [
      {
        "id": "53",
        "title": "ФЗ № 53-ФЗ",
        "url": "https://rosguard.gov.ru/document/article/federalnyj-zakon-ot-28-marta-1998-g--53fz",
        "type": "GOVERNMENT_REPRINT_STALE_NOT_CURRENT"
      },
      {
        "id": "76",
        "title": "ФЗ № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "1237",
        "title": "Указ № 1237",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "Наличие родственников не гарантирует перевод.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный план по конкретной ситуации, без подтверждения юридической применимости."
  },
  {
    "topicSlug": "perevod-v-druguyu-chast",
    "topicTitle": "Перевод в другую воинскую часть",
    "situationIndex": 4,
    "situationTitle": "Что делать, если военнослужащего перевели без законных оснований?",
    "situationKind": "mixed",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Выяснить законность кадрового приказа и необходимость согласия.",
    "evidenceToConfirm": "Приказ о переводе, звание, должность, служебные ограничения.",
    "competentRecipientToVerify": "Кадровый орган, командование либо вышестоящий орган по предмету требования.",
    "plannedResultToVerify": "Жалоба на неправомерный перевод.",
    "sourceCandidates": [
      {
        "id": "53",
        "title": "ФЗ № 53-ФЗ",
        "url": "https://rosguard.gov.ru/document/article/federalnyj-zakon-ot-28-marta-1998-g--53fz",
        "type": "GOVERNMENT_REPRINT_STALE_NOT_CURRENT"
      },
      {
        "id": "76",
        "title": "ФЗ № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "1237",
        "title": "Указ № 1237",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "Отсутствие согласия не всегда делает перевод незаконным.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный план по конкретной ситуации, без подтверждения юридической применимости."
  },
  {
    "topicSlug": "perevod-v-druguyu-chast",
    "topicTitle": "Перевод в другую воинскую часть",
    "situationIndex": 5,
    "situationTitle": "Как обжаловать отказ в переводе?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Установить форму отказа и порядок кадрового оспаривания.",
    "evidenceToConfirm": "Рапорт о переводе и полученный ответ.",
    "competentRecipientToVerify": "Кадровый орган, командование либо вышестоящий орган по предмету требования.",
    "plannedResultToVerify": "Жалоба на отказ в переводе.",
    "sourceCandidates": [
      {
        "id": "53",
        "title": "ФЗ № 53-ФЗ",
        "url": "https://rosguard.gov.ru/document/article/federalnyj-zakon-ot-28-marta-1998-g--53fz",
        "type": "GOVERNMENT_REPRINT_STALE_NOT_CURRENT"
      },
      {
        "id": "76",
        "title": "ФЗ № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "1237",
        "title": "Указ № 1237",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "Не обещать согласование перевода по факту жалобы.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный план по конкретной ситуации, без подтверждения юридической применимости."
  },
  {
    "topicSlug": "otpusk-voennosluzhashchego",
    "topicTitle": "Отпуск военнослужащего",
    "situationIndex": 0,
    "situationTitle": "Какие виды отпусков предусмотрены для военнослужащих?",
    "situationKind": "information",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Разграничить основные и дополнительные виды отпуска.",
    "evidenceToConfirm": "Выслуга, вид службы и график отпусков.",
    "competentRecipientToVerify": "Командование и орган учёта отпусков; для жалобы — вышестоящее должностное лицо.",
    "plannedResultToVerify": "Информация без генератора.",
    "sourceCandidates": [
      {
        "id": "76",
        "title": "ФЗ № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "1237",
        "title": "Указ № 1237",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "Продолжительность зависит от применимых условий.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный план по конкретной ситуации, без подтверждения юридической применимости."
  },
  {
    "topicSlug": "otpusk-voennosluzhashchego",
    "topicTitle": "Отпуск военнослужащего",
    "situationIndex": 1,
    "situationTitle": "Как получить основной отпуск военнослужащему?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Проверить период, график и остаток основного отпуска.",
    "evidenceToConfirm": "График, приказы об отпусках, неиспользованные дни.",
    "competentRecipientToVerify": "Командование и орган учёта отпусков; для жалобы — вышестоящее должностное лицо.",
    "plannedResultToVerify": "Рапорт о предоставлении основного отпуска.",
    "sourceCandidates": [
      {
        "id": "76",
        "title": "ФЗ № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "1237",
        "title": "Указ № 1237",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "Даты не всегда определяются единоличным желанием военнослужащего.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный план по конкретной ситуации, без подтверждения юридической применимости."
  },
  {
    "topicSlug": "otpusk-voennosluzhashchego",
    "topicTitle": "Отпуск военнослужащего",
    "situationIndex": 2,
    "situationTitle": "Как получить отпуск по семейным обстоятельствам?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Проверить основание семейного отпуска и подтверждение события.",
    "evidenceToConfirm": "Семейные документы и предполагаемые даты.",
    "competentRecipientToVerify": "Командование и орган учёта отпусков; для жалобы — вышестоящее должностное лицо.",
    "plannedResultToVerify": "Рапорт о предоставлении семейного отпуска.",
    "sourceCandidates": [
      {
        "id": "76",
        "title": "ФЗ № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "1237",
        "title": "Указ № 1237",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "Семейный отпуск отличается от основного.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный план по конкретной ситуации, без подтверждения юридической применимости."
  },
  {
    "topicSlug": "otpusk-voennosluzhashchego",
    "topicTitle": "Отпуск военнослужащего",
    "situationIndex": 3,
    "situationTitle": "Что делать, если командование отказывает в предоставлении отпуска?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Определить законность конкретного отказа в отпуске.",
    "evidenceToConfirm": "Рапорт, график, письменный отказ.",
    "competentRecipientToVerify": "Командование и орган учёта отпусков; для жалобы — вышестоящее должностное лицо.",
    "plannedResultToVerify": "Жалоба на отказ в отпуске.",
    "sourceCandidates": [
      {
        "id": "76",
        "title": "ФЗ № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "1237",
        "title": "Указ № 1237",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "Не любой отказ в выбранных датах незаконен.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный план по конкретной ситуации, без подтверждения юридической применимости."
  },
  {
    "topicSlug": "otpusk-voennosluzhashchego",
    "topicTitle": "Отпуск военнослужащего",
    "situationIndex": 4,
    "situationTitle": "Как добиться предоставления неиспользованного отпуска?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Выявить остаток и условия переноса неиспользованного отпуска.",
    "evidenceToConfirm": "График, приказы, данные учёта дней.",
    "competentRecipientToVerify": "Командование и орган учёта отпусков; для жалобы — вышестоящее должностное лицо.",
    "plannedResultToVerify": "Рапорт о предоставлении остатка отпуска.",
    "sourceCandidates": [
      {
        "id": "76",
        "title": "ФЗ № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "1237",
        "title": "Указ № 1237",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "Не считать отпуск только по календарному подсчёту пользователя.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный план по конкретной ситуации, без подтверждения юридической применимости."
  },
  {
    "topicSlug": "otpusk-voennosluzhashchego",
    "topicTitle": "Отпуск военнослужащего",
    "situationIndex": 5,
    "situationTitle": "Как обжаловать незаконный отзыв из отпуска?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Проверить основание и процедуру отзыва военнослужащего.",
    "evidenceToConfirm": "Приказ об отзыве, сведения об отпуске, уведомление.",
    "competentRecipientToVerify": "Командование и орган учёта отпусков; для жалобы — вышестоящее должностное лицо.",
    "plannedResultToVerify": "Жалоба на отзыв из отпуска при наличии нарушения.",
    "sourceCandidates": [
      {
        "id": "76",
        "title": "ФЗ № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "1237",
        "title": "Указ № 1237",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "Закон может допускать отдельные случаи отзыва.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный план по конкретной ситуации, без подтверждения юридической применимости."
  },
  {
    "topicSlug": "denezhnoe-dovolstvie",
    "topicTitle": "Денежное довольствие",
    "situationIndex": 0,
    "situationTitle": "Из каких выплат состоит денежное довольствие военнослужащего?",
    "situationKind": "information",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Отделить довольствие от иных единовременных и специальных выплат.",
    "evidenceToConfirm": "Служебный статус, приказы, расчётные сведения.",
    "competentRecipientToVerify": "Финансовый орган и командование; судебную компетенцию проверить отдельно.",
    "plannedResultToVerify": "Информация без генератора.",
    "sourceCandidates": [
      {
        "id": "306",
        "title": "ФЗ № 306-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "76",
        "title": "ФЗ № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "Правила выплат за участие в СВО могут быть отдельными.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный план по конкретной ситуации, без подтверждения юридической применимости."
  },
  {
    "topicSlug": "denezhnoe-dovolstvie",
    "topicTitle": "Денежное довольствие",
    "situationIndex": 1,
    "situationTitle": "Что делать, если военнослужащему не выплачивают денежное довольствие?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Установить сумму и период невыплаты именно довольствия.",
    "evidenceToConfirm": "Банковские выписки, расчётные листы, приказы.",
    "competentRecipientToVerify": "Финансовый орган и командование; судебную компетенцию проверить отдельно.",
    "plannedResultToVerify": "Требование о проверке и выплате задолженности.",
    "sourceCandidates": [
      {
        "id": "306",
        "title": "ФЗ № 306-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "76",
        "title": "ФЗ № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "Не заявлять без расчётов произвольный размер долга.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный план по конкретной ситуации, без подтверждения юридической применимости."
  },
  {
    "topicSlug": "denezhnoe-dovolstvie",
    "topicTitle": "Денежное довольствие",
    "situationIndex": 2,
    "situationTitle": "Как взыскать задолженность по денежному довольствию?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Определить взыскиваемое требование и надлежащую процедуру суда.",
    "evidenceToConfirm": "Расчёты, ответ финансовой службы, документы службы.",
    "competentRecipientToVerify": "Финансовый орган и командование; судебную компетенцию проверить отдельно.",
    "plannedResultToVerify": "Заявление в суд по установленной процедуре.",
    "sourceCandidates": [
      {
        "id": "306",
        "title": "ФЗ № 306-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "76",
        "title": "ФЗ № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "Не путать публично-правовой и иной денежный спор.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный план по конкретной ситуации, без подтверждения юридической применимости."
  },
  {
    "topicSlug": "denezhnoe-dovolstvie",
    "topicTitle": "Денежное довольствие",
    "situationIndex": 3,
    "situationTitle": "Как оспорить неправильный расчёт выплат?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Проверить расчётные основания и характер ошибки.",
    "evidenceToConfirm": "Расчётные листы, дата начисления, платежи.",
    "competentRecipientToVerify": "Финансовый орган и командование; судебную компетенцию проверить отдельно.",
    "plannedResultToVerify": "Заявление о перерасчёте довольствия.",
    "sourceCandidates": [
      {
        "id": "306",
        "title": "ФЗ № 306-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "76",
        "title": "ФЗ № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "Не придумывать процент или основание надбавки.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный план по конкретной ситуации, без подтверждения юридической применимости."
  },
  {
    "topicSlug": "denezhnoe-dovolstvie",
    "topicTitle": "Денежное довольствие",
    "situationIndex": 4,
    "situationTitle": "Что делать при незаконных удержаниях из денежного довольствия?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Определить юридический источник и размер каждого удержания.",
    "evidenceToConfirm": "Приказ об удержании, платёжные документы.",
    "competentRecipientToVerify": "Финансовый орган и командование; судебную компетенцию проверить отдельно.",
    "plannedResultToVerify": "Заявление о проверке и возврате незаконного удержания.",
    "sourceCandidates": [
      {
        "id": "306",
        "title": "ФЗ № 306-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "76",
        "title": "ФЗ № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "Не любое удержание неправомерно.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный план по конкретной ситуации, без подтверждения юридической применимости."
  },
  {
    "topicSlug": "denezhnoe-dovolstvie",
    "topicTitle": "Денежное довольствие",
    "situationIndex": 5,
    "situationTitle": "Как добиться выплаты положенных надбавок?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Подтвердить вид надбавки и выполнение условий её назначения.",
    "evidenceToConfirm": "Приказ, должностные обязанности, периоды выполнения.",
    "competentRecipientToVerify": "Финансовый орган и командование; судебную компетенцию проверить отдельно.",
    "plannedResultToVerify": "Заявление о начислении конкретной надбавки.",
    "sourceCandidates": [
      {
        "id": "306",
        "title": "ФЗ № 306-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "76",
        "title": "ФЗ № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "Одного наименования должности недостаточно.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный план по конкретной ситуации, без подтверждения юридической применимости."
  },
  {
    "topicSlug": "denezhnoe-dovolstvie",
    "topicTitle": "Денежное довольствие",
    "situationIndex": 6,
    "situationTitle": "Как получить расчётные документы о начислениях и удержаниях?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Проверить доступность расчётных сведений за указанный срок.",
    "evidenceToConfirm": "Данные службы, период и прежние обращения.",
    "competentRecipientToVerify": "Финансовый орган и командование; судебную компетенцию проверить отдельно.",
    "plannedResultToVerify": "Заявление о выдаче расчётных документов.",
    "sourceCandidates": [
      {
        "id": "306",
        "title": "ФЗ № 306-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "76",
        "title": "ФЗ № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "Может требоваться подтверждение права доступа.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный план по конкретной ситуации, без подтверждения юридической применимости."
  },
  {
    "topicSlug": "vyplaty-za-uchastie-v-svo",
    "topicTitle": "Выплаты за участие в СВО",
    "situationIndex": 0,
    "situationTitle": "Какие виды выплат предусмотрены для участников СВО?",
    "situationKind": "information",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Разделить федеральные, ведомственные и региональные меры по правовому статусу.",
    "evidenceToConfirm": "Статус участника, приказы, данные о периодах службы.",
    "competentRecipientToVerify": "Военно-финансовый или региональный уполномоченный орган по конкретной выплате; для обжалования проверить порядок.",
    "plannedResultToVerify": "Информация без генератора.",
    "sourceCandidates": [
      {
        "id": "76",
        "title": "ФЗ № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "306",
        "title": "ФЗ № 306-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "647",
        "title": "Указ № 647",
        "url": "https://publication.pravo.gov.ru/Document/View/0001202209210001",
        "type": "OFFICIAL_RECORD_CANDIDATE"
      },
      {
        "id": "52",
        "title": "ФЗ № 52-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "Название выплаты не подтверждает право на неё.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционная индивидуальная карта; оценка юридических оснований и редакции источника ещё не проведена."
  },
  {
    "topicSlug": "vyplaty-za-uchastie-v-svo",
    "topicTitle": "Выплаты за участие в СВО",
    "situationIndex": 1,
    "situationTitle": "Как оформить единовременную выплату при заключении контракта?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Проверить вид контракта, дату его заключения и применимое основание единовременной выплаты.",
    "evidenceToConfirm": "Контракт, приказ о зачислении, реквизиты выплаты.",
    "competentRecipientToVerify": "Военно-финансовый или региональный уполномоченный орган по конкретной выплате; для обжалования проверить порядок.",
    "plannedResultToVerify": "Заявление о назначении единовременной выплаты.",
    "sourceCandidates": [
      {
        "id": "76",
        "title": "ФЗ № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "306",
        "title": "ФЗ № 306-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "647",
        "title": "Указ № 647",
        "url": "https://publication.pravo.gov.ru/Document/View/0001202209210001",
        "type": "OFFICIAL_RECORD_CANDIDATE"
      },
      {
        "id": "52",
        "title": "ФЗ № 52-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "Не подставлять сумму без конкретной программы.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционная индивидуальная карта; оценка юридических оснований и редакции источника ещё не проведена."
  },
  {
    "topicSlug": "vyplaty-za-uchastie-v-svo",
    "topicTitle": "Выплаты за участие в СВО",
    "situationIndex": 2,
    "situationTitle": "Как добиться выплаты за участие в СВО?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Установить фактическое участие и основания конкретной выплаты.",
    "evidenceToConfirm": "Приказы, сведения об участии, платёжные документы.",
    "competentRecipientToVerify": "Военно-финансовый или региональный уполномоченный орган по конкретной выплате; для обжалования проверить порядок.",
    "plannedResultToVerify": "Заявление о выплате за участие в СВО.",
    "sourceCandidates": [
      {
        "id": "76",
        "title": "ФЗ № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "306",
        "title": "ФЗ № 306-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "647",
        "title": "Указ № 647",
        "url": "https://publication.pravo.gov.ru/Document/View/0001202209210001",
        "type": "OFFICIAL_RECORD_CANDIDATE"
      },
      {
        "id": "52",
        "title": "ФЗ № 52-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "Сам факт военной службы не гарантирует любую выплату.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционная индивидуальная карта; оценка юридических оснований и редакции источника ещё не проведена."
  },
  {
    "topicSlug": "vyplaty-za-uchastie-v-svo",
    "topicTitle": "Выплаты за участие в СВО",
    "situationIndex": 3,
    "situationTitle": "Что делать при задержке положенной выплаты?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Определить дату назначения и наступления срока перечисления.",
    "evidenceToConfirm": "Назначение выплаты, выписка счёта, зарегистрированное обращение.",
    "competentRecipientToVerify": "Военно-финансовый или региональный уполномоченный орган по конкретной выплате; для обжалования проверить порядок.",
    "plannedResultToVerify": "Жалоба на задержку выплаты.",
    "sourceCandidates": [
      {
        "id": "76",
        "title": "ФЗ № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "306",
        "title": "ФЗ № 306-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "647",
        "title": "Указ № 647",
        "url": "https://publication.pravo.gov.ru/Document/View/0001202209210001",
        "type": "OFFICIAL_RECORD_CANDIDATE"
      },
      {
        "id": "52",
        "title": "ФЗ № 52-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "Не утверждать просрочку без проверки даты возникновения обязанности.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционная индивидуальная карта; оценка юридических оснований и редакции источника ещё не проведена."
  },
  {
    "topicSlug": "vyplaty-za-uchastie-v-svo",
    "topicTitle": "Выплаты за участие в СВО",
    "situationIndex": 4,
    "situationTitle": "Как обжаловать отказ в назначении выплаты?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Изучить письменный отказ и условия выбранной федеральной или региональной выплаты.",
    "evidenceToConfirm": "Решение об отказе, документы о статусе, основания выплаты.",
    "competentRecipientToVerify": "Военно-финансовый или региональный уполномоченный орган по конкретной выплате; для обжалования проверить порядок.",
    "plannedResultToVerify": "Жалоба на отказ / судебное заявление при наличии оснований.",
    "sourceCandidates": [
      {
        "id": "76",
        "title": "ФЗ № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "306",
        "title": "ФЗ № 306-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "647",
        "title": "Указ № 647",
        "url": "https://publication.pravo.gov.ru/Document/View/0001202209210001",
        "type": "OFFICIAL_RECORD_CANDIDATE"
      },
      {
        "id": "52",
        "title": "ФЗ № 52-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "Не выбирать процессуальную форму без определения плательщика.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционная индивидуальная карта; оценка юридических оснований и редакции источника ещё не проведена."
  },
  {
    "topicSlug": "vyplaty-za-uchastie-v-svo",
    "topicTitle": "Выплаты за участие в СВО",
    "situationIndex": 5,
    "situationTitle": "Как получить региональную выплату при наличии оснований?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Определить регион, дату регистрации и право на конкретную региональную меру.",
    "evidenceToConfirm": "Документы о регионе, контракте и виде службы.",
    "competentRecipientToVerify": "Военно-финансовый или региональный уполномоченный орган по конкретной выплате; для обжалования проверить порядок.",
    "plannedResultToVerify": "Заявление о региональной выплате.",
    "sourceCandidates": [
      {
        "id": "76",
        "title": "ФЗ № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "306",
        "title": "ФЗ № 306-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "647",
        "title": "Указ № 647",
        "url": "https://publication.pravo.gov.ru/Document/View/0001202209210001",
        "type": "OFFICIAL_RECORD_CANDIDATE"
      },
      {
        "id": "52",
        "title": "ФЗ № 52-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "Региональные критерии различаются; не обещать выплату по федеральной норме.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционная индивидуальная карта; оценка юридических оснований и редакции источника ещё не проведена."
  },
  {
    "topicSlug": "vyplaty-za-uchastie-v-svo",
    "topicTitle": "Выплаты за участие в СВО",
    "situationIndex": 6,
    "situationTitle": "Как взыскать назначенную, но не перечисленную выплату?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Разделить назначение выплаты и факт неперечисления денег.",
    "evidenceToConfirm": "Решение о назначении, банковские сведения, запрос финансовому органу.",
    "competentRecipientToVerify": "Военно-финансовый или региональный уполномоченный орган по конкретной выплате; для обжалования проверить порядок.",
    "plannedResultToVerify": "Требование о перечислении назначенной выплаты; судебное обращение по процедуре.",
    "sourceCandidates": [
      {
        "id": "76",
        "title": "ФЗ № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "306",
        "title": "ФЗ № 306-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "647",
        "title": "Указ № 647",
        "url": "https://publication.pravo.gov.ru/Document/View/0001202209210001",
        "type": "OFFICIAL_RECORD_CANDIDATE"
      },
      {
        "id": "52",
        "title": "ФЗ № 52-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "Нельзя автоматически считать долг денежным довольствием.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционная индивидуальная карта; оценка юридических оснований и редакции источника ещё не проведена."
  },
  {
    "topicSlug": "ranenie-travma-gospital",
    "topicTitle": "Ранение, травма и медицинская помощь",
    "situationIndex": 0,
    "situationTitle": "Какие гарантии медицинской помощи предусмотрены военнослужащим?",
    "situationKind": "information",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Определить права на лечение по статусу военнослужащего и действующей медицинской процедуре.",
    "evidenceToConfirm": "Статус, ранение, медицинское состояние.",
    "competentRecipientToVerify": "Командование, военно-медицинская организация либо ВВК в пределах соответствующей компетенции.",
    "plannedResultToVerify": "Информация без генератора.",
    "sourceCandidates": [
      {
        "id": "76",
        "title": "ФЗ № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "565",
        "title": "Постановление № 565",
        "url": "https://mchs.gov.ru/dokumenty/553",
        "type": "GOVERNMENT_REPRINT"
      },
      {
        "id": "52",
        "title": "ФЗ № 52-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "Экстренная помощь не зависит от предварительного заполнения формы.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционная индивидуальная карта; оценка юридических оснований и редакции источника ещё не проведена."
  },
  {
    "topicSlug": "ranenie-travma-gospital",
    "topicTitle": "Ранение, травма и медицинская помощь",
    "situationIndex": 1,
    "situationTitle": "Как получить медицинскую помощь после ранения?",
    "situationKind": "mixed",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Установить необходимость первичной или экстренной помощи после ранения.",
    "evidenceToConfirm": "Медицинские документы, дата ранения, сведения о неотложности.",
    "competentRecipientToVerify": "Командование, военно-медицинская организация либо ВВК в пределах соответствующей компетенции.",
    "plannedResultToVerify": "Рапорт о направлении на лечение, если требуется; при угрозе — экстренные службы.",
    "sourceCandidates": [
      {
        "id": "76",
        "title": "ФЗ № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "565",
        "title": "Постановление № 565",
        "url": "https://mchs.gov.ru/dokumenty/553",
        "type": "GOVERNMENT_REPRINT"
      },
      {
        "id": "52",
        "title": "ФЗ № 52-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "Не задерживать лечение ради документа.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционная индивидуальная карта; оценка юридических оснований и редакции источника ещё не проведена."
  },
  {
    "topicSlug": "ranenie-travma-gospital",
    "topicTitle": "Ранение, травма и медицинская помощь",
    "situationIndex": 2,
    "situationTitle": "Что делать, если командование не направляет на лечение?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Подтвердить медицинские показания и факт отказа направить на лечение.",
    "evidenceToConfirm": "Назначение врача, рапорт, письменный ответ командования.",
    "competentRecipientToVerify": "Командование, военно-медицинская организация либо ВВК в пределах соответствующей компетенции.",
    "plannedResultToVerify": "Рапорт или жалоба о направлении на лечение.",
    "sourceCandidates": [
      {
        "id": "76",
        "title": "ФЗ № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "565",
        "title": "Постановление № 565",
        "url": "https://mchs.gov.ru/dokumenty/553",
        "type": "GOVERNMENT_REPRINT"
      },
      {
        "id": "52",
        "title": "ФЗ № 52-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "Не утверждать нарушение без данных о медицинских показаниях.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционная индивидуальная карта; оценка юридических оснований и редакции источника ещё не проведена."
  },
  {
    "topicSlug": "ranenie-travma-gospital",
    "topicTitle": "Ранение, травма и медицинская помощь",
    "situationIndex": 3,
    "situationTitle": "Как добиться госпитализации военнослужащего?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Проверить медицинские показания для госпитализации и компетенцию направляющего органа.",
    "evidenceToConfirm": "Медицинское заключение, отказ, обращения.",
    "competentRecipientToVerify": "Командование, военно-медицинская организация либо ВВК в пределах соответствующей компетенции.",
    "plannedResultToVerify": "Рапорт о госпитализации по назначению врачей.",
    "sourceCandidates": [
      {
        "id": "76",
        "title": "ФЗ № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "565",
        "title": "Постановление № 565",
        "url": "https://mchs.gov.ru/dokumenty/553",
        "type": "GOVERNMENT_REPRINT"
      },
      {
        "id": "52",
        "title": "ФЗ № 52-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "Сервис не определяет медицинскую необходимость госпитализации.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционная индивидуальная карта; оценка юридических оснований и редакции источника ещё не проведена."
  },
  {
    "topicSlug": "ranenie-travma-gospital",
    "topicTitle": "Ранение, травма и медицинская помощь",
    "situationIndex": 4,
    "situationTitle": "Как оформить документы, подтверждающие военную травму?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Установить факт, время и обстоятельства травмы и орган, оформляющий документы.",
    "evidenceToConfirm": "Медицинская карта, рапорт о событии, материалы расследования.",
    "competentRecipientToVerify": "Командование, военно-медицинская организация либо ВВК в пределах соответствующей компетенции.",
    "plannedResultToVerify": "Заявление о выдаче справки об обстоятельствах травмы.",
    "sourceCandidates": [
      {
        "id": "76",
        "title": "ФЗ № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "565",
        "title": "Постановление № 565",
        "url": "https://mchs.gov.ru/dokumenty/553",
        "type": "GOVERNMENT_REPRINT"
      },
      {
        "id": "52",
        "title": "ФЗ № 52-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "Не формулировать фиктивные обстоятельства получения ранения.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционная индивидуальная карта; оценка юридических оснований и редакции источника ещё не проведена."
  },
  {
    "topicSlug": "ranenie-travma-gospital",
    "topicTitle": "Ранение, травма и медицинская помощь",
    "situationIndex": 5,
    "situationTitle": "Как установить причинную связь заболевания или травмы с прохождением службы?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Разделить фиксацию травмы, причинную связь и медицинскую экспертизу.",
    "evidenceToConfirm": "История болезни, документы службы, результаты обследования.",
    "competentRecipientToVerify": "Командование, военно-медицинская организация либо ВВК в пределах соответствующей компетенции.",
    "plannedResultToVerify": "Рапорт на установление причинной связи через ВВК.",
    "sourceCandidates": [
      {
        "id": "76",
        "title": "ФЗ № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "565",
        "title": "Постановление № 565",
        "url": "https://mchs.gov.ru/dokumenty/553",
        "type": "GOVERNMENT_REPRINT"
      },
      {
        "id": "52",
        "title": "ФЗ № 52-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "Причинную связь устанавливает компетентная комиссия, а не генератор.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционная индивидуальная карта; оценка юридических оснований и редакции источника ещё не проведена."
  },
  {
    "topicSlug": "ranenie-travma-gospital",
    "topicTitle": "Ранение, травма и медицинская помощь",
    "situationIndex": 6,
    "situationTitle": "Как обжаловать отказ в медицинской помощи?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Определить характер отказа и экстренность ситуации.",
    "evidenceToConfirm": "Медицинское назначение, письменный отказ, даты обращения.",
    "competentRecipientToVerify": "Командование, военно-медицинская организация либо ВВК в пределах соответствующей компетенции.",
    "plannedResultToVerify": "Жалоба на отказ в медицинской помощи.",
    "sourceCandidates": [
      {
        "id": "76",
        "title": "ФЗ № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "565",
        "title": "Постановление № 565",
        "url": "https://mchs.gov.ru/dokumenty/553",
        "type": "GOVERNMENT_REPRINT"
      },
      {
        "id": "52",
        "title": "ФЗ № 52-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "При немедленной угрозе здоровью сначала обеспечить помощь.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционная индивидуальная карта; оценка юридических оснований и редакции источника ещё не проведена."
  },
  {
    "topicSlug": "ranenie-travma-gospital",
    "topicTitle": "Ранение, травма и медицинская помощь",
    "situationIndex": 7,
    "situationTitle": "Что делать, если военнослужащего с незавершённым лечением направляют к исполнению обязанностей службы?",
    "situationKind": "mixed",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Проверить противопоказания к служебным обязанностям в период лечения.",
    "evidenceToConfirm": "Медицинские назначения, лист лечения, приказ о возвращении.",
    "competentRecipientToVerify": "Командование, военно-медицинская организация либо ВВК в пределах соответствующей компетенции.",
    "plannedResultToVerify": "Рапорт о продолжении лечения/медицинской оценке.",
    "sourceCandidates": [
      {
        "id": "76",
        "title": "ФЗ № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "565",
        "title": "Постановление № 565",
        "url": "https://mchs.gov.ru/dokumenty/553",
        "type": "GOVERNMENT_REPRINT"
      },
      {
        "id": "52",
        "title": "ФЗ № 52-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "Не формировать общие рекомендации о самовольном неисполнении обязанностей.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционная индивидуальная карта; оценка юридических оснований и редакции источника ещё не проведена."
  },
  {
    "topicSlug": "gibel-i-vyplaty-seme",
    "topicTitle": "Гибель, пропажа без вести и выплаты семье",
    "situationIndex": 0,
    "situationTitle": "Кто из членов семьи может иметь право на выплаты при гибели военнослужащего?",
    "situationKind": "information",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Разделить разные основания выплаты семье, круг получателей и зависимость от статуса.",
    "evidenceToConfirm": "Родство, статус погибшего и официальные документы.",
    "competentRecipientToVerify": "Орган назначения выбранной выплаты, военный комиссариат либо суд по конкретному виду требования.",
    "plannedResultToVerify": "Информация без генератора.",
    "sourceCandidates": [
      {
        "id": "52",
        "title": "ФЗ № 52-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "76",
        "title": "ФЗ № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "5",
        "title": "ФЗ № 5-ФЗ о ветеранах",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "Семейная связь сама по себе не гарантирует конкретную выплату.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционная индивидуальная карта; оценка юридических оснований и редакции источника ещё не проведена."
  },
  {
    "topicSlug": "gibel-i-vyplaty-seme",
    "topicTitle": "Гибель, пропажа без вести и выплаты семье",
    "situationIndex": 1,
    "situationTitle": "Как оформить выплаты семье погибшего военнослужащего?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Подтвердить право конкретного члена семьи на выбранную выплату.",
    "evidenceToConfirm": "Документы о родстве, гибели, назначении и платёжных реквизитах.",
    "competentRecipientToVerify": "Орган назначения выбранной выплаты, военный комиссариат либо суд по конкретному виду требования.",
    "plannedResultToVerify": "Заявление о назначении выплаты члену семьи.",
    "sourceCandidates": [
      {
        "id": "52",
        "title": "ФЗ № 52-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "76",
        "title": "ФЗ № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "5",
        "title": "ФЗ № 5-ФЗ о ветеранах",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "Не обещать всем родственникам одинаковый объём прав.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционная индивидуальная карта; оценка юридических оснований и редакции источника ещё не проведена."
  },
  {
    "topicSlug": "gibel-i-vyplaty-seme",
    "topicTitle": "Гибель, пропажа без вести и выплаты семье",
    "situationIndex": 2,
    "situationTitle": "Что делать, если отказали в выплатах родственникам погибшего?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Уточнить отказ, вид выплаты и право заявителя на получение.",
    "evidenceToConfirm": "Отказ, заявление, документы о статусе родственника.",
    "competentRecipientToVerify": "Орган назначения выбранной выплаты, военный комиссариат либо суд по конкретному виду требования.",
    "plannedResultToVerify": "Жалоба на отказ в выплате.",
    "sourceCandidates": [
      {
        "id": "52",
        "title": "ФЗ № 52-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "76",
        "title": "ФЗ № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "5",
        "title": "ФЗ № 5-ФЗ о ветеранах",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "Неправильный адресат может лишить рассмотрения по существу.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционная индивидуальная карта; оценка юридических оснований и редакции источника ещё не проведена."
  },
  {
    "topicSlug": "gibel-i-vyplaty-seme",
    "topicTitle": "Гибель, пропажа без вести и выплаты семье",
    "situationIndex": 3,
    "situationTitle": "Как получить документы, подтверждающие обстоятельства гибели?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Выяснить орган хранения документов о гибели и законный объём доступа.",
    "evidenceToConfirm": "Документы о родстве, запрос, известные реквизиты происшествия.",
    "competentRecipientToVerify": "Орган назначения выбранной выплаты, военный комиссариат либо суд по конкретному виду требования.",
    "plannedResultToVerify": "Заявление о выдаче подтверждающих документов.",
    "sourceCandidates": [
      {
        "id": "52",
        "title": "ФЗ № 52-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "76",
        "title": "ФЗ № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "5",
        "title": "ФЗ № 5-ФЗ о ветеранах",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "Не требовать закрытые материалы сверх прав заявителя.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционная индивидуальная карта; оценка юридических оснований и редакции источника ещё не проведена."
  },
  {
    "topicSlug": "gibel-i-vyplaty-seme",
    "topicTitle": "Гибель, пропажа без вести и выплаты семье",
    "situationIndex": 4,
    "situationTitle": "Как оформить выплаты при признании военнослужащего безвестно отсутствующим или умершим?",
    "situationKind": "mixed",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Разделить юридические статусы безвестного отсутствия и объявления умершим.",
    "evidenceToConfirm": "Сведения о пропаже, документы службы, акты и решения.",
    "competentRecipientToVerify": "Орган назначения выбранной выплаты, военный комиссариат либо суд по конкретному виду требования.",
    "plannedResultToVerify": "Заявление о соответствующей выплате и, если требуется, обращение в суд.",
    "sourceCandidates": [
      {
        "id": "52",
        "title": "ФЗ № 52-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "76",
        "title": "ФЗ № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "5",
        "title": "ФЗ № 5-ФЗ о ветеранах",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "Не заменять судебный статус произвольной справкой.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционная индивидуальная карта; оценка юридических оснований и редакции источника ещё не проведена."
  },
  {
    "topicSlug": "gibel-i-vyplaty-seme",
    "topicTitle": "Гибель, пропажа без вести и выплаты семье",
    "situationIndex": 5,
    "situationTitle": "Как установить юридический факт, необходимый для оформления выплат?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Установить факт, от которого зависит право, и допустимость особого производства.",
    "evidenceToConfirm": "Документы о событии, невозможность получить официальный документ, письменный отказ.",
    "competentRecipientToVerify": "Орган назначения выбранной выплаты, военный комиссариат либо суд по конкретному виду требования.",
    "plannedResultToVerify": "Заявление об установлении юридического факта в надлежащем суде.",
    "sourceCandidates": [
      {
        "id": "52",
        "title": "ФЗ № 52-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "76",
        "title": "ФЗ № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "5",
        "title": "ФЗ № 5-ФЗ о ветеранах",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "В случае спора о праве особое производство может быть неприменимо.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционная индивидуальная карта; оценка юридических оснований и редакции источника ещё не проведена."
  },
  {
    "topicSlug": "gibel-i-vyplaty-seme",
    "topicTitle": "Гибель, пропажа без вести и выплаты семье",
    "situationIndex": 6,
    "situationTitle": "Как обжаловать отказ в признании права на выплату?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Проверить статус получателя, предмет отказа и процессуальный способ оспаривания.",
    "evidenceToConfirm": "Отказ, расчёты, родственные документы, доказательства подачи.",
    "competentRecipientToVerify": "Орган назначения выбранной выплаты, военный комиссариат либо суд по конкретному виду требования.",
    "plannedResultToVerify": "Жалоба на отказ / судебное заявление по надлежащей процедуре.",
    "sourceCandidates": [
      {
        "id": "52",
        "title": "ФЗ № 52-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "76",
        "title": "ФЗ № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "5",
        "title": "ФЗ № 5-ФЗ о ветеранах",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "Не подменять административный иск гражданским без анализа природы спора.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционная индивидуальная карта; оценка юридических оснований и редакции источника ещё не проведена."
  },
  {
    "topicSlug": "gibel-i-vyplaty-seme",
    "topicTitle": "Гибель, пропажа без вести и выплаты семье",
    "situationIndex": 7,
    "situationTitle": "Как защитить права детей и других членов семьи погибшего военнослужащего?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Определить законное представительство ребёнка и самостоятельные права членов семьи.",
    "evidenceToConfirm": "Свидетельства о рождении, опеке, документация о выплатах.",
    "competentRecipientToVerify": "Орган назначения выбранной выплаты, военный комиссариат либо суд по конкретному виду требования.",
    "plannedResultToVerify": "Заявление в интересах ребёнка или иной предусмотренный документ.",
    "sourceCandidates": [
      {
        "id": "52",
        "title": "ФЗ № 52-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "76",
        "title": "ФЗ № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "5",
        "title": "ФЗ № 5-ФЗ о ветеранах",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "Не раскрывать детские данные в публичном интерфейсе.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционная индивидуальная карта; оценка юридических оснований и редакции источника ещё не проведена."
  },
  {
    "topicSlug": "disciplinarnye-vzyskaniya",
    "topicTitle": "Дисциплинарные взыскания",
    "situationIndex": 0,
    "situationTitle": "Какие дисциплинарные взыскания предусмотрены для военнослужащих?",
    "situationKind": "information",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Сверить допустимые дисциплинарные меры и служебный статус.",
    "evidenceToConfirm": "Приказы, категория военнослужащего.",
    "competentRecipientToVerify": "Командование, вышестоящий руководитель либо компетентный суд по виду дисциплинарного спора.",
    "plannedResultToVerify": "Информация без генератора.",
    "sourceCandidates": [
      {
        "id": "76",
        "title": "ФЗ № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "1237",
        "title": "Указ № 1237",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "kas",
        "title": "КАС РФ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "Не переносить меры дисциплинарной ответственности из трудового права.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционная индивидуальная карта; оценка юридических оснований и редакции источника ещё не проведена."
  },
  {
    "topicSlug": "disciplinarnye-vzyskaniya",
    "topicTitle": "Дисциплинарные взыскания",
    "situationIndex": 1,
    "situationTitle": "Как обжаловать дисциплинарное взыскание?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Проверить основания взыскания, процедуру разбирательства и сроки.",
    "evidenceToConfirm": "Приказ, объяснения, материалы служебного расследования.",
    "competentRecipientToVerify": "Командование, вышестоящий руководитель либо компетентный суд по виду дисциплинарного спора.",
    "plannedResultToVerify": "Жалоба на дисциплинарное взыскание.",
    "sourceCandidates": [
      {
        "id": "76",
        "title": "ФЗ № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "1237",
        "title": "Указ № 1237",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "kas",
        "title": "КАС РФ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "Не считать любое взыскание незаконным без проверки обстоятельств.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционная индивидуальная карта; оценка юридических оснований и редакции источника ещё не проведена."
  },
  {
    "topicSlug": "disciplinarnye-vzyskaniya",
    "topicTitle": "Дисциплинарные взыскания",
    "situationIndex": 2,
    "situationTitle": "Что делать при незаконном привлечении к дисциплинарной ответственности?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Определить нарушение порядка привлечения к дисциплинарной ответственности.",
    "evidenceToConfirm": "Приказ, уведомления, служебные объяснения.",
    "competentRecipientToVerify": "Командование, вышестоящий руководитель либо компетентный суд по виду дисциплинарного спора.",
    "plannedResultToVerify": "Жалоба на незаконное привлечение.",
    "sourceCandidates": [
      {
        "id": "76",
        "title": "ФЗ № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "1237",
        "title": "Указ № 1237",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "kas",
        "title": "КАС РФ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "Не подменять дисциплинарную процедуру уголовной.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционная индивидуальная карта; оценка юридических оснований и редакции источника ещё не проведена."
  },
  {
    "topicSlug": "disciplinarnye-vzyskaniya",
    "topicTitle": "Дисциплинарные взыскания",
    "situationIndex": 3,
    "situationTitle": "Как получить материалы разбирательства?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Уточнить доступ военнослужащего к материалам дисциплинарного разбирательства.",
    "evidenceToConfirm": "Реквизиты разбирательства, отказ в ознакомлении.",
    "competentRecipientToVerify": "Командование, вышестоящий руководитель либо компетентный суд по виду дисциплинарного спора.",
    "plannedResultToVerify": "Рапорт о предоставлении доступа к материалам.",
    "sourceCandidates": [
      {
        "id": "76",
        "title": "ФЗ № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "1237",
        "title": "Указ № 1237",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "kas",
        "title": "КАС РФ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "Закон может ограничивать доступ к отдельным сведениям.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционная индивидуальная карта; оценка юридических оснований и редакции источника ещё не проведена."
  },
  {
    "topicSlug": "disciplinarnye-vzyskaniya",
    "topicTitle": "Дисциплинарные взыскания",
    "situationIndex": 4,
    "situationTitle": "Как подать жалобу на нарушение порядка применения взыскания?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Сопоставить фактическую процедуру взыскания с действующими нормами.",
    "evidenceToConfirm": "Акты расследования, даты, объяснения и приказ.",
    "competentRecipientToVerify": "Командование, вышестоящий руководитель либо компетентный суд по виду дисциплинарного спора.",
    "plannedResultToVerify": "Жалоба о нарушении процедуры.",
    "sourceCandidates": [
      {
        "id": "76",
        "title": "ФЗ № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "1237",
        "title": "Указ № 1237",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "kas",
        "title": "КАС РФ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "Общий текст жалобы без конкретного нарушения не подходит.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционная индивидуальная карта; оценка юридических оснований и редакции источника ещё не проведена."
  },
  {
    "topicSlug": "disciplinarnye-vzyskaniya",
    "topicTitle": "Дисциплинарные взыскания",
    "situationIndex": 5,
    "situationTitle": "Как добиться отмены незаконного дисциплинарного приказа?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Установить законный способ отмены дисциплинарного приказа.",
    "evidenceToConfirm": "Приказ, доказательства существенных процессуальных нарушений.",
    "competentRecipientToVerify": "Командование, вышестоящий руководитель либо компетентный суд по виду дисциплинарного спора.",
    "plannedResultToVerify": "Жалоба на приказ / судебное оспаривание.",
    "sourceCandidates": [
      {
        "id": "76",
        "title": "ФЗ № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "1237",
        "title": "Указ № 1237",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "kas",
        "title": "КАС РФ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "Судебная компетенция определяется статусом и видом требования.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционная индивидуальная карта; оценка юридических оснований и редакции источника ещё не проведена."
  },
  {
    "topicSlug": "samovolnoe-ostavlenie-chasti",
    "topicTitle": "Самовольное оставление части и уголовно-правовая защита",
    "situationIndex": 0,
    "situationTitle": "Чем различаются дисциплинарные и уголовно-правовые последствия отсутствия на службе?",
    "situationKind": "information",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Различить состав дисциплинарного нарушения и уголовно-правовые составы.",
    "evidenceToConfirm": "Даты отсутствия, статус службы, сведения о причинах.",
    "competentRecipientToVerify": "Дознаватель, следователь, прокурор или суд в зависимости от стадии и процессуального статуса.",
    "plannedResultToVerify": "Информация без генератора.",
    "sourceCandidates": [
      {
        "id": "uk",
        "title": "УК РФ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "upk",
        "title": "УПК РФ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "76",
        "title": "ФЗ № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "Не давать инструкций по уклонению от служебных обязанностей.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционная индивидуальная карта; оценка юридических оснований и редакции источника ещё не проведена."
  },
  {
    "topicSlug": "samovolnoe-ostavlenie-chasti",
    "topicTitle": "Самовольное оставление части и уголовно-правовая защита",
    "situationIndex": 1,
    "situationTitle": "Как оспорить необоснованное обвинение в самовольном оставлении части?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Установить процессуальный статус лица и доказательства ошибочности обвинения.",
    "evidenceToConfirm": "Постановление по делу, материалы защиты, объективные данные.",
    "competentRecipientToVerify": "Дознаватель, следователь, прокурор или суд в зависимости от стадии и процессуального статуса.",
    "plannedResultToVerify": "Процессуальное ходатайство/жалоба через защитника.",
    "sourceCandidates": [
      {
        "id": "uk",
        "title": "УК РФ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "upk",
        "title": "УПК РФ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "76",
        "title": "ФЗ № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "Правильная защитительная позиция требует изучения дела.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционная индивидуальная карта; оценка юридических оснований и редакции источника ещё не проведена."
  },
  {
    "topicSlug": "samovolnoe-ostavlenie-chasti",
    "topicTitle": "Самовольное оставление части и уголовно-правовая защита",
    "situationIndex": 2,
    "situationTitle": "Как заявить об уважительных причинах отсутствия на службе?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Выделить документально подтверждённые объективные причины отсутствия.",
    "evidenceToConfirm": "Медицинские справки, приказы, сообщения и объяснения.",
    "competentRecipientToVerify": "Дознаватель, следователь, прокурор или суд в зависимости от стадии и процессуального статуса.",
    "plannedResultToVerify": "Заявление и ходатайство о приобщении доказательств.",
    "sourceCandidates": [
      {
        "id": "uk",
        "title": "УК РФ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "upk",
        "title": "УПК РФ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "76",
        "title": "ФЗ № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "Не предлагать придумывать уважительные причины.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционная индивидуальная карта; оценка юридических оснований и редакции источника ещё не проведена."
  },
  {
    "topicSlug": "samovolnoe-ostavlenie-chasti",
    "topicTitle": "Самовольное оставление части и уголовно-правовая защита",
    "situationIndex": 3,
    "situationTitle": "Как обжаловать незаконные действия при расследовании?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Установить статус и конкретное действие следователя для оспаривания.",
    "evidenceToConfirm": "Постановление, протокол, дата и процессуальный статус.",
    "competentRecipientToVerify": "Дознаватель, следователь, прокурор или суд в зависимости от стадии и процессуального статуса.",
    "plannedResultToVerify": "Процессуальная жалоба в предусмотренном УПК порядке.",
    "sourceCandidates": [
      {
        "id": "uk",
        "title": "УК РФ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "upk",
        "title": "УПК РФ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "76",
        "title": "ФЗ № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "Не использовать КАС РФ вместо уголовно-процессуальной жалобы.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционная индивидуальная карта; оценка юридических оснований и редакции источника ещё не проведена."
  },
  {
    "topicSlug": "samovolnoe-ostavlenie-chasti",
    "topicTitle": "Самовольное оставление части и уголовно-правовая защита",
    "situationIndex": 4,
    "situationTitle": "Как подать ходатайство или жалобу в рамках уголовного дела?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Определить стадию уголовного дела и право участника заявить ходатайство.",
    "evidenceToConfirm": "Номер уголовного дела, процессуальный документ, полномочия представителя.",
    "competentRecipientToVerify": "Дознаватель, следователь, прокурор или суд в зависимости от стадии и процессуального статуса.",
    "plannedResultToVerify": "Ходатайство или жалоба по УПК РФ.",
    "sourceCandidates": [
      {
        "id": "uk",
        "title": "УК РФ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "upk",
        "title": "УПК РФ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "76",
        "title": "ФЗ № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "Не генерировать документ без процессуального статуса лица.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционная индивидуальная карта; оценка юридических оснований и редакции источника ещё не проведена."
  },
  {
    "topicSlug": "voennaya-ipoteka-i-zhile",
    "topicTitle": "Военная ипотека и жилищное обеспечение",
    "situationIndex": 0,
    "situationTitle": "Какие существуют способы жилищного обеспечения военнослужащих?",
    "situationKind": "information",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Разделить НИС, служебное жильё, жилищную субсидию и иные гарантии.",
    "evidenceToConfirm": "Вид службы, выслуга, сведения о жилищном статусе.",
    "competentRecipientToVerify": "Уполномоченный орган жилищного обеспечения / НИС и командование; суд после определения компетенции.",
    "plannedResultToVerify": "Информация без генератора.",
    "sourceCandidates": [
      {
        "id": "117",
        "title": "ФЗ № 117-ФЗ о накопительно-ипотечной системе",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "76",
        "title": "ФЗ № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "housing",
        "title": "ЖК РФ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "Не обещать одинаковую жилищную гарантию всем категориям службы.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный план; официальный источник, редакция, применимость и процессуальные сроки требуют отдельной проверки."
  },
  {
    "topicSlug": "voennaya-ipoteka-i-zhile",
    "topicTitle": "Военная ипотека и жилищное обеспечение",
    "situationIndex": 1,
    "situationTitle": "Как вступить в накопительно-ипотечную систему?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Установить основание участия в НИС и порядок включения в реестр.",
    "evidenceToConfirm": "Контракт, сведения о звании, должности и дате начала службы.",
    "competentRecipientToVerify": "Уполномоченный орган жилищного обеспечения / НИС и командование; суд после определения компетенции.",
    "plannedResultToVerify": "Рапорт о включении в реестр НИС при применимости.",
    "sourceCandidates": [
      {
        "id": "117",
        "title": "ФЗ № 117-ФЗ о накопительно-ипотечной системе",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "76",
        "title": "ФЗ № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "housing",
        "title": "ЖК РФ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "Для части категорий включение происходит не по произвольному заявлению.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный план; официальный источник, редакция, применимость и процессуальные сроки требуют отдельной проверки."
  },
  {
    "topicSlug": "voennaya-ipoteka-i-zhile",
    "topicTitle": "Военная ипотека и жилищное обеспечение",
    "situationIndex": 2,
    "situationTitle": "Что делать, если отказали во включении в реестр НИС?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Определить отказ, категорию участника и нормативное основание включения.",
    "evidenceToConfirm": "Письменный отказ, контракт, служебные документы.",
    "competentRecipientToVerify": "Уполномоченный орган жилищного обеспечения / НИС и командование; суд после определения компетенции.",
    "plannedResultToVerify": "Жалоба на отказ во включении в НИС.",
    "sourceCandidates": [
      {
        "id": "117",
        "title": "ФЗ № 117-ФЗ о накопительно-ипотечной системе",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "76",
        "title": "ФЗ № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "housing",
        "title": "ЖК РФ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "Не путать дату включения в реестр с правом использования накоплений.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный план; официальный источник, редакция, применимость и процессуальные сроки требуют отдельной проверки."
  },
  {
    "topicSlug": "voennaya-ipoteka-i-zhile",
    "topicTitle": "Военная ипотека и жилищное обеспечение",
    "situationIndex": 3,
    "situationTitle": "Как обжаловать нарушение порядка начисления накоплений?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Проверить правильность учёта накоплений, индивидуальный счёт и периоды.",
    "evidenceToConfirm": "Выписка из именного счёта, документы службы, расчёт.",
    "competentRecipientToVerify": "Уполномоченный орган жилищного обеспечения / НИС и командование; суд после определения компетенции.",
    "plannedResultToVerify": "Заявление о проверке начисления накоплений.",
    "sourceCandidates": [
      {
        "id": "117",
        "title": "ФЗ № 117-ФЗ о накопительно-ипотечной системе",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "76",
        "title": "ФЗ № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "housing",
        "title": "ЖК РФ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "Размер накоплений не вычислять без официальных данных.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный план; официальный источник, редакция, применимость и процессуальные сроки требуют отдельной проверки."
  },
  {
    "topicSlug": "voennaya-ipoteka-i-zhile",
    "topicTitle": "Военная ипотека и жилищное обеспечение",
    "situationIndex": 4,
    "situationTitle": "Как защитить жилищные права при увольнении со службы?",
    "situationKind": "mixed",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Определить последствия увольнения для НИС, займа и иных гарантий.",
    "evidenceToConfirm": "Основание увольнения, договор целевого жилищного займа, сведения об учёте.",
    "competentRecipientToVerify": "Уполномоченный орган жилищного обеспечения / НИС и командование; суд после определения компетенции.",
    "plannedResultToVerify": "Заявление о реализации жилищного права или возражение по требованию возврата.",
    "sourceCandidates": [
      {
        "id": "117",
        "title": "ФЗ № 117-ФЗ о накопительно-ипотечной системе",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "76",
        "title": "ФЗ № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "housing",
        "title": "ЖК РФ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "Не считать увольнение автоматическим освобождением от обязательств.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный план; официальный источник, редакция, применимость и процессуальные сроки требуют отдельной проверки."
  },
  {
    "topicSlug": "voennaya-ipoteka-i-zhile",
    "topicTitle": "Военная ипотека и жилищное обеспечение",
    "situationIndex": 5,
    "situationTitle": "Как обжаловать отказ в предоставлении жилья или жилищной субсидии?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Установить правовой режим обеспечения жильём и причину отказа.",
    "evidenceToConfirm": "Жилищное дело, письменный отказ, сведения о членах семьи.",
    "competentRecipientToVerify": "Уполномоченный орган жилищного обеспечения / НИС и командование; суд после определения компетенции.",
    "plannedResultToVerify": "Жалоба на отказ / иск по соответствующей процедуре.",
    "sourceCandidates": [
      {
        "id": "117",
        "title": "ФЗ № 117-ФЗ о накопительно-ипотечной системе",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "76",
        "title": "ФЗ № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "housing",
        "title": "ЖК РФ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "Не объединять споры о НИС и жилищной субсидии в один универсальный иск.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный план; официальный источник, редакция, применимость и процессуальные сроки требуют отдельной проверки."
  },
  {
    "topicSlug": "voinskiy-uchet-i-dokumenty",
    "topicTitle": "Воинский учёт и военные документы",
    "situationIndex": 0,
    "situationTitle": "Кто обязан состоять на воинском учёте?",
    "situationKind": "information",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Разграничить случаи обязательного воинского учёта и исключения.",
    "evidenceToConfirm": "Гражданство, возраст, статус воинской обязанности, место проживания.",
    "competentRecipientToVerify": "Военный комиссариат или орган госуслуги по предмету обращения; судебный орган при надлежащем споре.",
    "plannedResultToVerify": "Информация без генератора.",
    "sourceCandidates": [
      {
        "id": "53",
        "title": "ФЗ № 53-ФЗ",
        "url": "https://rosguard.gov.ru/document/article/federalnyj-zakon-ot-28-marta-1998-g--53fz",
        "type": "GOVERNMENT_REPRINT_STALE_NOT_CURRENT"
      }
    ],
    "criticalLimitations": "Не путать воинский учёт с немедленной обязанностью служить.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный план; официальный источник, редакция, применимость и процессуальные сроки требуют отдельной проверки."
  },
  {
    "topicSlug": "voinskiy-uchet-i-dokumenty",
    "topicTitle": "Воинский учёт и военные документы",
    "situationIndex": 1,
    "situationTitle": "Как встать на воинский учёт?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Проверить обязанность и процесс постановки на воинский учёт.",
    "evidenceToConfirm": "Документ о регистрации, воинские документы, данные заявителя.",
    "competentRecipientToVerify": "Военный комиссариат или орган госуслуги по предмету обращения; судебный орган при надлежащем споре.",
    "plannedResultToVerify": "Заявление о постановке на воинский учёт при необходимой процедуре.",
    "sourceCandidates": [
      {
        "id": "53",
        "title": "ФЗ № 53-ФЗ",
        "url": "https://rosguard.gov.ru/document/article/federalnyj-zakon-ot-28-marta-1998-g--53fz",
        "type": "GOVERNMENT_REPRINT_STALE_NOT_CURRENT"
      }
    ],
    "criticalLimitations": "Не утверждать обязательность личной явки для каждой ситуации.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный план; официальный источник, редакция, применимость и процессуальные сроки требуют отдельной проверки."
  },
  {
    "topicSlug": "voinskiy-uchet-i-dokumenty",
    "topicTitle": "Воинский учёт и военные документы",
    "situationIndex": 2,
    "situationTitle": "Как сняться с воинского учёта при наличии законных оснований?",
    "situationKind": "mixed",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Уточнить основание снятия с учёта и соответствующий орган.",
    "evidenceToConfirm": "Документы о статусе, месте проживания или освобождении.",
    "competentRecipientToVerify": "Военный комиссариат или орган госуслуги по предмету обращения; судебный орган при надлежащем споре.",
    "plannedResultToVerify": "Заявление о снятии с воинского учёта при законном основании.",
    "sourceCandidates": [
      {
        "id": "53",
        "title": "ФЗ № 53-ФЗ",
        "url": "https://rosguard.gov.ru/document/article/federalnyj-zakon-ot-28-marta-1998-g--53fz",
        "type": "GOVERNMENT_REPRINT_STALE_NOT_CURRENT"
      }
    ],
    "criticalLimitations": "Выезд сам по себе не всегда автоматически прекращает обязанности.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный план; официальный источник, редакция, применимость и процессуальные сроки требуют отдельной проверки."
  },
  {
    "topicSlug": "voinskiy-uchet-i-dokumenty",
    "topicTitle": "Воинский учёт и военные документы",
    "situationIndex": 3,
    "situationTitle": "Как оформить воинский учёт при проживании за границей?",
    "situationKind": "mixed",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Проверить режим учёта при проживании за рубежом и сроки уведомления.",
    "evidenceToConfirm": "Сведения о месте жительства, датах выезда и воинском статусе.",
    "competentRecipientToVerify": "Военный комиссариат или орган госуслуги по предмету обращения; судебный орган при надлежащем споре.",
    "plannedResultToVerify": "Уведомление или заявление по конкретной процедуре.",
    "sourceCandidates": [
      {
        "id": "53",
        "title": "ФЗ № 53-ФЗ",
        "url": "https://rosguard.gov.ru/document/article/federalnyj-zakon-ot-28-marta-1998-g--53fz",
        "type": "GOVERNMENT_REPRINT_STALE_NOT_CURRENT"
      }
    ],
    "criticalLimitations": "Не считать иностранное проживание универсальным освобождением.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный план; официальный источник, редакция, применимость и процессуальные сроки требуют отдельной проверки."
  },
  {
    "topicSlug": "voinskiy-uchet-i-dokumenty",
    "topicTitle": "Воинский учёт и военные документы",
    "situationIndex": 4,
    "situationTitle": "Как восстановить утерянный военный билет?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Установить факт утраты, действующий порядок выдачи взамен и полномочия органа.",
    "evidenceToConfirm": "Документ личности, сведения воинского учёта, обстоятельства утраты.",
    "competentRecipientToVerify": "Военный комиссариат или орган госуслуги по предмету обращения; судебный орган при надлежащем споре.",
    "plannedResultToVerify": "Заявление о выдаче военного билета взамен утраченного.",
    "sourceCandidates": [
      {
        "id": "53",
        "title": "ФЗ № 53-ФЗ",
        "url": "https://rosguard.gov.ru/document/article/federalnyj-zakon-ot-28-marta-1998-g--53fz",
        "type": "GOVERNMENT_REPRINT_STALE_NOT_CURRENT"
      }
    ],
    "criticalLimitations": "Не обещать освобождение от обязанностей из-за отсутствия билета.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный план; официальный источник, редакция, применимость и процессуальные сроки требуют отдельной проверки."
  },
  {
    "topicSlug": "voinskiy-uchet-i-dokumenty",
    "topicTitle": "Воинский учёт и военные документы",
    "situationIndex": 5,
    "situationTitle": "Что делать при отказе в выдаче военного билета?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Проверить форму и мотивы отказа выдать документ воинского учёта.",
    "evidenceToConfirm": "Письменный отказ, предыдущее заявление, документы о статусе.",
    "competentRecipientToVerify": "Военный комиссариат или орган госуслуги по предмету обращения; судебный орган при надлежащем споре.",
    "plannedResultToVerify": "Жалоба на отказ в выдаче военного билета.",
    "sourceCandidates": [
      {
        "id": "53",
        "title": "ФЗ № 53-ФЗ",
        "url": "https://rosguard.gov.ru/document/article/federalnyj-zakon-ot-28-marta-1998-g--53fz",
        "type": "GOVERNMENT_REPRINT_STALE_NOT_CURRENT"
      }
    ],
    "criticalLimitations": "Не считать право на конкретный документ независимым от учётного статуса.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный план; официальный источник, редакция, применимость и процессуальные сроки требуют отдельной проверки."
  },
  {
    "topicSlug": "voinskiy-uchet-i-dokumenty",
    "topicTitle": "Воинский учёт и военные документы",
    "situationIndex": 6,
    "situationTitle": "Как обжаловать отказ в оформлении гражданского паспорта из-за отсутствия военного билета?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Разграничить паспортную процедуру и требования воинского учёта.",
    "evidenceToConfirm": "Отказ в госуслуге, заявление о выдаче паспорта, документы личности.",
    "competentRecipientToVerify": "Военный комиссариат или орган госуслуги по предмету обращения; судебный орган при надлежащем споре.",
    "plannedResultToVerify": "Жалоба на отказ в паспортной услуге / судебное оспаривание.",
    "sourceCandidates": [
      {
        "id": "53",
        "title": "ФЗ № 53-ФЗ",
        "url": "https://rosguard.gov.ru/document/article/federalnyj-zakon-ot-28-marta-1998-g--53fz",
        "type": "GOVERNMENT_REPRINT_STALE_NOT_CURRENT"
      }
    ],
    "criticalLimitations": "Не переносить правила выдачи военного билета на паспортную процедуру.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный план; официальный источник, редакция, применимость и процессуальные сроки требуют отдельной проверки."
  },
  {
    "topicSlug": "alternativnaya-grazhdanskaya-sluzhba",
    "topicTitle": "Альтернативная гражданская служба",
    "situationIndex": 0,
    "situationTitle": "Кому и при каких условиях может быть доступна альтернативная гражданская служба?",
    "situationKind": "information",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Проверить конституционные и законные основания замены военной службы альтернативной.",
    "evidenceToConfirm": "Сведения о убеждениях, статусе призыва и сроках подачи.",
    "competentRecipientToVerify": "Призывная комиссия и соответствующий военный комиссариат; вышестоящий орган или суд по процедуре.",
    "plannedResultToVerify": "Информация без генератора.",
    "sourceCandidates": [
      {
        "id": "113",
        "title": "ФЗ № 113-ФЗ об альтернативной гражданской службе",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "53",
        "title": "ФЗ № 53-ФЗ",
        "url": "https://rosguard.gov.ru/document/article/federalnyj-zakon-ot-28-marta-1998-g--53fz",
        "type": "GOVERNMENT_REPRINT_STALE_NOT_CURRENT"
      },
      {
        "id": "412-2025",
        "title": "ФЗ № 412-ФЗ (2025)",
        "url": "https://publication.pravo.gov.ru/document/0001202511040014",
        "type": "OFFICIAL_RECORD_CANDIDATE_UNCONFIRMED"
      }
    ],
    "criticalLimitations": "Нельзя гарантировать замену службы без соблюдения условий.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный план; официальный источник, редакция, применимость и процессуальные сроки требуют отдельной проверки."
  },
  {
    "topicSlug": "alternativnaya-grazhdanskaya-sluzhba",
    "topicTitle": "Альтернативная гражданская служба",
    "situationIndex": 1,
    "situationTitle": "Как подать заявление о замене военной службы альтернативной гражданской?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Проверить статус и сроки обращения о замене по 113-ФЗ и изменённой процедуре.",
    "evidenceToConfirm": "Заявление, сведения об убеждениях, документы о призывном статусе.",
    "competentRecipientToVerify": "Призывная комиссия и соответствующий военный комиссариат; вышестоящий орган или суд по процедуре.",
    "plannedResultToVerify": "Заявление о замене военной службы альтернативной гражданской.",
    "sourceCandidates": [
      {
        "id": "113",
        "title": "ФЗ № 113-ФЗ об альтернативной гражданской службе",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "53",
        "title": "ФЗ № 53-ФЗ",
        "url": "https://rosguard.gov.ru/document/article/federalnyj-zakon-ot-28-marta-1998-g--53fz",
        "type": "GOVERNMENT_REPRINT_STALE_NOT_CURRENT"
      },
      {
        "id": "412-2025",
        "title": "ФЗ № 412-ФЗ (2025)",
        "url": "https://publication.pravo.gov.ru/document/0001202511040014",
        "type": "OFFICIAL_RECORD_CANDIDATE_UNCONFIRMED"
      }
    ],
    "criticalLimitations": "Требования к сроку и форме особенно важны при изменениях 2026 года.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный план; официальный источник, редакция, применимость и процессуальные сроки требуют отдельной проверки."
  },
  {
    "topicSlug": "alternativnaya-grazhdanskaya-sluzhba",
    "topicTitle": "Альтернативная гражданская служба",
    "situationIndex": 2,
    "situationTitle": "Как обжаловать отказ в замене военной службы?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Определить причины отказа и порядок его обжалования.",
    "evidenceToConfirm": "Решение комиссии, копия заявления, подтверждения.",
    "competentRecipientToVerify": "Призывная комиссия и соответствующий военный комиссариат; вышестоящий орган или суд по процедуре.",
    "plannedResultToVerify": "Жалоба на отказ / административный иск при законном основании.",
    "sourceCandidates": [
      {
        "id": "113",
        "title": "ФЗ № 113-ФЗ об альтернативной гражданской службе",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "53",
        "title": "ФЗ № 53-ФЗ",
        "url": "https://rosguard.gov.ru/document/article/federalnyj-zakon-ot-28-marta-1998-g--53fz",
        "type": "GOVERNMENT_REPRINT_STALE_NOT_CURRENT"
      },
      {
        "id": "412-2025",
        "title": "ФЗ № 412-ФЗ (2025)",
        "url": "https://publication.pravo.gov.ru/document/0001202511040014",
        "type": "OFFICIAL_RECORD_CANDIDATE_UNCONFIRMED"
      }
    ],
    "criticalLimitations": "Не утверждать автоматическое приостановление исполнения.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный план; официальный источник, редакция, применимость и процессуальные сроки требуют отдельной проверки."
  },
  {
    "topicSlug": "alternativnaya-grazhdanskaya-sluzhba",
    "topicTitle": "Альтернативная гражданская служба",
    "situationIndex": 3,
    "situationTitle": "Как оспорить нарушение процедуры рассмотрения заявления?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Выявить нарушения порядка слушания и оценки заявления об АГС.",
    "evidenceToConfirm": "Заявление, повестка, протокол заседания, ответ.",
    "competentRecipientToVerify": "Призывная комиссия и соответствующий военный комиссариат; вышестоящий орган или суд по процедуре.",
    "plannedResultToVerify": "Жалоба на нарушение процедуры рассмотрения.",
    "sourceCandidates": [
      {
        "id": "113",
        "title": "ФЗ № 113-ФЗ об альтернативной гражданской службе",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "53",
        "title": "ФЗ № 53-ФЗ",
        "url": "https://rosguard.gov.ru/document/article/federalnyj-zakon-ot-28-marta-1998-g--53fz",
        "type": "GOVERNMENT_REPRINT_STALE_NOT_CURRENT"
      },
      {
        "id": "412-2025",
        "title": "ФЗ № 412-ФЗ (2025)",
        "url": "https://publication.pravo.gov.ru/document/0001202511040014",
        "type": "OFFICIAL_RECORD_CANDIDATE_UNCONFIRMED"
      }
    ],
    "criticalLimitations": "Общие формулировки об убеждениях не заменяют фактическое обоснование.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный план; официальный источник, редакция, применимость и процессуальные сроки требуют отдельной проверки."
  },
  {
    "topicSlug": "alternativnaya-grazhdanskaya-sluzhba",
    "topicTitle": "Альтернативная гражданская служба",
    "situationIndex": 4,
    "situationTitle": "Как добиться пересмотра решения об отказе?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Определить основание пересмотра и полномочия соответствующей комиссии.",
    "evidenceToConfirm": "Отказ, новое доказательство, процессуальные даты.",
    "competentRecipientToVerify": "Призывная комиссия и соответствующий военный комиссариат; вышестоящий орган или суд по процедуре.",
    "plannedResultToVerify": "Жалоба или заявление о пересмотре решения об АГС.",
    "sourceCandidates": [
      {
        "id": "113",
        "title": "ФЗ № 113-ФЗ об альтернативной гражданской службе",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "53",
        "title": "ФЗ № 53-ФЗ",
        "url": "https://rosguard.gov.ru/document/article/federalnyj-zakon-ot-28-marta-1998-g--53fz",
        "type": "GOVERNMENT_REPRINT_STALE_NOT_CURRENT"
      },
      {
        "id": "412-2025",
        "title": "ФЗ № 412-ФЗ (2025)",
        "url": "https://publication.pravo.gov.ru/document/0001202511040014",
        "type": "OFFICIAL_RECORD_CANDIDATE_UNCONFIRMED"
      }
    ],
    "criticalLimitations": "Не выдавать повторное заявление за гарантированный пересмотр.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный план; официальный источник, редакция, применимость и процессуальные сроки требуют отдельной проверки."
  },
  {
    "topicSlug": "veterany-pensii-i-lgoty",
    "topicTitle": "Статус ветерана, пенсии и социальные гарантии",
    "situationIndex": 0,
    "situationTitle": "Какие меры социальной поддержки предусмотрены для ветеранов боевых действий?",
    "situationKind": "information",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Уточнить точный круг федеральных и региональных гарантий ветеранам.",
    "evidenceToConfirm": "Документы о статусе и регионе, подтверждение участия.",
    "competentRecipientToVerify": "Ведомственный орган определения статуса, назначения пенсии или соцподдержки по конкретной мере.",
    "plannedResultToVerify": "Информация без генератора.",
    "sourceCandidates": [
      {
        "id": "5",
        "title": "ФЗ № 5-ФЗ о ветеранах",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "4468",
        "title": "Закон РФ № 4468-1 о военных пенсиях",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "76",
        "title": "ФЗ № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "Не все меры поддержки возникают автоматически.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный план; официальный источник, редакция, применимость и процессуальные сроки требуют отдельной проверки."
  },
  {
    "topicSlug": "veterany-pensii-i-lgoty",
    "topicTitle": "Статус ветерана, пенсии и социальные гарантии",
    "situationIndex": 1,
    "situationTitle": "Как получить удостоверение ветерана боевых действий?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Определить документально подтверждённое основание статуса и ведомственный порядок выдачи.",
    "evidenceToConfirm": "Служебные приказы, сведения об участии, документы личности.",
    "competentRecipientToVerify": "Ведомственный орган определения статуса, назначения пенсии или соцподдержки по конкретной мере.",
    "plannedResultToVerify": "Заявление о выдаче удостоверения ветерана боевых действий.",
    "sourceCandidates": [
      {
        "id": "5",
        "title": "ФЗ № 5-ФЗ о ветеранах",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "4468",
        "title": "Закон РФ № 4468-1 о военных пенсиях",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "76",
        "title": "ФЗ № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "Не присваивать статус только из пользовательского описания.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный план; официальный источник, редакция, применимость и процессуальные сроки требуют отдельной проверки."
  },
  {
    "topicSlug": "veterany-pensii-i-lgoty",
    "topicTitle": "Статус ветерана, пенсии и социальные гарантии",
    "situationIndex": 2,
    "situationTitle": "Что делать при отказе в признании статуса ветерана?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Проверить конкретный отказ в признании статуса и компетенцию органа.",
    "evidenceToConfirm": "Письменный отказ, сведения о службе и участии.",
    "competentRecipientToVerify": "Ведомственный орган определения статуса, назначения пенсии или соцподдержки по конкретной мере.",
    "plannedResultToVerify": "Жалоба на отказ в признании статуса ветерана.",
    "sourceCandidates": [
      {
        "id": "5",
        "title": "ФЗ № 5-ФЗ о ветеранах",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "4468",
        "title": "Закон РФ № 4468-1 о военных пенсиях",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "76",
        "title": "ФЗ № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "Требуется разграничить статус ветерана и участника СВО.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный план; официальный источник, редакция, применимость и процессуальные сроки требуют отдельной проверки."
  },
  {
    "topicSlug": "veterany-pensii-i-lgoty",
    "topicTitle": "Статус ветерана, пенсии и социальные гарантии",
    "situationIndex": 3,
    "situationTitle": "Как оформить военную пенсию?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Установить вид пенсионного обеспечения, выслугу, основание и получателя.",
    "evidenceToConfirm": "Документы о стаже, службе, увольнении и инвалидности.",
    "competentRecipientToVerify": "Ведомственный орган определения статуса, назначения пенсии или соцподдержки по конкретной мере.",
    "plannedResultToVerify": "Заявление о назначении военной пенсии.",
    "sourceCandidates": [
      {
        "id": "5",
        "title": "ФЗ № 5-ФЗ о ветеранах",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "4468",
        "title": "Закон РФ № 4468-1 о военных пенсиях",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "76",
        "title": "ФЗ № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "Нельзя выводить пенсионное право только по возрасту.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный план; официальный источник, редакция, применимость и процессуальные сроки требуют отдельной проверки."
  },
  {
    "topicSlug": "veterany-pensii-i-lgoty",
    "topicTitle": "Статус ветерана, пенсии и социальные гарантии",
    "situationIndex": 4,
    "situationTitle": "Как обжаловать неправильный расчёт военной пенсии?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Проверить пенсионный расчёт, периоды и применимые коэффициенты.",
    "evidenceToConfirm": "Решение о назначении, расчёт, сведения о выслуге.",
    "competentRecipientToVerify": "Ведомственный орган определения статуса, назначения пенсии или соцподдержки по конкретной мере.",
    "plannedResultToVerify": "Заявление о перерасчёте пенсии.",
    "sourceCandidates": [
      {
        "id": "5",
        "title": "ФЗ № 5-ФЗ о ветеранах",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "4468",
        "title": "Закон РФ № 4468-1 о военных пенсиях",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "76",
        "title": "ФЗ № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "Не рассчитывать суммы по устаревшим нормативам.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный план; официальный источник, редакция, применимость и процессуальные сроки требуют отдельной проверки."
  },
  {
    "topicSlug": "veterany-pensii-i-lgoty",
    "topicTitle": "Статус ветерана, пенсии и социальные гарантии",
    "situationIndex": 5,
    "situationTitle": "Как получить меры социальной поддержки после увольнения?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Определить конкретную социальную льготу после увольнения и её условия.",
    "evidenceToConfirm": "Статус ветерана, пенсионные и региональные документы.",
    "competentRecipientToVerify": "Ведомственный орган определения статуса, назначения пенсии или соцподдержки по конкретной мере.",
    "plannedResultToVerify": "Заявление о назначении выбранной меры соцподдержки.",
    "sourceCandidates": [
      {
        "id": "5",
        "title": "ФЗ № 5-ФЗ о ветеранах",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "4468",
        "title": "Закон РФ № 4468-1 о военных пенсиях",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "76",
        "title": "ФЗ № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "Разные льготы оформляются через разные органы.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный план; официальный источник, редакция, применимость и процессуальные сроки требуют отдельной проверки."
  },
  {
    "topicSlug": "veterany-pensii-i-lgoty",
    "topicTitle": "Статус ветерана, пенсии и социальные гарантии",
    "situationIndex": 6,
    "situationTitle": "Как добиться предоставления медицинских и санаторно-курортных гарантий при наличии права?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Подтвердить медицинское и санаторное право по статусу и ведомству.",
    "evidenceToConfirm": "Медицинские рекомендации, документ о статусе, письменный отказ.",
    "competentRecipientToVerify": "Ведомственный орган определения статуса, назначения пенсии или соцподдержки по конкретной мере.",
    "plannedResultToVerify": "Заявление о предоставлении медицинской/санаторной гарантии.",
    "sourceCandidates": [
      {
        "id": "5",
        "title": "ФЗ № 5-ФЗ о ветеранах",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "4468",
        "title": "Закон РФ № 4468-1 о военных пенсиях",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "76",
        "title": "ФЗ № 76-ФЗ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      }
    ],
    "criticalLimitations": "Медицинская рекомендация и право на бесплатную услугу не тождественны.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный план; официальный источник, редакция, применимость и процессуальные сроки требуют отдельной проверки."
  },
  {
    "topicSlug": "sudebnaya-zashchita",
    "topicTitle": "Судебная защита прав военнослужащих",
    "situationIndex": 0,
    "situationTitle": "Как определить компетентный суд по военному спору?",
    "situationKind": "information",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Определить предмет спора, правовую природу требования и суд по подсудности.",
    "evidenceToConfirm": "Служебный статус, оспариваемый акт и адреса сторон.",
    "competentRecipientToVerify": "Компетентный суд, определяемый видом спора, подведомственностью и территориальной подсудностью.",
    "plannedResultToVerify": "Информация без генератора.",
    "sourceCandidates": [
      {
        "id": "kas",
        "title": "КАС РФ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "upk",
        "title": "УПК РФ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "53",
        "title": "ФЗ № 53-ФЗ",
        "url": "https://rosguard.gov.ru/document/article/federalnyj-zakon-ot-28-marta-1998-g--53fz",
        "type": "GOVERNMENT_REPRINT_STALE_NOT_CURRENT"
      }
    ],
    "criticalLimitations": "Военный суд компетентен не по любому спору военнослужащего.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный план; официальный источник, редакция, применимость и процессуальные сроки требуют отдельной проверки."
  },
  {
    "topicSlug": "sudebnaya-zashchita",
    "topicTitle": "Судебная защита прав военнослужащих",
    "situationIndex": 1,
    "situationTitle": "Как подать административное исковое заявление об оспаривании решения должностного лица?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Проверить публично-правовой характер решения и требования к административному иску.",
    "evidenceToConfirm": "Решение должностного лица, дата ознакомления, доказательства нарушения.",
    "competentRecipientToVerify": "Компетентный суд, определяемый видом спора, подведомственностью и территориальной подсудностью.",
    "plannedResultToVerify": "Административное исковое заявление.",
    "sourceCandidates": [
      {
        "id": "kas",
        "title": "КАС РФ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "upk",
        "title": "УПК РФ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "53",
        "title": "ФЗ № 53-ФЗ",
        "url": "https://rosguard.gov.ru/document/article/federalnyj-zakon-ot-28-marta-1998-g--53fz",
        "type": "GOVERNMENT_REPRINT_STALE_NOT_CURRENT"
      }
    ],
    "criticalLimitations": "Не генерировать иск без надлежащего ответчика, подсудности и срока.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный план; официальный источник, редакция, применимость и процессуальные сроки требуют отдельной проверки."
  },
  {
    "topicSlug": "sudebnaya-zashchita",
    "topicTitle": "Судебная защита прав военнослужащих",
    "situationIndex": 2,
    "situationTitle": "Как обжаловать бездействие командования в суде?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Установить обязанность должностного лица, срок действия и подтверждённое бездействие.",
    "evidenceToConfirm": "Обращение, подтверждение регистрации, переписка.",
    "competentRecipientToVerify": "Компетентный суд, определяемый видом спора, подведомственностью и территориальной подсудностью.",
    "plannedResultToVerify": "Административный иск об оспаривании бездействия.",
    "sourceCandidates": [
      {
        "id": "kas",
        "title": "КАС РФ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "upk",
        "title": "УПК РФ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "53",
        "title": "ФЗ № 53-ФЗ",
        "url": "https://rosguard.gov.ru/document/article/federalnyj-zakon-ot-28-marta-1998-g--53fz",
        "type": "GOVERNMENT_REPRINT_STALE_NOT_CURRENT"
      }
    ],
    "criticalLimitations": "Нерассмотрение обращения не означает автоматически удовлетворение требования.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный план; официальный источник, редакция, применимость и процессуальные сроки требуют отдельной проверки."
  },
  {
    "topicSlug": "sudebnaya-zashchita",
    "topicTitle": "Судебная защита прав военнослужащих",
    "situationIndex": 3,
    "situationTitle": "Как обжаловать отказ военной прокуратуры при наличии предусмотренных законом оснований?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Разграничить внесудебный ответ прокурора и предмет судебного оспаривания.",
    "evidenceToConfirm": "Ответ прокуратуры, заявление, доказательства нарушенного права.",
    "competentRecipientToVerify": "Компетентный суд, определяемый видом спора, подведомственностью и территориальной подсудностью.",
    "plannedResultToVerify": "Процессуальная жалоба или административный иск по применимому порядку.",
    "sourceCandidates": [
      {
        "id": "kas",
        "title": "КАС РФ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "upk",
        "title": "УПК РФ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "53",
        "title": "ФЗ № 53-ФЗ",
        "url": "https://rosguard.gov.ru/document/article/federalnyj-zakon-ot-28-marta-1998-g--53fz",
        "type": "GOVERNMENT_REPRINT_STALE_NOT_CURRENT"
      }
    ],
    "criticalLimitations": "Не всякий отказ прокуратуры оспаривается одним способом.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный план; официальный источник, редакция, применимость и процессуальные сроки требуют отдельной проверки."
  },
  {
    "topicSlug": "sudebnaya-zashchita",
    "topicTitle": "Судебная защита прав военнослужащих",
    "situationIndex": 4,
    "situationTitle": "Как подать ходатайство по рассматриваемому делу?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Определить стадию и предмет ходатайства в соответствующем деле.",
    "evidenceToConfirm": "Номер дела, процессуальный статус, судебные документы.",
    "competentRecipientToVerify": "Компетентный суд, определяемый видом спора, подведомственностью и территориальной подсудностью.",
    "plannedResultToVerify": "Ходатайство по установленному виду судопроизводства.",
    "sourceCandidates": [
      {
        "id": "kas",
        "title": "КАС РФ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "upk",
        "title": "УПК РФ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "53",
        "title": "ФЗ № 53-ФЗ",
        "url": "https://rosguard.gov.ru/document/article/federalnyj-zakon-ot-28-marta-1998-g--53fz",
        "type": "GOVERNMENT_REPRINT_STALE_NOT_CURRENT"
      }
    ],
    "criticalLimitations": "Форма и сроки зависят от рассматриваемого дела.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный план; официальный источник, редакция, применимость и процессуальные сроки требуют отдельной проверки."
  },
  {
    "topicSlug": "sudebnaya-zashchita",
    "topicTitle": "Судебная защита прав военнослужащих",
    "situationIndex": 5,
    "situationTitle": "Как подать апелляционную жалобу на решение суда?",
    "situationKind": "document",
    "status": "EDITORIAL_CASE_DRAFT",
    "legalQuestion": "Установить вид судопроизводства, дату решения и доступный апелляционный путь.",
    "evidenceToConfirm": "Решение суда, дата получения, сведения об участниках.",
    "competentRecipientToVerify": "Компетентный суд, определяемый видом спора, подведомственностью и территориальной подсудностью.",
    "plannedResultToVerify": "Апелляционная жалоба по соответствующему процессуальному кодексу.",
    "sourceCandidates": [
      {
        "id": "kas",
        "title": "КАС РФ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "upk",
        "title": "УПК РФ",
        "url": "https://pravo.gov.ru/",
        "type": "OFFICIAL_PORTAL_SEARCH_REQUIRED"
      },
      {
        "id": "53",
        "title": "ФЗ № 53-ФЗ",
        "url": "https://rosguard.gov.ru/document/article/federalnyj-zakon-ot-28-marta-1998-g--53fz",
        "type": "GOVERNMENT_REPRINT_STALE_NOT_CURRENT"
      }
    ],
    "criticalLimitations": "Не подменять жалобу по КАС РФ жалобой по УПК или ГПК.",
    "legalReviewConfirmed": false,
    "officialPublicationChecked": false,
    "reviewedAt": null,
    "note": "Редакционный план; официальный источник, редакция, применимость и процессуальные сроки требуют отдельной проверки."
  }
] as const;
export function getMilitaryLegalCaseCard(topicSlug:string,situationTitle:string){return MILITARY_LEGAL_CASE_CARDS.find(c=>c.topicSlug===topicSlug&&c.situationTitle===situationTitle)??null;}

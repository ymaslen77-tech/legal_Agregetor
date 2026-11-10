/**
 * Exact publisher URLs reviewed as candidate material on 10 Nov 2026.
 * A list of links is not a legal acceptance check: different pages can cover
 * different procedures and effective dates. All 60 scenario claims remain
 * PENDING until the exact relevant provisions, dates and exceptions agree
 * across independent reliable publishers with official law taking priority.
 */
export type CreditDebtLegalSource=Readonly<{
  publisher:string;
  title:string;
  url:string;
  status:"CANDIDATE";
}>;
export type CreditDebtLegalReview=Readonly<{
  groupId:string;
  situationId:string;
  reviewStatus:"PENDING";
  candidateSources:readonly CreditDebtLegalSource[];
  acceptedLegalClaims:readonly [];
  legallyReady:false;
  officialVersionPriority:true;
  minIndependentSources:2;
  lastCandidateReview:"2026-11-10";
}>;
const SOURCES:Readonly<Record<string,readonly CreditDebtLegalSource[]>>={
  "contract-terms": [
    {
      "publisher": "Банк России",
      "title": "Закон № 353-ФЗ: надзор и разъяснения",
      "url": "https://cbr.ru/na/353-fz/",
      "status": "CANDIDATE"
    },
    {
      "publisher": "КонсультантПлюс",
      "title": "Текст закона № 353-ФЗ с редакциями",
      "url": "https://www.consultant.ru/document/cons_doc_LAW_155986/",
      "status": "CANDIDATE"
    }
  ],
  "fees-addons": [
    {
      "publisher": "Роспотребнадзор",
      "title": "Навязывание страхования по кредиту, материал 09.04.2026",
      "url": "https://zpp.rospotrebnadzor.ru/news/regional/573114",
      "status": "CANDIDATE"
    },
    {
      "publisher": "Банк России",
      "title": "Закон № 353-ФЗ: информация и дополнительные услуги",
      "url": "https://cbr.ru/na/353-fz/",
      "status": "CANDIDATE"
    },
    {
      "publisher": "КонсультантПлюс",
      "title": "Статьи 5–7 закона № 353-ФЗ",
      "url": "https://www.consultant.ru/document/cons_doc_LAW_155986/",
      "status": "CANDIDATE"
    }
  ],
  "payment-difficulties": [
    {
      "publisher": "Банк России",
      "title": "Кредитные каникулы: FAQ, обновление 25.09.2026",
      "url": "https://www.cbr.ru/faq/w_fin_sector/kreditnye-kanikuly/",
      "status": "CANDIDATE"
    },
    {
      "publisher": "КонсультантПлюс",
      "title": "Закон № 353-ФЗ и специальные режимы изменения договора",
      "url": "https://www.consultant.ru/document/cons_doc_LAW_155986/",
      "status": "CANDIDATE"
    }
  ],
  "microloans": [
    {
      "publisher": "Банк России",
      "title": "Вопросы по микрофинансированию и ограничению переплат",
      "url": "https://www.cbr.ru/faq/microfin/",
      "status": "CANDIDATE"
    },
    {
      "publisher": "КонсультантПлюс",
      "title": "Закон № 353-ФЗ: соответствующие нормы и редакции",
      "url": "https://www.consultant.ru/document/cons_doc_LAW_155986/",
      "status": "CANDIDATE"
    }
  ],
  "collectors": [
    {
      "publisher": "Роспотребнадзор",
      "title": "Порядок взаимодействия коллекторов с должником, 29.12.2025",
      "url": "https://zpp.rospotrebnadzor.ru/news/federal/569888",
      "status": "CANDIDATE"
    },
    {
      "publisher": "КонсультантПлюс",
      "title": "Закон № 230-ФЗ о взыскании просроченной задолженности",
      "url": "https://www.consultant.ru/document/cons_doc_LAW_200497/",
      "status": "CANDIDATE"
    },
    {
      "publisher": "ФССП",
      "title": "Реестр профессиональных коллекторских организаций",
      "url": "https://fssp.gov.ru/iss/svedeniya-reestr-collect/gosreestr_jurlic",
      "status": "CANDIDATE"
    }
  ],
  "court-debt": [
    {
      "publisher": "КонсультантПлюс",
      "title": "Статья 129 ГПК РФ — судебный приказ",
      "url": "https://www.consultant.ru/document/cons_doc_LAW_39570/fd3336defa264ba3f3adb30a5f7d9b21017a6ca2/",
      "status": "CANDIDATE"
    },
    {
      "publisher": "КонсультантПлюс",
      "title": "Постановление Конституционного Суда РФ № 53-П (отдельный акт)",
      "url": "https://www.consultant.ru/document/cons_doc_LAW_462338/",
      "status": "CANDIDATE"
    },
    {
      "publisher": "ГАС «Правосудие»",
      "title": "Проверка конкретного суда и процессуальных данных",
      "url": "https://sudrf.ru/",
      "status": "CANDIDATE"
    }
  ],
  "mortgage": [
    {
      "publisher": "Банк России",
      "title": "Ипотечные каникулы: условия и документы",
      "url": "https://www.cbr.ru/faq/bank_s/ipotechnye_kanikuly/",
      "status": "CANDIDATE"
    },
    {
      "publisher": "КонсультантПлюс",
      "title": "Закон № 353-ФЗ: статьи 6.1 и 6.1-1",
      "url": "https://www.consultant.ru/document/cons_doc_LAW_155986/",
      "status": "CANDIDATE"
    }
  ],
  "history-fraud": [
    {
      "publisher": "Банк России",
      "title": "Оспаривание кредитной истории",
      "url": "https://www.cbr.ru/ckki/osparivanie-kreditnoy-istorii/",
      "status": "CANDIDATE"
    },
    {
      "publisher": "КонсультантПлюс",
      "title": "Статья 8 закона № 218-ФЗ «О кредитных историях»",
      "url": "https://www.consultant.ru/document/cons_doc_LAW_51043/602f589cb0d8d7b7127f3446189d6e399778eabb/",
      "status": "CANDIDATE"
    }
  ],
  "guarantors": [
    {
      "publisher": "КонсультантПлюс",
      "title": "Статья 363 ГК РФ об ответственности поручителя",
      "url": "https://www.consultant.ru/document/cons_doc_LAW_5142/1f9a87c9b304e5f284f77512792e47d1a4c864b0/",
      "status": "CANDIDATE"
    },
    {
      "publisher": "Банк России",
      "title": "Права потребителей финансовых услуг и споры с кредитором",
      "url": "https://www.cbr.ru/protection_rights/",
      "status": "CANDIDATE"
    }
  ],
  "bankruptcy": [
    {
      "publisher": "ФНС России",
      "title": "Банкротство граждан через МФЦ: разъяснение 03.08.2026 (архив)",
      "url": "https://www.nalog.gov.ru/rn38/news/activities_fts/16640726/",
      "status": "CANDIDATE"
    },
    {
      "publisher": "Социальный фонд России",
      "title": "Федеральный закон № 127-ФЗ, обновление 29.10.2026",
      "url": "https://sfr.gov.ru/order/law_accidents/federal_laws/~11281",
      "status": "CANDIDATE"
    },
    {
      "publisher": "КонсультантПлюс",
      "title": "Статья 223.2 закона № 127-ФЗ, внесудебное банкротство",
      "url": "https://www.consultant.ru/document/cons_doc_LAW_39331/c48290d39215783e73f0899bb1026b14cb221eff/",
      "status": "CANDIDATE"
    },
    {
      "publisher": "КонсультантПлюс",
      "title": "Статья 213.4 закона № 127-ФЗ, заявление в суд",
      "url": "https://www.consultant.ru/document/cons_doc_LAW_39331/c2c8c81ee8e4bd843286b08b10607f00ec6ae073/",
      "status": "CANDIDATE"
    }
  ]
};
export function getCreditDebtLegalSourceCandidates(groupId:string):readonly CreditDebtLegalSource[]{
  return SOURCES[groupId]??[];
}
export function getCreditDebtLegalReview(groupId:string,situationId:string):CreditDebtLegalReview{
  return {
    groupId,situationId,reviewStatus:"PENDING",
    candidateSources:getCreditDebtLegalSourceCandidates(groupId),
    acceptedLegalClaims:[],
    legallyReady:false,officialVersionPriority:true,minIndependentSources:2,
    lastCandidateReview:"2026-11-10"
  };
}

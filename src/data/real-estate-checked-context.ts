import { getRealEstateSituation } from "@/data/real-estate-route-plan";

/**
 * Contextual source comparison, not case-specific legal certification.
 * The law text is authoritative; explanatory pages and case reports are
 * cross-checks, never a substitute for the effective statutory provision.
 */
export const REAL_ESTATE_CHECKED_CONTEXT = [
  {
    id:"registry-errors-distinction",
    asOf:"2026-11-20",
    status:"CONTEXT_ONLY_NOT_DOCUMENT_READY",
    appliesTo:[
      "ownership-register/record-inaccurate",
      "land-boundaries/registry-boundary-error",
      "cadastral-valuation/wrong-object-area",
      "cadastral-valuation/technical-plan-error"
    ],
    proposition:"Часть 1 статьи 61 закона № 218-ФЗ описывает техническую ошибку при внесении записи в ЕГРН; часть 3 — реестровую ошибку, воспроизведённую из документа, на основании которого внесены сведения. Их порядок исправления различается.",
    limitations:"Нельзя выбрать процедуру только по описанию пользователя. Необходимо сопоставить запись ЕГРН и исходные документы, проверить, не затрагиваются ли зарегистрированные права и интересы третьих лиц. Для отдельных случаев необходим судебный акт; действующая редакция и компетенция проверяются на дату событий. Общие сведения не подтверждают конкретный результат для подачи.",
    sources:[
      {
        publisher:"КонсультантПлюс",
        type:"LAW_TEXT",
        url:"https://www.consultant.ru/document/cons_doc_LAW_182661/eb949852dbe72671f46c225fd6c28e9cecbe64da/",
        supports:"Статья 61 закона № 218-ФЗ в редакции, действующей с 25.10.2026"
      },
      {
        publisher:"ГАРАНТ",
        type:"LAW_TEXT",
        url:"https://base.garant.ru/71129192/98c63fbcbeeb1362018330a88cb049e2/",
        supports:"Независимое представление статьи 61 закона № 218-ФЗ"
      },
      {
        publisher:"Администрация Михайловского округа Рязанской области — разъяснение Роскадастра",
        type:"OFFICIAL_EXPLANATION",
        url:"https://miladm.ryazan.gov.ru/activities/rosreestr_informiruet/",
        supports:"Разъяснение Роскадастра от 27.10.2026 о различии технических и реестровых ошибок"
      }
    ]
  }
] as const;

export function getRealEstateCheckedContext(groupId:string,situationId:string){
  const key=groupId+"/"+situationId;
  if(!getRealEstateSituation(groupId,situationId))return [];
  return REAL_ESTATE_CHECKED_CONTEXT.filter(item=>item.appliesTo.some(value=>value===key));
}

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
  },
  {
    id:"share-sale-preemption",
    asOf:"2026-11-20",
    status:"CONTEXT_ONLY_NOT_DOCUMENT_READY",
    appliesTo:["shared-ownership/share-sale"],
    proposition:"Пункты 1–3 статьи 250 ГК РФ предусматривают преимущественное право покупки доли при продаже постороннему лицу, письменное извещение остальных участников с ценой и условиями, месячный срок для недвижимости (с учётом письменного отказа всех участников), а также судебное требование о переводе прав и обязанностей покупателя при нарушении права. Норма имеет исключения и специальные режимы.",
    limitations:"Это общее правило, не индивидуальное решение: проверить тип доли и объекта, продавца и покупателя, содержание и доказательства доставки извещений, условия продажи, наличие отказов, дату осведомлённости о нарушении, применимость нотариальной формы и специальных норм. Сделки с публичных торгов, доли в общем имуществе, доли в сельскохозяйственных землях и случаи, затрагиваемые постановлением КС РФ от 16.05.2023 № 23-П, требуют отдельной оценки. Не утверждать автоматически, что договор продажи недействителен.",
    sources:[
      {
        publisher:"КонсультантПлюс — действующий текст статьи 250 ГК РФ",
        type:"LAW_TEXT",
        url:"https://www.consultant.ru/document/cons_doc_LAW_5142/a4495f31ced2c9ba7baaad36968a88142d61c92b/",
        supports:"Пункты 1–5 статьи 250 ГК РФ, уведомление, сроки, перевод прав, исключения"
      },
      {
        publisher:"ГАРАНТ — текст статьи 250 ГК РФ",
        type:"LAW_TEXT",
        url:"https://base.garant.ru/10164072/90ac765ac9bb123905d63534062a6022/",
        supports:"Независимое издание статьи 250 и истории изменений"
      },
      {
        publisher:"Федеральная нотариальная палата — рекомендации от 27.02.2026 № 02/26",
        type:"PROFESSIONAL_GUIDANCE",
        url:"https://www.consultant.ru/document/cons_doc_LAW_531477/cfd8f6fb01706852d1d7601b114bedaab3a202cb/",
        supports:"Правоприменительные ограничения, нотариальная форма и документирование извещения в пунктах 1.2–1.8 рекомендаций"
      }
    ]
  }
] as const;

export function getRealEstateCheckedContext(groupId:string,situationId:string){
  const key=groupId+"/"+situationId;
  if(!getRealEstateSituation(groupId,situationId))return [];
  return REAL_ESTATE_CHECKED_CONTEXT.filter(item=>item.appliesTo.some(value=>value===key));
}

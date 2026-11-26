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
  },
  {
    id:"registration-suspension-article26",
    asOf:"2026-11-26",
    status:"CONTEXT_ONLY_NOT_DOCUMENT_READY",
    appliesTo:[
      "ownership-register/suspension-registration",
      "cadastral-valuation/cadastre-suspension"
    ],
    proposition:"Часть 1 статьи 26 закона № 218-ФЗ содержит перечень оснований, по которым государственный регистратор приостанавливает кадастровый учёт и (или) регистрацию прав. Причина в конкретном деле должна устанавливаться по решению или уведомлению, а не угадываться по виду объекта.",
    limitations:"Основания и сроки зависят от точного пункта статьи 26 и обстоятельств дела. Не путать приостановление по решению регистратора со случаем приостановления по заявлению (статья 30). Не определять автоматически срок, способ обжалования и необходимость суда: для кадастрового учёта действуют особые правила отдельных случаев. Проверить документы и редакцию закона на дату решения.",
    sources:[
      {
        publisher:"КонсультантПлюс — статья 26 закона № 218-ФЗ",
        type:"LAW_TEXT",
        url:"https://www.consultant.ru/document/cons_doc_LAW_182661/f10dc2166d2e834a0086658226e2f96fb5f1cb5f/",
        supports:"Часть 1 статьи 26, основания и специальные сроки приостановления"
      },
      {
        publisher:"ГАРАНТ — статья 26 закона № 218-ФЗ",
        type:"LAW_TEXT",
        url:"https://base.garant.ru/71129192/3ac805f6d87af32d44de92b042d51285/",
        supports:"Независимая публикация статьи 26 с условиями и исключениями"
      },
      {
        publisher:"СудАкт — статья 26 закона № 218-ФЗ",
        type:"LAW_TEXT",
        url:"https://sudact.ru/law/federalnyi-zakon-ot-13072015-n-218-fz-o/glava-3/statia-26/",
        supports:"Третья независимая публикация перечня оснований приостановления"
      }
    ]
  },
  {
    id:"registration-refusal-article27",
    asOf:"2026-11-26",
    status:"CONTEXT_ONLY_NOT_DOCUMENT_READY",
    appliesTo:[
      "ownership-register/registration-refusal",
      "build-renovation/building-register-refusal"
    ],
    proposition:"Часть 1 статьи 27 закона № 218-ФЗ предусматривает отказ в кадастровом учёте и (или) регистрации прав по решению регистратора, когда в течение срока приостановления не устранены причины, препятствовавшие учёту или регистрации, указанные в статье 26.",
    limitations:"Не считать отказ и приостановление одним решением. Для проверки законности и выбора дальнейшего способа защиты необходимы первоначальное уведомление о приостановлении, причины по конкретному пункту статьи 26, документы об их устранении, даты направления и получения, собственно решение об отказе и стадия обжалования. Часть 2 статьи 27 предусматривает специальный порядок исполнения решения суда при признании отказа незаконным, но не любое решение автоматически ведёт к регистрации. Не устанавливать срок обжалования, пошлину или подсудность по одной анкете.",
    sources:[
      {
        publisher:"КонсультантПлюс — статья 27 закона № 218-ФЗ",
        type:"LAW_TEXT",
        url:"https://www.consultant.ru/document/cons_doc_LAW_182661/57b5e78bd4909a6e15d4c3c0f17f15de22d885f5/",
        supports:"Часть 1 статьи 27 и условия отказа после приостановления"
      },
      {
        publisher:"ГАРАНТ — статья 27 закона № 218-ФЗ",
        type:"LAW_TEXT",
        url:"https://base.garant.ru/71129192/3e01a7fa47957b2f627d012fe630f5c6/",
        supports:"Независимая публикация условий отказа и части 2 статьи 27"
      },
      {
        publisher:"СудАкт — статья 27 закона № 218-ФЗ",
        type:"LAW_TEXT",
        url:"https://sudact.ru/law/federalnyi-zakon-ot-13072015-n-218-fz-o/glava-3/statia-27/",
        supports:"Третья независимая публикация частей 1 и 2 статьи 27"
      }
    ]
  }
] as const;

export function getRealEstateCheckedContext(groupId:string,situationId:string){
  const key=groupId+"/"+situationId;
  if(!getRealEstateSituation(groupId,situationId))return [];
  return REAL_ESTATE_CHECKED_CONTEXT.filter(item=>item.appliesTo.some(value=>value===key));
}

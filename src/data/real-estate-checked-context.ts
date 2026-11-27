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
  },
  {
    "id": "ddu-contract-article4",
    "asOf": "2026-11-27",
    "status": "CONTEXT_ONLY_NOT_DOCUMENT_READY",
    "appliesTo": [
      "newbuild-ddu/ddu-signing",
      "newbuild-ddu/area-mismatch"
    ],
    "proposition": "Часть 4 статьи 4 закона № 214-ФЗ требует указать в ДДУ конкретный объект и его характеристики, срок передачи, цену и порядок оплаты, гарантийный срок и другие обязательные условия. Для индивидуальных домов в малоэтажном комплексе предусмотрен специальный состав условий.",
    "limitations": "Сверить полный договор, приложения, план, проектную декларацию и вид объекта. При расхождении площади сопоставить одинаковые способы измерения и условия цены; отдельно проверить статью 5 и применимую редакцию. Не выводить автоматически право на доплату, возврат или расторжение.",
    "sources": [
      {
        "publisher": "КонсультантПлюс — статья 4 закона № 214-ФЗ",
        "type": "LAW_TEXT",
        "url": "https://www.consultant.ru/document/cons_doc_LAW_51038/6837eb5962d010b4c55b5544c6cc4415019883b5/",
        "supports": "Часть 4 и специальные условия ДДУ"
      },
      {
        "publisher": "ГАРАНТ — статья 4 закона № 214-ФЗ",
        "type": "LAW_TEXT",
        "url": "https://base.garant.ru/12138267/1b93c134b90c6071b4dc3f495464b753/",
        "supports": "Часть 4 и специальные условия ДДУ"
      },
      {
        "publisher": "СудАкт — закон № 214-ФЗ",
        "type": "LAW_TEXT",
        "url": "https://sudact.ru/law/federalnyi-zakon-ot-30122004-n-214-fz-ob/",
        "supports": "Статья 4: Часть 4 и специальные условия ДДУ"
      }
    ]
  },
  {
    "id": "ddu-delay-article6",
    "asOf": "2026-11-27",
    "status": "CONTEXT_ONLY_NOT_DOCUMENT_READY",
    "appliesTo": [
      "newbuild-ddu/developer-delay"
    ],
    "proposition": "Часть 1 статьи 6 закона № 214-ФЗ связывает обязанность передачи объекта с договорным сроком; часть 3 регулирует предложение изменить этот срок и порядок его изменения. Одно уведомление о переносе не заменяет проверку действительности изменения договора.",
    "limitations": "Проверить ДДУ, дополнительные соглашения, дату передачи, уведомления и обстоятельства поведения сторон. Не рассчитывать неустойку без проверки применимой редакции, специальных правил для отдельных объектов, временных ограничений начисления и исполнения требований за каждый период.",
    "sources": [
      {
        "publisher": "КонсультантПлюс — статья 6 закона № 214-ФЗ",
        "type": "LAW_TEXT",
        "url": "https://www.consultant.ru/document/cons_doc_LAW_51038/817620cd3c49f19912fc1ac0f98b10d17f65b75b/",
        "supports": "Части 1 и 3, договорный срок и изменение срока"
      },
      {
        "publisher": "ГАРАНТ — статья 6 закона № 214-ФЗ",
        "type": "LAW_TEXT",
        "url": "https://base.garant.ru/12138267/8b7b3c1c76e91f88d33c08b3736aa67a/",
        "supports": "Части 1 и 3, договорный срок и изменение срока"
      },
      {
        "publisher": "СудАкт — закон № 214-ФЗ",
        "type": "LAW_TEXT",
        "url": "https://sudact.ru/law/federalnyi-zakon-ot-30122004-n-214-fz-ob/",
        "supports": "Статья 6: Части 1 и 3, договорный срок и изменение срока"
      }
    ]
  },
  {
    "id": "ddu-quality-article7",
    "asOf": "2026-11-27",
    "status": "CONTEXT_ONLY_NOT_DOCUMENT_READY",
    "appliesTo": [
      "newbuild-ddu/quality-defects"
    ],
    "proposition": "Части 1 и 2 статьи 7 закона № 214-ФЗ устанавливают требования к качеству объекта и предусматривают способы защиты при недостатках при наличии предусмотренных нормой условий: устранение, уменьшение цены или возмещение расходов.",
    "limitations": "Сверить характер недостатка, договор, стандарт отделки при его применимости, даты выявления и передачи, доказательства, гарантийные условия и временные правила. Не выбирать требование, не рассчитывать суммы и не утверждать применимость всех способов защиты без индивидуальной проверки.",
    "sources": [
      {
        "publisher": "КонсультантПлюс — статья 7 закона № 214-ФЗ",
        "type": "LAW_TEXT",
        "url": "https://www.consultant.ru/document/cons_doc_LAW_51038/aeb9f2327f835ecc02fb71b9a0312ead0b844204/",
        "supports": "Части 1 и 2, требования к качеству и условные способы защиты"
      },
      {
        "publisher": "ГАРАНТ — статья 7 закона № 214-ФЗ",
        "type": "LAW_TEXT",
        "url": "https://base.garant.ru/12138267/e88847e78ccd9fdb54482c7fa15982bf/",
        "supports": "Части 1 и 2, требования к качеству и условные способы защиты"
      },
      {
        "publisher": "СудАкт — закон № 214-ФЗ",
        "type": "LAW_TEXT",
        "url": "https://sudact.ru/law/federalnyi-zakon-ot-30122004-n-214-fz-ob/",
        "supports": "Статья 7: Части 1 и 2, требования к качеству и условные способы защиты"
      }
    ]
  },
  {
    "id": "ddu-acceptance-article8",
    "asOf": "2026-11-27",
    "status": "CONTEXT_ONLY_NOT_DOCUMENT_READY",
    "appliesTo": [
      "newbuild-ddu/act-acceptance-dispute"
    ],
    "proposition": "Части 1, 4–6 статьи 8 закона № 214-ФЗ регулируют оформление передачи, уведомление участника, действия при несоответствии качества и условия составления одностороннего акта.",
    "limitations": "Проверить разрешение на ввод, уведомление и его получение, осмотр, характер недостатков, даты, причины неподписания и наличие одностороннего акта. Учитывать специальные временные правила приёмки на дату события. Не советовать автоматически отказываться от подписания или считать акт законным либо незаконным.",
    "sources": [
      {
        "publisher": "КонсультантПлюс — статья 8 закона № 214-ФЗ",
        "type": "LAW_TEXT",
        "url": "https://www.consultant.ru/document/cons_doc_LAW_51038/49cb99b1bfe1a09caaf585874de97bdb34fc6d48/",
        "supports": "Части 1, 4–6, передача, уведомление и односторонний акт"
      },
      {
        "publisher": "ГАРАНТ — статья 8 закона № 214-ФЗ",
        "type": "LAW_TEXT",
        "url": "https://base.garant.ru/12138267/31de5683116b8d79b08fa2d768e33df6/",
        "supports": "Части 1, 4–6, передача, уведомление и односторонний акт"
      },
      {
        "publisher": "СудАкт — закон № 214-ФЗ",
        "type": "LAW_TEXT",
        "url": "https://sudact.ru/law/federalnyi-zakon-ot-30122004-n-214-fz-ob/",
        "supports": "Статья 8: Части 1, 4–6, передача, уведомление и односторонний акт"
      }
    ]
  },
  {
    "id": "boundary-plan-article22",
    "asOf": "2026-11-27",
    "status": "CONTEXT_ONLY_NOT_DOCUMENT_READY",
    "appliesTo": [
      "land-boundaries/boundary-survey",
      "land-boundaries/boundary-overlap",
      "land-boundaries/registry-boundary-error"
    ],
    "proposition": "Части 1, 2 и 6 статьи 22 закона № 218-ФЗ определяют назначение межевого плана: он опирается на кадастровый план территории или выписку ЕГРН, содержит необходимые новые сведения об участке, включая данные для исправления реестровой ошибки, и отображает границы и доступ к участку.",
    "limitations": "Сопоставить актуальные выписки, исходные документы, координаты и заключение кадастрового инженера. Пересечение на публичной карте само по себе не доказывает реестровую ошибку. Условия уточнения, допустимые изменения площади, права смежных владельцев и порядок учёта проверять отдельно.",
    "sources": [
      {
        "publisher": "КонсультантПлюс",
        "type": "LAW_TEXT",
        "url": "https://www.consultant.ru/document/cons_doc_LAW_182661/13b49306f5233839ddc86ec9961aa17b47a25e25/",
        "supports": "Статья 22, назначение межевого плана, границы и доступ"
      },
      {
        "publisher": "ГАРАНТ",
        "type": "LAW_TEXT",
        "url": "https://base.garant.ru/71129192/94f5bf092e8d98af576ee351987de4f0/",
        "supports": "Статья 22, назначение межевого плана, границы и доступ"
      },
      {
        "publisher": "СудАкт",
        "type": "LAW_TEXT",
        "url": "https://sudact.ru/law/federalnyi-zakon-ot-13072015-n-218-fz-o/glava-3/statia-22/",
        "supports": "Статья 22, назначение межевого плана, границы и доступ"
      }
    ]
  },
  {
    "id": "boundary-consent-article39",
    "asOf": "2026-11-27",
    "status": "CONTEXT_ONLY_NOT_DOCUMENT_READY",
    "appliesTo": [
      "land-boundaries/boundary-survey",
      "land-boundaries/neighbor-boundary-dispute",
      "land-boundaries/boundary-approval"
    ],
    "proposition": "Статья 39 закона № 221-ФЗ регулирует обязательное согласование границ в предусмотренных частью 1 случаях, круг заинтересованных лиц, индивидуальное согласование или собрание, а также порядок извещения при собрании.",
    "limitations": "Проверить вид кадастровых работ, какие именно смежные границы уточняются, права и полномочия участников, способ извещения и основания публикации. Не считать любое размещение объявления достаточным; комплексные кадастровые работы имеют отдельные правила.",
    "sources": [
      {
        "publisher": "КонсультантПлюс",
        "type": "LAW_TEXT",
        "url": "https://www.consultant.ru/document/cons_doc_LAW_70088/4f1bebcfa021a0dc294282157b643f1cda962ff2/",
        "supports": "Статья 39, условия согласования, заинтересованные лица и извещение"
      },
      {
        "publisher": "ГАРАНТ",
        "type": "LAW_TEXT",
        "url": "https://base.garant.ru/12154874/478b4d0990e492511bea1e634e90a7b7/",
        "supports": "Статья 39, условия согласования, заинтересованные лица и извещение"
      },
      {
        "publisher": "СудАкт",
        "type": "LAW_TEXT",
        "url": "https://sudact.ru/law/federalnyi-zakon-ot-24072007-n-221-fz-o/glava-4/statia-39/",
        "supports": "Статья 39, условия согласования, заинтересованные лица и извещение"
      }
    ]
  },
  {
    "id": "boundary-act-article40",
    "asOf": "2026-11-27",
    "status": "CONTEXT_ONLY_NOT_DOCUMENT_READY",
    "appliesTo": [
      "land-boundaries/neighbor-boundary-dispute",
      "land-boundaries/boundary-approval"
    ],
    "proposition": "Части 2–5 статьи 40 закона № 221-ФЗ регулируют оформление согласования подписями, предусмотренный законом случай отсутствия возражений при надлежащем извещении, включение обоснованных письменных возражений в материалы и разрешение оставшихся споров.",
    "limitations": "Отсутствие подписи или ответа не равно автоматически согласию: проверить надлежащее извещение, срок, записи в акте и приложения, наличие письменных возражений. При электронном согласовании проверить специальные требования. Не определять границу и способ судебной защиты без исследования документов.",
    "sources": [
      {
        "publisher": "КонсультантПлюс",
        "type": "LAW_TEXT",
        "url": "https://www.consultant.ru/document/cons_doc_LAW_70088/30bc6b0757c17e6b066748aaa8e018cbbaea7911/",
        "supports": "Статья 40, подписи, извещение и возражения"
      },
      {
        "publisher": "ГАРАНТ",
        "type": "LAW_TEXT",
        "url": "https://base.garant.ru/12154874/f9b0119a4fce7561a213cdc9af189098/",
        "supports": "Статья 40, подписи, извещение и возражения"
      },
      {
        "publisher": "СудАкт",
        "type": "LAW_TEXT",
        "url": "https://sudact.ru/law/federalnyi-zakon-ot-24072007-n-221-fz-o/glava-4/statia-40/",
        "supports": "Статья 40, подписи, извещение и возражения"
      }
    ]
  },
  {
    "id": "private-servitude-article274",
    "asOf": "2026-11-27",
    "status": "CONTEXT_ONLY_NOT_DOCUMENT_READY",
    "appliesTo": [
      "land-boundaries/land-access",
      "neighbors-servitudes/blocked-drive",
      "neighbors-servitudes/servitude-agreement",
      "neighbors-servitudes/utilities-neighbor"
    ],
    "proposition": "Пункты 1, 3–6 статьи 274 ГК РФ регулируют установление частного сервитута для нужд, не обеспечиваемых иначе, соглашение и регистрацию, судебное разрешение спора при недостижении соглашения, круг управомоченных лиц и плату с предусмотренными законом исключениями.",
    "limitations": "Проверить право заявителя, принадлежность обременяемого участка, цель и альтернативные маршруты, существующие права доступа, условия соглашения и последствия для собственника. Не смешивать частный и публичный сервитут; наличие забора или неудобство проезда не доказывает необходимость сервитута. Для публичной земли и линейных объектов проверять специальные нормы.",
    "sources": [
      {
        "publisher": "КонсультантПлюс",
        "type": "LAW_TEXT",
        "url": "https://www.consultant.ru/document/cons_doc_LAW_5142/a6b643e62769c86f98c64d9ad628c0e5a2e92f3b/",
        "supports": "Статья 274, основания, соглашение, суд и регистрация"
      },
      {
        "publisher": "ГАРАНТ",
        "type": "LAW_TEXT",
        "url": "https://base.garant.ru/10164072/1810d6858e6ded3ac189d590da994bae/",
        "supports": "Статья 274, основания, соглашение, суд и регистрация"
      },
      {
        "publisher": "СудАкт",
        "type": "LAW_TEXT",
        "url": "https://sudact.ru/law/gk-rf-chast1/razdel-ii/glava-17/statia-274/?page=20",
        "supports": "Статья 274, основания, соглашение, суд и регистрация"
      }
    ]
  },
  {
    "id": "build-notice-article51-1",
    "asOf": "2026-11-27",
    "status": "CONTEXT_ONLY_NOT_DOCUMENT_READY",
    "appliesTo": [
      "build-renovation/house-notification",
      "build-renovation/reconstruction-docs"
    ],
    "proposition": "Статья 51.1 ГрК РФ предусматривает уведомление о планируемом строительстве или реконструкции ИЖС или садового дома с установленным набором сведений и проверкой допустимости параметров и размещения.",
    "limitations": "Проверить вид объекта и работ, права на землю, ВРИ, отступы, ограничения, дату и ответ органа; учесть исключения, в том числе строительство ИЖС с привлечением средств по № 214-ФЗ и отдельный порядок части 12 статьи 70 № 218-ФЗ. Не считать уведомительный порядок универсальным.",
    "sources": [
      {
        "publisher": "КонсультантПлюс",
        "type": "LAW_TEXT",
        "url": "https://www.consultant.ru/document/cons_doc_LAW_51040/fe0cad704c69e3b97bf615f0437ecf1996a57677/",
        "supports": "Статья 51.1, сведения и проверка параметров"
      },
      {
        "publisher": "ГАРАНТ",
        "type": "LAW_TEXT",
        "url": "https://base.garant.ru/12138258/d737ac68a72553c64d7b4303bf980638/",
        "supports": "Статья 51.1, сведения и проверка параметров"
      },
      {
        "publisher": "СудАкт",
        "type": "LAW_TEXT",
        "url": "https://sudact.ru/law/gradostroitelnyi-kodeks/glava-6/statia-51.1/",
        "supports": "Статья 51.1, сведения и проверка параметров"
      }
    ]
  },
  {
    "id": "build-simple-article70",
    "asOf": "2026-11-27",
    "status": "CONTEXT_ONLY_NOT_DOCUMENT_READY",
    "appliesTo": [
      "build-renovation/house-notification",
      "build-renovation/reconstruction-docs"
    ],
    "proposition": "Часть 12 статьи 70 закона № 218-ФЗ предусматривает до 1 марта 2031 года специальный порядок учёта и регистрации отвечающих установленным условиям жилых и садовых домов на участках указанных в норме видов использования.",
    "limitations": "Сверить вид и параметры дома, назначение участка, права, технический план, ограничения и условия частей 12–13. Не распространять упрощённую процедуру на все здания, виды реконструкции и земельные участки.",
    "sources": [
      {
        "publisher": "КонсультантПлюс",
        "type": "LAW_TEXT",
        "url": "https://www.consultant.ru/document/cons_doc_LAW_182661/aec996e2d81cfc470e7bb25a5d57100b8a3cd106/",
        "supports": "Часть 12 статьи 70, специальная регистрация домов"
      },
      {
        "publisher": "ГАРАНТ",
        "type": "LAW_TEXT",
        "url": "https://base.garant.ru/71129192/2c2bb927757944432208533b3ff87c36/",
        "supports": "Часть 12 статьи 70, специальная регистрация домов"
      },
      {
        "publisher": "СудАкт",
        "type": "LAW_TEXT",
        "url": "https://sudact.ru/law/federalnyi-zakon-ot-13072015-n-218-fz-o/glava-11/statia-70_1/",
        "supports": "Часть 12 статьи 70, специальная регистрация домов"
      }
    ]
  },
  {
    "id": "build-unauthorized-article222",
    "asOf": "2026-11-27",
    "status": "CONTEXT_ONLY_NOT_DOCUMENT_READY",
    "appliesTo": [
      "build-renovation/unauthorized-building",
      "build-renovation/demolition-order"
    ],
    "proposition": "Статья 222 ГК РФ определяет признаки самовольной постройки, условия признания права и случаи сноса или приведения в соответствие; полномочия органа местного самоуправления ограничены законом.",
    "limitations": "Проверить даты строительства и выявления, права на землю, ВРИ, параметры, согласования, угрозу жизни и здоровью, чужие права, ранее принятые судебные акты и компетенцию органа. Не утверждать автоматически самовольность, законность сноса или возможность признания права. Учитывать постановление Пленума ВС РФ от 12.12.2023 № 44 и специальные режимы.",
    "sources": [
      {
        "publisher": "КонсультантПлюс",
        "type": "LAW_TEXT",
        "url": "https://www.consultant.ru/document/cons_doc_LAW_5142/f670878d88ab83726bd1804b82668b84b027802e/",
        "supports": "Статья 222, признаки и способы разрешения"
      },
      {
        "publisher": "ГАРАНТ",
        "type": "LAW_TEXT",
        "url": "https://base.garant.ru/10164072/563198f2b81e68dd907ddc26c916e9b0/",
        "supports": "Статья 222, признаки и способы разрешения"
      },
      {
        "publisher": "СудАкт",
        "type": "LAW_TEXT",
        "url": "https://sudact.ru/law/gk-rf-chast1/razdel-ii/glava-14/statia-222/",
        "supports": "Статья 222, признаки и способы разрешения"
      }
    ]
  },
  {
    "id": "build-registration-article40",
    "asOf": "2026-11-27",
    "status": "CONTEXT_ONLY_NOT_DOCUMENT_READY",
    "appliesTo": [
      "build-renovation/unfinished-property",
      "build-renovation/building-register-refusal"
    ],
    "proposition": "Статья 40 закона № 218-ФЗ устанавливает особенности кадастрового учёта и регистрации созданных объектов и незавершённого строительства, включая связь с регистрацией права на землю при отсутствии записи ЕГРН и предусмотренные законом исключения.",
    "limitations": "Проверить статус объекта, право на участок, запись ЕГРН, технический план, разрешительные документы и специальные исключения статьи 40, включая отдельный режим реестров незавершённых объектов. Не считать любой недостроенный объект подлежащим регистрации.",
    "sources": [
      {
        "publisher": "КонсультантПлюс",
        "type": "LAW_TEXT",
        "url": "https://www.consultant.ru/document/cons_doc_LAW_182661/2a1d75c2e35cd634aba9fb73737750a657ce0525/",
        "supports": "Статья 40, связь регистрации здания и земли"
      },
      {
        "publisher": "ГАРАНТ",
        "type": "LAW_TEXT",
        "url": "https://base.garant.ru/71129192/f9b0119a4fce7561a213cdc9af189098/",
        "supports": "Статья 40, связь регистрации здания и земли"
      },
      {
        "publisher": "СудАкт",
        "type": "LAW_TEXT",
        "url": "https://sudact.ru/law/federalnyi-zakon-ot-13072015-n-218-fz-o/glava-6/statia-40_1/",
        "supports": "Статья 40, связь регистрации здания и земли"
      }
    ]
  }
] as const;

export function getRealEstateCheckedContext(groupId:string,situationId:string){
  const key=groupId+"/"+situationId;
  if(!getRealEstateSituation(groupId,situationId))return [];
  return REAL_ESTATE_CHECKED_CONTEXT.filter(item=>item.appliesTo.some(value=>value===key));
}

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
  },
  {
    "id": "share-use-article247",
    "asOf": "2026-11-27",
    "status": "CONTEXT_ONLY_NOT_DOCUMENT_READY",
    "appliesTo": [
      "shared-ownership/use-arrangement",
      "shared-ownership/compensation-share"
    ],
    "proposition": "Статья 247 ГК РФ устанавливает согласование владения и пользования общим долевым имуществом участниками, а при споре — судебный порядок. При невозможности предоставления соразмерной части в пользование предусмотрена компенсация при условиях нормы.",
    "limitations": "Проверить доли, реальный порядок пользования, соглашения, доступ к имуществу и обстоятельства использования другими участниками. Компенсация за пользование не тождественна выкупу доли по статье 252.",
    "sources": [
      {
        "publisher": "КонсультантПлюс",
        "type": "LAW_TEXT",
        "url": "https://www.consultant.ru/document/cons_doc_LAW_5142/fa1115a8e1086a097eb06c012bc2f5d5494b3756/",
        "supports": "Статья 247, порядок пользования и компенсация"
      },
      {
        "publisher": "ГАРАНТ",
        "type": "LAW_TEXT",
        "url": "https://base.garant.ru/10164072/6be2d17d1f68853d8ca0afc174d241ad/",
        "supports": "Статья 247, порядок пользования и компенсация"
      },
      {
        "publisher": "СудАкт",
        "type": "LAW_TEXT",
        "url": "https://sudact.ru/law/gk-rf-chast1/razdel-ii/glava-16/ss-1_9/statia-247/",
        "supports": "Статья 247, порядок пользования и компенсация"
      }
    ]
  },
  {
    "id": "share-cost-article249",
    "asOf": "2026-11-27",
    "status": "CONTEXT_ONLY_NOT_DOCUMENT_READY",
    "appliesTo": [
      "shared-ownership/shared-costs"
    ],
    "proposition": "Статья 249 ГК РФ устанавливает участие сособственников соразмерно долям в обязательных платежах по общему имуществу и расходах на содержание и сохранение.",
    "limitations": "Проверить правовой режим, периоды владения, виды расходов, их необходимость, подтверждения оплаты и соглашения. Не переносить автоматически правило на личное потребление коммунальных услуг или отношения социального найма; проверить специальные нормы и основания взыскания.",
    "sources": [
      {
        "publisher": "КонсультантПлюс",
        "type": "LAW_TEXT",
        "url": "https://www.consultant.ru/document/cons_doc_LAW_5142/ce2c1649bd4a507adbf62f69a382f8fd74c9aec6/",
        "supports": "Статья 249, участие в расходах"
      },
      {
        "publisher": "ГАРАНТ",
        "type": "LAW_TEXT",
        "url": "https://base.garant.ru/10164072/f7c79208d31d491b5ba6ce636759bbe9/",
        "supports": "Статья 249, участие в расходах"
      },
      {
        "publisher": "СудАкт",
        "type": "LAW_TEXT",
        "url": "https://sudact.ru/law/gk-rf-chast1/razdel-ii/glava-16/ss-1_9/statia-249_1/?page=2",
        "supports": "Статья 249, участие в расходах"
      }
    ]
  },
  {
    "id": "share-division-article252",
    "asOf": "2026-11-27",
    "status": "CONTEXT_ONLY_NOT_DOCUMENT_READY",
    "appliesTo": [
      "shared-ownership/share-division",
      "shared-ownership/compensation-share"
    ],
    "proposition": "Статья 252 ГК РФ регулирует раздел общего долевого имущества, выдел доли и компенсацию; принудительная компенсация без согласия допускается судом при совокупности специальных условий о незначительности доли, невозможности её реального выдела и отсутствии существенного интереса.",
    "limitations": "Проверить возможность выдела, характеристики объекта, права участников, согласие, оценку и существенный интерес; не определять автоматически незначительность доли по одному проценту, сумму компенсации или прекращение права.",
    "sources": [
      {
        "publisher": "КонсультантПлюс",
        "type": "LAW_TEXT",
        "url": "https://www.consultant.ru/document/cons_doc_LAW_5142/ec91c6fa97b4dd2bc3449e91d0ca7d554253f6de/",
        "supports": "Статья 252, выдел и условия компенсации"
      },
      {
        "publisher": "ГАРАНТ",
        "type": "LAW_TEXT",
        "url": "https://base.garant.ru/10164072/7f0762447f5457e0ca3b7fc5dfe1175f/",
        "supports": "Статья 252, выдел и условия компенсации"
      },
      {
        "publisher": "СудАкт",
        "type": "LAW_TEXT",
        "url": "https://sudact.ru/law/gk-rf-chast1/razdel-ii/glava-16/ss-1_9/statia-252/",
        "supports": "Статья 252, выдел и условия компенсации"
      }
    ]
  },
  {
    "id": "transaction-protection-551",
    "asOf": "2026-11-27",
    "status": "CONTEXT_ONLY_NOT_DOCUMENT_READY",
    "appliesTo": [
      "ownership-register/ownership-transfer",
      "property-transactions/prepurchase-check"
    ],
    "proposition": "Статья 551 ГК РФ требует государственной регистрации перехода собственности при продаже недвижимости. При уклонении стороны от регистрации другая сторона может требовать судебного решения о регистрации при условиях нормы.",
    "limitations": "Проверить заключённость договора, исполнение, права продавца, причину отсутствия записи и документы регистратора. Уклонение стороны не равно отказу Росреестра; не выбирать способ защиты автоматически.",
    "sources": [
      {
        "publisher": "КонсультантПлюс",
        "type": "LAW_TEXT",
        "url": "https://www.consultant.ru/document/cons_doc_LAW_9027/15de7d7f32ed75647dd8e11602ce7fa8c4b5bb8b/",
        "supports": "Общее положение статьи 551"
      },
      {
        "publisher": "ГАРАНТ",
        "type": "LAW_TEXT",
        "url": "https://base.garant.ru/10164072/fbac239d206e52f103b4c2e3cb5d01df/",
        "supports": "Общее положение статьи 551"
      },
      {
        "publisher": "СудАкт",
        "type": "LAW_TEXT",
        "url": "https://sudact.ru/law/gk-rf-chast2/razdel-iv/glava-30/ss-7/statia-551/",
        "supports": "Общее положение статьи 551"
      }
    ]
  },
  {
    "id": "transaction-protection-556",
    "asOf": "2026-11-27",
    "status": "CONTEXT_ONLY_NOT_DOCUMENT_READY",
    "appliesTo": [
      "property-transactions/seller-no-transfer"
    ],
    "proposition": "Статья 556 ГК РФ регулирует передачу недвижимости по акту или иному передаточному документу; уклонение от его подписания на договорных условиях квалифицируется как отказ от соответствующей обязанности.",
    "limitations": "Проверить фактическую передачу, условия договора, ключи, акт, уведомления и поведение сторон. Отделить передачу от регистрации перехода права.",
    "sources": [
      {
        "publisher": "КонсультантПлюс",
        "type": "LAW_TEXT",
        "url": "https://www.consultant.ru/document/cons_doc_LAW_9027/3e859336194c50096387c5694f99883bed271e78/",
        "supports": "Общее положение статьи 556"
      },
      {
        "publisher": "ГАРАНТ",
        "type": "LAW_TEXT",
        "url": "https://base.garant.ru/483424196/7de16aeb618604b5f2bbfc08695b1044/",
        "supports": "Общее положение статьи 556"
      },
      {
        "publisher": "СудАкт",
        "type": "LAW_TEXT",
        "url": "https://sudact.ru/law/gk-rf-chast2/razdel-iv/glava-30/ss-7/statia-556/",
        "supports": "Общее положение статьи 556"
      }
    ]
  },
  {
    "id": "transaction-protection-486",
    "asOf": "2026-11-27",
    "status": "CONTEXT_ONLY_NOT_DOCUMENT_READY",
    "appliesTo": [
      "property-transactions/buyer-payment-delay"
    ],
    "proposition": "Статья 486 ГК РФ устанавливает общие правила оплаты по купле-продаже и допускает требование оплаты и процентов при несвоевременной оплате переданного товара.",
    "limitations": "Проверить договорные сроки, аванс, кредит, рассрочку, фактическое исполнение и специальные условия. Не рассчитывать проценты или выбирать расторжение автоматически.",
    "sources": [
      {
        "publisher": "КонсультантПлюс",
        "type": "LAW_TEXT",
        "url": "https://www.consultant.ru/document/cons_doc_LAW_9027/2120e9b039b6f15a3d1c793f412f7df3ffcfbd33/",
        "supports": "Общее положение статьи 486"
      },
      {
        "publisher": "ГАРАНТ",
        "type": "LAW_TEXT",
        "url": "https://base.garant.ru/3961443/76f6f285769ca3565678381da7f4c707/",
        "supports": "Общее положение статьи 486"
      },
      {
        "publisher": "СудАкт",
        "type": "LAW_TEXT",
        "url": "https://sudact.ru/law/gk-rf-chast2/razdel-iv/glava-30/ss-1/statia-486/",
        "supports": "Общее положение статьи 486"
      }
    ]
  },
  {
    "id": "transaction-protection-460",
    "asOf": "2026-11-27",
    "status": "CONTEXT_ONLY_NOT_DOCUMENT_READY",
    "appliesTo": [
      "property-transactions/hidden-encumbrance",
      "property-transactions/prepurchase-check"
    ],
    "proposition": "Статья 460 ГК РФ регулирует обязанность продавца передавать имущество без прав третьих лиц, кроме согласованных покупателем обременений, и предусматривает условные способы защиты.",
    "limitations": "Проверить вид права или притязания, момент его возникновения, осведомлённость покупателя, договор, ЕГРН и применимость специальных норм. Отсутствие записи не гарантирует отсутствия прав третьих лиц.",
    "sources": [
      {
        "publisher": "КонсультантПлюс",
        "type": "LAW_TEXT",
        "url": "https://www.consultant.ru/document/cons_doc_LAW_9027/89e42f0ef51adc5ffd2dfbf59f64714aa9502408/",
        "supports": "Общее положение статьи 460"
      },
      {
        "publisher": "ГАРАНТ",
        "type": "LAW_TEXT",
        "url": "https://base.garant.ru/483424196/6fa2486d2912c9fb92498309da1d87e5/",
        "supports": "Общее положение статьи 460"
      },
      {
        "publisher": "СудАкт",
        "type": "LAW_TEXT",
        "url": "https://sudact.ru/law/gk-rf-chast2/razdel-iv/glava-30/ss-1/statia-460/",
        "supports": "Общее положение статьи 460"
      }
    ]
  },
  {
    "id": "transaction-protection-429",
    "asOf": "2026-11-27",
    "status": "CONTEXT_ONLY_NOT_DOCUMENT_READY",
    "appliesTo": [
      "property-transactions/preliminary-contract"
    ],
    "proposition": "Статья 429 ГК РФ регулирует обязанность заключения основного договора в будущем, форму, условия, срок и возможность судебного понуждения при предусмотренных законом обстоятельствах.",
    "limitations": "Проверить квалификацию договора, предмет, форму, сроки, предложение заключить основной договор и доказательства его отправки. Не квалифицировать любой аванс как задаток; не вычислять срок автоматически.",
    "sources": [
      {
        "publisher": "КонсультантПлюс",
        "type": "LAW_TEXT",
        "url": "https://www.consultant.ru/document/cons_doc_LAW_5142/97b643126817ac88d7d189c4e90a598045ca555c/",
        "supports": "Общее положение статьи 429"
      },
      {
        "publisher": "ГАРАНТ",
        "type": "LAW_TEXT",
        "url": "https://base.garant.ru/10164072/2a63961ca10f446f15ae39332e88fd3c/",
        "supports": "Общее положение статьи 429"
      },
      {
        "publisher": "СудАкт",
        "type": "LAW_TEXT",
        "url": "https://sudact.ru/law/gk-rf-chast1/razdel-iii/podrazdel-2_1/glava-27/statia-429/",
        "supports": "Общее положение статьи 429"
      }
    ]
  },
  {
    "id": "transaction-protection-167",
    "asOf": "2026-11-27",
    "status": "CONTEXT_ONLY_NOT_DOCUMENT_READY",
    "appliesTo": [
      "property-transactions/invalidate-property-deal"
    ],
    "proposition": "Статья 167 ГК РФ определяет общие последствия недействительности сделки, включая возврат полученного или возмещение стоимости с установленными законом исключениями.",
    "limitations": "Сначала установить конкретное основание недействительности, применимую редакцию, круг лиц и сроки; проверить статьи 166–181, права третьих лиц и судебные разъяснения. Не считать сделку недействительной из одного описания и не обещать реституцию.",
    "sources": [
      {
        "publisher": "КонсультантПлюс",
        "type": "LAW_TEXT",
        "url": "https://www.consultant.ru/document/cons_doc_LAW_5142/c18778732f1e820875bb79a8f634f706940f0142/",
        "supports": "Общее положение статьи 167"
      },
      {
        "publisher": "ГАРАНТ",
        "type": "LAW_TEXT",
        "url": "https://base.garant.ru/10164072/bb6d500b8f60186b09506f1befdf6687/",
        "supports": "Общее положение статьи 167"
      },
      {
        "publisher": "СудАкт",
        "type": "LAW_TEXT",
        "url": "https://sudact.ru/law/gk-rf-chast1/razdel-i/podrazdel-4/glava-9/ss-2_2/statia-167/",
        "supports": "Общее положение статьи 167"
      }
    ]
  },
  {
    "id": "transaction-protection-8.1",
    "asOf": "2026-11-27",
    "status": "CONTEXT_ONLY_NOT_DOCUMENT_READY",
    "appliesTo": [
      "ownership-register/encumbrance-record",
      "property-litigation/contested-register-right"
    ],
    "proposition": "Статья 8.1 ГК РФ устанавливает общие правила государственной регистрации прав, ограничений и обременений в предусмотренных законом случаях, включая проверку оснований регистрации и достоверность реестра.",
    "limitations": "Установить запись, документ-основание, лицо, чьи права затронуты, и характер спора. Не считать спор о праве технической ошибкой; отдельно проверить способ защиты и надлежащих участников.",
    "sources": [
      {
        "publisher": "КонсультантПлюс",
        "type": "LAW_TEXT",
        "url": "https://www.consultant.ru/document/cons_doc_LAW_5142/0357f6ec88e3d6d7616956dbeb6b6a07e2b393dd/",
        "supports": "Общее положение статьи 8.1"
      },
      {
        "publisher": "ГАРАНТ",
        "type": "LAW_TEXT",
        "url": "https://base.garant.ru/10164072/c39b8e96ec0008b1c62ae7ad768077a2/",
        "supports": "Общее положение статьи 8.1"
      },
      {
        "publisher": "СудАкт",
        "type": "LAW_TEXT",
        "url": "https://sudact.ru/law/gk-rf-chast1/razdel-i/podrazdel-1/glava-2/statia-8.1/?page=9",
        "supports": "Общее положение статьи 8.1"
      }
    ]
  },
  {
    "id": "transaction-protection-14",
    "asOf": "2026-11-27",
    "status": "CONTEXT_ONLY_NOT_DOCUMENT_READY",
    "appliesTo": [
      "ownership-register/title-documents",
      "shared-ownership/share-registration",
      "cadastral-valuation/object-no-record",
      "property-litigation/recognition-of-right"
    ],
    "proposition": "Статья 14 закона № 218-ФЗ устанавливает общие основания кадастрового учёта и регистрации прав, в том числе сделки, акты органов, наследственные документы и вступившие в силу судебные акты.",
    "limitations": "Проверить конкретное основание права, комплект документов, вид объекта, необходимость отдельного учёта и специальные требования. Для признания права судебный акт является возможным регистрационным основанием, а не самостоятельным материальным основанием удовлетворения иска.",
    "sources": [
      {
        "publisher": "КонсультантПлюс",
        "type": "LAW_TEXT",
        "url": "https://www.consultant.ru/document/cons_doc_LAW_182661/cec950b7d67461cec8418d349b532c4574a9db11/",
        "supports": "Общее положение статьи 14"
      },
      {
        "publisher": "ГАРАНТ",
        "type": "LAW_TEXT",
        "url": "https://base.garant.ru/71129192/888134b28b1397ffae87a0ab1e117954/",
        "supports": "Общее положение статьи 14"
      },
      {
        "publisher": "СудАкт",
        "type": "LAW_TEXT",
        "url": "https://sudact.ru/law/federalnyi-zakon-ot-13072015-n-218-fz-o/glava-3/statia-14/",
        "supports": "Общее положение статьи 14"
      }
    ]
  },
  {
    "id": "transaction-protection-301",
    "asOf": "2026-11-27",
    "status": "CONTEXT_ONLY_NOT_DOCUMENT_READY",
    "appliesTo": [
      "property-litigation/property-recovery"
    ],
    "proposition": "Статья 301 ГК РФ предусматривает возможность собственника истребовать имущество из чужого незаконного владения.",
    "limitations": "Установить право истца, фактического владельца, основания владения и выбытия, добросовестность, условия статьи 302 и сроки. Не смешивать с договорным возвратом и устранением препятствий.",
    "sources": [
      {
        "publisher": "КонсультантПлюс",
        "type": "LAW_TEXT",
        "url": "https://www.consultant.ru/document/cons_doc_LAW_5142/b2a84889a81c92096e09bef00d500570aba6cda2/",
        "supports": "Общее положение статьи 301"
      },
      {
        "publisher": "ГАРАНТ",
        "type": "PROFESSIONAL_GUIDANCE",
        "url": "https://base.garant.ru/1795065/",
        "supports": "Постановление Пленумов ВС и ВАС № 10/22, применение статьи 301"
      },
      {
        "publisher": "СудАкт",
        "type": "LAW_TEXT",
        "url": "https://sudact.ru/law/gk-rf-chast1/razdel-ii/glava-20/statia-301/",
        "supports": "Общее положение статьи 301"
      }
    ]
  },
  {
    "id": "transaction-protection-304",
    "asOf": "2026-11-27",
    "status": "CONTEXT_ONLY_NOT_DOCUMENT_READY",
    "appliesTo": [
      "property-litigation/property-obstacle",
      "neighbors-servitudes/fence-dispute",
      "neighbors-servitudes/water-runoff"
    ],
    "proposition": "Статья 304 ГК РФ предусматривает устранение нарушений права собственника без лишения владения.",
    "limitations": "Проверить право, сохранение владения, конкретные нарушения и доказательства связи с действиями другого лица. Для забора и стока установить границы, фактические обстоятельства и технические нормы; не определять автоматически перенос забора или обязанность устранить сток.",
    "sources": [
      {
        "publisher": "КонсультантПлюс",
        "type": "LAW_TEXT",
        "url": "https://www.consultant.ru/document/cons_doc_LAW_5142/3a820582b0e614ab5534769b7bd207bd095cbe8e/",
        "supports": "Общее положение статьи 304"
      },
      {
        "publisher": "ГАРАНТ",
        "type": "LAW_TEXT",
        "url": "https://base.garant.ru/10164072/993c3a2906ab5bd456be72d3a536e841/",
        "supports": "Общее положение статьи 304"
      },
      {
        "publisher": "СудАкт",
        "type": "LAW_TEXT",
        "url": "https://sudact.ru/law/gk-rf-chast1/razdel-ii/glava-20/statia-304/",
        "supports": "Общее положение статьи 304"
      }
    ]
  },
  {
    "id": "transaction-protection-1064",
    "asOf": "2026-11-27",
    "status": "CONTEXT_ONLY_NOT_DOCUMENT_READY",
    "appliesTo": [
      "neighbors-servitudes/damage-neighbor-build",
      "neighbors-servitudes/water-runoff"
    ],
    "proposition": "Статья 1064 ГК РФ устанавливает общие основания ответственности за причинение вреда имуществу и предусматривает исключения и специальные случаи.",
    "limitations": "Проверить наличие и размер вреда, причинную связь, действия причинителя, вину и специальные режимы ответственности. Не рассчитывать возмещение по одной анкете; необходимы акты и доказательства.",
    "sources": [
      {
        "publisher": "КонсультантПлюс",
        "type": "LAW_TEXT",
        "url": "https://www.consultant.ru/document/cons_doc_LAW_9027/c511835e25e63740cf185038b1ad056526f814e9/",
        "supports": "Общее положение статьи 1064"
      },
      {
        "publisher": "ГАРАНТ",
        "type": "LAW_TEXT",
        "url": "https://base.garant.ru/10164072/e640be677a214338f242b81d3746dbe5/",
        "supports": "Общее положение статьи 1064"
      },
      {
        "publisher": "СудАкт",
        "type": "LAW_TEXT",
        "url": "https://sudact.ru/law/gk-rf-chast2/razdel-iv/glava-59/ss-1_7/statia-1064/",
        "supports": "Общее положение статьи 1064"
      }
    ]
  },
  {
    "id": "land-vri-14.1",
    "asOf": "2026-11-27",
    "status": "CONTEXT_ONLY_NOT_DOCUMENT_READY",
    "appliesTo": [
      "land-status-use/land-permitted-use"
    ],
    "proposition": "Статья 14.1 ЗК РФ определяет вид разрешённого использования земельного участка с учётом установленных ограничений и различает виды использования.",
    "limitations": "Проверить дату установления ВРИ, категорию, регламент использования территории, действующие ограничения, вид права и переходные положения закона № 295-ФЗ от 31.07.2025. Для изменения отдельно исследовать статьи 14.2–14.4 ЗК РФ и применимые местные правила. Не применять автоматически прежний порядок до 01.03.2026.",
    "sources": [
      {
        "publisher": "КонсультантПлюс",
        "type": "LAW_TEXT",
        "url": "https://www.consultant.ru/document/cons_doc_LAW_33773/017fdd2c55f65727e7bb9b81defa7109c620b4f9/",
        "supports": "Общее положение статьи 14.1"
      },
      {
        "publisher": "ГАРАНТ",
        "type": "LAW_TEXT",
        "url": "https://base.garant.ru/483427119/4409e3d130a818a2b5323978ad10f4c3/",
        "supports": "Общее положение статьи 14.1"
      },
      {
        "publisher": "Клерк",
        "type": "LAW_TEXT",
        "url": "https://klerk.systems/docs/zk_rf/article/14.1/date20260901/",
        "supports": "Общее положение статьи 14.1"
      }
    ]
  },
  {
    "id": "land-zone-56",
    "asOf": "2026-11-27",
    "status": "CONTEXT_ONLY_NOT_DOCUMENT_READY",
    "appliesTo": [
      "land-status-use/land-zone-limit"
    ],
    "proposition": "Статья 56 ЗК РФ предусматривает основания ограничения прав на землю, в том числе в зонах с особыми условиями использования территорий; ограничения могут сохраняться при переходе права.",
    "limitations": "Установить точный вид зоны, акт, дату, карту границ и применимые переходные положения; отдельно проверить последствия для конкретного использования, возможное обжалование и компенсацию.",
    "sources": [
      {
        "publisher": "КонсультантПлюс",
        "type": "LAW_TEXT",
        "url": "https://www.consultant.ru/document/cons_doc_LAW_33773/50be48f9f4b02e9d27511e0be03f24167b2f2e48/",
        "supports": "Общее положение статьи 56"
      },
      {
        "publisher": "ГАРАНТ",
        "type": "LAW_TEXT",
        "url": "https://base.garant.ru/12124624/2b6ebde936316453fb0f8db9c6ad7e2c/",
        "supports": "Общее положение статьи 56"
      },
      {
        "publisher": "СудАкт",
        "type": "LAW_TEXT",
        "url": "https://sudact.ru/law/zemelnyi-kodeks/glava-vii/statia-56/",
        "supports": "Общее положение статьи 56"
      }
    ]
  },
  {
    "id": "land-lease-39.6",
    "asOf": "2026-11-27",
    "status": "CONTEXT_ONLY_NOT_DOCUMENT_READY",
    "appliesTo": [
      "land-status-use/public-land-lease"
    ],
    "proposition": "Статья 39.6 ЗК РФ различает предоставление публичных земельных участков в аренду на торгах и установленные законом случаи предоставления без торгов.",
    "limitations": "Проверить право заявителя, цель, наличие действующей аренды, основание обращения, компетенцию и текст отказа; отдельно исследовать статьи 39.16, 39.18, 39.20 и специальные режимы по фактам. Не обещать аренду без торгов.",
    "sources": [
      {
        "publisher": "КонсультантПлюс",
        "type": "LAW_TEXT",
        "url": "https://www.consultant.ru/document/cons_doc_LAW_33773/79da6e3bbbc8eb967db0714e8378269bfea9f83c/",
        "supports": "Общее положение статьи 39.6"
      },
      {
        "publisher": "ГАРАНТ",
        "type": "LAW_TEXT",
        "url": "https://base.garant.ru/12124624/4477709aee548021b043184dadbd377a/",
        "supports": "Общее положение статьи 39.6"
      },
      {
        "publisher": "СудАкт",
        "type": "LAW_TEXT",
        "url": "https://sudact.ru/law/zemelnyi-kodeks/glava-v.1/statia-39.6/?page=6",
        "supports": "Общее положение статьи 39.6"
      }
    ]
  },
  {
    "id": "land-redistribution-39.28",
    "asOf": "2026-11-27",
    "status": "CONTEXT_ONLY_NOT_DOCUMENT_READY",
    "appliesTo": [
      "land-status-use/land-redistribution"
    ],
    "proposition": "Статья 39.28 ЗК РФ определяет случаи и основания перераспределения частных земельных участков и публичной земли или участков.",
    "limitations": "Проверить принадлежность участков, проект межевания или схему, площадь, предельные размеры, ограничения и условия статьи 39.29; не обещать прирезку, бесплатность или отсутствие отказа. Учесть изменения 2026 года.",
    "sources": [
      {
        "publisher": "КонсультантПлюс",
        "type": "LAW_TEXT",
        "url": "https://www.consultant.ru/document/cons_doc_LAW_33773/546c7822b4daa11f0b168895ce17a69ed978b5c9/",
        "supports": "Общее положение статьи 39.28"
      },
      {
        "publisher": "ГАРАНТ",
        "type": "LAW_TEXT",
        "url": "https://base.garant.ru/483430145/e64b21ea59571b022b305c5af33eaa93/",
        "supports": "Общее положение статьи 39.28"
      },
      {
        "publisher": "СудАкт",
        "type": "LAW_TEXT",
        "url": "https://sudact.ru/law/zemelnyi-kodeks/glava-v.4/statia-39.28/?page=2",
        "supports": "Общее положение статьи 39.28"
      }
    ]
  },
  {
    "id": "land-agricultural-8",
    "asOf": "2026-11-27",
    "status": "CONTEXT_ONLY_NOT_DOCUMENT_READY",
    "appliesTo": [
      "land-status-use/agricultural-plot"
    ],
    "proposition": "Статья 8 закона № 101-ФЗ устанавливает специальное преимущественное право покупки сельскохозяйственного участка субъектом РФ или в установленных региональным законом случаях муниципальным образованием, с исключениями.",
    "limitations": "Установить применимость закона, категорию, вид сделки, участок или долю, региональное правило, наличие публичных торгов, предписания земельного надзора. Для сделок с долями отдельно проверить статью 12; не переносить правила обычной продажи доли автоматически.",
    "sources": [
      {
        "publisher": "КонсультантПлюс",
        "type": "LAW_TEXT",
        "url": "https://www.consultant.ru/document/cons_doc_LAW_37816/59a2ef022bd19494b0bc0e33c6414cbc3207a5ba/",
        "supports": "Общее положение статьи 8"
      },
      {
        "publisher": "ГАРАНТ",
        "type": "LAW_TEXT",
        "url": "https://base.garant.ru/12127542/31de5683116b8d79b08fa2d768e33df6/",
        "supports": "Общее положение статьи 8"
      },
      {
        "publisher": "СудАкт",
        "type": "LAW_TEXT",
        "url": "https://sudact.ru/law/federalnyi-zakon-ot-24072002-n-101-fz-ob/glava-ii/statia-8/",
        "supports": "Общее положение статьи 8"
      }
    ]
  },
  {
    "id": "land-withdrawal-49",
    "asOf": "2026-11-27",
    "status": "CONTEXT_ONLY_NOT_DOCUMENT_READY",
    "appliesTo": [
      "land-status-use/land-withdrawal"
    ],
    "proposition": "Статья 49 ЗК РФ устанавливает исключительные основания изъятия земельных участков для государственных или муниципальных нужд.",
    "limitations": "Различить изъятие для публичных нужд, резервирование, ограничение и изъятие по иным основаниям. Проверить акт, компетенцию, основания, даты, уведомления, оценку и процедуру главы VII.1 ЗК РФ. Не утверждать законность изъятия или размер возмещения автоматически.",
    "sources": [
      {
        "publisher": "КонсультантПлюс",
        "type": "LAW_TEXT",
        "url": "https://www.consultant.ru/document/cons_doc_LAW_33773/a2d44013e12a0ad5697ee11f08686b38a6587ed8/",
        "supports": "Общее положение статьи 49"
      },
      {
        "publisher": "ГАРАНТ",
        "type": "LAW_TEXT",
        "url": "https://base.garant.ru/12124624/07bdd21ab547687f72d1294bbd35ef3e/",
        "supports": "Общее положение статьи 49"
      },
      {
        "publisher": "СудАкт",
        "type": "LAW_TEXT",
        "url": "https://sudact.ru/law/zemelnyi-kodeks/glava-vii/statia-49_1/?page=1",
        "supports": "Общее положение статьи 49"
      }
    ]
  },
  {
    "id": "valuation-error-21",
    "asOf": "2026-11-27",
    "status": "CONTEXT_ONLY_NOT_DOCUMENT_READY",
    "appliesTo": [
      "cadastral-valuation/cadastral-value-check"
    ],
    "proposition": "Статья 21 закона № 237-ФЗ регулирует рассмотрение бюджетным учреждением заявлений об исправлении ошибок, допущенных при определении кадастровой стоимости.",
    "limitations": "Установить отчёт оценки, исходные характеристики, дату внесения стоимости и содержание возможной ошибки. Отличить ошибку оценки от ошибки ЕГРН и установления рыночной стоимости; проверить статью 20 для разъяснений и сроки на дату дела.",
    "sources": [
      {
        "publisher": "КонсультантПлюс",
        "type": "LAW_TEXT",
        "url": "https://www.consultant.ru/document/cons_doc_LAW_200504/88a489fde58bb11af446069f95e30d8622cbbd56/",
        "supports": "Общее положение статьи 21"
      },
      {
        "publisher": "ГАРАНТ",
        "type": "LAW_TEXT",
        "url": "https://base.garant.ru/71433956/b5dae26bebf2908c0e8dd3b8a66868fe/",
        "supports": "Общее положение статьи 21"
      },
      {
        "publisher": "СудАкт",
        "type": "LAW_TEXT",
        "url": "https://sudact.ru/law/federalnyi-zakon-ot-03072016-n-237-fz-o/",
        "supports": "Общее положение статьи 21"
      }
    ]
  },
  {
    "id": "valuation-market-22.1",
    "asOf": "2026-11-27",
    "status": "CONTEXT_ONLY_NOT_DOCUMENT_READY",
    "appliesTo": [
      "cadastral-valuation/cadastral-value-challenge"
    ],
    "proposition": "Статья 22.1 закона № 237-ФЗ регулирует установление кадастровой стоимости в размере рыночной по заявлению в бюджетное учреждение и требования к отчёту об оценке.",
    "limitations": "Проверить действующую или архивную стоимость, права заявителя, согласие собственника при применимости, даты и отчёт, предшествующее решение и региональный переходный порядок. Отдельно учесть постановление КС РФ от 14.07.2026 № 48-П: не применять прежнее ограничение сроков к архивной стоимости механически. Не гарантировать снижение.",
    "sources": [
      {
        "publisher": "КонсультантПлюс",
        "type": "LAW_TEXT",
        "url": "https://www.consultant.ru/document/cons_doc_LAW_200504/135e0b9c50769c66cfa8e7e5fb71b918a70702e4/",
        "supports": "Общее положение статьи 22.1"
      },
      {
        "publisher": "ГАРАНТ",
        "type": "LAW_TEXT",
        "url": "https://base.garant.ru/71433956/fb9a5d517b2b8a33a5b9aa3ee513ec85/",
        "supports": "Общее положение статьи 22.1"
      },
      {
        "publisher": "СудАкт",
        "type": "LAW_TEXT",
        "url": "https://sudact.ru/law/federalnyi-zakon-ot-03072016-n-237-fz-o/",
        "supports": "Общее положение статьи 22.1"
      }
    ]
  },
  {
    "id": "developer-bankruptcy-201.4",
    "asOf": "2026-11-27",
    "status": "CONTEXT_ONLY_NOT_DOCUMENT_READY",
    "appliesTo": [
      "newbuild-ddu/developer-bankruptcy"
    ],
    "proposition": "Статья 201.4 закона № 127-ФЗ устанавливает специальный порядок предъявления и рассмотрения требований участников строительства в деле о банкротстве застройщика, в том числе ведение реестра требований.",
    "limitations": "Проверить судебный акт о стадии банкротства, публикацию, дату уведомления, вид договора, оплату, реестр, эскроу и возможные меры Фонда развития территорий. Не вычислять срок или обещать включение в реестр без проверки конкретного дела.",
    "sources": [
      {
        "publisher": "КонсультантПлюс",
        "type": "LAW_TEXT",
        "url": "https://www.consultant.ru/document/cons_doc_LAW_39331/598c5dad9755936f4af45ac55ac31c2785f2d514/",
        "supports": "Общее положение статьи 201.4"
      },
      {
        "publisher": "ГАРАНТ",
        "type": "LAW_TEXT",
        "url": "https://base.garant.ru/185181/cfdbc071fd32e8ba57d5c52b1519cf6b/",
        "supports": "Общее положение статьи 201.4"
      },
      {
        "publisher": "СудАкт",
        "type": "LAW_TEXT",
        "url": "https://sudact.ru/law/federalnyi-zakon-ot-26102002-n-127-fz-o/glava-ix/ss-7/statia-201.4_1/?page=7",
        "supports": "Общее положение статьи 201.4"
      }
    ]
  },
  {
    "id": "property-lease-606",
    "asOf": "2026-11-27",
    "status": "CONTEXT_ONLY_NOT_DOCUMENT_READY",
    "appliesTo": [
      "property-litigation/property-lease-dispute"
    ],
    "proposition": "Статья 606 ГК РФ определяет договор аренды как предоставление имущества за плату во временное владение и пользование или пользование.",
    "limitations": "Проверить объект, договор, статус сторон, передачу, срок, оплату, регистрацию, характер нарушения и специальные нормы аренды земли и зданий. Отдельно определить применимые условия прекращения и возврата; не рассчитывать задолженность автоматически.",
    "sources": [
      {
        "publisher": "КонсультантПлюс",
        "type": "LAW_TEXT",
        "url": "https://www.consultant.ru/document/cons_doc_LAW_9027/8e256230160d28d197e580c7b426efaffbb4e140/",
        "supports": "Общее положение статьи 606"
      },
      {
        "publisher": "ГАРАНТ",
        "type": "LAW_TEXT",
        "url": "https://base.garant.ru/10164072/7569580fd338739c8c41fce45adf6d65/",
        "supports": "Общее положение статьи 606"
      },
      {
        "publisher": "СудАкт",
        "type": "LAW_TEXT",
        "url": "https://sudact.ru/law/gk-rf-chast2/razdel-iv/glava-34/ss-1_2/statia-606/",
        "supports": "Общее положение статьи 606"
      }
    ]
  },
  {
    "id": "civil-procedure-30",
    "asOf": "2026-11-27",
    "status": "CONTEXT_ONLY_NOT_DOCUMENT_READY",
    "appliesTo": [
      "property-litigation/civil-court-procedure"
    ],
    "proposition": "Статья 30 ГПК РФ устанавливает исключительную территориальную подсудность исков о правах на недвижимое имущество по месту его нахождения.",
    "limitations": "Сначала определить характер требования, компетенцию и вид производства (ГПК, АПК или КАС), затем применимость исключительной подсудности. Не считать каждый спор, связанный с недвижимостью, иском о праве на неё; проверить надлежащий суд, досудебный порядок, пошлину и сроки.",
    "sources": [
      {
        "publisher": "КонсультантПлюс",
        "type": "LAW_TEXT",
        "url": "https://www.consultant.ru/document/cons_doc_LAW_39570/2ce784f541d31b9de0e4e54a3339de7d5200e76d/",
        "supports": "Общее положение статьи 30"
      },
      {
        "publisher": "ГАРАНТ",
        "type": "LAW_TEXT",
        "url": "https://base.garant.ru/12128809/7d6bbe1829627ce93319dc72963759a2/",
        "supports": "Общее положение статьи 30"
      },
      {
        "publisher": "СудАкт",
        "type": "LAW_TEXT",
        "url": "https://sudact.ru/law/gpk-rf/razdel-i/glava-3_1/statia-30/",
        "supports": "Общее положение статьи 30"
      }
    ]
  },
  {
    "id": "registration-appeal-2026",
    "asOf": "2026-11-27",
    "status": "CONTEXT_ONLY_NOT_DOCUMENT_READY",
    "appliesTo": [
      "ownership-register/suspension-registration",
      "cadastral-valuation/cadastre-suspension"
    ],
    "proposition": "Части 12 и 12.1 статьи 29 и статья 31.2 закона № 218-ФЗ предусматривают с 01.01.2026 самостоятельный внесудебный способ оспаривания приостановления учёта или регистрации. Он не обязателен перед обращением в суд. Для комиссии закон отводит 15 рабочих дней, отсчитываемых от принятия решения о приостановлении; рассмотрение заявления — до 15 рабочих дней от его поступления.",
    "limitations": "Для решений до 01.01.2026 проверить прежний режим и переходные обстоятельства. Не применять срок комиссии к судебному обращению или окончательному отказу. Проверить полномочия заявителя по ч. 12.1 ст. 29, компетентную комиссию, производственный календарь, факт предыдущего рассмотрения и судебного обжалования: параллельное судебное обжалование препятствует рассмотрению комиссией, повторное заявление по уже рассмотренному решению не допускается. Удовлетворение жалобы означает отмену приостановления и повторное рассмотрение документов, а не гарантированную регистрацию.",
    "sources": [
      {
        "publisher": "КонсультантПлюс",
        "type": "LAW_TEXT",
        "url": "https://www.consultant.ru/document/cons_doc_LAW_182661/83295bf0f5e516b936afd4c1a22990e4e41c4d3d/",
        "supports": "Закон № 207-ФЗ, статья 1: введение главы 3.1 и изменение статьи 29 закона № 218-ФЗ; правила дополнительно сверены по действующей статье 31.2 в редакции от 04.08.2026"
      },
      {
        "publisher": "Меганорм",
        "type": "LAW_TEXT",
        "url": "https://meganorm.ru/mega_doc/dop_fire_update_01012026/0/kodeks_rossiyskoy_federatsii_ob_administrativnykh/7/federalnyy_zakon_ot_13_07_2015_N_218-fz_red_ot_28_12_2025_o.html",
        "supports": "Текст закона с 08.01.2026: статьи 29 и 31.2; независимая сверка процедурных положений"
      },
      {
        "publisher": "Национальная палата кадастровых инженеров",
        "type": "PROFESSIONAL_GUIDANCE",
        "url": "https://www.roscadastre.ru/news/4243643/",
        "supports": "Разъяснение от 15.01.2026 о необязательности комиссии, сроке подачи, видах комиссий и запрете повторной подачи"
      }
    ]
  }
] as const;

export function getRealEstateCheckedContext(groupId:string,situationId:string){
  const key=groupId+"/"+situationId;
  if(!getRealEstateSituation(groupId,situationId))return [];
  return REAL_ESTATE_CHECKED_CONTEXT.filter(item=>item.appliesTo.some(value=>value===key));
}

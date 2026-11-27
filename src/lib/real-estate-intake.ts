import { REAL_ESTATE_GROUPS, getRealEstateSituation } from "@/data/real-estate-route-plan";
import type { RealEstateSituation } from "@/data/real-estate-route-plan";

/**
 * Pure, local-only first-stage fact intake. No legal conclusions, persistence,
 * external calls or document generation. Answers must not be sent to a server.
 */
export type RealEstateField = Readonly<{
  key:string;label:string;kind:"choice"|"text"|"textarea"|"date";
  required:boolean;choices?:readonly string[];
}>;
export type RealEstateIntakeSpec = Readonly<{
  groupId:string;situationId:string;
  groupTitle:string;situationTitle:string;
  risk:RealEstateSituation["risk"];
  fields:readonly RealEstateField[];
  targetResult:RealEstateSituation["targetResult"];
  legalReviewRequired:true;
  canGenerateDocument:false;
}>;
export type RealEstateIntakeResult = Readonly<{
  status:"NEEDS_DETAILS"|"FACTS_COLLECTED"|"SPECIALIST_ROUTE";
  missing:readonly string[];
  invalid:readonly string[];
  manualReviewFlags:readonly string[];
  checklist:readonly string[];
  requiresLegalReview:true;
  canGenerateDocument:false;
  filingReady:false;
  documentText:null;
}>;
const roles=["собственник","покупатель","продавец","дольщик","арендатор","сосед","представитель","другое","не знаю"] as const;
const objects=["квартира","жилой дом","земельный участок","коммерческое помещение","строящийся объект","иное","не знаю"] as const;
const stages=["изучаю документы","обращение в орган","переговоры и претензия","получен отказ","судебное разбирательство","исполнение решения","не знаю"] as const;
const BASE_FIELDS:readonly RealEstateField[]=[
  {key:"role",label:"В каком качестве вы участвуете в ситуации?",kind:"choice",required:true,choices:roles},
  {key:"propertyType",label:"Какой объект недвижимости или земли затронут?",kind:"choice",required:true,choices:objects},
  {key:"stage",label:"На какой стадии находится вопрос или спор?",kind:"choice",required:true,choices:stages},
  {key:"summary",label:"Кратко опишите обстоятельства без фамилий, адресов и кадастровых номеров",kind:"textarea",required:true},
  {key:"eventDate",label:"Дата ключевого события, если известна",kind:"date",required:false},
  {key:"documents",label:"Какие документы и доказательства есть (без реквизитов)?",kind:"textarea",required:true},
  {key:"goal",label:"Какого результата вы хотите добиться?",kind:"textarea",required:true}
];
const registrationSuspensionFields:readonly RealEstateField[]=[
  {key:"registrationDecision",label:"Какие сведения есть о приостановлении учёта или регистрации?",kind:"choice",required:true,
    choices:["есть уведомление с основаниями","только статус без текста уведомления","документов нет или не знаю"]},
  {key:"registrationGround",label:"Указанный в уведомлении пункт статьи 26, если известен (без реквизитов и персональных данных)",kind:"text",required:false},
  {key:"correctionEvidence",label:"Представляли ли дополнительные документы для устранения причин?",kind:"choice",required:true,
    choices:["да, есть доказательства подачи","нет","не знаю"]},
  {key:"registrationDecisionDate",label:"Дата принятия решения о приостановлении (не дата получения уведомления), если известна",kind:"date",required:false},
  {key:"registrationReceivedDate",label:"Дата получения уведомления, если известна",kind:"date",required:false},
  {key:"suspensionAppealStage",label:"Обжаловалось ли именно это решение?",kind:"choice",required:true,
    choices:["не обжаловалось","подано в комиссию","комиссия уже рассмотрела","обжаловано в суд","не знаю"]}
];
const registrationRefusalFields:readonly RealEstateField[]=[
  {key:"registrationDecision",label:"Имеется ли письменное решение об отказе?",kind:"choice",required:true,
    choices:["есть решение с основаниями","только статус без текста решения","документов нет или не знаю"]},
  {key:"priorSuspension",label:"Было ли до отказа уведомление о приостановлении?",kind:"choice",required:true,
    choices:["есть уведомление, причины известны","не было или не получено","не знаю"]},
  {key:"correctionEvidence",label:"Представляли ли документы для устранения причин приостановления?",kind:"choice",required:true,
    choices:["да, есть доказательства подачи","нет","не знаю"]},
  {key:"registrationGround",label:"Указанный пункт статьи 26, если известен (без личных реквизитов)",kind:"text",required:false},
  {key:"registrationDecisionDate",label:"Дата отказа, если известна",kind:"date",required:false}
];
const specialFields:Readonly<Record<string,readonly RealEstateField[]>>={
  "land-status-use/land-permitted-use":[
    {key:"vriEvidence",label:"Есть ли выписка с действующим ВРИ?",kind:"choice",required:true,choices:["есть","нет или не знаю"]},
    {key:"vriGoal",label:"Что требуется изменить?",kind:"choice",required:true,choices:["основной вид","условный или вспомогательный вид","не знаю"]}
  ],
  "land-status-use/land-zone-limit":[
    {key:"zoneEvidence",label:"Есть ли документ о зоне и её границах?",kind:"choice",required:true,choices:["есть","нет или не знаю"]},
    {key:"zoneImpact",label:"Какое использование затрагивается?",kind:"choice",required:true,choices:["существующее","планируемое","не знаю"]}
  ],
  "land-status-use/public-land-lease":[
    {key:"leaseRoute",label:"Какой порядок предоставления предполагается?",kind:"choice",required:true,choices:["торги","без торгов","не знаю"]},
    {key:"leaseDecision",label:"Есть ли заявление и решение органа?",kind:"choice",required:true,choices:["есть","нет или не знаю"]}
  ],
  "land-status-use/land-redistribution":[
    {key:"redistributionLand",label:"Кому принадлежит присоединяемая земля?",kind:"choice",required:true,choices:["публичный собственник","частный собственник","не знаю"]},
    {key:"redistributionPlan",label:"Есть ли проект межевания или схема?",kind:"choice",required:true,choices:["есть","нет или не знаю"]}
  ],
  "land-status-use/agricultural-plot":[
    {key:"agriObject",label:"О какой сделке идёт речь?",kind:"choice",required:true,choices:["продажа участка","сделка с долей","иная или не знаю"]},
    {key:"agriOrder",label:"Есть ли предписание земельного надзора?",kind:"choice",required:true,choices:["есть","нет или не знаю"]}
  ],
  "land-status-use/land-withdrawal":[
    {key:"withdrawalKind",label:"Какой документ получен?",kind:"choice",required:true,choices:["решение об изъятии","уведомление или ограничение","иное или не знаю"]},
    {key:"withdrawalValue",label:"Есть ли оценка или проект соглашения?",kind:"choice",required:true,choices:["есть","нет или не знаю"]}
  ],
  "cadastral-valuation/cadastral-value-check":[
    {key:"valuationReport",label:"Получен ли отчёт или сведения об оценке?",kind:"choice",required:true,choices:["есть","нет или не знаю"]},
    {key:"valuationError",label:"В чём предполагаемая ошибка?",kind:"choice",required:true,choices:["исходные характеристики или расчёт","только несогласие с величиной","не знаю"]}
  ],
  "cadastral-valuation/cadastral-value-challenge":[
    {key:"valuationPeriod",label:"Оспаривается действующая или архивная стоимость?",kind:"choice",required:true,choices:["действующая","архивная","не знаю"]},
    {key:"marketReport",label:"Есть ли отчёт о рыночной стоимости?",kind:"choice",required:true,choices:["есть","нет или не знаю"]}
  ],
  "newbuild-ddu/developer-bankruptcy":[
    {key:"bankruptcyStage",label:"Есть ли судебный акт о стадии процедуры?",kind:"choice",required:true,choices:["есть","нет или не знаю"]},
    {key:"bankruptcyRegister",label:"Известен ли статус требования в реестре?",kind:"choice",required:true,choices:["включено","не включено","не знаю"]}
  ],
  "property-litigation/property-lease-dispute":[
    {key:"leaseDisputeKind",label:"Какой предмет спора?",kind:"choice",required:true,choices:["оплата или передача","прекращение или возврат","иной или не знаю"]},
    {key:"leaseContractEvidence",label:"Есть ли договор и документы исполнения?",kind:"choice",required:true,choices:["есть","нет или не знаю"]}
  ],
  "property-litigation/civil-court-procedure":[
    {key:"courtClaimKind",label:"Какой характер требования?",kind:"choice",required:true,choices:["спор о праве на объект","оспаривание решения органа","договорный или иной спор","не знаю"]},
    {key:"courtParties",label:"Кто участвует в споре?",kind:"choice",required:true,choices:["граждане","организации или предприниматели","публичный орган или не знаю"]}
  ],
  "ownership-register/ownership-transfer":[
    {key:"transferStage",label:"Что препятствует регистрации?",kind:"choice",required:true,choices:["уклонение стороны","решение регистратора","не установлено"]},
    {key:"transferEvidence",label:"Есть ли договор и документы об исполнении?",kind:"choice",required:true,choices:["есть документы","неполный комплект","не знаю"]}
  ],
  "property-transactions/prepurchase-check":[
    {key:"purchaseRegister",label:"Изучена ли актуальная выписка ЕГРН?",kind:"choice",required:true,choices:["да","нет или не знаю"]},
    {key:"purchaseRights",label:"Известны ли права третьих лиц?",kind:"choice",required:true,choices:["есть сведения","не установлены","не знаю"]}
  ],
  "property-transactions/seller-no-transfer":[
    {key:"saleContract",label:"Дата и обозначение договора (только обезличенные данные в тестовом режиме)",kind:"text",required:false},
    {key:"saleObject",label:"Описание объекта по договору (без адреса и кадастрового номера в тестовом режиме)",kind:"text",required:false},
    {key:"saleDueDate",label:"Согласованный срок исполнения",kind:"date",required:false},
    {key:"saleBreachConfirmed",label:"Подтверждаете, что согласованный срок истёк и обязанность не исполнена?",kind:"choice",required:false,choices:["да","нет или не знаю"]},
    {key:"handoverAct",label:"Подписан ли передаточный документ?",kind:"choice",required:true,choices:["да","нет","не знаю"]},
    {key:"handoverPossession",label:"Передан ли фактический доступ?",kind:"choice",required:true,choices:["да","нет","не знаю"]}
  ],
  "property-transactions/buyer-payment-delay":[
    {key:"saleContract",label:"Дата и обозначение договора (только обезличенные данные в тестовом режиме)",kind:"text",required:false},
    {key:"saleObject",label:"Описание объекта по договору (без адреса и кадастрового номера в тестовом режиме)",kind:"text",required:false},
    {key:"saleDueDate",label:"Согласованный срок исполнения",kind:"date",required:false},
    {key:"saleBreachConfirmed",label:"Подтверждаете, что согласованный срок истёк и обязанность не исполнена?",kind:"choice",required:false,choices:["да","нет или не знаю"]},
    {key:"saleTransferred",label:"Передан ли объект покупателю?",kind:"choice",required:false,choices:["да","нет или не знаю"]},
    {key:"saleDebt",label:"Подтверждённый остаток долга в рублях (число без пробелов)",kind:"text",required:false},
    {key:"paymentTerms",label:"Как предусмотрена оплата?",kind:"choice",required:true,choices:["единовременно","аванс или рассрочка","не знаю"]},
    {key:"paymentEvidence",label:"Есть ли подтверждение суммы и срока оплаты?",kind:"choice",required:true,choices:["есть документы","нет или не знаю"]}
  ],
  "property-transactions/hidden-encumbrance":[
    {key:"thirdRightKnown",label:"Было ли известно о праве третьего лица до сделки?",kind:"choice",required:true,choices:["да","нет","не знаю"]},
    {key:"thirdRightEvidence",label:"Есть ли документ о праве или притязании?",kind:"choice",required:true,choices:["есть","нет или не знаю"]}
  ],
  "property-transactions/preliminary-contract":[
    {key:"preliminaryEvidence",label:"Есть ли подписанный договор и условие о сроке?",kind:"choice",required:true,choices:["есть","частично","не знаю"]},
    {key:"mainOffer",label:"Направлялось ли предложение заключить основной договор?",kind:"choice",required:true,choices:["есть доказательство","нет или не знаю"]}
  ],
  "property-transactions/invalidate-property-deal":[
    {key:"invalidityBasis",label:"Указано ли конкретное предполагаемое основание недействительности?",kind:"choice",required:true,choices:["есть документы","только предположение","не знаю"]},
    {key:"invalidityStage",label:"Есть ли судебный акт по сделке?",kind:"choice",required:true,choices:["есть","нет","не знаю"]}
  ],
  "ownership-register/title-documents":[
    {key:"titleBasis",label:"Какое основание права предполагается?",kind:"choice",required:true,choices:["сделка или акт","наследство или решение суда","иное или неизвестно"]},
    {key:"titleEvidence",label:"Есть ли исходные правоустанавливающие документы?",kind:"choice",required:true,choices:["есть","частично","не знаю"]}
  ],
  "shared-ownership/share-registration":[
    {key:"shareBasis",label:"Как возникла доля?",kind:"choice",required:true,choices:["сделка","наследство или судебный акт","иное или неизвестно"]},
    {key:"shareRegistrationEvidence",label:"Есть ли документ об основании доли?",kind:"choice",required:true,choices:["есть","нет или не знаю"]}
  ],
  "ownership-register/encumbrance-record":[
    {key:"encumbranceBasis",label:"Есть ли документ-основание записи?",kind:"choice",required:true,choices:["есть","нет или не знаю"]},
    {key:"encumbranceKind",label:"Какого вида ограничение указано?",kind:"choice",required:true,choices:["ипотека или сервитут","арест или запрет","иное или неизвестно"]}
  ],
  "cadastral-valuation/object-no-record":[
    {key:"objectBasis",label:"Есть ли документы об объекте?",kind:"choice",required:true,choices:["есть","частично","не знаю"]},
    {key:"objectPlan",label:"Есть ли технический или межевой план?",kind:"choice",required:true,choices:["есть","нет или не знаю"]}
  ],
  "property-litigation/recognition-of-right":[
    {key:"recognitionBasis",label:"На каком основании заявляется право?",kind:"choice",required:true,choices:["документ или сделка","иное основание","не знаю"]},
    {key:"recognitionContest",label:"Оспаривает ли другое лицо право?",kind:"choice",required:true,choices:["да","нет или не знаю"]}
  ],
  "property-litigation/contested-register-right":[
    {key:"contestedRecord",label:"Есть ли актуальная запись и документ-основание?",kind:"choice",required:true,choices:["есть","частично","не знаю"]},
    {key:"contestedClaim",label:"Кто оспаривает право?",kind:"choice",required:true,choices:["участник сделки или правообладатель","другое лицо","не знаю"]}
  ],
  "property-litigation/property-recovery":[
    {key:"recoveryPossession",label:"Кто фактически владеет объектом?",kind:"choice",required:true,choices:["другое лицо","заявитель","не установлено"]},
    {key:"recoveryBasis",label:"Есть ли документы о праве и обстоятельствах выбытия?",kind:"choice",required:true,choices:["есть","нет или не знаю"]}
  ],
  "property-litigation/property-obstacle":[
    {key:"obstaclePossession",label:"Сохраняется ли фактическое владение?",kind:"choice",required:true,choices:["да","нет","не знаю"]},
    {key:"obstacleEvidence",label:"Есть ли доказательства препятствий?",kind:"choice",required:true,choices:["есть","нет или не знаю"]}
  ],
  "neighbors-servitudes/fence-dispute":[
    {key:"fenceCoordinates",label:"Есть ли координаты и измерения забора?",kind:"choice",required:true,choices:["есть","нет или не знаю"]},
    {key:"fenceObstacle",label:"В чём выражается нарушение?",kind:"choice",required:true,choices:["препятствия или спор о границе","иное или не знаю"]}
  ],
  "neighbors-servitudes/water-runoff":[
    {key:"runoffEvidence",label:"Есть ли акт осмотра или заключение?",kind:"choice",required:true,choices:["есть","нет или не знаю"]},
    {key:"runoffDamage",label:"Зафиксирован ли вред?",kind:"choice",required:true,choices:["есть документы","не зафиксирован или не знаю"]}
  ],
  "neighbors-servitudes/damage-neighbor-build":[
    {key:"damageEvidence",label:"Есть ли акт повреждений и оценка?",kind:"choice",required:true,choices:["есть","часть документов","не знаю"]},
    {key:"damageCause",label:"Есть ли заключение о причине повреждений?",kind:"choice",required:true,choices:["есть","нет или не знаю"]}
  ],
  "shared-ownership/use-arrangement":[
    {key:"useAgreement",label:"Есть ли соглашение или решение суда о пользовании?",kind:"choice",required:true,choices:["есть документ","нет или не знаю"]},
    {key:"useAccess",label:"Что известно о фактическом доступе?",kind:"choice",required:true,choices:["пользуемся совместно","есть препятствия","не знаю"]}
  ],
  "shared-ownership/shared-costs":[
    {key:"expenseKind",label:"Какого вида спорные расходы?",kind:"choice",required:true,choices:["содержание общего имущества","коммунальные услуги или личное потребление","иные или не знаю"]},
    {key:"expenseProof",label:"Есть ли документы об оплате и периодах?",kind:"choice",required:true,choices:["есть документы","часть документов","не знаю"]}
  ],
  "shared-ownership/share-division":[
    {key:"divisionEvidence",label:"Проверялась ли возможность выдела в натуре?",kind:"choice",required:true,choices:["есть заключение","нет заключения","не знаю"]},
    {key:"divisionAgreement",label:"Есть ли согласие участников?",kind:"choice",required:true,choices:["есть согласие","есть спор","не знаю"]}
  ],
  "shared-ownership/compensation-share":[
    {key:"compensationKind",label:"Какова цель компенсации?",kind:"choice",required:true,choices:["за пользование имуществом","вместо выдела или за прекращение доли","не знаю"]},
    {key:"compensationConsent",label:"Что известно о согласии собственника?",kind:"choice",required:true,choices:["есть согласие","согласия нет","не знаю"]}
  ],
  "build-renovation/house-notification":[
    {key:"buildKind",label:"Какой вид объекта планируется?",kind:"choice",required:true,choices:["жилой или садовый дом","иной объект","не знаю"]},
    {key:"buildNotice",label:"Что известно об уведомлении?",kind:"choice",required:true,choices:["есть ответ органа","направлено без ответа","не направлялось или не знаю"]}
  ],
  "build-renovation/reconstruction-docs":[
    {key:"buildKind",label:"Какой объект реконструируется?",kind:"choice",required:true,choices:["жилой или садовый дом","иной объект","не знаю"]},
    {key:"rebuildParams",label:"Что изменяется при работах?",kind:"choice",required:true,choices:["площадь или параметры объекта","характер работ не установлен","не знаю"]}
  ],
  "build-renovation/unauthorized-building":[
    {key:"buildLandRight",label:"Имеются ли документы о праве на землю?",kind:"choice",required:true,choices:["есть документы","нет документов или не знаю"]},
    {key:"buildRisk",label:"Что известно о нарушениях и безопасности?",kind:"choice",required:true,choices:["есть акт или заключение","только устные сведения","не знаю"]}
  ],
  "build-renovation/demolition-order":[
    {key:"demolitionAuthority",label:"Кем предъявлено требование?",kind:"choice",required:true,choices:["суд","орган власти","другое или не знаю"]},
    {key:"demolitionEvidence",label:"Есть ли текст требования и основание?",kind:"choice",required:true,choices:["есть письменный документ","нет документа или не знаю"]}
  ],
  "build-renovation/unfinished-property":[
    {key:"unfinishedLand",label:"Зарегистрировано ли право на землю?",kind:"choice",required:true,choices:["есть запись ЕГРН","нет записи","не знаю"]},
    {key:"unfinishedPlan",label:"Имеются ли технический план и документы о строительстве?",kind:"choice",required:true,choices:["есть документы","часть документов","не знаю"]}
  ],
  "land-boundaries/boundary-survey":[
    {key:"boundaryRecord",label:"Есть ли координаты границ в выписке ЕГРН?",kind:"choice",required:true,choices:["есть координаты","нет координат","не знаю"]},
    {key:"boundaryPlan",label:"Имеется ли межевой план или документы образования участка?",kind:"choice",required:true,choices:["есть документы","нет документов","не знаю"]}
  ],
  "land-boundaries/neighbor-boundary-dispute":[
    {key:"boundaryNotice",label:"Что известно об извещении смежного правообладателя?",kind:"choice",required:true,choices:["есть доказательства извещения","доказательств нет или не знаю"]},
    {key:"boundaryObjection",label:"Как зафиксированы возражения?",kind:"choice",required:true,choices:["письменные возражения","устные возражения","возражений нет или не знаю"]}
  ],
  "land-boundaries/boundary-overlap":[
    {key:"overlapEvidence",label:"Чем подтверждается пересечение?",kind:"choice",required:true,choices:["выписки и заключение инженера","только изображение карты","не знаю"]},
    {key:"overlapRights",label:"Затрагиваются ли права смежных владельцев?",kind:"choice",required:true,choices:["да","нет","не знаю"]}
  ],
  "land-boundaries/boundary-approval":[
    {key:"boundaryNotice",label:"Что известно об извещении заинтересованных лиц?",kind:"choice",required:true,choices:["есть доказательства извещения","доказательств нет или не знаю"]},
    {key:"boundaryObjection",label:"Как зафиксированы возражения?",kind:"choice",required:true,choices:["письменные возражения","устные возражения","возражений нет или не знаю"]},
    {key:"boundaryAct",label:"Есть ли акт согласования с приложениями?",kind:"choice",required:true,choices:["есть акт и приложения","только часть документов","не знаю"]}
  ],
  "land-boundaries/land-access":[
    {key:"accessAlternative",label:"Изучены ли альтернативные пути или способы доступа?",kind:"choice",required:true,choices:["есть иной доступ","альтернативы не найдены","не знаю"]},
    {key:"accessAgreement",label:"Что известно о действующем праве доступа и переговорах?",kind:"choice",required:true,choices:["есть соглашение или зарегистрированное право","соглашение не достигнуто","не знаю"]},
    {key:"burdenedLand",label:"Кому принадлежит участок, через который нужен доступ?",kind:"choice",required:true,choices:["частный собственник","государство или муниципалитет","не знаю"]}
  ],
  "neighbors-servitudes/blocked-drive":[
    {key:"accessAlternative",label:"Изучены ли альтернативные пути или способы доступа?",kind:"choice",required:true,choices:["есть иной доступ","альтернативы не найдены","не знаю"]},
    {key:"accessAgreement",label:"Что известно о действующем праве доступа и переговорах?",kind:"choice",required:true,choices:["есть соглашение или зарегистрированное право","соглашение не достигнуто","не знаю"]},
    {key:"burdenedLand",label:"Кому принадлежит участок, через который нужен доступ?",kind:"choice",required:true,choices:["частный собственник","государство или муниципалитет","не знаю"]}
  ],
  "neighbors-servitudes/servitude-agreement":[
    {key:"accessAlternative",label:"Изучены ли альтернативные пути или способы доступа?",kind:"choice",required:true,choices:["есть иной доступ","альтернативы не найдены","не знаю"]},
    {key:"accessAgreement",label:"Что известно о действующем праве доступа и переговорах?",kind:"choice",required:true,choices:["есть соглашение или зарегистрированное право","соглашение не достигнуто","не знаю"]},
    {key:"burdenedLand",label:"Кому принадлежит участок, через который нужен доступ?",kind:"choice",required:true,choices:["частный собственник","государство или муниципалитет","не знаю"]}
  ],
  "neighbors-servitudes/utilities-neighbor":[
    {key:"accessAlternative",label:"Изучены ли альтернативные пути или способы доступа?",kind:"choice",required:true,choices:["есть иной доступ","альтернативы не найдены","не знаю"]},
    {key:"accessAgreement",label:"Что известно о действующем праве доступа и переговорах?",kind:"choice",required:true,choices:["есть соглашение или зарегистрированное право","соглашение не достигнуто","не знаю"]},
    {key:"burdenedLand",label:"Кому принадлежит участок, через который нужен доступ?",kind:"choice",required:true,choices:["частный собственник","государство или муниципалитет","не знаю"]}
  ],
  "newbuild-ddu/ddu-signing":[
    {key:"dduDraft",label:"Имеется ли полный проект ДДУ с приложениями?",kind:"choice",required:true,choices:["есть полный проект","только часть документов","не знаю"]},
    {key:"dduObject",label:"Какой вид объекта указан в договоре?",kind:"choice",required:true,choices:["квартира или помещение","дом в малоэтажном комплексе","не знаю"]}
  ],
  "newbuild-ddu/area-mismatch":[
    {key:"areaEvidence",label:"Какие сведения о площади сопоставлялись?",kind:"choice",required:true,choices:["договор и документ об измерении","только устные сведения","не знаю"]},
    {key:"areaPriceTerms",label:"Что известно об условиях изменения цены при расхождении площади?",kind:"choice",required:true,choices:["условия есть","условия не найдены","не знаю"]}
  ],
  "newbuild-ddu/developer-delay":[
    {key:"dduAmendment",label:"Есть ли подписанное соглашение об изменении срока передачи?",kind:"choice",required:true,choices:["есть подписанное соглашение","только уведомление или предложения","нет или не знаю"]},
    {key:"dduTransfer",label:"Передан ли объект?",kind:"choice",required:true,choices:["передан по акту","не передан","есть спор об акте или не знаю"]},
    {key:"contractTransferDate",label:"Договорная дата передачи, если известна",kind:"date",required:false},
    {key:"actualTransferDate",label:"Фактическая дата передачи, если известна",kind:"date",required:false}
  ],
  "newbuild-ddu/quality-defects":[
    {key:"defectEvidence",label:"Как зафиксированы недостатки?",kind:"choice",required:true,choices:["акт или письменное заключение","только фото или устное описание","не знаю"]},
    {key:"defectStage",label:"На какой стадии выявлены недостатки?",kind:"choice",required:true,choices:["до подписания акта","после передачи","не знаю"]}
  ],
  "newbuild-ddu/act-acceptance-dispute":[
    {key:"acceptanceNotice",label:"Есть ли подтверждение получения уведомления о готовности?",kind:"choice",required:true,choices:["есть подтверждение","нет подтверждения или не знаю"]},
    {key:"acceptanceAct",label:"Что известно о передаточном акте?",kind:"choice",required:true,choices:["двусторонний акт","односторонний акт","акт не подписан","не знаю"]}
  ],
  "ownership-register/suspension-registration":registrationSuspensionFields,
  "cadastral-valuation/cadastre-suspension":registrationSuspensionFields,
  "ownership-register/registration-refusal":registrationRefusalFields,
  "build-renovation/building-register-refusal":registrationRefusalFields,
  "shared-ownership/share-sale":[
    {key:"transactionKind",label:"Что известно о характере сделки с долей?",kind:"choice",required:true,
      choices:["продажа постороннему лицу","продажа другому сособственнику","публичные торги","мена","другое или не знаю"]},
    {key:"shareNotice",label:"Направлялось ли письменное извещение остальным сособственникам?",kind:"choice",required:true,
      choices:["направлено, есть доказательства","извещение не направлялось","не знаю"]},
    {key:"specialLandStatus",label:"Есть ли особый режим объекта или земли?",kind:"choice",required:true,
      choices:["обычная недвижимость","земля сельскохозяйственного назначения","доля в общем имуществе","не знаю"]},
    {key:"noticeEventDate",label:"Дата документально подтверждённого извещения, если известна",kind:"date",required:false}
  ],
  "ownership-register/record-inaccurate":[
    {key:"registryErrorOrigin",label:"Где впервые обнаружено расхождение сведений?",kind:"choice",required:true,
      choices:["только запись ЕГРН","исходный документ или технический план","не установлено"]},
    {key:"thirdPartyRights",label:"Может ли исправление затронуть права других лиц?",kind:"choice",required:true,
      choices:["да","нет","не знаю"]}
  ],
  "land-boundaries/registry-boundary-error":[
    {key:"registryErrorOrigin",label:"Где впервые обнаружено расхождение сведений?",kind:"choice",required:true,
      choices:["только запись ЕГРН","исходный документ или межевой план","не установлено"]},
    {key:"thirdPartyRights",label:"Может ли исправление затронуть права других лиц?",kind:"choice",required:true,
      choices:["да","нет","не знаю"]}
  ],
  "cadastral-valuation/wrong-object-area":[
    {key:"registryErrorOrigin",label:"Какие документы подтверждают площадь?",kind:"choice",required:true,
      choices:["исходный документ отличается от ЕГРН","расхождение уже в техническом плане","не установлено"]},
    {key:"thirdPartyRights",label:"Может ли исправление затронуть права других лиц?",kind:"choice",required:true,
      choices:["да","нет","не знаю"]}
  ]
};
function manualReviewFlags(groupId:string,situationId:string,values:Readonly<Record<string,string|undefined>>):string[]{
  const result:string[]=[];
  if(groupId==="shared-ownership"&&situationId==="share-sale"){
    if(["публичные торги","другое или не знаю"].includes(values.transactionKind??""))
      result.push("Продажа с публичных торгов или неустановленный вид сделки: требуется индивидуальная проверка применимого режима и решений Конституционного Суда.");
    if(values.specialLandStatus==="земля сельскохозяйственного назначения")
      result.push("Земля сельскохозяйственного назначения: проверить специальные правила оборота и преимущественной покупки.");
    if(values.specialLandStatus==="доля в общем имуществе")
      result.push("Доля в общем имуществе: проверить применимость исключений статьи 250 ГК РФ.");
    if(["извещение не направлялось","не знаю"].includes(values.shareNotice??""))
      result.push("Не подтверждено извещение сособственников: проверить документы о направлении и вручении.");
  }
  if(["ownership-register/suspension-registration","cadastral-valuation/cadastre-suspension",
      "ownership-register/registration-refusal","build-renovation/building-register-refusal"].includes(groupId+"/"+situationId)){
    if(values.registrationDecision!=="есть уведомление с основаниями"
       && values.registrationDecision!=="есть решение с основаниями")
      result.push("Точный текст уведомления или решения отсутствует: нельзя проверить пункт статьи 26 или условия статьи 27 по одному статусу в кабинете.");
    if(values.priorSuspension==="не было или не получено"||values.priorSuspension==="не знаю")
      result.push("Не установлено предыдущее приостановление и его основания: необходимо проверить всю последовательность регистрационного производства.");
    if(values.correctionEvidence==="нет"||values.correctionEvidence==="не знаю")
      result.push("Не подтверждена подача документов для устранения причин: проверить историю обращений и сроки по конкретному делу.");
    if(!values.registrationGround?.trim())
      result.push("Не указан конкретный пункт статьи 26 закона № 218-ФЗ: правовое основание требует проверки по уведомлению.");
  }
  if(["ownership-register/suspension-registration","cadastral-valuation/cadastre-suspension"].includes(groupId+"/"+situationId)){
    const decisionDate=values.registrationDecisionDate;
    if(!decisionDate||!isValidDate(decisionDate))
      result.push("Установить дату принятия решения: без неё нельзя выбрать редакцию порядка обжалования или проверить срок обращения в комиссию.");
    else if(decisionDate<"2026-01-01")
      result.push("Решение принято до 01.01.2026: проверить прежний порядок и переходные правила; новый режим статьи 31.2 автоматически не применяется.");
    else {
      result.push("Для решений нового периода сверить статью 31.2 закона № 218-ФЗ: 15 рабочих дней для обращения в комиссию отсчитываются от принятия решения, а не от получения уведомления. Комиссия не является обязательной перед судом. Конкретный срок не рассчитан.");
      if(values.suspensionAppealStage==="обжаловано в суд")result.push("Судебное обжалование препятствует рассмотрению того же решения комиссией; не направлять параллельную жалобу автоматически.");
      if(values.suspensionAppealStage==="комиссия уже рассмотрела")result.push("Повторная подача в комиссию по уже рассмотренному решению не допускается.");
    }
  }
  if(groupId==="newbuild-ddu"){
    if(situationId==="ddu-signing"&&(values.dduDraft!=="есть полный проект"||values.dduObject!=="квартира или помещение"))
      result.push("Проверить полный проект ДДУ и применимость специальных условий для конкретного вида объекта.");
    if(situationId==="area-mismatch")
      result.push("Сопоставить документы об измерениях, условия цены и статью 5 закона № 214-ФЗ; автоматический расчёт не выполняется.");
    if(situationId==="developer-delay"){
      if(values.dduAmendment!=="есть подписанное соглашение")result.push("Установить договорный срок и проверить действительность его изменения.");
      result.push("До расчёта неустойки проверить специальные временные правила и периоды начисления.");
    }
    if(situationId==="quality-defects")result.push("Проверить фиксацию недостатков, дату выявления, гарантийные условия и специальные правила приёмки.");
    if(situationId==="act-acceptance-dispute")result.push("Проверить уведомление, осмотр и условия составления акта; не рекомендовать автоматически отказ от подписания.");
  }
  if(groupId==="land-boundaries"){
    if(situationId==="boundary-survey")result.push("Сопоставить координаты ЕГРН и исходные документы с межевым планом; проверить необходимость согласования.");
    if(situationId==="boundary-overlap")result.push("Пересечение на карте не доказывает реестровую ошибку: необходима проверка координат, исходных документов и прав смежных владельцев.");
    if(situationId==="neighbor-boundary-dispute"||situationId==="boundary-approval"){
      if(values.boundaryNotice!=="есть доказательства извещения")result.push("Не подтверждено надлежащее извещение: отсутствие ответа или подписи не означает автоматически согласие.");
      result.push("Проверить акт согласования, письменные возражения и приложения по статьям 39 и 40 закона № 221-ФЗ.");
    }
  }
  if((groupId==="land-boundaries"&&situationId==="land-access")||(groupId==="neighbors-servitudes"&&["blocked-drive","servitude-agreement","utilities-neighbor"].includes(situationId))){
    result.push("Проверить необходимость частного сервитута и альтернативный доступ по статье 274 ГК РФ; автоматически право доступа не устанавливается.");
    if(values.burdenedLand!=="частный собственник")result.push("Проверить собственника участка и специальные правила публичной земли.");
  }
  if(groupId==="build-renovation"){
    if(situationId==="house-notification"||situationId==="reconstruction-docs")result.push("Проверить применимость уведомительного порядка и специальной регистрации по части 12 статьи 70 закона № 218-ФЗ; не считать один режим универсальным.");
    if(situationId==="unauthorized-building"||situationId==="demolition-order")result.push("Проверить признаки самовольной постройки, даты, компетенцию и возможность приведения в соответствие по статье 222 ГК РФ; автоматически снос или признание права не утверждаются.");
    if(situationId==="unfinished-property")result.push("Проверить право на землю, состояние объекта, документы и исключения статьи 40 закона № 218-ФЗ.");
  }
  if(groupId==="shared-ownership"){
    if(situationId==="use-arrangement")result.push("Проверить соглашение и фактическое пользование по статье 247 ГК РФ.");
    if(situationId==="shared-costs")result.push("Разделить содержание общего имущества и личное потребление; проверить документы, периоды и специальный правовой режим по статье 249 ГК РФ.");
    if(situationId==="share-division"||situationId==="compensation-share")result.push("Проверить возможность выдела, согласие и существенный интерес; принудительная компенсация по статье 252 ГК РФ не определяется автоматически.");
    if(situationId==="compensation-share")result.push("Разграничить компенсацию за пользование по статье 247 и компенсацию вместо выдела по статье 252 ГК РФ.");
  }
  const transactionChecks:Readonly<Record<string,string>>={
    "land-status-use/land-permitted-use":"Проверить дату установления ВРИ, категорию, регламент использования территории, действующие ограничения, вид права и переходные положения закона № 295-ФЗ от 31.07.2025. Для изменения отдельно исследовать статьи 14.2–14.4 ЗК РФ и применимые местные правила. Не применять автоматически прежний порядок до 01.03.2026.",
    "land-status-use/land-zone-limit":"Установить точный вид зоны, акт, дату, карту границ и применимые переходные положения; отдельно проверить последствия для конкретного использования, возможное обжалование и компенсацию.",
    "land-status-use/public-land-lease":"Проверить право заявителя, цель, наличие действующей аренды, основание обращения, компетенцию и текст отказа; отдельно исследовать статьи 39.16, 39.18, 39.20 и специальные режимы по фактам. Не обещать аренду без торгов.",
    "land-status-use/land-redistribution":"Проверить принадлежность участков, проект межевания или схему, площадь, предельные размеры, ограничения и условия статьи 39.29; не обещать прирезку, бесплатность или отсутствие отказа. Учесть изменения 2026 года.",
    "land-status-use/agricultural-plot":"Установить применимость закона, категорию, вид сделки, участок или долю, региональное правило, наличие публичных торгов, предписания земельного надзора. Для сделок с долями отдельно проверить статью 12; не переносить правила обычной продажи доли автоматически.",
    "land-status-use/land-withdrawal":"Различить изъятие для публичных нужд, резервирование, ограничение и изъятие по иным основаниям. Проверить акт, компетенцию, основания, даты, уведомления, оценку и процедуру главы VII.1 ЗК РФ. Не утверждать законность изъятия или размер возмещения автоматически.",
    "cadastral-valuation/cadastral-value-check":"Установить отчёт оценки, исходные характеристики, дату внесения стоимости и содержание возможной ошибки. Отличить ошибку оценки от ошибки ЕГРН и установления рыночной стоимости; проверить статью 20 для разъяснений и сроки на дату дела.",
    "cadastral-valuation/cadastral-value-challenge":"Проверить действующую или архивную стоимость, права заявителя, согласие собственника при применимости, даты и отчёт, предшествующее решение и региональный переходный порядок. Отдельно учесть постановление КС РФ от 14.07.2026 № 48-П: не применять прежнее ограничение сроков к архивной стоимости механически. Не гарантировать снижение.",
    "newbuild-ddu/developer-bankruptcy":"Проверить судебный акт о стадии банкротства, публикацию, дату уведомления, вид договора, оплату, реестр, эскроу и возможные меры Фонда развития территорий. Не вычислять срок или обещать включение в реестр без проверки конкретного дела.",
    "property-litigation/property-lease-dispute":"Проверить объект, договор, статус сторон, передачу, срок, оплату, регистрацию, характер нарушения и специальные нормы аренды земли и зданий. Отдельно определить применимые условия прекращения и возврата; не рассчитывать задолженность автоматически.",
    "property-litigation/civil-court-procedure":"Сначала определить характер требования, компетенцию и вид производства (ГПК, АПК или КАС), затем применимость исключительной подсудности. Не считать каждый спор, связанный с недвижимостью, иском о праве на неё; проверить надлежащий суд, досудебный порядок, пошлину и сроки.",
  "ownership-register/ownership-transfer": "Проверить заключённость договора, исполнение, права продавца, причину отсутствия записи и документы регистратора. Уклонение стороны не равно отказу Росреестра; не выбирать способ защиты автоматически.",
  "property-transactions/prepurchase-check": "Проверить заключённость договора, исполнение, права продавца, причину отсутствия записи и документы регистратора. Уклонение стороны не равно отказу Росреестра; не выбирать способ защиты автоматически. Проверить вид права или притязания, момент его возникновения, осведомлённость покупателя, договор, ЕГРН и применимость специальных норм. Отсутствие записи не гарантирует отсутствия прав третьих лиц.",
  "property-transactions/seller-no-transfer": "Проверить фактическую передачу, условия договора, ключи, акт, уведомления и поведение сторон. Отделить передачу от регистрации перехода права.",
  "property-transactions/buyer-payment-delay": "Проверить договорные сроки, аванс, кредит, рассрочку, фактическое исполнение и специальные условия. Не рассчитывать проценты или выбирать расторжение автоматически.",
  "property-transactions/hidden-encumbrance": "Проверить вид права или притязания, момент его возникновения, осведомлённость покупателя, договор, ЕГРН и применимость специальных норм. Отсутствие записи не гарантирует отсутствия прав третьих лиц.",
  "property-transactions/preliminary-contract": "Проверить квалификацию договора, предмет, форму, сроки, предложение заключить основной договор и доказательства его отправки. Не квалифицировать любой аванс как задаток; не вычислять срок автоматически.",
  "property-transactions/invalidate-property-deal": "Сначала установить конкретное основание недействительности, применимую редакцию, круг лиц и сроки; проверить статьи 166–181, права третьих лиц и судебные разъяснения. Не считать сделку недействительной из одного описания и не обещать реституцию.",
  "ownership-register/encumbrance-record": "Установить запись, документ-основание, лицо, чьи права затронуты, и характер спора. Не считать спор о праве технической ошибкой; отдельно проверить способ защиты и надлежащих участников.",
  "property-litigation/contested-register-right": "Установить запись, документ-основание, лицо, чьи права затронуты, и характер спора. Не считать спор о праве технической ошибкой; отдельно проверить способ защиты и надлежащих участников.",
  "ownership-register/title-documents": "Проверить конкретное основание права, комплект документов, вид объекта, необходимость отдельного учёта и специальные требования. Для признания права судебный акт является возможным регистрационным основанием, а не самостоятельным материальным основанием удовлетворения иска.",
  "shared-ownership/share-registration": "Проверить конкретное основание права, комплект документов, вид объекта, необходимость отдельного учёта и специальные требования. Для признания права судебный акт является возможным регистрационным основанием, а не самостоятельным материальным основанием удовлетворения иска.",
  "cadastral-valuation/object-no-record": "Проверить конкретное основание права, комплект документов, вид объекта, необходимость отдельного учёта и специальные требования. Для признания права судебный акт является возможным регистрационным основанием, а не самостоятельным материальным основанием удовлетворения иска.",
  "property-litigation/recognition-of-right": "Проверить конкретное основание права, комплект документов, вид объекта, необходимость отдельного учёта и специальные требования. Для признания права судебный акт является возможным регистрационным основанием, а не самостоятельным материальным основанием удовлетворения иска.",
  "property-litigation/property-recovery": "Установить право истца, фактического владельца, основания владения и выбытия, добросовестность, условия статьи 302 и сроки. Не смешивать с договорным возвратом и устранением препятствий.",
  "property-litigation/property-obstacle": "Проверить право, сохранение владения, конкретные нарушения и доказательства связи с действиями другого лица. Для забора и стока установить границы, фактические обстоятельства и технические нормы; не определять автоматически перенос забора или обязанность устранить сток.",
  "neighbors-servitudes/fence-dispute": "Проверить право, сохранение владения, конкретные нарушения и доказательства связи с действиями другого лица. Для забора и стока установить границы, фактические обстоятельства и технические нормы; не определять автоматически перенос забора или обязанность устранить сток.",
  "neighbors-servitudes/water-runoff": "Проверить право, сохранение владения, конкретные нарушения и доказательства связи с действиями другого лица. Для забора и стока установить границы, фактические обстоятельства и технические нормы; не определять автоматически перенос забора или обязанность устранить сток. Проверить наличие и размер вреда, причинную связь, действия причинителя, вину и специальные режимы ответственности. Не рассчитывать возмещение по одной анкете; необходимы акты и доказательства.",
  "neighbors-servitudes/damage-neighbor-build": "Проверить наличие и размер вреда, причинную связь, действия причинителя, вину и специальные режимы ответственности. Не рассчитывать возмещение по одной анкете; необходимы акты и доказательства."
};
  const transactionCheck=transactionChecks[groupId+"/"+situationId];
  if(transactionCheck)result.push(transactionCheck);
  if(values.registryErrorOrigin==="не установлено"||values.thirdPartyRights==="не знаю")
    result.push("Нельзя определить порядок исправления записи ЕГРН без первичных документов и проверки прав других лиц.");
  if(values.thirdPartyRights==="да")
    result.push("Возможное затрагивание прав третьих лиц требует отдельной проверки допустимого способа исправления.");
  return result;
}
function isValidDate(v:string){
  if(!/^\d{4}-\d{2}-\d{2}$/.test(v))return false;
  const [y,m,d]=v.split("-").map(Number);
  const parsed=new Date(Date.UTC(y,m-1,d));
  return y>=1900&&y<=2100&&parsed.getUTCFullYear()===y&&parsed.getUTCMonth()===m-1&&parsed.getUTCDate()===d;
}
export function getRealEstateIntakeSpec(groupId:string,situationId:string):RealEstateIntakeSpec|null{
  const group=REAL_ESTATE_GROUPS.find(x=>x.id===groupId);
  const situation=getRealEstateSituation(groupId,situationId);
  if(!group||!situation)return null;
  return {
    groupId,situationId,groupTitle:group.title,situationTitle:situation.title,
    risk:situation.risk,targetResult:situation.targetResult,
    fields:[...BASE_FIELDS,{
      key:"caseDetails",label:"Дополнительные сведения по ситуации: "+situation.caseFacts,
      kind:"textarea",required:true
    },...(specialFields[groupId+"/"+situationId]??[])],
    legalReviewRequired:true,canGenerateDocument:false
  };
}
export function evaluateRealEstateIntake(
  spec:RealEstateIntakeSpec,values:Readonly<Record<string,string|undefined>>
):RealEstateIntakeResult{
  const missing:string[]=[],invalid:string[]=[];
  for(const field of spec.fields){
    const value=(values[field.key]??"").trim();
    if(!value){if(field.required)missing.push(field.key);continue;}
    if(value.length>(field.kind==="text"?250:3000) ||
      (field.kind==="choice" && !field.choices?.includes(value)) ||
      (field.kind==="date" && !isValidDate(value)))invalid.push(field.key);
  }
  const reviewFlags=manualReviewFlags(spec.groupId,spec.situationId,values);
  const status=missing.length||invalid.length?"NEEDS_DETAILS":
    spec.targetResult==="SPECIALIST_REFERRAL"||spec.targetResult==="CROSS_LINK"?
      "SPECIALIST_ROUTE":"FACTS_COLLECTED";
  return {
    status,missing,invalid,manualReviewFlags:reviewFlags,
    checklist:[
      "Сопоставить сведения с исходными документами об объекте и праве.",
      "Установить дату события, участников, возможные сроки и компетентный орган.",
      "Проверить точную норму в действующей редакции и исключения по трём независимым источникам.",
      "Не считать предварительную анкету юридическим заключением или готовым документом."
    ],
    requiresLegalReview:true,canGenerateDocument:false,
    filingReady:false,documentText:null
  };
}

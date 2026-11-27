/** Official-form links and data preparation. This is not a reproduction of
 * the complete statutory blank and cannot be submitted as that blank. */
const technicalSources=["https://www.consultant.ru/document/cons_doc_LAW_362285/f958948419d9f86a80525cc6f28f79d64be67853/","https://base.garant.ru/74637120/f7ee959fd36b5699076b35abf4f52c5c/","https://www.kontur-extern.ru/info/normativ/document/44/53939-forma-zayavleniya-ob-ispravlenii-tekhnicheskoy-oshibki-v-zapisyakh-edinogo"];
const appealSources=["https://klerk.systems/docs/prikaz_p-0237-25_2025-07-01/article/app_3/","https://sudact.ru/law/prikaz-rosreestra-ot-01072025-n-p023725-ob/","https://www.roscadastre.ru/docs/4243645/"];
const technicalKeys=["ownership-register/record-inaccurate","land-boundaries/registry-boundary-error","cadastral-valuation/wrong-object-area"];
const appealKeys=["ownership-register/suspension-registration","cadastral-valuation/cadastre-suspension"];
export function getRealEstateFormGuidance(group:string,scenario:string){
  const key=group+"/"+scenario;
  if(technicalKeys.includes(key))return {kind:"technical" as const, title:"Приказ Росреестра № П/0310 от 19.08.2020, приложение № 2 (ред. от 07.04.2026)",url:technicalSources[0],sources:technicalSources};
  if(appealKeys.includes(key))return {kind:"appeal" as const,title:"Приказ Росреестра № П/0237/25 от 01.07.2025, приложение № 3 (с 01.01.2026)",url:appealSources[0],sources:appealSources};
  return null;
}
export function renderRealEstateFormPreparation(group:string,scenario:string,data:Readonly<Record<string,string>>,createdAt:string):readonly string[]{
  const form=getRealEstateFormGuidance(group,scenario);
  if(!form)return [];
  const base=["ПРОЕКТ — НЕ ГОТОВ К ПОДАЧЕ","","Сведения для заполнения установленной формы",form.title,"Бланк: "+form.url,"Этот лист не заменяет утверждённую форму; перенос сведений, проверка её обязательных реквизитов и подписание выполняются отдельно.",""];
  if(form.kind==="technical"){
    const isTechnical=["только запись ЕГРН","исходный документ отличается от ЕГРН"].includes(data.registryErrorOrigin);
    if(!isTechnical||data.thirdPartyRights!=="нет"||data.errorConfirmed!=="да"){
      return [...base,"По ответам не подтверждены одновременно техническая ошибка регистратора и отсутствие последствий для прав других лиц.","Не заполняйте пункт 3.2 как установленный способ исправления. Сопоставьте ЕГРН и исходные документы, определите реестровую ошибку либо спор о праве и применимую процедуру, включая необходимость межевого или технического плана и судебного акта.",data.summary,data.caseDetails,"Имеющиеся документы: "+data.documents];
    }
    const registry=data.errorRegister;
    const complete=["кадастр недвижимости","реестр прав"].includes(registry)&&!!data.errorObjectType&&!!data.errorObjectNumber&&!!data.errorWrong&&!!data.errorCorrect&&!!data.errorBasis&&!!data.errorApplicant&&!!data.errorChannel&&!!data.errorDelivery&&(registry!=="реестр прав"||!!data.errorRightEntry);
    if(!complete)return [...base,"Для переноса в пункт 3.2 дополните вид и номер объекта, вид записи, неверные и правильные сведения, документ-основание, данные заявителя, способы подачи и получения результата. Для записи о праве необходимы её дата и номер.",data.summary,data.caseDetails,"Имеющиеся документы: "+data.documents];
    return [...base,"3.1. Вид объекта: "+data.errorObjectType+"; кадастровый номер: "+data.errorObjectNumber,
      (registry==="реестр прав"?"3.2.2. Сведения реестра прав; дата и номер записи: "+data.errorRightEntry:"3.2.1. Сведения кадастра недвижимости"),
      "Внесённые сведения: "+data.errorWrong,"Правильные сведения: "+data.errorCorrect,"Документ, подтверждающий правильные сведения: "+data.errorBasis,
      "4. Способ подачи: "+data.errorChannel,"5. Способ получения документов: "+data.errorDelivery,"Сведения о заявителе для соответствующих реквизитов формы: "+data.errorApplicant,"Приложения: "+data.documents,
      "Остальные применимые реквизиты формы (личность, полномочия, контакты, подпись, выбор согласий) заполнить в самом бланке. Не отмечать согласия автоматически."];
  }
  const eligible=data.registrationDecision==="есть уведомление с основаниями"&&data.registrationDecisionDate>="2026-01-01"&&data.registrationDecisionDate<=createdAt.slice(0,10)&&data.suspensionAppealStage==="не обжаловалось"&&data.commissionEligible==="да";
  if(!eligible)return [...base,"Не подтверждена допустимость обращения в апелляционную комиссию. Проверьте дату решения, полномочия заявителя, срок 15 рабочих дней с даты решения, компетенцию комиссии, отсутствие предыдущего рассмотрения или судебного обжалования и применимую редакцию закона. Комиссия не является обязательной перед судом.",data.summary,data.caseDetails,"Имеющиеся документы: "+data.documents];
  const required=["commissionName","commissionChair","commissionApplicant","commissionPost","commissionEmail","commissionPhone","commissionAction","commissionOrgan","commissionNotice","commissionApplication","commissionEngineer","commissionReasons"];
  if(required.some(key=>!data[key]?.trim()))return [...base,"Дополните сведения председателя и комиссии, заявителя, его адрес и контакты, вид приостановленного действия, орган, уведомление, исходное заявление, сведения инженера при применимости и основания несоответствия решению закона.",data.summary,data.caseDetails,"Имеющиеся документы: "+data.documents];
  return [...base,"Председателю: "+data.commissionName+"; "+data.commissionChair,"От: "+data.commissionApplicant,"Почтовый адрес: "+data.commissionPost,"Адрес электронной почты: "+data.commissionEmail,"Контактный телефон: "+data.commissionPhone,"",
    "Вид приостановленного действия: "+data.commissionAction,"Орган регистрации прав: "+data.commissionOrgan,"Дата решения: "+data.registrationDecisionDate,"Уведомление (дата и номер): "+data.commissionNotice,"Исходное заявление (дата и номер): "+data.commissionApplication,"Кадастровый документ и инженер, если применимо: "+data.commissionEngineer,
    "Обоснование несоответствия решения нормам Федерального закона № 218-ФЗ: "+data.commissionReasons,"Приложения (наименование, листы, экземпляры): "+data.documents,"Перенесите сведения в приложение № 3; проверьте полномочия, остальные применимые реквизиты, форму подачи и подпись. Не направляйте этот лист вместо заявления."];
}

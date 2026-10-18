import type { FamilyLaborPlan } from "@/data/family-labor-route-expansion";
import { getFamilyLaborGuidance } from "@/lib/family-labor-route-guidance";

/**
 * A small, allowlisted set of deterministic *unapproved* document drafts.
 * A verified statutory description is NOT a legal review of an individual case.
 * No model calls, network calls, guessed courts, fees, amounts or filing claims.
 */
export type ProvisionalDraft = {
  title: string;
  text: string;
  ruleIds: string[];
  placeholders: string[];
  references: Array<{ id: string; act: string; provision: string; sourceUrl: string }>;
};

const GPK_URL = "https://pravo.gov.ru/proxy/ips/?docbody=&nd=102078828";
const TK_URL = "https://pravo.gov.ru/proxy/ips/?docbody=&link_id=0&nd=102074279&intelsearch=&firstDoc=1";
const registry = {
  "gpk-128": { id:"gpk-128",act:"ГПК РФ",provision:"статья 128",sourceUrl:GPK_URL },
  "gpk-129": { id:"gpk-129",act:"ГПК РФ",provision:"статья 129",sourceUrl:GPK_URL },
  "tk-64": { id:"tk-64",act:"ТК РФ",provision:"статья 64",sourceUrl:TK_URL },
  "tk-93": { id:"tk-93",act:"ТК РФ",provision:"статья 93",sourceUrl:TK_URL },
  "tk-128": { id:"tk-128",act:"ТК РФ",provision:"статья 128",sourceUrl:TK_URL },
  "tk-255": { id:"tk-255",act:"ТК РФ",provision:"статья 255",sourceUrl:TK_URL },
  "tk-60.2": { id:"tk-60.2",act:"ТК РФ",provision:"статья 60.2",sourceUrl:TK_URL },
  "tk-151": { id:"tk-151",act:"ТК РФ",provision:"статья 151",sourceUrl:TK_URL },
  "tk-157": { id:"tk-157",act:"ТК РФ",provision:"статья 157",sourceUrl:TK_URL },
  "tk-312.1": { id:"tk-312.1",act:"ТК РФ",provision:"статья 312.1",sourceUrl:TK_URL },
  "tk-177": { id:"tk-177",act:"ТК РФ",provision:"статья 177",sourceUrl:TK_URL }
} as const;

type SupportedId = "alimony-order-objections/objections" |
  "unpaid-leave/leave" | "part-time-hours/schedule" |
  "hiring-refusal/refusal" | "maternity-leave/leave" |
  "secondary-employment/payment" | "downtime/payment" |
  "remote-work/conditions" | "study-leave/study";
export const SUPPORTED_PROVISIONAL_DRAFTS: readonly SupportedId[] = [
  "alimony-order-objections/objections",
  "unpaid-leave/leave",
  "part-time-hours/schedule",
  "hiring-refusal/refusal",
  "maternity-leave/leave",
  "secondary-employment/payment",
  "downtime/payment",
  "remote-work/conditions",
  "study-leave/study"
];

/** A case with ambiguous standing or legal route must fall back to a checklist. */
export function canBuildFamilyLaborDraft(
  plan: FamilyLaborPlan,scenarioKey: string,answers: Record<string,string|undefined>
): boolean {
  const id=plan.id+"/"+scenarioKey;
  if(!SUPPORTED_PROVISIONAL_DRAFTS.some(key=>key===id))return false;
  const review=getFamilyLaborGuidance(plan,scenarioKey,answers);
  if(!review.dataComplete||review.invalid.length>0||review.emergencyFirst)return false;
  if(id==="alimony-order-objections/objections"){
    return answers.roleInOrder==="должник" && answers.isLate==="нет";
  }
  if(answers.role!=="заявитель")return false;
  // Government Resolution No 620 (28.05.2026) imposes a separate procedure
  // for emergency-zone leave. The generic template lacks its qualifying evidence
  // and deadline questions, so give a checklist rather than a misleading draft.
  if(id==="unpaid-leave/leave")return answers.leaveGround!=="не знаю" &&
    answers.leaveGround!=="чрезвычайная ситуация: нарушение условий жизнедеятельности и утрата имущества";
  if(id==="maternity-leave/leave")return answers.leaveType==="беременность и роды";
  if(id==="part-time-hours/schedule")return answers.mandatoryBasis!=="не знаю";
  if(id==="secondary-employment/payment")return answers.mode==="совмещение";
  return true;
}

const blankLines=["Получатель: [укажите наименование и адрес адресата]",
  "Заявитель: [укажите ФИО и контактные данные]",
  "Дата: [дата подписания]", "Подпись: __________________"];
function safe(value:string|undefined):string {
  const v=(value??"").trim().replace(/\r\n?/g,"\n");
  if(!v||v.length>2000)throw new Error("Недостаточные либо чрезмерные сведения для проекта.");
  return v;
}
function generateContents(id:SupportedId,values:Record<string,string|undefined>):{
  title:string; content:string[]; rules:Array<keyof typeof registry>;extraPlaceholders:string[];
}{
  if(id==="alimony-order-objections/objections"){
    return {
      title:"Возражения относительно исполнения судебного приказа о взыскании алиментов",
      rules:["gpk-128","gpk-129"],
      extraPlaceholders:["[укажите наименование и номер судебного участка]","[укажите номер и дату судебного приказа]"],
      content:[
        "Мировому судье: [укажите наименование и номер судебного участка]",
        "Должник: [укажите ФИО и адрес]",
        "Взыскатель: [укажите ФИО и адрес, если известны]",
        "",
        "ВОЗРАЖЕНИЯ ОТНОСИТЕЛЬНО ИСПОЛНЕНИЯ СУДЕБНОГО ПРИКАЗА",
        "",
        "Судебный приказ (реквизиты со слов заявителя): "+safe(values.order),
        "Обстоятельства получения (со слов заявителя): "+safe(values.receipt),
        "Я, как должник, возражаю относительно исполнения указанного судебного приказа.",
        "Согласно статьям 128 и 129 ГПК РФ должник вправе представить возражения относительно исполнения судебного приказа; при своевременном поступлении возражений судебный приказ отменяется.",
        "ПРОШУ: отменить указанный судебный приказ.",
        "Приложения: [копия приказа, подтверждения даты вручения при наличии, иные необходимые документы]."
      ]
    };
  }
  if(id==="unpaid-leave/leave"){
    return {
      title:"Заявление о предоставлении отпуска без сохранения заработной платы",
      rules:["tk-128"],extraPlaceholders:["[укажите продолжительность и даты отпуска]"],
      content:[
        "ЗАЯВЛЕНИЕ О ПРЕДОСТАВЛЕНИИ ОТПУСКА БЕЗ СОХРАНЕНИЯ ЗАРАБОТНОЙ ПЛАТЫ",
        "На основании статьи 128 ТК РФ прошу рассмотреть предоставление мне отпуска без сохранения заработной платы.",
        "Основание и предполагаемый период (со слов работника): "+safe(values.basis),
        "Дополнительные сведения о датах: "+safe(values.dates),
        "Прошу письменно сообщить решение и оформить согласованный отпуск в установленном порядке.",
        "Приложения: [при необходимости приложите документы, подтверждающие основание].",
        "Примечание: для отдельных категорий и обстоятельств законом предусмотрена обязанность предоставить отпуск; применимость такого основания здесь не проверена."
      ]
    };
  }
  if(id==="part-time-hours/schedule"){
    return {
      title:"Заявление об установлении неполного рабочего времени",
      rules:["tk-93"],extraPlaceholders:["[укажите дату начала и желаемый график]"],
      content:[
        "ЗАЯВЛЕНИЕ ОБ УСТАНОВЛЕНИИ НЕПОЛНОГО РАБОЧЕГО ВРЕМЕНИ",
        "В соответствии со статьёй 93 ТК РФ прошу рассмотреть установление мне режима неполного рабочего времени.",
        "Предлагаемый график и основание (со слов работника): "+safe(values.schedule),
        "Сведения о времени обращения и обстоятельствах: "+safe(values.dates),
        "Прошу письменно ответить на заявление и, при согласовании, оформить изменение условий трудового договора.",
        "Приложения: [при наличии приложите документы, подтверждающие специальное право на такой режим].",
        "Примечание: случаи, в которых работодатель обязан установить неполное время, требуют отдельного подтверждения обстоятельств."
      ]
    };
  }
  if(id==="hiring-refusal/refusal"){
    return {
      title:"Требование сообщить причину отказа в заключении трудового договора",
      rules:["tk-64"],extraPlaceholders:["[укажите вакансию и дату отказа]"],
      content:[
        "ТРЕБОВАНИЕ О ПИСЬМЕННОМ СООБЩЕНИИ ПРИЧИН ОТКАЗА В ПРИЁМЕ НА РАБОТУ",
        "Мне было отказано в заключении трудового договора при следующих обстоятельствах (со слов заявителя): "+safe(values.reason),
        "Сведения о датах: "+safe(values.dates),
        "На основании статьи 64 ТК РФ прошу сообщить причину отказа в заключении трудового договора в письменной форме не позднее семи рабочих дней со дня предъявления настоящего требования.",
        "Прошу направить ответ: [укажите почтовый или электронный адрес, если применимо].",
        "Приложения: [при наличии — предложение о работе, переписка и иные относимые материалы]."
      ]
    };
  }
  if(id==="secondary-employment/payment"){
    return {
      title:"Заявление об оформлении и согласовании доплаты за совмещение",
      rules:["tk-60.2","tk-151"],
      extraPlaceholders:["[уточните должность, период и согласуемую доплату]"],
      content:[
        "ЗАЯВЛЕНИЕ ОБ ОФОРМЛЕНИИ СОВМЕЩЕНИЯ И ДОПЛАТЫ",
        "Прошу письменно согласовать содержание и объём дополнительной работы и размер доплаты за совмещение.",
        "Условия дополнительной работы по сведениям заявителя: "+safe(values.consent),
        "Дата и обстоятельства: "+safe(values.dates),
        "Статьи 60.2 и 151 ТК РФ предусматривают письменное согласие работника и доплату, размер которой устанавливается по соглашению сторон с учетом содержания и (или) объёма работы.",
        "Прошу предоставить письменный ответ и оформить договорённости надлежащим образом.",
        "Приложения: [трудовой договор, дополнительное соглашение, переписка при наличии].",
        "Примечание: проект не применим к совместительству по отдельному договору."
      ]
    };
  }
  if(id==="downtime/payment"){
    return {
      title:"Запрос сведений об оформлении и оплате простоя",
      rules:["tk-157"],
      extraPlaceholders:["[укажите периоды простоя и документы работодателя]"],
      content:[
        "ЗАПРОС О ПОРЯДКЕ ОФОРМЛЕНИЯ И ОПЛАТЫ ПРОСТОЯ",
        "В ходе работы возникли следующие обстоятельства (со слов работника): "+safe(values.cause),
        "Время и иные сведения: "+safe(values.dates),
        "Согласно статье 157 ТК РФ порядок оплаты простоя зависит от причины его возникновения.",
        "Прошу предоставить имеющиеся документы об объявлении простоя, его причине и применённом порядке оплаты, а также письменное разъяснение расчёта.",
        "Приложения: [уведомления, табель учета, расчётные листки при наличии].",
        "Примечание: размер выплаты без установления причины простоя не рассчитывается."
      ]
    };
  }
  if(id==="remote-work/conditions"){
    return {
      title:"Предложение согласовать условия дистанционной работы",
      rules:["tk-312.1"],
      extraPlaceholders:["[опишите конкретный предлагаемый режим дистанционной работы]"],
      content:[
        "ПРЕДЛОЖЕНИЕ О СОГЛАСОВАНИИ УСЛОВИЙ ДИСТАНЦИОННОЙ РАБОТЫ",
        "Прошу рассмотреть оформление условий выполнения трудовой функции дистанционно в трудовом договоре или дополнительном соглашении.",
        "Предполагаемый режим (со слов работника): "+safe(values.mode),
        "Оборудование, взаимодействие и расходы (со слов работника): "+safe(values.equipment),
        "Сведения о датах: "+safe(values.dates),
        "Статья 312.1 ТК РФ предусматривает постоянную, временную и периодическую дистанционную работу, особенности закрепления которой требуют соответствующего оформления.",
        "Прошу письменно сообщить позицию работодателя и, при согласии, согласовать соответствующие условия.",
        "Приложения: [действующий трудовой договор и относящаяся к предложению переписка].",
        "Примечание: автоматического права на дистанционный режим из одного заявления не следует."
      ]
    };
  }
  if(id==="study-leave/study"){
    return {
      title:"Заявление о предоставлении учебного отпуска с проверкой условий",
      rules:["tk-177"],
      extraPlaceholders:["[укажите образовательную программу, период и реквизиты справки-вызова]"],
      content:[
        "ЗАЯВЛЕНИЕ О ПРОВЕРКЕ ПРАВА И ПРЕДОСТАВЛЕНИИ УЧЕБНОГО ОТПУСКА",
        "Прошу рассмотреть предоставление мне учебного отпуска в связи с обучением.",
        "Образовательная программа и документы (со слов работника): "+safe(values.education),
        "Даты обращения и обучения: "+safe(values.dates),
        "Статья 177 ТК РФ регулирует условия предоставления гарантий работникам, совмещающим работу с получением образования; применимость и оплата должны быть проверены по виду программы и форме обучения.",
        "Прошу письменно сообщить решение, перечень необходимых документов и применимый порядок оформления.",
        "Приложения: [справка-вызов и другие имеющиеся документы].",
        "Примечание: этот проект не устанавливает наличие права на оплачиваемый отпуск."
      ]
    };
  }
  return {
    title:"Заявление о предоставлении отпуска по беременности и родам",
    rules:["tk-255"],extraPlaceholders:["[укажите период отпуска по медицинским документам]"],
    content:[
      "ЗАЯВЛЕНИЕ О ПРЕДОСТАВЛЕНИИ ОТПУСКА ПО БЕРЕМЕННОСТИ И РОДАМ",
      "На основании статьи 255 ТК РФ прошу предоставить мне отпуск по беременности и родам в соответствии с медицинскими документами.",
      "Сведения об оформлении и датах (со слов заявителя): "+safe(values.medicalBasis),
      "Дополнительные сведения: "+safe(values.dates),
      "Прошу оформить предоставление отпуска и необходимые сведения для назначения пособия в применимом порядке.",
      "Приложения: [реквизиты электронного листка нетрудоспособности или применимые медицинские документы].",
      "Примечание: отпуск по уходу за ребёнком оформляется по другим правилам; данный текст к нему неприменим."
    ]
  };
}
/**
 * This is a *draft*, not a statement verified or filed.
 * We never invent identity, address, court, signature or amounts.
 */
export function createProvisionalFamilyLaborDraft(
  plan:FamilyLaborPlan,scenarioKey:string,answers:Record<string,string|undefined>
):ProvisionalDraft|null{
  if(!canBuildFamilyLaborDraft(plan,scenarioKey,answers))return null;
  const id=(plan.id+"/"+scenarioKey) as SupportedId;
  const body=generateContents(id,answers);
  const refs=body.rules.map(key=>registry[key]);
  const precautions=[
    "ПРОЕКТ — НЕ ГОТОВ К ПОДАЧЕ; необходима юридическая проверка.",
    "Данные указаны со слов заявителя. Суд, адресат, правовое основание, вручение, специальные сроки и приложения должны быть проверены.",
    "",
    ...blankLines.slice(0,2),
    "",
    ...body.content,
    "",
    "Правовые основания для сверки:",
    ...refs.map(ref=>ref.act+", "+ref.provision+". Официальный источник: "+ref.sourceUrl),
    "",
    ...blankLines.slice(2)
  ];
  return {
    title:body.title,
    text:precautions.join("\n"),
    ruleIds:refs.map(x=>x.id),
    references:refs,
    placeholders:["[укажите наименование и адрес адресата]","[укажите ФИО и контактные данные]","[дата подписания]",...body.extraPlaceholders]
  };
}

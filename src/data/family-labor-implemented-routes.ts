import { FAMILY_LABOR_PLANS, type FamilyLaborPlan } from "@/data/family-labor-route-expansion";
import type { LegalProblem } from "@/data/legal-problems";

/**
 * Follow-on scenarios share the existing V1 routing and document contracts.
 * Substantive legal acceptance is not implied by registering a route.
 */
export const FAMILY_LABOR_IMPLEMENTATION_DATE = "2026-10-16"; // code creation date, not legal acceptance
export const FAMILY_LABOR_NEW_ROUTES = FAMILY_LABOR_PLANS.filter(item => item.kind === "NEW_ROUTE");

const slugs: Record<string,string> = {
  "cohabitation-property": "imushchestvo-fakticheskikh-sozhiteley",
  "adult-guardianship": "opeka-nad-sovershennoletnimi",
  "family-emergency-safety": "srochnaya-zashchita-v-semye",
  "maternity-leave": "otpusk-po-beremennosti-i-rodam",
  "shifts-and-business-trips": "vakhta-komandirovki-razezdnaya-rabota",
  "secondary-employment": "sovmestitelstvo-i-sovmeshchenie",
  "minor-workers": "trud-nesovershennoletnikh",
  "foreign-workers": "trud-inostrannykh-grazhdan"
};
export function familyLaborCategory(plan: FamilyLaborPlan): "semya-i-deti" | "trudovoe-pravo" {
  return plan.area === "family" ? "semya-i-deti" : "trudovoe-pravo";
}
export function getFamilyLaborRouteSlug(plan: FamilyLaborPlan): string {
  if (plan.kind === "NEW_ROUTE") {
    const slug=slugs[plan.id];
    if (!slug) throw new Error("Missing canonical family/labor route slug: "+plan.id);
    return slug;
  }
  if (!plan.existingSlug) throw new Error("Cross-area link is not a new route: "+plan.id);
  return plan.existingSlug;
}
export function getFamilyLaborRegistryScenarioKey(plan:FamilyLaborPlan,scenarioKey:string):string {
  return plan.kind==="EXISTING_ROUTE_EXTENSION"?"fl-"+plan.id+"-"+scenarioKey:scenarioKey;
}
export function getFamilyLaborDocumentSlug(plan: FamilyLaborPlan,scenarioKey:string):string|null {
  if (plan.kind==="CROSS_AREA_LINK" || plan.id==="family-emergency-safety") return null;
  if (!plan.scenarios.some(x=>x.key===scenarioKey)) return null;
  return "fl-"+plan.id+"-"+scenarioKey;
}
export function getFamilyLaborPlanForProblem(category:string,slug:string):FamilyLaborPlan|null {
  return FAMILY_LABOR_NEW_ROUTES.find(plan=>familyLaborCategory(plan)===category&&getFamilyLaborRouteSlug(plan)===slug)??null;
}
export function getFamilyLaborDocumentMatch(documentSlug:string):{plan:FamilyLaborPlan;scenarioKey:string}|null{
  for (const plan of FAMILY_LABOR_PLANS) for (const scenario of plan.scenarios){
    if(getFamilyLaborDocumentSlug(plan,scenario.key)===documentSlug)return {plan,scenarioKey:scenario.key};
  }
  return null;
}
export const FAMILY_LABOR_NEW_PROBLEMS: LegalProblem[]=FAMILY_LABOR_NEW_ROUTES.map(plan=>{
  const slug=getFamilyLaborRouteSlug(plan),categorySlug=familyLaborCategory(plan);
  const emergency=plan.id==="family-emergency-safety";
  return {
    slug,categorySlug,title:plan.title,h1:plan.title,shortTitle:plan.title,
    shortAnswer: emergency
      ? "При опасности в семье сначала защитите жизнь и здоровье. Экстренная помощь не зависит от заполнения анкеты."
      : "Выберите характер ситуации, проверьте факты и получите персональный перечень необходимых действий и документов.",
    description:plan.title+". Маршрут отделяет проверенные факты от предположений, определяет дальнейшие действия и требует юридической проверки до подачи документа.",
    seoTitle:plan.title+": порядок действий и документы",
    seoDescription:plan.title+": факты, доказательства, предварительный порядок обращения и юридическая проверка.",
    riskLevel:"high",urgency:emergency?"today":"standard",
    whatToKnow:["Перед выбором требования проверьте правовой режим и статус участников.",
      "Нормы, сроки, адресат и подсудность проверяются применительно к установленным обстоятельствам.",
      "Материалы до юридической приёмки не являются готовым к подаче документом."],
    deadlines:["Специальный срок определяется по конкретному виду обращения и подтверждённым датам."],
    risks:["Автоматически применять правила другой правовой отрасли.","Действовать по неподтверждённым фактам.","Подать непроверенный документ."],
    steps:emergency?["Обеспечьте безопасность и при непосредственной опасности свяжитесь с экстренной службой.","Получите медицинскую помощь при необходимости.","Выберите дальнейшее обращение только после обеспечения безопасности."]:
      ["Выберите сценарий.","Заполните относящиеся к делу сведения.","Проверьте исходные документы.","Получите чек-лист, экспортируйте PDF/DOCX или сохраните версию в личном кабинете.","Перед подачей проекта проведите юридическую проверку."],
    documents:["Подтверждения фактов и дат.","Переписка, обращения и ответы компетентных органов.","Документы о правовом статусе заявителя."],
    mistakes:["Выводить право на основании одного ключевого слова.","Пропускать проверку сроков и доказательств.","Считать чек-лист исковым заявлением."],
    faq:[],
    relatedDocumentSlugs:plan.scenarios.map(s=>getFamilyLaborDocumentSlug(plan,s.key)).filter((x):x is string=>Boolean(x)),
    legalReferenceKeys:[],
    relatedQuestionTopics:[plan.title.toLowerCase()],
    relatedQuestionExclusions:[],
    relatedLawyerSpecializations:[plan.area==="family"?"Семейное право":"Трудовое право"],
    relatedProblemSlugs:[],
    selfHelpConditions:["В исходных документах нет спорных или неизвестных критических сведений."],
    lawyerConditions:["Неизвестны сроки или правовой режим.","Необходимо обращение в суд или обжалование.","Есть последствия для ребёнка, дееспособности или миграционного статуса."],
    // Legal review date is intentionally absent: implementation date is not legal sign-off.
  };
});

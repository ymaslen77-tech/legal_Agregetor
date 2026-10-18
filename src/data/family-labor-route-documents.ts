import { FAMILY_LABOR_PLANS } from "@/data/family-labor-route-expansion";
import {getFamilyLaborRouteSlug,getFamilyLaborDocumentSlug} from "@/data/family-labor-implemented-routes";
import type {NavigatorDocument} from "@/data/documents";
import {SUPPORTED_PROVISIONAL_DRAFTS} from "@/lib/family-labor-provisional-draft";

/** Only supported provisional result: a personalized checklist, never a filed pleading. */
export const FAMILY_LABOR_NEW_DOCUMENTS: NavigatorDocument[]=FAMILY_LABOR_PLANS.flatMap(plan=>
  plan.scenarios.flatMap(scenario=>{
    const slug=getFamilyLaborDocumentSlug(plan,scenario.key);
    if(!slug)return [];
    const routeSlug=getFamilyLaborRouteSlug(plan);
    const draftPossible=SUPPORTED_PROVISIONAL_DRAFTS.some(id=>id===plan.id+"/"+scenario.key);
    const fields=plan.fields.filter(f=>scenario.requiredFields.includes(f.key));
    const list=fields.map(f=>f.label);
    const warning="Не подавайте чек-лист вместо заявления: правовые основания, срок и адресат подлежат индивидуальной проверке.";
    return [{
      slug,title:(draftPossible?"Проект или чек-лист: ":"Чек-лист: ")+scenario.title,
      shortTitle:(draftPossible?"Проект или чек-лист: ":"Чек-лист: ")+scenario.title,
      category:plan.area==="family"?"Семейное право":"Трудовое право",
      documentType:draftPossible?"Предварительный проект или чек-лист":"Персональный чек-лист",
      resultKind:draftPossible?"DRAFT":"CHECKLIST",
      shortIntro:"Проверьте документы и факты по "+plan.title.toLowerCase()+".",
      shortDescription:"Предварительная анкета и документ для самопроверки без статуса готовности к подаче.",
      description:plan.title+": "+scenario.title+". Результат содержит факты пользователя, перечень документов и порядок юридической проверки.",
      heroDescription:"Заполните относящиеся к делу сведения, получите персональный чек-лист и сохраните версию. Судебный документ до юридической приёмки не генерируется.",
      whenToUse:[scenario.title,plan.title],whenNotToUse:["Ситуация требует срочной медицинской или полицейской помощи.","Необходимо немедленно подать процессуальный документ без проверки."],
      beforeFillingChecklist:["Проверьте свой статус.","Уточните даты получения документов.","Подготовьте подтверждения, не сообщая ненужных персональных данных."],
      requiredData:list,whatToPrepare:list,
      whatToInclude:["Ключевые обстоятельства и даты.","Подтверждающие документы.","Правовые условия, подлежащие проверке."],
      howToFill:["Указывайте только известные подтверждаемые факты.","При неизвестном правовом режиме не выбирайте его наугад."],
      whereToFile:"Определяется отдельно после юридической проверки.",
      whereToSubmit:"Суд или орган не определён до юридической проверки.",
      filingProcedure:["Выберите нужный правовой порядок.","Проверьте адресат, срок и требования по действующим нормам."],
      howToSubmit:["Чек-лист не предназначен для подачи.","При необходимости подготовьте юридически проверенный документ."],
      legalBasis:plan.legalSources.map(x=>"Подлежит сверке: "+x),
      deadlinesAndFees:["Сроки и расходы индивидуальны; автоматический вывод запрещён."],
      stateDuty:["Размер и льготы по пошлине подлежат проверке применительно к заявлению."],
      deadlines:["Не используйте предполагаемый срок без подтверждения даты и основания."],
      afterFiling:["Сохраните подтверждение обращения.","Проверьте ответ и порядок возможного обжалования."],
      importantFactsToFix:list,
      mistakes:["Смешивать разные виды производства.","Подменять документ чек-листом."],
      commonMistakes:["Указывать непроверенные нормы.","Не фиксировать дату вручения документа."],
      documentsToAttach:list,attachments:list,
      relatedProblems:[{title:plan.title,slug:routeSlug}],
      relatedSituations:[{title:plan.title,slug:routeSlug}],
      relatedDocuments:[],faq:[],relatedProblemSlugs:[routeSlug],
      legalReferenceKeys:[],
      keywords:[plan.title.toLowerCase(),scenario.title.toLowerCase()],
      userQueries:[plan.title.toLowerCase()],
      // No legal-review date until official source review and acceptance are completed.
      disclaimer:warning,
      seoTitle:(draftPossible?"Проект и чек-лист: ":"Чек-лист: ")+scenario.title+" — заполнить и скачать",
      seoDescription:"Факты и документы для "+scenario.title.toLowerCase()+", PDF/DOCX и сохранение версии; не является готовым заявлением."
    } satisfies NavigatorDocument];
  })
);

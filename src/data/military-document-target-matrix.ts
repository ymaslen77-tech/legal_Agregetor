import { MILITARY_TOPICS } from "@/data/military-catalog";
import { MILITARY_LEGAL_CASE_CARDS } from "@/data/military-case-legal-matrix";
import { getMilitaryDocumentCandidate } from "@/data/military-document-candidates";
import type { MilitaryLegalDocumentKind } from "@/data/military-family-parity-contract";

/**
 * Stage 3 editorial document-target matrix.
 * NOT a form generator, legal approval, verified source registry, or published document page.
 * 121 target situation outcomes, 22 information-only situations intentionally have no document.
 * Alternative outcomes are branches requiring independent legal qualification, not two automatic exports.
 */
export const MILITARY_DOCUMENT_TARGET_MATRIX_VERSION = "MILITARY_DOCUMENT_TARGET_MATRIX_V1" as const;
export type MilitaryTargetRow = Readonly<{
  situationIndex: number;
  kind: MilitaryLegalDocumentKind;
  targetTitle: string;
  alternativeKind?: MilitaryLegalDocumentKind;
}>;
export type MilitaryDocumentTarget = Readonly<{
  categorySlug: string;
  situationSlug: string;
  situationIndex: number;
  situationTitle: string;
  situationKind: "document" | "mixed";
  documentSlug: string;
  primaryKind: MilitaryLegalDocumentKind;
  documentTitle: string;
  /** A distinct, conditional second type, NEVER auto-selected. */
  conditionalAlternativeKind: MilitaryLegalDocumentKind | null;
  draftObjectiveToVerify: string;
  recipientToVerify: string;
  caseSpecificEvidenceToConfirm: string;
  legalQuestionToVerify: string;
  selectionGuard: string;
  existingDraftPrototype: boolean;
  selectedSituationIsImplicit: true;
  /** Draft plan only. Never expose to production document generation. */
  status: "EDITORIAL_TARGET_PENDING_LEGAL_REVIEW";
  requiresLegalReview: true;
  filingReady: false;
  generationEnabled: false;
}>;

/** Explicit selection of one primary outcome per situation, not a heuristic based on page title. */
const TARGETS: Readonly<Record<string, readonly MilitaryTargetRow[]>> = {
  "kontraktnaya-sluzhba": [
    {situationIndex:0,kind:"APPLICATION",targetTitle:"Заявление о поступлении на военную службу (если требуется процедура)"},
    {situationIndex:2,kind:"APPLICATION",targetTitle:"Уведомление об отказе от неподписанного контракта (если необходимо)"},
    {situationIndex:3,kind:"APPLICATION",targetTitle:"Заявление о выдаче экземпляра заключённого контракта"},
    {situationIndex:4,kind:"RAPORT",targetTitle:"Рапорт о рассмотрении изменения условий действующего контракта"},
    {situationIndex:5,kind:"COMPLAINT",targetTitle:"Жалоба на спорное решение о продлении контракта",alternativeKind:"ADMINISTRATIVE_CLAIM"},
    {situationIndex:6,kind:"RAPORT",targetTitle:"Рапорт о рассмотрении увольнения по подтверждённому основанию"},
    {situationIndex:7,kind:"COMPLAINT",targetTitle:"Жалоба на конкретное условие контракта",alternativeKind:"ADMINISTRATIVE_CLAIM"},
    {situationIndex:8,kind:"COMPLAINT",targetTitle:"Жалоба на приказ о назначении на воинскую должность",alternativeKind:"ADMINISTRATIVE_CLAIM"},
  ],
  "mobilizaciya": [
    {situationIndex:2,kind:"COMPLAINT",targetTitle:"Жалоба на решение о призыве по мобилизации",alternativeKind:"ADMINISTRATIVE_CLAIM"},
    {situationIndex:3,kind:"APPLICATION",targetTitle:"Заявление об исправлении ошибочного решения по мобилизации",alternativeKind:"COMPLAINT"},
    {situationIndex:4,kind:"APPLICATION",targetTitle:"Обращение о медицинской проверке применимости мобилизации",alternativeKind:"COMPLAINT"},
    {situationIndex:5,kind:"APPLICATION",targetTitle:"Заявление о предусмотренной законом отсрочке от мобилизации"},
    {situationIndex:6,kind:"RAPORT",targetTitle:"Рапорт о рассмотрении семейных обстоятельств мобилизованного",alternativeKind:"APPLICATION"},
    {situationIndex:7,kind:"COMPLAINT",targetTitle:"Жалоба на конкретное решение о направлении на службу",alternativeKind:"ADMINISTRATIVE_CLAIM"},
  ],
  "prizyv": [
    {situationIndex:2,kind:"COMPLAINT",targetTitle:"Жалоба на решение призывной комиссии",alternativeKind:"ADMINISTRATIVE_CLAIM"},
    {situationIndex:3,kind:"APPLICATION",targetTitle:"Заявление о приобщении медицинских документов и обследовании"},
    {situationIndex:4,kind:"APPLICATION",targetTitle:"Заявление о выдаче выписки из протокола призывной комиссии"},
    {situationIndex:5,kind:"COMPLAINT",targetTitle:"Жалоба на непринятие медицинских документов"},
    {situationIndex:6,kind:"COMPLAINT",targetTitle:"Жалоба на заключение о категории годности",alternativeKind:"ADMINISTRATIVE_CLAIM"},
    {situationIndex:7,kind:"COMPLAINT",targetTitle:"Жалоба на установленное нарушение процедуры вручения повестки"},
    {situationIndex:8,kind:"COMPLAINT",targetTitle:"Жалоба на отказ в освобождении от призыва",alternativeKind:"ADMINISTRATIVE_CLAIM"},
  ],
  "otsrochka-ot-sluzhby": [
    {situationIndex:1,kind:"APPLICATION",targetTitle:"Заявление об отсрочке от призыва по состоянию здоровья"},
    {situationIndex:2,kind:"APPLICATION",targetTitle:"Заявление об учебной отсрочке от призыва"},
    {situationIndex:3,kind:"APPLICATION",targetTitle:"Заявление об отсрочке по установленным семейным основаниям"},
    {situationIndex:4,kind:"COMPLAINT",targetTitle:"Жалоба на отказ в отсрочке",alternativeKind:"ADMINISTRATIVE_CLAIM"},
    {situationIndex:5,kind:"APPLICATION",targetTitle:"Заявление об отсрочке для ухода за родственником"},
    {situationIndex:6,kind:"APPLICATION",targetTitle:"Заявление об освобождении от призыва по подтверждённому основанию"},
    {situationIndex:7,kind:"COMPLAINT",targetTitle:"Жалоба на отмену предоставленной отсрочки",alternativeKind:"ADMINISTRATIVE_CLAIM"},
  ],
  "vvk-i-kategoriya-godnosti": [
    {situationIndex:1,kind:"RAPORT",targetTitle:"Рапорт о направлении на военно-врачебную комиссию",alternativeKind:"APPLICATION"},
    {situationIndex:2,kind:"APPLICATION",targetTitle:"Заявление о контрольном обследовании и повторной ВВК",alternativeKind:"RAPORT"},
    {situationIndex:3,kind:"COMPLAINT",targetTitle:"Жалоба на заключение ВВК в вышестоящую ВВК",alternativeKind:"ADMINISTRATIVE_CLAIM"},
    {situationIndex:4,kind:"APPLICATION",targetTitle:"Заявление о пересмотре категории годности"},
    {situationIndex:5,kind:"APPLICATION",targetTitle:"Заявление о независимой военно-врачебной экспертизе"},
    {situationIndex:6,kind:"COMPLAINT",targetTitle:"Жалоба на неучёт результатов обследований"},
    {situationIndex:7,kind:"APPLICATION",targetTitle:"Заявление о выдаче копии заключения ВВК"},
    {situationIndex:8,kind:"COMPLAINT",targetTitle:"Жалоба на отказ в направлении на обследование"},
  ],
  "raporty-i-obrashcheniya": [
    {situationIndex:1,kind:"RAPORT",targetTitle:"Рапорт командиру по установленному вопросу"},
    {situationIndex:2,kind:"COMPLAINT",targetTitle:"Жалоба на отказ принять рапорт"},
    {situationIndex:3,kind:"APPLICATION",targetTitle:"Заявление о регистрации поданного рапорта"},
    {situationIndex:4,kind:"COMPLAINT",targetTitle:"Жалоба на нерассмотрение рапорта"},
    {situationIndex:5,kind:"APPLICATION",targetTitle:"Заявление о предоставлении письменного ответа"},
    {situationIndex:6,kind:"COMPLAINT",targetTitle:"Жалоба на решение командования",alternativeKind:"ADMINISTRATIVE_CLAIM"},
  ],
  "uvolnenie-s-voennoy-sluzhby": [
    {situationIndex:1,kind:"RAPORT",targetTitle:"Рапорт об увольнении по состоянию здоровья"},
    {situationIndex:2,kind:"RAPORT",targetTitle:"Рапорт об увольнении по семейным обстоятельствам"},
    {situationIndex:3,kind:"RAPORT",targetTitle:"Рапорт об увольнении по допустимому основанию"},
    {situationIndex:4,kind:"RAPORT",targetTitle:"Рапорт об увольнении по предельному возрасту"},
    {situationIndex:5,kind:"COMPLAINT",targetTitle:"Жалоба на отказ в увольнении",alternativeKind:"ADMINISTRATIVE_CLAIM"},
    {situationIndex:6,kind:"COMPLAINT",targetTitle:"Жалоба на нерассмотрение рапорта об увольнении"},
    {situationIndex:7,kind:"ADMINISTRATIVE_CLAIM",targetTitle:"Административный иск об оспаривании приказа об увольнении",alternativeKind:"COMPLAINT"},
    {situationIndex:8,kind:"APPLICATION",targetTitle:"Заявление о выдаче документов и окончательного расчёта"},
  ],
  "perevod-v-druguyu-chast": [
    {situationIndex:1,kind:"RAPORT",targetTitle:"Рапорт о переводе в другую часть"},
    {situationIndex:2,kind:"RAPORT",targetTitle:"Рапорт о переводе по состоянию здоровья"},
    {situationIndex:3,kind:"RAPORT",targetTitle:"Рапорт о переводе по семейным основаниям"},
    {situationIndex:4,kind:"COMPLAINT",targetTitle:"Жалоба на решение о переводе",alternativeKind:"ADMINISTRATIVE_CLAIM"},
    {situationIndex:5,kind:"COMPLAINT",targetTitle:"Жалоба на отказ в переводе"},
  ],
  "otpusk-voennosluzhashchego": [
    {situationIndex:1,kind:"RAPORT",targetTitle:"Рапорт о предоставлении основного отпуска"},
    {situationIndex:2,kind:"RAPORT",targetTitle:"Рапорт об отпуске по личным обстоятельствам"},
    {situationIndex:3,kind:"COMPLAINT",targetTitle:"Жалоба на отказ в отпуске"},
    {situationIndex:4,kind:"RAPORT",targetTitle:"Рапорт о предоставлении неиспользованного отпуска"},
    {situationIndex:5,kind:"COMPLAINT",targetTitle:"Жалоба на приказ об отзыве из отпуска"},
  ],
  "denezhnoe-dovolstvie": [
    {situationIndex:1,kind:"RAPORT",targetTitle:"Рапорт о проверке невыплаты денежного довольствия",alternativeKind:"APPLICATION"},
    {situationIndex:2,kind:"ADMINISTRATIVE_CLAIM",targetTitle:"Административный иск по спору о невыплате довольствия (при надлежащем порядке)",alternativeKind:"CIVIL_CLAIM"},
    {situationIndex:3,kind:"APPLICATION",targetTitle:"Заявление о перерасчёте денежного довольствия"},
    {situationIndex:4,kind:"COMPLAINT",targetTitle:"Жалоба на конкретное удержание из довольствия",alternativeKind:"APPLICATION"},
    {situationIndex:5,kind:"APPLICATION",targetTitle:"Заявление о начислении установленной надбавки"},
    {situationIndex:6,kind:"APPLICATION",targetTitle:"Заявление о предоставлении расчётных сведений"},
  ],
  "vyplaty-za-uchastie-v-svo": [
    {situationIndex:1,kind:"APPLICATION",targetTitle:"Заявление о федеральной единовременной выплате"},
    {situationIndex:2,kind:"APPLICATION",targetTitle:"Заявление о назначении конкретной выплаты за участие в СВО"},
    {situationIndex:3,kind:"COMPLAINT",targetTitle:"Жалоба на задержку назначенной выплаты"},
    {situationIndex:4,kind:"COMPLAINT",targetTitle:"Жалоба на письменный отказ в выплате",alternativeKind:"ADMINISTRATIVE_CLAIM"},
    {situationIndex:5,kind:"APPLICATION",targetTitle:"Заявление о выплате по акту конкретного региона"},
    {situationIndex:6,kind:"APPLICATION",targetTitle:"Требование о перечислении назначенной суммы",alternativeKind:"ADMINISTRATIVE_CLAIM"},
  ],
  "ranenie-travma-gospital": [
    {situationIndex:1,kind:"RAPORT",targetTitle:"Рапорт о направлении на лечение после ранения (не вместо экстренной помощи)"},
    {situationIndex:2,kind:"RAPORT",targetTitle:"Рапорт о направлении на лечение по медицинским показаниям",alternativeKind:"COMPLAINT"},
    {situationIndex:3,kind:"RAPORT",targetTitle:"Рапорт о госпитализации при подтверждённых показаниях"},
    {situationIndex:4,kind:"APPLICATION",targetTitle:"Заявление о выдаче документов об обстоятельствах травмы"},
    {situationIndex:5,kind:"RAPORT",targetTitle:"Рапорт об установлении причинной связи травмы посредством ВВК"},
    {situationIndex:6,kind:"COMPLAINT",targetTitle:"Жалоба на отказ в оказании медицинской помощи"},
    {situationIndex:7,kind:"RAPORT",targetTitle:"Рапорт о продолжении лечения и медицинской оценке"},
  ],
  "gibel-i-vyplaty-seme": [
    {situationIndex:1,kind:"APPLICATION",targetTitle:"Заявление о назначении конкретной выплаты члену семьи"},
    {situationIndex:2,kind:"COMPLAINT",targetTitle:"Жалоба на отказ в выплате члену семьи",alternativeKind:"CIVIL_CLAIM"},
    {situationIndex:3,kind:"APPLICATION",targetTitle:"Заявление о выдаче документов об обстоятельствах гибели"},
    {situationIndex:4,kind:"APPLICATION",targetTitle:"Заявление о выплате с учётом установленного статуса",alternativeKind:"CIVIL_CLAIM"},
    {situationIndex:5,kind:"APPLICATION",targetTitle:"Судебное заявление об установлении юридического факта"},
    {situationIndex:6,kind:"COMPLAINT",targetTitle:"Жалоба на отказ в признании права на выплату",alternativeKind:"CIVIL_CLAIM"},
    {situationIndex:7,kind:"APPLICATION",targetTitle:"Заявление о выплате в интересах ребёнка или иждивенца"},
  ],
  "disciplinarnye-vzyskaniya": [
    {situationIndex:1,kind:"COMPLAINT",targetTitle:"Жалоба на объявленное дисциплинарное взыскание"},
    {situationIndex:2,kind:"COMPLAINT",targetTitle:"Жалоба на незаконное привлечение к дисциплинарной ответственности"},
    {situationIndex:3,kind:"RAPORT",targetTitle:"Рапорт о предоставлении материалов разбирательства"},
    {situationIndex:4,kind:"COMPLAINT",targetTitle:"Жалоба на нарушение порядка дисциплинарного разбирательства"},
    {situationIndex:5,kind:"COMPLAINT",targetTitle:"Жалоба на приказ о дисциплинарном взыскании",alternativeKind:"ADMINISTRATIVE_CLAIM"},
  ],
  "samovolnoe-ostavlenie-chasti": [
    {situationIndex:1,kind:"PROCEDURAL_MOTION",targetTitle:"Ходатайство по уголовному делу с указанием возражений",alternativeKind:"PROCEDURAL_COMPLAINT"},
    {situationIndex:2,kind:"PROCEDURAL_MOTION",targetTitle:"Ходатайство о приобщении доказательств уважительных причин"},
    {situationIndex:3,kind:"PROCEDURAL_COMPLAINT",targetTitle:"Жалоба на процессуальные действия органа расследования"},
    {situationIndex:4,kind:"PROCEDURAL_MOTION",targetTitle:"Ходатайство по конкретному процессуальному вопросу",alternativeKind:"PROCEDURAL_COMPLAINT"},
  ],
  "voennaya-ipoteka-i-zhile": [
    {situationIndex:1,kind:"RAPORT",targetTitle:"Рапорт о включении в реестр НИС"},
    {situationIndex:2,kind:"COMPLAINT",targetTitle:"Жалоба на отказ во включении в НИС"},
    {situationIndex:3,kind:"APPLICATION",targetTitle:"Заявление о сверке накоплений на именном счёте НИС"},
    {situationIndex:4,kind:"APPLICATION",targetTitle:"Заявление о предоставлении выбранной жилищной гарантии",alternativeKind:"COMPLAINT"},
    {situationIndex:5,kind:"COMPLAINT",targetTitle:"Жалоба на отказ в предоставлении жилья или субсидии",alternativeKind:"ADMINISTRATIVE_CLAIM"},
  ],
  "voinskiy-uchet-i-dokumenty": [
    {situationIndex:1,kind:"APPLICATION",targetTitle:"Заявление о постановке на воинский учёт (если требуется)"},
    {situationIndex:2,kind:"APPLICATION",targetTitle:"Заявление о снятии с воинского учёта по законному основанию"},
    {situationIndex:3,kind:"APPLICATION",targetTitle:"Уведомление о проживании за границей и изменении сведений учёта"},
    {situationIndex:4,kind:"APPLICATION",targetTitle:"Заявление о выдаче военного билета взамен утраченного"},
    {situationIndex:5,kind:"COMPLAINT",targetTitle:"Жалоба на отказ в выдаче документа воинского учёта"},
    {situationIndex:6,kind:"COMPLAINT",targetTitle:"Жалоба на отказ в паспортной услуге",alternativeKind:"ADMINISTRATIVE_CLAIM"},
  ],
  "alternativnaya-grazhdanskaya-sluzhba": [
    {situationIndex:1,kind:"APPLICATION",targetTitle:"Заявление о замене службы по призыву альтернативной гражданской"},
    {situationIndex:2,kind:"COMPLAINT",targetTitle:"Жалоба на решение об отказе в АГС",alternativeKind:"ADMINISTRATIVE_CLAIM"},
    {situationIndex:3,kind:"COMPLAINT",targetTitle:"Жалоба на нарушение порядка рассмотрения заявления об АГС"},
    {situationIndex:4,kind:"COMPLAINT",targetTitle:"Жалоба о пересмотре отказа в АГС",alternativeKind:"ADMINISTRATIVE_CLAIM"},
  ],
  "veterany-pensii-i-lgoty": [
    {situationIndex:1,kind:"APPLICATION",targetTitle:"Заявление о выдаче удостоверения ветерана боевых действий"},
    {situationIndex:2,kind:"COMPLAINT",targetTitle:"Жалоба на отказ в признании статуса ветерана"},
    {situationIndex:3,kind:"APPLICATION",targetTitle:"Заявление о назначении военной пенсии"},
    {situationIndex:4,kind:"APPLICATION",targetTitle:"Заявление о перерасчёте военной пенсии"},
    {situationIndex:5,kind:"APPLICATION",targetTitle:"Заявление о предоставлении выбранной меры социальной поддержки"},
    {situationIndex:6,kind:"APPLICATION",targetTitle:"Заявление о предоставлении медицинской или санаторной гарантии"},
  ],
  "sudebnaya-zashchita": [
    {situationIndex:1,kind:"ADMINISTRATIVE_CLAIM",targetTitle:"Административный иск об оспаривании решения воинского должностного лица"},
    {situationIndex:2,kind:"ADMINISTRATIVE_CLAIM",targetTitle:"Административный иск об оспаривании бездействия командования"},
    {situationIndex:3,kind:"COMPLAINT",targetTitle:"Жалоба на отказ военной прокуратуры",alternativeKind:"ADMINISTRATIVE_CLAIM"},
    {situationIndex:4,kind:"PROCEDURAL_MOTION",targetTitle:"Ходатайство в рассматриваемом судебном деле"},
    {situationIndex:5,kind:"PROCEDURAL_APPEAL",targetTitle:"Апелляционная жалоба на судебный акт по применимому кодексу"},
  ],
};
export const MILITARY_DOCUMENT_TARGETS: readonly MilitaryDocumentTarget[] = MILITARY_TOPICS.flatMap(topic =>
  (TARGETS[topic.slug] ?? []).map(row => {
    const situation = topic.situations[row.situationIndex];
    const caseCard = MILITARY_LEGAL_CASE_CARDS.find(x=>x.topicSlug===topic.slug && x.situationIndex===row.situationIndex);
    if(!situation || situation.kind==="information" || !caseCard || !caseCard.plannedResultToVerify ||
       !caseCard.evidenceToConfirm || !caseCard.competentRecipientToVerify || !caseCard.legalQuestion ||
       !caseCard.criticalLimitations) throw new Error("Incomplete individual document target: "+topic.slug+":"+row.situationIndex);
    return {
      categorySlug: topic.slug,
      situationSlug: situation.slug,
      situationIndex: row.situationIndex,
      situationTitle: situation.title,
      situationKind: situation.kind,
      documentSlug: "military-"+topic.slug+"-"+row.situationIndex,
      primaryKind: row.kind,
      documentTitle: row.targetTitle,
      conditionalAlternativeKind: row.alternativeKind ?? null,
      draftObjectiveToVerify: caseCard.plannedResultToVerify,
      recipientToVerify: caseCard.competentRecipientToVerify,
      caseSpecificEvidenceToConfirm: caseCard.evidenceToConfirm,
      legalQuestionToVerify: caseCard.legalQuestion,
      selectionGuard: caseCard.criticalLimitations,
      existingDraftPrototype: Boolean(getMilitaryDocumentCandidate(topic,situation)),
      selectedSituationIsImplicit: true as const,
      status:"EDITORIAL_TARGET_PENDING_LEGAL_REVIEW" as const,
      requiresLegalReview: true as const,
      filingReady: false as const,
      generationEnabled: false as const
    };
  })
);
export function getMilitaryDocumentTarget(categorySlug:string,situationSlug:string):MilitaryDocumentTarget|null {
  return MILITARY_DOCUMENT_TARGETS.find(x=>x.categorySlug===categorySlug && x.situationSlug===situationSlug) ?? null;
}
export function getMilitaryDocumentTargetCoverage() {
  const expected=MILITARY_TOPICS.reduce((n,t)=>n+t.situations.filter(s=>s.kind!=="information").length,0);
  const byCategory=MILITARY_TOPICS.map(topic=>({
    slug:topic.slug,
    planned:MILITARY_DOCUMENT_TARGETS.filter(x=>x.categorySlug===topic.slug).length,
    required:topic.situations.filter(s=>s.kind!=="information").length
  }));
  return {
    version:MILITARY_DOCUMENT_TARGET_MATRIX_VERSION,
    categories:MILITARY_TOPICS.length,
    situations:MILITARY_TOPICS.reduce((n,t)=>n+t.situations.length,0),
    informationOnly:MILITARY_TOPICS.reduce((n,t)=>n+t.situations.filter(s=>s.kind==="information").length,0),
    documentSituations:expected,
    plannedDocumentTargets:MILITARY_DOCUMENT_TARGETS.length,
    conditionalAlternativeTargets:MILITARY_DOCUMENT_TARGETS.filter(x=>x.conditionalAlternativeKind!==null).length,
    draftPrototypes:MILITARY_DOCUMENT_TARGETS.filter(x=>x.existingDraftPrototype).length,
    legallyApproved:MILITARY_DOCUMENT_TARGETS.filter(x=>x.generationEnabled).length,
    byCategory
  };
}

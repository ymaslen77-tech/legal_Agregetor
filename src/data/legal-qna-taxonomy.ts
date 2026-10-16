/**
 * Read-only bridge between existing Q&A Service.slug taxonomy, the 43 published
 * family/labor legal routes, and NOT-PUBLISHED future route blueprints.
 *
 * NEITHER source Service rows NOR existing Question.serviceId / Question.scenarioId
 * are rewritten. Service categories were imported from legacy sites and may
 * reflect answering-lawyer expertise, rather than legal intent.
 */
export type LegalQnaAreaId =
  | "family" | "labor" | "consumer" | "inheritance" | "enforcement" | "housing"
  | "military" | "civil-court" | "criminal" | "real-estate" | "auto-insurance"
  | "credit-bankruptcy" | "migration" | "tax-administrative" | "social"
  | "business" | "medical" | "internet-intellectual" | "other-public-law";

export type QnaArea = {
  id: LegalQnaAreaId;
  name: string;
  /** Existing Service.slug values. Read-only, exact match, no name guesses. */
  sourceServiceSlugs: readonly string[];
  /** 2026-10-15 source-database snapshot, not live traffic or total legal demand. */
  baselineQuestions: number;
  /** A category can exist before any new public navigator route is registered. */
  navigatorCategorySlug: string | null;
  releaseState: "EXISTING_ROUTES" | "DESIGN_ONLY" | "BACKLOG";
};

export const QNA_CATALOG_SNAPSHOT_DATE = "2026-10-15" as const;
export const QNA_CATALOG_SOURCE = "Neon pravopoisk_import_20261014 Question → Service/parentId" as const;

export const QNA_LEGAL_AREAS: readonly QnaArea[] = [
  { id: "family", name: "Семейное право", sourceServiceSlugs: ["semeynye-spory","semejnye-dela","alimenty","razdel-imushchestva","zaklyuchenie-i-rastorzhenie-braka","usynovlenie-opeka-popechitelstvo","razvod"], baselineQuestions: 28509, navigatorCategorySlug: "semya-i-deti", releaseState: "EXISTING_ROUTES" },
  { id: "labor", name: "Трудовое право", sourceServiceSlugs: ["trudovye-spory","trudovoe-pravo","uvolnenie"], baselineQuestions: 14826, navigatorCategorySlug: "trudovoe-pravo", releaseState: "EXISTING_ROUTES" },
  { id: "consumer", name: "Защита прав потребителей", sourceServiceSlugs: ["zashchita-prav-potrebiteley","zashchita-prav-potrebitelya","turizm"], baselineQuestions: 6673, navigatorCategorySlug: null, releaseState: "DESIGN_ONLY" },
  { id: "inheritance", name: "Наследственное право", sourceServiceSlugs: ["nasledstvo"], baselineQuestions: 8049, navigatorCategorySlug: null, releaseState: "DESIGN_ONLY" },
  { id: "enforcement", name: "Исполнительное производство", sourceServiceSlugs: ["ispolnitelnoe-proizvodstvo"], baselineQuestions: 7120, navigatorCategorySlug: null, releaseState: "DESIGN_ONLY" },
  { id: "housing", name: "Жилищное право и ЖКХ", sourceServiceSlugs: ["zhilishchnye-spory","zhilishchnye-voprosy","zhkh"], baselineQuestions: 8424, navigatorCategorySlug: null, releaseState: "DESIGN_ONLY" },
  { id: "military", name: "Военное право", sourceServiceSlugs: ["voennoe-pravo"], baselineQuestions: 13110, navigatorCategorySlug: null, releaseState: "BACKLOG" },
  { id: "civil-court", name: "Гражданский и арбитражный процесс", sourceServiceSlugs: ["predstavitelstvo-v-sude","grazhdanskie-dela","prochie","vozmeshchenie-ushcherba","arbitrazh","arbitrazhnye-spory"], baselineQuestions: 11564, navigatorCategorySlug: null, releaseState: "BACKLOG" },
  { id: "criminal", name: "Уголовное право", sourceServiceSlugs: ["ugolovnye-dela","moshennichestvo","dela-po-narkotikam"], baselineQuestions: 8996, navigatorCategorySlug: null, releaseState: "BACKLOG" },
  { id: "real-estate", name: "Недвижимость и земля", sourceServiceSlugs: ["nedvizhimost","stroitelstvo","zemelnye-spory","zemelnye-voprosy","ekologicheskoe-pravo"], baselineQuestions: 12220, navigatorCategorySlug: null, releaseState: "BACKLOG" },
  { id: "auto-insurance", name: "Авто и страхование", sourceServiceSlugs: ["avtoyurist","avtoyuristy","dtp","spory-so-strahovymi-kompaniyami","strahovye-spory"], baselineQuestions: 7619, navigatorCategorySlug: null, releaseState: "BACKLOG" },
  { id: "credit-bankruptcy", name: "Кредиты, ипотека, долги и банкротство граждан", sourceServiceSlugs: ["kredity-dolgi","bankovskoe-pravo","finansovoe-pravo","kreditnye-voprosy-i-spory","ipoteka","bankrotstvo-fizicheskih-lits","vzyskanie-zadolzhennosti"], baselineQuestions: 12783, navigatorCategorySlug: null, releaseState: "BACKLOG" },
  { id: "migration", name: "Миграционное право", sourceServiceSlugs: ["migratsionnoe-pravo","migracionnye-voprosy"], baselineQuestions: 4847, navigatorCategorySlug: null, releaseState: "BACKLOG" },
  { id: "tax-administrative", name: "Налоговое и административное право", sourceServiceSlugs: ["nalogovye-spory","nalogovoe-pravo","administrativnye-dela","administrativnoe-pravo"], baselineQuestions: 7281, navigatorCategorySlug: null, releaseState: "BACKLOG" },
  { id: "social", name: "Пенсионное и социальное обеспечение", sourceServiceSlugs: ["pensionnye-spory","pensii-i-posobiya","socialnoe-obespechenie","sotsialnye-vyplaty"], baselineQuestions: 6148, navigatorCategorySlug: null, releaseState: "BACKLOG" },
  { id: "business", name: "Бизнес, документы, госзакупки и банкротство организаций", sourceServiceSlugs: ["obsluzhivanie-biznesa","biznes-dogovory","korporativnye-spory","bankrotstvo-biznesa","bankrotstvo-yuridicheskih-lic","tendery-i-goszakupki","sostavlenie-dokumentov","yuridicheskaya-ekspertiza"], baselineQuestions: 7597, navigatorCategorySlug: null, releaseState: "BACKLOG" },
  { id: "medical", name: "Медицинское право", sourceServiceSlugs: ["meditsinskoe-pravo"], baselineQuestions: 2208, navigatorCategorySlug: null, releaseState: "BACKLOG" },
  { id: "internet-intellectual", name: "Цифровое право, авторское право, интеллектуальная собственность", sourceServiceSlugs: ["internet-pravo","it-pravo","personalnye-dannye","intellektualnaya-sobstvennost","zashchita-avtorskih-prav"], baselineQuestions: 2533, navigatorCategorySlug: null, releaseState: "BACKLOG" },
  { id: "other-public-law", name: "Иные публично-правовые направления", sourceServiceSlugs: ["konstitucionnoe-pravo","pravonarusheniya-dolzhnostnyh-lic","mezhdunarodnoe-pravo","tamozhennoe-pravo","zashchita-chesti-dostoinstva","nematerialnye-blaga","obrazovatelnoe-pravo"], baselineQuestions: 1136, navigatorCategorySlug: null, releaseState: "BACKLOG" }
];

/** No questions are reassigned. Unknown slugs stay UNMAPPED, never guessed. */
const areaBySlug = new Map(QNA_LEGAL_AREAS.flatMap((area) =>
  area.sourceServiceSlugs.map((slug) => [slug, area] as const)
));
export function getQnaLegalAreaByServiceSlug(serviceSlug: string): QnaArea | null {
  return areaBySlug.get(serviceSlug) ?? null;
}
export function getQnaLegalArea(id: LegalQnaAreaId): QnaArea {
  const found = QNA_LEGAL_AREAS.find((area) => area.id === id);
  if (!found) throw new Error(`Unknown legal Q&A area: ${id}`);
  return found;
}
export function getQnaCatalogCoverage() {
  return {
    snapshotDate: QNA_CATALOG_SNAPSHOT_DATE,
    source: QNA_CATALOG_SOURCE,
    areas: QNA_LEGAL_AREAS.length,
    questions: QNA_LEGAL_AREAS.reduce((sum, area) => sum + area.baselineQuestions, 0),
    classifiedByRootServiceNotReviewedByExpert: true
  };
}

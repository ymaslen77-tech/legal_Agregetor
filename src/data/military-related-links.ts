import {
  MILITARY_TOPICS,
  type MilitaryTopic,
  type MilitarySituation
} from "@/data/military-catalog";
import { getMilitaryDocumentCandidate } from "@/data/military-document-candidates";

/**
 * Editorial relationships only: no guessed legal rights, automatic statutes,
 * or keyword-match recommendations. All destinations are resolved against the
 * actual static 20-topic/143-situation catalogue.
 *
 * Every situation belongs to one topical sequence: links connect the nearest
 * meaningful step, decision or remedy. Cross-topic edges are separately curated.
 */
export type MilitaryRelatedLink = Readonly<{
  href: string;
  title: string;
  detail: string;
  topicSlug: string;
  situationSlug?: string;
  kind: "topic" | "situation" | "document";
}>;

const RELATED_TOPICS: Readonly<Record<string, readonly string[]>> = {
  "kontraktnaya-sluzhba": ["uvolnenie-s-voennoy-sluzhby", "perevod-v-druguyu-chast", "raporty-i-obrashcheniya"],
  "mobilizaciya": ["otsrochka-ot-sluzhby", "vvk-i-kategoriya-godnosti", "prizyv"],
  "prizyv": ["otsrochka-ot-sluzhby", "vvk-i-kategoriya-godnosti", "alternativnaya-grazhdanskaya-sluzhba"],
  "otsrochka-ot-sluzhby": ["prizyv", "mobilizaciya", "vvk-i-kategoriya-godnosti"],
  "vvk-i-kategoriya-godnosti": ["ranenie-travma-gospital", "prizyv", "uvolnenie-s-voennoy-sluzhby"],
  "raporty-i-obrashcheniya": ["uvolnenie-s-voennoy-sluzhby", "perevod-v-druguyu-chast", "disciplinarnye-vzyskaniya"],
  "uvolnenie-s-voennoy-sluzhby": ["kontraktnaya-sluzhba", "vvk-i-kategoriya-godnosti", "veterany-pensii-i-lgoty"],
  "perevod-v-druguyu-chast": ["kontraktnaya-sluzhba", "raporty-i-obrashcheniya", "vvk-i-kategoriya-godnosti"],
  "otpusk-voennosluzhashchego": ["raporty-i-obrashcheniya", "uvolnenie-s-voennoy-sluzhby", "disciplinarnye-vzyskaniya"],
  "denezhnoe-dovolstvie": ["vyplaty-za-uchastie-v-svo", "uvolnenie-s-voennoy-sluzhby", "veterany-pensii-i-lgoty"],
  "vyplaty-za-uchastie-v-svo": ["denezhnoe-dovolstvie", "ranenie-travma-gospital", "gibel-i-vyplaty-seme"],
  "ranenie-travma-gospital": ["vvk-i-kategoriya-godnosti", "vyplaty-za-uchastie-v-svo", "uvolnenie-s-voennoy-sluzhby"],
  "gibel-i-vyplaty-seme": ["vyplaty-za-uchastie-v-svo", "veterany-pensii-i-lgoty", "sudebnaya-zashchita"],
  "disciplinarnye-vzyskaniya": ["raporty-i-obrashcheniya", "sudebnaya-zashchita", "samovolnoe-ostavlenie-chasti"],
  "samovolnoe-ostavlenie-chasti": ["disciplinarnye-vzyskaniya", "raporty-i-obrashcheniya", "sudebnaya-zashchita"],
  "voennaya-ipoteka-i-zhile": ["uvolnenie-s-voennoy-sluzhby", "veterany-pensii-i-lgoty", "sudebnaya-zashchita"],
  "voinskiy-uchet-i-dokumenty": ["prizyv", "kontraktnaya-sluzhba", "alternativnaya-grazhdanskaya-sluzhba"],
  "alternativnaya-grazhdanskaya-sluzhba": ["prizyv", "otsrochka-ot-sluzhby", "voinskiy-uchet-i-dokumenty"],
  "veterany-pensii-i-lgoty": ["vyplaty-za-uchastie-v-svo", "gibel-i-vyplaty-seme", "voennaya-ipoteka-i-zhile"],
  "sudebnaya-zashchita": ["disciplinarnye-vzyskaniya", "raporty-i-obrashcheniya", "gibel-i-vyplaty-seme"]
};

/**
 * Indices are local to each category's established ordering. Groups describe
 * practical question sequences (initial decision -> evidence -> challenge).
 * Every question belongs to at least one sequence.
 */
const SITUATION_FLOWS: Readonly<Record<string, readonly (readonly number[])[]>> = {
  "kontraktnaya-sluzhba": [[0, 1, 3, 4], [2, 5, 7], [6, 8]],
  "mobilizaciya": [[0, 1, 2, 3, 7], [4, 5, 6]],
  "prizyv": [[0, 1, 2, 4, 8], [3, 5, 6], [7, 2]],
  "otsrochka-ot-sluzhby": [[0, 1, 2, 3, 5, 6], [4, 7]],
  "vvk-i-kategoriya-godnosti": [[0, 1, 2, 4, 6], [3, 5, 7, 8]],
  "raporty-i-obrashcheniya": [[0, 1, 2, 3, 4, 5, 6]],
  "uvolnenie-s-voennoy-sluzhby": [[0, 2, 3, 4], [1, 5, 6, 7], [8, 4]],
  "perevod-v-druguyu-chast": [[0, 1, 2, 3], [4, 5]],
  "otpusk-voennosluzhashchego": [[0, 1, 2, 3, 4, 5]],
  "denezhnoe-dovolstvie": [[0, 1, 2, 3, 4, 5, 6]],
  "vyplaty-za-uchastie-v-svo": [[0, 1, 2, 3, 4, 5, 6]],
  "ranenie-travma-gospital": [[0, 1, 2, 3, 4, 5, 6, 7]],
  "gibel-i-vyplaty-seme": [[0, 1, 2, 4, 5, 6, 7], [3, 1]],
  "disciplinarnye-vzyskaniya": [[0, 1, 2, 3, 4, 5]],
  "samovolnoe-ostavlenie-chasti": [[0, 1, 2, 3, 4]],
  "voennaya-ipoteka-i-zhile": [[0, 1, 2, 3, 4, 5]],
  "voinskiy-uchet-i-dokumenty": [[0, 1, 2, 3, 4, 5, 6]],
  "alternativnaya-grazhdanskaya-sluzhba": [[0, 1, 2, 3, 4]],
  "veterany-pensii-i-lgoty": [[0, 1, 2, 3, 4, 5, 6]],
  "sudebnaya-zashchita": [[0, 1, 2, 3, 4, 5]]
};

type SituationRef = readonly [topicSlug: string, index: number];
type CrossReference = readonly [from: SituationRef, to: SituationRef, detail: string];

/** Scenario-to-scenario links that cross category boundaries. */
const CROSS_REFERENCES: readonly CrossReference[] = [
  [["kontraktnaya-sluzhba", 6], ["uvolnenie-s-voennoy-sluzhby", 0], "Проверка основания прекращения службы"],
  [["kontraktnaya-sluzhba", 8], ["perevod-v-druguyu-chast", 4], "Оспаривание кадрового решения"],
  [["mobilizaciya", 4], ["vvk-i-kategoriya-godnosti", 1], "Направление на медицинское освидетельствование"],
  [["mobilizaciya", 5], ["otsrochka-ot-sluzhby", 0], "Основания освобождения и отсрочки"],
  [["mobilizaciya", 6], ["uvolnenie-s-voennoy-sluzhby", 2], "Семейные обстоятельства при прохождении службы"],
  [["prizyv", 3], ["vvk-i-kategoriya-godnosti", 6], "Медицинские документы при освидетельствовании"],
  [["prizyv", 6], ["vvk-i-kategoriya-godnosti", 3], "Порядок оспаривания заключения ВВК"],
  [["prizyv", 2], ["alternativnaya-grazhdanskaya-sluzhba", 2], "Различие оснований и процедур обжалования"],
  [["otsrochka-ot-sluzhby", 1], ["vvk-i-kategoriya-godnosti", 2], "Медицинское освидетельствование и состояние здоровья"],
  [["otsrochka-ot-sluzhby", 4], ["prizyv", 8], "Обжалование отказа по призыву"],
  [["vvk-i-kategoriya-godnosti", 2], ["ranenie-travma-gospital", 5], "Связь состояния здоровья и прохождения службы"],
  [["vvk-i-kategoriya-godnosti", 3], ["sudebnaya-zashchita", 1], "Проверка возможности судебного оспаривания"],
  [["raporty-i-obrashcheniya", 4], ["sudebnaya-zashchita", 2], "Оспаривание бездействия должностного лица"],
  [["raporty-i-obrashcheniya", 2], ["disciplinarnye-vzyskaniya", 4], "Проверка нарушений порядка служебного рассмотрения"],
  [["uvolnenie-s-voennoy-sluzhby", 1], ["vvk-i-kategoriya-godnosti", 3], "Медицинское основание и документы ВВК"],
  [["uvolnenie-s-voennoy-sluzhby", 4], ["veterany-pensii-i-lgoty", 3], "Право на пенсионное обеспечение после службы"],
  [["uvolnenie-s-voennoy-sluzhby", 8], ["denezhnoe-dovolstvie", 6], "Окончательный расчёт и подтверждающие документы"],
  [["perevod-v-druguyu-chast", 2], ["vvk-i-kategoriya-godnosti", 7], "Медицинское заключение для кадрового вопроса"],
  [["otpusk-voennosluzhashchego", 3], ["raporty-i-obrashcheniya", 4], "Бездействие и отказ по служебному обращению"],
  [["denezhnoe-dovolstvie", 2], ["sudebnaya-zashchita", 0], "Определение компетентного суда для спора о выплате"],
  [["vyplaty-za-uchastie-v-svo", 4], ["sudebnaya-zashchita", 1], "Судебное оспаривание отказа при наличии оснований"],
  [["vyplaty-za-uchastie-v-svo", 6], ["denezhnoe-dovolstvie", 2], "Проверка природы и основания денежного требования"],
  [["ranenie-travma-gospital", 4], ["vvk-i-kategoriya-godnosti", 5], "Процедуры экспертизы военной травмы"],
  [["ranenie-travma-gospital", 6], ["raporty-i-obrashcheniya", 6], "Порядок обжалования отказа командования"],
  [["gibel-i-vyplaty-seme", 1], ["vyplaty-za-uchastie-v-svo", 0], "Различие видов выплат и круга получателей"],
  [["gibel-i-vyplaty-seme", 5], ["sudebnaya-zashchita", 0], "Определение надлежащего вида судопроизводства"],
  [["disciplinarnye-vzyskaniya", 5], ["sudebnaya-zashchita", 1], "Проверка способа судебного оспаривания"],
  [["samovolnoe-ostavlenie-chasti", 4], ["disciplinarnye-vzyskaniya", 0], "Разграничение дисциплинарной и уголовной процедуры"],
  [["voennaya-ipoteka-i-zhile", 4], ["uvolnenie-s-voennoy-sluzhby", 0], "Жилищные последствия основания увольнения"],
  [["voennaya-ipoteka-i-zhile", 5], ["sudebnaya-zashchita", 0], "Проверка судебной компетенции по жилищному спору"],
  [["voinskiy-uchet-i-dokumenty", 1], ["prizyv", 0], "Связь учётного статуса с воинской обязанностью"],
  [["voinskiy-uchet-i-dokumenty", 3], ["alternativnaya-grazhdanskaya-sluzhba", 0], "Различие учётной обязанности и альтернативной службы"],
  [["alternativnaya-grazhdanskaya-sluzhba", 2], ["sudebnaya-zashchita", 1], "Проверка судебного пути оспаривания"],
  [["veterany-pensii-i-lgoty", 4], ["denezhnoe-dovolstvie", 3], "Разграничение пенсионного и служебного расчёта"],
  [["veterany-pensii-i-lgoty", 5], ["gibel-i-vyplaty-seme", 0], "Различие мер поддержки членов семьи"]
];

const topicIndex = new Map(MILITARY_TOPICS.map(topic => [topic.slug, topic]));
function situationByRef([topicSlug, index]: SituationRef) {
  const topic = topicIndex.get(topicSlug);
  const situation = topic?.situations[index];
  if (!topic || !situation) throw new Error("Unknown military related-link target: " + topicSlug + "/" + index);
  return { topic, situation };
}
export function militaryTopicHref(topic: MilitaryTopic) {
  return "/voennoe-pravo/" + topic.slug + "/";
}
export function militarySituationHref(topic: MilitaryTopic, situation: MilitarySituation) {
  return militaryTopicHref(topic) + situation.slug + "/";
}

/** Show only curated, existing topic routes. */
export function getMilitaryRelatedTopics(topic: MilitaryTopic): MilitaryRelatedLink[] {
  return (RELATED_TOPICS[topic.slug] ?? []).map(slug => {
    const target = topicIndex.get(slug);
    if (!target || slug === topic.slug) throw new Error("Invalid military topic relationship: " + topic.slug + " -> " + slug);
    return {href:militaryTopicHref(target),title:target.title,
      detail:target.description,topicSlug:target.slug,kind:"topic" as const};
  });
}

/**
 * Include contextual local links, then explicit cross-topic consequences.
 * Directed fallback links are never constructed from unreviewed keyword matches.
 */
export function getMilitaryRelatedSituations(
  topic: MilitaryTopic, situation: MilitarySituation
): MilitaryRelatedLink[] {
  const currentIndex = topic.situations.findIndex(item => item.slug === situation.slug);
  if (currentIndex === -1) throw new Error("Unknown military situation: " + topic.slug + "/" + situation.slug);
  const targets = new Map<string, MilitaryRelatedLink>();
  function add(targetTopic: MilitaryTopic, targetSituation: MilitarySituation, detail: string) {
    const href = militarySituationHref(targetTopic,targetSituation);
    if (href === militarySituationHref(topic,situation)) return;
    if (!targets.has(href)) targets.set(href, {
      href,title:targetSituation.title,detail,topicSlug:targetTopic.slug,
      situationSlug:targetSituation.slug,kind:"situation"
    });
  }
  for (const sequence of SITUATION_FLOWS[topic.slug] ?? []) {
    const position = sequence.indexOf(currentIndex);
    if (position === -1) continue;
    for (const neighbor of [sequence[position - 1],sequence[position + 1]]) {
      if (neighbor === undefined) continue;
      const target = topic.situations[neighbor];
      if (!target) throw new Error("Bad same-topic relation: " + topic.slug + "/" + neighbor);
      add(topic,target,"Связанный этап или способ защиты в этой теме");
    }
  }
  for (const [a,b,detail] of CROSS_REFERENCES) {
    if (a[0] === topic.slug && a[1] === currentIndex) {
      const target = situationByRef(b); add(target.topic,target.situation,detail);
    } else if (b[0] === topic.slug && b[1] === currentIndex) {
      const target = situationByRef(a); add(target.topic,target.situation,detail);
    }
  }
  return [...targets.values()].slice(0,6);
}

/**
 * A document link exists ONLY when the real generator is implemented.
 * It points at its real on-page anchor, never an imaginary /documents/ slug.
 */
export function getMilitaryRelatedDocuments(
  topic: MilitaryTopic, situation: MilitarySituation
): MilitaryRelatedLink[] {
  const links: MilitaryRelatedLink[] = [];
  const seen = new Set<string>();
  const refs = [
    {topic,situation},
    ...getMilitaryRelatedSituations(topic,situation)
      .map(link => {
        const targetTopic = topicIndex.get(link.topicSlug);
        const targetSituation = targetTopic?.situations.find(s => s.slug === link.situationSlug);
        return targetTopic && targetSituation ? {topic:targetTopic,situation:targetSituation} : null;
      })
      .filter((item): item is {topic:MilitaryTopic;situation:MilitarySituation} => item !== null)
  ];
  for (const ref of refs) {
    const candidate = getMilitaryDocumentCandidate(ref.topic,ref.situation);
    if (!candidate) continue;
    const href = militarySituationHref(ref.topic,ref.situation) + "#military-document-preparation";
    if (seen.has(href)) continue;
    seen.add(href);
    links.push({href,title:candidate.subject,detail:ref.situation.title,
      topicSlug:ref.topic.slug,situationSlug:ref.situation.slug,kind:"document"});
  }
  return links.slice(0,4);
}

/** Complete, inspectable source graph for automated link integrity tests. */
export const MILITARY_RELATED_GRAPH = Object.freeze({
  topicSlugs: RELATED_TOPICS,
  localFlows: SITUATION_FLOWS,
  crossReferences: CROSS_REFERENCES
});

import { MILITARY_ROUTES } from "@/data/military-route-plans";

/**
 * Discovery phrases are scenario-specific and never contain questionnaire
 * answers. Preview Q&A is read-only and must not imply expert approval.
 */
export const MILITARY_RELATED_QUESTION_TOPICS: Readonly<Record<string, readonly string[]>> = {
  "service-contract/contract-check": ["условия контракта", "контракт о прохождении военной службы", "срок контракта"],
  "service-contract/service-order-copy": ["копия приказа", "копию приказа", "ознакомиться с приказом"],
  "service-contract/transfer": ["перевод военнослужащего", "перевод по службе", "перевели в другую часть"],
  "military-discharge/discharge-basis": ["увольнение с военной службы", "уволиться с военной службы", "увольнение по контракту"],
  "military-discharge/medical-discharge": ["увольнение по состоянию здоровья", "уволиться по состоянию здоровья", "увольнение по ввк"],
  "military-discharge/discharge-order": ["приказ об увольнении", "расчет при увольнении военнослужащего", "выплаты при увольнении военнослужащего"],
  "military-pay/pay-breakdown": ["денежное довольствие", "расчет денежного довольствия", "удержания из довольствия"],
  "military-pay/benefits": ["выплаты военнослужащим", "компенсации военнослужащим", "выплаты участнику сво"],
  "military-pay/family-benefits": ["выплаты семье военнослужащего", "выплаты членам семьи военнослужащего", "семье участника сво"],
  "military-medical/medical-emergency": ["медицинская помощь военнослужащему", "неоказание медицинской помощи", "медпомощь на службе"],
  "military-medical/vvk-conclusion": ["заключение ввк", "оспорить ввк", "категория годности"],
  "military-medical/independent-review": ["независимая ввк", "независимая военно врачебная экспертиза", "обжаловать ввк"],
  "command-appeal/request-explanation": ["рапорт командиру", "письменный ответ командира", "обращение к командованию"],
  "command-appeal/challenge-decision": ["обжаловать решение командира", "жалоба на командира", "обжалование действий командования"],
  "command-appeal/inaction": ["командир не отвечает", "нет ответа на рапорт", "бездействие командования"],
  "mobilization-draft/draft-notice": ["повестка в военкомат", "обжалование повестки", "повестка о призыве"],
  "mobilization-draft/deferment": ["отсрочка от мобилизации", "отсрочка от призыва", "право на отсрочку"],
  "mobilization-draft/challenge-draft": ["обжаловать решение призывной комиссии", "оспорить решение призывной комиссии", "жалоба на призывную комиссию"]
};

export function getMilitaryRelatedQuestionTopics(routeId: string, scenarioKey: string): readonly string[] {
  return MILITARY_RELATED_QUESTION_TOPICS[`${routeId}/${scenarioKey}`] ?? [];
}

export function militaryRelatedQuestionCoverageIsComplete(): boolean {
  const scenarioIds = MILITARY_ROUTES.flatMap(route =>
    route.scenarios.map(scenario => `${route.id}/${scenario.key}`)
  );
  return scenarioIds.length === 18 &&
    scenarioIds.every(id => (MILITARY_RELATED_QUESTION_TOPICS[id]?.length ?? 0) >= 2) &&
    Object.keys(MILITARY_RELATED_QUESTION_TOPICS).length === scenarioIds.length;
}

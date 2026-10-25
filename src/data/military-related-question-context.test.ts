import assert from "node:assert/strict";
import { MILITARY_ROUTES } from "@/data/military-route-plans";
import {
  getMilitaryRelatedQuestionTopics,
  militaryRelatedQuestionCoverageIsComplete,
  MILITARY_RELATED_QUESTION_TOPICS
} from "@/data/military-related-question-context";
import { getRelatedQuestions } from "@/lib/related-questions";
import type { Question } from "@/lib/types";

assert.equal(militaryRelatedQuestionCoverageIsComplete(), true);
assert.equal(Object.keys(MILITARY_RELATED_QUESTION_TOPICS).length, 18);

for (const route of MILITARY_ROUTES) {
  for (const scenario of route.scenarios) {
    const topics = getMilitaryRelatedQuestionTopics(route.id, scenario.key);
    assert.ok(topics.length >= 2, `${route.id}/${scenario.key}`);
    assert.ok(topics.every(topic => topic.length >= 8 && topic === topic.toLowerCase()));
  }
}
assert.deepEqual(getMilitaryRelatedQuestionTopics("missing-route", "unknown"), []);

function makeQuestion(id: string, title: string, category: string): Question {
  return {
    id, slug: id, title, text: title, userName: "Пользователь",
    category, isIndexable: true, status: "PUBLISHED", qualityStatus: "APPROVED",
    createdAt: "2020-01-01T00:00:00.000Z", answers: []
  };
}
const topic = getMilitaryRelatedQuestionTopics("military-medical", "vvk-conclusion");
const accepted = makeQuestion("military", "Как оспорить заключение ВВК военнослужащему?", "Военное право");
const foreign = makeQuestion("other", "Как оспорить заключение ВВК по потребительскому спору?", "Защита прав потребителей");
const unrelated = makeQuestion("unrelated", "Как разделить квартиру после развода?", "Военное право");
const selected = getRelatedQuestions({
  contextType: "problem",
  categoryName: "Военное право",
  allowedCategoryNames: ["Военное право"],
  primaryTags: [...topic],
  requiredTopicGroups: [[...topic]]
}, [accepted, foreign, unrelated], { minScore: 40, minResults: 1 });
assert.deepEqual(selected.map(question => question.id), ["military"]);

console.log("Military Q&A contexts: 18 scenarios covered, unrelated categories excluded");

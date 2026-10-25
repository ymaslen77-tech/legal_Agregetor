import Link from "next/link";
import { getMilitaryRelatedQuestionTopics } from "@/data/military-related-question-context";
import { getQuestionsMatchingPhrases } from "@/lib/repositories";
import { getRelatedQuestions } from "@/lib/related-questions";

/** Only moderated/indexable public Q&A. Never search with private intake answers. */
export async function MilitaryRelatedQuestions({
  routeId, scenarioKey
}: { routeId: string; scenarioKey: string }) {
  const topics = getMilitaryRelatedQuestionTopics(routeId, scenarioKey);
  const candidates = topics.length ? await getQuestionsMatchingPhrases([...topics], 120) : [];
  const questions = getRelatedQuestions({
    contextType: "problem",
    categoryName: "Военное право",
    allowedCategoryNames: ["Военное право"],
    primaryTags: [...topics],
    searchPhrases: [...topics],
    requiredTopicGroups: [[...topics]]
  }, candidates.filter(question =>
    question.status === "PUBLISHED" &&
    (question.qualityStatus ?? question.moderationStatus) === "APPROVED" &&
    question.isIndexable &&
    !question.hasOpenReports &&
    question.answers.length > 0
  ), { limit: 4, minScore: 40, minResults: 1 });

  return (
    <section id="military-related-questions" aria-labelledby="military-related-questions-title"
      className="mx-auto max-w-5xl border-t border-line px-4 py-7 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="military-related-questions-title" className="text-xl font-semibold text-ink">Похожие вопросы</h2>
        <Link href="/questions/" className="text-sm font-semibold text-trust underline underline-offset-2">
          Все вопросы
        </Link>
      </div>
      {questions.length ? (
        <>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {questions.map(question => (
              <li key={question.id}>
                <Link href={`/questions/${encodeURIComponent(question.slug)}/`}
                  className="flex h-full min-h-11 items-center rounded-lg border border-line bg-white px-4 py-3 text-sm font-medium leading-6 text-ink hover:border-trust hover:text-trust">
                  {question.title}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs leading-5 text-zinc-600">
            Опубликованные вопросы по схожей теме. Ответы не заменяют проверку вашей ситуации и действующих норм.
          </p>
        </>
      ) : (
        <p className="mt-3 text-sm leading-6 text-zinc-600">
          По выбранной ситуации пока нет доступных проверенных вопросов или база временно недоступна.
          Демонстрационные вопросы не показываются.
        </p>
      )}
    </section>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { buildMetadata } from "@/lib/seo";

/**
 * Navigation to the guarded browser-only draft wizard. No legal approval,
 * saved sensitive inputs, public indexing or claim of filing readiness.
 * Detailed routes remain behind the separate legal acceptance gate.
 */
const topics = [
  {
    title: "Контракт и прохождение военной службы",
    entries: [
      ["Заключение и условия контракта", "service-contract", "contract-check"],
      ["Получение копии приказа или ответа", "service-contract", "service-order-copy"],
      ["Перевод и изменение условий службы", "service-contract", "transfer"]
    ]
  },
  {
    title: "Увольнение с военной службы",
    entries: [
      ["Проверка оснований увольнения", "military-discharge", "discharge-basis"],
      ["Увольнение по состоянию здоровья", "military-discharge", "medical-discharge"],
      ["Приказ и расчёт при увольнении", "military-discharge", "discharge-order"]
    ]
  },
  {
    title: "Денежное довольствие и выплаты",
    entries: [
      ["Начисления и удержания", "military-pay", "pay-breakdown"],
      ["Компенсации и дополнительные выплаты", "military-pay", "benefits"],
      ["Выплаты членам семьи", "military-pay", "family-benefits"]
    ]
  },
  {
    title: "Военно-врачебная комиссия",
    entries: [
      ["Неотложная медицинская помощь", "military-medical", "medical-emergency"],
      ["Проверка заключения ВВК", "military-medical", "vvk-conclusion"],
      ["Независимая военно-врачебная экспертиза", "military-medical", "independent-review"]
    ]
  },
  {
    title: "Обращения и действия командования",
    entries: [
      ["Запрос письменного разъяснения", "command-appeal", "request-explanation"],
      ["Проверка порядка обжалования решения", "command-appeal", "challenge-decision"],
      ["Отсутствие ответа на обращение", "command-appeal", "inaction"]
    ]
  },
  {
    title: "Призыв, мобилизация и отсрочки",
    entries: [
      ["Повестки и решения комиссии", "mobilization-draft", "draft-notice"],
      ["Проверка возможной отсрочки", "mobilization-draft", "deferment"],
      ["Обжалование решения о призыве", "mobilization-draft", "challenge-draft"]
    ]
  }
] as const;

export const metadata: Metadata = buildMetadata({
  title: "Военное право — вопросы и жизненные ситуации",
  description: "Военное право: 18 пошаговых ситуаций с предварительными проектами документов, проверкой обстоятельств и PDF. Требуется юридическая проверка.",
  path: "/voennoe-pravo/",
  isIndexable: false
});

export default function MilitaryLawTopicsPage() {
  return (
    <>
      <Breadcrumbs items={[
        { name: "Главная", path: "/" },
        { name: "Юридические ситуации", path: "/problems/" },
        { name: "Военное право", path: "/voennoe-pravo/" }
      ]} />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <p className="text-xs font-semibold uppercase tracking-wide text-amber-900">
          Предварительный информационный раздел
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-ink">Военное право</h1>
        <p className="mt-3 max-w-4xl text-sm leading-6 text-zinc-700">
          6 направлений и 18 маршрутов. Выберите ситуацию, заполните анкету, проверьте сведения
          и сформируйте предварительный проект документа с PDF. Все результаты требуют проверки юристом и не готовы к подаче.
        </p>
        <p className="mt-3 max-w-4xl text-sm leading-6 text-zinc-700">
          Правовой статус, особый режим, сроки, адресат и порядок защиты зависят от обстоятельств.
          Сведения из ответов на вопросы не заменяют индивидуальную оценку документов юристом.
          Не публикуйте номера частей, местоположение, служебные сведения, диагнозы или чужие персональные данные.
        </p>

        <div className="mt-7 grid gap-4 md:grid-cols-2">
          {topics.map((topic) => (
            <section key={topic.title} className="rounded-lg border border-line bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-ink">{topic.title}</h2>
              <ul className="mt-3 space-y-2">
                {topic.entries.map(([label, route, scenario]) => (
                  <li key={label}>
                    <Link href={`/voennoe-pravo/marshrut/?route=${encodeURIComponent(route)}&scenario=${encodeURIComponent(scenario)}`}
                      className="flex min-h-11 items-center rounded-md border border-line px-3 py-2 text-sm leading-6 text-trust hover:border-trust hover:bg-zinc-50">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <section className="mt-8 border-t border-line pt-5" aria-label="Вопросы по военному праву">
          <h2 className="text-xl font-semibold text-ink">Похожие вопросы</h2>
          <p className="mt-2 text-sm leading-6 text-zinc-700">
            Ссылки открывают поиск по опубликованным вопросам. Если база временно недоступна,
            результаты могут не отображаться. Демонстрационные ответы не подставляются.
          </p>
          <Link href="/questions/" className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-trust underline underline-offset-2">
            Все вопросы юристам
          </Link>
        </section>
      </main>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { buildMetadata } from "@/lib/seo";

/**
 * Public informational index only. Do not import military generators, expose
 * internal Preview, register unapproved documents, or claim filing readiness.
 * Detailed routes remain behind the separate legal acceptance gate.
 */
const topics = [
  {
    title: "Контракт и прохождение военной службы",
    entries: [
      ["Заключение и условия контракта", "условия контракта военнослужащего"],
      ["Получение копии приказа или ответа", "получение копии приказа военнослужащему"],
      ["Перевод и изменение условий службы", "перевод военнослужащего"]
    ]
  },
  {
    title: "Увольнение с военной службы",
    entries: [
      ["Проверка оснований увольнения", "увольнение с военной службы"],
      ["Увольнение по состоянию здоровья", "увольнение по состоянию здоровья ВВК"],
      ["Приказ и расчёт при увольнении", "приказ об увольнении военнослужащего"]
    ]
  },
  {
    title: "Денежное довольствие и выплаты",
    entries: [
      ["Начисления и удержания", "денежное довольствие военнослужащего"],
      ["Компенсации и дополнительные выплаты", "выплаты военнослужащим"],
      ["Выплаты членам семьи", "выплаты семье военнослужащего"]
    ]
  },
  {
    title: "Военно-врачебная комиссия",
    entries: [
      ["Неотложная медицинская помощь", "медицинская помощь военнослужащему"],
      ["Проверка заключения ВВК", "заключение военно врачебной комиссии"],
      ["Независимая военно-врачебная экспертиза", "независимая ВВК"]
    ]
  },
  {
    title: "Обращения и действия командования",
    entries: [
      ["Запрос письменного разъяснения", "обращение к командованию"],
      ["Проверка порядка обжалования решения", "жалоба на командира"],
      ["Отсутствие ответа на обращение", "нет ответа на рапорт"]
    ]
  },
  {
    title: "Призыв, мобилизация и отсрочки",
    entries: [
      ["Повестки и решения комиссии", "повестка в военкомат"],
      ["Проверка возможной отсрочки", "отсрочка от мобилизации"],
      ["Обжалование решения о призыве", "оспаривание решения призывной комиссии"]
    ]
  }
] as const;

export const metadata: Metadata = buildMetadata({
  title: "Военное право — вопросы и жизненные ситуации",
  description: "Каталог тем по военному праву: контракт, увольнение, довольствие, ВВК, командование, призыв и мобилизация. Подготовка юридических маршрутов продолжается.",
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
          6 направлений и 18 тем. Выберите ситуацию, чтобы найти опубликованные вопросы пользователей.
          Автоматические юридические маршруты и документы пока проходят проверку и недоступны для подачи.
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
                {topic.entries.map(([label, query]) => (
                  <li key={label}>
                    <Link href={`/questions/?q=${encodeURIComponent(query)}`}
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

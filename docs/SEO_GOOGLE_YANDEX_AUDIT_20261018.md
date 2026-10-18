# ПравоПоиск — SEO-аудит (18 октября 2026)

**Статус:** частичный live-аудит + проверка исходного кода. Это не сертификат Google/Яндекса, не подтверждение индексации и не прогноз позиций. Исправления проводятся в отдельном PR. До выпуска на Production остаются технологические зависимости.

## Проверено по официальной документации

- Google Search Central: https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- Google canonical: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- Google Sitemap: https://developers.google.com/search/docs/crawling-indexing/sitemaps/large-sitemaps
- Google полезный контент: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Google BreadcrumbList: https://developers.google.com/search/docs/appearance/structured-data/breadcrumb
- Google Organization: https://developers.google.com/search/docs/appearance/structured-data/organization
- Google завершение search-box разметки: https://developers.google.com/search/blog/2024/10/sitelinks-search-box
- Яндекс Вебмастер индексирование: https://yandex.ru/support/webmaster/ru/recommendations/indexing
- Яндекс robots.txt: https://yandex.ru/support/webmaster/ru/controlling-robot/robots-txt
- Яндекс Schema.org: https://yandex.ru/support/webmaster/ru/schema-org/what-is-schema-org
- Яндекс проверка микроразметки: https://yandex.ru/support/webmaster/ru/yandex-indexing/validator

## Результат проверки на опубликованном Vercel-домене

| Контроль | Факт на момент проверки | Решение |
| --- | --- | --- |
| DNS pravopoisk.ru и www | Vercel config `misconfigured=false`, конфликтов не показывает | Оставить и проверить HTTPS/308 извне |
| Production `pravopoisk.vercel.app` | Главная 200, index/follow; sitemap index 6 файлов | Новый домен должен стать единственным canonical после следующей Production-сборки |
| Canonical | На Production HTML всё ещё `https://pravopoisk.vercel.app/`; обе переменные `SITE_URL`, `NEXT_PUBLIC_SITE_URL` уже обновлены на `https://pravopoisk.ru`, но их новая версия ещё не развернута | Пересобрать Production при снятии Vercel-квоты; проверить canonical/OG/sitemap/robots |
| Sitemap | 14 в pages, 46 в problems, 154 в documents, 0 в lawyers, 0 в questions; files may overlap | Устранить повторяющиеся записи; проверить отбор только реально индексируемых страниц |
| Neon | SQL `SELECT 1` — HTTP 402, превышена квота проекта | Восстановить квоту; вернуть доступ к данным и повторно проверить sitemap |
| /questions и /lawyers | HTTP 200, robots noindex при недоступной БД | Проверить данные после восстановления Neon, избегать пустых страниц и soft-404 |
| Новые юридические сценарии | 32 сценария не прошли индивидуальную юридическую приёмку; `filingReady=false` | Не открывать их для SEO до подтверждения правовых норм и полезности |
| Мобильные метрики | Viewport адаптивный; значения LCP, INP, CLS реальных посетителей не измерены | Получить CrUX/PageSpeed, оценивать 75-й перцентиль |

**Ограничения:** Данные HTML, прочитанные при обходе через Vercel authentication bypass, могут содержать `noindex` из-за добавленного технического query-параметра; нельзя приравнивать такой ответ к индексации обычной публичной страницы. Для окончательной приёмки нужны прямые запросы на публичный домен и Google Search Console / Яндекс Вебмастер.

## Исправлено в этом PR

1. Sitemap исключает URL с параметрами/фрагментами, внешние адреса и дубли; корректно экранирует XML.
2. У Organization/WebSite появился единый идентификатор `@id`; WebSite ссылается на реальную организацию в графе, указан русский язык.
3. У BreadcrumbList появился `@id`, привязанный к канонической странице.
4. Удалён неиспользуемый в Google Search с 2024 года WebSite SearchAction (не путать с реальным поиском на сайте).
5. Добавлены детерминированные тесты, выполняемые вместе с `npm test`.

## Развитие SEO (без искусственных кликов/отзывов)

- **Тематические кластеры:** ситуации → варианты решения → документы → связанные проверенные вопросы → разъяснения норм. Ссылки должны вести на реально полезные материалы.
- **Страницы доверия (YMYL):** реальные сведения о юрлице и редакционной ответственности, автор и рецензент юриста (только проверенные), дата сверки конкретных норм, ссылки на актуальный официальный первоисточник и ограничения процедуры. Перед выпуском отдельно сверить данные `src/lib/platform.ts`: реквизиты компании и адрес не должны быть вымышленными.
- **Семантика из Q&A:** использовать агрегированную статистику реальных анонимизированных вопросов для новых страниц при доказанном спросе; не публиковать массово однотипные страницы, тонкий AI-текст и персональные данные.
- **FAQ:** показывать полезный FAQ людям, но не ожидать расширенного сниппета FAQ в Google для частного юридического сайта.
- **Структурированные данные:** Organization, WebSite, BreadcrumbList; Article с реальными автором и датами только на подходящих редакционных материалах; не имитировать отзывы, рейтинг или физические филиалы.
- **Быстродействие:** измерить CrUX/PageSpeed отдельно для мобильных и desktop; целевые ориентиры LCP <= 2.5 с, INP <= 200 мс, CLS <= 0.1 в 75-м перцентиле, а не по «лабораторным» догадкам.
- **Измерение:** подтвердить владение `pravopoisk.ru` в Google Search Console / Яндекс Вебмастер, подать sitemap, снять отчёты по страницам/поисковым запросам и ошибкам; добавить Метрику только в соответствии с согласием пользователей и законодательством о персональных данных.

## Незакрытые блокеры релиза

- Neon HTTP 402. Без БД невозможно подтвердить индексируемость профилей/Q&A и корректность динамических страниц.
- Vercel ограничивает создание новых deployments на текущем тарифе (`api-deployments-free-per-day`, HTTP 402); эту доработку нельзя называть опубликованной, пока Production SHA не обновлён и не проверен.
- Полная юридическая приёмка 32 новых сценариев не завершена.
- Недоступны измеренные полевые Web Vitals и отчёты Search Console/Вебмастер; без них невозможно объявить «полное соответствие» и предсказать позиции.

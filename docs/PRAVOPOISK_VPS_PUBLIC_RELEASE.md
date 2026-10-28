# ПравоПоиск: выпуск на российский VPS без бюджета приватного GitHub Actions

Статус на 28.10.2026: **путь публикации подготовлен, НЕ подключён к Coolify до настройки двух секретов и ветки приложения**. Продуктивный сайт не изменён.

## Постоянная схема

ChatGPT / GitHub connector → `ymaslen77-tech/legal_Agregetor` (публичный) → GitHub Actions `pravopoisk-coolify-release.yml` → Coolify API `https://coolify.dgi-pravo.ru/api/v1` → существующее приложение `kb99djixwheewgcqwccw4lue` на VPS `79.133.181.192`.

GitHub Actions отправляет только управляющую команду; сборка и запуск приложения выполняются **на VPS через Coolify**. Не используются новые базы, новые приложения, Vercel, GitHub Actions из `vps-infrastructure`, OAuth-шлюзы и постоянный SSH-доступ к ChatGPT.

## Однократные действия владельца

**В Coolify** (уже работающий HTTPS `https://coolify.dgi-pravo.ru`):

1. Projects → ПравоПоиск → существующий `pravopoisk-web` → Configuration → General.
2. Подтвердить GitHub repo `ymaslen77-tech/legal_Agregetor` и домен `pravopoisk.ru`.
3. Выбрать ветку **`infra/coolify-russian-vps`**, сохранить. Сборку пока не запускать.
4. Отключить `Auto Deploy` для этого production-приложения, сохранить. Новый workflow делает контролируемый release. Другие проекты не трогать.

**В Coolify → Keys & Tokens → API Tokens**: создать два ОТДЕЛЬНЫХ токена только текущей команды Root Team, **без root**:

- `pravopoisk-github-read` с разрешением `read`: проверка UUID, репозитория, источника и результата выпуска.
- `pravopoisk-github-deploy` с разрешением `deploy`: только запуск развёртывания.

Не вставлять значения в чаты, файлы репозитория, workflow, публичные скриншоты. Coolify показывает значение токена один раз. Поставить разумный срок действия, затем своевременно заменить при истечении.

**В публичном репозитории GitHub** → Settings → Secrets and variables → Actions → New repository secret:

- `PRAVOPOISK_COOLIFY_READ_TOKEN` ← значение токена `read`.
- `PRAVOPOISK_COOLIFY_DEPLOY_TOKEN` ← значение токена `deploy`.

Не переносить существующий `root`-токен из `vps-infrastructure`: он обладает избыточными правами на другие проекты. Если необходимо изолировать ещё сильнее — хранить в GitHub Environment `pravopoisk-production`, ограничив разрешённые ветки `main`; текущий workflow использует это окружение.

## Безопасная проверка подключения

GitHub → legal_Agregetor → Actions → `Pravopoisk approved release to Russian Coolify VPS` → Run workflow, branch `main`, `operation=check`. Задание проверит доступность ветки и статус manifest **без секретов и без публикации**.

Чтобы проверить доступ к Coolify, сначала нужно завершить предрелизные проверки и включить разрешение на отдельный проверенный commit. Режим `check` не выполняет опасных операций.

## Как открывается релиз

1. Утвердить итоговый текст, каждый юридический документ и его правовую основу (новая военная ветка пока НЕ утверждена).
2. Сделать резервную копию рабочей PostgreSQL, проверить восстановимость.
3. Убедиться, что нужный код находится в `infra/coolify-russian-vps`; получить успешный `Legal reference routes CI` **для точного HEAD SHA** этой ветки.
4. Только после этих реальных проверок изменить `ops/release/pravopoisk-vps.json` в `main`: `approved=true`, `legal_reviewed=true`, `database_backup_verified=true`, `approved_sha=<полный текущий SHA VPS-ветки>`.
5. Push manifest в `main` запускает workflow. Для повторной попытки можно использовать `workflow_dispatch` с `operation=release`. Если SHA изменился или хоть одна проверка отсутствует, работа прервётся до запроса к Coolify.

Workflow запрашивает приложение и историю публикаций, сверяет домен/ветку, требует выключенный Auto Deploy, запускает **только** UUID ПравоПоиска, проверяет завершённый коммит и HTTP главной страницы, военного раздела и sitemap.

## Ограничения

- Пока отсутствует прямой доступ ChatGPT к Coolify: Github-connector позволяет менять код и manifest, но не показывает значение Secrets и не обходит ограничений тарифов GitHub Actions для приватных репозиториев.
- Прямое переключение ветки Coolify и добавление токенов здесь не произведены. Отсутствие токенов блокирует запуск; это намеренно безопасно.
- Ни успешный CI, ни факт запуска workflow не доказывают, что **новый юридический текст проверен**. Утверждение выпуска требует отдельной фактической проверки.
- Публичные GitHub-hosted runners обычно не списывают минуты с лимита приватных репозиториев, но зависят от политики GitHub и настроек аккаунта.

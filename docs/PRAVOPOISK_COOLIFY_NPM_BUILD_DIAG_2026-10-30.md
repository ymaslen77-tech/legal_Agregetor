# Ускорение сборки ПравоПоиска в Coolify — 30 октября 2026

## Наблюдаемые факты
В логе сборки коммита 7c32e09 шаг Docker `RUN npm install` занял 3017 секунд (~50 минут) для 451 пакета. Позднее сборка перешла к `npx prisma generate`. Предупреждения `jpeg-exif` и `crypto-js` не являются причиной остановки. В предыдущем журнале Coolify вызывал `docker build --no-cache`. Другие проекты ДГИ/Суды используют pnpm; прямое сравнение времени некорректно.

## Исправлено в Dockerfile
- Используется `npm ci` со строго зафиксированным `package-lock.json` вместо `npm install`.
- `--prefer-offline` ускоряет повторные установки из уже скачанных tarball, но при пустом кэше продолжит обращаться в сеть.
- `--no-audit --no-fund` отключает сетевой audit при **установке**, не выполняет обновления уязвимых пакетов и не отменяет отдельный security audit.
- `RUN --mount=type=cache,id=pravopoisk-npm,target=/root/.npm,sharing=locked` сохраняет npm-кэш между сборками одного BuildKit builder. Docker может очищать его при нехватке места; при первом запуске он пуст.
- `COPY package.json package-lock.json` изолирует слой зависимостей от изменений приложения.
- Новый test workflow выполняет только `docker build --target deps`, НЕ деплоит сайт.

## После завершения текущей сборки
1. Coolify > pravopoisk-web > Advanced > Build cache: выбрать **Use Docker build cache**, а не **Rebuild from scratch every time**.
2. Из меню Redeploy выбрать обычный **Redeploy**, не **Force deploy (without cache)**. Не запускать одновременно несколько сборок.
3. Проверить, что переменная называется именно `ENABLE_MILITARY_PUBLIC_DRAFTS=true` и доступна во время сборки и runtime. После изменения build-time значения нужен новый Docker image.
4. В Deployment Logs проверить `npm ci`, `npx prisma generate`, `npm run build` и завершение контейнерного деплоя.
5. Если первая установка с новым кэшем всё ещё занимает десятки минут, в терминале **хоста VPS** проверить `curl -I --max-time 15 https://registry.npmjs.org/next` и нагрузку. Консоль внутри приложения не содержит Docker CLI.
6. `npm audit` запускать отдельно в проверочной среде; вывод "15 vulnerabilities" требует анализа без `npm audit fix --force`.

Публикация этого исправления в GitHub не запускает Coolify и не означает выпуск 121 генератора. Не выполнять принудительное удаление контейнеров или базы.

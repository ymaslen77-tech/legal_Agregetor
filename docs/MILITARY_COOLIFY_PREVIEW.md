# Military-law preview deployment on the Russian VPS (Coolify)

**Status:** deployment runbook; does not mean the website is deployed. **No Vercel.**
The current catalog and draft-generator branch is `feature/military-rebuild-from-zero-20261027`.

## Target and isolation

1. In the **existing Russian Coolify instance**, create a **separate application** from the existing GitHub repo `ymaslen77-tech/legal_Agregetor`. Do not modify or delete the current production application.
2. Choose the exact feature branch and Dockerfile from the repository root. Expose the application's internal port **3000** to Coolify's existing reverse proxy (do **not** bind host ports 80/443; the production proxy owns them).
3. Assign an actual **preview domain issued/configured in Coolify**. Do not point `pravopoisk.ru` or its `www` name to this preview. The hostname cannot be inferred from the Git branch.
4. Set `SITE_URL` and `NEXT_PUBLIC_SITE_URL` to that **actual** preview URL (no trailing slash). Keep other required environment variables as **Coolify secrets**; never publish values in Git logs, tickets or comments.
5. Use a separate, sanitized **staging PostgreSQL database** where possible. Do not run `prisma db seed` or any destructive task on production. If a production DB must be consulted, use a preconfigured, minimally privileged read-only connection for public Q&A data only; the app's other routes may require additional permissions, so a staging copy is preferable.
6. Do not use production storage volumes for a preview. Configure independent storage if the preview exercises uploaded files.
7. Disable automatic production releases for this branch. Preview deployment is intended only for QA.

## Verification before sharing preview URL

- GitHub-only CI: `npm ci`, `npm run prisma:generate`, `npm run typecheck`, `npm run lint`, `npm run test:military`, `npm run build`.
- Verify `/voennoe-pravo/` returns 200 and lists all **20 thematic groups**.
- Verify topic pages and all **143 situations** render without server errors or duplicate slugs.
- Verify at least one information-only page has **no document input**.
- Verify an explicitly allowed document situation has minimal document requisites and downloads a **real PDF and DOCX** marked **not filing-ready**.
- Verify legacy links redirect correctly and production family/labor pages are unchanged.
- Verify legal sources, text adequacy, amounts, deadlines, proper recipients, and procedural competence *per individual situation* before enabling search indexing.
- Review Next.js server and proxy logs; ensure no user-submitted personal or military information is logged.
- Test both desktop and mobile at the **real** Coolify preview address.

## Publication guardrail

The branch is not approved as legally complete. Current case content is based on
topic-level legal guidance, with only 18 conservative draft-document candidates
and **no filing-ready document certification**. The historical Q&A category has
not yet been verified question-by-question. Keep `noindex` until legal review,
content quality and SEO acceptance pass.

Only after successful tests and legal acceptance should a reviewed commit be
merged to `main` and the **existing Coolify production resource** deployed
from that exact commit. Do not redeploy via the legacy Vercel project.

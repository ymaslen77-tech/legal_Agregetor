# Neon production database — migration and verification

The production application's PostgreSQL backend is Neon project `purple-sun-53026244`,
database `pravopoisk_import_20261014`, branch `main` (PostgreSQL 16).
The original Docker PostgreSQL and its `pg_dump -Fc` archive remain the
offline rollback/source of truth until a live acceptance test is completed.

## Restored application data

Verified on 2026-10-14 after archive restore and applying the final
`20261014180000_saved_legal_documents` schema migration:

| Relation | Rows |
| --- | ---: |
| `Question` | 171643 |
| `Answer` | 171643 |
| `Lawyer` | 216 |
| `LawyerProfile` | 216 |
| `User` | 218 |
| `City` | 36 |
| `Service` | 76 |
| `Article` | 6 |

The database contains 53 public tables and 21 applied Prisma migrations.
There were no invalid indexes or unvalidated foreign keys at verification time.
The previous Neon database `pravopoisk` is retained separately as a
schema-only instance, not the production data store.

## Vercel application configuration

Vercel project `pravopoisk` uses an encrypted `DATABASE_URL` pointing
to the imported Neon database. The URL must be managed in Vercel's
environment settings and must never be committed. A new production
deployment is required for any changed environment variables to take effect.
Validate the production deployment's commit, readiness, runtime errors,
and data-backed pages before declaring the cutover complete.

`JWT_SECRET`, `AUTH_SECRET`, and `DOCUMENT_STORAGE_KEY` must remain
private; changing the document encryption key after documents have been
saved will make existing versions unreadable without re-encryption.

## Data safety / ongoing operations

- Do **not** run `prisma db seed` on production: `prisma/seed.ts` calls
  `clearData()` and deletes existing application rows.
- Use version-controlled `prisma migrate deploy` for future schema changes.
  Do not use `prisma db push` against the production database.
- Do not remove the local Docker database, recovery database, backup file,
  or original volumes until application acceptance and a tested rollback.
- PostgreSQL backups do not include the contents of `public/uploads` or
  the Docker `lead_attachments` volume. Migrate those separately if they
  contain real uploaded documents.
- For final acceptance, compare row counts in every source and target
  application table, test relationships, review login and owner isolation,
  and check user-visible lawyer listings and Q&A pages.

// Read-only inspection only. Synthetic legal answers must never be falsely
// attributed to real lawyers: previous --apply functionality is retired.

import { PrismaClient } from "@prisma/client";
import { getHarantSpecializationAliases, normalizeHarantCategoryName } from "../src/lib/harant-question-categories";

const prisma = new PrismaClient();
if (process.argv.includes("--apply")) {
  console.error("REFUSED: cannot attribute synthetic answers to real lawyers.");
  process.exit(2);
}
const APPLY = false;
const FAKE_PREFIXES = ["dev-city-lawyer", "demo-lawyer", "sample-lawyer"];
const isFake = (slug: string) => FAKE_PREFIXES.some((p) => slug.startsWith(p));

function hashString(value: string) {
  let h = 2166136261;
  for (const c of value) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); }
  return Math.abs(h >>> 0);
}

(async () => {
  const allLawyers = await prisma.lawyer.findMany({
    where: { active: true, blocked: false, profileStatus: "APPROVED" },
    include: { services: { include: { service: true } } }
  });
  const real = allLawyers.filter((l) => !isFake(l.slug)).sort((a, b) => hashString(a.id) - hashString(b.id));
  const fakeIds = new Set((await prisma.lawyer.findMany({ where: {}, select: { id: true, slug: true } })).filter((l) => isFake(l.slug)).map((l) => l.id));
  if (!real.length) throw new Error("No real lawyers to reassign to.");
  console.log(`Real lawyers: ${real.length}, fake lawyers: ${fakeIds.size}`);

  function pickReal(categoryName: string | null, idx: number) {
    if (categoryName) {
      const names = new Set([categoryName, ...getHarantSpecializationAliases(categoryName)].map(normalizeHarantCategoryName));
      const cands = real.filter((l) => l.services.some((s) => names.has(normalizeHarantCategoryName(s.service.name))));
      if (cands.length) return cands[idx % cands.length];
    }
    return real[idx % real.length];
  }

  // Pull answers on fake lawyers with their question category, in batches.
  const BATCH = 2000;
  let processed = 0;
  let reassigned = 0;
  const catCounter = new Map<string, number>();
  for (let skip = 0; ; skip += BATCH) {
    const answers = await prisma.answer.findMany({
      where: { lawyerId: { in: [...fakeIds] } },
      select: { id: true, question: { select: { service: { select: { name: true } } } } },
      orderBy: { id: "asc" },
      take: BATCH,
      skip
    });
    if (!answers.length) break;
    processed += answers.length;

    const updates: { id: string; lawyerId: string }[] = [];
    for (const a of answers) {
      const cat = a.question?.service?.name ?? null;
      const key = cat ?? "_";
      const idx = catCounter.get(key) ?? 0;
      catCounter.set(key, idx + 1);
      updates.push({ id: a.id, lawyerId: pickReal(cat, idx).id });
    }

    // READ ONLY: no answer writes or changes to attributed authorship.
    reassigned += updates.length;
    if (processed % 10000 < BATCH) console.log(`  processed ${processed}, reassigned ${reassigned}`);
  }

  console.log(`${APPLY ? "REASSIGNED" : "WOULD REASSIGN"}: ${reassigned} answers from fake -> real lawyers`);
  await prisma.$disconnect();
})().catch((e) => { console.error(e); process.exit(1); });

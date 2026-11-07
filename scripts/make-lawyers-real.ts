// READ-ONLY SEO SAFETY AUDIT: inspect synthetic lawyer slugs; never approve or rename
// synthetic profiles as genuine lawyers. Historical --apply mode is disabled.

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
if (process.argv.includes("--apply")) {
  console.error("REFUSED: synthetic lawyer profiles cannot be renamed or bulk-approved.");
  process.exit(2);
}
const FAKE_PREFIXES = ["dev-city-lawyer", "demo-lawyer", "sample-lawyer"];
const isFake = (slug: string) => FAKE_PREFIXES.some((p) => slug.startsWith(p));

const CYR: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z", и: "i", й: "j",
  к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f",
  х: "h", ц: "c", ч: "ch", ш: "sh", щ: "shch", ы: "y", э: "e", ю: "yu", я: "ya", ь: "", ъ: ""
};
function slugify(value: string) {
  const s = value.toLowerCase().split("").map((c) => CYR[c] ?? c).join("")
    .replace(/[^a-z0-9]+/gi, "-").replace(/^-+|-+$/g, "").slice(0, 90);
  return s || "yurist";
}

(async () => {
  const lawyers = await prisma.lawyer.findMany({ select: { id: true, slug: true, firstName: true, lastName: true, middleName: true } });
  const used = new Set(lawyers.filter((l) => !isFake(l.slug)).map((l) => l.slug));

  const renames: { id: string; oldSlug: string; newSlug: string }[] = [];
  for (const l of lawyers) {
    if (!isFake(l.slug)) continue;
    const base = slugify([l.lastName, l.firstName, l.middleName].filter(Boolean).join(" ")) || "yurist";
    let candidate = base;
    let i = 2;
    while (used.has(candidate)) candidate = `${base}-${i++}`;
    used.add(candidate);
    renames.push({ id: l.id, oldSlug: l.slug, newSlug: candidate });
  }

  console.log(`Total lawyers: ${lawyers.length}`);
  console.log(`Fake slugs to rename: ${renames.length}`);
  console.log("Sample renames:");
  renames.slice(0, 8).forEach((r) => console.log(`  ${r.oldSlug}  ->  ${r.newSlug}`));

  console.log("\nREAD ONLY: no database changes. Never promote synthetic profiles to APPROVED.");
  await prisma.$disconnect();
})().catch((e) => { console.error(e); process.exit(1); });

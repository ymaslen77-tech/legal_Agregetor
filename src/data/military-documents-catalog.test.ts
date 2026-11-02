import assert from "node:assert/strict";
import { militaryDocumentsCatalog } from "@/data/military-documents-catalog";
import { MILITARY_TOPICS } from "@/data/military-catalog";
import { MILITARY_DOCUMENT_TARGETS } from "@/data/military-document-target-matrix";
import { navigatorDocuments } from "@/data/documents";

// The unified catalog contains all 121 distinct military draft generators,
// but it never fabricates 121 separate /documents/[slug] pages.
assert.equal(militaryDocumentsCatalog.length, 121, "Expected all 121 military generators");
assert.equal(MILITARY_DOCUMENT_TARGETS.length, 121);
assert.equal(new Set(militaryDocumentsCatalog.map(item => item.slug)).size, 121);
assert.equal(new Set(militaryDocumentsCatalog.map(item => item.href)).size, 121);
assert.equal(new Set(militaryDocumentsCatalog.map(item => item.category)).size, 20);
assert.equal(MILITARY_TOPICS.length,20);

for (const row of militaryDocumentsCatalog) {
  const target = MILITARY_DOCUMENT_TARGETS.find(item => item.documentSlug === row.slug);
  assert(target, "Missing source row " + row.slug);
  const topic = MILITARY_TOPICS.find(item => item.slug === target.categorySlug);
  assert(topic, "Unknown category " + target.categorySlug);
  const situation = topic.situations.find(item => item.slug === target.situationSlug);
  assert(situation && situation.kind !== "information", "Information-only situation must not be shown as document");
  assert.equal(row.href, `/voennoe-pravo/${topic.slug}/${situation.slug}/`);
  assert.equal(row.title, target.documentTitle);
  assert.equal(row.category, topic.title);
  assert.equal(row.lawArea, "Военное право");
  assert(row.shortDescription.includes("юридических оснований"));
  assert(!row.href.startsWith("/documents/"),"No orphan document page may be added");
}
assert.equal(MILITARY_TOPICS.flatMap(topic => topic.situations).filter(s => s.kind === "information").length, 22);
assert(navigatorDocuments.every(item => !militaryDocumentsCatalog.some(military=>military.slug===item.slug)));
console.log("PASS: 121 military generators, 20 categories, 22 informational situations excluded, all original catalog pages preserved.");

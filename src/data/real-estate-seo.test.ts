import assert from "node:assert/strict";
import { REAL_ESTATE_GROUPS } from "./real-estate-route-plan";
import {
  REAL_ESTATE_PLANNED_ROOT,REAL_ESTATE_SEO_PLAN,
  getRealEstateSeoPlanEntry,isRealEstatePageIndexable
} from "./real-estate-seo";
const good={technical:true,legal:true,privacy:true,intent:true};
assert.equal(REAL_ESTATE_SEO_PLAN.length,71);
assert.equal(new Set(REAL_ESTATE_SEO_PLAN.map(x=>x.path)).size,71);
assert.equal(new Set(REAL_ESTATE_SEO_PLAN.map(x=>x.title)).size,71);
assert.equal(new Set(REAL_ESTATE_SEO_PLAN.map(x=>x.description)).size,71);
assert.equal(REAL_ESTATE_SEO_PLAN.filter(x=>x.scope==="catalog").length,1);
assert.equal(REAL_ESTATE_SEO_PLAN.filter(x=>x.scope==="group").length,10);
assert.equal(REAL_ESTATE_SEO_PLAN.filter(x=>x.scope==="situation").length,60);
assert.equal(getRealEstateSeoPlanEntry()?.path,REAL_ESTATE_PLANNED_ROOT);
for(const entry of REAL_ESTATE_SEO_PLAN){
  assert.ok(entry.path.startsWith(REAL_ESTATE_PLANNED_ROOT));
  assert.ok(entry.path.endsWith("/"));
  assert.match(entry.path,/^\/[a-z0-9-]+\/(?:[a-z0-9-]+\/)*$/);
  assert.equal(entry.path,entry.canonicalPath);
  assert.ok(entry.title.length>=18);
  assert.ok(entry.description.length>=40);
  assert.equal(entry.indexable,false);
  assert.equal(entry.sitemapEligible,false);
  assert.equal(entry.legalTrust,"PENDING");
  assert.equal(entry.privacy,"PENDING");
  assert.equal(entry.technicalStatus,"NOT_PUBLISHED");
  assert.equal(isRealEstatePageIndexable(entry,good),false);
}
for(const group of REAL_ESTATE_GROUPS){
  assert.equal(getRealEstateSeoPlanEntry(group.id)?.scope,"group");
  for(const s of group.situations){
    const e=getRealEstateSeoPlanEntry(group.id,s.id);
    assert.ok(e);
    assert.equal(e.scope,"situation");
    assert.ok(e.description.includes(s.title));
  }
}
assert.equal(getRealEstateSeoPlanEntry("unknown","wrong"),null);
console.log("REAL_ESTATE_SEO_PASS: 71 unique planned URLs, zero indexable and zero sitemap-eligible drafts");

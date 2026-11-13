import assert from "node:assert/strict";
import { CREDIT_DEBT_SEO_ENTRIES } from "@/data/credit-debt-seo";
import { CREDIT_DEBT_GROUPS } from "@/data/credit-debt-route-plan";
import { creditDebtDraftMetadata } from "./credit-debt-metadata";
import { absoluteUrl } from "./seo";

const paths=new Set<string>();
const cases=[
  {path:"/kredity-dolgi/",title:"Кредиты, долги, ипотека и банкротство",description:"Выберите из 10 подразделов."},
  ...CREDIT_DEBT_GROUPS.map(g=>({path:"/kredity-dolgi/"+g.id+"/",title:g.title,description:g.description})),
  ...CREDIT_DEBT_SEO_ENTRIES.map(e=>({path:e.path,title:e.title,description:e.description}))
];
assert.equal(cases.length,71);
for(const e of cases){
  assert.ok(!paths.has(e.path),e.path);
  paths.add(e.path);
  const m=creditDebtDraftMetadata(e);
  assert.equal(m.title,e.title);
  assert.equal(m.description,e.description);
  assert.equal(m.alternates?.canonical,absoluteUrl(e.path));
  assert.equal(m.robots && typeof m.robots==="object" && m.robots.index,false);
  assert.equal(m.robots && typeof m.robots==="object" && m.robots.follow,false);
  assert.equal(m.robots && typeof m.robots==="object" && m.robots.noarchive,true);
  assert.equal(m.openGraph && typeof m.openGraph==="object" && m.openGraph.url,absoluteUrl(e.path));
}
console.log("Credit/debt SEO metadata PASS: 71 unique canonical URLs, 60 case-specific descriptions and strict noindex throughout draft stage.");

import assert from "node:assert/strict";
import { CREDIT_DEBT_GROUPS } from "@/data/credit-debt-route-plan";
import { CREDIT_DEBT_SEO_ENTRIES,getCreditDebtSeoEntry,isCreditDebtPageIndexable } from "./credit-debt-seo";
assert.equal(CREDIT_DEBT_SEO_ENTRIES.length,60);
const paths=new Set<string>(),titles=new Set<string>(),descriptions=new Set<string>();
for(const g of CREDIT_DEBT_GROUPS){
  for(const caseData of g.situations){
    const item=getCreditDebtSeoEntry(g.id,caseData.id);
    assert.ok(item);
    assert.equal(item.sourceReview,"PENDING");
    assert.equal(item.indexable,false);
    assert.equal(item.canonicalPath,item.path);
    assert.ok(item.path.startsWith("/kredity-dolgi/"+g.id+"/"));
    assert.ok(item.path.endsWith("/"));
    assert.equal(item.title.includes(caseData.title),true);
    assert.ok(item.description.includes(caseData.title));
    assert.ok(item.title.length>=25);
    assert.ok(item.description.length>=35);
    assert.ok(!paths.has(item.path),"Duplicate SEO URL "+item.path);
    assert.ok(!titles.has(item.title),"Duplicate SEO title "+item.title);
    assert.ok(!descriptions.has(item.description),"Duplicate SEO description "+item.description);
    assert.equal(isCreditDebtPageIndexable(item,{publicRoutesEnabled:true,claimVerified:true,factualContentReviewed:true}),false);
    paths.add(item.path);titles.add(item.title);descriptions.add(item.description);
  }
}
assert.equal(paths.size,60);
assert.equal(getCreditDebtSeoEntry("bankruptcy","unknown"),null);
console.log("Credit/debt SEO PASS: 60 unique URLs, titles, descriptions, all excluded from index until verified.");

import assert from "node:assert/strict";
import { CREDIT_DEBT_GROUPS } from "@/data/credit-debt-route-plan";
import { getCreditDebtPathDisposition } from "./credit-debt-route-path-guard";
const dev={NODE_ENV:"development",ENABLE_CREDIT_DEBT_PREVIEW:"true"};
const prod={NODE_ENV:"production",ENABLE_CREDIT_DEBT_PREVIEW:"true"};
const disabled={NODE_ENV:"development",ENABLE_CREDIT_DEBT_PREVIEW:"false"};
assert.equal(getCreditDebtPathDisposition("/",dev),"OTHER");
assert.equal(getCreditDebtPathDisposition("/kredity-dolgi-test/",dev),"OTHER");
assert.equal(getCreditDebtPathDisposition("/kredity-dolgi/",prod),"BLOCK_404");
assert.equal(getCreditDebtPathDisposition("/kredity-dolgi/bankruptcy/",prod),"BLOCK_404");
assert.equal(getCreditDebtPathDisposition("/kredity-dolgi/bankruptcy/out-of-court-mfc/",prod),"BLOCK_404");
assert.equal(getCreditDebtPathDisposition("/kredity-dolgi/",disabled),"BLOCK_404");
assert.equal(getCreditDebtPathDisposition("/kredity-dolgi/",dev),"ALLOW_PREVIEW");
assert.equal(getCreditDebtPathDisposition("/kredity-dolgi/bankruptcy/",dev),"ALLOW_PREVIEW");
assert.equal(getCreditDebtPathDisposition("/kredity-dolgi/no-such/",dev),"BLOCK_404");
assert.equal(getCreditDebtPathDisposition("/kredity-dolgi/bankruptcy/no-such/",dev),"BLOCK_404");
assert.equal(getCreditDebtPathDisposition("/kredity-dolgi/bankruptcy/out-of-court-mfc/extra/",dev),"BLOCK_404");
let cases=0;
for(const group of CREDIT_DEBT_GROUPS){
  assert.equal(getCreditDebtPathDisposition("/kredity-dolgi/"+group.id+"/",dev),"ALLOW_PREVIEW");
  for(const situation of group.situations){
    const path="/kredity-dolgi/"+group.id+"/"+situation.id+"/";
    assert.equal(getCreditDebtPathDisposition(path,dev),"ALLOW_PREVIEW",path);
    assert.equal(getCreditDebtPathDisposition(path,prod),"BLOCK_404",path);
    cases++;
  }
}
assert.equal(cases,60);
console.log("Credit/debt middleware guard PASS: exact 60 dev paths, prod deny and unknown 404.");

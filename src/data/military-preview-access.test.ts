import assert from "node:assert/strict";
import {isMilitaryDraftPreviewEnabled,isMilitaryPublicDraftEnabled,isMilitaryDraftWorkbenchEnabled} from "@/data/military-preview-access";
const prod={NODE_ENV:"production",ENABLE_MILITARY_PUBLIC_DRAFTS:"true"};
const dev={NODE_ENV:"development",ENABLE_MILITARY_DRAFT_PREVIEW:"true"};
assert.equal(isMilitaryDraftPreviewEnabled(dev),true);
assert.equal(isMilitaryDraftPreviewEnabled(prod),false);
assert.equal(isMilitaryPublicDraftEnabled(prod),true);
assert.equal(isMilitaryPublicDraftEnabled(dev),false);
assert.equal(isMilitaryDraftWorkbenchEnabled(prod),true);
assert.equal(isMilitaryDraftWorkbenchEnabled(dev),true);
for(const env of [
  {NODE_ENV:"production",ENABLE_MILITARY_DRAFT_PREVIEW:"true"},
  {NODE_ENV:"production"},{NODE_ENV:"production",ENABLE_MILITARY_PUBLIC_DRAFTS:"false"},
  {NODE_ENV:"production",ENABLE_MILITARY_PUBLIC_DRAFTS:"TRUE"},
  {NODE_ENV:"development",ENABLE_MILITARY_PUBLIC_DRAFTS:"true"},
  {NODE_ENV:"test",ENABLE_MILITARY_PUBLIC_DRAFTS:"true"}
])assert.equal(isMilitaryDraftWorkbenchEnabled(env),false);
console.log(JSON.stringify({productionFlagOptIn:true,defaultOff:true,devIsolated:true}));

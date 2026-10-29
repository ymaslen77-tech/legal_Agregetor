import assert from "node:assert/strict";
import {isMilitaryDraftPreviewEnabled} from "@/data/military-preview-access";
assert.equal(isMilitaryDraftPreviewEnabled({NODE_ENV:"production",ENABLE_MILITARY_DRAFT_PREVIEW:"true"}),false);
assert.equal(isMilitaryDraftPreviewEnabled({NODE_ENV:"development",ENABLE_MILITARY_DRAFT_PREVIEW:"false"}),false);
assert.equal(isMilitaryDraftPreviewEnabled({NODE_ENV:"development"}),false);
assert.equal(isMilitaryDraftPreviewEnabled({NODE_ENV:"development",ENABLE_MILITARY_DRAFT_PREVIEW:"true"}),true);
console.log(JSON.stringify({developmentPreviewGate:true,publicReleaseBlocked:true}));

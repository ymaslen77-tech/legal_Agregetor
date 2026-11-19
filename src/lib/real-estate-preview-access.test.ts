import assert from "node:assert/strict";
import { isRealEstatePreviewEnabled } from "./real-estate-preview-access";
assert.equal(isRealEstatePreviewEnabled({NODE_ENV:"development",ENABLE_REAL_ESTATE_PREVIEW:"true"}),true);
assert.equal(isRealEstatePreviewEnabled({NODE_ENV:"development",ENABLE_REAL_ESTATE_PREVIEW:"false"}),false);
assert.equal(isRealEstatePreviewEnabled({NODE_ENV:"production",ENABLE_REAL_ESTATE_PREVIEW:"true"}),false);
assert.equal(isRealEstatePreviewEnabled({NODE_ENV:"production",ENABLE_REAL_ESTATE_PREVIEW:"false"}),false);
assert.equal(isRealEstatePreviewEnabled({NODE_ENV:"test",ENABLE_REAL_ESTATE_PREVIEW:"true"}),false);
assert.equal(isRealEstatePreviewEnabled({}),false);
console.log("Real-estate preview access PASS: development-only, explicit opt-in, never production");

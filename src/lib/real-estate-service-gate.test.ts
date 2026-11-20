import assert from "node:assert/strict";
import { REAL_ESTATE_PUBLICATION_GATE } from "@/data/real-estate-route-plan";
import { createRealEstateDraftPrototype } from "@/lib/real-estate-document-core";
import { getRealEstateIntakeSpec } from "@/lib/real-estate-intake";
import { validateSavedDocument } from "@/lib/saved-document-validation";
import { canUseRealEstateServerServices } from "./real-estate-service-gate";

assert.equal(REAL_ESTATE_PUBLICATION_GATE.personalDataCollectionAllowed,false);
assert.equal(REAL_ESTATE_PUBLICATION_GATE.publicUrlsEnabled,false);
for(const env of [
  {},
  {NODE_ENV:"development",ENABLE_REAL_ESTATE_PERSISTENCE:"true"},
  {NODE_ENV:"production",ENABLE_REAL_ESTATE_PERSISTENCE:"false"},
  {NODE_ENV:"production",ENABLE_REAL_ESTATE_PERSISTENCE:"true"}
]){
  assert.equal(canUseRealEstateServerServices(env),false);
  const spec=getRealEstateIntakeSpec("shared-ownership","share-sale");
  assert.ok(spec);
  const answers:Record<string,string>={};
  for(const field of spec.fields)if(field.required){
    answers[field.key]=field.kind==="choice"?field.choices![0]:
      "Условные фактические обстоятельства без персональных данных";
  }
  const result=createRealEstateDraftPrototype({
    groupId:"shared-ownership",situationId:"share-sale",values:answers
  }).documentResult;
  assert.equal(validateSavedDocument(result,env),null,
    "No production or development environment flag may override the legal/privacy gate");
}
console.log("REAL_ESTATE_SERVICE_GATE_PASS: private 60-case route cannot persist or transfer a draft before release approval");

import assert from "node:assert/strict";
import {
  getMilitaryFamilyParityInventory,
  MILITARY_FAMILY_PARITY_VERSION,
  type MilitaryDocumentSpecification
} from "@/data/military-family-parity-contract";
import { documentResultSchema, DOCUMENT_RESULT_CONTRACT_VERSION } from "@/lib/document-result-contract";

const current = getMilitaryFamilyParityInventory();
assert.equal(current.version, MILITARY_FAMILY_PARITY_VERSION);
assert.equal(current.total.categories, 20);
assert.equal(current.total.situations, 143);
assert.equal(current.total.information + current.total.potentialDocuments, current.total.situations);
assert.equal(current.total.draftGenerators + current.total.missingDocumentGenerators, current.total.potentialDocuments);
assert(current.total.draftGenerators >= 18, "Previously working 18 generators regressed");
assert.equal(current.categories.length, 20);
for(const category of current.categories){
  assert(category.situationCount>0);
  assert(category.draftGeneratorCount<=category.potentialDocumentCount);
  assert(category.legallyReviewedCount<=category.situationCount);
}

// The exact family DOCUMENT_RESULT_V1 envelope already accepts a military route.
// This is an interface test, NOT a claim that a military document is legally valid.
const synthetic: MilitaryDocumentSpecification = {
  categorySlug:"test-only",situationSlug:"test-only",kind:"RAPORT",
  documentSlug:"synthetic-raport",title:"Технический тест",
  selectedSituationIsImplicit:true,
  requiredInputs:[{key:"applicant",label:"Заявитель",required:true,type:"text"}],
  documentRequest:"Тестовый запрос, не предназначенный для использования",
  competentRecipientRule:"Требует юридической проверки",
  verifiedLegalRules:[],expectedAttachments:[],reviewStatus:"PENDING",
  resultKind:"DRAFT",filingReady:false,requiresLegalReview:true,
  canonicalDocumentUrl:"/documents/synthetic-raport/",
  relatedSituationUrls:[]
};
const result = documentResultSchema.parse({
  contractVersion:DOCUMENT_RESULT_CONTRACT_VERSION,
  versionId:"550e8400-e29b-41d4-a716-446655440000",
  createdAt:"2026-10-28T00:00:00.000Z",
  categorySlug:"voennoe-pravo",
  routeSlug:synthetic.categorySlug,
  scenarioKey:synthetic.situationSlug,
  documentSlug:synthetic.documentSlug,
  resultKind:synthetic.resultKind,
  source:"DETERMINISTIC",
  documentTitle:synthetic.title,
  documentText:synthetic.documentRequest,
  usedRuleIds:[],
  placeholders:[],
  legalRegistryReviewedAt:null,
  generatorVersion:"military-parity-test",
  filingReady:false,
  requiresLegalReview:true
});
assert.equal(result.filingReady,false);
assert.equal(result.legalRegistryReviewedAt,null);
assert.equal(result.documentSlug,synthetic.documentSlug);
console.log(JSON.stringify({familyContractCompatible:true,...current.total}));

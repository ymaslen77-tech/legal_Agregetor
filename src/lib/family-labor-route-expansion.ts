import {getFamilyLaborPlan,type FamilyLaborPlan} from "@/data/family-labor-route-expansion";
export type FamilyLaborIntake = {
  missing:string[]; invalid:string[]; dataComplete:boolean; emergencyFirst:boolean;
  legalReviewRequired:true; publicEnabled:false; documentGenerationAllowed:false; filingReady:false;
};
/** A completed intake is NOT authorization to generate or submit documents. */
export function validateFamilyLaborIntake(plan:FamilyLaborPlan,scenarioKey:string,answers:Record<string,string|undefined>):FamilyLaborIntake {
  const scenario=plan.scenarios.find(item=>item.key===scenarioKey);
  if(!scenario)throw new Error("Unknown family/labor scenario "+plan.id+"/"+scenarioKey);
  const definitions=new Map(plan.fields.map(item=>[item.key,item]));
  const missing:string[]=[],invalid:string[]=[];
  for(const key of scenario.requiredFields){
    const field=definitions.get(key);
    if(!field)throw new Error("Unregistered intake field "+plan.id+"/"+key);
    const value=(answers[key]??"").trim();
    if(!value){missing.push(key);continue;}
    if(value.length>2000||(field.options&&!field.options.includes(value)))invalid.push(key);
  }
  return {missing,invalid,dataComplete:missing.length===0&&invalid.length===0,
    emergencyFirst:scenario.emergencyFirst,legalReviewRequired:true,
    publicEnabled:false,documentGenerationAllowed:false,filingReady:false};
}
export function validateFamilyLaborIntakeById(id:string,key:string,answers:Record<string,string|undefined>):FamilyLaborIntake{
  const plan=getFamilyLaborPlan(id);
  if(!plan)throw new Error("Unknown family/labor plan "+id);
  return validateFamilyLaborIntake(plan,key,answers);
}

import type {ReactNode} from "react";
import Link from "next/link";
import {getFamilyLaborPlans} from "@/data/family-labor-route-expansion";
import {familyLaborCategory,getFamilyLaborDocumentSlug} from "@/data/family-labor-implemented-routes";
import {FamilyLaborDocumentForm} from "@/components/documents/FamilyLaborDocumentForm";

/** Existing routes remain stable; additions are explicitly gated until legal signoff. */
export default async function LegalProblemLayout({
  children,params
}:{
  children:ReactNode;params:Promise<{category:string;slug:string}>;
}){
  if(process.env.FAMILY_LABOR_PREVIEW!=="1")return children;
  const {category,slug}=await params;
  const area=category==="semya-i-deti"?"family":category==="trudovoe-pravo"?"labor":null;
  if(!area)return children;
  const additions=getFamilyLaborPlans(area).filter(plan=>
    plan.kind==="EXISTING_ROUTE_EXTENSION"&&plan.existingSlug===slug&&familyLaborCategory(plan)===category
  );
  if(!additions.length)return children;
  return <>
    {children}
    <section className="mx-auto max-w-5xl px-4 pb-12 sm:px-6 lg:px-8" data-family-labor-extensions="true">
      <header className="border-t-4 border-amber-400 pt-6">
        <h2 className="text-2xl font-semibold">Дополнительные ситуации</h2>
        <p className="mt-2 text-sm text-zinc-700">Новые сценарии действующего маршрута. Правовые основания требуют отдельной приёмки.</p>
      </header>
      {additions.map(plan=><section className="mt-8" key={plan.id}>
        <h3 className="text-xl font-semibold">{plan.title}</h3>
        {plan.scenarios.map(scenario=><section key={scenario.key} className="mt-5">
          <h4 className="font-semibold">{scenario.title}</h4>
          <FamilyLaborDocumentForm plan={plan} scenarioKey={scenario.key}/>
          {getFamilyLaborDocumentSlug(plan,scenario.key) ?
            <Link className="mt-3 inline-flex text-sm font-semibold text-trust underline"
              href={"/documents/"+getFamilyLaborDocumentSlug(plan,scenario.key)+"/"}>
              Отдельная страница чек-листа
            </Link>:null}
        </section>)}
      </section>)}
    </section>
  </>;
}

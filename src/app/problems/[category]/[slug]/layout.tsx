import type { ReactNode } from "react";
import { FamilyLaborExpansionPreview } from "@/components/navigator/FamilyLaborExpansionPreview";
import { getFamilyLaborPlans } from "@/data/family-labor-route-expansion";

/**
 * Server-side opt-in preview on existing canonical legal problem URLs.
 * The deployment remains unchanged unless an explicit preview flag is set.
 * No external route is registered for any unreviewed scenario.
 */
const developmentHosts: Record<string, string> = {
  "cohabitation-property": "razvod-i-razdel-imushchestva",
  "adult-guardianship": "opeka-i-popechitelstvo-nad-rebenkom",
  "family-emergency-safety": "roditeli-i-rebenok-posle-razvoda",
  "maternity-leave": "otpusk-po-uhodu-za-rebenkom",
  "shifts-and-business-trips": "rabochee-vremya",
  "secondary-employment": "trudovoy-dogovor",
  "minor-workers": "trudovoy-dogovor",
  "foreign-workers": "trudovoy-dogovor"
};

export default async function LegalProblemLayout({
  children, params
}: {
  children: ReactNode;
  params: Promise<{ category: string; slug: string }>;
}) {
  if (process.env.FAMILY_LABOR_PREVIEW !== "1") return children;
  const { category, slug } = await params;
  const area = category === "semya-i-deti" ? "family" : category === "trudovoe-pravo" ? "labor" : null;
  if (!area) return children;
  const matched = getFamilyLaborPlans(area).filter(plan =>
    plan.kind !== "CROSS_AREA_LINK" && (plan.existingSlug ?? developmentHosts[plan.id]) === slug
  );
  return <>
    {children}
    {matched.length > 0 ? <FamilyLaborExpansionPreview items={matched} /> : null}
  </>;
}

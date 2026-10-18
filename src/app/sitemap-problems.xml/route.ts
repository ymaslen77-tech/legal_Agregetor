import { urlSet, xmlResponse } from "@/lib/sitemap";
import { legalProblems } from "@/data/legal-problems";
import {FAMILY_LABOR_NEW_ROUTES,getFamilyLaborRouteSlug} from "@/data/family-labor-implemented-routes";

export async function GET() {
  const pending=new Set(FAMILY_LABOR_NEW_ROUTES.map(plan=>getFamilyLaborRouteSlug(plan)));
  const categoryPaths = [...new Set(legalProblems.map((problem) => `/problems/${problem.categorySlug}/`))];
  return xmlResponse(
    urlSet([
      ...categoryPaths,
      ...legalProblems.filter(problem=>!pending.has(problem.slug)).map((problem) => `/problems/${problem.categorySlug}/${problem.slug}/`)
    ])
  );
}

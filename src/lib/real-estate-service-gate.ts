import { REAL_ESTATE_PUBLICATION_GATE } from "@/data/real-estate-route-plan";

/**
 * Server-side release control for encrypted account persistence / review leads.
 * The current legal and privacy acceptance matrix is closed. No environment
 * variable alone may open collection of real personal data in dev preview.
 */
export type RealEstateServiceEnvironment=Readonly<{
  NODE_ENV?:string;
  ENABLE_REAL_ESTATE_PERSISTENCE?:string;
}>;
export function canUseRealEstateServerServices(env:RealEstateServiceEnvironment):boolean{
  if(!REAL_ESTATE_PUBLICATION_GATE.publicUrlsEnabled
     || !REAL_ESTATE_PUBLICATION_GATE.personalDataCollectionAllowed
     || REAL_ESTATE_PUBLICATION_GATE.stage!=="PUBLISHED_VERIFIED")return false;
  return env.NODE_ENV==="production"&&env.ENABLE_REAL_ESTATE_PERSISTENCE==="true";
}

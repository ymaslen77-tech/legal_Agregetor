/**
 * Military route is visible only in explicit local development or an opt-in
 * Vercel Preview environment. Vercel Authentication separately gates previews.
 * Production must NEVER opt in, even when an env flag is mistakenly enabled.
 */
export type MilitaryPreviewEnvironment={
 NODE_ENV?:string; VERCEL_ENV?:string; MILITARY_PREVIEW?:string;
};
export function canOpenMilitaryPreview(env:MilitaryPreviewEnvironment):boolean{
 if(env.MILITARY_PREVIEW!=="1")return false;
 return env.NODE_ENV==="development" ||
   (env.NODE_ENV==="production"&&env.VERCEL_ENV==="preview");
}

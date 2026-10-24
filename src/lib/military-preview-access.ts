/**
 * Military route is visible only in explicit local development or an opt-in
 * Vercel Preview environment. Vercel Authentication separately gates previews.
 * Production must NEVER opt in, even when an env flag is mistakenly enabled.
 */
export type MilitaryPreviewEnvironment={
 NODE_ENV?:string; VERCEL_ENV?:string; MILITARY_PREVIEW?:string;
 MILITARY_PREVIEW_SCOPE?:string;
};
export function canOpenMilitaryPreview(env:MilitaryPreviewEnvironment):boolean{
 if(env.MILITARY_PREVIEW!=="1")return false;
 if(env.NODE_ENV==="development")return true;
 // VERCEL_ENV can be absent when Vercel system env exposure is disabled.
 // Two independent branch-scoped Preview flags are required at runtime.
 // An explicit production environment identifier ALWAYS denies access.
 return env.NODE_ENV==="production" && env.VERCEL_ENV!=="production" &&
   env.MILITARY_PREVIEW_SCOPE==="military-feature-preview";
}

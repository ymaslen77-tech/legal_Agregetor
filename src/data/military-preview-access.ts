/** New military drafts are never exposed without an explicit SERVER flag. */
export type MilitaryDraftEnvironment=Readonly<{
  NODE_ENV?:string;
  ENABLE_MILITARY_DRAFT_PREVIEW?:string;
  ENABLE_MILITARY_PUBLIC_DRAFTS?:string;
}>;
export function isMilitaryDraftPreviewEnabled(env:MilitaryDraftEnvironment):boolean{
  return env.NODE_ENV==="development"&&env.ENABLE_MILITARY_DRAFT_PREVIEW==="true";
}
export function isMilitaryPublicDraftEnabled(env:MilitaryDraftEnvironment):boolean{
  return env.NODE_ENV==="production"&&env.ENABLE_MILITARY_PUBLIC_DRAFTS==="true";
}
/** Shared by page rendering, cabinet editing and server-side archive validation. */
export function isMilitaryDraftWorkbenchEnabled(env:MilitaryDraftEnvironment):boolean{
  return isMilitaryDraftPreviewEnabled(env)||isMilitaryPublicDraftEnabled(env);
}

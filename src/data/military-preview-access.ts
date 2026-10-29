/**
 * Unreviewed military forms can be used for local development QA only.
 * They are never enabled in production builds or on the public VPS, even if
 * somebody accidentally sets ENABLE_MILITARY_DRAFT_PREVIEW=true there.
 */
export function isMilitaryDraftPreviewEnabled(env:Readonly<{
  NODE_ENV?:string;
  ENABLE_MILITARY_DRAFT_PREVIEW?:string;
}>):boolean {
  return env.NODE_ENV==="development" && env.ENABLE_MILITARY_DRAFT_PREVIEW==="true";
}

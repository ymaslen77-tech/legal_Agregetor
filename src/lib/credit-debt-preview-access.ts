/** Preview is opt-in and local-only. No production flag can unlock unverified cases. */
export function isCreditDebtPreviewEnabled(env:Readonly<{
  NODE_ENV?:string;
  ENABLE_CREDIT_DEBT_PREVIEW?:string;
}>):boolean{
  return env.NODE_ENV==="development" && env.ENABLE_CREDIT_DEBT_PREVIEW==="true";
}

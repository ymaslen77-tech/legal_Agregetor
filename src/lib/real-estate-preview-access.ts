/** No production flag may expose unreviewed real estate scenarios. */
export function isRealEstatePreviewEnabled(env:Readonly<{
  NODE_ENV?:string;ENABLE_REAL_ESTATE_PREVIEW?:string
}>):boolean{
  return env.NODE_ENV==="development"&&env.ENABLE_REAL_ESTATE_PREVIEW==="true";
}

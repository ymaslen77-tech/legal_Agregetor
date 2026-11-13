import { CREDIT_DEBT_GROUPS } from "@/data/credit-debt-route-plan";

/**
 * Edge-safe public routing guard. Returning 404 at middleware level prevents
 * streaming 200 / soft-404 responses for unknown or unreviewed credit routes.
 * Only the exact 10 x 60 published draft paths may pass; unknown slugs remain 404.
 */
export function getCreditDebtPathDisposition(
  pathname:string,
  env:Readonly<{NODE_ENV?:string;ENABLE_CREDIT_DEBT_PREVIEW?:string}>
):"OTHER"|"ALLOW_PUBLIC_DRAFT"|"BLOCK_404"{
  if(pathname!=="/kredity-dolgi"&&!pathname.startsWith("/kredity-dolgi/"))return "OTHER";
  // Public informational routes are available in production; legal filing remains gated.
  void env;
  const parts=pathname.split("/").filter(Boolean);
  if(parts.length===1)return "ALLOW_PUBLIC_DRAFT";
  const group=CREDIT_DEBT_GROUPS.find(item=>item.id===parts[1]);
  if(!group)return "BLOCK_404";
  if(parts.length===2)return "ALLOW_PUBLIC_DRAFT";
  if(parts.length===3&&group.situations.some(item=>item.id===parts[2]))return "ALLOW_PUBLIC_DRAFT";
  return "BLOCK_404";
}

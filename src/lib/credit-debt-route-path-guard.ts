import { CREDIT_DEBT_GROUPS } from "@/data/credit-debt-route-plan";
import { isCreditDebtPreviewEnabled } from "@/lib/credit-debt-preview-access";

/**
 * Edge-safe public routing guard. Returning 404 at middleware level prevents
 * streaming 200 / soft-404 responses for unknown or unreviewed credit routes.
 * Only the exact 10 x 60 development paths may pass.
 */
export function getCreditDebtPathDisposition(
  pathname:string,
  env:Readonly<{NODE_ENV?:string;ENABLE_CREDIT_DEBT_PREVIEW?:string}>
):"OTHER"|"ALLOW_PREVIEW"|"BLOCK_404"{
  if(pathname!=="/kredity-dolgi"&&!pathname.startsWith("/kredity-dolgi/"))return "OTHER";
  if(!isCreditDebtPreviewEnabled(env))return "BLOCK_404";
  const parts=pathname.split("/").filter(Boolean);
  if(parts.length===1)return "ALLOW_PREVIEW";
  const group=CREDIT_DEBT_GROUPS.find(item=>item.id===parts[1]);
  if(!group)return "BLOCK_404";
  if(parts.length===2)return "ALLOW_PREVIEW";
  if(parts.length===3&&group.situations.some(item=>item.id===parts[2]))return "ALLOW_PREVIEW";
  return "BLOCK_404";
}

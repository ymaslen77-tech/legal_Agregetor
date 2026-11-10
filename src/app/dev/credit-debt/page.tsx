import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CreditDebtPreview } from "@/components/credit-debt/CreditDebtPreview";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Тестовая анкета — кредиты и долги",
  robots: { index:false, follow:false, noarchive:true }
};

/** No public exposure, even when the production build accidentally ships this route. */
export default function CreditDebtDevPage(){
  if(process.env.NODE_ENV!=="development"||process.env.ENABLE_CREDIT_DEBT_PREVIEW!=="true")
    notFound();
  return <CreditDebtPreview/>;
}

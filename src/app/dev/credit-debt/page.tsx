import type { Metadata } from "next";
import Link from "next/link";
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
  return <>
    <div className="mx-auto max-w-5xl px-4 pt-6 sm:px-6">
      <Link href="/kredity-dolgi/" className="inline-flex min-h-11 items-center rounded-md border border-trust px-5 py-3 text-sm font-semibold text-trust hover:bg-emerald-50">
        Открыть полный каркас маршрута: 10 тем и 60 ситуаций
      </Link>
    </div>
    <CreditDebtPreview/>
  </>;
}

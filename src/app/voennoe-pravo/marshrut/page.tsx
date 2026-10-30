import { redirect } from "next/navigation";
/** The previous military questionnaire is retired. Keep legacy inbound links safe. */
export default function RetiredMilitaryRoute() { redirect("/voennoe-pravo/"); }

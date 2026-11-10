import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

/** Unified metadata contract for all new legal routes.
 * The SEO fields are ready for future review, but drafts must not index.
 * Do not change indexability here without the per-situation legal QA gate.
 */
export function creditDebtDraftMetadata(input:{
  path:string;title:string;description:string;
}):Metadata{
  const general=buildMetadata({
    title:input.title,
    description:input.description,
    path:input.path,
    isIndexable:false
  });
  return {
    ...general,
    robots:{index:false,follow:false,noarchive:true}
  };
}

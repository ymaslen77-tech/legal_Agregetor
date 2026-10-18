import { absoluteUrl, siteUrl, withTrailingSlash } from "./seo";

/**
 * Only normalized, local canonical URLs belong in an XML sitemap. Query and
 * fragment variants are not independently indexable. De-duplicate cross-section
 * references to conserve crawl budget.
 */
export function canonicalSitemapPaths(paths: string[]): string[] {
  return [...new Set(paths
    .filter((path) => typeof path === "string" &&
      path.startsWith("/") && !path.startsWith("//") &&
      !/[?#\r\n]/.test(path))
    .map(withTrailingSlash))];
}

function escapeXml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&apos;"
  })[character]!);
}

export function xmlResponse(body: string) {
  return new Response(body, {
    headers: {
      "content-type": "application/xml; charset=utf-8",
      "cache-control": "public, max-age=900, stale-while-revalidate=3600"
    }
  });
}

export function sitemapIndex(paths: string[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${canonicalSitemapPaths(paths).map((path) => `  <sitemap>
    <loc>${escapeXml(absoluteSitemapUrl(path))}</loc>
  </sitemap>`).join("\n")}
</sitemapindex>`;
}

export function urlSet(paths: string[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${canonicalSitemapPaths(paths).map((path) => `  <url>
    <loc>${escapeXml(absoluteUrl(path))}</loc>
  </url>`).join("\n")}
</urlset>`;
}

function absoluteSitemapUrl(path: string) {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  // XML files do not use trailing-slash URLs.
  return `${siteUrl()}${cleanPath.replace(/\/$/, "")}`;
}

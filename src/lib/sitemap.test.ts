import assert from "node:assert/strict";
import { canonicalSitemapPaths, sitemapIndex, urlSet } from "./sitemap";

const site = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "https://pravopoisk.ru";
assert.deepEqual(
  canonicalSitemapPaths(["/","/documents","/documents/","/problems/?scenario=x",
    "/problems/#fragment","//external.com/fake","https://spam.example","/problems"]),
  ["/","/documents/","/problems/"]
);
const xml=urlSet(["/","/documents","/documents/","/query?q=private","//evil",
  "/документы/","/name&test/"]);
assert.match(xml, /<urlset xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9">/);
assert.equal((xml.match(/<loc>/g)||[]).length,4);
assert.ok(xml.includes("<loc>"+site+"/documents/</loc>"));
assert.ok(xml.includes("<loc>"+site+"/name&amp;test/</loc>"));
assert.ok(!xml.includes("?q="));
assert.ok(!xml.includes("//evil"));
const index=sitemapIndex(["/sitemap-pages.xml","/sitemap-pages.xml"]);
assert.equal((index.match(/<loc>/g)||[]).length,1);
assert.match(index, /sitemap-pages\.xml<\/loc>/);
assert.ok(!index.includes("sitemap-pages.xml/"));
console.log("SEO sitemap canonical paths, XML escaping and de-duplication: PASS");

import assert from "node:assert/strict";
import { organizationJsonLd, websiteJsonLd, breadcrumbJsonLd } from "./jsonld";
import { siteUrl } from "./seo";

const site=siteUrl();
const org=organizationJsonLd();
const website=websiteJsonLd();
assert.equal(org["@type"],"Organization");
assert.equal(org["@id"],site+"/#organization");
assert.equal(website["@id"],site+"/#website");
assert.equal(website.publisher["@id"],org["@id"]);
assert.equal(website.inLanguage,"ru-RU");
assert.equal("potentialAction" in website,false,"Google no longer uses sitelinks search box markup");
const breadcrumbs=breadcrumbJsonLd([
  {name:"Главная",path:"/"},
  {name:"Документы",path:"/documents/"},
  {name:"Заявление",path:"/documents/statement/"}
]);
assert.equal(breadcrumbs["@type"],"BreadcrumbList");
assert.equal(breadcrumbs["@id"],site+"/documents/statement/#breadcrumb");
assert.deepEqual(breadcrumbs.itemListElement.map(item=>item.position),[1,2,3]);
assert.ok(breadcrumbs.itemListElement.every(item=>item.item.startsWith(site+"/")));
console.log("SEO JSON-LD Organization, WebSite, BreadcrumbList semantics: PASS");

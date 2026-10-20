import assert from "node:assert/strict";
import { publicCitiesResponse } from "./public-cities-response";


async function main() {
const rows = [{ id: "city-one", name: "Тестовый город", slug: "test-city", region: "Тестовый регион" }];
const healthy = await publicCitiesResponse(async () => rows);
assert.equal(healthy.status, 200);
assert.equal(healthy.headers.get("cache-control"), "no-store");
assert.deepEqual(await healthy.json(), { cities: rows });

const empty = await publicCitiesResponse(async () => []);
assert.equal(empty.status, 200);
assert.deepEqual(await empty.json(), { cities: [] });

const original = console.warn;
let warned = "";
console.warn = (line?: unknown) => { warned = String(line); };
try {
  const unavailable = await publicCitiesResponse(async () => { throw new Error("Sensitive database details"); });
  assert.equal(unavailable.status, 503);
  assert.equal(unavailable.headers.get("cache-control"), "no-store");
  assert.equal(unavailable.headers.get("retry-after"), "30");
  assert.deepEqual(await unavailable.json(), {
    cities: [], error: "CITY_DIRECTORY_TEMPORARILY_UNAVAILABLE"
  });
  assert.ok(warned.includes("database query unavailable"));
  assert.ok(!warned.includes("Sensitive database details"));
} finally {
  console.warn = original;
}

console.log("Public city API: true empty results vs database outage and retry response PASS");
}

void main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

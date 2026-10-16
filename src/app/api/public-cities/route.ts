import { NextResponse } from "next/server";
import { getCities } from "@/lib/repositories";

/** Only public city labels; requested on dropdown opening, not on every page render. */
export async function GET() {
  const cities = await getCities();
  return NextResponse.json({ cities: cities.map(({ id, name, slug, region }) => ({ id, name, slug, region })) });
}

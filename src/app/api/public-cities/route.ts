import { prisma } from "@/lib/prisma";
import { publicCitiesResponse } from "@/lib/public-cities-response";

export const dynamic = "force-dynamic";

/** Read real, active city labels; never silently replace a database outage with a valid empty list. */
export async function GET() {
  return publicCitiesResponse(async () => {
    const rows = await prisma.city.findMany({
      where: { isActive: true },
      select: { id: true, name: true, slug: true, region: true },
      orderBy: { name: "asc" }
    });
    return rows.map(({ id, name, slug, region }) => ({
      id, name, slug, region: region ?? ""
    }));
  });
}

export type PublicCity = { id: string; name: string; slug: string; region: string };

/**
 * A service outage is not a successful empty directory. The UI already
 * handles non-2xx responses by offering the user a retry.
 */
export async function publicCitiesResponse(
  load: () => Promise<readonly PublicCity[]>
): Promise<Response> {
  try {
    const cities = await load();
    return Response.json({ cities }, {
      headers: { "Cache-Control": "no-store" }
    });
  } catch {
    console.warn("[api/public-cities] City directory database query unavailable.");
    return Response.json(
      { cities: [], error: "CITY_DIRECTORY_TEMPORARILY_UNAVAILABLE" },
      {
        status: 503,
        headers: {
          "Cache-Control": "no-store",
          "Retry-After": "30"
        }
      }
    );
  }
}

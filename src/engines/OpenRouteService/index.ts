import { RouteRequest, RouteResponse } from "@/types";
import { createRouteFeature } from "@/util";
import config from "./config";

export async function fetchWithORS(data: RouteRequest): Promise<RouteResponse> {
  const response = await fetch(config.URL, {
    method: "POST",
    headers: {
      ...config.HEADERS,
      Authorization: data.apiKey!,
    },
    body: JSON.stringify({
      coordinates: [
        [data.from.lng, data.from.lat],
        [data.to.lng, data.to.lat],
      ],
      alternative_routes: { target_count: 3 },
    }),
  });

  const result = await response.json();
  if (!response.ok) throw new Error(result.error?.message);

  const features = result.routes.map((r: any, i: number) => {
    const steps = r.segments?.[0]?.steps || [];
    const roadNames = Array.from(
      new Set(
        steps
          .map((s: any) => s.name)
          .filter((n: string) => n && n !== "-" && n !== "Unknown"),
      ),
    ).slice(0, 2);

    const summary = roadNames.length > 0 ? `via ${roadNames.join(", ")}` : "";
    const hasTolls = steps.some((s: any) => s.toll === true);
    const trafficDelay = 0;
    const weight = r.summary.duration;

    return createRouteFeature(
      i,
      r.summary.distance,
      r.summary.duration,
      r.geometry,
      summary,
      hasTolls,
      trafficDelay,
      weight,
    );
  });

  return {
    success: true,
    engine: "OpenRouteService",
    geojson: { type: "FeatureCollection", features },
  };
}

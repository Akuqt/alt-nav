import { RouteRequest, RouteResponse } from "@/types";
import { createRouteFeature } from "@/util";
import config from "./config";

export async function fetchWithMapbox(
  data: RouteRequest,
): Promise<RouteResponse> {
  const coords = `${data.from.lng},${data.from.lat};${data.to.lng},${data.to.lat}`;

  const response = await fetch(config.URL(coords, data.apiKey!));
  const result = await response.json();
  if (!response.ok) throw new Error(result.message);

  const features = result.routes.map((r: any, i: number) => {
    const summary = r.legs?.[0]?.summary ? `via ${r.legs[0].summary}` : "";

    const hasTolls =
      r.legs?.some((leg: any) =>
        leg.steps?.some((step: any) =>
          step.intersections?.some((intersection: any) => intersection.toll),
        ),
      ) || false;

    const typicalDuration = r.duration_typical ?? r.duration;
    const trafficDelay = Math.max(0, r.duration - typicalDuration);
    const weight = r.weight ?? r.duration;

    return createRouteFeature(
      i,
      r.distance,
      r.duration,
      r.geometry,
      summary,
      hasTolls,
      trafficDelay,
      weight,
    );
  });

  return {
    success: true,
    provider: "Mapbox",
    geojson: { type: "FeatureCollection", features },
  };
}

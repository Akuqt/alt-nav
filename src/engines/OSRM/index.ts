import { RouteRequest, RouteResponse } from "@/types";
import { createRouteFeature } from "@/util";
import config from "./config";

export async function fetchWithOSRM(
  data: RouteRequest,
): Promise<RouteResponse> {
  const coords = `${data.from.lng},${data.from.lat};${data.to.lng},${data.to.lat}`;

  const response = await fetch(config.URL(coords));
  const result = await response.json();
  if (!response.ok || result.code !== "Ok") throw new Error(result.message);

  const features = result.routes.map((r: any, i: number) => {
    const summary = r.legs?.[0]?.summary ? `via ${r.legs[0].summary}` : "";
    const hasTolls = false;
    const trafficDelay = 0;
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
    engine: "OSRM",
    geojson: { type: "FeatureCollection", features },
  };
}

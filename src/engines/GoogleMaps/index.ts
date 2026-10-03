import { RouteRequest, RouteResponse } from "@/types";
import { createRouteFeature } from "@/util";
import config from "./config";

export async function fetchWithGoogleMaps(
  data: RouteRequest,
): Promise<RouteResponse> {
  const response = await fetch(config.URL, {
    method: "POST",
    headers: {
      ...config.HEADERS,
      "X-Goog-Api-Key": data.apiKey!,
    },
    body: JSON.stringify({
      origin: {
        location: {
          latLng: { latitude: data.from.lat, longitude: data.from.lng },
        },
      },
      destination: {
        location: { latLng: { latitude: data.to.lat, longitude: data.to.lng } },
      },
      travelMode: "DRIVE",
      routingPreference: "TRAFFIC_AWARE",
      polylineQuality: "HIGH_QUALITY",
      computeAlternativeRoutes: true,
    }),
  });

  const result = await response.json();
  if (!response.ok) throw new Error(result.error?.message);

  const features = result.routes.map((r: any, i: number) => {
    const durationSec = parseInt(r.duration.replace("s", ""), 10);
    const staticDurationSec = r.staticDuration
      ? parseInt(r.staticDuration.replace("s", ""), 10)
      : durationSec;

    const summary = r.description ? `via ${r.description}` : "";
    const hasTolls = Boolean(r.travelAdvisory?.tollInfo);
    const trafficDelay = Math.max(0, durationSec - staticDurationSec);
    const weight = durationSec;

    return createRouteFeature(
      i,
      r.distanceMeters,
      durationSec,
      r.polyline.encodedPolyline,
      summary,
      hasTolls,
      trafficDelay,
      weight,
    );
  });

  return {
    success: true,
    engine: "GoogleMaps",
    geojson: { type: "FeatureCollection", features },
  };
}

import { RouteFeature, RouteResponse, RoutingEngine } from "../types";

function decodePolyline(encoded: string): number[][] {
  const coordinates: number[][] = [];
  let index = 0,
    lat = 0,
    lng = 0,
    len = encoded.length;

  while (index < len) {
    let b: number,
      shift = 0,
      result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    lat += result & 1 ? ~(result >> 1) : result >> 1;
    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    lng += result & 1 ? ~(result >> 1) : result >> 1;
    coordinates.push([lng / 1e5, lat / 1e5]);
  }
  return coordinates;
}

export const isValidCoordinate = (coord?: { lat: any; lng: any }): boolean => {
  return typeof coord?.lat === "number" && typeof coord?.lng === "number";
};

export const createError = (
  engine: RoutingEngine,
  errorMessage: string,
): RouteResponse => ({
  success: false,
  provider: engine,
  error: errorMessage,
});

export function createRouteFeature(
  index: number,
  distanceMeters: number,
  durationSeconds: number,
  geometryString: string | number[][],
  summary: string,
  tolls: boolean,
  trafficDelay: number,
  weight: number,
): RouteFeature {
  return {
    type: "Feature",
    properties: {
      index,
      distance: Math.round(distanceMeters),
      duration: Math.round(durationSeconds),
      summary,
      tolls,
      delay: Math.round(trafficDelay),
      weight: Math.round(weight * 100) / 100,
    },
    geometry: {
      type: "LineString",
      coordinates:
        typeof geometryString === "string"
          ? decodePolyline(geometryString)
          : geometryString,
    },
  };
}

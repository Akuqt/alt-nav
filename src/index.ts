import { fetchWithGoogleMaps } from "@/engines/GoogleMaps";
import { fetchWithMapbox } from "@/engines/Mapbox";
import { fetchWithOSRM } from "@/engines/OSRM";
import { fetchWithORS } from "@/engines/OpenRouteService";
import { RouteRequest, RouteResponse } from "@/types";
import { createError, isValidCoordinate } from "@/util";

export type { RouteRequest, RouteResponse };

const routeProviders: Record<
  string,
  (options: RouteRequest) => Promise<RouteResponse>
> = {
  OSRM: fetchWithOSRM,
  OpenRouteService: fetchWithORS,
  Mapbox: fetchWithMapbox,
  GoogleMaps: fetchWithGoogleMaps,
};

function validateRouteRequest(options: RouteRequest): RouteResponse | null {
  if (!options.engine || typeof options.engine !== "string") {
    return {
      success: false,
      engine: "Unknown",
      error: "Invalid routing engine.",
    };
  }

  if (!isValidCoordinate(options.to) || !isValidCoordinate(options.from)) {
    return createError(
      options.engine,
      "Invalid coordinates. Latitude and longitude must be numbers.",
    );
  }

  if (options.engine !== "OSRM" && !options.apiKey) {
    return createError(
      options.engine,
      `${options.engine} requires an API Key.`,
    );
  }

  if (!routeProviders[options.engine]) {
    return createError(
      options.engine,
      `Unsupported engine: ${options.engine}.`,
    );
  }

  return null;
}

export async function getRouteAlternatives(
  options: RouteRequest,
): Promise<RouteResponse> {
  const validationError = validateRouteRequest(options);
  if (validationError) {
    return validationError;
  }

  try {
    const fetchRoute = routeProviders[options.engine];
    return await fetchRoute(options);
  } catch (error) {
    return createError(
      options.engine,
      error instanceof Error ? error.message : "Unknown Error.",
    );
  }
}

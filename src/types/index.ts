interface Point {
  lng: number;
  lat: number;
}

interface GeoJSONLineString {
  type: "LineString";
  coordinates: number[][]; // [longitude, latitude]
}

interface RouteProperties {
  index: number;
  distance: number;
  duration: number;

  summary?: string;
  tolls: boolean;
  delay?: number;
  weight?: number;
}

interface RouteFeatureCollection {
  type: "FeatureCollection";
  features: RouteFeature[];
}

export type RoutingEngine =
  "OpenRouteService" | "OSRM" | "Mapbox" | "GoogleMaps";

export interface RouteRequest {
  from: Point;
  to: Point;
  engine: RoutingEngine;
  apiKey?: string;
}

export interface RouteFeature {
  type: "Feature";
  properties: RouteProperties;
  geometry: GeoJSONLineString;
}

export interface RouteResponse {
  success: boolean;
  provider: RoutingEngine | "Unknown";
  geojson?: RouteFeatureCollection;
  error?: string;
}

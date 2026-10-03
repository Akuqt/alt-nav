# Alt-Nav

A unified, multi-provider routing client for Node.js and browser environments. `alt-nav` normalizes directions and alternative route responses from Google Maps, Mapbox, OpenRouteService, and OSRM into standard RFC-7946 GeoJSON FeatureCollections.

### Installation

```shell
yarn install alt-nav
```

### Usage

```typescript
import { getRouteAlternatives } from "alt-nav";

const response = await getRouteAlternatives({
  engine: "Mapbox", // "OSRM" | "OpenRouteService" | "Mapbox" | "GoogleMaps"
  apiKey: "YOUR_API_KEY",
  from: { lat: lat1, lng: lng1 },
  to: { lat: lat2, lng: lng2 },
});

if (response.success && response.geojson) {
  console.log(`Engine: ${response.engine}`);

  response.geojson.features.forEach((feature) => {
    const properties = feature.properties;
    console.log(`Route ${properties.index} (${properties.summary}):`);
    console.log(`  Distance: ${properties.distance} m`);
    console.log(`  Duration: ${properties.duration} s`);
    console.log(`  Has Tolls: ${properties.tolls}`);
    console.log(`  Traffic Delay: ${properties.delay} s`);
  });
} else {
  console.error(`Error (${response.engine}):`, response.error);
}
```

### Supported Engines

| Engine               | API Key Required? | Traffic Aware |
| :------------------- | :---------------: | :-----------: |
| **OSRM**             |       ❌ No       |     ❌ No     |
| **OpenRouteService** |      ✅ Yes       |     ❌ No     |
| **Mapbox**           |      ✅ Yes       |    ✅ Yes     |
| **GoogleMaps**       |      ✅ Yes       |    ✅ Yes     |

### API Reference

#### `getRouteAlternatives(options: RouteRequest): Promise<RouteResponse>`

Primary export that validates input options and forwards the request to the specified engine provider.

#### `RouteRequest`

| Parameter | Type                                                       | Required | Description                                     |
| :-------- | :--------------------------------------------------------- | :------: | :---------------------------------------------- |
| `engine`  | `"OSRM" \| "OpenRouteService" \| "Mapbox" \| "GoogleMaps"` |    ✅    | Target routing engine provider.                 |
| `from`    | `{ lng: number, lat: number }`                             |    ✅    | Origin coordinate.                              |
| `to`      | `{ lng: number, lat: number }`                             |    ✅    | Destination coordinate.                         |
| `apiKey`  | `string`                                                   | Optional | API key required for all engines except `OSRM`. |

#### `RouteResponse`

```typescript
export interface RouteResponse {
  success: boolean;
  engine: string;
  geojson?: RouteFeatureCollection; // RFC-7946 data
  error?: string;
}
```

#### GeoJSON Properties (`feature.properties`)

Each route line in `geojson.features` exposes standardized metrics:

| Property   | Type      | Description                                                      |
| :--------- | :-------- | :--------------------------------------------------------------- |
| `index`    | `number`  | Route identifier.                                                |
| `distance` | `number`  | Route distance in **meters**.                                    |
| `duration` | `number`  | Route travel time in **seconds**.                                |
| `summary`  | `string`  | Primary road names (e.g., `"123 Fake Street"`).                  |
| `tolls`    | `boolean` | `true` if the route crosses a toll station.                      |
| `delay`    | `number`  | Live traffic delay in **seconds** relative to free-flow traffic. |
| `weight`   | `number`  | Algorithmic routing cost score.                                  |

### License

MIT

export default {
  URL: (coords: string, key: string) =>
    `https://api.mapbox.com/directions/v5/mapbox/driving-traffic/${coords}?alternatives=true&geometries=polyline&overview=full&steps=true&access_token=${key}`,
};

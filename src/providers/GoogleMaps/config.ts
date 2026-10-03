export default {
  URL: "https://routes.googleapis.com/directions/v2:computeRoutes",
  HEADERS: {
    "Content-Type": "application/json",
    "X-Goog-FieldMask":
      "routes.duration,routes.staticDuration,routes.distanceMeters,routes.polyline.encodedPolyline,routes.description,routes.travelAdvisory",
  },
};

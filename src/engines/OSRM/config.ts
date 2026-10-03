export default {
  URL: (coords: string) =>
    `https://router.project-osrm.org/route/v1/driving/${coords}?alternatives=true&overview=full&steps=true`,
};

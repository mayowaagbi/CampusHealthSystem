// utils/geolocation.js
export const calculateDistance = (prev, current) => {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (prev.latitude * Math.PI) / 180;
  const φ2 = (current.latitude * Math.PI) / 180;
  const Δφ = ((current.latitude - prev.latitude) * Math.PI) / 180;
  const Δλ = ((current.longitude - prev.longitude) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
};

export const metersToSteps = (meters) => {
  const STEP_LENGTH = 0.762; // Average step length in meters
  return Math.round(meters / STEP_LENGTH);
};

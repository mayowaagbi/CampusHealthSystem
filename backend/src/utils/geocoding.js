// utils/geocoding.js
const { default: axios } = require("axios");

async function reverseGeocode(lat, lng) {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.GOOGLE_MAPS_API_KEY}`
    );
    return (
      response.data.results[0]?.formatted_address || "Address not available"
    );
  } catch (error) {
    console.error("Geocoding error:", error);
    return "Address not available";
  }
}

module.exports = { reverseGeocode };

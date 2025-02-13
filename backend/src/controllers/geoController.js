const geoService = require("../services/geoService");

const processLocation = async (req, res) => {
  const { userId, location } = req.body;

  console.log("Received request:", { userId, location });

  if (!userId || !location?.lat || !location?.lng) {
    console.error("Missing userId or location data:", { userId, location });
    return res.status(400).json({ error: "Missing userId or location data" });
  }

  try {
    const result = await geoService.processLocation(userId, location);
    console.log("Location processed successfully:", result);
    res.json(result);
  } catch (error) {
    console.error("Error processing location:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { processLocation };

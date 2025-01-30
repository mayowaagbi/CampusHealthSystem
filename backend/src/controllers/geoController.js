// controllers/geoController.js
import GeoService from "../services/geoService";

class GeoController {
  async trackLocation(req, res) {
    const { lat, lng } = req.body;
    await GeoService.processLocation(req.user.id, { lat, lng });
    res.json({ success: true });
  }
}

export default new GeoController();

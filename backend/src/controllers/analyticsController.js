import { AnalyticsService } from "../services";
import { successResponse, errorResponse } from "../utils/responseHandler";
import { asyncHandler } from "../utils/asyncHandler";

class AnalyticsController {
  getAppointmentAnalytics = asyncHandler(async (req, res) => {
    const stats = await AnalyticsService.getAppointmentStatistics();
    successResponse(res, stats);
  });

  getHealthTrends = asyncHandler(async (req, res) => {
    const trends = await AnalyticsService.getHealthTrends();
    successResponse(res, trends);
  });

  getSystemUsage = asyncHandler(async (req, res) => {
    const usageData = await AnalyticsService.getSystemUsageData();
    successResponse(res, usageData);
  });
}

export default new AnalyticsController();

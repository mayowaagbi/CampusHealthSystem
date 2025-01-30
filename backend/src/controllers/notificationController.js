const { NotificationService } = require("../services");
const { successResponse, errorResponse } = require("../utils/responseHandler");
const { asyncHandler } = require("../utils/asyncHandler");

class NotificationController {
  getNotifications = asyncHandler(async (req, res) => {
    const notifications = await NotificationService.getUserNotifications(
      req.user.id
    );
    successResponse(res, notifications);
  });

  markAsRead = asyncHandler(async (req, res) => {
    await NotificationService.markNotificationsAsRead(
      req.user.id,
      req.body.ids
    );
    successResponse(res, { message: "Notifications marked as read" });
  });

  sendNotification = asyncHandler(async (req, res) => {
    await NotificationService.sendSystemNotification(
      req.body.message,
      req.body.userIds
    );
    successResponse(res, { message: "Notifications sent successfully" });
  });
}

module.export = new NotificationController();

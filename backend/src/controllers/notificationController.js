const { NotificationService } = require("../services");
const { successResponse, errorResponse } = require("../utils/responseHandler");
const asyncHandler = require("../utils/asyncHandler");

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
    const { title, message, recipients } = req.body;
    await NotificationService.sendNotification(title, message, recipients);
    successResponse(res, { message: "Notification sent successfully" });
  });
}

module.exports = new NotificationController();

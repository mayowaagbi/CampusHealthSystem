const BaseModel = require("./BaseModel");

class Notification extends BaseModel {
  constructor() {
    super("notification");
  }

  /**
   * Create batched notifications
   * @param {Array<string>} userIds
   * @param {Object} notificationData
   * @returns {Promise<Array>}
   */
  async batchCreate(userIds, { type, title, content }) {
    const notifications = userIds.map((userId) => ({
      userId,
      type,
      title,
      content,
      priority: type === "EMERGENCY" ? 1 : 3,
    }));

    return this.prisma.notification.createMany({
      data: notifications,
    });
  }

  /**
   * Mark notifications as read
   * @param {Array<string>} notificationIds
   * @returns {Promise<Object>}
   */
  async markAsRead(notificationIds) {
    return this.prisma.notification.updateMany({
      where: { id: { in: notificationIds } },
      data: { read: true },
    });
  }
}

module.exports = new Notification();

import { Notification } from "../models";
import { sendEmail } from "../utils";
import { sendSMS } from "../utils/twilio";
class NotificationService {
  async sendBulkNotification(userIds, message) {
    const notifications = await Notification.batchCreate(userIds, message);
    await this._dispatchNotifications(userIds, message);
    return notifications;
  }

  async _dispatchNotifications(userIds, message) {
    const users = await User.findMany({ where: { id: { in: userIds } } });

    await Promise.all([
      this._sendEmails(users, message),
      this._sendSMS(users, message),
    ]);
  }

  async _sendEmails(users, message) {
    const emailPromises = users.map((user) =>
      sendEmail(user.email, "Health Notification", message)
    );
    await Promise.all(emailPromises);
  }

  async _sendSMS(users, message) {
    const smsPromises = users.map((user) =>
      user.phone ? sendSMS(user.phone, message) : Promise.resolve()
    );
    await Promise.all(smsPromises);
  }
  async sendStepAlert(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { phone: true, stepGoal: true },
    });

    const stepsEntry = await prisma.stepEntry.findUnique({
      where: { userId_date: { userId, date: new Date() } },
    });

    if (stepsEntry.steps >= user.stepGoal) {
      await sendSMS(
        user.phone,
        `🎉 Goal Achieved! You've reached ${stepsEntry.steps} steps today!`
      );
    }
  }
}

export default new NotificationService();

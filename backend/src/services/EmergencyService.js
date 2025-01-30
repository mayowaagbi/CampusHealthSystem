import { EmergencyContact } from "../models";
import { sendSMS } from "../utils/smsService";
import { ApiError } from "../utils/apiError";
import logger from "../utils/logger";

class EmergencyService {
  async triggerEmergency(studentId, location) {
    const contacts = await EmergencyContact.findByStudent(studentId);
    if (!contacts.length) {
      throw new ApiError(400, "No emergency contacts registered");
    }

    const message = `EMERGENCY ALERT: ${studentId} needs help at ${location}`;
    const sendPromises = contacts.map((contact) =>
      sendSMS(contact.phone, message)
    );

    await Promise.all(sendPromises);
    logger.info(`Emergency alert sent for student ${studentId}`);
    return { success: true };
  }
}

export default new EmergencyService();

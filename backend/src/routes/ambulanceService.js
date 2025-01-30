import { prisma } from "../config";
import { sendSMS } from "../utils/twilio";

class AmbulanceService {
  async createRequest(requestData) {
    return prisma.ambulanceRequest.create({
      data: requestData,
    });
  }

  async updateRequest(id, status) {
    return prisma.ambulanceRequest.update({
      where: { id },
      data: { status },
    });
  }

  async getUserRequests(userId) {
    return prisma.ambulanceRequest.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  async notifyEmergencyServices(request) {
    // Send SMS to emergency contacts
    await sendSMS(
      process.env.EMERGENCY_PHONE_NUMBER,
      `NEW AMBULANCE REQUEST: ${request.address} (${request.latitude}, ${request.longitude})`
    );

    // Send SMS to user
    await sendSMS(
      request.user.phone,
      `Ambulance requested! Status: ${request.status}`
    );
  }
}

export default new AmbulanceService();

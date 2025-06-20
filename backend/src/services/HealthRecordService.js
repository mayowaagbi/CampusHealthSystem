const { PrismaClient } = require("@prisma/client");
const MedicalDocument = require("../models/MedicalDocument");
const { uploadFile } = require("../utils/storage");
const { ApiError } = require("../utils/apiError");
const logger = require("../utils/logger");

class HealthRecordService {
  constructor() {
    this.prisma = new PrismaClient();
  }

  async createHealthRecord(providerId, studentId, recordData) {
    return this.prisma.healthRecord.create({
      ...recordData,
      providerId,
      studentId,
    });
  }

  async uploadMedicalDocument(file, recordId) {
    const { buffer, mimetype, originalname } = file;
    const fileUrl = await uploadFile(buffer, originalname, mimetype);

    return MedicalDocument.createDocument(recordId, {
      name: originalname,
      storagePath: fileUrl,
    });
  }
  async recentUploads(providerId) {
    return this.prisma.healthRecord.findMany({
      where: { providerId },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: {
        documents: true,
        student: {
          include: {
            profile: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });
  }
}

module.exports = new HealthRecordService();

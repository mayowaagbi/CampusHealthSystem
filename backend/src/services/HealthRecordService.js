const { HealthRecord, MedicalDocument } = require("../models");
const { uploadFile } = require("../utils/storage");
const { ApiError } = require("../utils/apiError");
const logger = require("../utils/logger");
class HealthRecordService {
  async createHealthRecord(providerId, studentId, recordData) {
    return HealthRecord.create({
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
}

export default new HealthRecordService();

import { HealthRecord, MedicalDocument } from "../models";
import { uploadFile } from "../utils/storage";
import { ApiError } from "../utils/apiError";
import logger from "../utils/logger";

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

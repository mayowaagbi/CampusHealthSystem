const { HealthRecordService } = require("../services");
const { successResponse, errorResponse } = require("../utils/responseHandler");
const { asyncHandler } = require("../utils/asyncHandler");
const { validateRequest } = require("../middleware/validationMiddleware");
const { createHealthRecordSchema } = require("../validations/healthValidation");

class HealthRecordController {
  createRecord = asyncHandler(async (req, res) => {
    const record = await HealthRecordService.createHealthRecord(
      req.user.id,
      req.body
    );
    successResponse(res, record, 201);
  });

  uploadDocument = asyncHandler(async (req, res) => {
    const document = await HealthRecordService.uploadMedicalDocument(
      req.file,
      req.params.recordId
    );
    successResponse(res, document, 201);
  });

  getRecords = asyncHandler(async (req, res) => {
    const records = await HealthRecordService.getMedicalHistory(req.user.id);
    successResponse(res, records);
  });
}

export default new HealthRecordController();

// models/MedicalDocumentModel.js
const BaseModel = require("./BaseModel");

class MedicalDocumentModel extends BaseModel {
  constructor() {
    super("medicalDocument");
  }

  // async createDocument(studentId, fileData) {
  //   // Changed parameters
  //   try {
  //     console.log("Creating document entry for student:", studentId);
  //     return await this.prisma.medicalDocument.create({
  //       // Fixed prisma reference
  //       data: {
  //         studentId, // Match schema field name
  //         filename: fileData.originalname,
  //         path: fileData.path,
  //         mimetype: fileData.mimetype,
  //         size: fileData.size,
  //       },
  //     });
  //   } catch (error) {
  //     console.error("Create document error:", error);
  //     throw new Error("Failed to create document entry");
  //   }
  // }
  async create(data) {
    try {
      console.log("Creating DB entry:", data);
      const result = await this.prisma.medicalDocument.create({
        data,
      });
      console.log("Created document ID:", result.id);
      return result;
    } catch (error) {
      console.error("Model create error:", error);
      throw new Error(`Database error: ${error.message}`);
    }
  }

  async findMany(query) {
    try {
      return await this.prisma.medicalDocument.findMany(query);
    } catch (error) {
      console.error("FindMany error:", error);
      throw error;
    }
  }

  async findById(id) {
    try {
      return await this.prisma.medicalDocument.findUnique({
        where: { id },
      });
    } catch (error) {
      console.error("FindById error:", error);
      throw error;
    }
  }

  async delete(id) {
    try {
      return await this.prisma.medicalDocument.delete({
        where: { id },
      });
    } catch (error) {
      console.error("Delete error:", error);
      throw error;
    }
  }
  async recentUploads(providerId) {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return this.prisma.medicalDocument.count({
      where: {
        student: { primaryCareProviderId: providerId },
        uploadedAt: { gte: sevenDaysAgo },
      },
    });
  }
}

module.exports = new MedicalDocumentModel();

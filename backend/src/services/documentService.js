// services/documentService.js
const MedicalDocumentModel = require("../models/MedicalDocument");

class DocumentService {
  async createDocument(studentId, fileData) {
    try {
      return await MedicalDocumentModel.create({
        studentId,
        filename: fileData.originalname,
        path: fileData.path,
        mimetype: fileData.mimetype,
        size: fileData.size,
      });
    } catch (error) {
      console.error("Create error:", error);
      throw new Error("Document creation failed: " + error.message);
    }
  }

  async getDocuments(studentId) {
    // Changed parameter name
    try {
      console.log("Fetching documents for student:", studentId);
      return await MedicalDocumentModel.findMany({
        where: { studentId }, // Changed from userId to studentId
        orderBy: { uploadedAt: "desc" },
      });
    } catch (error) {
      console.error("Get documents error:", error);
      throw new Error("Failed to retrieve documents");
    }
  }

  async getDocumentById(documentId) {
    try {
      console.log("Fetching document by ID:", documentId);
      return await MedicalDocumentModel.findById(documentId);
    } catch (error) {
      console.error("Get document by ID error:", error);
      throw new Error("Failed to retrieve document");
    }
  }

  async deleteDocument(documentId) {
    try {
      console.log("Deleting document:", documentId);
      return await MedicalDocumentModel.delete(documentId);
    } catch (error) {
      console.error("Delete document error:", error);
      throw new Error("Failed to delete document");
    }
  }
  async recentUploads(providerId) {
    return MedicalDocumentModel.recentUploads(providerId);
  }
  async getAllHealthRecords() {
    try {
      return await MedicalDocumentModel.getAllHealthRecords();
    } catch (error) {
      console.error("Error in DocumentService:", error);
      throw error; // Re-throw the error to the controller
    }
  }
}

module.exports = new DocumentService();

const BaseModel = require("./BaseModel");

class MedicalDocument extends BaseModel {
  constructor() {
    super("medicalDocument");
  }

  /**
   * Create document with access control
   * @param {string} recordId
   * @param {Object} documentData
   * @returns {Promise<Object>}
   */
  async createDocument(recordId, { name, storagePath, confidentiality }) {
    return this.prisma.medicalDocument.create({
      data: {
        record: { connect: { id: recordId } },
        name,
        storagePath,
        confidentiality: confidentiality || "MEDIUM",
      },
    });
  }

  /**
   * Get documents by confidentiality level
   * @param {string} recordId
   * @param {string} level
   * @returns {Promise<Array>}
   */
  async getDocumentsByConfidentiality(recordId, level) {
    return this.prisma.medicalDocument.findMany({
      where: { recordId, confidentiality: level },
    });
  }
}

module.exports = new MedicalDocument();

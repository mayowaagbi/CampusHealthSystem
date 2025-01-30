const BaseModel = require("./BaseModel");

class JournalEntry extends BaseModel {
  constructor() {
    super("journalEntry");
  }

  /**
   * Create a new journal entry with analysis
   * @param {string} studentId - UUID of the student
   * @param {Object} entryData - Journal entry content
   * @returns {Promise<Object>} Created journal entry
   */
  async createEntry(studentId, entryData) {
    return this.prisma.journalEntry.create({
      data: {
        student: { connect: { id: studentId } },
        ...entryData,
      },
    });
  }

  /**
   * Get journal entries with pagination and date filtering
   * @param {string} studentId - UUID of the student
   * @param {Object} filters - { startDate, endDate, page, pageSize }
   * @returns {Promise<Object>} Filtered journal entries
   */
  async getEntries(studentId, filters = {}) {
    const { startDate, endDate, page = 1, pageSize = 10 } = filters;
    const skip = (page - 1) * pageSize;

    return this.prisma.journalEntry.findMany({
      where: {
        studentId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      skip,
      take: pageSize,
      orderBy: { createdAt: "desc" },
    });
  }
}

module.exports = new JournalEntry();

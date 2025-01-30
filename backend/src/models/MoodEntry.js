const BaseModel = require("./BaseModel");

class MoodEntry extends BaseModel {
  constructor() {
    super("moodEntry");
  }

  /**
   * Record a new mood entry
   * @param {string} studentId - UUID of the student
   * @param {string} mood - Mood type from enum
   * @param {string} notes - Optional notes
   * @returns {Promise<Object>} Created mood entry
   */
  async recordMood(studentId, mood, notes = null) {
    return this.prisma.moodEntry.create({
      data: {
        student: { connect: { id: studentId } },
        mood,
        notes,
      },
    });
  }

  /**
   * Get mood trends over time
   * @param {string} studentId - UUID of the student
   * @param {Object} filters - { startDate, endDate }
   * @returns {Promise<Array>} Mood entries with trends
   */
  async getMoodTrends(studentId, filters = {}) {
    const { startDate, endDate } = filters;
    return this.prisma.moodEntry.findMany({
      where: {
        studentId,
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { createdAt: "asc" },
    });
  }

  /**
   * Get mood statistics
   * @param {string} studentId - UUID of the student
   * @returns {Promise<Object>} Mood distribution statistics
   */
  async getMoodStatistics(studentId) {
    return this.prisma.moodEntry.groupBy({
      by: ["mood"],
      where: { studentId },
      _count: { mood: true },
    });
  }
}

module.exports = new MoodEntry();

// src/models/AlertModel.js
const BaseModel = require("./BaseModel");

class AlertModel extends BaseModel {
  constructor() {
    super("alert");
  }

  async createWithStudents(data) {
    return this.prisma.alert.create({
      data: {
        title: data.title,
        message: data.message,
        priority: data.priority,
        startTime: data.startTime,
        endTime: data.endTime,
        createdById: data.createdById,
        students: {
          create: data.studentIds.map((studentDetailsId) => ({
            student: {
              connect: { id: studentDetailsId },
            },
          })),
        },
      },
      include: {
        students: {
          include: {
            student: {
              include: {
                profile: true,
              },
            },
          },
        },
      },
    });
  }
  async findById(id) {
    return prisma.alert.findUnique({ where: { id } });
  }
  async findMany(options) {
    return this.prisma.alert.findMany(options);
  }
  async updateAlertStatus(id, status) {
    return prisma.alert.update({
      where: { id },
      data: { status },
    });
  }
}

module.exports = new AlertModel();

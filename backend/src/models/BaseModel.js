const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class BaseModel {
  constructor(modelName) {
    this.model = prisma[modelName];
    this.prisma = prisma;
  }

  async findById(id, include = null) {
    return this.model.findUnique({
      where: { id },
      include,
    });
  }

  async findAll(where = {}, include = null, skip = 0, take = 100) {
    return this.model.findMany({
      where,
      include,
      skip,
      take,
    });
  }

  async create(data) {
    return this.model.create({ data });
  }

  async update(id, data) {
    return this.model.update({
      where: { id },
      data,
    });
  }

  async delete(id) {
    return this.model.delete({
      where: { id },
    });
  }
}

module.exports = BaseModel;

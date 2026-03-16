class BaseService {
  constructor(model) {
    this.model = model;
  }

  async findAll(options = {}) {
    return await this.model.findAll(options);
  }

  async findById(id) {
    return await this.model.findByPk(id);
  }

  async create(data) {
    return await this.model.create(data);
  }

  async update(id, data) {
    const record = await this.findById(id);
    if (!record) {
      throw { status: 404, message: `${this.model.name} tapylmady` };
    }
    return await record.update(data);
  }

  async delete(id) {
    const record = await this.findById(id);
    if (!record) {
      throw { status: 404, message: `${this.model.name} tapylmady` };
    }
    return await record.destroy();
  }
}

module.exports = BaseService;

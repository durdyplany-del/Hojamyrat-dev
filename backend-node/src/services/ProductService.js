const { Product } = require('../models');
const BaseService = require('./BaseService');

class ProductService extends BaseService {
  constructor() {
    super(Product);
  }

  async getAll() {
    return await this.findAll({ order: [['createdAt', 'DESC']] });
  }

  async createProduct(name, buyPrice, sellPrice, quantity, purchaseDate = null, unit = 'st', req = null) {
    if (!name) {
      throw { status: 400, message: 'Harydyň ady gerek' };
    }
    if (buyPrice < 0 || sellPrice < 0 || quantity < 0) {
      throw { status: 400, message: 'Bahalar we sany positif bolmaly' };
    }

    const product = await this.create({
      name,
      buyPrice,
      sellPrice,
      quantity,
      purchaseDate: purchaseDate || new Date(),
      unit: unit || 'st'
    });

    const io = req?.app?.get('io');
    if (io) {
      io.emit('productCreated', product);
    }

    return product;
  }

  async updateProduct(id, name, buyPrice, sellPrice, quantity, purchaseDate = null, unit = 'st', req = null) {
    if (!name) {
      throw { status: 400, message: 'Harydyň ady gerek' };
    }
    if (buyPrice < 0 || sellPrice < 0 || quantity < 0) {
      throw { status: 400, message: 'Bahalar we sany positif bolmaly' };
    }

    const updateData = { name, buyPrice, sellPrice, quantity, unit: unit || 'st' };
    if (purchaseDate) {
      updateData.purchaseDate = purchaseDate;
    }

    const product = await this.update(id, updateData);

    const io = req?.app?.get('io');
    if (io) {
      io.emit('productUpdated', product);
    }

    return product;
  }
}

module.exports = new ProductService();

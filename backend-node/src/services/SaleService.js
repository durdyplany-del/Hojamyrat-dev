const { Product, Sale } = require('../models');
const { Op } = require('sequelize');

class SaleService {
  async getAll() {
    return await Sale.findAll({
      include: [{ model: Product, as: 'product' }],
      order: [['createdAt', 'DESC']]
    });
  }

  async getById(id) {
    const sale = await Sale.findByPk(id, {
      include: [{ model: Product, as: 'product' }]
    });
    if (!sale) {
      throw { status: 404, message: 'Satys tapylmady' };
    }
    return sale;
  }

  async createSale(productId, quantity, req) {
    if (quantity <= 0) {
      throw { status: 400, message: 'Sany 0-dan uly bolmaly' };
    }

    const product = await Product.findByPk(productId);
    if (!product) {
      throw { status: 404, message: 'Haryt tapylmady' };
    }

    if (product.quantity < quantity) {
      throw { status: 400, message: 'Ýeterlik haryt ýok' };
    }

    await product.update({ quantity: product.quantity - quantity });

    const sale = await Sale.create({
      productId,
      quantity,
      totalPrice: quantity * product.sellPrice,
      soldAt: new Date()
    });

    const io = req.app.get('io');
    if (io) {
      io.emit('saleCreated', sale);
      io.emit('productUpdated', product);
    }

    return await this.getById(sale.id);
  }

  async getDailyStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const sales = await Sale.findAll({
      where: {
        soldAt: {
          [Op.gte]: today,
          [Op.lt]: tomorrow
        }
      },
      include: [{ model: Product, as: 'product' }]
    });

    return this.calculateStats(sales);
  }

  async getWeeklyStats() {
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const sales = await Sale.findAll({
      where: {
        soldAt: {
          [Op.gte]: weekAgo,
          [Op.lte]: today
        }
      },
      include: [{ model: Product, as: 'product' }]
    });

    return this.calculateStats(sales);
  }

  calculateStats(sales) {
    let totalAmount = 0;
    let profit = 0;

    sales.forEach(sale => {
      totalAmount += parseFloat(sale.totalPrice);
      if (sale.product) {
        profit += sale.totalPrice - (sale.quantity * sale.product.buyPrice);
      }
    });

    return {
      totalSales: sales.length,
      totalAmount,
      profit
    };
  }
}

module.exports = new SaleService();

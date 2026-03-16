const { Product, Sale } = require('../models');

class DashboardService {
  async getStats() {
    const products = await Product.findAll();
    const sales = await Sale.findAll({
      include: [{ model: Product, as: 'product' }]
    });

    const productMap = {};
    products.forEach(p => { productMap[p.id] = p; });

    let totalRemaining = 0;
    let stockValue = 0;
    products.forEach(p => {
      totalRemaining += p.quantity;
      stockValue += p.quantity * p.sellPrice;
    });

    let totalSold = 0;
    let soldAmount = 0;
    let profit = 0;

    sales.forEach(s => {
      totalSold += s.quantity;
      soldAmount += parseFloat(s.totalPrice);
      const product = productMap[s.productId];
      if (product) {
        profit += s.totalPrice - (s.quantity * product.buyPrice);
      }
    });

    return {
      totalProducts: products.length,
      totalSold,
      totalRemaining,
      totalSoldAmount: soldAmount,
      stockValue,
      profit
    };
  }

  async getProductStats() {
    const products = await Product.findAll();
    const sales = await Sale.findAll({
      include: [{ model: Product, as: 'product' }]
    });

    const salesByProduct = {};
    sales.forEach(s => {
      if (!salesByProduct[s.productId]) {
        salesByProduct[s.productId] = [];
      }
      salesByProduct[s.productId].push(s);
    });

    return products.map(product => {
      const productSales = salesByProduct[product.id] || [];
      const totalSold = productSales.reduce((sum, s) => sum + s.quantity, 0);
      const totalRevenue = productSales.reduce((sum, s) => sum + parseFloat(s.totalPrice), 0);

      return {
        product_id: product.id,
        product_name: product.name,
        total_sold: totalSold,
        total_revenue: totalRevenue,
        remaining: product.quantity
      };
    });
  }
}

module.exports = new DashboardService();

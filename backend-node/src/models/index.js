const { sequelize } = require('../config/database');
const User = require('./User');
const Product = require('./Product');
const Sale = require('./Sale');

Product.hasMany(Sale, { foreignKey: 'productId', as: 'sales' });
Sale.belongsTo(Product, { foreignKey: 'productId', as: 'product' });

module.exports = {
  sequelize,
  User,
  Product,
  Sale
};

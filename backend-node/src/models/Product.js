const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  buyPrice: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    field: 'buy_price'
  },
  sellPrice: {
    type: DataTypes.DECIMAL(12, 2),
    allowNull: false,
    field: 'sell_price'
  },
  purchaseDate: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'purchase_date'
  },
  unit: {
    type: DataTypes.STRING(20),
    allowNull: true,
    defaultValue: 'st'
  }
}, {
  tableName: 'products',
  timestamps: true
});

module.exports = Product;

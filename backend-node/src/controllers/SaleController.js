const saleService = require('../services/SaleService');

const getAll = async (req, res, next) => {
  try {
    const sales = await saleService.getAll();
    res.json({
      success: true,
      data: sales
    });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const sale = await saleService.getById(req.params.id);
    res.json({
      success: true,
      data: sale
    });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const sale = await saleService.createSale(productId, quantity, req);
    res.status(201).json({
      success: true,
      message: 'Satys döredildi',
      data: sale
    });
  } catch (error) {
    next(error);
  }
};

const getDailyStats = async (req, res, next) => {
  try {
    const stats = await saleService.getDailyStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

const getWeeklyStats = async (req, res, next) => {
  try {
    const stats = await saleService.getWeeklyStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getById, create, getDailyStats, getWeeklyStats };

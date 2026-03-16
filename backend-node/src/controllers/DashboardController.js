const dashboardService = require('../services/DashboardService');

const getStats = async (req, res, next) => {
  try {
    const stats = await dashboardService.getStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

const getProductStats = async (req, res, next) => {
  try {
    const stats = await dashboardService.getProductStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getStats, getProductStats };

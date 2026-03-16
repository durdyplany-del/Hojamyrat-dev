const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/DashboardController');

router.get('/', dashboardController.getStats);
router.get('/products', dashboardController.getProductStats);

module.exports = router;

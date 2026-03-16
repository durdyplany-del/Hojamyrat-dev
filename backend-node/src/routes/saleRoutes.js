const express = require('express');
const router = express.Router();
const saleController = require('../controllers/SaleController');

router.get('/daily', saleController.getDailyStats);
router.get('/weekly', saleController.getWeeklyStats);
router.get('/', saleController.getAll);
router.get('/:id', saleController.getById);
router.post('/', saleController.create);

module.exports = router;

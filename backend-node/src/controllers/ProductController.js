const productService = require('../services/ProductService');

const getAll = async (req, res, next) => {
  try {
    const products = await productService.getAll();
    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const product = await productService.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Haryt tapylmady'
      });
    }
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const { name, buyPrice, sellPrice, quantity, purchaseDate, unit } = req.body;
    const product = await productService.createProduct(name, buyPrice, sellPrice, quantity, purchaseDate, unit, req);
    res.status(201).json({
      success: true,
      message: 'Haryt döredildi',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const { name, buyPrice, sellPrice, quantity, purchaseDate, unit } = req.body;
    const product = await productService.updateProduct(req.params.id, name, buyPrice, sellPrice, quantity, purchaseDate, unit, req);
    res.json({
      success: true,
      message: 'Haryt üýtgedildi',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    await productService.delete(req.params.id);
    res.json({
      success: true,
      message: 'Haryt pozuldy'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getById, create, update, remove };

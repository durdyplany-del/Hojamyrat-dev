const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err.message);
  
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      success: false,
      error: err.errors.map(e => e.message).join(', ')
    });
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({
      success: false,
      error: 'Bu maglumat eýýam bar'
    });
  }

  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Ichki säwlik'
  });
};

module.exports = errorHandler;

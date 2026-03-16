const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const publicRoutes = ['/api/register', '/api/login', '/', '/health', '/api/'];
  
  if (publicRoutes.includes(req.path)) {
    return next();
  }

  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      error: 'Token gerek'
    });
  }

  const token = authHeader.startsWith('Bearer ') 
    ? authHeader.slice(7) 
    : authHeader;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'ecommerce-secret-key-2024');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Nädogry token'
    });
  }
};

module.exports = authMiddleware;

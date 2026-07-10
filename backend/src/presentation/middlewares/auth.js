const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ success: false, error: 'Authentification requise' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, error: 'Token invalide' });
  }
};

const sellerMiddleware = (req, res, next) => {
  if (!req.user || !req.user.isSeller) {
    return res.status(403).json({ success: false, error: 'Vous devez être vendeur pour effectuer cette action' });
  }
  next();
};

module.exports = { authMiddleware, sellerMiddleware };
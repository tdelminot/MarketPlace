const jwt = require('jsonwebtoken');

class JwtService {
  constructor() {
    this.secret = process.env.JWT_SECRET || 'secret_key';
    this.expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  }

  generateToken(payload) {
    return jwt.sign(
      {
        id: payload.id,
        username: payload.username,
        email: payload.email,
        isSeller: payload.isSeller || false
      },
      this.secret,
      { expiresIn: this.expiresIn }
    );
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, this.secret);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('Token expiré');
      }
      if (error.name === 'JsonWebTokenError') {
        throw new Error('Token invalide');
      }
      throw new Error('Erreur de vérification du token');
    }
  }

  decodeToken(token) {
    try {
      return jwt.decode(token);
    } catch (error) {
      return null;
    }
  }

  refreshToken(token) {
    try {
      const decoded = this.verifyToken(token);
      // Enlever les champs exp et iat pour regénérer
      const { exp, iat, ...payload } = decoded;
      return this.generateToken(payload);
    } catch (error) {
      throw new Error('Impossible de rafraîchir le token');
    }
  }

  extractTokenFromHeader(authHeader) {
    if (!authHeader) {
      return null;
    }
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return null;
    }
    return parts[1];
  }

  // Middleware pour Express
  authenticate() {
    return (req, res, next) => {
      try {
        const token = this.extractTokenFromHeader(req.headers.authorization);
        if (!token) {
          return res.status(401).json({
            success: false,
            error: 'Authentification requise'
          });
        }

        const decoded = this.verifyToken(token);
        req.user = decoded;
        next();
      } catch (error) {
        return res.status(401).json({
          success: false,
          error: error.message || 'Token invalide'
        });
      }
    };
  }

  requireSeller() {
    return (req, res, next) => {
      if (!req.user || !req.user.isSeller) {
        return res.status(403).json({
          success: false,
          error: 'Vous devez être vendeur pour effectuer cette action'
        });
      }
      next();
    };
  }

  requireOwnership(resourceIdField = 'id') {
    return async (req, res, next) => {
      try {
        const userId = req.user.id;
        const resourceId = req.params[resourceIdField];
        
        // Vérifier que l'utilisateur est le propriétaire
        // Cette logique dépend du repository passé en paramètre
        // À implémenter selon les besoins
        
        next();
      } catch (error) {
        return res.status(403).json({
          success: false,
          error: 'Vous n\'êtes pas autorisé à effectuer cette action'
        });
      }
    };
  }
}

module.exports = new JwtService();
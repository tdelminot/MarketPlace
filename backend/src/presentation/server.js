 
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs-extra');
const xss = require('xss');

const dbConnection = require('../infrastructure/database/mysqlConnection');
const UserRepository = require('../infrastructure/database/repositories/UserRepository');
const ProductRepository = require('../infrastructure/database/repositories/ProductRepository');

const AuthController = require('./controllers/AuthController');
const ProductController = require('./controllers/ProductController');
const StatsController = require('./controllers/StatsController');

const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const statsRoutes = require('./routes/stats.routes');

const app = express();
const PORT = process.env.PORT || 5000;

//  SECURITÉ - HELMET
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:", "http:"],
      connectSrc: ["'self'", "http://localhost:3000", "http://localhost:5000", "https:"],
      fontSrc: ["'self'", "data:"],
      objectSrc: ["'none'"]
    }
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginOpenerPolicy: { policy: "unsafe-none" }
}));

//  SECURITÉ - RATE LIMITING
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    error: 'Trop de requêtes, veuillez réessayer plus tard.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/api', limiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    error: 'Trop de tentatives de connexion, veuillez réessayer plus tard.'
  }
});

app.use('/api/auth', authLimiter);

// CORS
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

//  MIDDLEWARE - XSS PROTECTION 
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use((req, res, next) => {
  if (req.body) {
    const clean = (obj) => {
      if (typeof obj === 'string') {
        return xss(obj);
      }
      if (typeof obj === 'object' && obj !== null) {
        Object.keys(obj).forEach(key => {
          obj[key] = clean(obj[key]);
        });
      }
      return obj;
    };
    req.body = clean(req.body);
  }
  next();
});

// STATIC FILES
app.use('/uploads', (req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
}, express.static(path.join(__dirname, '../../uploads')));

// REPOSITORIES & CONTROLLERS
const userRepository = new UserRepository(dbConnection);
const productRepository = new ProductRepository(dbConnection);

const authController = new AuthController(userRepository);
const productController = new ProductController(productRepository, userRepository);
const statsController = new StatsController(productRepository, userRepository);

// ROUTES
app.use('/api/auth', authRoutes(authController));
app.use('/api/products', productRoutes(productController));
app.use('/api/stats', statsRoutes(statsController));

// HEALTH CHECK
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    security: {
      helmet: true,
      rateLimit: true,
      xssProtection: true
    }
  });
});

// ERROR HANDLER
app.use((err, req, res, next) => {
  console.error('❌ Erreur:', err);
  
  if (err.code === 'EBADCSRFTOKEN') {
    return res.status(403).json({
      success: false,
      error: 'Token CSRF invalide'
    });
  }
  
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Erreur interne du serveur'
  });
});

// DÉMARRAGE
const startServer = async () => {
  try {
    await dbConnection.connect();
    app.listen(PORT, () => {
      console.log(`🚀 MarketPlace API démarrée sur http://localhost:${PORT}`);
      console.log(`📁 Uploads: ${path.join(__dirname, '../../uploads')}`);
      console.log(`🛡️ Sécurité: Helmet, Rate Limiting, XSS Protection`);
    });
  } catch (error) {
    console.error('❌ Erreur au démarrage:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
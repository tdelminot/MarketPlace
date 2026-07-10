const { body, validationResult } = require('express-validator');

// Validation pour l'inscription
const validateRegister = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email invalide')
    .isLength({ max: 100 })
    .withMessage('Email trop long'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Le mot de passe doit contenir au moins 6 caractères')
    .matches(/^(?=.*[A-Za-z])(?=.*\d)/)
    .withMessage('Le mot de passe doit contenir au moins une lettre et un chiffre'),
  
  body('fullName')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('Le nom doit contenir entre 2 et 100 caractères')
    .matches(/^[a-zA-ZÀ-ÿ\s-]+$/)
    .withMessage('Le nom ne doit contenir que des lettres'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    next();
  }
];

// Validation pour la connexion
const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Email invalide'),
  
  body('password')
    .notEmpty()
    .withMessage('Mot de passe requis'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    next();
  }
];

// Validation pour la création de produit
const validateProduct = [
  body('title')
    .isLength({ min: 3, max: 200 })
    .withMessage('Le titre doit contenir entre 3 et 200 caractères')
    .trim()
    .escape(),
  
  body('description')
    .optional()
    .isLength({ max: 2000 })
    .withMessage('La description ne doit pas dépasser 2000 caractères'),
  
  body('price')
    .isFloat({ min: 0.01, max: 999999.99 })
    .withMessage('Le prix doit être entre 0.01 et 999999.99'),
  
  body('category')
    .optional()
    .isIn(['electronics', 'clothing', 'books', 'sport', 'music', 'other'])
    .withMessage('Catégorie invalide'),
  
  body('condition')
    .optional()
    .isIn(['new', 'like-new', 'good', 'fair'])
    .withMessage('État invalide'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    next();
  }
];

module.exports = {
  validateRegister,
  validateLogin,
  validateProduct
};

const { body } = require('express-validator');

// Validation pour l'inscription
exports.registerValidation = [
  body('username')
    .isLength({ min: 3 })
    .withMessage('Le nom d\'utilisateur doit contenir au moins 3 caractères')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Le nom d\'utilisateur ne peut contenir que des lettres, chiffres et underscores'),

  body('email')
    .isEmail()
    .withMessage('Email invalide')
    .normalizeEmail(),

  body('password')
    .isLength({ min: 6 })
    .withMessage('Le mot de passe doit contenir au moins 6 caractères')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre')
];

// Validation pour la connexion
exports.loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Email invalide')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('Mot de passe requis')
];

// Validation pour la mise à jour du profil
exports.updateProfileValidation = [
  body('username')
    .optional()
    .isLength({ min: 3 })
    .withMessage('Le nom d\'utilisateur doit contenir au moins 3 caractères')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Le nom d\'utilisateur ne peut contenir que des lettres, chiffres et underscores'),

  body('email')
    .optional()
    .isEmail()
    .withMessage('Email invalide')
    .normalizeEmail()
];
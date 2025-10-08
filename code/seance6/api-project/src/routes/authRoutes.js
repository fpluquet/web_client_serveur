const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { registerValidation, loginValidation } = require('../middleware/validation');

// POST /api/auth/register - Inscription
router.post('/register', registerValidation, authController.register);

// POST /api/auth/login - Connexion
router.post('/login', loginValidation, authController.login);

module.exports = router;
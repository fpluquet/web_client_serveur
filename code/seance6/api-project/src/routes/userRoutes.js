const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');
const adminMiddleware = require('../middleware/admin');
const { updateProfileValidation } = require('../middleware/validation');

// GET /api/users/profile - Obtenir son profil (utilisateur connecté)
router.get('/profile', authMiddleware, userController.getProfile);

// PUT /api/users/profile - Mettre à jour son profil (utilisateur connecté)
router.put('/profile', authMiddleware, updateProfileValidation, userController.updateProfile);

// GET /api/users - Obtenir la liste des utilisateurs (admin seulement)
router.get('/', authMiddleware, adminMiddleware, userController.getUsers);

module.exports = router;
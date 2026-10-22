import { validationResult } from 'express-validator';
import userService, { UserError } from '../services/userService.js';

// Obtenir le profil utilisateur
export const getProfile = async (req, res) => {
  try {
    const user = await userService.getProfile(req.user.userId);

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    if (error instanceof UserError) {
      return res.status(error.status).json({
        success: false,
        message: error.message
      });
    }
    console.error('Erreur lors de la récupération du profil:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// Mettre à jour le profil utilisateur
export const updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const user = await userService.updateProfile(req.user.userId, req.body);

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    if (error instanceof UserError) {
      return res.status(error.status).json({
        success: false,
        message: error.message
      });
    }
    console.error('Erreur lors de la mise à jour du profil:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

// Obtenir la liste des utilisateurs (admin seulement)
export const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const data = await userService.getUsers({ page, limit });

    res.json({
      success: true,
      data
    });
  } catch (error) {
    if (error instanceof UserError) {
      return res.status(error.status).json({
        success: false,
        message: error.message
      });
    }
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur'
    });
  }
};

export default { getProfile, updateProfile, getUsers };

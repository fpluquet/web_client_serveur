import userRepository from '../repositories/UserRepository.js';

/** Erreur métier avec code HTTP pour le contrôleur. */
export class UserError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

/**
 * Service utilisateurs : orchestre modèle + repository.
 * Le contrôleur ne parle qu'à ce service.
 */
export const getProfile = async (userId) => {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new UserError('Utilisateur non trouvé', 404);
  }
  return user.toJSON();
};

export const updateProfile = async (userId, { username, email }) => {
  if (email) {
    const existing = await userRepository.findOne({ email });
    if (existing && existing.id !== userId) {
      throw new UserError(
        'Un utilisateur avec cet email ou nom d\'utilisateur existe déjà',
        400
      );
    }
  }
  if (username) {
    const existing = await userRepository.findOne({ username });
    if (existing && existing.id !== userId) {
      throw new UserError(
        'Un utilisateur avec cet email ou nom d\'utilisateur existe déjà',
        400
      );
    }
  }

  const updates = {};
  if (username !== undefined) updates.username = username;
  if (email !== undefined) updates.email = email;

  const updatedUser = await userRepository.findByIdAndUpdate(userId, updates);
  if (!updatedUser) {
    throw new UserError('Utilisateur non trouvé', 404);
  }

  return updatedUser.toJSON();
};

export const getUsers = async ({ page = 1, limit = 10 } = {}) => {
  const skip = (page - 1) * limit;
  const allUsers = await userRepository.find();
  const users = allUsers
    .map((user) => user.toJSON())
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(skip, skip + limit);

  const total = await userRepository.countDocuments();

  return {
    users,
    pagination: {
      page,
      pages: Math.ceil(total / limit),
      total
    }
  };
};

export const changePassword = async (userId, { currentPassword, newPassword }) => {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw new UserError('Utilisateur non trouvé', 404);
  }

  const isCurrentPasswordValid = await user.comparePassword(currentPassword);
  if (!isCurrentPasswordValid) {
    throw new UserError('L\'ancien mot de passe est incorrect', 400);
  }

  const isSamePassword = await user.comparePassword(newPassword);
  if (isSamePassword) {
    throw new UserError(
      'Le nouveau mot de passe doit être différent de l\'ancien',
      400
    );
  }

  user.password = newPassword;
  await user.hashPassword();
  await userRepository.save(user);

  return { message: 'Mot de passe modifié avec succès' };
};

export default { getProfile, updateProfile, getUsers, changePassword };

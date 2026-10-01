import fs from 'fs/promises';
import path from 'path';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class FileDataStore {
  constructor(filename) {
    this.filename = filename;
    this.dataDir = path.join(__dirname, '..', 'data');
    this.filePath = path.join(this.dataDir, `${filename}.json`);
    this.ensureDataDir();
  }

  async ensureDataDir() {
    try {
      await fs.mkdir(this.dataDir, { recursive: true });
    } catch (error) {
      // Directory already exists
    }
  }

  async readData() {
    try {
      const data = await fs.readFile(this.filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }

  async writeData(data) {
    await fs.writeFile(this.filePath, JSON.stringify(data, null, 2));
  }
}
const filename = process.env.ENVIRONMENT?.trim() === "test" ? "users.test" : "users.prod";

class User {
  constructor(userData) {
    this.id = userData.id || Date.now().toString();
    this.username = userData.username;
    this.email = userData.email;
    this.password = userData.password;
    this.role = userData.role || 'user';
    this.createdAt = userData.createdAt || new Date().toISOString();
  }

  static dataStore = new FileDataStore(filename);

  // Méthode pour hasher le mot de passe
  async hashPassword() {
    if (this.password && !this.password.startsWith('$2a$')) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
  }

  // Méthode pour vérifier le mot de passe
  async comparePassword(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  }

  // Méthode pour exclure le mot de passe lors de la sérialisation
  toJSON() {
    const userObject = { ...this };
    delete userObject.password;
    return userObject;
  }

  // Sauvegarder un utilisateur
  async save() {
    await this.hashPassword();
    const users = await User.dataStore.readData();
    
    // Créer un objet complet avec le mot de passe pour la sauvegarde
    const userToSave = {
      id: this.id,
      username: this.username,
      email: this.email,
      password: this.password,
      role: this.role,
      createdAt: this.createdAt
    };
    
    // Vérifier si l'utilisateur existe déjà
    const existingIndex = users.findIndex(u => u.id === this.id);
    
    if (existingIndex >= 0) {
      users[existingIndex] = userToSave;
    } else {
      users.push(userToSave);
    }
    
    await User.dataStore.writeData(users);
    return this;
  }

  // Trouver un utilisateur par critères (égalité exacte sur chaque champ)
  static async findOne(criteria) {
    const users = await User.dataStore.readData();
    const userData = users.find(user =>
      Object.keys(criteria).every(key => user[key] === criteria[key])
    );
    return userData ? new User(userData) : null;
  }

  // Trouver un utilisateur par ID
  static async findById(id) {
    const users = await User.dataStore.readData();
    const userData = users.find(user => user.id === id);
    return userData ? new User(userData) : null;
  }

  /**
   * Trouve un utilisateur par id et applique les mises à jour.
   * @param {string} id
   * @param {object} updates
   * @returns {Promise<object|null>} Le document mis à jour, ou null si introuvable
   */
  static async findByIdAndUpdate(id, updates) {
    const users = await User.dataStore.readData();
    const userIndex = users.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
      return null;
    }
    
    users[userIndex] = { ...users[userIndex], ...updates };
    await User.dataStore.writeData(users);
    return users[userIndex];
  }

  // Trouver tous les utilisateurs avec pagination
  static async find(options = {}) {
    const users = await User.dataStore.readData();
    return users;
  }

  // Compter les documents
  static async countDocuments() {
    const users = await User.dataStore.readData();
    return users.length;
  }
}

export default User;
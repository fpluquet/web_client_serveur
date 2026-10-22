import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import User from '../models/User.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Accès bas niveau au stockage fichier JSON.
 * Isolé ici pour que le repository puisse un jour basculer
 * vers une vraie base de données sans toucher au modèle User.
 */
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

/**
 * Repository User : CRUD uniquement.
 * Hydrate des instances User à la lecture.
 * Ne contient pas de règles métier (unicité, JWT, hashage…).
 */
class UserRepository {
  constructor() {
    const filename =
      process.env.ENVIRONMENT?.trim() === 'test' ? 'users.test' : 'users.prod';
    this.dataStore = new FileDataStore(filename);
  }

  async save(user) {
    const users = await this.dataStore.readData();
    const userToSave = {
      id: user.id,
      username: user.username,
      email: user.email,
      password: user.password,
      role: user.role,
      createdAt: user.createdAt
    };

    const existingIndex = users.findIndex((u) => u.id === user.id);

    if (existingIndex >= 0) {
      users[existingIndex] = userToSave;
    } else {
      users.push(userToSave);
    }

    await this.dataStore.writeData(users);
    return user;
  }

  async findOne(criteria) {
    const users = await this.dataStore.readData();
    const userData = users.find((user) =>
      Object.keys(criteria).every((key) => user[key] === criteria[key])
    );
    return userData ? new User(userData) : null;
  }

  async findById(id) {
    const users = await this.dataStore.readData();
    const userData = users.find((user) => user.id === id);
    return userData ? new User(userData) : null;
  }

  /**
   * @param {string} id
   * @param {object} updates
   * @returns {Promise<User|null>}
   */
  async findByIdAndUpdate(id, updates) {
    const users = await this.dataStore.readData();
    const userIndex = users.findIndex((user) => user.id === id);

    if (userIndex === -1) {
      return null;
    }

    users[userIndex] = { ...users[userIndex], ...updates };
    await this.dataStore.writeData(users);
    return new User(users[userIndex]);
  }

  async find() {
    const users = await this.dataStore.readData();
    return users.map((userData) => new User(userData));
  }

  async countDocuments() {
    const users = await this.dataStore.readData();
    return users.length;
  }
}

export default new UserRepository();

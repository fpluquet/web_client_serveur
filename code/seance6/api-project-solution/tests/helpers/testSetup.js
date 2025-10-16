import { close } from '../../src/app.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const cleanupTestDatabase = () => {
  const testDbPath = path.join(__dirname, '..', '..', 'src', 'data', 'users.test.json');
  if (fs.existsSync(testDbPath)) {
    fs.unlinkSync(testDbPath);
  }
};

// Global test setup
afterEach(() => {
  cleanupTestDatabase();
});

afterAll(() => {
  if (close) {
    close();
  }
});
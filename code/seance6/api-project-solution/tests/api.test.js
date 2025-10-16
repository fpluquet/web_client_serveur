import request from 'supertest';
import { app, close } from '../src/app.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


describe('API Tests', () => {
  describe('GET /', () => {
    it('should return welcome message', async () => {
      const res = await request(app)
        .get('/')
        .expect(200);
      
      expect(res.body).toHaveProperty('message');
      expect(res.body.message).toBe('API RESTful avec Node.js et Express');
    });
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'Password123'
      };

      const res = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(res.body).toHaveProperty('success', true);
      expect(res.body.data).toHaveProperty('user');
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data.user.email).toBe(userData.email);
    });

    it('should not register user with invalid email', async () => {
      const userData = {
        username: 'testuser',
        email: 'invalid-email',
        password: 'Password123'
      };

      const res = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('errors');
    });
  });

  describe('PUT /api/users/change-password', () => {
    let authToken;
    let userId;
    
    beforeEach(async () => {
      // Créer un utilisateur et récupérer son token
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'Password123'
      };

      const registerRes = await request(app)
        .post('/api/auth/register')
        .send(userData);

      authToken = registerRes.body.data.token;
      userId = registerRes.body.data.user.id;
    });

    it('should change password successfully', async () => {
      const changePasswordData = {
        currentPassword: 'Password123',
        newPassword: 'NewPassword456',
        confirmPassword: 'NewPassword456'
      };

      const res = await request(app)
        .put('/api/users/change-password')
        .set('Authorization', `Bearer ${authToken}`)
        .send(changePasswordData)
        .expect(200);

      expect(res.body).toHaveProperty('success', true);
      expect(res.body).toHaveProperty('message', 'Mot de passe modifié avec succès');

      // Vérifier que l'ancien mot de passe ne fonctionne plus
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Password123'
        })
        .expect(401);

      expect(loginRes.body).toHaveProperty('success', false);

      // Vérifier que le nouveau mot de passe fonctionne
      const newLoginRes = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'NewPassword456'
        })
        .expect(200);

      expect(newLoginRes.body).toHaveProperty('success', true);
    });

    it('should not change password with wrong current password', async () => {
      const changePasswordData = {
        currentPassword: 'WrongPassword',
        newPassword: 'NewPassword456',
        confirmPassword: 'NewPassword456'
      };

      const res = await request(app)
        .put('/api/users/change-password')
        .set('Authorization', `Bearer ${authToken}`)
        .send(changePasswordData)
        .expect(400);

      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('message', 'L\'ancien mot de passe est incorrect');
    });

    it('should not change password when new password is same as current', async () => {
      const changePasswordData = {
        currentPassword: 'Password123',
        newPassword: 'Password123',
        confirmPassword: 'Password123'
      };

      const res = await request(app)
        .put('/api/users/change-password')
        .set('Authorization', `Bearer ${authToken}`)
        .send(changePasswordData)
        .expect(400);

      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('message', 'Le nouveau mot de passe doit être différent de l\'ancien');
    });

    it('should not change password with invalid new password', async () => {
      const changePasswordData = {
        currentPassword: 'Password123',
        newPassword: '123', // Trop court
        confirmPassword: '123'
      };

      const res = await request(app)
        .put('/api/users/change-password')
        .set('Authorization', `Bearer ${authToken}`)
        .send(changePasswordData)
        .expect(400);

      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('errors');
    });

    it('should not change password when passwords do not match', async () => {
      const changePasswordData = {
        currentPassword: 'Password123',
        newPassword: 'NewPassword456',
        confirmPassword: 'DifferentPassword789'
      };

      const res = await request(app)
        .put('/api/users/change-password')
        .set('Authorization', `Bearer ${authToken}`)
        .send(changePasswordData)
        .expect(400);

      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('errors');
    });

    it('should not change password without authentication', async () => {
      const changePasswordData = {
        currentPassword: 'Password123',
        newPassword: 'NewPassword456',
        confirmPassword: 'NewPassword456'
      };

      const res = await request(app)
        .put('/api/users/change-password')
        .send(changePasswordData)
        .expect(401);

      expect(res.body).toHaveProperty('success', false);
    });

    it('should not change password with missing fields', async () => {
      const changePasswordData = {
        newPassword: 'NewPassword456',
        confirmPassword: 'NewPassword456'
        // currentPassword manquant
      };

      const res = await request(app)
        .put('/api/users/change-password')
        .set('Authorization', `Bearer ${authToken}`)
        .send(changePasswordData)
        .expect(400);

      expect(res.body).toHaveProperty('success', false);
      expect(res.body).toHaveProperty('errors');
    });
  });
});

afterEach(() => {
  // delete test database file before running tests
  const testDbPath = path.join(__dirname, '..', 'src', 'data', 'users.test.json');
  if (fs.existsSync(testDbPath)) {
    fs.unlinkSync(testDbPath);
  }
});

afterAll(() => {
  // kill the app server after tests
  if (app && close) {
    close();
  }
});
import request from 'supertest';
import { app, close } from '../src/app.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper functions
const createTestUser = async () => {
  const userData = {
    username: 'testuser',
    email: 'test@example.com',
    password: 'Password123'
  };

  const registerRes = await request(app)
    .post('/api/auth/register')
    .send(userData);
  
  return {
    token: registerRes.body.data.token,
    userId: registerRes.body.data.user.id
  };
};

const attemptLogin = (email, password) => {
  return request(app)
    .post('/api/auth/login')
    .send({ email, password });
};

const changePassword = (token, passwordData) => {
  return request(app)
    .put('/api/users/change-password')
    .set('Authorization', `Bearer ${token}`)
    .send(passwordData);
};

const expectSuccessResponse = (response, message = null) => {
  expect(response.body).toHaveProperty('success', true);
  if (message) {
    expect(response.body).toHaveProperty('message', message);
  }
};

const expectErrorResponse = (response, hasErrors = false) => {
  expect(response.body).toHaveProperty('success', false);
  if (hasErrors) {
    expect(response.body).toHaveProperty('errors');
  }
};

const cleanupTestDatabase = () => {
  const testDbPath = path.join(__dirname, '..', 'src', 'data', 'users.test.json');
  if (fs.existsSync(testDbPath)) {
    fs.unlinkSync(testDbPath);
  }
};


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

      expectSuccessResponse(res);
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

      expectErrorResponse(res, true);
    });
  });

  describe('PUT /api/users/change-password', () => {
    let authToken;
    let userId;
    
    beforeEach(async () => {
      const user = await createTestUser();
      authToken = user.token;
      userId = user.userId;
    });

    it('should change password successfully', async () => {
      const changePasswordData = {
        currentPassword: 'Password123',
        newPassword: 'NewPassword456',
        confirmPassword: 'NewPassword456'
      };

      const res = await changePassword(authToken, changePasswordData).expect(200);
      expectSuccessResponse(res, 'Mot de passe modifié avec succès');

      // Vérifier que l'ancien mot de passe ne fonctionne plus
      const loginRes = await attemptLogin('test@example.com', 'Password123').expect(401);
      expectErrorResponse(loginRes);

      // Vérifier que le nouveau mot de passe fonctionne
      const newLoginRes = await attemptLogin('test@example.com', 'NewPassword456').expect(200);
      expectSuccessResponse(newLoginRes);
    });

    it('should not change password with wrong current password', async () => {
      const changePasswordData = {
        currentPassword: 'WrongPassword',
        newPassword: 'NewPassword456',
        confirmPassword: 'NewPassword456'
      };

      const res = await changePassword(authToken, changePasswordData).expect(400);
      expectErrorResponse(res);
      expect(res.body).toHaveProperty('message', 'L\'ancien mot de passe est incorrect');
    });

    it('should not change password when new password is same as current', async () => {
      const changePasswordData = {
        currentPassword: 'Password123',
        newPassword: 'Password123',
        confirmPassword: 'Password123'
      };

      const res = await changePassword(authToken, changePasswordData).expect(400);
      expectErrorResponse(res);
      expect(res.body).toHaveProperty('message', 'Le nouveau mot de passe doit être différent de l\'ancien');
    });

    it('should not change password with invalid new password', async () => {
      const changePasswordData = {
        currentPassword: 'Password123',
        newPassword: '123', // Trop court
        confirmPassword: '123'
      };

      const res = await changePassword(authToken, changePasswordData).expect(400);
      expectErrorResponse(res, true);
    });

    it('should not change password when passwords do not match', async () => {
      const changePasswordData = {
        currentPassword: 'Password123',
        newPassword: 'NewPassword456',
        confirmPassword: 'DifferentPassword789'
      };

      const res = await changePassword(authToken, changePasswordData).expect(400);
      expectErrorResponse(res, true);
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

      expectErrorResponse(res);
    });

    it('should not change password with missing fields', async () => {
      const changePasswordData = {
        newPassword: 'NewPassword456',
        confirmPassword: 'NewPassword456'
        // currentPassword manquant
      };

      const res = await changePassword(authToken, changePasswordData).expect(400);
      expectErrorResponse(res, true);
    });
  });
});

afterEach(() => {
  cleanupTestDatabase();
});

afterAll(() => {
  if (app && close) {
    close();
  }
});
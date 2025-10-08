const request = require('supertest');
const app = require('../src/app');

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
});
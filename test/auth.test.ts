import request from 'supertest';
import app from '../src/app';
import { prismaMock } from './setup';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

describe('Auth Controller', () => {
  describe('POST /auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'Test123!@#'
      };

      prismaMock.user.findFirst.mockResolvedValue(null);
      prismaMock.user.create.mockResolvedValue({
        id: 'user-123',
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedPassword',
        role: 'User',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      const response = await request(app)
        .post('/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.object.username).toBe('testuser');
      expect(response.body.object.email).toBe('test@example.com');
      expect(response.body.object.password).toBeUndefined();
    });

    it('should return 400 for duplicate email', async () => {
      const userData = {
        username: 'testuser',
        email: 'existing@example.com',
        password: 'Test123!@#'
      };

      prismaMock.user.findFirst.mockResolvedValue({
        id: 'existing-user',
        username: 'existinguser',
        email: 'existing@example.com',
        password: 'hashed',
        role: 'User',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      const response = await request(app)
        .post('/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('already in use');
    });
  });

  describe('POST /auth/login', () => {
    it('should login successfully with valid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'Test123!@#'
      };

      prismaMock.user.findUnique.mockResolvedValue({
        id: 'user-123',
        username: 'testuser',
        email: 'test@example.com',
        password: await bcrypt.hash('Test123!@#', 10),
        role: 'User',
        createdAt: new Date(),
        updatedAt: new Date()
      });

      const response = await request(app)
        .post('/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.object.token).toBeDefined();
    });

    it('should return 401 for invalid credentials', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'wrongpassword'
      };

      prismaMock.user.findUnique.mockResolvedValue(null);

      const response = await request(app)
        .post('/auth/login')
        .send(loginData)
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });
});
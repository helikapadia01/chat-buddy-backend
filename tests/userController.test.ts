import request from 'supertest';
import app from '../src/app'; // Import your Express app
import User from '../src/models/userModel';
import { hash, compare } from 'bcrypt';
import { createToken } from '../src/utils/token';
import { COOKIE_NAME } from '../src/utils/constants';

jest.mock('../models/userModel');
jest.mock('bcrypt');
jest.mock('../utils/token');

const mockUser = {
  _id: 'userId',
  name: 'John Doe',
  email: 'john.doe@example.com',
  password: 'hashedPassword',
  save: jest.fn(),
};

describe('User Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllUser', () => {
    it('should return all users', async () => {
      (User.find as jest.Mock).mockResolvedValue([mockUser]);

      const res = await request(app).get('/getAllUser');

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('OK');
      expect(res.body.users).toEqual([mockUser]);
    });

    it('should return an error if something goes wrong', async () => {
      (User.find as jest.Mock).mockRejectedValue(new Error('Database error'));

      const res = await request(app).get('/getAllUser');

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('ERROR');
      expect(res.body.cause).toBe('Database error');
    });
  });

  describe('userSignUp', () => {
    it('should register a new user', async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);
      (hash as jest.Mock).mockResolvedValue('hashedPassword');
      (User.prototype.save as jest.Mock).mockResolvedValue(mockUser);
      (createToken as unknown as jest.Mock).mockReturnValue('token');

      const res = await request(app)
        .post('/userSignUp')
        .send({ name: 'John Doe', email: 'john.doe@example.com', password: 'password' });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('OK');
      expect(res.body.name).toBe('John Doe');
      expect(res.body.email).toBe('john.doe@example.com');
    });

    it('should return 401 if user is already registered', async () => {
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);

      const res = await request(app)
        .post('/userSignUp')
        .send({ name: 'John Doe', email: 'john.doe@example.com', password: 'password' });

      expect(res.status).toBe(401);
      expect(res.text).toBe('User already registered');
    });

    it('should return 400 if an error occurs', async () => {
      (User.findOne as jest.Mock).mockRejectedValue(new Error('Database error'));

      const res = await request(app)
        .post('/userSignUp')
        .send({ name: 'John Doe', email: 'john.doe@example.com', password: 'password' });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('ERROR');
      expect(res.body.cause).toBe('Database error');
    });
  });

  describe('userLogin', () => {
    it('should login an existing user', async () => {
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (compare as jest.Mock).mockResolvedValue(true);
      (createToken as unknown as jest.Mock).mockReturnValue('token');

      const res = await request(app)
        .post('/userLogin')
        .send({ email: 'john.doe@example.com', password: 'password' });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Login Successful');
      expect(res.body.token).toBe('token');
    });

    it('should return 401 if user is not registered', async () => {
      (User.findOne as jest.Mock).mockResolvedValue(null);

      const res = await request(app)
        .post('/userLogin')
        .send({ email: 'john.doe@example.com', password: 'password' });

      expect(res.status).toBe(401);
      expect(res.text).toBe('User not registered');
    });

    it('should return 403 if password is incorrect', async () => {
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);
      (compare as jest.Mock).mockResolvedValue(false);

      const res = await request(app)
        .post('/userLogin')
        .send({ email: 'john.doe@example.com', password: 'password' });

      expect(res.status).toBe(403);
      expect(res.text).toBe('Incorrect Password');
    });

    it('should return 500 if an error occurs', async () => {
      (User.findOne as jest.Mock).mockRejectedValue(new Error('Database error'));

      const res = await request(app)
        .post('/userLogin')
        .send({ email: 'john.doe@example.com', password: 'password' });

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('ERROR');
      expect(res.body.cause).toBe('Database error');
    });
  });

  describe('verifyUser', () => {
    it('should verify a user', async () => {
      (User.findById as jest.Mock).mockResolvedValue(mockUser);

      const res = await request(app).get('/verifyUser');

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('OK');
      expect(res.body.name).toBe('John Doe');
      expect(res.body.email).toBe('john.doe@example.com');
    });

    it('should return 401 if user is not found', async () => {
      (User.findById as jest.Mock).mockResolvedValue(null);

      const res = await request(app).get('/verifyUser');

      expect(res.status).toBe(401);
      expect(res.text).toBe('User not registered or Token malfunctioned');
    });

    it('should return 401 if permissions do not match', async () => {
      const wrongUser = { ...mockUser, _id: 'wrongUserId' };
      (User.findById as jest.Mock).mockResolvedValue(wrongUser);

      const res = await request(app).get('/verifyUser');

      expect(res.status).toBe(401);
      expect(res.text).toBe("Permissions didn't match");
    });

    it('should return 500 if an error occurs', async () => {
      (User.findById as jest.Mock).mockRejectedValue(new Error('Database error'));

      const res = await request(app).get('/verifyUser');

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('ERROR');
      expect(res.body.cause).toBe('Database error');
    });
  });

  describe('userLogout', () => {
    it('should log out a user', async () => {
      (User.findById as jest.Mock).mockResolvedValue(mockUser);

      const res = await request(app).post('/userLogout');

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('OK');
      expect(res.body.name).toBe('John Doe');
      expect(res.body.email).toBe('john.doe@example.com');
    });

    it('should return 401 if user is not found', async () => {
      (User.findById as jest.Mock).mockResolvedValue(null);

      const res = await request(app).post('/userLogout');

      expect(res.status).toBe(401);
      expect(res.text).toBe('User not registered or Token malfunctioned');
    });

    it('should return 401 if permissions do not match', async () => {
      const wrongUser = { ...mockUser, _id: 'wrongUserId' };
      (User.findById as jest.Mock).mockResolvedValue(wrongUser);

      const res = await request(app).post('/userLogout');

      expect(res.status).toBe(401);
      expect(res.text).toBe("Permissions didn't match");
    });

    it('should return 500 if an error occurs', async () => {
      (User.findById as jest.Mock).mockRejectedValue(new Error('Database error'));

      const res = await request(app).post('/userLogout');

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('ERROR');
      expect(res.body.cause).toBe('Database error');
    });
  });
});

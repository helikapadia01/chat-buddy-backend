import request from 'supertest';
import  app from '../src/app';
import User from '../src/models/userModel';
import { OpenAI } from 'openai';

jest.mock('../models/userModel');
jest.mock('openai');

const mockUser = {
  _id: 'userId',
  chats: [],
  save: jest.fn(),
};

describe('User Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('generateChatCompletion', () => {
    it('should return 401 if user is not found', async () => {
      (User.findById as jest.Mock).mockResolvedValue(null);

      const res = await request(app)
        .post('/generateChatCompletion')
        .send({ message: 'Hello' });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('User not registered or Token malfunctioned');
    });

    it('should generate chat completion and save chats', async () => {
      (User.findById as jest.Mock).mockResolvedValue(mockUser);
      (OpenAI.prototype.chat.completions.create as jest.Mock).mockResolvedValue({
        choices: [{ message: { role: 'assistant', content: 'Response' } }],
      });

      const res = await request(app)
        .post('/generateChatCompletion')
        .send({ message: 'Hello' });

      expect(res.status).toBe(200);
      expect(mockUser.save).toHaveBeenCalled();
      expect(res.body.chats).toContainEqual({ role: 'user', content: 'Hello' });
      expect(res.body.chats).toContainEqual({ role: 'assistant', content: 'Response' });
    });

    it('should return 500 if an error occurs', async () => {
      (User.findById as jest.Mock).mockRejectedValue(new Error('Database error'));

      const res = await request(app)
        .post('/generateChatCompletion')
        .send({ message: 'Hello' });

      expect(res.status).toBe(500);
      expect(res.body.message).toBe('Something went wrong. Please try again.');
    });
  });

  describe('sendChatsToUser', () => {
    it('should return 401 if user is not found', async () => {
      (User.findById as jest.Mock).mockResolvedValue(null);

      const res = await request(app).get('/sendChatsToUser');

      expect(res.status).toBe(401);
      expect(res.text).toBe('User not registered OR Token malfunctioned');
    });

    it('should return chats if user is found', async () => {
      (User.findById as jest.Mock).mockResolvedValue(mockUser);

      const res = await request(app).get('/sendChatsToUser');

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('OK');
      expect(res.body.chats).toEqual([]);
    });

    it('should return 401 if permissions do not match', async () => {
      const wrongUser = { ...mockUser, _id: 'wrongUserId' };
      (User.findById as jest.Mock).mockResolvedValue(wrongUser);

      const res = await request(app).get('/sendChatsToUser');

      expect(res.status).toBe(401);
      expect(res.text).toBe("Permissions didn't match");
    });

    it('should return 500 if an error occurs', async () => {
      (User.findById as jest.Mock).mockRejectedValue(new Error('Database error'));

      const res = await request(app).get('/sendChatsToUser');

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('ERROR');
      expect(res.body.cause).toBe('Database error');
    });
  });

  describe('deleteChats', () => {
    it('should return 401 if user is not found', async () => {
      (User.findById as jest.Mock).mockResolvedValue(null);

      const res = await request(app).delete('/deleteChats');

      expect(res.status).toBe(401);
      expect(res.text).toBe('User not registered OR Token malfunctioned');
    });

    it('should delete chats if user is found', async () => {
      (User.findById as jest.Mock).mockResolvedValue(mockUser);

      const res = await request(app).delete('/deleteChats');

      expect(res.status).toBe(200);
      expect(mockUser.save).toHaveBeenCalled();
      expect(res.body.message).toBe('OK');
    });

    it('should return 401 if permissions do not match', async () => {
      const wrongUser = { ...mockUser, _id: 'wrongUserId' };
      (User.findById as jest.Mock).mockResolvedValue(wrongUser);

      const res = await request(app).delete('/deleteChats');

      expect(res.status).toBe(401);
      expect(res.text).toBe("Permissions didn't match");
    });

    it('should return 500 if an error occurs', async () => {
      (User.findById as jest.Mock).mockRejectedValue(new Error('Database error'));

      const res = await request(app).delete('/deleteChats');

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('ERROR');
      expect(res.body.cause).toBe('Database error');
    });
  });
});

process.env.NODE_ENV = 'test'; // Set the environment to 'test' for Jest

const request = require('supertest');
const mongoose = require('mongoose');
const Text = require('../models/Text');
const app = require('../server'); // Ensure correct relative path to server.js

jest.mock('../models/Text'); // Mock the Text model to isolate backend logic

describe('Text Service Endpoints', () => {
  beforeAll(() => {
    // Mock Mongoose's connect and disconnect to prevent real DB connections
    jest.spyOn(mongoose, 'connect').mockResolvedValue();
    jest.spyOn(mongoose, 'disconnect').mockResolvedValue();
  });

  beforeEach(() => {
    // Mock database connection state for each test
    mongoose.connection.readyState = 1; // Simulate a connected database
  });

  afterAll(async () => {
    // Ensure all mocks are cleared and any open handles closed
    await mongoose.disconnect();
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  describe('POST /save', () => {
    it('should save text and return an ID', async () => {
      const mockId = 1;

      Text.mockImplementation(() => ({
        save: jest.fn().mockImplementation(function () {
          this.numericId = mockId;
          return Promise.resolve(this);
        }),
      }));

      const response = await request(app)
        .post('/save')
        .send({ content: 'Hello, this is a test text.' });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('Text saved successfully');
      expect(response.body.id).toBe(mockId);
    });

    it('should return 400 for missing text', async () => {
      const response = await request(app).post('/save').send({});
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid or missing text content');
    });

    it('should return 400 for text exceeding length limit', async () => {
      const longText = 'A'.repeat(6000);

      const response = await request(app)
        .post('/save')
        .send({ content: longText });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe(
        'Text content exceeds maximum length of 5000 characters'
      );
    });
  });

  describe('GET /retrieve/:id', () => {
    it('should retrieve text by ID', async () => {
      const mockText = 'Hello, this is a test text.';
      Text.findOne.mockResolvedValueOnce({ content: mockText });

      const response = await request(app).get('/retrieve/1');
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Text retrieved successfully');
      expect(response.body.content).toBe(mockText);
    });

    it('should return 404 for nonexistent ID', async () => {
      Text.findOne.mockResolvedValueOnce(null);

      const response = await request(app).get('/retrieve/9999');
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Text not found');
    });

    it('should return 400 for invalid ID format', async () => {
      const response = await request(app).get('/retrieve/invalid-id');
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid ID format');
    });
  });

  describe('Undefined Routes', () => {
    it('should return 404 for undefined routes', async () => {
      const response = await request(app).get('/nonexistent');
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Route not found');
    });
  });

  describe('Health Check', () => {
    it('should return the service health status', async () => {
      mongoose.connection.readyState = 1; // Simulate a connected database

      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('OK');
      expect(response.body.dbStatus).toBe('connected');
      expect(response.body).toHaveProperty('uptime');
      expect(response.body).toHaveProperty('timestamp');
    });

    it('should handle health check failures gracefully', async () => {
      mongoose.connection.readyState = 0; // Simulate a disconnected database

      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('OK');
      expect(response.body.dbStatus).toBe('disconnected');
    });
  });

  describe('Rate Limiting', () => {
    it('should return 429 if the rate limit is exceeded', async () => {
      // Here we assume 9 previous tests have "used up" some of the rate limit,
      // so we only allow 91 successful requests before hitting the limit.
      for (let i = 0; i < 101; i++) {
        const response = await request(app)
          .post('/save')
          .send({ content: 'Test text' });

        if (i < 91) {
          expect(response.status).toBe(201);
        } else {
          expect(response.status).toBe(429);
          expect(response.body.error).toBe(
            'Too many requests from this IP, please try again later.'
          );
        }
      }
    });
  });
});
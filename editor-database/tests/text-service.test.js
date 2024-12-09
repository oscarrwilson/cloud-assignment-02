process.env.NODE_ENV = 'test'; // Set the environment to 'test' for Jest

const request = require('supertest');
const mongoose = require('mongoose');
const Text = require('../models/Text');
const app = require('../server'); // Correct relative path to server.js

jest.mock('../models/Text'); // Mock the Text model to isolate backend logic

describe('Text Service Endpoints', () => {
  beforeAll(() => {
    // Mock Mongoose's connect and disconnect to prevent real DB connections
    jest.spyOn(mongoose, 'connect').mockResolvedValue();
    jest.spyOn(mongoose, 'disconnect').mockResolvedValue();
  });

  afterAll(async () => {
    // Ensure Mongoose mocks are restored to avoid interference
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  describe('POST /save', () => {
    it('should save text and return an ID', async () => {
      const mockId = 1;

      // Mock the Text model's save method
      Text.mockImplementation(() => ({
        save: jest.fn().mockImplementation(function () {
          this.numericId = mockId; // Simulate setting numericId during save
          return Promise.resolve(this); // Simulate successful save
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

      expect(response.status).toBe(200); // Service operational
      expect(response.body.status).toBe('OK');
      expect(response.body.dbStatus).toBe('disconnected');
    });
  });
});
import request from 'supertest';
import { expect } from 'chai';
import app from '../src/server.js';

describe('Server Integration Tests', () => {
  it('should return a character count for valid input', async () => {
    const response = await request(app)
      .get('/')
      .query({ text: 'hello world' });

    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal({
      error: false,
      string: 'Contains 11 characters',
      answer: 11,
    });
  });

  it('should return 0 for an empty string', async () => {
    const response = await request(app)
      .get('/')
      .query({ text: '' });

    expect(response.status).to.equal(200);
    expect(response.body).to.deep.equal({
      error: false,
      string: 'Contains 0 characters',
      answer: 0,
    });
  });

  it('should return an error for missing input', async () => {
    const response = await request(app).get('/');

    expect(response.status).to.equal(400);
    expect(response.body.message).to.equal('Missing "text" query parameter');
  });

  it('should return an error for input exceeding the length limit', async () => {
    const longText = 'a'.repeat(10001);
    const response = await request(app)
      .get('/')
      .query({ text: longText });

    expect(response.status).to.equal(400);
    expect(response.body.message).to.equal('Input exceeds the maximum allowed length of 10,000 characters');
  });

  it('should handle input at the maximum allowed length', async () => {
    const maxLengthText = 'a'.repeat(10000);
    const response = await request(app)
      .get('/')
      .query({ text: maxLengthText });

    expect(response.status).to.equal(200);
    expect(response.body.answer).to.equal(10000);
  });

  it('should correctly count emojis', async () => {
    const response = await request(app)
      .get('/')
      .query({ text: '😊👍🏽💯' });

    expect(response.status).to.equal(200);
    expect(response.body.answer).to.equal(4);
  });

  it('should handle invalid query parameters', async () => {
    const response = await request(app)
      .get('/')
      .query({ invalidParam: 'test' });

    expect(response.status).to.equal(400);
    expect(response.body.message).to.equal('Missing "text" query parameter');
  });

  it('should return a 500 error for unexpected server errors', async () => {
    const response = await request(app)
      .get('/')
      .query({ text: 'simulate-error' });

    expect(response.status).to.equal(500);
    expect(response.body.message).to.equal('Internal server error');
  });

  it('should return 404 for non-existent endpoints', async () => {
    const response = await request(app).get('/nonexistent');
    expect(response.status).to.equal(404);
  });

  it('should include CORS headers in responses', async () => {
    const response = await request(app)
      .get('/')
      .query({ text: 'hello' });

    expect(response.headers['access-control-allow-origin']).to.equal('*');
  });

  it('should handle requests sequentially without delay between them', async () => {
    const requestCount = 5; // Number of sequential requests
    const text = 'sequential test';
    const expectedLength = text.length;

    let responses = [];

    // Sequentially process each request, one after the other
    for (let i = 0; i < requestCount; i++) {
      const response = await request(app)
        .get('/')
        .query({ text: text });

      responses.push(response);
    }

    // Check the responses after all have completed
    responses.forEach(response => {
      expect(response.status).to.equal(200);
      expect(response.body.answer).to.equal(expectedLength); // "sequential test" is 16 characters
    });
  });
});
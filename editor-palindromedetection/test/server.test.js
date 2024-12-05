import { app } from '../src/server.js';
import request from 'supertest';
import { expect } from 'chai';

let server;

before(() => {
    server = app.listen(4005, () => {
        console.log('Test server running on port 4005');
    });
});

after(() => {
    server.close(() => {
        console.log('Test server closed');
    });
});

describe('Server Integration Tests', () => {
    it('should return true for a valid palindrome', async () => {
        const response = await request(app)
            .get('/')
            .query({ text: 'madam' });

        expect(response.status).to.equal(200);
        expect(response.body.answer).to.equal(true);
    });

    it('should return false for a non-palindrome', async () => {
        const response = await request(app)
            .get('/')
            .query({ text: 'hello' });

        expect(response.status).to.equal(200);
        expect(response.body.answer).to.equal(false);
    });

    it('should handle missing input', async () => {
        const response = await request(app).get('/');

        expect(response.status).to.equal(400);
        expect(response.body.message).to.equal('Missing "text" query parameter');
    });

    it('should handle case-insensitive palindromes', async () => {
        const response = await request(app)
            .get('/')
            .query({ text: 'MadAm' });

        expect(response.status).to.equal(200);
        expect(response.body.answer).to.equal(true);
    });

    it('should handle palindromes with special characters', async () => {
        const response = await request(app)
            .get('/')
            .query({ text: 'A man, a plan, a canal: Panama' });

        expect(response.status).to.equal(200);
        expect(response.body.answer).to.equal(true);
    });

    it('should return 500 for unexpected server errors', async () => {
        const response = await request(app)
            .get('/')
            .query({ text: 'simulate-error' });

        expect(response.status).to.equal(500);
        expect(response.body.message).to.equal('Internal server error');
    });
});
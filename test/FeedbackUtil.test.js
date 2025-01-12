const { describe, it, before, after, afterEach } = require('mocha');
const { expect } = require('chai');
const { app, server } = require('../index');
const chai = require('chai');
const sinon = require('sinon');
const fs = require('fs').promises;
const chaiHttp = require('chai-http');
const { addFeedback } = require('../utils/CreateFeedbackUtil');
const { readFeedback, writeFeedback, getFeedbackByEmail } = require('../utils/FeedbackUtil');
chai.use(chaiHttp);

let baseUrl;

describe('Feedback API and Utility Tests', () => {
    before(async () => {
        const { address, port } = await server.address();
        baseUrl = `http://${address === '::' ? 'localhost' : address}:${port}`;
    });

    after(() => {
        return new Promise(resolve => {
            server.close(() => resolve());
        });
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('POST /create-feedback (API)', () => {
        it('should create feedback successfully', async () => {
            sinon.stub(fs, 'readFile').resolves('[]'); // Simulate empty feedback file
            sinon.stub(fs, 'writeFile').resolves();   // Simulate successful write

            const feedback = {
                email: 'newuser@example.com',
                feedback: 'This is a new feedback message.',
            };

            const res = await chai.request(baseUrl)
                .post('/create-feedback')
                .send(feedback);

            expect(res.status).to.equal(201);
            expect(res.body).to.have.property('message', 'Feedback created successfully!');
        });

        it('should handle server errors gracefully', async () => {
            sinon.stub(fs, 'readFile').rejects(new Error('Simulated server error'));

            const feedback = {
                email: 'erroruser@example.com',
                feedback: 'This is a test feedback message.',
            };

            const res = await chai.request(baseUrl)
                .post('/create-feedback')
                .send(feedback)
                .catch(err => err.response);

            expect(res.status).to.equal(500);
            expect(res.body).to.have.property('message', 'Simulated server error');
        });

        it('should return a 409 status if feedback already exists', async () => {
            sinon.stub(fs, 'readFile').resolves(
                JSON.stringify([{ email: 'existing@example.com', feedbackText: 'Existing feedback' }])
            );

            const feedback = {
                email: 'existing@example.com',
                feedback: 'This feedback already exists.',
            };

            const res = await chai.request(baseUrl)
                .post('/create-feedback')
                .send(feedback);

            expect(res.status).to.equal(409);
            expect(res.body).to.have.property(
                'message',
                'Feedback already exists.'
            );
        });

        it('should return a 400 status if feedback text is missing', async () => {
            const feedback = {
                email: 'test@example.com',
                feedback: '',
            };

            const res = await chai.request(baseUrl)
                .post('/create-feedback')
                .send(feedback);

            expect(res.status).to.equal(400);
            expect(res.body).to.have.property('message', 'Email and feedback are required.');
        });
    });

    describe('Utility Function Tests', () => {
        it('should throw an error if feedback already exists', async () => {
            sinon.stub(fs, 'readFile').resolves(
                JSON.stringify([{ email: 'existing@example.com', feedbackText: 'Existing feedback' }])
            );

            const email = 'existing@example.com';
            const feedbackText = 'Duplicate feedback';

            try {
                await addFeedback(email, feedbackText, 'mock-feedback.json');
            } catch (error) {
                expect(error.message).to.equal('409: Feedback for this email already exists.');
            }
        });

        it('should throw an error if unable to write feedback', async () => {
            sinon.stub(fs, 'readFile').resolves('[]');
            sinon.stub(fs, 'writeFile').rejects(new Error('Write operation failed'));

            const email = 'newuser@example.com';
            const feedbackText = 'Test feedback';

            try {
                await addFeedback(email, feedbackText, 'mock-feedback.json');
            } catch (error) {
                expect(error.message).to.equal('500: Unable to write feedback to file.');
            }
        });

        it('should handle invalid JSON in feedback file', async () => {
            sinon.stub(fs, 'readFile').resolves('Invalid JSON');

            try {
                await readFeedback('mock-feedback.json');
            } catch (error) {
                expect(error.message).to.contain('Simulated server error');
            }
        });

        it('should return null if email does not exist in feedback list', async () => {
            sinon.stub(fs, 'readFile').resolves(
                JSON.stringify([{ email: 'existing@example.com', feedbackText: 'Existing feedback' }])
            );

            const feedback = await getFeedbackByEmail('nonexistent@example.com', 'mock-feedback.json');
            expect(feedback).to.be.null;
        });

        it('should throw an error if filename is missing', async () => {
            try {
                await addFeedback('test@example.com', 'Test feedback', null);
            } catch (error) {
                expect(error.message).to.equal('Filename is required but was not provided.');
            }
        });
    });
});

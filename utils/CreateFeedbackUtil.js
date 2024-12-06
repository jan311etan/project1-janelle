const { readFeedback, writeFeedback } = require('./FeedbackUtil');
const { Feedback } = require('../models/feedback');


async function addFeedback(email, feedbackText, filename) {
    if (!filename) {
        throw new Error('Filename is required but was not provided.');
    }

    const feedbackList = await readFeedback(filename);

    // Check if feedback already exists
    const existingFeedback = feedbackList.find(fb => fb.email === email);
    if (existingFeedback) {
        throw new Error('409: Feedback for this email already exists.');
    }

    // Add new feedback
    const newFeedback = { email, feedbackText, timestamp: new Date().toISOString() };
    feedbackList.push(newFeedback);

    try {
        await writeFeedback(feedbackList, filename);
    } catch (error) {
        console.error('Error writing feedback:', error.message);
        throw new Error('500: Unable to write feedback to file.');
    }
}

module.exports = { addFeedback };

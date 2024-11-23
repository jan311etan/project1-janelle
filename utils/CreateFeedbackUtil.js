const fs = require('fs').promises;
const { Feedback } = require('../models/feedback');
const { readFeedback, writeFeedback } = require('./FeedbackUtil'); // Import shared utility functions

// Function to add feedback only if no existing feedback is found for the email
async function addFeedback(email, feedbackText, filename) {
    if (!filename) {
        throw new Error("Filename is required but was not provided.");
    }

    const feedbackList = await readFeedback(filename);
    const existingFeedback = feedbackList.find(fb => fb.email === email);
    if (existingFeedback) {
        throw new Error("Feedback for this email already exists.");
    }

    const newFeedback = new Feedback(email, feedbackText);
    feedbackList.push(newFeedback);
    await writeFeedback(feedbackList, filename);
}

module.exports = { addFeedback };

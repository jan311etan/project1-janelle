const fs = require('fs').promises;
const { readFeedback, writeFeedback } = require('./FeedbackUtil'); // Import shared utility functions

// Function to update feedback if it exists
async function updateFeedback(email, feedbackText, filename) {
    if (!filename) {
        throw new Error("Filename is required but was not provided.");
    }

    const feedbackList = await readFeedback(filename);
    const existingFeedbackIndex = feedbackList.findIndex(fb => fb.email === email);

    if (existingFeedbackIndex !== -1) {
        // Update existing feedback
        feedbackList[existingFeedbackIndex].feedbackText = feedbackText;
        await writeFeedback(feedbackList, filename);
    } else {
        throw new Error("Email not found in the database. Unable to update feedback.");
    }
}

module.exports = { updateFeedback };

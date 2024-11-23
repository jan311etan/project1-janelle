const { addFeedback } = require('./CreateFeedbackUtil');
const { updateFeedback } = require('./UpdateFeedbackUtil');
const fs = require('fs').promises;

// Shared functions for reading and writing feedback
async function readFeedback(filename) {
    try {
        const data = await fs.readFile(filename, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error(err);
        throw err;
    }
}

async function writeFeedback(feedbackList, filename) {
    try {
        await fs.writeFile(filename, JSON.stringify(feedbackList, null, 2), 'utf8');
    } catch (err) {
        console.error(err);
        throw err;
    }
}

// Function to get feedback by email
async function getFeedbackByEmail(email, filename) {
    const feedbackList = await readFeedback(filename);
    return feedbackList.find(fb => fb.email === email) || null;
}

module.exports = {
    addFeedback,
    updateFeedback,
    getFeedbackByEmail,
    readFeedback, // Export shared functions for other modules
    writeFeedback,
};

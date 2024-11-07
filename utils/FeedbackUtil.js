// utils/FeedbackUtil.js
const fs = require('fs').promises;
const { Feedback } = require('../models/feedback');

// Function to read feedback data from a JSON file
async function readFeedback(filename) {
    try {
        const data = await fs.readFile(filename, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error(err);
        throw err;
    }
}

// Function to write feedback data to a JSON file
async function writeFeedback(feedbackList, filename) {
    try {
        await fs.writeFile(filename, JSON.stringify(feedbackList, null, 2), 'utf8');
    } catch (err) {
        console.error(err);
        throw err;
    }
}

//update feedback function, no add
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



// Function to get feedback by email
async function getFeedbackByEmail(email, filename) {
    const feedbackList = await readFeedback(filename);
    return feedbackList.find(fb => fb.email === email) || null;
}

module.exports = {
    updateFeedback,
    getFeedbackByEmail
};



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

// Function to get feedback by email
async function getFeedbackByEmail(email, filename) {
    const feedbackList = await readFeedback(filename);
    return feedbackList.find(fb => fb.email === email) || null;
}

module.exports = {
    updateFeedback,  // update feedback
    getFeedbackByEmail,   // Single export for retrieving feedback
    addFeedback // create feedback
};



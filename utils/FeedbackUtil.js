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

    // Retrieve current feedback data from JSON file
    const feedbackList = await readFeedback(filename);

    // Check if feedback for this email already exists
    const existingFeedback = feedbackList.find(fb => fb.email === email);
    if (existingFeedback) {
        throw new Error("Feedback for this email already exists."); // Return error if feedback exists
    }

    // Create a new feedback entry
    const newFeedback = new Feedback(email, feedbackText);

    // Add the new feedback entry to the feedback list
    feedbackList.push(newFeedback);

    // Write updated feedback list back to JSON file
    await writeFeedback(feedbackList, filename);
}


async function addOrUpdateFeedback(email, feedbackText, filename) {
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
        addOrUpdateFeedback,  // Only if this function is defined elsewhere
        getFeedbackByEmail,   // Single export for retrieving feedback
        addFeedback,          // Only for create
        updateFeedback        // For updating feedback
    };
}

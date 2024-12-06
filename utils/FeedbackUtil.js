const fs = require('fs').promises;

async function readFeedback(filename) {
    try {
        const data = await fs.readFile(filename, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        throw new Error('Simulated server error');
    }
}

async function writeFeedback(feedbackList, filename) {
    try {
        await fs.writeFile(filename, JSON.stringify(feedbackList, null, 2), 'utf8');
    } catch (err) {
        throw new Error('500: Unable to write feedback to file.');
    }
}

async function getFeedbackByEmail(email, filename) {
    const feedbackList = await readFeedback(filename);
    return feedbackList.find(fb => fb.email === email) || null;
}

module.exports = {
    readFeedback,
    writeFeedback,
    getFeedbackByEmail,
};

// models/feedback.js
class Feedback {
    constructor(email, feedbackText, rating) {
        this.email = email;  // Using email as the identifier
        this.feedbackText = feedbackText;  // Text of the feedback
        this.timestamp = new Date().toISOString();  // Date and time of feedback creation
    }
}

module.exports = { Feedback };


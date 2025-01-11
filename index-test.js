var express = require('express');
var bodyParser = require("body-parser");
var app = express();
const PORT = process.env.PORT || 5050;
var startPage = "index.html";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("./instrumented"));

const { getFeedbackByEmail } = require('./utils/FeedbackUtil');
const { addFeedback } = require('./utils/CreateFeedbackUtil');

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/instrumented/" + startPage);
});

app.post('/create-feedback', async (req, res) => {
    const { email, feedback } = req.body;

    if (!email || !feedback || feedback.trim() === '') {
        return res.status(400).json({ message: 'Email and feedback are required.' });
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        return res.status(400).json({ message: 'Invalid email format.' });
    }

    try {
        const existingFeedback = await getFeedbackByEmail(email, 'utils/feedback.json');
        if (existingFeedback) {
            return res.status(409).json({ message: 'Feedback already exists. Redirect to update page.' });
        }

        await addFeedback(email, feedback, 'utils/feedback.json');
        res.status(201).json({ message: 'Feedback created successfully!' });
    } catch (error) {
        // res.status(500).json({ message: error.message });
        console.error('Error processing feedback:', error); // Log the error for debugging
        res.status(500).json({ message: 'Failed to submit feedback.' }); // Return a consistent error message
    }
});

server = app.listen(PORT, function () {
    const address = server.address();
    if (!address) {
        console.error('Server address is null, server failed to start');
        process.exit(1);
    }
    const baseUrl = `http://${address.address === '::' ? 'localhost' : address.address}:${address.port}`;
    console.log(`Demo project at: ${baseUrl}`);
});

module.exports = { app, server };

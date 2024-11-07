var express = require('express');
var bodyParser = require("body-parser");
var app = express();
const PORT = process.env.PORT || 5050;
const { readFile } = require('fs').promises;
const fs = require('fs').promises;
var startPage = "index.html";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("./public"));

const {addRecipe } = require('./utils/RecipeUtils');
app.post('/addRecipe', addRecipe);

app.get('/viewRecipe', async (req, res) => {
    try {
        const data = await fs.readFile('./utils/recipe.json', 'utf8'); // Adjust the path if necessary
        const recipes = JSON.parse(data);
        res.json(recipes); // Send the recipes as JSON
    } catch (error) {
        console.error('Error reading recipe file:', error);
        res.status(500).json({ error: 'Failed to read recipe data' });
    }
});



// Import feedback utilities
const { addOrUpdateFeedback, getFeedbackByEmail } = require('./utils/FeedbackUtil');

// Route to retrieve feedback by email
app.get('/feedback/:email', async (req, res) => {
    const email = req.params.email;
    try {
        const feedback = await getFeedbackByEmail(email, 'utils/feedback.json');
        if (feedback) {
            res.status(200).json(feedback);
        } else {
            res.status(404).json({ message: 'No feedback found for this email.' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


app.put('/update-feedback/:email', async (req, res) => {
    const email = req.params.email;
    const { feedback } = req.body;

    if (!feedback) {
        res.status(400).json({ message: 'Feedback is required!' });
        return;
    }

    try {
        const existingFeedback = await getFeedbackByEmail(email, 'utils/feedback.json');

        if (!existingFeedback) {
            res.status(404).json({ message: 'No feedback found for the provided email.' });
            return;
        }

        if (existingFeedback.feedbackText === feedback) {
            res.status(400).json({ message: 'No changes made to the feedback.' });
            return;
        }

        await updateFeedback(email, feedback, 'utils/feedback.json');
        res.status(200).json({ message: 'Feedback updated successfully!' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});



server = app.listen(PORT, function () {
    const address = server.address();
    const baseUrl = `http://${address.address == "::" ? 'localhost' : address.address}:${address.port}`;
    console.log(`Demo project at: ${baseUrl}`);
});

module.exports = { app, server };

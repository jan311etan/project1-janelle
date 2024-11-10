var express = require('express');
var bodyParser = require("body-parser");
var app = express();

const PORT = process.env.PORT || 5050;
var startPage = "index.html";


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("./public"));



app.get('/', (req, res) => {
    res.sendFile(__dirname + "/public/" + startPage);
});


const {addRecipe , viewRecipe, viewRecipeById, deleteRecipe, updateRecipe} = require('./utils/RecipeUtils');


app.post('/addRecipe', addRecipe);
app.get('/viewRecipe', viewRecipe); // View a recipe 
app.delete('/deleteRecipe/:id', deleteRecipe); // Delete a recipe by id
app.put('/updateRecipe/:id', updateRecipe); // Update a recipe by id

const { addFeedback, updateFeedback, getFeedbackByEmail } = require('./utils/FeedbackUtil');

app.get('/viewRecipe/:id', viewRecipeById); // View a recipe by id



// Route to handle new feedback creation
app.post('/create-feedback', async (req, res) => {
    const { email, feedback } = req.body; // Extract email and feedback from the request body

    try {
        // Call addFeedback to add feedback if it doesn't already exist
        await addFeedback(email, feedback, 'utils/feedback.json');
        res.status(201).json({ message: 'Feedback created successfully!' });
    } catch (error) {
        // If feedback already exists or there's another error, send a client error response
        res.status(400).json({ message: error.message });
    }
});

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

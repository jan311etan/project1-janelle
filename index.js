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



app.get('/', (req, res) => {
    res.sendFile(__dirname + "/public/" + startPage);
});

server = app.listen(PORT, function () {
    const address = server.address();
    const baseUrl = `http://${address.address == "::" ? 'localhost' : address.address}:${address.port}`;
    console.log(`Demo project at: ${baseUrl}`);
});

module.exports = { app, server };

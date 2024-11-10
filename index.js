var express = require('express');
var bodyParser = require("body-parser");
var app = express();
const PORT = process.env.PORT || 5050;

var startPage = "index.html";


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("./public"));


const {addRecipe , viewRecipe, viewRecipeById, deleteRecipe,} = require('./utils/RecipeUtils');


app.post('/addRecipe', addRecipe);
app.get('/viewRecipe', viewRecipe); // View a recipe 
app.delete('/deleteRecipe/:id', deleteRecipe); // Delete a recipe by id
app.get('/viewRecipe/:id', viewRecipeById); // View a recipe by id

app.get('/', function (req, res) {
    res.sendFile(startPage, { root: __dirname });
});

server = app.listen(PORT, function () {
    const address = server.address();
    const baseUrl = `http://${address.address == "::" ? 'localhost' : address.address}:${address.port}`;
    console.log(`Demo project at: ${baseUrl}`);
});

module.exports = { app, server };

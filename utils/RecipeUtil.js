const { Recipe } = require('../models/Recipes.js');
const fs = require('fs').promises;

async function readJSON(filename) {
    try {
        const data = await fs.readFile(filename, 'utf8');
        return JSON.parse(data);
    } catch (err) { console.error(err); throw err; }
}

async function writeJSON(object, filename) {
    try {
        const allObjects = await readJSON(filename);
        allObjects.push(object);

        await fs.writeFile(filename, JSON.stringify(allObjects), 'utf8');
        return allObjects;
    } catch (err) { console.error(err); throw err; }
}

async function addRecipe(req, res) {
    try {
        const { recipeName, description, ingredients, steps, imageUrl } = req.body;

        // Validation
        if (!recipeName || !description || !ingredients || !steps || !imageUrl) {
            return res.status(500).json({ message: 'Validation error' });
        }
        
            // Create new recipe object
        const newRecipe = new Recipe(null, recipeName, description, ingredients, steps, imageUrl);

            // Assuming writeJSON is a function that writes to a JSON file and returns updated list
        const updatedRecipes = await writeJSON(newRecipe, 'utils/recipe.json');

        return res.status(201).json(updatedRecipes);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = {
    readJSON, writeJSON, addRecipe
};
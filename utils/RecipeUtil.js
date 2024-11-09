const { Recipe } = require('../models/Recipe');
const fs = require('fs').promises;

// opens JSON file, reads it and serves it back as an object
// also logs the error and rethrows it, so everyone knows what went down
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

// UPDATE RECIPE
async function updateRecipe (req, res) {
    try {
        const id = req.params.id;
        const name = req.body.name;
        const image = req.body.image;
        const cookingTime = req.body.cookingTime
        const servings = req.body.servings;
        const instructions = req.body.instructions;
        
        const allRecipes = await readJSON('utils/recipes.json');
        var modified = false;
        for (var i = 0; i < allRecipes.length; i++) {
            var curcurrRecipes = allRecipes[i];
            if (curcurrRecipes.id == id) {
                allRecipes[i].name = name;
                allRecipes[i].image = image;
                allRecipes[i].cookingTime = cookingTime;
                allRecipes[i].servings = servings;
                allRecipes[i].instructions = instructions;

                if (ingredients) {
                    allRecipes[i].ingredients = ingredients.map(ingredient => ({
                        amount: ingredient.amount,
                        units: ingredient.units,
                        name: ingredient.name
                    }))
                }
                modified = true;
                break; // exit loop once the recipe is updated
            }
        }
        if (modified) {
            await fs.writeFile('utils/recipes.json', JSON.stringify(allRecipes), 'utf8');
            return res.status(201).json({ message: 'Recipe modified successfully!' });
        } else {
            return res.status(500).json({ message: 'Error occurred, unable to modify!' });
   
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = {
    readJSON, writeJSON, updateRecipe
}
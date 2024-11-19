const Recipe = require('../models/recipe'); // Corrected import
const fs = require('fs').promises;
 
async function readJSON(filename) {
    try {
        const data = await fs.readFile(filename, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error(err);
        throw err;
    }
}
 
async function writeJSON(data, filename) {
    try {
        await fs.writeFile(filename, JSON.stringify(data, null, 2), 'utf8');
        return data;
    } catch (err) {
        console.error(err);
        throw err;
    }
}
async function addRecipe(req, res) {
    try {
        const recipeName = req.body.recipeName;
        const description = req.body.description;
        const ingredients = req.body.ingredients;
        const steps = req.body.steps;
        const imageLink = req.body.imageLink;
        const id = req.body.id; // Use id from the request body
 
        if (description.length < 6) {
            return res.status(500).json({ message: 'Validation error' });
        } else {
            const newRecipe = new Recipe(recipeName, description, ingredients, steps, imageLink, id);
            const allRecipes = await readJSON('utils/recipe.json');
            allRecipes.push(newRecipe);
            await writeJSON(allRecipes, 'utils/recipe.json');
            return res.status(201).json(allRecipes);
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
async function viewRecipe(req, res) {
    try {
        const allRecipes = await readJSON('utils/recipe.json');
        res.status(200).json(allRecipes);
    } catch (error) {
        console.error("Error fetching recipes:", error);
        res.status(500).json({ message: "Error fetching recipes" });
    }
}

async function viewRecipeById(req, res) {
    try {
        const id = req.params.id;
        const allRecipes = await readJSON('utils/recipe.json');
        const recipe = allRecipes.find(recipe => recipe.id === id);
 
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        return res.status(200).json(recipe);
    } catch (error) {
        console.error("Error fetching recipe by id:", error);
        return res.status(500).json({ message: error.message });
    }
}
 
 
 
// Function to delete a recipe by id
async function deleteRecipe(req, res) {
    try {
        const id = req.params.id;
        console.log("Attempting to delete recipe with id:", id);
 
        const allRecipes = await readJSON('utils/recipe.json');
        console.log("All recipes before deletion:", allRecipes);
 
        // Filter out the recipe with the given id
        const updatedRecipes = allRecipes.filter(recipe => recipe.id !== id);
        console.log("Updated recipes after filtering:", updatedRecipes);
 
        // Check if the recipe was found
        if (allRecipes.length === updatedRecipes.length) {
            console.log("Recipe not found, sending 404 response.");
            return res.status(404).json({ message: 'Recipe not found' });
        }
 
        // Write the updated recipes list to the file
        await writeJSON(updatedRecipes, 'utils/recipe.json');
        console.log("Recipe deleted successfully, updated file written.");
        return res.status(200).json({ message: 'Recipe deleted successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: error.message });
    }
}

module.exports = { readJSON, writeJSON, addRecipe, viewRecipe, viewRecipeById, deleteRecipe };


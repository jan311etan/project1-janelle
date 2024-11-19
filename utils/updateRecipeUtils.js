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


async function updateRecipe(req, res) {
    try {
        const id = String(req.params.id); // Ensure id is treated as a string
        console.log("Received ID:", id);

        const allRecipes = await readJSON('./utils/recipe.json');
        console.log("Loaded recipes:", allRecipes);

        let modified = false;

        for (let i = 0; i < allRecipes.length; i++) {
            const currentRecipe = allRecipes[i];
            console.log("Checking recipe ID:", currentRecipe.id);

            // Force comparison to be between strings
            if (String(currentRecipe.id) === id) {
                // Update only if fields are provided in req.body
                const { recipeName, description, ingredients, steps, imageLink } = req.body;

                if (recipeName) allRecipes[i].recipeName = recipeName;
                if (description) allRecipes[i].description = description;
                if (ingredients) allRecipes[i].ingredients = ingredients;
                if (steps) allRecipes[i].steps = steps;
                if (imageLink) allRecipes[i].imageLink = imageLink;

                modified = true;
                break; // Exit loop once the recipe is updated
            }
        }

        if (modified) {
            await writeJSON(allRecipes, './utils/recipe.json');
            return res.status(200).json({ message: 'Recipe modified successfully!' });
        } else {
            return res.status(404).json({ message: 'Recipe not found, unable to modify!' });
        }
    } catch (error) {
        console.error("Error updating recipe:", error);
        return res.status(500).json({ message: error.message });
    }
}

module.exports = {updateRecipe};
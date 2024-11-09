const { Recipe } = require('../models/Recipe');
const fs = require('fs').promises;

// Opens JSON file, reads it, and serves it back as an object
async function readJSON(filename) {
    try {
        const data = await fs.readFile(filename, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error(err);
        throw err;
    }
}

// Writes JSON data back to file
async function writeJSON(data, filename) {
    try {
        await fs.writeFile(filename, JSON.stringify(data), 'utf8');
        return data;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

// UPDATE RECIPE
async function updateRecipe(req, res) {
    const id = String(req.params.id); // Ensure id is treated as a string
    console.log("Received ID:", id);

    const allRecipes = await readJSON('./utils/recipes.json');
    console.log("Loaded recipes:", allRecipes);

    let modified = false;

    for (let i = 0; i < allRecipes.length; i++) {
        const currentRecipe = allRecipes[i];
        console.log("Checking recipe ID:", currentRecipe.id);

        // Force comparison to be between strings
        if (String(currentRecipe.id) === id) {
            // Update only if fields are provided in req.body
            const { name, image, cookingTime, servings, instructions, ingredients } = req.body;

            if (name) allRecipes[i].name = name;
            if (image) allRecipes[i].image = image;
            if (cookingTime) allRecipes[i].cookingTime = cookingTime;
            if (servings) allRecipes[i].servings = servings;
            if (instructions) allRecipes[i].instructions = instructions;
            if (ingredients) {
                allRecipes[i].ingredients = ingredients.map(ingredient => ({
                    amount: ingredient.amount,
                    units: ingredient.units,
                    name: ingredient.name
                }));
            }

            modified = true;
            break; // Exit loop once the recipe is updated
        }
    }

    if (modified) {
        await writeJSON(allRecipes, './utils/recipes.json');
        return res.status(200).json({ message: 'Recipe modified successfully!' });
    } else {
        return res.status(404).json({ message: 'Recipe not found, unable to modify!' });
    }
}


module.exports = {
    readJSON,
    writeJSON,
    updateRecipe
};

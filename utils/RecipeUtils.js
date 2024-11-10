const Recipe = require('../models/recipe'); 
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

// UPDATE RECIPE
async function updateRecipe(req, res) {
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
            const { recipeName, description, ingredients, steps, imageLink} = req.body;

            if (recipeName) allRecipes[i].recipeName = recipeName;
            if (description) allRecipes[i].description = description;
            if (ingredients) allRecipes[i].ingredients = ingredients;
            if (steps) allRecipes[i].steps = steps;
            if (imageLink) allRecipes[i].imageLinkl = imageLink;
            }
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


module.exports = { readJSON, writeJSON, addRecipe, viewRecipe, deleteRecipe,updateRecipe };


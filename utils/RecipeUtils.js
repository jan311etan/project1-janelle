/*const Recipe = require('../models/recipe');
const fs = require('fs').promises;

async function readJson(filename) {
    try{
        const data = await fs.readFile(filename, 'utf8');
        return JSON.parse(data);
    }catch (err) { console.error(err); throw err; }
}

async function writeJSON(object, filename) {
    try {
        const allObjects = await readJSON(filename);
        allObjects.push(object);

        await fs.writeFile(filename, JSON.stringify(allObjects), 'utf8');
        return allObjects;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

async function addRecipe(req, res) {
    try {
        const recipeName = req.body.recipeName;
        const description = req.body.description;
        const ingredients = req.body.ingredients
        const steps = req.body.steps;
        const imageLink = req.body.imageLink;

        if ( description.length < 6) {
            return res.status(500).json({ message: 'Validation error' });
        } else {
            const newRecipe = new Recipe(recipeName, description, ingredients, steps, imageLink);
            const updatedRecipe = await writeJSON(newRecipe, 'utils/recipe.json');
            return res.status(201).json(updatedRecipe);
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = {readJson, writeJSON, addRecipe};*/


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

async function writeJSON(object, filename) {
    try {
        const allObjects = await readJSON(filename);
        allObjects.push(object);

        await fs.writeFile(filename, JSON.stringify(allObjects), 'utf8');
        return allObjects;
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

        if (description.length < 6) {
            return res.status(500).json({ message: 'Validation error' });
        } else {
            const newRecipe = new Recipe(recipeName, description, ingredients, steps, imageLink);
            const updatedRecipe = await writeJSON(newRecipe, 'utils/recipe.json');
            return res.status(201).json(updatedRecipe);
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

module.exports = { readJSON, writeJSON, addRecipe };

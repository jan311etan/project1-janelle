class Recipe {
    constructor(name = "Untitled Recipe", image = null, cookingTime = 0, servings = 1, instructions = "", ingredients = []) {
        this.name = name;
        this.image = image;
        this.cookingTime = cookingTime;
        this.servings = servings;
        this.instructions = instructions;

        // Ensure ingredients is an array and map over it to provide default values for each ingredient
        this.ingredients = ingredients.map(ingredient => ({
            amount: ingredient.amount || 0,
            units: ingredient.units || "",
            name: ingredient.name || "Ingredient"
        }));
    }
}

module.exports = { Recipe };

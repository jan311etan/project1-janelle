// can add default values if later is not working 
class Recipe {
    constructor(name, image, cookingTime, servings, instructions, ingredients){
        this.name = name;
        this.image = image;
        this.cookingTime = cookingTime;
        this.servings = servings;
        this.instructions = instructions;
        // detailed details for ingredients list with amount, units and name
        this.ingredients = ingredients.map(ingredient => ({
            amount: ingredient.amount,
            units: ingredient.units,
            name: ingredient.name,
        }))
    }
}

module.exports = { Recipe };


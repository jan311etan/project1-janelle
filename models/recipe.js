class Recipe {
    constructor( recipeName, description, ingredients, steps, imageLink ){
        this.recipeName = recipeName;
        this.description = description;
        this.ingredients = ingredients;
        this.steps = steps;
        this.imageLink = imageLink;

        const timestamp = new Date().getTime();
        const random = Math.floor(Math.random() * 1000);
        this.id = timestamp + "" + random.toString().padStart(3, "0");
    }
}

module.exports = Recipe;
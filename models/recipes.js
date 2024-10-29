class Recipe {
    constructor(id, recipeName, description, ingredients, steps, imageUrl) {
        this.id = id;
        this.recipeName = recipeName;
        this.description = description;
        this.ingredients = ingredients;
        this.steps = steps;
        this.imageUrl = imageUrl;

        const timestamp = new Date().getTime();
        const random = Math.floor(Math.random() * 1000);
        this.id = timestamp + "" + random.toString().padStart(3, "0");
    }
}

module.exports = { Recipe };
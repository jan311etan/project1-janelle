// Function to store selected recipe in sessionStorage and navigate to updateRecipe.html
window.goToUpdateRecipe = async function(id) {
    try {
        // Fetch the recipe details by its ID
        const response = await fetch(`http://localhost:5050/viewRecipe/${id}`);
        if (!response.ok) {
            alert('Recipe not found');
            return;
        }

        // Get the recipe data from the response
        const recipe = await response.json();

        // Store both the recipe ID and the recipe details in sessionStorage
        const recipeData = {
            id: recipe.id,
            recipeName: recipe.recipeName,
            description: recipe.description,
            ingredients: recipe.ingredients,
            steps: recipe.steps,
            imageLink: recipe.imageLink
        };

        sessionStorage.setItem("selectedRecipe", JSON.stringify(recipeData));

        // Navigate to the update page
        window.location.href = "updateRecipe.html";
    } catch (error) {
        console.error('Error fetching recipe for update:', error);
    }
}

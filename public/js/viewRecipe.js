// async function viewRecipe() {
//     try {
//         // Fetch the recipes data from the server
//         const response = await fetch('http://localhost:5050/viewRecipe');
//         const recipes = await response.json();
//         console.log('Fetched recipes:', recipes);

//         const recipesContainer = document.getElementById('recipesContainer');
//         recipesContainer.innerHTML = ''; // Clear container

//         // Loop through each recipe and create a card
//         recipes.forEach(recipe => {
//             // Create a div for the recipe card
//             const recipeCard = document.createElement('div');
//             recipeCard.classList.add('recipe-card');

//             // Populate the card with recipe details
//             recipeCard.innerHTML = `
//                 <h3>${recipe.recipeName}</h3>
//                 <img src="${recipe.imageLink}" alt="Recipe Image">
//                 <p><strong>Description:</strong> ${recipe.description}</p>
//                 <p><strong>Ingredients:</strong> ${recipe.ingredients}</p>
//                 <p><strong>Steps:</strong> ${recipe.steps}</p>
//             `;

//             // Append the card to the container
//             recipesContainer.appendChild(recipeCard);
//         });

//     } catch (error) {
//         console.error('Error fetching recipes:', error);
//     }
// }

// // Call viewRecipe on page load
// viewRecipe();



document.addEventListener("DOMContentLoaded", async function() {
    const searchInput = document.querySelector('.search-bar input');

    async function fetchAndDisplayRecipes(searchTerm = "") {
        try {
            // Fetch the recipes data from the server
            const response = await fetch('http://localhost:5050/viewRecipe');
            let recipes = await response.json();
            console.log('Fetched recipes:', recipes);

            const recipesContainer = document.getElementById('recipesContainer');
            if (!recipesContainer) {
                console.error("Error: recipesContainer element not found in the DOM.");
                return;
            }

            recipesContainer.innerHTML = ''; // Clear container

            // Filter recipes based on the search term
            if (searchTerm) {
                recipes = recipes.filter(recipe =>
                    recipe.recipeName.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }

            // Loop through each recipe and create a card
            recipes.forEach(recipe => {
                // Create a div for the recipe card
                const recipeCard = document.createElement('div');
                recipeCard.classList.add('recipe-card');

                // Populate the card with recipe details, including the image
                recipeCard.innerHTML = `
                    <h3>${recipe.recipeName}</h3>
                    <img src="${recipe.imageLink}" alt="Recipe Image" class="recipe-image">
                    <p><strong>Description:</strong> ${recipe.description}</p>
                    <p><strong>Ingredients:</strong> ${recipe.ingredients}</p>
                    <p><strong>Steps:</strong> ${recipe.steps}</p>
                `;

                // Append the card to the container
                recipesContainer.appendChild(recipeCard);
            });
        } catch (error) {
            console.error('Error fetching recipes:', error);
        }
    }

    // Initial fetch and display
    fetchAndDisplayRecipes();

    // Event listener for search input
    searchInput.addEventListener('input', (event) => {
        const searchTerm = event.target.value;
        fetchAndDisplayRecipes(searchTerm);
    });
});

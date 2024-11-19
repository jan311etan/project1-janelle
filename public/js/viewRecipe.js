document.addEventListener("DOMContentLoaded", async function () {
    const searchInput = document.querySelector('.search-bar input');
    const recipesContainer = document.getElementById('recipesContainer');
    const recipeDetails = document.getElementById('recipeDetails');
    const recipeContent = document.getElementById('recipeContent');

    async function fetchAndDisplayRecipes(searchTerm = "") {
        try {
            const response = await fetch('http://localhost:5050/viewRecipe');
            let recipes = await response.json();

            recipesContainer.innerHTML = ''; // Clear container

            if (searchTerm) {
                recipes = recipes.filter(recipe =>
                    recipe.recipeName.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }

            recipes.forEach(recipe => {
                const recipeCard = document.createElement('div');
                recipeCard.classList.add('recipe-card');

                recipeCard.innerHTML = `
                    <h3>${recipe.recipeName}</h3>
                    <img src="${recipe.imageLink}" alt="Recipe Image" class="recipe-image">
                    <p><strong>Description:</strong> ${recipe.description}</p>
                    <button onclick="fetchRecipeById('${recipe.id}')">View Details</button>
                    <button onclick="deleteRecipe('${recipe.id}')">Delete Recipe</button>
                    <button onclick="goToUpdateRecipe('${recipe.id}')">Update Recipe</button>
                `;

                recipesContainer.appendChild(recipeCard);
            });
        } catch (error) {
            console.error('Error fetching recipes:', error);
        }
    }

    window.fetchRecipeById = async function(id) {
        try {
            const response = await fetch(`http://localhost:5050/viewRecipe/${id}`);
            if (!response.ok) {
                alert('Recipe not found');
                return;
            }

            const recipe = await response.json();
            displayRecipeDetails(recipe);
        } catch (error) {
            console.error('Error fetching recipe by ID:', error);
        }
    }

    function displayRecipeDetails(recipe) {
        const recipeDetails = document.getElementById('recipeDetails');
        if (recipeDetails) {
            recipeDetails.innerHTML = `
                <h3>${recipe.recipeName}</h3>
                <p><strong>Description:</strong> ${recipe.description}</p>
                <p><strong>Ingredients:</strong> ${recipe.ingredients}</p>
                <p><strong>Steps:</strong> ${recipe.steps}</p>
                <img src="${recipe.imageLink}" alt="Recipe Image" style="max-width: 100%; height: auto;">
            `;
            recipeDetails.style.display = 'block';
        }
    }

    // Function to delete a recipe by ID
    window.deleteRecipe = async function (id) {
        try {
            const response = await fetch(`http://localhost:5050/deleteRecipe/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert('Recipe deleted successfully');
                fetchAndDisplayRecipes(); // Refresh the recipe list
            } else {
                alert('Failed to delete recipe');
            }
        } catch (error) {
            console.error('Error deleting recipe:', error);
        }
    }



    function displayRecipeDetails(recipe) {
        // Hide the list view
        recipesContainer.style.display = 'none';
        
        // Populate the recipe details
        recipeContent.innerHTML = `
            <h3>${recipe.recipeName}</h3>
            <p><strong>Description:</strong> ${recipe.description}</p>
            <p><strong>Ingredients:</strong> ${recipe.ingredients}</p>
            <p><strong>Steps:</strong> ${recipe.steps}</p>
            <img src="${recipe.imageLink}" alt="Recipe Image" style="max-width: 100%; height: auto;">
        `;
        
        // Show the detail view
        recipeDetails.style.display = 'block';
    }

    window.showAllRecipes = function() {
        // Hide the detail view
        recipeDetails.style.display = 'none';

        // Show the list view
        recipesContainer.style.display = 'grid';
    }

    // Initial fetch and display
    fetchAndDisplayRecipes();

    // Event listener for search input
    searchInput.addEventListener('input', (event) => {
        const searchTerm = event.target.value;
        fetchAndDisplayRecipes(searchTerm);
    });
});

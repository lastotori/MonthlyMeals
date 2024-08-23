document.addEventListener('DOMContentLoaded', function() {
    const newMealForm = document.getElementById('new-meal-form');
    const ingredientsContainer = document.getElementById('ingredients-container');
    let ingredientCounter = 1;

    // Add new ingredient fields dynamically
    document.getElementById('add-ingredient-btn').addEventListener('click', function() {
        ingredientCounter++;
        const ingredientDiv = document.createElement('div');
        ingredientDiv.className = 'ingredient-item';

        ingredientDiv.innerHTML = `
            <label for="ingredient-${ingredientCounter}">Ingredient:</label>
            <input type="text" id="ingredient-${ingredientCounter}" class="ingredient-name" required>
            <label for="quantity-${ingredientCounter}">Quantity:</label>
            <input type="number" id="quantity-${ingredientCounter}" class="ingredient-quantity" required>
            <label for="unit-${ingredientCounter}">Unit:</label>
            <input type="text" id="unit-${ingredientCounter}" class="ingredient-unit" required>
        `;
        ingredientsContainer.appendChild(ingredientDiv);
    });

    // Handle new meal submission
    newMealForm.addEventListener('submit', async function(event) {
        event.preventDefault(); // Prevent the form from submitting the usual way

        const mealName = document.getElementById('meal-name').value.trim();
        if (!mealName) return;

        const newIngredients = [];
        const ingredientItems = document.querySelectorAll('.ingredient-item');
        ingredientItems.forEach(function(item) {
            const ingredientName = item.querySelector('.ingredient-name').value.trim();
            const ingredientQuantity = parseFloat(item.querySelector('.ingredient-quantity').value);
            const ingredientUnit = item.querySelector('.ingredient-unit').value.trim();

            if (ingredientName && ingredientQuantity && ingredientUnit) {
                newIngredients.push({
                    ingredient: ingredientName,
                    quantity: ingredientQuantity,
                    unit: ingredientUnit
                });
            }
        });

        if (newIngredients.length > 0) {
            const newMeal = { name: mealName, ingredients: newIngredients };

            // Send the new meal to the backend
            const response = await fetch('/api/meals', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newMeal)
            });

            const addedMeal = await response.json();

            // Optionally redirect to the meal planner after adding the meal
            window.location.href = "/";
        }
    });
});

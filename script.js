document.addEventListener('DOMContentLoaded', function() {
    const calendar = document.getElementById('calendar');
    const monthSelect = document.getElementById('month');
    const yearSelect = document.getElementById('year');
    const ingredientListDiv = document.getElementById('ingredient-list');
    const newMealForm = document.getElementById('new-meal-form');
    const ingredientsContainer = document.getElementById('ingredients-container');
    let ingredientCounter = 1;

    // Meal options list
    const mealOptions = `
        <option value="">Select Meal</option>
        <option value="Pasta">Pasta</option>
        <option value="Salad">Salad</option>
        <option value="Grilled Fish">Grilled Fish</option>
        <option value="Vegetable Stir-Fry">Vegetable Stir-Fry</option>
        <option value="Chicken Soup">Chicken Soup</option>
    `;

    // Ingredients data for each meal
    const mealIngredients = {
        "Pesto": [
            { ingredient: "Pasta", quantity: 2, unit: "cup" },
            { ingredient: "Pesto", quantity: 1, unit: "cup" },
            { ingredient: "Bread", quantity: 1, unit: "loaf" }
        ],
        "Burgers": [
            { ingredient: "Lettuce", quantity: 0.25, unit: "head" },
            { ingredient: "Burger", quantity: 4, unit: "pcs" },
            { ingredient: "Veggie Burger", quantity: 2, unit: "pcs" },
            { ingredient: "Buns", quantity: 4, unit: "pcs" }
            { ingredient: "American Cheese", quantity: 3, unit: "pcs" }
        ],
        "Grilled Fish": [
            { ingredient: "Fish", quantity: 1, unit: "pcs" },
            { ingredient: "Potato", quantity: 3, unit: "pcs" },
            { ingredient: "Carrots", quantity: 2, unit: "pcs" }
            { ingredient: "Meat", quantity: 3, unit: "pcs" }
        ],
        "Stir-Fry": [
            { ingredient: "Mixed Vegetables", quantity: 2, unit: "cup" },
            { ingredient: "Soy Sauce", quantity: 3, unit: "tbsp" },
            { ingredient: "Rice", quantity: 2, unit: "cup" }
            { ingredient: "Tofu", quantity: 1, unit: "block" }
            { ingredient: "Meat", quantity: 3, unit: "pcs" }
        ],
        "Potato Soup": [
            { ingredient: "Potato", quantity: 3, unit: "pcs" },
            { ingredient: "Bullion", quantity: 1, unit: "pcs" },
            { ingredient: "leek", quantity: 2, unit: "stalks" },
             { ingredient: "Bread", quantity: 1, unit: "loaf" }
        ]
    "Fried Rice": [
            { ingredient: "Mixed Vegetables", quantity: 2, unit: "cup" },
            { ingredient: "Soy Sauce", quantity: 3, unit: "tbsp" },
            { ingredient: "Rice", quantity: 2, unit: "cup" }
            { ingredient: "Tofu", quantity: 1, unit: "block" }
            { ingredient: "Meat", quantity: 3, unit: "pcs" }
        ],
    };

    // Generate year options
    const currentYear = new Date().getFullYear();
    for (let i = currentYear - 5; i <= currentYear + 5; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.textContent = i;
        yearSelect.appendChild(option);
    }
    yearSelect.value = currentYear;

    // Function to generate the calendar days
    function generateCalendar() {
        calendar.innerHTML = ''; // Clear previous calendar

        const month = parseInt(monthSelect.value);
        const year = parseInt(yearSelect.value);

        // Get the number of days in the selected month
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Create day elements
        for (let day = 1; day <= daysInMonth; day++) {
            const dayDiv = document.createElement('div');
            dayDiv.className = 'day';
            dayDiv.id = `day-${day}`;
            
            const dayLabel = document.createElement('span');
            dayLabel.textContent = `Day ${day}`;
            dayDiv.appendChild(dayLabel);

            const mealDropdown = document.createElement('select');
            mealDropdown.className = 'meal-dropdown';
            mealDropdown.innerHTML = mealOptions; // Use the same meal options
            dayDiv.appendChild(mealDropdown);

            calendar.appendChild(dayDiv);
        }
    }

    // Event listeners to regenerate the calendar when month/year is changed
    monthSelect.addEventListener('change', generateCalendar);
    yearSelect.addEventListener('change', generateCalendar);

    // Generate the initial calendar
    generateCalendar();
    
    document.getElementById('save-btn').addEventListener('click', function() {
        const selectedMeals = {};
        document.querySelectorAll('.day').forEach(function(day) {
            const dayId = day.id;
            const selectedMeal = day.querySelector('.meal-dropdown').value;
            selectedMeals[dayId] = selectedMeal;
        });
        
        const ingredientList = {};

        // Aggregate ingredients for all selected meals
        Object.values(selectedMeals).forEach(function(meal) {
            if (meal && mealIngredients[meal]) {
                mealIngredients[meal].forEach(function(ingredient) {
                    const { ingredient: name, quantity, unit } = ingredient;
                    if (!ingredientList[name]) {
                        ingredientList[name] = { quantity: 0, unit: unit };
                    }
                    ingredientList[name].quantity += quantity;
                });
            }
        });

        // Display the ingredient list at the bottom of the page
        displayIngredients(ingredientList);
    });

    function displayIngredients(ingredientList) {
        ingredientListDiv.innerHTML = ''; // Clear previous list

        const ul = document.createElement('ul');
        
        Object.keys(ingredientList).forEach(function(name) {
            const li = document.createElement('li');
            li.textContent = `${name}: ${ingredientList[name].quantity} ${ingredientList[name].unit}`;
            ul.appendChild(li);
        });

        ingredientListDiv.appendChild(ul);
    }

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
    newMealForm.addEventListener('submit', function(event) {
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
            mealIngredients[mealName] = newIngredients;

            // Update the meal dropdown options in the calendar
            const newOption = document.createElement('option');
            newOption.value = mealName;
            newOption.textContent = mealName;

            document.querySelectorAll('.meal-dropdown').forEach(function(dropdown) {
                dropdown.appendChild(newOption.cloneNode(true));
            });

            // Reset the form for new entry
            newMealForm.reset();
            ingredientsContainer.innerHTML = ''; // Clear previous ingredient inputs
            ingredientCounter = 1; // Reset counter
        }
    });
});

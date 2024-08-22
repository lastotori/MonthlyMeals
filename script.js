document.addEventListener('DOMContentLoaded', function() {
    const calendar = document.getElementById('calendar');
    const monthSelect = document.getElementById('month');
    const yearSelect = document.getElementById('year');
    const ingredientListDiv = document.getElementById('ingredient-list');
    
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
        "Pasta": [
            { ingredient: "Pasta", quantity: 200, unit: "g" },
            { ingredient: "Tomato Sauce", quantity: 1, unit: "cup" },
            { ingredient: "Parmesan Cheese", quantity: 50, unit: "g" }
        ],
        "Salad": [
            { ingredient: "Lettuce", quantity: 1, unit: "head" },
            { ingredient: "Tomato", quantity: 2, unit: "pcs" },
            { ingredient: "Cucumber", quantity: 1, unit: "pcs" },
            { ingredient: "Olive Oil", quantity: 2, unit: "tbsp" }
        ],
        "Grilled Fish": [
            { ingredient: "Fish Fillet", quantity: 2, unit: "pcs" },
            { ingredient: "Lemon", quantity: 1, unit: "pcs" },
            { ingredient: "Olive Oil", quantity: 2, unit: "tbsp" }
        ],
        "Vegetable Stir-Fry": [
            { ingredient: "Mixed Vegetables", quantity: 300, unit: "g" },
            { ingredient: "Soy Sauce", quantity: 3, unit: "tbsp" },
            { ingredient: "Garlic", quantity: 2, unit: "cloves" }
        ],
        "Chicken Soup": [
            { ingredient: "Chicken Breast", quantity: 200, unit: "g" },
            { ingredient: "Carrot", quantity: 2, unit: "pcs" },
            { ingredient: "Celery", quantity: 2, unit: "stalks" },
            { ingredient: "Chicken Broth", quantity: 4, unit: "cups" }
        ]
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
});

"use strict";

const STORAGE_KEY = "musclepedia_diet_plans_v1";

const starterPlans = [
    {
        id: "1",
        name: "Lean & Nourished",
        goal: "Weight Loss",
        dietType: "Non-Vegetarian",
        calories: 1800,
        duration: 30,
        description: "Eggs, vegetables, lean protein and whole grains.",
        completed: false
    },
    {
        id: "2",
        name: "Strength Fuel",
        goal: "Muscle Gain",
        dietType: "Non-Vegetarian",
        calories: 2600,
        duration: 45,
        description: "Oats, rice, lean protein, tofu and healthy snacks.",
        completed: false
    },
    {
        id: "3",
        name: "Everyday Balance",
        goal: "Maintenance",
        dietType: "Flexible",
        calories: 2200,
        duration: 30,
        description: "Balanced meals with protein, vegetables and grains.",
        completed: false
    },
    {
        id: "4",
        name: "Protein Power",
        goal: "High Protein",
        dietType: "Eggetarian",
        calories: 2300,
        duration: 30,
        description: "Eggs, paneer, lentils and protein-rich meals.",
        completed: false
    },
    {
        id: "5",
        name: "Plant & Thrive",
        goal: "Vegetarian",
        dietType: "Vegetarian",
        calories: 2100,
        duration: 30,
        description: "Paneer, yogurt, lentils and vegetables.",
        completed: false
    },
    {
        id: "6",
        name: "Powered by Plants",
        goal: "Vegan",
        dietType: "Vegan",
        calories: 2100,
        duration: 30,
        description: "Tofu, beans, quinoa, fruits and vegetables.",
        completed: false
    },
    {
        id: "7",
        name: "Whole Food Foundations",
        goal: "Balanced Diet",
        dietType: "Flexible",
        calories: 2000,
        duration: 30,
        description: "Whole grains, fruits, vegetables and protein.",
        completed: false
    }
];

// Load saved plans from localStorage.
function loadPlans() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);

        if (saved !== null) {
            const data = JSON.parse(saved);

            if (
                Array.isArray(data) &&
                data.every(plan =>
                    plan &&
                    typeof plan.id === "string" &&
                    typeof plan.name === "string" &&
                    typeof plan.goal === "string" &&
                    typeof plan.dietType === "string" &&
                    Number.isFinite(plan.calories) &&
                    Number.isFinite(plan.duration) &&
                    typeof plan.description === "string" &&
                    typeof plan.completed === "boolean"
                )
            ) {
                return data;
            }
        }
    } catch (error) {
        console.error("Unable to load plans:", error);
    }

    return starterPlans.map(plan => ({ ...plan }));
}

let plans = loadPlans();
let selectedGoal = "All";
let selectedStatus = "all";

const plansGrid = document.getElementById("plansGrid");
const planForm = document.getElementById("planForm");
const searchInput = document.getElementById("searchInput");
const goalFilters = document.getElementById("goalFilters");
const emptyState = document.getElementById("emptyState");
const resultsCount = document.getElementById("resultsCount");
const formFeedback = document.getElementById("formFeedback");

const totalCount = document.getElementById("totalCount");
const completedCount = document.getElementById("completedCount");
const allCount = document.getElementById("allCount");
const doneCount = document.getElementById("doneCount");

const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

// Save data to browser storage.
function savePlans() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
        return true;
    } catch (error) {
        console.error("Unable to save plans:", error);
        showFeedback("Unable to save plans. Check browser storage.", true);
        return false;
    }
}

// Safely create DOM elements.
function createElement(tag, className = "", text = "") {
    const element = document.createElement(tag);

    if (className) element.className = className;
    element.textContent = text;

    return element;
}

function createButton(text, className, action, id) {
    const button = createElement("button", `btn ${className}`, text);
    button.type = "button";
    button.dataset.action = action;
    button.dataset.id = id;

    return button;
}

// Build an individual diet plan card.
function createPlanCard(plan, index) {
    const card = createElement(
        "article",
        `plan-card${plan.completed ? " completed" : ""}`
    );

    const top = createElement("div", "card-top");
    const topline = createElement("div", "card-topline");

    topline.append(
        createElement(
            "span",
            "card-number",
            `PLAN / ${String(index + 1).padStart(2, "0")}`
        ),
        createElement("span", "goal-badge", plan.goal)
    );

    top.append(
        topline,
        createElement("h3", "", plan.name),
        createElement("p", "card-type", plan.dietType)
    );

    if (plan.completed) {
        top.append(
            createElement("span", "completed-label", "✓ COMPLETED")
        );
    }

    const metrics = createElement("div", "card-metrics");

    const calories = createElement("div", "metric");
    calories.append(
        createElement("span", "", "DAILY CALORIES"),
        createElement(
            "strong",
            "",
            `${plan.calories.toLocaleString()} kcal`
        )
    );

    const duration = createElement("div", "metric");
    duration.append(
        createElement("span", "", "DURATION"),
        createElement("strong", "", `${plan.duration} days`)
    );

    metrics.append(calories, duration);

    const notes = createElement(
        "div",
        "card-notes",
        plan.description || "No meal notes added yet."
    );

    const footer = createElement("div", "card-footer");

    footer.append(
        createButton(
            plan.completed ? "MARK ACTIVE" : "MARK DONE ✓",
            plan.completed ? "btn-small-outline" : "btn-primary",
            "toggle",
            plan.id
        ),
        createButton("DELETE ×", "btn-danger", "delete", plan.id)
    );

    card.append(top, metrics, notes, footer);

    return card;
}

// Filter plans using search, goal and completion status.
function getFilteredPlans() {
    const query = searchInput.value.trim().toLowerCase();

    return plans.filter(plan => {
        const matchesGoal =
            selectedGoal === "All" || plan.goal === selectedGoal;

        const matchesStatus =
            selectedStatus === "all" ||
            (selectedStatus === "active" && !plan.completed) ||
            (selectedStatus === "completed" && plan.completed);

        const text = [
            plan.name,
            plan.goal,
            plan.dietType,
            plan.description
        ].join(" ").toLowerCase();

        return matchesGoal && matchesStatus && text.includes(query);
    });
}

// Render the filtered cards.
function renderPlans() {
    const filtered = getFilteredPlans();
    const fragment = document.createDocumentFragment();

    filtered.forEach((plan, index) => {
        fragment.appendChild(createPlanCard(plan, index));
    });

    plansGrid.replaceChildren(fragment);

    plansGrid.hidden = filtered.length === 0;
    emptyState.hidden = filtered.length !== 0;

    resultsCount.textContent =
        `${filtered.length} ${filtered.length === 1 ? "plan" : "plans"} found`;

    updateStats();
}

// Update dashboard statistics.
function updateStats() {
    const completed = plans.filter(plan => plan.completed).length;

    totalCount.textContent = plans.length;
    completedCount.textContent = completed;
    allCount.textContent = plans.length;
    doneCount.textContent = completed;
}

// Goal category filters.
goalFilters.addEventListener("click", event => {
    const button = event.target.closest("[data-goal]");
    if (!button) return;

    selectedGoal = button.dataset.goal;

    goalFilters.querySelectorAll("[data-goal]").forEach(item => {
        const active = item === button;
        item.classList.toggle("active", active);
        item.setAttribute("aria-pressed", String(active));
    });

    renderPlans();
});

// Completion status filters.
document.querySelector(".status-tabs").addEventListener("click", event => {
    const button = event.target.closest("[data-status]");
    if (!button) return;

    selectedStatus = button.dataset.status;

    document.querySelectorAll("[data-status]").forEach(item => {
        const active = item === button;
        item.classList.toggle("active", active);
        item.setAttribute("aria-pressed", String(active));
    });

    renderPlans();
});

// Search plans as the user types.
searchInput.addEventListener("input", renderPlans);

// Reset all filters.
document.getElementById("resetFilters").addEventListener("click", () => {
    searchInput.value = "";
    selectedGoal = "All";
    selectedStatus = "all";

    document.querySelectorAll("[data-goal]").forEach(button => {
        const active = button.dataset.goal === "All";
        button.classList.toggle("active", active);
        button.setAttribute("aria-pressed", String(active));
    });

    document.querySelectorAll("[data-status]").forEach(button => {
        const active = button.dataset.status === "all";
        button.classList.toggle("active", active);
        button.setAttribute("aria-pressed", String(active));
    });

    renderPlans();
});

// Complete or delete a plan.
plansGrid.addEventListener("click", event => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;

    const { action, id } = button.dataset;
    const index = plans.findIndex(plan => plan.id === id);

    if (index === -1) return;

    if (action === "delete") {
        if (!confirm(`Delete "${plans[index].name}"?`)) return;

        const removed = plans.splice(index, 1)[0];

        if (!savePlans()) {
            plans.splice(index, 0, removed);
            renderPlans();
            return;
        }

        showFeedback("Plan deleted successfully.");
    }

    if (action === "toggle") {
        plans[index].completed = !plans[index].completed;

        if (!savePlans()) {
            plans[index].completed = !plans[index].completed;
            renderPlans();
            return;
        }

        showFeedback(
            plans[index].completed
                ? "Plan marked completed!"
                : "Plan moved back to in progress."
        );
    }

    renderPlans();
});

// Display form feedback.
function showFeedback(message, isError = false) {
    formFeedback.textContent = message;
    formFeedback.classList.toggle("error", isError);
}

// Add a new plan.
planForm.addEventListener("submit", event => {
    event.preventDefault();

    if (!planForm.reportValidity()) return;

    const name = document.getElementById("planName").value.trim();
    const goal = document.getElementById("goal").value;
    const dietType = document.getElementById("dietType").value;
    const calories = Number(document.getElementById("calories").value);
    const duration = Number(document.getElementById("duration").value);
    const description = document.getElementById("description").value.trim();

    if (
        name.length < 3 ||
        name.length > 50 ||
        !Number.isInteger(calories) ||
        calories < 800 ||
        calories > 6000 ||
        !Number.isInteger(duration) ||
        duration < 1 ||
        duration > 365
    ) {
        showFeedback("Please check your plan details.", true);
        return;
    }

    const newPlan = {
        id: `plan-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        name,
        goal,
        dietType,
        calories,
        duration,
        description,
        completed: false
    };

    plans.unshift(newPlan);

    if (!savePlans()) {
        plans.shift();
        return;
    }

    planForm.reset();
    searchInput.value = "";
    selectedGoal = "All";
    selectedStatus = "all";

    document.querySelectorAll("[data-goal]").forEach(button => {
        const active = button.dataset.goal === "All";
        button.classList.toggle("active", active);
        button.setAttribute("aria-pressed", String(active));
    });

    document.querySelectorAll("[data-status]").forEach(button => {
        const active = button.dataset.status === "all";
        button.classList.toggle("active", active);
        button.setAttribute("aria-pressed", String(active));
    });

    showFeedback("Your diet plan has been saved!");
    renderPlans();

    document.getElementById("plans").scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
});

// BMI calculator.
document.getElementById("bmiForm").addEventListener("submit", event => {
    event.preventDefault();

    if (!event.currentTarget.reportValidity()) return;

    const height = Number(document.getElementById("height").value);
    const weight = Number(document.getElementById("weight").value);
    const result = document.getElementById("bmiResult");

    if (
        !Number.isFinite(height) ||
        !Number.isFinite(weight) ||
        height < 100 ||
        height > 250 ||
        weight < 25 ||
        weight > 350
    ) {
        result.hidden = false;
        result.replaceChildren(
            createElement("p", "", "Enter a valid height and weight.")
        );
        return;
    }

    const bmi = weight / ((height / 100) ** 2);

    let category;

    if (bmi < 18.5) {
        category = "Below the usual adult BMI range";
    } else if (bmi < 25) {
        category = "Within the usual adult BMI range";
    } else if (bmi < 30) {
        category = "Above the usual adult BMI range";
    } else {
        category = "In the high adult BMI range";
    }

    result.replaceChildren(
        createElement("strong", "", bmi.toFixed(1)),
        createElement("p", "", category),
        createElement(
            "p",
            "",
            "BMI is a screening measure, not a diagnosis or an individualized diet recommendation."
        )
    );

    result.hidden = false;
});

// Mobile navigation.
menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation" : "Toggle navigation"
    );
});

navLinks.addEventListener("click", event => {
    if (event.target.closest("a")) {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Toggle navigation");
    }
});

// Initialize the application.
document.getElementById("year").textContent =
    new Date().getFullYear();

document.querySelectorAll("[data-goal], [data-status]").forEach(button => {
    button.setAttribute(
        "aria-pressed",
        String(button.classList.contains("active"))
    );
});

renderPlans();

const exercises = [
    {id:1, name:"Bench Press", category:"Chest", level:"Intermediate", equipment:"Barbell", sets:"3 × 8–12 reps", description:"Build chest strength with a controlled pressing movement.", image:"Images/benchpress.png", steps:["Lie on a bench with feet flat on the floor.","Grip the bar slightly wider than shoulder width.","Lower the bar under control towards your chest.","Press up smoothly while keeping your wrists steady."]},
    {id:2, name:"Incline Dumbbell Press", category:"Chest", level:"Intermediate", equipment:"Dumbbells", sets:"3 × 10 reps", description:"Emphasises the upper chest and front shoulders.", image:"Images/inclinedumbellpress.png", steps:["Set the bench to a slight incline.","Start with dumbbells near the upper chest.","Press upward without banging the weights together.","Lower slowly to the starting position."]},
    {id:3, name:"Push-Ups", category:"Chest", level:"Beginner", equipment:"Bodyweight", sets:"3 × 10–15 reps", description:"A bodyweight movement for chest, shoulders and triceps.", image:"Images/pushups.png", steps:["Place hands slightly wider than shoulder width.","Keep your body in a straight line.","Lower your chest towards the floor.","Push back up while keeping your core engaged."]},
    {id:4, name:"Lat Pulldown", category:"Back", level:"Beginner", equipment:"Cable machine", sets:"3 × 10–12 reps", description:"Trains the lats and upper back pulling muscles.", image:"Images/latpulldown.png", steps:["Sit tall and secure your thighs under the pads.","Grip the bar slightly wider than shoulder width.","Pull the bar towards your upper chest.","Return slowly without swinging your torso."]},
    {id:5, name:"Seated Cable Row", category:"Back", level:"Intermediate", equipment:"Cable machine", sets:"3 × 10–12 reps", description:"Works the middle back and strengthens your pulling pattern.", image:"Images/cablerow.png", steps:["Sit upright with knees slightly bent.","Hold the handle with both hands.","Pull towards your torso and squeeze your shoulder blades.","Extend your arms slowly to return."]},
    {id:6, name:"Dumbbell Shoulder Press", category:"Shoulders", level:"Intermediate", equipment:"Dumbbells", sets:"3 × 8–12 reps", description:"Builds shoulder strength and stability.", image:"Images/shoulderpress.png", steps:["Hold dumbbells at shoulder height.","Brace your core and keep your back supported.","Press the weights overhead under control.","Lower to shoulder height."]},
    {id:7, name:"Lateral Raises", category:"Shoulders", level:"Beginner", equipment:"Dumbbells", sets:"3 × 12–15 reps", description:"Targets the side deltoids for stronger shoulders.", image:"Images/lateralraises.png", steps:["Stand with dumbbells by your sides.","Keep a slight bend in your elbows.","Raise your arms out to the sides to a comfortable height.","Lower slowly without swinging."]},
    {id:8, name:"Biceps Curl", category:"Arms", level:"Beginner", equipment:"Dumbbells", sets:"3 × 10–12 reps", description:"An isolation exercise for the biceps.", image:"Images/bicepcurls.png", steps:["Stand tall with dumbbells by your sides.","Keep your elbows close to your torso.","Curl the weights towards your shoulders.","Lower slowly without swinging your body."]},
    {id:9, name:"Triceps Pushdown", category:"Arms", level:"Beginner", equipment:"Cable machine", sets:"3 × 10–12 reps", description:"Targets the triceps at the back of your upper arms.", image:"Images/triceps.png", steps:["Stand facing the cable machine.","Keep your elbows tucked against your sides.","Push the handle down by extending your elbows.","Return slowly while keeping upper arms still."]},
    {id:10, name:"Bodyweight Squats", category:"Legs", level:"Beginner", equipment:"Bodyweight", sets:"3 × 12 reps", description:"Strengthens quads, glutes and other leg muscles.", image:"Images/squats.png", steps:["Stand with feet around shoulder width apart.","Brace your core and push hips back.","Bend your knees and lower under control.","Push through your feet to stand."]},
    {id:11, name:"Walking Lunges", category:"Legs", level:"Intermediate", equipment:"Bodyweight", sets:"3 × 10 each leg", description:"Works the quads and glutes while challenging balance.", image:"Images/lunges.png", steps:["Stand tall with feet hip-width apart.","Step forward and bend both knees under control.","Keep your front knee aligned with your foot.","Push through the front foot and step forward again."]},
    {id:12, name:"Plank", category:"Abs", level:"Beginner", equipment:"Bodyweight", sets:"3 × 20–45 sec", description:"Builds core stability and abdominal endurance.", image:"Images/plank.png", steps:["Place your forearms on the floor.","Extend your legs behind you.","Keep head, hips and heels aligned.","Brace your abs and breathe normally while holding."]}
];

const grid = document.getElementById("workout-grid");
const searchInput = document.getElementById("search-input");
const categoryFilter = document.getElementById("category-filter");
const categoryButtons = document.querySelectorAll(".category-btn");
const savedFilter = document.getElementById("saved-filter");
const emptyMessage = document.getElementById("empty-message");
const totalCount = document.getElementById("total-count");
const savedCount = document.getElementById("saved-count");
const resultsLine = document.getElementById("results-line");
const STORAGE_KEY = "musclepediaSavedWorkouts";

let selectedCategory = "All";
let showSavedOnly = false;
let expandedWorkout = null;

function loadSavedWorkouts() {
    try {
        const value = JSON.parse(localStorage.getItem(STORAGE_KEY));
        return Array.isArray(value) ? value : [];
    } catch (error) {
        return [];
    }
}
let savedWorkouts = loadSavedWorkouts();

function saveWorkouts() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(savedWorkouts));
    } catch (error) {
        console.warn("Saved workouts could not be stored in this browser.");
    }
}

function createWorkoutCard(exercise) {
    const isSaved = savedWorkouts.includes(exercise.id);
    const isExpanded = expandedWorkout === exercise.id;

    const card = document.createElement("article");
    card.className = "workout-card";

    const imageWrap = document.createElement("div");
    imageWrap.className = "exercise-image";
    const image = document.createElement("img");
    image.src = exercise.image;
    image.alt = exercise.name;
    image.loading = "lazy";
    image.onerror = function () {
        this.style.display = "none";
        imageWrap.style.background = "linear-gradient(135deg, #29351a, #080808)";
    };
    const tag = document.createElement("span");
    tag.className = "muscle-tag";
    tag.textContent = exercise.category;
    imageWrap.append(image, tag);

    const content = document.createElement("div");
    content.className = "card-content";
    const title = document.createElement("h3");
    title.textContent = exercise.name;
    const description = document.createElement("p");
    description.textContent = exercise.description;

    const meta = document.createElement("div");
    meta.className = "exercise-meta";
    [exercise.level, exercise.equipment, exercise.sets].forEach(text => {
        const item = document.createElement("span");
        item.textContent = text;
        meta.appendChild(item);
    });

    const actions = document.createElement("div");
    actions.className = "card-actions";
    const detailsButton = document.createElement("button");
    detailsButton.type = "button";
    detailsButton.className = "details-btn";
    detailsButton.textContent = isExpanded ? "HIDE DETAILS −" : "VIEW DETAILS +";
    detailsButton.setAttribute("aria-expanded", String(isExpanded));
    detailsButton.addEventListener("click", () => {
        expandedWorkout = isExpanded ? null : exercise.id;
        renderWorkouts();
    });

    const saveButton = document.createElement("button");
    saveButton.type = "button";
    saveButton.className = "save-btn" + (isSaved ? " saved" : "");
    saveButton.textContent = isSaved ? "♥" : "♡";
    saveButton.title = isSaved ? "Remove saved workout" : "Save workout";
    saveButton.setAttribute("aria-pressed", String(isSaved));
    saveButton.setAttribute("aria-label", (isSaved ? "Remove " : "Save ") + exercise.name);
    saveButton.addEventListener("click", () => {
        savedWorkouts = isSaved
            ? savedWorkouts.filter(id => id !== exercise.id)
            : [...savedWorkouts, exercise.id];
        saveWorkouts();
        renderWorkouts();
    });
    actions.append(detailsButton, saveButton);
    content.append(title, description, meta, actions);
    card.append(imageWrap, content);

    if (isExpanded) {
        const details = document.createElement("div");
        details.className = "exercise-details";
        const heading = document.createElement("h4");
        heading.textContent = "HOW TO PERFORM";
        const list = document.createElement("ol");
        exercise.steps.forEach(step => {
            const item = document.createElement("li");
            item.textContent = step;
            list.appendChild(item);
        });
        details.append(heading, list);
        content.appendChild(details);
    }
    return card;
}

function updateCategoryButtons() {
    categoryButtons.forEach(button => {
        const active = button.dataset.category === selectedCategory;
        button.classList.toggle("active", active);
        button.setAttribute("aria-pressed", String(active));
    });
}

function renderWorkouts() {
    const term = searchInput.value.trim().toLowerCase();
    const matches = exercises.filter(exercise => {
        const searchable = [exercise.name, exercise.category, exercise.equipment, exercise.description].join(" ").toLowerCase();
        const matchesSearch = searchable.includes(term);
        const matchesCategory = selectedCategory === "All" || exercise.category === selectedCategory;
        const matchesSaved = !showSavedOnly || savedWorkouts.includes(exercise.id);
        return matchesSearch && matchesCategory && matchesSaved;
    });

    grid.replaceChildren();
    matches.forEach(exercise => grid.appendChild(createWorkoutCard(exercise)));
    emptyMessage.hidden = matches.length !== 0;
    totalCount.textContent = exercises.length;
    savedCount.textContent = savedWorkouts.length;
    resultsLine.textContent = `Showing ${matches.length} of ${exercises.length} exercises`;
    savedFilter.classList.toggle("active", showSavedOnly);
    savedFilter.setAttribute("aria-pressed", String(showSavedOnly));
}

searchInput.addEventListener("input", renderWorkouts);

categoryFilter.addEventListener("change", () => {
    selectedCategory = categoryFilter.value;
    updateCategoryButtons();
    renderWorkouts();
});

categoryButtons.forEach(button => {
    button.addEventListener("click", () => {
        selectedCategory = button.dataset.category;
        categoryFilter.value = selectedCategory;
        updateCategoryButtons();
        renderWorkouts();
    });
});

savedFilter.addEventListener("click", () => {
    showSavedOnly = !showSavedOnly;
    renderWorkouts();
});

renderWorkouts();

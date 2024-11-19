function loadSummary() {
    loadSidebar();
    loadHeader();
    showWhichSiteIsAktiv();
    greetUser();
    loadDataForSummary();
}

function showWhichSiteIsAktiv() {
    addClassToElement("summary", "active");
    addClassToElement("task", "no-active");
    addClassToElement("board", "no-active");
    addClassToElement("contacts", "no-active");
}

function greetUser() {
    let user = localStorage.getItem("currentUser");

    if (user == "Guest") {
        document.getElementById("user_name").classList.add("d_none");
    } else {
        document.getElementById("greeting").innerText = "Good morning,"
        document.getElementById("user_name").innerText = firstLetterOfWordBig(localStorage.getItem("currentUser"));
    }
}

/* icons ändern beim hovern */

/* todo icon */
const hoverTodo = document.getElementById('todo_div');
const todo_img = document.getElementById('todo_img');

// Event Listener für Hover-Effekt
hoverTodo.addEventListener('mouseenter', () => {
    todo_img.src = '../assets/icon/summary_todo_hover.svg'; // Bildquelle ändern beim Hover
});

hoverTodo.addEventListener('mouseleave', () => {
    todo_img.src = '../assets/icon/summary_todo.svg'; // Bildquelle zurücksetzen, wenn Hover beendet ist
});

/* done icon */
const hoverDone = document.getElementById('done_div');
const done_img = document.getElementById('done_img');

// Event Listener für Hover-Effekt
hoverDone.addEventListener('mouseenter', () => {
    done_img.src = '../assets/icon/summary_done_hover.svg'; // Bildquelle ändern beim Hover
});

hoverDone.addEventListener('mouseleave', () => {
    done_img.src = '../assets/icon/summary_done.svg'; // Bildquelle zurücksetzen, wenn Hover beendet ist
});

/* Lade die Daten vom Backand */

async function loadDataForSummary() {
    tasksAsObj = await loadFromBackend('tasks');
    tasks = Object.values(tasksAsObj);
    
    console.log(tasks);

    renderDataInSummary();

    getEarliestTaskDate();
}

async function renderDataInSummary() {
    renderSummary("state", "todo", 'todo_amount');
    renderSummary("state", "done", 'done_amount');
    renderSummary("state", "progress", 'in_progress_amount');
    renderSummary("state", "await", 'feedback_amount');
    renderSummary("prio", "high", 'urgent_amount');
    renderSummaryAllTasks();
}

function renderSummary(obj, key, id,) {
    const doneTasksLength = tasks.filter(task => task[obj] === key).length;
    document.getElementById(id).innerHTML = doneTasksLength;
}

function renderSummaryAllTasks() {
    document.getElementById('all_tasks_amount').innerHTML = tasks.length;
}

function getEarliestTaskDate() {
    if (tasks.length === 0) {
        document.getElementById('deadline_date').innerHTML = "";
        return;
    }

    // Findet das früheste Datum
    const earliestTask = tasks.reduce((earliest, currentTask) => {
        // Vergleicht das aktuelle früheste Datum mit dem Datum des aktuellen Tasks
        return new Date(currentTask.date) < new Date(earliest.date) ? currentTask : earliest;
    });

    document.getElementById('deadline_date').innerHTML = earliestTask.date;
}
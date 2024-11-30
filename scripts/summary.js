/**
 * Loads the contents of the Summary page, including sidebar, header, active page, greeting, and task data.
 */
function loadSummary() {
  loadSidebar();
  loadHeader();
  showWhichSiteIsAktiv();
  greetUser();
  loadDataForSummary();
}

/**
 * Sets the current page as active ('summary') and others ('task', 'board', 'contacts') as inactive.
 */
function showWhichSiteIsAktiv() {
  addClassToElement('summary', 'active');
  addClassToElement('task', 'no-active');
  addClassToElement('contacts', 'no-active');
}

/**
 * Greets the user based on the time of day and user status (Guest or logged-in user).
 */
function greetUser() {
  let user = localStorage.getItem('currentUser');

  if (user == 'Guest') {
    document.getElementById('user_name').classList.add('d_none');
    
  } else {
    document.getElementById('user_name').innerText = firstLetterOfWordBig(localStorage.getItem('currentUser'));
  }

  document.getElementById('greeting').innerText = getGreetText();
}

/* todo icon */
const hoverTodo = document.getElementById('todo_div');
const todo_img = document.getElementById('todo_img');

// Event Listener für Hover-Effekt
hoverTodo.addEventListener('mouseenter', () => {
  todo_img.src = '../assets/icon/summary_todo_hover.svg';
});

hoverTodo.addEventListener('mouseleave', () => {
  todo_img.src = '../assets/icon/summary_todo.svg';
});

/* done icon */
const hoverDone = document.getElementById('done_div');
const done_img = document.getElementById('done_img');

hoverDone.addEventListener('mouseenter', () => {
  done_img.src = '../assets/icon/summary_done_hover.svg';
});

hoverDone.addEventListener('mouseleave', () => {
  done_img.src = '../assets/icon/summary_done.svg'; 
});

/**
 * Loads task data from the backend and renders it in the summary page.
 */
async function loadDataForSummary() {
  tasksAsObj = await loadFromBackend('tasks');
  tasks = Object.values(tasksAsObj);
  renderDataInSummary();
  getEarliestTaskDate();
}

/**
 * Renders task data in the summary page, including state and priority counts.
 */
async function renderDataInSummary() {
  renderSummary('state', 'todo', 'todo_amount');
  renderSummary('state', 'done', 'done_amount');
  renderSummary('state', 'progress', 'in_progress_amount');
  renderSummary('state', 'await', 'feedback_amount');
  renderSummary('prio', 'high', 'urgent_amount');
  renderSummaryAllTasks();
}


/**
 * Renders the number of tasks based on a given object key and value.
 * Updates the specified element with the count of matching tasks.
 */
function renderSummary(obj, key, id) {
  const doneTasksLength = tasks.filter((task) => task[obj] === key).length;
  document.getElementById(id).innerHTML = doneTasksLength;
}

/**
 * Renders the total number of tasks in the summary page.
 */
function renderSummaryAllTasks() {
  document.getElementById('all_tasks_amount').innerHTML = tasks.length;
}


/**
 * Finds the earliest task date and displays it in the summary.
 */
function getEarliestTaskDate() {
  if (tasks.length === 0) {
    document.getElementById('deadline_date').innerHTML = '';
    return;
  }

  const earliestTask = tasks.reduce((earliest, currentTask) => {
    return new Date(currentTask.date) < new Date(earliest.date) ? currentTask : earliest;
  });
  document.getElementById('deadline_date').innerHTML = earliestTask.date;
}

/**
 * Sets the greeting text based on the time of day.
 * Returns "Good morning" or "Good night" depending on the current time.
 */
function getGreetText() {
  const date = new Date();
  const hours = date.getHours();
  let user = localStorage.getItem('currentUser');

  if (hours >= 22 || hours < 6) {
    return `Good night${user === "Guest" ? "" : ","}`;
  } else {
 
    return `Good morning${user === "Guest" ? "" : ","}`;
  }
}

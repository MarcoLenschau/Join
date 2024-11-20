/**
 *
 *  The function load all templates if the page load.
 *
 */

async function loadTask() {
  loadSidebar();
  showWhichSiteIsAktiv();
  loadHeader();
  document.getElementById('add-task').innerHTML = getAddTaskTemplate();
  await loadContactsList();
  mediumPrio();
}

async function loadContactsList() {
  contacts = Object.values(await loadFromBackend('contacts'));

  contacts.sort((a, b) => a.name.localeCompare(b.name));
  for (let index = 0; index < contacts.length; index++) {
    let shortcut = extractTheFirstLetter(contacts[index].name.split(' '));
    let jobTitle = await createJobTitleClass(index);
    document.getElementById('userlist').innerHTML += getCheckBoxList(index, contacts[index], shortcut, jobTitle);
  }
}

async function createJobTitleClass(index) {
  let jobTitle = contacts[index].role.toLocaleLowerCase().split(' ');
  let jobTitleStr = '';
  for (let index = 0; index < jobTitle.length; index++) {
    jobTitleStr += jobTitle[index];
  }
  return jobTitleStr;
}

/**
 *
 *  The function is for the sidebar and show which page is current.
 *
 */

function showWhichSiteIsAktiv() {
  addClassToElement('summary', 'no-active');
  addClassToElement('task', 'active');
  addClassToElement('board', 'no-active');
  addClassToElement('contacts', 'no-active');
}

/**
 * The function is for the change the color from a element.
 *
 * @param {string} item - The element that add the background color.
 * @param {string} color - The background color that add to element.
 */

function changeTheColor(item, color) {
  document.getElementById(item).style = `background-color: ${color}`;
}

/**
 *
 *  The function clear all input fields and set the prio of medium.
 */

function clearFields() {
  document.getElementById('title').value = '';
  document.getElementById('description').value = '';
  document.getElementById('date').value = '';
  mediumPrio();
}

/**
 *
 *  The function check if all data input and create a new task.
 *
 */

function createNewTask() {
  allDataAreCorrect();
}

/**
 *
 *  The function run when all data is correct.
 *
 */

// const obj = {
//   name: 'Paul Black',
//   email: 'paul.black@example.com',
//   phone: '+491234567805',
//   role: 'Developer',
// };

// async function test(params) {
//   await fetch(`${BACKEND_URL}/contacts.json`, {
//     method: 'POST',
//     headers: { 'Content-Type': 'application/json' },
//     body: JSON.stringify(obj),
//   });
// }

// test();

async function allDataAreCorrect() {
  let taskObj = defindeUserObj();

  if (!isValidTaskInputs(taskObj.assignedTo)) return;

  const { name } = await postDataAtBackend(taskObj, 'tasks');
  tasks = [...tasks, { ...taskObj, id: name }];
  displayTasks();

  const taskCreatedMessageElement = document.querySelector('.task-created-message');
  taskCreatedMessageElement.classList.add('show-task-created-message');

  resetTaskValues();
  toggleCheckMenu();
  toggleEmptyMessage();
  setTimeout(() => {
    taskCreatedMessageElement.classList.remove('show-task-created-message');
  }, 1500);
}

function defindeUserObj(state) {
  let title = document.getElementById('title').value;
  let date = document.getElementById('date').value;
  let prio = document.getElementsByClassName('active-prio')[0].dataset.prio;
  let category = document.getElementById('category').value;
  let description = document.getElementById('description').value;
  let assignedTo = assignedToDataExtract();
  let subTasks = getSubtasks();

  let taskObj = {
    title,
    date,
    prio,
    category,
    description,
    assignedTo,
    state: state || 'todo',
    subTasks,
  };

  return taskObj;
}

function assignedToDataExtract() {
  let assignedToUserList = [];
  for (let index = 0; index < contacts.length; index++) {
    let checkbox = document.getElementById('checkbox' + index)?.checked;
    if (checkbox) {
      const { name, role } = contacts[index];

      assignedToUserList.push({ name, role });
    }
  }
  return assignedToUserList;
}

function getSubtasks() {
  const subtaskItems = Array.from(document.querySelector('.subtask-list').children);

  return subtaskItems.map((subtaskItem) => {
    const description = subtaskItem.querySelector('input').value;

    return { description, done: false };
  });
}

function isValidTaskInputs(assignedTo) {
  const tittle = document.getElementById('title').value;
  const date = document.getElementById('date').value;
  const category = document.getElementById('category').value;

  if (tittle && date && category && assignedTo.length) return true;

  toggleInvalidFields(assignedTo);
  return false;
}

function toggleInvalidFields(assignedTo) {
  const titleInput = document.getElementById('title');
  const dateInput = document.getElementById('date');
  const categoryInput = document.getElementById('category');
  const userListCtn = document.querySelector('.userlist-ctn');

  if (!assignedTo.length) {
    userListCtn.classList.add('invalid-input');
    userListCtn.addEventListener('click', () => userListCtn.classList.remove('invalid-input'));
  }

  [titleInput, dateInput, categoryInput].forEach((field) => {
    if (!field.value) {
      field.classList.add('invalid-input');
      field.addEventListener('focus', () => field.classList.remove('invalid-input'));
    }
  });
}

function resetTaskValues() {
  document.getElementById('title').value = '';
  document.getElementById('date').value = '';
  document.getElementById('category').value = '';
  document.getElementById('description').value = '';
  document.querySelector('.subTask-input').value = '';
  document.querySelector('.subtask-list').innerHTML = '';
  checkThePrioOfTask(2);
  Array.from(document.getElementById('userlist').children).forEach((label) => {
    const checbox = label.querySelector('input');
    checbox.checked = false;
  });
}

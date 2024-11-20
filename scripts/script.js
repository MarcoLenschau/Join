const BACKEND_URL = 'https://join-mb-default-rtdb.europe-west1.firebasedatabase.app/datenBank/';
let allUserCredential = [];
let currentUser = '';

async function loadTemplateData(url) {
  let response = await fetch(url);
  let template = await response.text();

  return template;
}

function loadSidebar() {
  document.getElementById('sidebar').innerHTML = sidebarShow();
}

/**
 *
 * The function add a class to the element.
 *
 * @param {string} element - The element that is added to the class.
 * @param {string} aktiveClass - The class that is added to the element.
 */

function addClassToElement(element, aktiveClass) {
  document.getElementById(element).classList.add(aktiveClass);
}

async function loadHeader() {
  document.getElementById('header').innerHTML = await loadTemplateData('../template/header.html');
  document.getElementById('first-letter-header').innerText = firstLetterBig(localStorage.getItem('currentUser'));
}

async function loadModal(isEditMode, taskId) {
  const task = tasks.find((task) => task.id === taskId);
  const date = isEditMode ? task?.date.split('/').reverse().join('-') : '';
  const subTasks = isEditMode
    ? task.subTasks?.map((subTask) => `${getSubTaskItemTemplate(subTask.description)}`).join('') || ''
    : '';

  document.getElementById('add-task-modal').innerHTML = getAddTaskTemplate(isEditMode, task, date, subTasks);

  checkThePrioOfTask(2);

  if (task?.prio === 'high') checkThePrioOfTask(1);
  if (task?.prio === 'medium') checkThePrioOfTask(2);
  if (task?.prio === 'low') checkThePrioOfTask(3);

  await loadContactsList();

  if (isEditMode) checkAssignedUsers(task?.assignedTo);
}

function loadTaskPreview(taskId) {
  const task = tasks.find((task) => task.id == taskId);

  document.getElementById('add-task-modal').innerHTML = getTaskPreviewTemplate(task);
}

function toggleHeaderMenu() {
  const menu = document.querySelector('.header-menu');
  menu.classList.toggle('show-element');
}

function checkAssignedUsers(assignedTo) {
  const userlist = Array.from(document.getElementById('userlist').children);

  assignedTo?.forEach(({ name }) => {
    userlist.forEach((label) => {
      const checkbox = label.querySelector('input');
      const userName = label.querySelector('div span').innerHTML;
      if (userName === name) checkbox.checked = true;
    });
  });
}

function toggleAddTaskModal(e) {
  e.stopPropagation();

  const target = e?.target;
  const isModal = target?.closest('[data-modal]');
  const closeButton = target?.closest('.button-close-modal');
  const taskPreview = target?.closest('.task-preview');
  const deleteButton = target?.closest('[data-delete-button]');

  if ((isModal && !closeButton) || (taskPreview && !deleteButton && !closeButton)) return;

  const modal = document.querySelector('.add-task-modal');
  modal.classList.toggle('show-modal');
}

function toggleEditMode(event) {
  const itemElement = event.target.closest('li');
  const inputElement = itemElement.querySelector('input');
  const editModeCtn = itemElement.querySelector('.edit-mode-ctn');
  const editIconCtn = itemElement.querySelector('.edit-icon-ctn');

  inputElement.classList.toggle('input-mode');
  editModeCtn.classList.toggle('d_flex');
  editIconCtn.classList.toggle('d_none');
}

function addSubTask() {
  const subTaskListElement = document.querySelector('.subtask-list');
  const subTaskInput = document.querySelector('.subTask-input');
  const subTaskDescription = subTaskInput.value;

  if (subTaskDescription === '') return;

  const html = getSubTaskItemTemplate(subTaskDescription);

  subTaskInput.value = '';
  subTaskListElement.insertAdjacentHTML('beforeend', html);
}

function deleteSubTask(event) {
  event.stopPropagation();

  const subTaskItem = event.target.closest('li');

  subTaskItem.remove();
}

async function deleteTask(taskId, taskState) {
  const taskElement = Array.from(taskState.children).find((taskElement) => taskElement.dataset.id === taskId);

  taskElement?.remove();

  await deleteData(taskId, 'tasks');
}

// function showContactsData() {
//   let listOfContacts = document.getElementById('list-of-contacts');
//   listOfContacts.innerHTML = getAddContactButtonTemplate();

//   for (let index = 0; index < contacts.length; index++) {
//     listOfContacts.innerHTML += getContactsTemplate(index);
//     checkJobAndColor(index);
//   }
// }

async function renderContacts(isCreateContact) {
  const loadedContacts = await loadFromBackend('contacts');

  if (loadedContacts) {
    contacts = Object.entries(loadedContacts).map(([id, contact]) => {
      return { id, ...contact };
    });
  }

  contacts.sort((a, b) => a.name.localeCompare(b.name));

  if (!isCreateContact) showContactsData();
}

function extractTheFirstLetter(word) {
  let shortcut = '';
  for (let index = 0; index < word.length; index++) {
    shortcut += word[index][0];
  }
  return shortcut;
}

function firstLetterOfWordBig(str) {
  return str[0].toUpperCase() + str.substr(1);
}

function addContact(content, numberOfContact) {
  let { contentButton0, contentButton1 } = showTheRightButtonText(content);
  document.getElementById('add-contact-menu').classList.remove('d_none');
  document.getElementById('add-contact-menu').innerHTML = getAddContactsTemplate(
    content,
    contentButton0,
    contentButton1,
    numberOfContact
  );
  if (numberOfContact != null) {
    document.getElementById('name').value = contacts[numberOfContact].name;
    document.getElementById('email').value = contacts[numberOfContact].email;
    document.getElementById('phone').value = contacts[numberOfContact].phone;
  }
}

// function saveContact(numberOfContact) {
//   if (numberOfContact != null) {
//     contacts[numberOfContact].name = document.getElementById('name').value;
//     contacts[numberOfContact].email = document.getElementById('email').value;
//     contacts[numberOfContact].phone = document.getElementById('phone').value;
//     hideAddContactMenu();
//   }
// }

function showTheRightButtonText(content) {
  let contentButton0,
    contentButton1 = '';
  if (content === 'Edit') {
    contentButton0 = 'Cancel';
    contentButton1 = 'Save';
  } else {
    contentButton0 = 'Cancel';
    contentButton1 = `<span>Create contact</span> <img src="../assets/icon/check-light.png"/>`;
  }
  return { contentButton0, contentButton1 };
}

async function deleteUser(numberOfContact, contactId) {
  document.getElementById('big-content').style = '';
  contacts.splice(numberOfContact, 1);
  emptyContent('more-information');

  showContactsData();
  await deleteData(contactId, 'contacts');
  renderContacts();
}

function emptyContent(content) {
  document.getElementById(content).innerHTML = '';
}

function checkJobAndColor(numberOfContact) {
  let job = contacts[numberOfContact].role.toLowerCase().split(' ');
  let jobTitle = '';
  for (let index = 0; index < job.length; index++) {
    jobTitle += job[index];
  }
  addClassToElement('first-letter-' + numberOfContact, jobTitle);
  return jobTitle;
}

async function checkAllUserCredential() {
  allUserCredential = [];
  try {
    for (let index = 0; index < 20; index++) {
      await pullDataFromBackend(index);
    }
  } catch (error) {}
}

async function pullDataFromBackend(index) {
  let respone = await fetch(`${BACKEND_URL}/users/.json`);
  let responeData = await respone.json();
  checkIfLoginDataCorrect(responeData);
}

function checkIfLoginDataCorrect({ email, password }) {
  let mailInput = document.getElementById('email').value;
  let pwInput = document.getElementById('password').value;
  if (email === mailInput) {
    if (password == pwInput) {
      rightUserData(email);
    }
  }
}

function rightUserData(email) {
  localStorage.setItem('currentUser', email);
  window.location.href = '../pages/summary.html';
}

function defineUserData() {
  let passwordConfirm = document.getElementById('passwordConfirm').value;
  let checkBox = document.getElementById('checkBox').checked;
  let userObj = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    password: document.getElementById('password').value,
  };
  if (checkBox && userObj.password === passwordConfirm) {
    postDataAtBackend(userObj, 'user');
  }
}

/**
 *
 * This is a function for the post data at backend.
 *
 *
 * @param {object} userData - A Object with email and password from user.
 *
 *
 *
 */

async function postDataAtBackend(userData, path) {
  try {
    const res = await fetch(`${BACKEND_URL}/${path}.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });

    const newTaskId = await res.json();

    return newTaskId;
  } catch (error) {
    console.log(error);
  }
}

async function deleteData(id, path) {
  await fetch(`${BACKEND_URL}/${path}/${id}.json`, {
    method: 'DELETE',
  });
}

async function updateDataAtBackend(id, path, newData) {
  await fetch(`${BACKEND_URL}/${path}/${id}.json`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newData),
  });
}

/* Ladeanimation Contacts */
function showLoadAnimation() {
  let loadAnimation = document.getElementById('load-animation');
  loadAnimation.classList.add('load-animation-move');
  setTimeout(() => {
    document.getElementById('load-animation-div').classList.add('d_none');
  }, 3000);
}

function guestLogin() {
  localStorage.setItem('currentUser', 'Guest');
  window.location.href = '../pages/summary.html';
}

function firstLetter(string) {
  if (string) return string[0];
}

function toggleSignupError(errorMessage, method) {
  const errorMessageElement = document.getElementById('auth-error-message');

  errorMessageElement.innerHTML = errorMessage;
  errorMessageElement.classList[method]('show-element');
}

function toggleLoadingSpinner(method) {
  const loadingSpinner = document.querySelector('.auth-loading-spinner');

  loadingSpinner.classList[method]('show-element');
}

// function hideAddContactMenu() {
//   document.getElementById('add-contact-menu').classList.add('d_none');
// }

// function deleteAndCancel(content, numberOfContact) {
//   if (content === 'Add') {
//     hideAddContactMenu();
//   } else {
//     hideAddContactMenu();
//   }
// }

async function updateTask(taskId) {
  const newTask = tasks.find((task) => task.id === taskId);

  displayTasks();

  await updateDataAtBackend(taskId, 'tasks', newTask);
}

async function updateCheckbox(event, taskId) {
  const ulList = Array.from(event.target.closest('ul').children);
  const task = tasks.find((task) => task.id === taskId);

  ulList.forEach((listItem, index) => {
    const checkbox = listItem.querySelector('input');
    task.subTasks[index].done = checkbox.checked;
  });

  await updateTask(taskId);
}

async function updateTaskState(taskId, newState) {
  const task = tasks.find((task) => task.id === taskId);
  task.state = newState;

  await updateTask(taskId);
}

async function updateTaskFields(taskId) {
  let newTask = { ...defindeUserObj(), id: taskId };
  const modal = document.querySelector('.add-task-modal');

  if (!isValidTaskInputs(newTask.assignedTo)) return;

  const newTasks = tasks.map((task) => (task.id === taskId ? newTask : task));
  tasks = newTasks;

  displayTasks();
  modal.classList.remove('show-modal');

  await updateDataAtBackend(taskId, 'tasks', newTask);
}

// async function saveAndCreate(event, content, numberOfContact) {
//   event.preventDefault();

//   if (content === 'Add') {
//     addNewContact(defineNewContact());
//   } else {
//     const contact = contacts[numberOfContact];
//     const id = contact.id;
//     saveContact(numberOfContact);
//     moreInfomationOfContact(numberOfContact, true);
//     await updateDataAtBackend(id, 'contacts', { ...contact, id: undefined });
//   }
// }

// function defineNewContact() {
//   let userData = {
//     name: document.getElementById('name').value,
//     email: document.getElementById('email').value,
//     phone: document.getElementById('phone').value,
//     role: 'Tester',
//   };
//   return userData;
// }

// function addNewContact(userData) {
//   contacts.push(userData);
//   let numberOfNewContact = contacts.length - 1;
//   showContactsData();
//   postDataAtBackend(contacts[numberOfNewContact], 'contacts');
//   moreInfomationOfContact(numberOfNewContact);
//   hideAddContactMenu();
// }

function firstLetterBig(str) {
  if (str) return str[0].toUpperCase();
}

async function loadFromBackend(path) {
  let response = await fetch(`${BACKEND_URL}/${path}.json`);
  let responeData = await response.json();

  return responeData;
}

function toggleMenu() {
  document.getElementById('toggleMenu').classList.toggle('d_none');
}

function toggleCheckMenu() {
  const userListCtn = document.querySelector('.userlist-ctn');

  userListCtn.querySelector('span').classList.toggle('d_none');
  document.getElementById('userlist').classList.toggle('d_none');
  document.getElementById('required-field-big').classList.toggle('d_none');
}

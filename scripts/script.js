const BACKEND_URL = 'https://join-mb-default-rtdb.europe-west1.firebasedatabase.app/datenBank';
let allUserCredential = [];
let currentUser = '';


/**
 * Loads the HTML template data from a given URL.
 *
*/
async function loadTemplateData(url) {
  let response = await fetch(url);
  let template = await response.text();
  return template;
}

/**
 * Loads the sidebar content into the designated HTML element.
 * 
*/
function loadSidebar() {
  document.getElementById('sidebar').innerHTML = sidebarShow();
}

/**
 * The function add a class to the element.
 *
 * @param {string} element - The element that is added to the class.
 * @param {string} aktiveClass - The class that is added to the element.
*/
function addClassToElement(element, aktiveClass) {
  document.getElementById(element).classList.add(aktiveClass);
}

/**
 * Loads the header content dynamically and sets the user's initial in the header.
 * 
*/
async function loadHeader() {
  document.getElementById('header').innerHTML = await loadTemplateData('../template/header.html');
  document.getElementById('first-letter-header').innerText = firstLetterBig(localStorage.getItem('currentUser'));
}


/**
 * Loads the task modal dynamically, setting it up for adding or editing a task.
 * 
 * @param {boolean} isEditMode - Specifies whether the modal is in edit mode (true) or create mode (false).
 * @param {string} taskId - The ID of the task being edited (if in edit mode).
 * 
*/
async function loadModal(isEditMode, taskId) {
  const task = tasks.find((task) => task.id === taskId);
  const date = isEditMode ? task?.date.split('/').reverse().join('-') : '';
  const subTasks = isEditMode 
  ? task.subTasks?.map((subTask) => `${getSubTaskItemTemplate(subTask.description)}`).join('') || '' : '';

  document.getElementById('add-task-modal').innerHTML = getAddTaskTemplate(isEditMode, task, date, subTasks);
  checkThePrioOfTask(2);

  if (task?.prio === 'high') checkThePrioOfTask(1);
  if (task?.prio === 'medium') checkThePrioOfTask(2);
  if (task?.prio === 'low') checkThePrioOfTask(3);

  await loadContactsList();
  if (isEditMode) checkAssignedUsers(task?.assignedTo);
}

/**
 * Loads a preview of a task into the modal.
 * 
 * @param {string} taskId - The ID of the task to be previewed.
 * 
*/
function loadTaskPreview(taskId) {
  const task = tasks.find((task) => task.id == taskId);
  document.getElementById('add-task-modal').innerHTML = getTaskPreviewTemplate(task);
}

/**
 * Toggles the visibility of the header menu by adding or removing the 'show-element' class.
 * 
*/
function toggleHeaderMenu() {
  const menu = document.querySelector('.header-menu');
  menu.classList.toggle('show-element');
}

/**
 * Checks the users assigned to a task and marks them as selected in the UI.
 *
*/
function checkAssignedUsers(assignedTo) {
  const userlist = Array.from(document.getElementById('userlist').children);

  assignedTo?.forEach(({ name }) => {
    userlist.forEach((label) => {
      const checkbox = label.querySelector('input');
      const userName = label.querySelector('span[data-contact-name]').innerHTML;
      if (userName === name) {
        checkbox.checked = true;
        label.classList.add('selected-contact');
      }
    });
  });
}

/**
 * Toggles the visibility of the "Add Task" modal.
 * 
*/
function toggleAddTaskModal(e) {
  e.stopPropagation();

  const target = e?.target;
  const isModal = target?.closest('[data-modal]');
  const closeButton = target?.closest('.button-close-modal');
  const taskPreview = target?.closest('.task-preview');
  const deleteButton = target?.closest('[data-delete-button]');
  const dragIcon = target?.closest(".drag-icon-ctn")
  
  if ((isModal && !closeButton) || (taskPreview && !deleteButton && !closeButton) || dragIcon) return;
  const modal = document.querySelector('.add-task-modal');
  modal.classList.toggle('show-modal');
}

/**
 * Toggles the edit mode for a list item.
 * 
*/
function toggleEditMode(event) {
  const itemElement = event.target.closest('li');
  const inputElement = itemElement.querySelector('input');
  const editModeCtn = itemElement.querySelector('.edit-mode-ctn');
  const editIconCtn = itemElement.querySelector('.edit-icon-ctn');

  inputElement.classList.toggle('input-mode');
  editModeCtn.classList.toggle('d_flex');
  editIconCtn.classList.toggle('d_none');
}

/**
 * Adds a new subtask to the subtask list.
 * 
*/
function addSubTask() {
  const subTaskListElement = document.querySelector('.subtask-list');
  const subTaskInput = document.querySelector('.subTask-input');
  const subTaskDescription = subTaskInput.value;

  if (subTaskDescription === '') return;

  const html = getSubTaskItemTemplate(subTaskDescription);
  subTaskInput.value = '';
  subTaskListElement.insertAdjacentHTML('beforeend', html);
}

/**
 * Deletes a subtask from the subtask list.
 * 
*/
function deleteSubTask(event) {
  event.stopPropagation();
  const subTaskItem = event.target.closest('li');
  subTaskItem.remove();
}

/**
 * Deletes a task from the task list and removes it from persistent storage.
 * 
 * @param {string} taskId - The unique identifier of the task to be deleted.
 * @param {HTMLElement} taskState - The container element (e.g., a list or section) where tasks are stored.
*/
async function deleteTask(taskId, taskState) {
  const taskElement = Array.from(taskState.children).find((taskElement) => taskElement.dataset.id === taskId);
  taskElement?.remove();
  tasks = tasks.filter((task) => task.id !== taskId);
  await deleteData(taskId, 'tasks');
}

/**
 * Loads and renders contacts, optionally creating a new contact.
 * 
 * @param {boolean} isCreateContact - True if creating a new contact, false if rendering existing contacts.
*/
async function renderContacts(isCreateContact) {
  const loadedContacts = await loadFromBackend('contacts');

  if (loadedContacts) {
    contacts = Object.entries(loadedContacts).map(([id, contact]) => {
      return { id, ...contact };
    });
  }

  sortContacts();
  if (!isCreateContact) {
    showContactsData();
    organizeContacts();
  }
}

/**
 * Extracts the first letter of each word.
 * 
 * @param {string} word - The word from which to extract the first letter.
 * @returns {string} A string containing the first letter of each word.
*/
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

/**
 * Displays the "Add Contact" form and pre-fills it if editing an existing contact.
 * 
 * @param {string} content - The content to display on the form.
 * @param {number} [numberOfContact] - The index of the contact to edit (optional).
*/
function addContact(content, numberOfContact) {
  let { contentButton0, contentButton1 } = showTheRightButtonText(content);
  const elements = [content, contentButton0, contentButton1, numberOfContact];

  document.getElementById('add-contact-menu-dialog').classList.add('show-modal');
  document.getElementById('add-contact-menu').innerHTML = getAddContactsTemplate(...elements);
  if (numberOfContact != null) {
    document.getElementById('name').value = contacts[numberOfContact].name;
    document.getElementById('email').value = contacts[numberOfContact].email;
    document.getElementById('phone').value = contacts[numberOfContact].phone;
  }
}

/**
 * Returns the appropriate button text based on the provided content type.
 * 
 * @param {string} content - The type of content ('Edit' or other).
 * @returns {Object} An object containing the button texts for Cancel and the second button.
*/
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

/**
 * Deletes a user from the contact list and removes the data from persistent storage.
 * 
 * @param {number} numberOfContact - The index of the contact to be deleted.
 * @param {string} contactId - The unique ID of the contact to be deleted.
*/
async function deleteUser(numberOfContact, contactId) {
  document.getElementById('big-content').style = '';
  contacts.splice(numberOfContact, 1);
  emptyContent('more-information');
  sortContacts();
  showContactsData();
  organizeContacts();
  await deleteData(contactId, 'contacts');
}

/**
 * Empties the inner HTML content of a specified element.
 *
 * @param {string} content - The ID of the element to be emptied.
 */
function emptyContent(content) {
  document.getElementById(content).innerHTML = '';
}

/**
 * Checks the job title, formats it, and adds a class based on the job.
 * 
 * @param {number} numberOfContact - The index of the contact whose job title is being processed.
 * @returns {string} The formatted job title.
*/
function checkJobAndColor(numberOfContact) {
  let job = contacts[numberOfContact]?.role.toLowerCase().split(' ');
  let jobTitle = '';

  for (let index = 0; index < job.length; index++) {
    jobTitle += job[index];
  }

  addClassToElement('first-letter-' + numberOfContact, jobTitle);
  return jobTitle;
}

/**
 * This is a function for the post data at backend.
 * @param {object} userData - A Object with email and password from user.
 * @param {string} path - path to right data.
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

/**
 * Deletes data from the backend at a specified path and ID.
 *
 * @param {string} id - The ID of the data to be deleted.
 * @param {string} path - The path where the data is stored.
 * @returns {Promise<void>} A promise that resolves when the data is deleted.
 */
async function deleteData(id, path) {
  await fetch(`${BACKEND_URL}/${path}/${id}.json`, {
    method: 'DELETE',
  });
}

/**
 * Updates data at the backend with new data at a specified path and ID.
 *
 * @param {string} id - The ID of the data to be updated.
 * @param {string} path - The path where the data is stored.
 * @param {Object} newData - The new data to be updated.
 * @returns {Promise<void>} A promise that resolves when the data is updated.
 */
async function updateDataAtBackend(id, path, newData) {
  await fetch(`${BACKEND_URL}/${path}/${id}.json`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newData),
  });
}

/**
 * Displays a loading animation and hides it after 3 seconds.
*/
function showLoadAnimation() {
  let loadAnimation = document.getElementById('load-animation');
  loadAnimation.classList.add('load-animation-move');
  setTimeout(() => {
    document.getElementById('load-animation-div').classList.add('d_none');
  }, 3000);
}

/**
 * Sets the current user to 'Guest' and redirects to the summary page.
 */
function guestLogin() {
  localStorage.setItem('currentUser', 'Guest');
  window.location.href = '../pages/summary.html';
}

/**
 * Toggles the visibility of an error message on the signup form.
 * 
 * @param {string} errorMessage - The error message to display.
 * @param {string} method - The method to apply ('add' or 'remove') to show or hide the error message.
 */
function toggleSignupError(errorMessage, method) {
  const errorMessageElement = document.getElementById('auth-error-message');
  errorMessageElement.innerHTML = errorMessage;
  errorMessageElement.classList[method]('show-element');
}

/**
 * Toggles the visibility of a loading spinner element.
 *
 * @param {string} method - The method to be used on the classList ('add', 'remove', or 'toggle').
 */
function toggleLoadingSpinner(method) {
  const loadingSpinner = document.querySelector('.auth-loading-spinner');
  loadingSpinner.classList[method]('show-element');
}

/**
 * Updates a task and syncs it with the backend.
 * 
 * @param {string} taskId - The ID of the task to update.
 * @returns {Promise<void>} A promise that resolves when the task is updated.
 */
async function updateTask(taskId) {
  const newTask = tasks.find((task) => task.id === taskId);
  displayTasks();
  await updateDataAtBackend(taskId, 'tasks', newTask);
}

/**
 * Updates the state of a task and syncs it with the backend.
 * 
 * @param {string} taskId - The ID of the task to update.
 * @param {string} newState - The new state to set for the task.
 */
async function updateTaskState(taskId, newState) {
  const task = tasks.find((task) => task.id === taskId);
  if (task) task.state = newState;
  await updateTask(taskId);
}

/**
 * Loads data from the backend.
 * 
 * @param {string} path - The path to fetch data from.
*/
async function loadFromBackend(path) {
  let response = await fetch(`${BACKEND_URL}/${path}.json`);
  let responeData = await response.json();
  return responeData;
}

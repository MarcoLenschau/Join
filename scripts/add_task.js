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
  mediumPrio();
  await loadContactsList();
  defineDropFunction();
}

/**
 * Loads contacts, sorts them by name, and appends checkboxes to the userlist.
 *
 * @returns {Promise} Resolves when the contacts are loaded and added to the DOM.
 * @throws {Error} If fetching or processing the contacts fails.
 */
async function loadContactsList() {
  contacts = Object.values(await loadFromBackend('contacts'));
  contacts.sort((a, b) => a.name.localeCompare(b.name));  
  contacts.forEach(async(contact, index) => {
    const shortcut = extractTheFirstLetter(contact.name.split(' '));
    const jobTitle = await createJobTitleClass(index);
    document.getElementById('userlist').innerHTML += getCheckBoxList(index, contact, shortcut, jobTitle);
  });
}

/**
 * Creates a job title class string by concatenating the role of a contact.
 *
 * @param {number} index - The index of the contact in the contacts array.
 * @returns {Promise<string>} A string representing the concatenated job title.
 */
async function createJobTitleClass(index) {
  let jobTitle = contacts[index].role.toLocaleLowerCase().split(' ');
  let jobTitleStr = '';
  for (let i = 0; i < jobTitle.length; i++) {
    jobTitleStr += jobTitle[i];
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
 * Creates a new task, posts it to the backend, and updates the task list.
 *
 * @returns {Promise<void>} Resolves when the task is created and displayed.
 */
async function createNewTask() {
  const taskObj = defindeUserObj();
  if (!isValidTaskInputs(taskObj.assignedTo)) return;
  const { name } = await postDataAtBackend(taskObj, 'tasks');
  tasks = [...tasks, { ...taskObj, id: name }];
  displayTasks();
  handleTaskCreatedMessage();
  allFiles = [];
}

/**
 * Handles the display of a task created message.
 * 
 * This function shows a message indicating that a task has been created, resets task-related values, 
 * toggles the check menu and empty message, and then hides the message after 1.5 seconds.
 */
function handleTaskCreatedMessage() {
  const taskCreatedMessage = document.querySelector('.task-created-message');
  taskCreatedMessage.classList.add('show-task-created-message');
  resetTaskValues();
  toggleCheckMenu();
  toggleEmptyMessage();
  setTimeout(() => {
    taskCreatedMessage.classList.remove('show-task-created-message');
  }, 1500);
}

/**
 * Creates a user object representing a task with various properties.
 * 
 * @param {string} [state='todo'] - The current state of the task (e.g., 'todo', 'in progress', etc.).
 * @returns {Object} - The user object containing details about the task.
 * @property {string} title - The title of the task.
 * @property {string} date - The due date of the task in YYYY-MM-DD format.
 * @property {string} prio - The priority level of the task (e.g., 'urgent', 'medium', 'low').
 * @property {string} category - The category associated with the task.
 * @property {string} description - A detailed description of the task.
 * @property {Array<Object>} assignedTo - An array of assigned user objects extracted from the UI.
 * @property {string} state - The current state of the task (default is 'todo').
 * @property {Array<Object>} subTasks - An array of subtask objects associated with the task.
 */
function defindeUserObj(state) {
  let title = document.getElementById('title').value;
  let date = document.getElementById('date').value;
  let prio = document.getElementsByClassName('active-prio')[0].dataset.prio;
  let category = document.getElementById('category').value;
  let description = document.getElementById('description').value;
  let assignedTo = assignedToDataExtract();
  let subTasks = getSubtasks();
  let files = allFiles;
  return { title, date, prio, category, description, assignedTo, state: state || 'todo', subTasks, files };
}

// /**
//  * Displays a message indicating a task has been created and resets relevant task-related UI elements.
//  *
//  * @returns {void} This function does not return any value.
//  */
// function handleTaskCreatedMessage() {
//   const taskCreatedMessage = document.querySelector('.task-created-message');
//   taskCreatedMessage.classList.add('show-task-created-message');
//   resetTaskValues();
//   toggleEmptyMessage();
//   setTimeout(() => {
//     taskCreatedMessage.classList.remove('show-task-created-message');
//   }, 1500);
// }

/**
 * Extracts the list of users assigned to a task by checking which checkboxes are selected.
 *
 * @returns {Array<{name: string, role: string}>} An array of objects representing the selected users, each containing `name` and `role`.
 */
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

/**
 * Retrieves all subtasks from the DOM and returns them as an array of objects.
 * Each subtask object contains a `description` and a `done` status (set to `false` initially).
 *
 * @returns {Array<{description: string, done: boolean}>} An array of subtasks, each represented as an object with `description` and `done` properties.
 */
function getSubtasks() {
  const subtaskItems = Array.from(document.querySelector('.subtask-list').children);
  return subtaskItems.map((subtaskItem) => {
    const description = subtaskItem.querySelector('input').value;
    return { description, done: false };
  });
}

/**
 * Validates the input fields for creating a task. Checks if the title, date, category, 
 * and assigned users are provided.
 *
 * @param {Array} assignedTo - The list of users assigned to the task.
 * @returns {boolean} Returns `true` if all required fields are valid, otherwise `false`.
 */
function isValidTaskInputs(assignedTo) {
  const tittle = document.getElementById('title').value;
  const date = document.getElementById('date').value;
  const category = document.getElementById('category').value;
  if (tittle && date && category && assignedTo.length) return true;
  toggleInvalidFields(assignedTo);
  return false;
}

/**
 * Toggles the "invalid-input" class on the user list container if no users are assigned to the task.
 * It also adds an event listener to remove the class when the container is clicked.
 * 
 * @param {Array} assignedTo - The list of users assigned to the task.
 */
function toggleInvalidFields(assignedTo) {
  const userListCtn = document.querySelector('.userlist-ctn');
  if (!assignedTo.length) {
    userListCtn.classList.add('invalid-input');
    userListCtn.addEventListener('click', () => userListCtn.classList.remove('invalid-input'));
  }
  addInvalidInput();
}

/**
 * Adds the "invalid-input" class to the title, date, and category input fields if they are empty.
 * Removes the class when the input field is focused.
 *
 * @returns {void} This function does not return any value.
 */
function addInvalidInput() {
  const titleInput = document.getElementById('title');
  const dateInput = document.getElementById('date');
  const categoryInput = document.getElementById('category');
  [titleInput, dateInput, categoryInput].forEach((field) => {
    if (!field.value) {
      field.classList.add('invalid-input');
      field.addEventListener('focus', () => field.classList.remove('invalid-input'));
    }
  });
}

/**
 * 
 * Updates the list of assigned users based on the checked checkboxes in the user list.
 *
*/
function updateAssignedUsers() {
  const labels = Array.from(document.getElementById('userlist').children);
  const assignedList = document.querySelector('.assigned-list');
  assignedList.innerHTML = '';
  labels.forEach((label) => {
    const isChecked = label.querySelector('input').checked;
    if (isChecked) {
      createAssignedUser(assignedList, label);
    }
  });
}

/**
 * Creates a new list item representing an assigned user and prepends it to the assigned users list.
 * The function clones either the user's profile image or initials from the provided label element.
 *
 * @param {HTMLElement} assignedList - The list element to which the assigned user will be prepended.
 * @param {HTMLElement} label - The label element containing the user's profile image or initials.
 */
function createAssignedUser(assignedList, label) {
  const profileCircle = document.createElement('li');
  const imgContent = label.querySelector('div img');
  const spanContent = label.querySelector('div span');
  if (imgContent != null) {
    imgContent.classList.add('assigned-user-img');
    profileCircle.appendChild(imgContent.cloneNode(true));
  } else {
    profileCircle.appendChild(spanContent.cloneNode(true));
  }
  assignedList.prepend(profileCircle);
}

/**
 * Resets the task input fields, clears the subtask list, and sets default values for task properties.
 * It also unchecks all checkboxes in the user list and resets the task priority.
 *
 */
function resetTaskValues() {
  resetValue();
  checkThePrioOfTask(2);
  removeInvalidClass();
  Array.from(document.getElementById('userlist').children).forEach((label) => {
    const checbox = label.querySelector('input');
    label.classList.remove("selected-contact");
    checbox.checked = false;
  });
}

/**
 * Clears all form fields and resets UI elements related to task creation.
 *
 * This function resets the values of input fields for title, date, category,
 * and description. It also clears the subtask input, assigned users list,
 * the subtask list, and the image container. Additionally, it hides the user list.
 */
function resetValue() {
  document.getElementById('title').value = '';
  document.getElementById('date').value = '';
  document.getElementById('category').value = '';
  document.getElementById('description').value = '';
  document.querySelector('.subTask-input').value = '';
  document.querySelector('.subtask-list').innerHTML = '';
  document.querySelector('.assigned-list').innerHTML = "";
  document.getElementById('userlist').classList.add('d_none');
  document.getElementById('image-container').innerHTML = '';
}

/**
 * Updates the fields of a specific task and saves the changes.
 * 
 * @param {string} taskId - The ID of the task to be updated.
*/
async function updateTaskFields(taskId) {
  const state = tasks.find((task) => task.id === taskId).state;
  let newTask = { ...defindeUserObj(state), id: taskId };
  const modal = document.querySelector('.add-task-modal');
  if (!isValidTaskInputs(newTask.assignedTo)) return;
  const newTasks = tasks.map((task) => (task.id === taskId ? newTask : task));
  tasks = newTasks;
  displayTasks();
  modal.classList.remove('show-modal');
  await updateDataAtBackend(taskId, 'tasks', newTask);
}

/**
 * Toggles the "selected-contact" class on a contact element when clicked,
 * and updates the list of assigned users.
 *
 * @param {Event} event - The event object triggered by the user's click on a contact.
 */
function toggleAddTaskContact(event) {
  const contactElement = event.currentTarget;
  const contactsList = Array.from(document.getElementById('userlist').children);
  contactsList.forEach((contact) => {
    const isChecked = contact.querySelector('input').checked;
    if (isChecked) return;
    contactElement.classList.toggle('selected-contact');
  });
  updateAssignedUsers();
}

/**
 * Removes the 'invalid-input' class from all task input fields in the add-task modal.
 */
function removeInvalidClass(){
  const addTaskModal = document.querySelector("[data-modal]");
  const inputFields =  Array.from(addTaskModal.querySelectorAll(".task-input-field"));
  inputFields.forEach(input => input.classList.remove("invalid-input"));
}

/**
 * Updates the status of subtasks based on checkbox selection and syncs with the backend.
 * 
 * @param {Event} event - The event triggered by the checkbox interaction.
 * @param {string} taskId - The ID of the task whose subtasks are being updated.
 */
async function updateCheckbox(event, taskId) {
  const ulList = Array.from(event.target.closest('ul').children);
  const task = tasks.find((task) => task.id === taskId);
  ulList.forEach((listItem, index) => {
    const checkbox = listItem.querySelector('input');
    task.subTasks[index].done = checkbox.checked;
  });
  await updateTask(taskId);
}

/**
 * Closes the user assignment list if clicked outside the list container.
 * 
 * @param {Event} event - The click event.
 */
function closeAssignList(event){
  const userListCtn = event.target?.closest(".userlist-ctn");

  if (userListCtn) return;

  document.querySelector('.assigned-list')?.classList.remove('d_none');
  document.getElementById('userlist')?.classList.add('d_none');
}

/**
 * Toggles the visibility of the user list and rotates the dropdown arrow.
*/
function toggleCheckMenu() {
  const arrowDropDown = document.querySelector('.arrow-drop-down');
  arrowDropDown.classList.toggle('rotate-180-deg');
  document.querySelector('.assigned-list').classList.toggle('d_none');
  document.getElementById('userlist').classList.toggle('d_none');
}

/**
 * Sets up a file input listener to allow users to upload images.
 * Converts files to base64 and shows them in the image container.
 */
function fileDefine() {
  if (filepickerDefine) {
    const filepicker = document.getElementById("filepicker");
    filepicker.addEventListener("change", () => {
      filepickerDefine = false;
      addFiles(filepicker.files);
    });
  }
}

/**
 * Processes an array-like list of files by checking their format and uniqueness,
 * then creates an image for each valid and new file. Shows an error message for invalid files.
 *
 * @param {FileList|Array<File>} files - The list of files to be processed.
 */
function addFiles(files) {
  files = Array.from(files);
  if (files.length > 0) {
    files.forEach(async file => {
      if (checkFormatOfFile(file)) {
        checkIfFileNew(file) ? await imageCreate(file) : "";
      } else {
        showErrorMessage();
      }
    });
  }
}

/**
 * Checks if the given file is new by comparing its name with the filenames in the allFiles array.
 *
 * @param {File} file - The file object to check.
 * @returns {boolean} Returns true if the file is new (not found in allFiles), otherwise false.
 */
function checkIfFileNew(file) {
  let error = false;
  allFiles.forEach((allFile) => {
      allFile.filename === file.name ? error = true : "";
  });
  return !error;
}

/**
 * Converts an image file to base64 and displays it in the image container.
 * Also adds the file info to the global file list.
 *
 * @param {File} file - The image file selected by the user.
 */
async function imageCreate(file) {
  const imageContainer = document.getElementById("image-container");
  const base64 = await compressImage(file);
  mobileDevices(imageContainer) ? imageContainer.classList.add("overflow") : imageContainer.classList.remove("overflow");
  createImageContainer(file, base64, imageContainer);
  addScrollbar(imageContainer);
  allFiles.push({
    filename: file.name,
    type: file.type,
    size: file.size,
    base64: base64
  });
}

/**
 * Determines if the given image container is considered a mobile device based on its width.
 *
 * @param {HTMLElement} imageContainer - The container element whose width is to be checked.
 * @returns {boolean} Returns true if the container's width is greater than 700 pixels, indicating a non-mobile device; otherwise, false.
 */
function mobileDevices(imageContainer) {
  return imageContainer.clientWidth > 700;
}

/**
 * Creates an image container element with an image and filename label,
 * and appends it to the global `imageContainer` element.
 * The created image will have an `onclick` handler that calls `bigPicture("image-container")`.
 */
function createImageContainer(file, base64, imageContainer) {
  const container = document.createElement("div");
  const div = document.createElement("div");
  const span = document.createElement("span");
  const img = createImage(base64, file);
  span.innerText = file.name;
  container.appendChild(img);
  container.appendChild(div);
  imageContainer.appendChild(container);
  div.appendChild(span);
  div.classList.add("w-100");
}

/**
 * Creates an image element from a base64 string and a file object.
 *
 * @param {string} base64 - The base64-encoded image data to use as the image source.
 * @param {File} file - The file object representing the image, used to set the image's id.
 * @returns {HTMLImageElement} The created image element with the specified source and id.
 */
function createImage(base64, file) {
  const img = document.createElement("img");
  img.src = base64;
  img.id = file.name;
  img.onclick = () => bigPicture("image-container");
  return img;
}

/**
 * Adds or removes a scrollbar class to the image container based on the number of child elements.
 *
 * If the container has more than 5 child elements, a scrollbar-related class (`image-overflow`)
 * is added to enable scrolling. Otherwise, the class is removed.
 *
 * @param {HTMLElement} imageContainer - The container element holding the image elements.
 */
function addScrollbar(imageContainer) {
  if (imageContainer.children.length > 2) {
    imageContainer.classList.add("image-overflow");
  } else {
    imageContainer.classList.remove("image-overflow");
  } 
}

/**
 * Deletes files from the image container.
 *
 * @param {string} whichFile - If set to 'all', all images will be removed.
 */
function deleteFiles(whichFile) {
  const imageContainer = document.getElementById('image-container');
  if (whichFile === 'all') {
    allFiles = [];
    imageContainer.innerHTML = '';
    document.getElementById("filepicker").value = "";
  }
}
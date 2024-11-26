/**
 * Loads and renders the necessary components for the board, such as the sidebar, header, modal, and task list.
 * It also indicates which board section is active.
 *
 * @returns {Promise<void>} This function returns a promise that resolves once all components are loaded and rendered.
 */
async function loadBoard() {
  loadSidebar();
  loadHeader();
  loadModal();
  showWhichSiteIsAktivOfBoard();
  renderTasks();
}

/**
 * Adds the "active" class to the board element and the "no-active" class to all other sections.
 * This function highlights the active site on the board.
 * 
 * @returns {void} This function does not return any value.
 */
function showWhichSiteIsAktivOfBoard() {
  addClassToElement('summary', 'no-active');
  addClassToElement('task', 'no-active');
  addClassToElement('board', 'active');
  addClassToElement('contacts', 'no-active');
}

/**
 * Asynchronously fetches and renders tasks from the backend.
 *
 * This function loads tasks from the backend, transforms the response data
 * into an array of task objects, and displays them. It also toggles the
 * empty message based on the presence of tasks.
 *
 * @async
 * @function
 */
async function renderTasks() {
  let responeData = await loadFromBackend('tasks');

  if (responeData) {
    tasks = Object.entries(responeData).map(([id, task]) => {
      return { id, ...task };
    });
    displayTasks();
  }

  toggleEmptyMessage();
}

/**
 * Filters tasks based on the search query entered in the search input field.
 * Displays the filtered tasks or all tasks if the search query is empty.
 *
 * @returns {void} This function does not return any value.
 */
function filterTasks() {
  const findTaskInput = document.querySelector('.board-search-input');
  const query = findTaskInput.value.toLowerCase();

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(query),
  );

  displayTasks(query === '' ? tasks : filteredTasks);
  toggleEmptyMessage();
}

/**
 * Displays tasks in the respective task lists based on their state.
 * Clears the previous tasks and renders the filtered or all tasks.
 *
 * @param {Array} filteredTasks - The list of tasks to be displayed, which may be filtered tasks or all tasks.
 * @returns {void} This function does not return any value.
 */
function displayTasks(filteredTasks) {
  const listElements = document.querySelectorAll('.board-content ul');
  const assignedList = document.querySelector(".assigned-list")

 if(assignedList) assignedList.innerHTML = ""

  listElements.forEach((list) => {
    Array.from(list.children).forEach((child) => {
      if (!child.className.includes('empty-message')) child.remove();
    });
  });

  const tasksData = filteredTasks || tasks;

  tasksData.forEach((task) => {
    const listElement = document.getElementById(task.state);
    const doneSubTasksLength = task.subTasks?.filter(
      (subTask) => subTask.done,
    )?.length;

    if (listElement)
      listElement.innerHTML += getTaskTemplate(task, doneSubTasksLength);
  });
}

/**
 * Closes the task's state popup if the event target is not inside the popup.
 * 
*/
function closeStatePopup(event){
  const statePopup = event.target.closest(".drag-task-popup")
  if(statePopup)return
  document.querySelector(".drag-task-popup").classList.remove("show-modal")
}

/**
 * Handles the drag start event by setting the drag element and hiding overflow on the main app container.
 * 
 * @param {DragEvent} event - The drag event triggered when the user starts dragging an element.
 * @returns {void} This function does not return any value.
 */
function handleDragStart(event) {
  dragElement = event.currentTarget;
  draggableArea = null;
  document.querySelector('.app-main').classList.add('hide-overflow');
}

/**
 * Handles the drag over event to allow the dragged element to be dropped on the target.
 * It adds a specific style to the list element being hovered.
 * 
 * @param {DragEvent} event - The drag event triggered when the dragged element moves over a potential drop target.
 * @returns {void} This function does not return any value.
 */
function handleDragOver(event) {
  event.preventDefault();
  const listElement = event.target.closest('ul');
  listElement.classList.add('drag-area-style');
}

/**
 * Handles the drag leave event when the dragged element leaves a potential drop target.
 * It removes the style applied to the list element.
 * 
 * @param {DragEvent} event - The drag event triggered when the dragged element leaves the drop target.
 * @returns {void} This function does not return any value.
 */
function handleDragLeave(event) {
  const listElement = event.target.closest('ul');
  listElement.classList.remove('drag-area-style');
}

/**
 * Handles the selection of a task state, adds the task to the board list, and closes the popup.
 * 
 * @param {string} state - The ID of the selected state element.
*/
function handleStateSelect(state){
  const stateElement = document.getElementById(state)
  draggableArea = stateElement;
  addElementToBoardList();
  document.querySelector(".drag-task-popup").classList.remove("show-modal");
}

/**
 * Handles adding a draggable element to a new list on the board when it is dropped.
 * It updates the task state and ensures the UI reflects the change.
 * 
 * @param {Event} event - The event triggered when a draggable element is dropped onto a target list.
 * @returns {Promise<void>} This function returns a promise that resolves once the task state is updated.
 */
async function addElementToBoardList(event) {
  const listElement = draggableArea || event.target.closest('ul');
  const taskElement = event?.target.closest("li")
  const isTouchEvent = taskElement && event?.type === "touchend";
  const newState = listElement?.id;

  if (!dragElement || !listElement || isTouchEvent ) return;

  listElement.classList.remove('drag-area-style');
  document.querySelector('.app-main').classList.remove('hide-overflow');
  listElement.prepend(dragElement);
  toggleEmptyMessage();
  await updateTaskState(dragElement.dataset.id, newState);
}

/**
 * Toggles the visibility of the empty message in the task lists.
 * If a list has no items, it shows the empty message; otherwise, it hides it.
 * 
 * @returns {void} This function does not return any value.
 */
function toggleEmptyMessage() {
  const boardContent = document.querySelector('.board-content');
  const listElements = boardContent?.querySelectorAll('ul');
  if (listElements) {
    listElements.forEach((element) => {
      const emptyMessageElement = element.querySelector('.empty-message');

      if (element.children.length <= 1)
        emptyMessageElement.classList.add('d_flex');
      else emptyMessageElement.classList.remove('d_flex');
    });
  }
}

/**
 * Toggles the visibility of the task's state popup and sets the dragged task element.
 * 
*/
function toggleStatePopup(event){
  const taskElement = event?.target.closest("li");
  const closeIcon = event?.target.closest(".state-close-icon")

  if(!taskElement && !closeIcon)return
  dragElement = taskElement
  document.querySelector(".drag-task-popup").classList.toggle("show-modal")
}
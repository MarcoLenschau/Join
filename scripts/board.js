let dragElement = null;
let draggableArea = null;

async function loadBoard() {
  loadSidebar();
  loadHeader();
  loadModal();
  showWhichSiteIsAktivOfBoard();
  renderTasks();
}

function showWhichSiteIsAktivOfBoard() {
  addClassToElement('summary', 'no-active');
  addClassToElement('task', 'no-active');
  addClassToElement('board', 'active');
  addClassToElement('contacts', 'no-active');
}

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

function filterTasks() {
  const findTaskInput = document.querySelector('.board-search-input');
  const query = findTaskInput.value.toLowerCase();

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(query),
  );

  displayTasks(query === '' ? tasks : filteredTasks);
  toggleEmptyMessage();
}

function displayTasks(filteredTasks) {
  const listElements = document.querySelectorAll('.board-content ul');

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

function handleTouchMove(event) {
  const touch = event.touches[0];
  const ulElement = document.elementFromPoint(touch.clientX, touch.clientY);
  const isDraggableArea = ulElement.dataset.draggableArea;

  if (isDraggableArea) draggableArea = ulElement;
}

function handleDragStart(event) {
  dragElement = event.currentTarget;
  document.querySelector('.app-main').classList.add('hide-overflow');
}

function handleDragOver(event) {
  event.preventDefault();

  const listElement = event.target.closest('ul');
  listElement.classList.add('drag-area-style');
}

function handleDragLeave(event) {
  const listElement = event.target.closest('ul');
  listElement.classList.remove('drag-area-style');
}

async function addElementToBoardList(event) {
  const listElement = draggableArea || event.target.closest('ul');
  const newState = listElement?.id;

  if (!listElement) return;

  listElement.classList.remove('drag-area-style');
  document.querySelector('.app-main').classList.remove('hide-overflow');
  listElement.prepend(dragElement);
  toggleEmptyMessage();
  await updateTaskState(dragElement.dataset.id, newState);
}

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

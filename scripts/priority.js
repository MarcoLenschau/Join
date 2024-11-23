/**
 * Sets the task priority based on the given number.
 * Calls different functions for urgent, medium, or low priority.
 * 
 * @param {number} num - The priority number (1 for urgent, 2 for medium, 3 for low).
 */
function checkThePrioOfTask(num) {
  if (num === 1) {
    urgentPrio();
  } else if (num === 2) {
    mediumPrio();
  } else if (num === 3) {
    lowPrio();
  }
}

/**
 * Updates the task priority elements by marking the active priority
 * and updating the icons for active and inactive priorities.
 * 
 * @param {string} activePriority - The ID of the active priority element.
 * @param {string} activeIconSuffix - The suffix for the active priority icon.
 * @param {Array<string>} inactivePriorities - An array of IDs for the inactive priority elements.
 */
function updatePriorityElements(
  activePriority,
  activeIconSuffix,
  inactivePriorities,
) {
  document.getElementById(activePriority).classList.add('active-prio');
  inactivePriorities.forEach((priority) => {
    document.getElementById(priority).classList.remove('active-prio');
  });
  updateIcons(activePriority, activeIconSuffix);
  inactivePriorities.forEach((priority) => {
    updateIcons(priority, priority);
  });
}

/**
 * Updates the icon source for the given priority elements.
 * 
 * @param {string} priority - The priority element ID (e.g., 'urgent', 'medium', 'low').
 * @param {string} iconSuffix - The suffix for the icon filename (e.g., 'urgent-white', 'medium-white').
 */
function updateIcons(priority, iconSuffix) {
  document.getElementById(`${priority}0`).src =
    `../assets/img/${iconSuffix}.svg`;
  document.getElementById(`${priority}1`).src =
    `../assets/img/${iconSuffix}.svg`;
}


/**
 * Changes the background color of a priority element.
 * 
 * @param {string} priority - The priority element ID to change color.
 * @param {string} color - The new background color (e.g., '#FF3D00').
 */
function changeTheColor(priority, color) {
  document.getElementById(priority).style.backgroundColor = color;
}


/**
 * Changes the background color for the active and inactive priority elements.
 * 
 * @param {string} active - The ID of the active priority element.
 * @param {string} inactive1 - The ID of the first inactive priority element.
 * @param {string} inactive2 - The ID of the second inactive priority element.
 * @param {string} activeColor - The background color for the active priority.
 * @param {string} inactiveColor - The background color for the inactive priorities.
 */
function changePriorityColors(...options) {
  const [active, inactive1, inactive2, activeColor, inactiveColor] = options;

  changeTheColor(active, activeColor);
  changeTheColor(inactive1, inactiveColor);
  changeTheColor(inactive2, inactiveColor);
}

/**
 * Sets the priority to 'urgent', updates icons and background colors.
 * 
 */
function urgentPrio() {
  updatePriorityElements('urgent', 'urgent-white', ['medium', 'low']);
  changePriorityColors('urgent', 'medium', 'low', '#FF3D00', 'white');
}

/**
 * Sets the priority to 'medium', updates icons and background colors.
 * 
 */
function mediumPrio() {
  updatePriorityElements('medium', 'medium-white', ['urgent', 'low']);
  changePriorityColors('medium', 'urgent', 'low', '#FFA800', 'white');
}


/**
 * Sets the priority to 'low', updates icons and background colors.
 * 
 */
function lowPrio() {
  updatePriorityElements('low', 'low-white', ['urgent', 'medium']);
  changePriorityColors('low', 'urgent', 'medium', '#7AE229', 'white');
}

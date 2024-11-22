function checkThePrioOfTask(num) {
  if (num === 1) {
    urgentPrio();
  } else if (num === 2) {
    mediumPrio();
  } else if (num === 3) {
    lowPrio();
  }
}

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

function updateIcons(priority, iconSuffix) {
  document.getElementById(`${priority}0`).src =
    `../assets/img/${iconSuffix}.svg`;
  document.getElementById(`${priority}1`).src =
    `../assets/img/${iconSuffix}.svg`;
}

function changeTheColor(priority, color) {
  document.getElementById(priority).style.backgroundColor = color;
}

function changePriorityColors(...options) {
  const [active, inactive1, inactive2, activeColor, inactiveColor] = options;

  changeTheColor(active, activeColor);
  changeTheColor(inactive1, inactiveColor);
  changeTheColor(inactive2, inactiveColor);
}

function urgentPrio() {
  updatePriorityElements('urgent', 'urgent-white', ['medium', 'low']);
  changePriorityColors('urgent', 'medium', 'low', '#FF3D00', 'white');
}

function mediumPrio() {
  updatePriorityElements('medium', 'medium-white', ['urgent', 'low']);
  changePriorityColors('medium', 'urgent', 'low', '#FFA800', 'white');
}

function lowPrio() {
  updatePriorityElements('low', 'low-white', ['urgent', 'medium']);
  changePriorityColors('low', 'urgent', 'medium', '#7AE229', 'white');
}

function firstLetter(string) {
  if (string) return string[0];
}

function firstLetterBig(str) {
  if (str) return str[0].toUpperCase();
}

function getRoleString(role) {
  return role.toLowerCase().split(' ').join('');
}

function getAssignedToString(assignedElements) {
  return `${assignedElements?.slice(0, 4).join('')}+${assignedElements.length - 4}`;
}

function getInitialsName(name) {
  return `${name?.charAt(0)}${name?.split(' ')[1]?.charAt(0) || ''}`;
}

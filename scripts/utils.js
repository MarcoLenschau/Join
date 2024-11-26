/**
 * Returns the first letter of a given string.
 *
 * @param {string} string - The input string.
 * @returns {string|undefined} The first letter of the string, or undefined if the string is empty or not provided.
 */
function firstLetter(string) {
  if (string) return string[0];
}

/**
 * Returns the first letter of a given string, converted to uppercase.
 *
 * @param {string} str - The input string.
 * @returns {string|undefined} The first uppercase letter of the string, or undefined if the string is empty or not provided.
 */
function firstLetterBig(str) {
  if (str) return str[0].toUpperCase();
}

/**
 * Converts a role string to lowercase and removes all spaces.
 *
 * @param {string} role - The role string to be transformed.
 * @returns {string} The transformed role string.
 */
function getRoleString(role) {
  return role.toLowerCase().split(' ').join('');
}

/**
 * Creates a string representation of the assigned elements, showing the first four elements concatenated and the count of remaining elements.
 *
 * @param {Array} assignedElements - The array of assigned elements.
 * @returns {string} The string representation of the first four elements followed by the count of remaining elements.
 */
function getAssignedToString(assignedElements) {
  return `${assignedElements?.slice(0, 4).join('')}+${assignedElements.length - 4}`;
}

/**
 * Generates initials from a given name. Takes the first character of the first name and the first character of the last name.
 *
 * @param {string} name - The full name.
 * @returns {string} The initials derived from the name.
 */
function getInitialsName(name) {
  return `${name?.charAt(0)}${name?.split(' ')[1]?.charAt(0) || ''}`;
}
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

function checkFormatOfFile(file) {
  const fileExtension = extractFileExtension(file.name).toLocaleLowerCase();
  if (fileExtension === 'svg' || fileExtension === 'jpeg' || fileExtension === 'png') {
    return true;
  } else {
    return false;
  }
}

function extractFileExtension(file) {
  let filename = file.split('.');
  return filename[filename.length - 1];
}

function compressImage(file, maxWidth = 800, maxHeight = 800, quality = 0.8) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                let width = img.width;
                let height = img.height;
                if (width > maxWidth || height > maxHeight) {
                    if (width > height) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    } else {
                        width = (width * maxHeight) / height;
                        height = maxHeight;
                    }
                }
                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);
                const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
                resolve(compressedBase64);
            };
            img.onerror = () => reject('Fehler beim Laden des Bildes.');
            img.src = event.target.result;
        };
        reader.onerror = () => reject('Fehler beim Lesen der Datei.');
        reader.readAsDataURL(file);
   });
}
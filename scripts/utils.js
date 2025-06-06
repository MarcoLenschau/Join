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

/**
 * Checks if the file format is one of the allowed image types: svg, jpeg, or png.
 *
 * @param {File} file - The file to check.
 * @returns {boolean} Returns true if the file is svg, jpeg, or png; otherwise false.
 */
function checkFormatOfFile(file) {
  const fileExtension = extractFileExtension(file.name).toLocaleLowerCase();
  if (fileExtension === 'svg' || fileExtension === 'jpeg' || fileExtension === 'png') {
    return true;
  } else {
    return false;
  }
}

/**
 * Extracts the file extension from a filename string.
 *
 * @param {string} file - The filename as a string.
 * @returns {string} The file extension (text after the last dot).
 */
function extractFileExtension(file) {
  let filename = file.split('.');
  return filename[filename.length - 1];
}

/**
 * Compresses an image file by resizing it to fit within max width and height,
 * then converts it to a base64 string.
 *
 * @param {File} file - The image file to compress.
 * @param {number} [maxWidth=800] - The maximum width allowed for the compressed image.
 * @param {number} [maxHeight=800] - The maximum height allowed for the compressed image.
 * @param {number} [quality=0.8] - The quality of the compression (from 0 to 1).
 * @returns {Promise<string>} A promise that resolves to a base64 string of the compressed image.
 */
function compressImage(file, maxWidth = 800, maxHeight = 800, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      let options = { maxWidth, maxHeight, quality, resolve, event };
      imageLoad(options);
    };
    reader.onerror = () => reject('Error reading file.');
    reader.readAsDataURL(file);
  });
}

/**
 * Creates a new image, loads it, and passes it to imageLoad() for processing.
 *
 * @param {number} maxWidth - Maximum width for the image.
 * @param {number} maxHeight - Maximum height for the image.
 * @param {Function} resolve - Function to call when image processing is complete.
 * @param {ProgressEvent<FileReader>} event - The load event from FileReader containing the base64 image data.
 * @param {number} quality - Compression quality from 0 to 1.
 */
function imageLoad({maxWidth, maxHeight, quality, resolve, event}){
  const img = new Image();
  img.onload = () => {
    const imageLoadOptions = { maxWidth, maxHeight, quality, img };
    compressImageCreate(imageLoadOptions, resolve);
  };
  img.onerror = () => reject('Error loading image.');
  img.src = event.target.result;
}

/**
 * Adjusts the width and height of an image while maintaining aspect ratio.
 *
 * @param {number} maxWidth - The maximum allowed width.
 * @param {number} maxHeight - The maximum allowed height.
 * @param {number} width - Original width of the image.
 * @param {number} height - Original height of the image.
 * @returns {[number, number]} A tuple containing the resized width and height.
 */
function checkSize(maxWidth, maxHeight, width, height) {
  if (width > maxWidth || height > maxHeight) {
    if (width > height) {
        height = (height * maxWidth) / width;
        width = maxWidth;
    } else {
        width = (width * maxHeight) / height;
        height = maxHeight;
    }
  }
  return [width, height];
}

/**
 * Draws the image on a canvas and compresses it to a base64 string.
 *
 * @param {Object} options - Object with image settings.
 * @param {number} options.maxWidth - Maximum image width.
 * @param {number} options.maxHeight - Maximum image height.
 * @param {number} options.quality - Compression quality from 0 to 1.
 * @param {HTMLImageElement} options.img - The image to process.
 * @param {Function} resolve - Function to call with the base64 result.
 */
function compressImageCreate({ maxWidth, maxHeight, quality, img}, resolve) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  let width = img.width;
  let height = img.height;
  [width, height] = checkSize(maxWidth, maxHeight, width, height);
  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(img, 0, 0, width, height);
  const compressedBase64 = canvas.toDataURL('image/svg', quality);
  resolve(compressedBase64);
}
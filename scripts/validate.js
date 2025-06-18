/**
 * Attaches an input event listener to the specified input element 
 * and triggers field validation if not already attached.
 *
 * @param {boolean} valideEvent - Indicates if the event listener has already been attached.
 * @param {string} element - The ID of the input element to validate.
 */
function validate(valideEvent, element) {
  if (!valideEvent) {
    valideEvent = true;
    const inputField = document.getElementById(element);
    inputField.addEventListener('input', (event) => {
      whichValidateField(event, element);
    });
  }
}

/**
 * Determines which field validation function to use based on the element ID.
 *
 * @param {InputEvent} event - The input event triggered by the user.
 * @param {string} element - The ID of the element to validate.
 */
function whichValidateField(event, element) {
  if (element === "name") {
    isValidUser(event.target.value) ? errorValidate("remove", element) : errorValidate("add", element);
  } else if (element === "password") {
    isValidPassword(event.target.value) ? errorValidate("remove", element) : errorValidate("add", element);
  } else if (element === "passwordConfirm") {
    isValidPasswordConfirm(event.target.value) ? errorValidate("remove", element) : errorValidate("add", element);
  } else if (element === "email") {
    isValidEmail(event.target.value) ? errorValidate("remove", element) : errorValidate("add", element);
  }
}

/**
 * Adds or removes the error styling class from the input element.
 *
 * @param {"add"|"remove"} method - Whether to add or remove the error class.
 * @param {string} element - The ID of the input element to modify.
 */
function errorValidate(method, element) {
  const inputField = document.getElementById(element);
  method === "add"
    ? inputField.classList.add("error-validate")
    : inputField.classList.remove("error-validate");
}

/**
 * Validates if the email is in a proper format.
 *
 * @param {string} email - The email string to validate.
 * @returns {boolean} True if valid email format, otherwise false.
 */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Validates if the password meets the minimum length requirement.
 *
 * @param {string} password - The password string to validate.
 * @returns {boolean} True if the password length is greater than 5.
 */
function isValidPassword(password) {
  return password.length > 5;
}

/**
 * Validates if the password confirmation matches the original password.
 *
 * @param {string} password - The confirmation password input.
 * @returns {boolean} True if both passwords match and length > 5.
 */
function isValidPasswordConfirm(password) {
  const inputField = document.getElementById("password");
  return password.length > 5 && password === inputField.value;
}

/**
 * Validates if the user input meets the minimum length requirement.
 *
 * @param {string} user - The username to validate.
 * @returns {boolean} True if the username length is greater than 1.
 */
function isValidUser(user) {
  return user.length > 1;
}
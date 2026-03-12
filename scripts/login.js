const loader = document.getElementById('loader');
const loginLogo = document.getElementById('loginLogo');

/**
 * Loads and displays the loading screen based on the user's device screen width (mobile or desktop).
 * 
 * If the screen width is less than or equal to 600px, it displays a mobile loading screen.
 * Otherwise, it shows a desktop loading screen. It also starts the loading animation.
 * 
 * @returns {void} This function does not return any value.
 */
function Loadingscreen() {
  if (window.innerWidth <= 600) {
    loader.innerHTML = getLoadingscreenMobile();
  } else {
    loader.innerHTML = getLoadingscreenDesktop();
  }
}

/**
 * Handles user login by validating email and password.
 * Redirects to the summary page on successful login.
 * 
 * @param {Event} event - The form submit event.
 */
async function handleLogin(event) {
  event.preventDefault();
  toggleLoadingSpinner('add');
  toggleSignupError('_', 'remove');

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  !email && !password ? toggleSignupError('Please enter a email and password', 'add', validateEmail(false), validatePassword(false)):
  !email ? toggleSignupError('Please enter a email', 'add', validateEmail(false)): 
  !password ? toggleSignupError('Please enter a password', 'add', validatePassword(false)) : checkIfValidUser(email, password);
}

/**
 * Asynchronously verifies whether a user with the given email exists and, if so,
 * checks their credentials against the provided password.
 *
 * @async
 * @param {string} email - The email address to look up among stored users.
 * @param {string} password - The plaintext password to validate for the found user.
 * @returns {Promise<void>} Resolves when processing is complete. Rejects if loading users fails.
 */
async function checkIfValidUser(email, password) {
  const allUsers = await loadFromBackend('users');
  if (isNull(allUsers)) {
    toggleSignupError('Not user with this Email', 'add');
  } else {
    const users = Object.values(allUsers);
    const user = users.find((user) => user.email === email);
    checkCredentials(user, password);
  }
}

/**
 * Determine whether a value is strictly null.
 *
 * @param {*} value - The value to check.
 * @returns {boolean} True if the value is strictly equal to null; otherwise false.
 */
function isNull(value) {
  return value === null;
}

/**
 * Checks if the user's email and password are correct.
 * Redirects to the summary page if valid, otherwise shows an error.
 * 
 * @param {Object} user - The user object.
 * @param {string} password - The entered password.
 */
function checkCredentials(user, password) {
  if (!user) {
    toggleLoadingSpinner('remove');
    toggleSignupError('No user with that email', 'add');
    return;
  }
  if (user.password !== password) {
    toggleLoadingSpinner('remove');
    toggleSignupError('Email or password is invalid', 'add');
    return;
  }
  sessionStorage.setItem('currentUser', user.email);
  userLogIn(user.name);
}

/**
 * Logs in a user by storing their username in local storage and redirecting to the summary page.
 *
 * @param {string} username - The username of the user to log in.
 */
function userLogIn(username) {
  localStorage.setItem('currentUser', username);
  sessionStorage.setItem('loggedIn', true);
  window.location.href = '../pages/summary.html';
  toggleLoadingSpinner('remove');
}

/**
 * Validate the email field value and delegate result handling to validateInput.
 * 
 * @param {boolean} [validate=true] - When true, perform the regex test; when false, bypass the regex test
 *                                     and pass false as the validation result to validateInput.
 * @returns {void}
 */
function validateEmail(validate = true) {
  const emailInput = document.getElementById('email');
  const emailErrorMessage = document.getElementById("email-error-message");
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
  validateInput(emailPattern.test(emailInput.value) && validate, emailInput, emailErrorMessage);
}

/**
 * Validate the password field and update its error message element.
 *
 * @param {boolean} [validate=true] - Whether to perform validation (defaults to true).
 * @returns {void}
 */
function validatePassword(validate = true) {
  const passwordInput = document.getElementById('password');
  const passwordErrorMessage = document.getElementById("password-error-message");
  validateInput(!passwordInput.value.length < 1 && validate, passwordInput, passwordErrorMessage);
}


/**
 * Update the error display for a given input based on a validation result.
 *
 * Calls makeError to either clear the error text when validation passes
 * (by passing an empty string) or to show/set the error when validation fails
 * (relying on makeError's default behavior).
 *
 * @param {boolean} validate - True if the input is valid, false if invalid.
 * @param {HTMLElement} input - The input element whose error state should be updated.
 * @param {HTMLElement} inputTextElement - The element used to display the validation/error message.
 * @returns {void}
 * @see makeError
 */
function validateInput(validate, input, inputTextElement) {
  validate ? makeError(input, inputTextElement, "") : makeError(input, inputTextElement);
}

/**
 * Apply error styling to an input element and its associated error message element.
 *
 * This function mutates the provided DOM elements' inline styles by setting the
 * input element's border color and the error message element's text color.
 *
 * @param {HTMLElement} input - The input (or form control) element whose border color will be changed.
 * @param {HTMLElement} inputErrorMessage - The element that displays the error message; its text color will be changed.
 * @param {string} [color="var(--color-orange-dark)"] - CSS color value to apply (e.g., hex, rgb(), named color, or CSS variable). Defaults to "var(--color-orange-dark)".
 * @returns {void}
 */
function makeError(input, inputErrorMessage, color = "var(--color-orange-dark)") {
  input.style.borderColor = color;
  inputErrorMessage.style.color = color;
}
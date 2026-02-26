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

function validateEmail(validate = true) {
  const emailInput = document.getElementById('email');
  const emailErrorMessage = document.getElementById("email-error-message");
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
  validateInput(emailPattern.test(emailInput.value) && validate, emailInput, emailErrorMessage);
}

function validatePassword(validate = true) {
  const passwordInput = document.getElementById('password');
  const passwordErrorMessage = document.getElementById("password-error-message");
  validateInput(!passwordInput.value.length < 1 && validate, passwordInput, passwordErrorMessage);
}

function validateInput(validate, input, inputTextElement) {
  validate ? makeError(input, inputTextElement, "") : makeError(input, inputTextElement);
}

function makeError(input, inputErrorMessage, color = "var(--color-orange-dark)") {
  input.style.borderColor = color;
  inputErrorMessage.style.color = color;
}
/**
 * Handles user registration form submission, checks if passwords match, and verifies if user exists.
 */
async function handleRegisterNewUser(event) {
  event.preventDefault();
  toggleLoadingSpinner('add');

  const { name, email, password, confirmPassword } = getFieldValues();
  const errorElement = document.getElementById("auth-error-message");

  if(errorElement) errorElement.innerHTML = "";
  if (password !== confirmPassword) {
    toggleLoadingSpinner('remove');
    return toggleSignupError('Not the same password', 'add');
  }
  await checkExistingUser(name, email, password);
}

/**
 * Checks if the user with the given name or email already exists in the database.
 * 
 * @param {String} name - The name of the user attempting to register.
 * @param {String} email - The email address of the user attempting to register.
 * @param {String} password - The password entered by the user.
 */
async function checkExistingUser(name, email, password) {
  const users = Object.values(await loadFromBackend('users'));
  const existingUserName = users.find((user) => user.name === name);
  const existingUserEmail = users.find((user) => user.email === email);

  if (existingUserEmail || existingUserName) {
    toggleLoadingSpinner('remove');
    return toggleSignupError(existingUserName ? 'Username already exists' : 'Email address  already exists', 'add');
  }

  await postUser({ name, email, password }, name);
}


/**
 * Retrieves user input values (name, email, password, confirm password).
 * 
 * @returns {Object} - The values of the registration form fields:
*/
function getFieldValues() {
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirmPasswordInput = document.getElementById('passwordConfirm');
  const confirmPassword = confirmPasswordInput.value;

  return { name, email, password, confirmPasswordInput, confirmPassword };
}


/**
 * Posts the new user's data to the backend, stores username in localStorage, and redirects to the summary page.
 * 
 * @param {Object} user - The user object containing registration data.
 * @param {String} user.name - The name of the user.
 * @param {String} user.email - The email address of the user.
 * @param {String} user.password - The password of the user.
 * @param {String} name - The name of the user to store in localStorage.
 */
async function postUser(user, name) {
  await postDataAtBackend(user, 'users');
  toggleLoadingSpinner('remove');

  localStorage.setItem('currentUser', name);
  window.location.href = '../pages/summary.html';
}

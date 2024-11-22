async function handleRegisterNewUser(event) {
  event.preventDefault();
  toggleLoadingSpinner('add');

  const { name, email, password, confirmPassword } = getFieldValues();

  if (password !== confirmPassword) {
    toggleLoadingSpinner('remove');
    return toggleSignupError('Confirmation code is invalid', 'add');
  }

  await checkExistingUser(name, email, password);
}

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

function getFieldValues() {
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const confirmPasswordInput = document.getElementById('passwordConfirm');
  const confirmPassword = confirmPasswordInput.value;

  return { name, email, password, confirmPasswordInput, confirmPassword };
}

async function postUser(user, name) {
  await postDataAtBackend(user, 'users');
  toggleLoadingSpinner('remove');

  localStorage.setItem('currentUser', name);
  window.location.href = '../pages/summary.html';
}

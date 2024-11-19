const loader = document.getElementById('loader');
const loginLogo = document.getElementById('loginLogo');

function Loadingscreen() {
  if (window.innerWidth <= 600) {
    loader.innerHTML = getLoadingscreenMobile();
  } else {
    loader.innerHTML = getLoadingscreenDesktop();
  }

  startAnimation();
}

function getLoadingscreenMobile() {
  return `
    <img src="assets/img/logo-black.svg" alt="Logo" id="loader-image-black" class="loader-image" />
  `;
}

function getLoadingscreenDesktop() {
  return `
    <img src="assets/img/logo-black.svg" alt="Logo" id="loader-image-black" class="loader-image" />
  `;
}

function startAnimation() {
  // Verzögerung anwenden und Animation starten
  setTimeout(() => {
    // loader.classList.add('start-animation');
  }, 2000);

  // Inhalt anzeigen und Loader ausblenden, wenn die gesamte Animation abgeschlossen ist
  loader.addEventListener('animationend', (event) => {
    // Überprüfen, ob das loader-Element die Animation abgeschlossen hat
    if (event.target === loader) {
      // loader.style.display = 'none'; // Versteckt den Loader
      // loginLogo.style.display = 'flex'; // Zeigt den Inhalt an
    }
  });
}

async function handleLogin(event) {
  event.preventDefault();
  toggleLoadingSpinner('add');
  toggleSignupError('_', 'remove');

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const users = Object.values(await loadFromBackend('users'));

  const user = users.find((user) => user.email === email);

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

  localStorage.setItem('currentUser', user.name);
  window.location.href = '../pages/summary.html';
  toggleLoadingSpinner('remove');
}

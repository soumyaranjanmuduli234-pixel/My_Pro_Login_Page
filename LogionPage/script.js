const loginForm = document.querySelector('.login-form');
const registerForm = document.querySelector('.register-form');
const loginPanelContent = document.getElementById('loginPanelContent');
const registerPanelContent = document.getElementById('registerPanelContent');
const registerBtn = document.querySelector('.register-trigger');
const loginBtn = document.querySelector('.login-trigger');

const loadingOverlay = document.getElementById('loadingOverlay');
const loadingMessage = document.getElementById('loadingMessage');
const loadingTime = document.getElementById('loadingTime');

const customAlertOverlay = document.getElementById('customAlertOverlay');
const customAlertIcon = document.getElementById('customAlertIcon');
const customAlertTitle = document.getElementById('customAlertTitle');
const customAlertMessage = document.getElementById('customAlertMessage');
const customAlertBtn = document.getElementById('customAlertBtn');

let loadingTimer = null;
let afterAlertCallback = null;

function showLogin() {
  registerForm.classList.remove('active');
  loginForm.classList.add('active');
  registerPanelContent.classList.remove('active');
  loginPanelContent.classList.add('active');
}

function showRegister() {
  loginForm.classList.remove('active');
  registerForm.classList.add('active');
  loginPanelContent.classList.remove('active');
  registerPanelContent.classList.add('active');
}

function showCustomAlert(type, title, message, callback) {
  customAlertTitle.textContent = title;
  customAlertMessage.textContent = message;
  afterAlertCallback = typeof callback === 'function' ? callback : null;

  if (type === 'error') {
    customAlertIcon.textContent = '!';
    customAlertIcon.classList.add('error');
  } else {
    customAlertIcon.textContent = '✓';
    customAlertIcon.classList.remove('error');
  }

  customAlertOverlay.classList.add('show');
}

function hideCustomAlert() {
  customAlertOverlay.classList.remove('show');

  if (afterAlertCallback) {
    const cb = afterAlertCallback;
    afterAlertCallback = null;
    cb();
  }
}

function showLoading(seconds, message, onComplete) {
  clearTimeout(loadingTimer);

  loadingMessage.textContent = message;
  loadingTime.textContent = `Processing for ${seconds} seconds`;
  loadingOverlay.classList.add('show');

  loadingTimer = setTimeout(function () {
    loadingOverlay.classList.remove('show');

    if (typeof onComplete === 'function') {
      onComplete();
    }
  }, seconds * 1000);
}

function hideLoading() {
  clearTimeout(loadingTimer);
  loadingOverlay.classList.remove('show');
}

registerBtn.addEventListener('click', function () {
  showRegister();
});

loginBtn.addEventListener('click', function () {
  showLogin();
});

customAlertBtn.addEventListener('click', function () {
  hideCustomAlert();
});

customAlertOverlay.addEventListener('click', function (e) {
  if (e.target === customAlertOverlay) {
    hideCustomAlert();
  }
});

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    if (customAlertOverlay.classList.contains('show')) {
      hideCustomAlert();
    }

    if (loadingOverlay.classList.contains('show')) {
      hideLoading();
    }
  }
});

document.getElementById('loginForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();

  if (!email || !password) {
    showCustomAlert('error', 'Missing Fields', 'Please fill in all login fields.');
    return;
  }

  showLoading(10, 'Signing you in...', function () {
    showCustomAlert('success', 'Welcome Back', 'You have signed in successfully.');
  });
});

document.getElementById('registerForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const username = document.getElementById('regUsername').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value.trim();

  if (!username || !email || !password) {
    showCustomAlert('error', 'Incomplete Form', 'Please fill in all registration fields.');
    return;
  }

  if (password.length < 6) {
    showCustomAlert('error', 'Weak Password', 'Password must be at least 6 characters long.');
    return;
  }

  showLoading(10, 'Please wait, we are setting up your profile...', function () {
      showCustomAlert(
        'success',
        'Registration Complete',
        'Your account has been created successfully.',
        function () {
          document.getElementById('registerForm').reset();
          showLogin();
        }
      );
    });

  /*
    Agar 10 second ka loader chahiye, to upar wali line ko replace karke ye use karo:

    showLoading(10, 'Please wait, we are setting up your profile...', function () {
      showCustomAlert(
        'success',
        'Registration Complete',
        'Your account has been created successfully.',
        function () {
          document.getElementById('registerForm').reset();
          showLogin();
        }
      );
    });
  */
});
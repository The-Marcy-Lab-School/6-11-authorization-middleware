import {
  getCurrentUser,
  register,
  login,
  logout,
  getUsers,
  updatePassword,
  deleteUser,
} from './fetch-helpers.js';

import {
  renderUsers,
  renderProfile,
  renderAuthView,
  showAuthSection,
  showUsersSection,
  showProfileSection,
  showError,
  hideError,
} from './dom-helpers.js';

// ================================================
// DOM References (for event handling only)
// ================================================

const loginForm = document.querySelector('#login-form');
const registerForm = document.querySelector('#register-form');
const changePasswordForm = document.querySelector('#change-password-form');
const showAuthBtn = document.querySelector('#show-auth-btn');
const logoutBtn = document.querySelector('#logout-btn');
const showUsersBtn = document.querySelector('#show-users-btn');
const showProfileBtn = document.querySelector('#show-profile-btn');
const deleteAccountBtn = document.querySelector('#delete-account-btn');

// ================================================
// In Memory Data
// ================================================

let currentUser = null;

// ================================================
// Refresh Helpers
// ================================================

const refreshUsers = async () => {
  const { data: users } = await getUsers();
  renderUsers(users || []);
};

// ================================================
// Event Handlers
// ================================================

// Register: create account -> auto-login -> show profile
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  hideError('register-error');
  const { data: user, error } = await register(
    registerForm.username.value,
    registerForm.password.value,
  );
  if (error) return showError('register-error', 'Username already taken.');
  currentUser = user;
  renderAuthView(currentUser);
  renderProfile(currentUser);
  registerForm.reset();
  await refreshUsers();
  showUsersSection();
});

// Login: validate credentials -> set session -> show users
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  hideError('login-error');
  const { data: user, error } = await login(
    loginForm.username.value,
    loginForm.password.value,
  );
  if (error) return showError('login-error', 'Invalid username or password.');
  currentUser = user;
  renderAuthView(currentUser);
  renderProfile(currentUser);
  loginForm.reset();
  showUsersSection();
  await refreshUsers();
});

// Logout: clear session -> return to guest view -> show users
logoutBtn.addEventListener('click', async () => {
  await logout();
  currentUser = null;
  renderAuthView(null);
  showUsersSection();
  await refreshUsers();
});

// Change password: update own record -> stay on profile
changePasswordForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  hideError('change-password-error');
  const newPassword = changePasswordForm.password.value;
  const { error } = await updatePassword(currentUser.user_id, newPassword);
  if (error) return showError('change-password-error', 'Could not update password.');
  changePasswordForm.reset();
  alert('Password updated.');
});

// Delete account: remove own record -> log out -> return to guest view
deleteAccountBtn.addEventListener('click', async () => {
  if (!confirm('Delete your account? This cannot be undone.')) return;
  await deleteUser(currentUser.user_id);
  await logout();
  currentUser = null;
  renderAuthView(null);
  showUsersSection();
  await refreshUsers();
});

// Nav: show All Users section
showUsersBtn.addEventListener('click', async () => {
  showUsersSection();
  await refreshUsers();
});

// Nav: show My Profile section
showProfileBtn.addEventListener('click', () => {
  renderProfile(currentUser);
  showProfileSection();
});

// Header: reveal auth section
showAuthBtn.addEventListener('click', showAuthSection);

// ================================================
// Initialization
// ================================================

// On every page load: check session -> update view -> load users
const main = async () => {
  const { data } = await getCurrentUser();
  currentUser = data;
  renderAuthView(currentUser);
  if (currentUser) renderProfile(currentUser);
  await refreshUsers();
};

main();

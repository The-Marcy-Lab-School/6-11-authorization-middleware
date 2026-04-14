// DOM references — owned here, used only for rendering
const usersList = document.querySelector('#users-list');
const currentUsernameEl = document.querySelector('#current-username');
const guestControls = document.querySelector('#guest-controls');
const authControls = document.querySelector('#auth-controls');
const authSection = document.querySelector('#auth-section');
const usersSection = document.querySelector('#users-section');
const profileSection = document.querySelector('#profile-section');
const showProfileBtn = document.querySelector('#show-profile-btn');
const profileUsername = document.querySelector('#profile-username');
const profileUserId = document.querySelector('#profile-user-id');

// ============================================
// Render
// ============================================

export const renderUsers = (users) => {
  usersList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.className = 'user-card';
    li.textContent = `@${user.username}`;

    const idSpan = document.createElement('span');
    idSpan.className = 'user-id';
    idSpan.textContent = `#${user.user_id}`;

    li.append(idSpan);
    usersList.append(li);
  });
};

export const renderProfile = (user) => {
  profileUsername.textContent = user.username;
  profileUserId.textContent = user.user_id;
};

// Switches the header and nav between guest mode and logged-in mode
export const renderAuthView = (currentUser) => {
  if (currentUser) {
    currentUsernameEl.textContent = `@${currentUser.username}`;
    guestControls.classList.add('hidden');
    authControls.classList.remove('hidden');
    authSection.classList.add('hidden');
    showProfileBtn.classList.remove('hidden');
  } else {
    guestControls.classList.remove('hidden');
    authControls.classList.add('hidden');
    authSection.classList.add('hidden');
    showProfileBtn.classList.add('hidden');
    profileSection.classList.add('hidden');
  }
};

// ============================================
// Show / Hide sections
// ============================================

export const showAuthSection = () => {
  authSection.classList.remove('hidden');
};

export const showUsersSection = () => {
  usersSection.classList.remove('hidden');
  profileSection.classList.add('hidden');
};

export const showProfileSection = () => {
  usersSection.classList.add('hidden');
  profileSection.classList.remove('hidden');
};

// ============================================
// Error display helpers
// ============================================

export const showError = (elementId, message) => {
  const el = document.querySelector(`#${elementId}`);
  el.textContent = message;
  el.classList.remove('hidden');
};

export const hideError = (elementId) => {
  const el = document.querySelector(`#${elementId}`);
  el.textContent = '';
  el.classList.add('hidden');
};

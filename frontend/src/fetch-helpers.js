// A single function to handle fetches with try/catch and return a standard { data, error } shape
const handleFetch = async (url, config) => {
  try {
    const response = await fetch(url, config);
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

const baseURL = '/api';

// ============================================
// Auth
// ============================================

export const getCurrentUser = async () => {
  // If no session exists, the request returns 401 — we treat that as "not logged in"
  const { data } = await handleFetch(`${baseURL}/auth/me`);
  return { data };
};

export const register = (username, password) => {
  const config = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  };
  return handleFetch(`${baseURL}/auth/register`, config);
};

export const login = (username, password) => {
  const config = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  };
  return handleFetch(`${baseURL}/auth/login`, config);
};

export const logout = () => {
  return handleFetch(`${baseURL}/auth/logout`, { method: 'DELETE' });
};

// ============================================
// Users
// ============================================

export const getUsers = () => {
  return handleFetch(`${baseURL}/users`);
};

export const updatePassword = (user_id, password) => {
  const config = {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  };
  return handleFetch(`${baseURL}/users/${user_id}`, config);
};

export const deleteUser = (user_id) => {
  return handleFetch(`${baseURL}/users/${user_id}`, { method: 'DELETE' });
};

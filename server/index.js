// ====================================
// Imports / Constants
// ====================================

const path = require('path');
const express = require('express');

require('dotenv').config();
const cookieSession = require('cookie-session');

const logRoutes = require('./middleware/logRoutes');

// 🔎 Import the checkAuthentication middleware
const checkAuthentication = require('./middleware/checkAuthentication');

const { register, login, getMe, logout } = require('./controllers/authControllers');
const { listUsers, updateUser, deleteUser } = require('./controllers/userControllers');

const app = express();
const PORT = process.env.PORT || 8080;

const pathToFrontend = process.env.NODE_ENV === 'production' ? '../frontend/dist' : '../frontend';

// ====================================
// Middleware
// ====================================

app.use(logRoutes);
app.use(cookieSession({
  name: 'session',
  secret: process.env.SESSION_SECRET,
  maxAge: 24 * 60 * 60 * 1000,
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, pathToFrontend)));

// ====================================
// Auth routes (public)
// ====================================

app.post('/api/auth/register', register);
app.post('/api/auth/login', login);
app.get('/api/auth/me', getMe);
app.delete('/api/auth/logout', logout);

// ====================================
// User routes
// ====================================

app.get('/api/users', listUsers);

// 🔎 TODO: add checkAuthentication middleware to these two routes
app.patch('/api/users/:user_id', updateUser);
app.delete('/api/users/:user_id', deleteUser);

// ====================================
// Global Error Handling
// ====================================

const handleError = (err, req, res, next) => {
  console.error(err);
  res.status(500).send({ message: 'Internal Server Error' });
};

app.use(handleError);

// ====================================
// Listen
// ====================================

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));

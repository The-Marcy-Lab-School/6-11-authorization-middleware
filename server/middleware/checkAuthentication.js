// middleware/checkAuthentication.js
const checkAuthentication = (req, res, next) => {
  // No session: user is not logged in, cut off the request before continuing to the controller
  if (!req.session.userId) {
    return res.status(401).send({ message: 'You must be logged in to do that.' });
  }

  // Session is valid: continue to the controller and execute the protected endpoint
  next();
};

module.exports = checkAuthentication;

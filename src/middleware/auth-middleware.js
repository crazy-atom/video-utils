const AuthenticationError = require('../utils/error/authentication-error');

const authMiddleware = async (req, res, next) => {
  const apiToken = req.headers.authorization;

  if (!apiToken) {
    throw new AuthenticationError('API token is required');
  }

  if (apiToken !== process.env.AUTH_TOKEN) {
    throw new AuthenticationError('Invalid API token');
  }

  return next();
};

module.exports = authMiddleware;

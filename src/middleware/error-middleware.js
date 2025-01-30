const logger = require('../utils/logger');

module.exports = (err, req, res, next) => {
  if (res.headersSent) return next(err);
  logger.error(`Error: ${err.message}`, { stack: err.stack });

  const statusCode = err.statusCode || 500;
  const errorMessage = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    status: 'error',
    error: errorMessage,
  });
};

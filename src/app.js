require('dotenv').config();

require('express-async-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const { createHttpTerminator } = require('http-terminator');

const errorMiddleware = require('./middleware/error-middleware');

const healthRoute = require('./routes/health-route');
const logger = require('./utils/logger');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/health', healthRoute);
app.use(errorMiddleware);

const server = app.listen(process.env.PORT, () => {
  logger.info(`App listening on port ${process.env.PORT}`);
});

const httpTerminator = createHttpTerminator({ server });

const gracefulShutdown = async (signal) => {
  logger.info(`Received ${signal}. Closing server...`);

  try {
    await httpTerminator.terminate();
    logger.info('HTTP connections and database closed.');
    process.exit(0);
  } catch (err) {
    logger.error('Error shutting down server:', err);
    process.exit(1);
  }
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

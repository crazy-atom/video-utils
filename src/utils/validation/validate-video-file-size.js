const ValidationError = require('../error/validation-error');

const MIN_VIDEO_SIZE = process.env.MIN_VIDEO_SIZE || 5;
const MAX_VIDEO_SIZE = process.env.MAX_VIDEO_SIZE || 25;

const validateMinVideoSize = (fileSize) => {
  if (fileSize < MIN_VIDEO_SIZE * 1024 * 1024) { // Convert MB to bytes
    throw new ValidationError(`Video must be at least ${MIN_VIDEO_SIZE} MB`);
  }
};

const validateMaxVideoSize = (fileSize) => {
  if (fileSize > MAX_VIDEO_SIZE * 1024 * 1024) { // Convert MB to bytes
    throw new ValidationError(`Video must be at most ${MAX_VIDEO_SIZE} MB`);
  }
};

module.exports = {
  validateMinVideoSize,
  validateMaxVideoSize,
};

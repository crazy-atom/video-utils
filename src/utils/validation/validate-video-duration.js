const ValidationError = require('../error/validation-error');

const MAX_VIDEO_DURATION = process.env.MAX_VIDEO_DURATION || 25;
const MIN_VIDEO_DURATION = process.env.MIN_VIDEO_DURATION || 5;

const validateVideoDuration = (videoDuration) => {
  if (videoDuration < MIN_VIDEO_DURATION || videoDuration > MAX_VIDEO_DURATION) {
    throw new ValidationError(`Video must be between ${MIN_VIDEO_DURATION} and ${MAX_VIDEO_DURATION} seconds`);
  }
};

module.exports = validateVideoDuration;

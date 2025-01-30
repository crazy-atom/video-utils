require('dotenv').config();
const { validateMinVideoSize, validateMaxVideoSize } = require('../src/utils/validation/validate-video-file-size');
const ValidationError = require('../src/utils/error/validation-error');

describe('Video file Size Validation', () => {
  const MIN_VIDEO_SIZE = process.env.MIN_VIDEO_SIZE || 5;
  const MAX_VIDEO_SIZE = process.env.MAX_VIDEO_SIZE || 25;

  const MIN_VIDEO_SIZE_BYTES = MIN_VIDEO_SIZE * 1024 * 1024;
  const MAX_VIDEO_SIZE_BYTES = MAX_VIDEO_SIZE * 1024 * 1024;

  test('should throw ValidationError if video size is below minimum limit', () => {
    const smallSize = MIN_VIDEO_SIZE_BYTES - 1;

    expect(() => validateMinVideoSize(smallSize)).toThrow(ValidationError);
    expect(() => validateMinVideoSize(smallSize)).toThrow(`Video must be at least ${MIN_VIDEO_SIZE} MB`);
  });

  test('should not throw error if video size meets minimum limit', () => {
    const validSize = MIN_VIDEO_SIZE_BYTES;
    expect(() => validateMinVideoSize(validSize)).not.toThrow();
  });

  test('should throw ValidationError if video size exceeds maximum limit', () => {
    const largeSize = MAX_VIDEO_SIZE_BYTES + 1;

    expect(() => validateMaxVideoSize(largeSize)).toThrow(ValidationError);
    expect(() => validateMaxVideoSize(largeSize)).toThrow(`Video must be at most ${MAX_VIDEO_SIZE} MB`);
  });

  test('should not throw error if video size is within maximum limit', () => {
    const validSize = MAX_VIDEO_SIZE_BYTES;
    expect(() => validateMaxVideoSize(validSize)).not.toThrow();
  });
});

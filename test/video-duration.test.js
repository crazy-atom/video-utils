require('dotenv').config();
const { getVideoDuration } = require('../src/services/video-processing-service');

describe('Video duration tests', () => {
  test('should return correct duration', async () => {
    const duration = await getVideoDuration('test/data/big_buck_bunny.mp4');
    expect(duration).toEqual(127.317);
  });

  test('should throw error if video is not found', async () => {
    await expect(() => getVideoDuration('test/data/non_existent_file.mp4')).rejects.toThrow(Error);
  });

  test('should throw error when a non-video file is passed', async () => {
    await expect(() => getVideoDuration('test/data/file.txt')).rejects.toThrow(Error);
  });

  test('should throw error when an empty string is passed', async () => {
    await expect(() => getVideoDuration('')).rejects.toThrow(Error);
  });
});

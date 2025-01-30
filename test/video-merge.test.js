require('dotenv').config();
const fs = require('fs');
const { getVideoDuration, mergeVideos } = require('../src/services/video-processing-service');

describe('Video merge tests', () => {
  const mergeVideoPath = 'out/bunny_merge.mp4';
  const inputs = ['test/data/bunny_p1.mp4', 'test/data/bunny_p2.mp4'];
  afterEach(() => {
    if (fs.existsSync(mergeVideoPath)) {
      fs.rmSync(mergeVideoPath);
    }
  });
  test('should merge into correct duration', async () => {
    await mergeVideos(inputs, mergeVideoPath);

    const duration = await getVideoDuration(mergeVideoPath);
    expect(duration).toEqual(7.018);
  });

  test('should throw error with empty input list', async () => {
    await expect(mergeVideos([], mergeVideoPath)).rejects.toThrow(Error);
  });

  test('should throw error when destination path does not exist', async () => {
    await expect(mergeVideos(inputs, 'some/random/path.mp4', 2, 5)).rejects.toThrow(Error);
  });

  test('should throw error in non-existent input file', async () => {
    await expect(mergeVideos([...inputs, 'test/data/non_existent_file.mp4'], 'out/trim.mp4', 2, 5)).rejects.toThrow(Error);
  });
});

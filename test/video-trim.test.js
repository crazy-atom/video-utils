require('dotenv').config();
const fs = require('fs');
const { getVideoDuration } = require('../src/services/video-service');
const { trimVideo } = require('../src/services/video-service');

describe('Video trim tests', () => {
  const trimVideoPath = 'out/bunny_trim.mp4';

  afterEach(() => {
    if (fs.existsSync(trimVideoPath)) {
      fs.rmSync(trimVideoPath);
    }
  });

  test('should trim correct duration', async () => {
    await trimVideo('test/data/big_buck_bunny.mp4', trimVideoPath, 2, 5);
    const duration = await getVideoDuration(trimVideoPath);
    expect(duration).toEqual(3);
  });

  test('should throw error in null inputs', async () => {
    await expect(trimVideo(null, null, 2, 5)).rejects.toThrow(Error);
  });

  test('should throw error when destination path does not exist', async () => {
    await expect(trimVideo('test/data/big_buck_bunny.mp4', 'some/random/path.mp4', 2, 5)).rejects.toThrow(Error);
  });

  test('should throw error in non-existent input file', async () => {
    await expect(trimVideo('test/data/non_existent_file.mp4', 'out/trim.mp4', 2, 5)).rejects.toThrow(Error);
  });
  test('should throw error in invalid range inputs', async () => {
    await expect(trimVideo('test/data/big_buck_bunny.mp4', trimVideoPath, 5, 2)).rejects.toThrow(Error);
  });
  test('should trim 0 duration video when start time equal to end time', async () => {
    await trimVideo('test/data/big_buck_bunny.mp4', trimVideoPath, 3, 3);
    const duration = await getVideoDuration(trimVideoPath);
    expect(duration).toEqual(0);
  });
});

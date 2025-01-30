require('dotenv').config();

const { v4: uuidv4 } = require('uuid');

const VideoModel = require('../src/models/video');
const LinkModel = require('../src/models/sharelink');
const { createShareableLink, getVideoByLink } = require('../src/services/share-link-service');

describe('Share Link Service', () => {
  let testVideoId;

  beforeAll(async () => {
    process.env.DATABASE_PATH = ':memory:';
    testVideoId = uuidv4();

    // Insert a test video into the database
    await VideoModel.createVideo({
      id: testVideoId,
      filename: 'test.mp4',
      originalName: 'test.mp4',
      path: '/videos/test.mp4',
      size: 1024,
    });
  });

  afterAll(async () => {
    // Cleanup: Delete all test records from VideoModel and LinkModel
    await VideoModel.clearAllVideos();
    await LinkModel.clearAllLinks();
  });

  test('should create a shareable link', async () => {
    const expiryHours = 12;
    const linkData = await createShareableLink(testVideoId, expiryHours);

    expect(linkData).toHaveProperty('token');
    expect(linkData).toHaveProperty('expiresAt');
    expect(linkData).toHaveProperty('link');
  });

  test('should return error when video does not exist', async () => {
    await expect(createShareableLink('non-existent-video'))
      .rejects.toThrow('Video not found');
  });

  test('should retrieve video by link token', async () => {
    const { token } = await createShareableLink(testVideoId, 24);
    const videoData = await getVideoByLink(token);

    expect(videoData).toHaveProperty('videoPath', '/videos/test.mp4');
    expect(videoData).toHaveProperty('filename', 'test.mp4');
  });

  test('should return error for expired or invalid link', async () => {
    await expect(getVideoByLink('invalid-token'))
      .rejects.toThrow('Link expired or invalid');
  });
});

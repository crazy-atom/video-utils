const { v4: uuidv4 } = require('uuid');

const logger = require('../utils/logger');

const VideoModel = require('../models/video');

const convertBytes = (bytes) => {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`; // Convert to MB
  } if (bytes >= 1024) {
    return `${(bytes / 1024).toFixed(2)} KB`; // Convert to KB
  }
  return `${bytes} bytes`; // Return as bytes if less than 1 KB
};

const saveVideo = async (videoData) => {
  try {
    return VideoModel.createVideo(videoData);
  } catch (error) {
    throw new Error(`Error saving video data: ${error.message}`);
  }
};

const uploadVideo = async (req, res, next) => {
  try {
    const { file } = req;
    if (!file) {
      return res.status(400).json({ error: 'No video file uploaded' });
    }

    const videoId = uuidv4();
    await saveVideo({
      id: videoId,
      filename: file.filename,
      originalName: file.originalname,
      path: file.path,
      size: file.size,
    });

    logger.info(`Video uploaded successfully: ${videoId}`);
    res.status(201).json({ message: 'Video uploaded successfully', videoId });
  } catch (error) {
    logger.error('Video upload failed', { error });
    next(error);
  }
};

const getVideo = async (req, res, next) => {
  try {
    const { videoId } = req.params;

    const video = await VideoModel.getVideoById(videoId);
    if (!video) {
      return res.status(404).json({ status: 'error', error: 'Video not found' });
    }

    const {
      id, originalName, size, createdAt,
    } = video;

    res.status(200).json({
      message: 'Video retrieved successfully',
      video: {
        id, originalName, size: convertBytes(size), createdAt,
      },
    });
  } catch (error) {
    logger.error('Failed to retrieve video', { error });
    next(error);
  }
};

const listVideos = async (req, res, next) => {
  try {
    const videos = await VideoModel.listVideos();
    res.status(200).json({
      message: 'Videos retrieved successfully',
      videos: videos.map(({
        id, originalName, size, createdAt,
      }) => ({
        id, originalName, size: convertBytes(size), createdAt,
      })),
    });
  } catch (error) {
    logger.error('Failed to retrieve videos', { error });
    next(error);
  }
};

module.exports = {
  uploadVideo,
  listVideos,
  getVideo,
};

const { v4: uuidv4 } = require('uuid');
const path = require('path');

const fs = require('fs').promises;
const logger = require('../utils/logger');
const VideoService = require('../services/video-service');

const ApplicationError = require('../utils/error/application-error');

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
    return res.status(201).json({ message: 'Video uploaded successfully', videoId });
  } catch (error) {
    logger.error('Video upload failed', { error });
    return next(error);
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

    return res.status(200).json({
      message: 'Video retrieved successfully',
      video: {
        id, originalName, size: convertBytes(size), createdAt,
      },
    });
  } catch (error) {
    logger.error('Failed to retrieve video', { error });
    return next(error);
  }
};

const listVideos = async (req, res, next) => {
  try {
    const videos = await VideoModel.listVideos();
    return res.status(200).json({
      message: 'Videos retrieved successfully',
      videos: videos.map(({
        id, originalName, size, createdAt,
      }) => ({
        id, originalName, size: convertBytes(size), createdAt,
      })),
    });
  } catch (error) {
    logger.error('Failed to retrieve videos', { error });
    return next(error);
  }
};

const trimVideo = async (req, res, next) => {
  try {
    const { start, end } = req.body;
    const { videoId } = req.params;

    if (!videoId) {
      return res.status(400).json({ status: 'error', error: 'Missing VideoId!' });
    }

    if (start === undefined || end === undefined || start >= end) {
      return res.status(400).json({ status: 'error', error: 'Invalid trim values' });
    }

    const video = await VideoModel.getVideoById(videoId);
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }

    const outputFilename = `trimmed-${Date.now()}-${path.basename(video.path)}`;
    const outputPath = path.join(__dirname, process.env.UPLOAD_DIR, outputFilename);

    const trimmedVideoPath = await VideoService.trimVideo(video.path, outputPath, start, end)
      .catch((error) => {
        logger.error('FFmpeg processing failed', { error });
        throw new ApplicationError('Video processing failed');
      });

    const fileStats = await fs.stat(trimmedVideoPath);

    const trimmedVideoId = uuidv4();
    await VideoModel.createVideo({
      id: trimmedVideoId,
      filename: outputFilename,
      originalName: `Trimmed-${path.basename(video.originalName)}`,
      path: trimmedVideoPath,
      parentId: videoId,
      size: fileStats?.size,
    });

    logger.info(`Video trimmed successfully: ${trimmedVideoId}`);
    return res.status(201).json({ message: 'Video trimmed successfully', videoId: trimmedVideoId });
  } catch (error) {
    logger.error('Video trimming failed', { error });
    return next(error);
  }
};

module.exports = {
  uploadVideo,
  listVideos,
  getVideo,
  trimVideo,
};

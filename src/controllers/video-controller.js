const logger = require('../utils/logger');
const VideoService = require('../services/video-service');

const { validateTrimRequest, validateMergeRequest, validateUploadRequest } = require('../utils/validation/request-validation');

const VideoModel = require('../models/video');

const uploadVideo = async (req, res, next) => {
  try {
    validateUploadRequest(req);
    const { file } = req;

    const videoId = await VideoService.saveVideo(file);
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

    return res.status(200).json({ message: 'Video retrieved successfully', video });
  } catch (error) {
    logger.error('Failed to retrieve video', { error });
    return next(error);
  }
};

const listVideos = async (req, res, next) => {
  try {
    const videos = await VideoService.listVideos();
    return res.status(200).json({ message: 'Videos retrieved successfully', videos });
  } catch (error) {
    logger.error('Failed to retrieve videos', { error });
    return next(error);
  }
};

const trimVideo = async (req, res, next) => {
  try {
    validateTrimRequest(req);

    const { videoId } = req.params;
    const { start, end } = req.body;

    const trimmedVideoId = await VideoService.trimVideo(videoId, start, end);
    return res.status(201).json({ message: 'Video trimmed successfully', videoId: trimmedVideoId });
  } catch (error) {
    logger.error('Video trimming failed', { error });
    return next(error);
  }
};

const mergeVideos = async (req, res, next) => {
  try {
    validateMergeRequest(req);

    const { videoIds } = req.body;
    const mergedVideoId = await VideoService.mergeVideos(videoIds);
    return res.status(201).json({ message: 'Videos merged successfully', videoId: mergedVideoId });
  } catch (error) {
    logger.error('Video merging failed', { error });
    return next(error);
  }
};

module.exports = {
  uploadVideo,
  listVideos,
  getVideo,
  trimVideo,
  mergeVideos,
};

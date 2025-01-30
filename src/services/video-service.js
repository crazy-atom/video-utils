const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs').promises;

const VideoProcessingService = require('./video-processing-service');
const { convertBytes } = require('../utils/file-utils');

const VideoModel = require('../models/video');

const saveVideo = async (file) => {
  const videoId = uuidv4();
  await VideoModel.createVideo({
    id: videoId,
    filename: file.filename,
    originalName: file.originalname,
    path: file.path,
    size: file.size,
  });
  return videoId;
};

const getVideo = async (videoId) => {
  const video = await VideoModel.getVideoById(videoId);
  return video ? { ...video, size: convertBytes(video.size) } : null;
};

const listVideos = async () => {
  const videos = await VideoModel.listVideos();
  return videos.map((video) => ({ ...video, size: convertBytes(video.size) }));
};

const trimVideo = async (videoId, start, end) => {
  const video = await VideoModel.getVideoById(videoId);
  if (!video) throw new Error('Video not found');

  const outputFilename = `trimmed-${Date.now()}-${path.basename(video.path)}`;
  const outputPath = path.join(__dirname, process.env.UPLOAD_DIR, outputFilename);

  const trimmedVideoPath = await VideoProcessingService.trimVideo(video.path, outputPath, start, end);
  const fileStats = await fs.stat(trimmedVideoPath);

  const trimmedVideoId = uuidv4();
  await VideoModel.createVideo({
    id: trimmedVideoId,
    filename: outputFilename,
    originalName: `Trimmed-${path.basename(video.originalName)}`,
    path: trimmedVideoPath,
    parentId: videoId,
    size: fileStats.size,
  });

  return trimmedVideoId;
};

const mergeVideos = async (videoIds) => {
  const videos = await Promise.all(videoIds.map((id) => VideoModel.getVideoById(id)));
  if (videos.some((video) => !video)) throw new Error('One or more videos not found');

  const outputFilename = `${Date.now()}-merged.mp4`;
  const outputPath = path.join(__dirname, process.env.UPLOAD_DIR, outputFilename);

  const mergedVideoPath = await VideoProcessingService.mergeVideos(
    videos.map((video) => video.path),
    outputPath,
  );

  const fileStats = await fs.stat(mergedVideoPath);
  const mergedVideoId = uuidv4();

  await VideoModel.createVideo({
    id: mergedVideoId,
    filename: outputFilename,
    originalName: `Merged-${videoIds.length}-videos`,
    path: mergedVideoPath,
    size: fileStats.size,
    parentId: null,
  });

  return mergedVideoId;
};

module.exports = {
  saveVideo,
  getVideo,
  listVideos,
  trimVideo,
  mergeVideos,
};

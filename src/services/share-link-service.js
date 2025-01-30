require('dotenv').config();

const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

const LinkModel = require('../models/sharelink');
const VideoModel = require('../models/video');

const createShareableLink = async (videoId, expiryHours = 24) => {
  const video = await VideoModel.getVideoById(videoId);
  if (!video) {
    const error = new Error('Video not found');
    error.statusCode = 404;
    throw error;
  }

  const token = crypto.randomBytes(16).toString('hex');
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + expiryHours);
  const expiresAtISO = expiresAt.toISOString().slice(0, 19).replace('T', ' '); // Format: 'YYYY-MM-DD HH:MM:SS'

  const linkId = uuidv4();
  await LinkModel.createLink({
    id: linkId,
    videoId,
    token,
    expiresAt: expiresAtISO,
  });

  return {
    token,
    expiresAt: expiresAtISO,
    link: `/api/links/${token}`,
  };
};

const getVideoByLink = async (token) => {
  const link = await LinkModel.getLinkByToken(token);
  if (!link) {
    const error = new Error('Link expired or invalid');
    error.statusCode = 404;
    throw error;
  }

  const video = await VideoModel.getVideoById(link.videoId);
  if (!video) {
    const error = new Error('Video not found');
    error.statusCode = 404;
    throw error;
  }

  return {
    videoPath: video.path,
    filename: video.originalName,
  };
};

module.exports = {
  createShareableLink,
  getVideoByLink,
};

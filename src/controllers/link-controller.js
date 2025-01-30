const logger = require('../utils/logger');
const LinkService = require('../services/share-link-service');
const { validateGenerateLinkRequest } = require('../utils/validation/request-validation');

const generateLink = async (req, res) => {
  try {
    validateGenerateLinkRequest(req);

    const { videoId } = req.params;
    const { expiryHours } = req.body;

    const linkData = await LinkService.createShareableLink(videoId, expiryHours);

    return res.status(201).json(linkData);
  } catch (error) {
    logger.error('Link generation failed', { error });
    return res.status(error.statusCode || 500).json({ status: 'error', error: error.message });
  }
};

const accessVideoLink = async (req, res) => {
  try {
    const { token } = req.params;
    const videoData = await LinkService.getVideoByLink(token);

    return res.status(200).json(videoData);
  } catch (error) {
    logger.error('Video link access failed', { error });
    return res.status(error.statusCode || 500).json({ status: 'error', error: error.message });
  }
};

module.exports = {
  generateLink,
  accessVideoLink,
};

const express = require('express');

const router = express.Router();

const videoController = require('../controllers/video-controller');
const { generateLink } = require('../controllers/link-controller');

const validateVideoUpload = require('../middleware/upload-middleware');

const authMiddleware = require('../middleware/auth-middleware');

router.use(authMiddleware);

router.post(
  '',
  validateVideoUpload,
  videoController.uploadVideo,
);

router.post(
  '/:videoId/trim',
  videoController.trimVideo,
);

router.post(
  '/merge',
  videoController.mergeVideos,
);

router.get(
  '/',
  videoController.listVideos,
);

router.get(
  '/:videoId',
  videoController.getVideo,
);

router.post(
  '/:videoId/links',
  generateLink,
);

module.exports = router;

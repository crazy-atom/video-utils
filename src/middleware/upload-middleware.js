const fs = require('fs');
const path = require('path');
const multer = require('multer');

const { getVideoDuration } = require('../services/video-processing-service');
const { validateMaxVideoSize, validateMinVideoSize } = require('../utils/validation/validate-video-file-size');
const validateVideoDuration = require('../utils/validation/validate-video-duration');

const ValidationError = require('../utils/error/validation-error');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, process.env.UPLOAD_DIR);
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const videoFilter = (req, file, cb) => {
  const fileTypes = /mp4|mov|avi|mkv/;
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = fileTypes.test(file.mimetype);

  if (extname && mimeType) {
    cb(null, true);
  } else {
    cb(new ValidationError('Invalid file type', 'Only MP4, MOV, AVI, and MKV formats are allowed.'));
  }
};

const upload = multer({
  storage,
  fileFilter: videoFilter,
  limits: {
    fileSize: process.env.MAX_VIDEO_SIZE * 1024 * 1024, // Convert MB to bytes
  },
});

const validateVideoUpload = (req, res, next) => {
  upload.single('video')(req, res, async (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        return next(new ValidationError('Multer error', err.message));
      }
      return next(new ValidationError('Upload error', err.message));
    }

    if (!req.file) {
      return next(new ValidationError('No video uploaded', 'Please upload a valid video file.'));
    }

    try {
      validateMaxVideoSize(req.file.size);
      validateMinVideoSize(req.file.size);
      const duration = await getVideoDuration(req.file.path);
      validateVideoDuration(duration);
      return next();
    } catch (error) {
      if (fs.existsSync(req.file.path)) {
        fs.rmSync(req.file.path);
      }
      return next(new ValidationError(error.message || 'Video validation failed'));
    }
  });
};

module.exports = validateVideoUpload;

const validateTrimRequest = (req) => {
  const { start, end } = req.body;
  if (!req.params.videoId) throw new Error('Missing VideoId!');
  if (start === undefined || end === undefined || start >= end) throw new Error('Invalid trim values');
};

const validateMergeRequest = (req) => {
  const { videoIds } = req.body;
  if (!Array.isArray(videoIds) || videoIds.length < 2) throw new Error('At least two videos are required for merging');
};

const validateUploadRequest = (req) => {
  const { file } = req;
  if (!file) throw new Error('No video file uploaded');
};

module.exports = { validateTrimRequest, validateMergeRequest, validateUploadRequest };

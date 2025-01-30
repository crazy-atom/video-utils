const ffmpeg = require('fluent-ffmpeg');

const logger = require('../utils/logger');

ffmpeg.setFfmpegPath(process.env.FFMPEG_PATH);

const getVideoDuration = (filePath) => new Promise((resolve, reject) => {
  ffmpeg.ffprobe(filePath, (err, metadata) => {
    if (err) {
      logger.error('Failed to get video duration', { error: err });
      return reject(err);
    }
    if (metadata.format.duration === 'N/A') {
      metadata.format.duration = 0;
    }
    return resolve(metadata.format.duration);
  });
});

const trimVideo = async (inputPath, outputPath, start, end) => {
  try {
    await new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .setStartTime(start)
        .setDuration(end - start)
        .output(outputPath)
        .on('end', resolve)
        .on('error', reject)
        .run();
    });
    return outputPath;
  } catch (error) {
    logger.error('Video trimming failed', { error });
    throw error;
  }
};

const mergeVideos = async (inputPaths, outputPath) => {
  try {
    await new Promise((resolve, reject) => {
      let filterComplex = inputPaths.map((p, index) => `[${index}:v] [${index}:a]`).join(' ');
      filterComplex += ` concat=n=${inputPaths.length}:v=1:a=1 [v] [a]`;
      ffmpeg()
        .input(inputPaths[0])
        .input(inputPaths[1])
        .complexFilter(`${filterComplex}`)
        .outputOptions([
          '-map [v]',
          '-map [a]',
        ])
        .output(outputPath)
        .on('end', resolve)
        .on('error', reject)
        .run();
    });

    return outputPath;
  } catch (error) {
    logger.error('Video merging failed', { error });
    throw error;
  }
};

module.exports = {
  getVideoDuration,
  trimVideo,
  mergeVideos,
};

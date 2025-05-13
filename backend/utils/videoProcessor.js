const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const path = require("path");

const resolutions = [
  { suffix: "360p", width: 640, height: 360 },
  { suffix: "480p", width: 854, height: 480 },
  { suffix: "720p", width: 1280, height: 720 },
];

const ensureDirectoryExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const processVideo = (inputPath, outputPath, width, height) => {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .outputOptions([
        `-vf scale=${width}:${height}`,
        "-c:v libx264",
        "-crf 28",
        "-preset veryfast",
        "-c:a aac",
        "-b:a 128k",
        "-movflags +faststart",
      ])
      .save(outputPath)
      .on("end", () => resolve())
      .on("error", (err) => reject(err));
  });
};

const processAllResolutions = async (originalVideoPath, originalVideoName) => {
  ensureDirectoryExists("backend/uploads/videos");

  const baseName = path
    .parse(originalVideoName)
    .name.replace(/[^a-zA-Z0-9_-]/g, "");

  const processedVideoPaths = resolutions.map(
    (res) =>
      `backend/uploads/videos/${Date.now()}_${baseName}_${res.suffix}.mp4`
  );

  await Promise.all(
    resolutions.map((res, index) =>
      processVideo(
        originalVideoPath,
        processedVideoPaths[index],
        res.width,
        res.height
      )
    )
  );

  return processedVideoPaths;
};

module.exports = {
  processAllResolutions,
};

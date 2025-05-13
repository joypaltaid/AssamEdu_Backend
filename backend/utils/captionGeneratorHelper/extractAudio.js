const ffmpeg = require("fluent-ffmpeg");

function extractAudio(videoPath, audioPath) {
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .output(audioPath)
      .audioCodec("libmp3lame")
      .on("start", (cmd) => console.log("FFmpeg command:", cmd))
      .on("end", () => resolve("Audio Extracted Successfully!"))
      .on("error", (err) => reject(`FFmpeg error: ${err.message}`))
      .run();
  });
}

module.exports = { extractAudio };

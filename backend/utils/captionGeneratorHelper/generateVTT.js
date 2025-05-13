const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

function generateVTT(audioPath, outputDir) {
  return new Promise((resolve, reject) => {
    const command = `whisper "${audioPath}" --model base --language en --output_dir "${outputDir}" --output_format vtt`;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        return reject(`Whisper error: ${error.message}`);
      }
      const audioFileName = path.basename(audioPath, path.extname(audioPath));
      const vttFilePath = path.join(outputDir, `${audioFileName}.vtt`);
      if (fs.existsSync(vttFilePath)) {
        resolve(`VTT file generated successfully: ${vttFilePath}`);
      } else {
        reject("VTT file not found after Whisper execution.");
      }
    });
  });
}

module.exports = { generateVTT };

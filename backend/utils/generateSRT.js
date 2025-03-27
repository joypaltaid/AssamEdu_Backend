const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

function generateSRT(audioPath, outputDir) {
    return new Promise((resolve, reject) => {
        const command = `whisper "${audioPath}" --model base --language en --output_dir "${outputDir}" --output_format srt`;
        exec(command, (error, stdout, stderr) => {
            if (error) {
                return reject(`Whisper error: ${error.message}`);
            }
            const audioFileName = path.basename(audioPath, path.extname(audioPath));
            const srtFilePath = path.join(outputDir, `${audioFileName}.srt`);
            if (fs.existsSync(srtFilePath)) {
                resolve(`SRT file generated successfully: ${srtFilePath}`);
            } else {
                reject("SRT file not found after Whisper execution.");
            }
        });
    });
}

module.exports = { generateSRT };

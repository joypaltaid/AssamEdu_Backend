const { extractAudio } = require("../utils/extractAudio.js");
const { generateSRT } = require("../utils/generateSRT.js");
const fs = require("fs");
const path = require("path");

async function generateCaptions(videoPath) {
    try {
        const outputDir = path.join(__dirname, "../uploads/srt"); // Directory for SRT files
        const audioPath = videoPath.replace(path.extname(videoPath), ".mp3");
        const srtPath = path.join(outputDir, `${path.basename(audioPath, ".mp3")}.srt`);

        console.log("Extracting Audio...");
        await extractAudio(videoPath, audioPath);
        console.log("Audio Extraction Completed!");

        console.log("Generating SRT File...");
        await generateSRT(audioPath, outputDir);
        console.log("SRT Generation Completed!");

        // Remove the temporary audio file
        if (fs.existsSync(audioPath)) {
            fs.unlinkSync(audioPath);
            console.log("Temporary audio file deleted:", audioPath);
        }

        return fs.existsSync(srtPath) ? srtPath : null;
    } catch (error) {
        console.error("Error generating captions:", error.message);
        return null;
    }
}

module.exports = { generateCaptions };

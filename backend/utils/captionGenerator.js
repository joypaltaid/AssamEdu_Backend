const { extractAudio } = require("./captionGeneratorHelper/extractAudio.js");
const { generateVTT } = require("./captionGeneratorHelper/generateVTT.js");
const fs = require("fs");
const path = require("path");

async function generateCaptions(videoPath) {
    try {
        const outputDir = path.join(__dirname, "../uploads/vtt");
        const audioPath = videoPath.replace(path.extname(videoPath), ".mp3");
        const vttPath = path.join(outputDir, `${path.basename(audioPath, ".mp3")}.vtt`);

        await extractAudio(videoPath, audioPath);

        await generateVTT(audioPath, outputDir);

        if (fs.existsSync(audioPath)) {
            fs.unlinkSync(audioPath);
        }

        return fs.existsSync(vttPath) ? vttPath : null;
    } catch (error) {
        console.error("Error generating captions:", error.message);
        return null;
    }
}

module.exports = { generateCaptions };

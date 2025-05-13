const path = require("path"); // Add this at top
const fs = require("fs");
const parseVTT = require("./pdfSummaryHelper/parseVTT");
const summarizeText = require("./pdfSummaryHelper/summarize");
const generatePDFBuffer = require("./pdfSummaryHelper/pdfGenerator");
async function processVtt(vttFilePath, pdfOutputPath) {
  try {
    const absoluteVttPath = path.resolve(vttFilePath);
    const absolutePdfPath = path.resolve(pdfOutputPath, "summary.pdf");

    console.log(`Looking for VTT file at: ${absoluteVttPath}`);

    const vttContent = fs.readFileSync(absoluteVttPath, "utf-8");
    const extractedText = parseVTT(vttContent);
    const summary = await summarizeText(extractedText);
    const pdfBuffer = await generatePDFBuffer(summary);

    fs.writeFileSync(absolutePdfPath, pdfBuffer);
    console.log(`PDF successfully created at: ${absolutePdfPath}`);
  } catch (error) {
    console.error("Error processing VTT:", error.message);
    if (error.code === "ENOENT") {
      console.error("File not found. Please check:");
      console.error(`- Does ${vttFilePath} exist?`);
      console.error(`- Current working directory: ${process.cwd()}`);
    }
  }
}

module.exports = {processVtt};

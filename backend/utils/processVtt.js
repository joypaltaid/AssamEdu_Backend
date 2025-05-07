const fs = require('fs');
const parseVTT = require('./pdfSummaryHelper/parseVTT');
const summarizeText = require('./pdfSummaryHelper/summarize');
const generatePDFBuffer = require('./pdfSummaryHelper/pdfGenerator');

async function processVtt(vttFilePath, pdfOutputPath) {
  const vttContent = fs.readFileSync(vttFilePath, 'utf-8');
  const extractedText = parseVTT(vttContent);
  const summary = await summarizeText(extractedText);
  const pdfBuffer = await generatePDFBuffer(summary);
  fs.writeFileSync(pdfOutputPath, pdfBuffer);
}

module.exports = processVtt;

const PDFDocument = require('pdfkit');

async function pdfGenerator(text) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 40 });
      const chunks = [];

      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Optional: Set PDF metadata
      doc.info.Title = 'Transcript Summary';
      doc.info.Author = 'Auto Summarizer';

      doc.fontSize(14).text('Summary of Transcript\n\n', { underline: true });
      doc.fontSize(12).text(text, {
        align: 'left',
        lineGap: 4,
      });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = pdfGenerator;

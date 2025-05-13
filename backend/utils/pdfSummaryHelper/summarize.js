const axios = require('axios');

async function summarizeText(text) {
  const prompt = `Summarize the following transcript:\n\n${text}\n\nSummary:`;

  try {
    const response = await axios.post('http://localhost:11434/api/generate', {
      model: 'mistral',
      prompt: prompt,
      stream: false,
    });

    return response.data.response.trim();
  } catch (error) {
    console.error('Failed to summarize:', error.message);
    throw error;
  }
}
module.exports = summarizeText;
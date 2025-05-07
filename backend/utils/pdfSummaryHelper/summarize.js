const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function summarizeText(text) {
  try {
    // Optional: Trim and limit size for token safety (adjust as needed)
    const safeText = text.slice(0, 6000); // ~3000-4000 tokens
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant that summarizes transcripts." },
        { role: "user", content: `Summarize the following transcript:\n\n${safeText}` },
      ],
    });

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error("OpenAI API error:", error.message);
    throw new Error("Failed to generate summary");
  }
}

module.exports = summarizeText;

const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_SECRET_KEY
});

async function summarizeText(text) {
  try {
    const safeText = text.slice(0, 6000); 
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant that summarizes transcripts." },
        { role: "user", content: `Summarize the following transcript:\n\n${safeText}` },
      ],
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("OpenAI API error:", error.message);
    throw new Error("Failed to generate summary");
  }
}

module.exports = summarizeText;
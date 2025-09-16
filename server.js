require('dotenv').config();
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');

const app = express();
app.use(cors());
app.use(express.json());

const endpoint = "https://models.github.ai/inference";
const model = "openai/gpt-5";
const apiKey = process.env.GITHUB_TOKEN;

console.log("Starting server.js...");
console.log("GITHUB_TOKEN:", apiKey ? "Present" : "Missing");
console.log("PORT:", process.env.PORT);

if (!apiKey) {
  console.error("Missing GITHUB_TOKEN environment variable! Set it in your Render dashboard.");
  process.exit(1);
}

app.post('/ask', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

  try {
    const client = new OpenAI({ baseURL: endpoint, apiKey });
    const response = await client.chat.completions.create({
      messages: [
        { role: "system", content: "" },
        { role: "user", content: prompt }
      ],
      model
    });
    res.json({ result: response.choices[0].message.content });
  } catch (err) {
    console.error("OpenAI API error:", err);
    res.status(500).json({ error: err.message || 'Unknown error' });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

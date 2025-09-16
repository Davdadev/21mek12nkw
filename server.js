require('dotenv').config();
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');

const app = express();
app.use(cors());
app.use(express.json());

// Set your OpenAI endpoint and model here
const endpoint = "https://models.github.ai/inference";
const model = "openai/gpt-5";

// Grab the API key from the environment variable
const apiKey = process.env.GITHUB_TOKEN;

// Startup diagnostics
console.log("Starting server.js...");
console.log("GITHUB_TOKEN:", apiKey ? "Present" : "Missing");
console.log("PORT:", process.env.PORT);

// If the API key is missing, exit with an error
if (!apiKey) {
  console.error("Missing GITHUB_TOKEN environment variable! Set it in your Render dashboard.");
  process.exit(1);
}

// POST endpoint for AI prompts
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
    res.status(500).json({ error: err.message || '


// Simple Node.js server using Express to connect to Gemini API
// Save your Gemini API key in a .env file as GEMINI_API_KEY=your_key_here

require('dotenv').config();

const express = require('express');
const { GoogleGenAI } = require('@google/genai');
const cors = require('cors');
const app = express();
const port = 7500;

app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

app.post('/generate', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required.' });
  }
  try {
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    const config = {
      thinkingConfig: { thinkingBudget: -1 },
      responseMimeType: 'text/plain',
    };
    const model = 'gemini-2.5-flash';
    const contents = [
      {
        role: 'user',
        parts: [ { text: prompt } ],
      },
    ];
    const response = await ai.models.generateContentStream({ model, config, contents });
    res.setHeader('Content-Type', 'text/plain');
    for await (const chunk of response) {
      res.write(chunk.text);
    }
    res.end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

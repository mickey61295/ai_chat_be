// To run this code you need to install the following dependencies:
// npm install @google/genai mime
// npm install -D @types/node

require('dotenv').config();
const { GoogleGenAI } = require('@google/genai');

async function main() {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });
  const config = {
    thinkingConfig: {
      thinkingBudget: -1,
    },
    responseMimeType: 'text/plain',
  };
  const model = 'gemini-2.5-flash';
  const contents = [
    {
      role: 'user',
      parts: [
        {
          text: process.argv[2] || 'Explain how AI works in a few words',
        },
      ],
    },
  ];

  const response = await ai.models.generateContentStream({
    model,
    config,
    contents,
  });
  for await (const chunk of response) {
    process.stdout.write(chunk.text);
  }
  process.stdout.write('\n');
}

main();

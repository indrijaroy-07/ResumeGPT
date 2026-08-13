const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  try {
    const result = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" }).generateContent("Hi");
    console.log("Success with gemini-1.5-flash");
  } catch (err) {
    console.error("Failed with gemini-1.5-flash:", err.message);
  }
}

listModels();

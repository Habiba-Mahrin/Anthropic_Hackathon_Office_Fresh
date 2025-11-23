const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const API_KEY = process.env.GEMINI_API_KEY;

async function listModels() {
  try {
    const genAI = new GoogleGenerativeAI(API_KEY);

    console.log('Fetching available models...\n');
    const models = await genAI.listModels();

    console.log('Available models:');
    models.forEach((model) => {
      console.log(`\n- ${model.name}`);
      console.log(`  Supported methods: ${model.supportedGenerationMethods.join(', ')}`);
    });
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    console.error('\nThis might mean:');
    console.error('1. The API key needs the "Generative Language API" enabled');
    console.error('2. Go to: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com');
    console.error('3. Make sure billing is enabled on your Google Cloud project');
  }
}

listModels();

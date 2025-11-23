const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const API_KEY = process.env.GEMINI_API_KEY;

console.log('API Key loaded:', API_KEY ? 'Yes' : 'No');
console.log('API Key (first 20 chars):', API_KEY?.substring(0, 20));
console.log('API Key length:', API_KEY?.length);

// Test different model names
const modelsToTest = [
  'gemini-1.5-flash',
  'gemini-1.5-pro',
  'gemini-pro',
  'gemini-pro-vision',
  'gemini-1.0-pro',
  'gemini-1.0-pro-vision'
];

async function testModel(modelName) {
  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: modelName });

    const result = await model.generateContent('Say hello');
    const response = await result.response;
    const text = response.text();

    console.log(`✅ ${modelName}: WORKS!`);
    console.log(`   Response: ${text.substring(0, 50)}...`);
    return true;
  } catch (error) {
    console.log(`❌ ${modelName}: ${error.message.substring(0, 100)}`);
    return false;
  }
}

async function testAll() {
  console.log('\nTesting available models...\n');

  for (const modelName of modelsToTest) {
    await testModel(modelName);
  }

  console.log('\n---');
  console.log('If all models failed, your API key might be:');
  console.log('1. A Google Cloud Vision API key (wrong service)');
  console.log('2. Not activated yet (can take a few minutes)');
  console.log('3. Missing API enablement in Google Cloud Console');
  console.log('\nTo get a proper Gemini API key:');
  console.log('Visit: https://aistudio.google.com/app/apikey');
}

testAll();

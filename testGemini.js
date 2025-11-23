const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const API_KEY = process.env.GEMINI_API_KEY;

console.log('Testing Gemini API...');
console.log('API Key (first 20 chars):', API_KEY?.substring(0, 20));
console.log('API Key length:', API_KEY?.length);

async function testGemini() {
  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    console.log('\nSending "hi" to Gemini...');
    const result = await model.generateContent('hi');
    const response = await result.response;
    const text = response.text();

    console.log('\n✅ SUCCESS! Gemini responded:');
    console.log(text);
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    console.error('\nFull error:', error);
  }
}

testGemini();

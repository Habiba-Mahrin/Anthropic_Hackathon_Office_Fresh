require('dotenv').config();

const API_KEY = process.env.GEMINI_API_KEY;

async function testDirectApi() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

  const body = {
    contents: [{
      parts: [{
        text: 'Hello'
      }]
    }]
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();

    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));

    if (response.ok) {
      console.log('\n✅ API key is valid and working!');
    } else {
      console.log('\n❌ API request failed');
      console.log('\nPossible reasons:');
      if (data.error?.message?.includes('API key not valid')) {
        console.log('- This is NOT a valid Gemini API key');
        console.log('- Get one from: https://aistudio.google.com/app/apikey');
      } else if (data.error?.message?.includes('not found')) {
        console.log('- The model is not available for this API key');
        console.log('- Your API key might need to enable the Gemini API');
      }
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testDirectApi();

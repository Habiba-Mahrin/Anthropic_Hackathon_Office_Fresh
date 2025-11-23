require('dotenv').config();

const API_KEY = process.env.GOOGLE_CLOUD_VISION_API_KEY;

console.log('Testing Google Cloud Vision API...');
console.log('API Key (first 20 chars):', API_KEY?.substring(0, 20));
console.log('API Key length:', API_KEY?.length);

async function testVisionApi() {
  const apiUrl = `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`;

  // Create a simple test image (1x1 red pixel in base64)
  const testImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==';

  const requestBody = {
    requests: [
      {
        image: {
          content: testImageBase64,
        },
        features: [
          {
            type: 'LABEL_DETECTION',
            maxResults: 5,
          },
        ],
      },
    ],
  };

  try {
    console.log('\nSending test request to Vision API...');

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    console.log('\nStatus:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));

    if (response.ok && data.responses) {
      console.log('\n✅ SUCCESS! Vision API is working!');
      console.log('The API key is valid and the Vision API is enabled.');
    } else if (data.error) {
      console.log('\n❌ ERROR from Vision API:');
      console.log('Message:', data.error.message);
      console.log('\nPossible solutions:');
      if (data.error.message.includes('API key not valid')) {
        console.log('- Your API key is not valid for Vision API');
        console.log('- Make sure you created the key in Google Cloud Console');
        console.log('- Enable the Vision API at: https://console.cloud.google.com/apis/library/vision.googleapis.com');
      } else if (data.error.message.includes('not enabled')) {
        console.log('- Enable the Vision API in Google Cloud Console');
        console.log('- Visit: https://console.cloud.google.com/apis/library/vision.googleapis.com');
      } else if (data.error.message.includes('quota')) {
        console.log('- You may have exceeded your quota or need to enable billing');
        console.log('- Visit: https://console.cloud.google.com/billing');
      }
    }
  } catch (error) {
    console.error('\n❌ Network error:', error.message);
  }
}

testVisionApi();

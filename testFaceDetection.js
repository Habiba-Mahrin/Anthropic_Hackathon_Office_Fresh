require('dotenv').config();

const API_KEY = process.env.GOOGLE_CLOUD_VISION_API_KEY;

console.log('Testing Google Cloud Vision API Face Detection...');

async function testFaceDetection() {
  const apiUrl = `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`;

  // Use a public test image URL (Google's sample image)
  const requestBody = {
    requests: [
      {
        image: {
          source: {
            imageUri: 'https://cloud.google.com/vision/docs/images/face_detection.png',
          },
        },
        features: [
          {
            type: 'FACE_DETECTION',
            maxResults: 5,
          },
          {
            type: 'LABEL_DETECTION',
            maxResults: 5,
          },
        ],
      },
    ],
  };

  try {
    console.log('Sending face detection request...\n');

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    if (response.ok && data.responses) {
      const result = data.responses[0];

      console.log('✅ SUCCESS!\n');

      if (result.labelAnnotations) {
        console.log('Labels detected:');
        result.labelAnnotations.forEach((label) => {
          console.log(`  - ${label.description} (${(label.score * 100).toFixed(1)}% confidence)`);
        });
      }

      if (result.faceAnnotations && result.faceAnnotations.length > 0) {
        console.log('\nFaces detected:', result.faceAnnotations.length);
        result.faceAnnotations.forEach((face, index) => {
          console.log(`\nFace ${index + 1}:`);
          console.log(`  Roll angle: ${face.rollAngle?.toFixed(2)}° (head tilt)`);
          console.log(`  Pan angle: ${face.panAngle?.toFixed(2)}° (head turn)`);
          console.log(`  Tilt angle: ${face.tiltAngle?.toFixed(2)}° (head up/down)`);
          console.log(`  Detection confidence: ${(face.detectionConfidence * 100).toFixed(1)}%`);
        });

        console.log('\n✅ Face detection is working! This will be used for pose analysis.');
      } else {
        console.log('\nNo faces detected in test image.');
      }
    } else {
      console.log('❌ Error:', JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testFaceDetection();

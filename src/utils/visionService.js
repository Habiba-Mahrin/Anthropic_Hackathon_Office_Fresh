import { GOOGLE_CLOUD_VISION_API_KEY } from '@env';

/**
 * Analyzes a pose using Google Cloud Vision API
 * Uses Vision API features: LABEL_DETECTION and TEXT_DETECTION to understand the image
 * Then provides feedback based on the detected content
 */
export async function analyzePose(imageBase64, exerciseName) {
  try {
    const apiUrl = `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_CLOUD_VISION_API_KEY}`;

    const requestBody = {
      requests: [
        {
          image: {
            content: imageBase64,
          },
          features: [
            {
              type: 'LABEL_DETECTION',
              maxResults: 10,
            },
            {
              type: 'FACE_DETECTION',
              maxResults: 1,
            },
          ],
        },
      ],
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Vision API error:', errorData);
      throw new Error(`Vision API error: ${response.status}`);
    }

    const data = await response.json();
    const result = data.responses[0];

    // Extract labels and face detection
    const labels = result.labelAnnotations || [];
    const faces = result.faceAnnotations || [];

    // Analyze the results to determine if pose is correct
    const analysis = analyzePoseFromVision(labels, faces, exerciseName);

    return analysis;
  } catch (error) {
    console.error('Vision API error:', error);
    return {
      isCorrect: false,
      feedback: 'Error analyzing pose. Please check your connection.',
    };
  }
}

/**
 * Analyzes Vision API results to determine if the pose is correct
 * This is a simplified version - you can enhance it with more sophisticated logic
 */
function analyzePoseFromVision(labels, faces, exerciseName) {
  // Check if a person is detected
  const personDetected = labels.some(
    (label) =>
      label.description.toLowerCase().includes('person') ||
      label.description.toLowerCase().includes('human') ||
      label.description.toLowerCase().includes('face') ||
      label.description.toLowerCase().includes('head')
  );

  if (!personDetected && faces.length === 0) {
    return {
      isCorrect: false,
      feedback: 'Please position yourself in frame',
    };
  }

  // Detect if face is present
  const faceDetected = faces.length > 0;

  if (!faceDetected) {
    return {
      isCorrect: false,
      feedback: 'Please ensure your face is visible in the camera',
    };
  }

  // For neck stretch, check head tilt
  if (exerciseName.toLowerCase().includes('neck')) {
    const face = faces[0];

    // Check if face has tilt information
    if (face.rollAngle !== undefined) {
      const rollAngle = face.rollAngle;

      // For a right neck stretch, we expect a right tilt (negative roll angle)
      // Typically between -15 to -35 degrees is a good stretch
      if (rollAngle < -10 && rollAngle > -45) {
        return {
          isCorrect: true,
          feedback: 'Great form! Keep holding this position.',
        };
      } else if (rollAngle > 10 && rollAngle < 45) {
        return {
          isCorrect: false,
          feedback: 'You are tilting to the left. Please tilt your head to the right.',
        };
      } else if (rollAngle >= -10 && rollAngle <= 10) {
        return {
          isCorrect: false,
          feedback: 'Please tilt your head more to the right.',
        };
      } else {
        return {
          isCorrect: false,
          feedback: 'Adjust your head position - keep the tilt gentle and controlled.',
        };
      }
    }
  }

  // Default response if we can't determine
  return {
    isCorrect: false,
    feedback: 'Position yourself for the neck stretch - tilt your head to the right.',
  };
}

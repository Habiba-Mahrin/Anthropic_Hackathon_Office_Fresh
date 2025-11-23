import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY } from '@env';

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

export async function analyzePose(imageBase64, exerciseName) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are analyzing if a person is performing a "${exerciseName}" stretch correctly.

Look at this image and determine:
1. Is the person visible and in frame?
2. Are they performing the "${exerciseName}" stretch?
3. Is their form correct for this stretch?

For a neck stretch to the right, the correct position is:
- Person sitting upright
- Head tilted to the right side
- Right ear moving toward right shoulder
- Left shoulder relaxed and down
- Body still and not twisted

Respond ONLY with a JSON object in this exact format:
{
  "isCorrect": true or false,
  "feedback": "brief feedback message"
}`;

    const imagePart = {
      inlineData: {
        data: imageBase64,
        mimeType: 'image/jpeg',
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    // Parse JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    // Fallback if JSON parsing fails
    return {
      isCorrect: false,
      feedback: 'Unable to analyze pose. Please try again.',
    };
  } catch (error) {
    console.error('Gemini API error:', error);
    return {
      isCorrect: false,
      feedback: 'Error analyzing pose. Please check your connection.',
    };
  }
}

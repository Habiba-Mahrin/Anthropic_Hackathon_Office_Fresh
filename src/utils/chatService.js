import { GOOGLE_CLOUD_VISION_API_KEY } from '@env';

/**
 * Simple AI chat service for wellness questions
 * Uses a mock AI response for now since Gemini API wasn't working
 * You can replace this with a real API when you have a working Gemini key
 */

const wellnessKnowledge = {
  'office syndrome': 'Office syndrome is a collection of symptoms caused by prolonged sitting and poor posture. It commonly includes neck pain, back pain, shoulder tension, and eye strain.',
  'neck pain': 'Neck pain from office work is often caused by looking down at screens. Try the 20-20-20 rule: every 20 minutes, look 20 feet away for 20 seconds. Regular neck stretches also help!',
  'back pain': 'Back pain can result from poor posture and lack of lumbar support. Ensure your chair supports your lower back, and take regular breaks to stand and stretch.',
  'posture': 'Good posture means: feet flat on the floor, back supported, shoulders relaxed, and screen at eye level. Adjust your workspace to support this position.',
  'stretching': 'Regular stretching breaks (5 minutes every 30-60 minutes) can reduce pain by 30% and increase productivity by 25%. Start with simple neck, shoulder, and back stretches.',
  'eye strain': 'Eye strain is common from screen time. Follow the 20-20-20 rule and ensure proper lighting. Your screen should be about arm\'s length away and slightly below eye level.',
  'breaks': 'Taking regular breaks is crucial. Aim for a 5-minute break every 30-60 minutes. Use this time to stand, stretch, and move around.',
  'ergonomics': 'Proper ergonomics includes: adjustable chair, screen at eye level, keyboard and mouse at elbow height, and feet flat on floor. Small adjustments make a big difference.',
};

/**
 * Generates a response to a wellness question
 * This is a simple keyword-based system. Replace with real AI when available.
 */
export async function askWellnessQuestion(question) {
  try {
    // Simulate API delay for realism
    await new Promise((resolve) => setTimeout(resolve, 500));

    const lowerQuestion = question.toLowerCase();

    // Check for keywords in the question
    for (const [keyword, response] of Object.entries(wellnessKnowledge)) {
      if (lowerQuestion.includes(keyword)) {
        return {
          success: true,
          message: response,
        };
      }
    }

    // Check for greeting
    if (lowerQuestion.match(/\b(hi|hello|hey|greetings)\b/)) {
      return {
        success: true,
        message: "Hello! I'm your wellness assistant. I can answer questions about office syndrome, posture, stretching, ergonomics, and workplace health. What would you like to know?",
      };
    }

    // Check for thanks
    if (lowerQuestion.match(/\b(thank|thanks|thx)\b/)) {
      return {
        success: true,
        message: "You're welcome! Feel free to ask me anything about workplace wellness. Your health is important!",
      };
    }

    // Default response for unknown questions
    return {
      success: true,
      message: "I can help with questions about office syndrome, neck pain, back pain, posture, stretching, ergonomics, eye strain, and taking breaks. What would you like to know more about?",
    };
  } catch (error) {
    console.error('Chat service error:', error);
    return {
      success: false,
      message: 'Sorry, I encountered an error. Please try again.',
    };
  }
}

/**
 * Alternative: Real Gemini API integration (use when you have a working key)
 * Uncomment this and replace the function above when ready
 */
/*
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function askWellnessQuestion(question) {
  try {
    const genAI = new GoogleGenerativeAI(GOOGLE_CLOUD_VISION_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `You are a wellness expert helping office workers understand and prevent office syndrome.
Answer this question concisely and helpfully (2-3 sentences max):

${question}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return {
      success: true,
      message: text,
    };
  } catch (error) {
    console.error('Gemini API error:', error);
    return {
      success: false,
      message: 'Sorry, I encountered an error. Please try again.',
    };
  }
}
*/

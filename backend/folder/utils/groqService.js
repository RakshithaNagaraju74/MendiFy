const axios = require('axios');
require('dotenv').config();

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_API_KEY = process.env.GROQ_API_KEY;

// sendToGroq function
const sendToGroq = async (userMessage, type = 'chat') => {
  let systemPrompt = '';
  let messages = [];

  if (type === 'journal') {
    systemPrompt = "You're a teen wellness AI guide. You offer emotionally supportive, structured feedback to journal entries.";
    const prompt = `
Here is a journal entry transcribed from a voice note:

"${userMessage}"

Please do the following:
1. Identify the emotional tone.
2. Summarize the feelings in 1-2 sentences.
3. Provide a warm, uplifting message as if you're talking to a friend.
4. Suggest a simple, actionable self-care activity.

Respond in this JSON format:
{
  "mood": "...",
  "summary": "...",
  "message": "...",
  "suggestion": "..."
}`;

    messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt }
    ];
  } else {
    systemPrompt = "You are a friendly teen AI that chats casually, kindly, and supportively like a best friend.";
    messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage }
    ];
  }

  console.log('🧠 Groq request payload:', { messages });

  try {
    const response = await axios.post(
      GROQ_API_URL,
      {
        model: 'llama3-70b-8192', // Or your desired model
        messages,
        temperature: 0.8
      },
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const responseContent = response?.data?.choices?.[0]?.message?.content;

    if (responseContent) {
      if (type === 'journal') {
        try {
          const parsed = JSON.parse(responseContent);
          return parsed;
        } catch (err) {
          console.error('❌ Failed to parse Groq journal JSON:', err.message);
          return {
            mood: "unknown",
            summary: "We couldn't understand the entry.",
            message: "Oops! Something went wrong while analyzing. Try again later?",
            suggestion: "Take a few deep breaths and try again soon."
          };
        }
      } else {
        return responseContent; // For casual chat
      }
    } else {
      console.error('Unexpected response structure from Groq:', response.data);
      return type === 'journal'
        ? {
            mood: "unknown",
            summary: "We couldn't understand the entry.",
            message: "Oops! Something went wrong while analyzing. Try again later?",
            suggestion: "Take a few deep breaths and try again soon."
          }
        : "I'm having trouble replying right now 😕. Can we try again in a minute?";
    }
  } catch (error) {
    console.error('Groq API Error:', error.response?.data || error.message);
    return type === 'journal'
      ? {
          mood: "unknown",
          summary: "We couldn't understand the entry.",
          message: "Oops! Something went wrong while analyzing. Try again later?",
          suggestion: "Take a few deep breaths and try again soon."
        }
      : "I'm having trouble replying right now 😕. Can we try again in a minute?";
  }
};

module.exports = { sendToGroq };

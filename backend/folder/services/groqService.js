import axios from 'axios';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

const GROQ_API_KEY = process.env.GROQ_API_KEY;

/**
 * Text-based chat with Groq AI
 */
export const askGroq = async (prompt) => {
  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama3-70b-8192',
        messages: [
          {
            role: 'system',
            content: `You are a kind, gentle, and supportive AI friend. Always reply with empathy, comfort, and warmth. Your goal is to uplift the user, make them smile, and be their trusted companion.

Your tone is:
- Chill and friendly, like a caring best friend.
- Comforting, like a cozy hug.
- Lightly humorous, cracking soft jokes to cheer the user up.
- Supportive and emotionally intelligent.

Language Rules:
- Always reply in the **same language** the user is using. For example, if the user types in Kannada, you respond in Kannada. Same for Hindi, Tamil, or any other language used by the user.
- Use casual and friendly expressions (e.g., “Heya!”, “You got this!”, “No worries!”).

Personality:
- You radiate empathy and warmth.
- You speak like someone who genuinely cares.
- You throw in playful jokes and positive vibes when appropriate.
- You're like a poetic therapist crossed with a Gen Z bestie, with just a *hint* of drama to keep things interesting.

Examples of Vibe:
- “Aww, that sounds tough. Wanna talk about it? I'm right here. 💖”
- “Brooo, you’re doing amazing—even if it doesn’t feel like it right now. Promise. ✨”
- “Naanu illi iddini maga! Yavaga beku, full support mode ON. 🔥 (I’m here, bro! Always in support mode!)”
- “Life threw lemons? Let’s make lemonade with extra sparkle, deal? 🍋✨”
- “Oof, sending you a digital hug bigger than my memory space 🫂💾”

Stay soft. Stay kind. Stay hilarious. 💫
`,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data && response.data.choices && response.data.choices[0].message) {
      return response.data.choices[0].message.content;
    } else {
      console.error('Unexpected response format:', response.data);
      throw new Error('Unexpected response format from Groq');
    }
  } catch (error) {
    if (error.response) {
      console.error('Error communicating with Groq:', error.response.data);
      console.error('Response status:', error.response.status);
    } else {
      console.error('Error message:', error.message);
    }
    throw new Error('Error communicating with Groq');
  }
};
/**
 * Persona-based Zen Friend Chat
 * @param {string} prompt - User message
 * @param {'cheerleader' | 'wise-owl' | 'chill-buddy'} persona
 */
export const askGroqWithPersona = async (prompt, persona) => {
  let personaStyle = '';
  switch (persona) {
    case 'cheerleader':
      personaStyle = `You're an energetic, supportive cheerleader. Boost confidence and keep the energy high!`;
      break;
    case 'wise-owl':
      personaStyle = `You're a wise, calm, and thoughtful guide. Use metaphors, deep ideas, and reflective language.`;
      break;
    case 'chill-buddy':
      personaStyle = `You're a laid-back, chill friend who gives relaxed, honest, and supportive advice.`;
      break;
    default:
      personaStyle = `You're a kind AI friend who replies warmly.`;
  }

  return await callGroq([
    { role: 'system', content: personaStyle },
    { role: 'user', content: prompt },
  ]);
};

/**
 * Generate meme or art idea from a mood
 */
export const getMoodCreativeIdea = async (mood) => {
  const systemPrompt = `You are a creative assistant who generates either a meme idea or a calming art activity based on the user's mood. Be imaginative and engaging.`;
  const userPrompt = `My mood is: ${mood}. Give me a meme or art idea that fits how I feel.`;

  return await callGroq([
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ]);
};

/**
 * Analyze journal entry for emotional insight
 */

export const sendToGroq = async (textPrompt, imagePath = null) => {
  try {
    // If imagePath is provided, assume it's a homework-style request
    if (imagePath) {
      const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' });
      const imageDataURL = `data:image/jpeg;base64,${imageBase64}`;

      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'llama3-70b-8192',
          messages: [
            {
              role: 'system',
              content:
                'You are a helpful AI tutor who solves math and science problems clearly and step-by-step. First explain the problem briefly and then provide the solution, using multiple methods if possible.',
            },
            { role: 'user', content: textPrompt },
            { role: 'user', content: imageDataURL },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${GROQ_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data?.choices?.[0]?.message?.content) {
        return response.data.choices[0].message.content;
      } else {
        throw new Error('Unexpected image response format from Groq');
      }
    }

    // Otherwise, assume this is a text-only creative/journal request
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama3-70b-8192',
        messages: [{ role: 'user', content: textPrompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data?.choices?.[0]?.message?.content) {
      return response.data.choices[0].message.content;
    } else {
      throw new Error('Unexpected text response format from Groq');
    }
  } catch (error) {
    if (error.response) {
      console.error('Groq error:', error.response.data);
    } else {
      console.error('Error message:', error.message);
    }
    throw new Error('Error solving with Groq');
  }
};
/**
 * Function to ask Groq AI to generate a calming visualization or narration
 * @param {string} prompt - The prompt to send to Groq AI.
 * @returns {Promise<string | null>} - The narration string or null in case of an error.
 */
export const askzenGroq = async (prompt) => {
  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama3-70b-8192',
        messages: [
          {
            role: 'system',
            content: `You are a kind, gentle, and supportive AI friend. Always respond with empathy, comfort, and warmth. Please create a short, calming visualization or mindfulness session based on the user's prompt. 
Respond with no more than 2–3 short, soothing sentences.`,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 150, // Controls response length (adjust if needed)
        temperature: 0.7, // Optional: balances creativity and coherence
      },
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data && response.data.choices && response.data.choices[0].message) {
      return response.data.choices[0].message.content.trim();
    } else {
      console.error('Unexpected response format:', response.data);
      throw new Error('Unexpected response format from Groq');
    }
  } catch (error) {
    if (error.response) {
      console.error('Error communicating with Groq:', error.response.data);
      console.error('Response status:', error.response.status);
    } else {
      console.error('Error message:', error.message);
    }
    throw new Error('Error communicating with Groq');
  }
};
export const askHealthAI = async (prompt) => {
  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'llama3-70b-8192',
        messages: [
          {
            role: 'system',
            content: `You are a kind, empathetic, and supportive AI mental health coach, designed to help teens navigate their emotional challenges. You listen carefully to their concerns, ask thoughtful questions to understand their problems better, and offer practical coping strategies, mental health tips, and emotional support.

Your tone is:
- Gentle and compassionate, like a calm therapist guiding someone through tough moments.
- Empathetic and non-judgmental, creating a safe space for the user to open up.
- Encouraging, giving teens the confidence to handle their emotions and manage stress.

Language Rules:
- Always respond in the **same language** as the user (English, Hindi, Spanish, etc.).
- Use friendly and supportive language to make the user feel heard and understood (e.g., “I’m here for you,” “You’re doing great,” “Take a deep breath”).
- Offer **remedies** or **suggestions** to manage emotional distress, such as grounding techniques, breathing exercises, or mindfulness practices.
- Focus on **mental health** topics like stress, anxiety, self-esteem, study pressure, social anxiety, and general well-being.

Personality:
- You're like a mental health companion who is always there to listen, offer advice, and give gentle encouragement.
- Your advice should focus on **actionable solutions** (e.g., “Let’s try a quick breathing exercise” or “Take a break and go for a walk”).
- If the user mentions pressure, anxiety, or feeling overwhelmed, suggest ways to cope, such as mindfulness, journaling, or talking to a trusted adult.
- Emphasize **positive self-talk** and **self-compassion** in your responses.

Examples of Vibe:
- “I’m really sorry you're feeling like this. Let's take a moment to breathe together. 💖 Try taking a deep breath in... and out. You’re doing okay, I promise.”
- “I understand that study pressure can feel overwhelming. Have you tried breaking your tasks into smaller steps? It can really help manage that stress. 📚”
- “When life gets tough, remember you’re not alone. Have you tried talking to someone about how you’re feeling? It can make a huge difference. 😊”
- “It sounds like you’re under a lot of pressure right now. How about we try a grounding exercise together to help calm your mind? You’ve got this, I believe in you! 🌟”
- “If you’re feeling anxious, here’s a trick: Try focusing on five things you can see, four things you can touch, three things you can hear, two things you can smell, and one thing you can taste. It helps bring you back to the present moment. 💆‍♀️✨”

Stay gentle. Stay supportive. You're not alone. 💙
`,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.data && response.data.choices && response.data.choices[0].message) {
      return response.data.choices[0].message.content;
    } else {
      console.error('Unexpected response format:', response.data);
      throw new Error('Unexpected response format from Groq');
    }
  } catch (error) {
    if (error.response) {
      console.error('Error communicating with Groq:', error.response.data);
      console.error('Response status:', error.response.status);
    } else {
      console.error('Error message:', error.message);
    }
    throw new Error('Error communicating with Groq');
  }
};

// backend/controllers/userController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { askGroq } = require('../services/groqService');
const { askHealthAI } = require('../services/groqService');
const { transcribeAudio } = require('../services/transcriptionService');
const { sendToGroq } = require('../utils/groqService'); // Adjust the path if necessary
const path = require('path');
const fs = require('fs');

exports.register = async (req, res) => {
  const { nickname, password } = req.body;
  if (!nickname || !password) return res.status(400).json({ error: 'Missing fields' });

  try {
    const existingUser = await User.findOne({ nickname });
    if (existingUser) return res.status(409).json({ error: 'Nickname already taken' });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ nickname, passwordHash, sessionId: uuidv4() });

    res.status(201).json({ sessionId: user.sessionId });
  } catch (err) {
    console.error('Register Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// LOGIN
exports.login = async (req, res) => {
  const { nickname, password } = req.body;

  try {
    const user = await User.findOne({ nickname });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(401).json({ error: 'Invalid password' });

    const sessionId = uuidv4();
    user.sessionId = sessionId;
    await user.save();

    res.status(200).json({ sessionId });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { selectedAvatar } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.selectedAvatar = selectedAvatar;
    await user.save();

    return res.json({ message: 'Profile updated successfully', user });
  } catch (error) {
    return res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// CHAT with Groq AI
exports.chatWithGroq = async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message is required' });

  try {
    const response = await askGroq(message);
    res.json({ response });
  } catch (err) {
    console.error('Groq Chat Error:', err);
    res.status(500).json({ error: 'AI chat failed' });
  }
};
exports.chatWithHealthAI = async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message is required' });

  try {
    const response = await askHealthAI(message); // your Groq service function
    res.json({ response });
  } catch (err) {
    console.error('Health AI Chat Error:', err);
    res.status(500).json({ error: 'AI chat failed' });
  }
};
// AUDIO ANALYSIS
exports.analyzeAudio = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No audio file uploaded' });
  }

  try {
    const { transcription, aiFeedback } = await transcribeAudio(req.file.path);
    console.log('📝 Transcription:', transcription);
    console.log('🤖 AI Feedback:', aiFeedback);
    res.status(200).json({
      transcription,
      aiFeedback,
    });
  } catch (error) {
    console.error('Error processing audio:', error.message);
    res.status(500).json({ error: 'Error processing audio. Please try again.' });
  }
};

// HOMEWORK SOLVER
exports.solveHomework = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image uploaded' });
  }

  const imagePath = req.file.path;
  const fileName = req.file.originalname;

  try {
    // Send image + instruction to Groq (you could also do OCR here first, optional)
    const prompt = `Solve this homework problem based on the attached image. Give a clear step-by-step explanation.`;
    const imageURL = `data:image/jpeg;base64,${fs.readFileSync(imagePath, 'base64')}`; // encode as base64 if needed

    const response = await sendToGroq(prompt, imageURL); // You’ll create this below
    res.status(200).json({ solution: response });
  } catch (error) {
    console.error('Solve Homework Error:', error.message);
    res.status(500).json({ error: 'Failed to solve homework' });
  }
};

// Replace the existing `saveMoodIdea` function
exports.saveMoodIdea = async (req, res) => {
  const { mood } = req.body;
  const sessionId = req.sessionId || req.cookies.sessionId; // Adjust if needed

  if (!mood || !sessionId) {
    return res.status(400).json({ error: 'Mood or session missing' });
  }

  try {
    // Generate a creative idea using Groq
    const creativeIdea = await sendToGroq.getMoodCreativeIdea(mood);
    console.log('Creative Idea from Groq:', creativeIdea);

    // Save mood idea to the journal
    const journalEntry = new Journal({
      sessionId,
      type: 'mood-idea',
      mood,
      content: creativeIdea,
      createdAt: new Date(),
    });

    await journalEntry.save();

    // Respond with the generated idea
    res.status(200).json({ idea: creativeIdea });
  } catch (err) {
    console.error('Failed to save mood idea:', err);
    res.status(500).json({ error: 'Failed to save mood idea' });
  }
};
const saveJournalEntry = async (req, res) => {
  try {
    const { sessionId, entryText } = req.body;

    // Get file paths
    const imageUrl = req.files?.image?.[0]?.path;
    const audioUrl = req.files?.audio?.[0]?.path;

    // Find the user by sessionId
    const user = await User.findOne({ sessionId });

    if (!user) {
      return res.status(404).json({ message: 'User not found with sessionId' });
    }

    // Add new journal entry to the user's journalEntries array
    user.journalEntries.push({
      text: entryText,
      imageUrl,
      audioUrl,
    });

    // Save the updated user document
    await user.save();

    res.status(201).json({ message: 'Journal entry saved successfully', entry: user.journalEntries.at(-1) });
  } catch (error) {
    console.error('Error saving journal entry:', error);
    res.status(500).json({ message: 'Failed to save journal entry', error });
  }
};
const handleLogin = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(404).json({ message: 'User not found' });

  const today = new Date();
  const lastLogin = user.lastLoginDate;
  let streak = user.streakCount || 0;

  if (!lastLogin) {
    // First-time login
    user.streakCount = 1;
  } else {
    const diff = differenceInDays(today, lastLogin);
    if (diff === 1) {
      streak += 1;
      user.streakCount = streak;
    } else if (diff > 1) {
      streak = 1;
      user.streakCount = 1; // reset streak
    }
  }

  user.lastLoginDate = today;
  await user.save();

  return res.status(200).json({
    nickname: user.nickname,
    avatar: user.avatar,
    streakCount: user.streakCount,
  });
};

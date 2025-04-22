const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const userController = require('../controllers/userController');
const fs = require('fs'); // Import fs once
const User = require('../models/User');



const fileFilter = (req, file, cb) => {
  // Updated allowedFileTypes regex to handle both image and audio files properly
  const allowedFileTypes = /jpeg|jpg|png|gif|mp3|wav|audio\/mpeg|audio\/wav/; // Allowed file types (images and audio)

  // Log the file information to debug
  console.log('Uploaded file:', file);

  const extname = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype.toLowerCase();  // Ensure mimetype is in lowercase for comparison

  // Log the extensions and mimetypes being compared
  console.log('File Extension:', extname);
  console.log('File Mimetype:', mimetype);

  const isValidExtname = allowedFileTypes.test(extname);
  const isValidMimetype = allowedFileTypes.test(mimetype);

  // Log the validity of both checks
  console.log('Is Valid Extension:', isValidExtname);
  console.log('Is Valid Mimetype:', isValidMimetype);

  if (isValidExtname && isValidMimetype) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('Only image and audio files are allowed!'), false); // Reject the file
  }
};

// Now, use the fileFilter in the multer configurati

const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = `${Date.now()}${ext}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });
// Audio analysis route (no session ID needed)
router.post('/users/analyze-audio-entry', upload.single('audio'), userController.analyzeAudio);

// Auth Routes
router.post('/auth/register', userController.register);  // POST: /api/auth/register
router.post('/auth/login', userController.login);        // POST: /api/auth/login
router.post('/chat', userController.chatWithGroq);
const authenticateUser = require('../middleware/authMiddleware');
// Homework solver route
router.post('/solve-homework', upload.single('image'), userController.solveHomework);
router.post('/mood-creative', userController.saveMoodIdea);
router.post('/health-ai/chat', userController.chatWithHealthAI);
router.get("/profile", authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: "User not found." });

    res.json({
      nickname: user.nickname,
      lastLoginDate: user.lastLoginDate,
      streakCount: user.streakCount,
      selectedAvatar: user.selectedAvatar || "",
    });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong." });
  }
});

router.put("/profile", authenticateUser, async (req, res) => {
  try {
    const { selectedAvatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.userId,
      { selectedAvatar },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: "User not found." });

    res.json({ message: "Profile updated", user });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong." });
  }
});


// Example: Express route definition
router.post(
  '/journalEntries/:sessionId',
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'audio', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const { entryText } = req.body;
      const { sessionId } = req.params;

      // Check if entry text is provided
      if (!entryText) {
        return res.status(400).json({ error: 'Entry text is required.' });
      }

      // Generate file URLs if provided
      const imageUrl = req.files?.image ? `/uploads/${req.files.image[0].filename}` : null;
      const audioUrl = req.files?.audio ? `/uploads/${req.files.audio[0].filename}` : null;

      // Find the user using sessionId
      const user = await User.findOne({ sessionId });

      if (!user) {
        return res.status(404).json({ error: 'User not found.' });
      }

      // Push new journal entry into user's journalEntries array
      user.journalEntries.push({
        text: entryText,
        imageUrl,
        audioUrl,
      });

      await user.save();

      res.status(201).json({
        message: 'Journal entry added successfully!',
        journalEntries: user.journalEntries,
      });
    } catch (error) {
      console.error('Error adding journal entry:', error);
      res.status(500).json({ error: 'Something went wrong. Please try again.' });
    }
  }
);


module.exports = router;

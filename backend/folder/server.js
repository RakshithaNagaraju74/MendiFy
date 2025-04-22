// Load environment variables from .env file
require('dotenv').config({ path: './.env' });

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Importing Routes
const userRoutes = require('./routes/userRoutes');
const Tesseract = require('tesseract.js');
const { sendToGroq } = require('./services/groqService');
const authMiddleware = require('./middleware/authMiddleware');
const { askGroq } = require('./services/groqService');
const { getHistoricalContext } = require('./services/groqService');
const { analyzeJournalEntry } =require('./services/groqService');
const User = require('./models/User'); // Adjust the path based on where your User model is located
// Import the Journal model
// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Middleware for parsing JSON data
app.use(express.urlencoded({ extended: true })); // Middleware for parsing URL-encoded data
app.use(express.static(path.join(__dirname, 'public')));
// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Set up multer for handling file uploads (only images in this example)
const upload = multer({
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit the file size (5MB)
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadsDir); // Save the file to the uploads directory
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname)); // Create a unique filename
    }
  })
});

// Middleware to check if sessionId exists (simplified)
const checkSession = (req, res, next) => {
  const sessionId = req.headers['authorization'];
  if (!sessionId) {
    return res.status(401).json({ error: 'Unauthorized. No sessionId found.' });
  }
  // In a real app, you would validate sessionId here
  next();
};

// Journal upload route using session check middleware
// Journal upload route using authenticateUser middleware



// Homework upload route for solving homework
app.post('/api/solve-homework', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    const filePath = req.file.path;
    console.log('File uploaded to:', filePath);

    // 🧠 OCR: Extract text from image
    const { data: { text } } = await Tesseract.recognize(filePath, 'eng');
    console.log('Extracted text:', text);

    if (!text.trim()) {
      return res.status(400).json({ error: 'Could not extract any text from image.' });
    }

    // 💡 AI: Solve the problem using Groq
    const solution = await sendToGroq(`Solve this problem: ${text}`, filePath);

    return res.status(200).json({ solution });
  } catch (error) {
    console.error('Error solving homework:', error.message);
    return res.status(500).json({ error: 'An error occurred while solving the homework.' });
  }
});
app.post('/api/users/mood-creative',authMiddleware, async (req, res) => {
  const { mood } = req.body;

  try {
    const idea = await sendToGroq(
      `My mood is: ${mood}. Give me a meme or calming art idea that fits how I feel.`
    );
    res.json({ idea });
  } catch (err) {
    console.error('Error generating creative idea:', err);
    res.status(500).json({ error: 'Failed to generate idea.' });
  }
});
app.use('/api/users', require('./routes/userRoutes'));
app.put('/api/users/profile', authMiddleware, async (req, res) => {
  const { nickname, password } = req.body;
  try {
    if (nickname) req.user.nickname = nickname;
    if (password) req.user.passwordHash = await bcrypt.hash(password, 10);
    await req.user.save();
    res.json({ message: 'Profile updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Error updating profile' });
  }
});
app.get('/api/users/profile', authMiddleware, async (req, res) => {
  try {
    const sessionId = req.user.sessionId;
    const user = await User.findOne({ sessionId }).select('-passwordHash');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching profile' });
  }
});

app.post('/api/zenfriend', async (req, res) => {
  try {
    const { prompt } = req.body;
    const response = await askGroq(prompt); // Get response from Groq
    res.json({ narration: response }); // Send back the narration to the frontend
  } catch (error) {
    console.error("Error in /api/zenfriend:", error);
    res.status(500).json({ error: "An error occurred while fetching the narration." });
  }
});
// Import routes
app.use('/api', userRoutes);

app.post('/api/get-historical-context', async (req, res) => {
  const { timePeriod } = req.body;
  console.log('Received timePeriod:', timePeriod); // ✅ Add this

  if (!timePeriod) {
    return res.status(400).json({ error: 'Time period is required' });
  }

  try {
    const context = await getHistoricalContext(timePeriod);
    res.json({ context });
  } catch (error) {
    console.error('Error in /api/get-historical-context:', error);

    // Add this to see actual Groq error message
    if (error.response) {
      console.error('Groq Error Response:', error.response.data);
    }

    res.status(500).json({ error: 'Error fetching historical context' });
  }
});
// This will analyze the journal entry text and return feedback
app.post(
  '/api/journalEntries/:sessionId',
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'audio', maxCount: 1 }
  ]),
  async (req, res) => {
    console.log('Body:', req.body);
    console.log('Files:', req.files);

    try {
      const { entryText } = req.body;
      const { sessionId } = req.params;

      if (!entryText) {
        return res.status(400).json({ error: 'Entry text is required' });
      }

      const imageUrl = req.files?.image ? `/uploads/${req.files.image[0].filename}` : null;
      const audioUrl = req.files?.audio ? `/uploads/${req.files.audio[0].filename}` : null;

      const journalEntry = new JournalEntry({
        sessionId,
        entryText,
        imageUrl,
        audioUrl
      });

      await journalEntry.save();

      res.status(201).json({
        message: 'Journal entry created successfully',
        journalEntry
      });
    } catch (err) {
      console.error('Error adding journal entry:', err);
      res.status(500).json({ error: 'Something went wrong. Please try again.' });
    }
  }
);
// Fetch Journal Entries (with date filtering)
app.get('/api/journalEntries/:sessionId', async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { startDate, endDate } = req.query;

    const user = await User.findOne({ sessionId });
    if (!user) return res.status(404).send('User not found');

    let journalEntries = user.journalEntries;

    // Apply date filter if provided
    if (startDate && endDate) {
      journalEntries = journalEntries.filter(entry => {
        const createdAt = new Date(entry.createdAt);
        return createdAt >= new Date(startDate) && createdAt <= new Date(endDate);
      });
    }

    res.json(journalEntries);
  } catch (err) {
    res.status(500).send('Error fetching journal entries');
  }
});

// Serve uploaded files
app.use('/uploads', express.static('uploads'));
// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

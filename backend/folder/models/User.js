// models/User.js
const mongoose = require('mongoose');

const journalEntrySchema = new mongoose.Schema({
  text: String,
  imageUrl: String,
  audioUrl: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const userSchema = new mongoose.Schema(
  {
    nickname: {
      type: String,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    sessionId: {
      type: String,
      required: true,
    },
    journalEntries: [journalEntrySchema],
    lastLoginDate: {
      type: Date,
      default: null,
    },
    streakCount: {
      type: Number,
      default: 0,
    }, // Subdocument array
  },
  
  {
    timestamps: true, // Automatically create createdAt and updatedAt
  }
);

// Adding index for better search performance
const User = mongoose.model('User', userSchema);

module.exports = User;

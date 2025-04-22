// backend/services/transcriptionService.js
const { execSync } = require('child_process');
const path = require('path');
const { sendToGroq } = require('../utils/groqService');

const transcribeAudio = async (audioPath) => {
  try {
    // Path to the transcription Python script
    const scriptPath = path.join(__dirname, '../utils/transcribe.py');
    
    // Run the Python script to transcribe the audio file
    const resultBuffer = execSync(`python "${scriptPath}" "${audioPath}"`);
    const transcription = resultBuffer.toString().trim();
    console.log('📤 Sending transcription to Groq:', transcription);

    if (!transcription) {
      throw new Error('Transcription failed: No text returned');
    }

    // Send transcription to Groq for AI feedback
    const aiFeedback = await sendToGroq(transcription, 'journal');
    
    return { transcription, aiFeedback };
  } catch (error) {
    console.error('❌ Transcription error:', error.message);
    throw new Error('Local transcription or Groq analysis failed');
  }
};

module.exports = { transcribeAudio };

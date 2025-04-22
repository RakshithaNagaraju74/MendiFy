import React, { useState } from 'react';
import axios from 'axios';

const MoodTracker = () => {
  const [mood, setMood] = useState<string | null>(null);
  const [moodHistory, setMoodHistory] = useState<{ mood: string, date: string }[]>([]);
  const [responseFromAI, setResponseFromAI] = useState<string | null>(null);

  const sessionId = localStorage.getItem('sessionId') || '';

  // Handle mood change
  const handleMoodChange = (selectedMood: string) => {
    setMood(selectedMood);
  };

  // Handle mood submit
  const handleMoodSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!mood) return;

    try {
      // Send the mood to the backend for AI analysis
      const response = await axios.post(`/api/users/${sessionId}/add-mood`, { mood });

      // After the mood is submitted, get AI response for this mood
      const aiResponse = await axios.post(`/api/users/${sessionId}/analyze-mood`, { mood });

      // Update state with AI response
      setResponseFromAI(aiResponse.data.reply);

      // Update mood history
      setMoodHistory(response.data.moodHistory);

      setMood(null); // Reset mood selection
    } catch (error) {
      console.error('Error adding mood or AI feedback:', error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gradient-to-r from-blue-100 via-blue-50 to-white rounded-lg shadow-xl">
      <h2 className="text-3xl font-bold text-center text-[#073763] mb-6">Track Your Mood</h2>

      <div className="flex justify-around mb-6">
        <button 
          onClick={() => handleMoodChange('happy')} 
          className={`mood-btn ${mood === 'happy' ? 'active' : ''}`}
        >
          😊 Happy
        </button>
        <button 
          onClick={() => handleMoodChange('sad')} 
          className={`mood-btn ${mood === 'sad' ? 'active' : ''}`}
        >
          😢 Sad
        </button>
        <button 
          onClick={() => handleMoodChange('neutral')} 
          className={`mood-btn ${mood === 'neutral' ? 'active' : ''}`}
        >
          😐 Neutral
        </button>
      </div>

      <form onSubmit={handleMoodSubmit} className="text-center">
        <button 
          type="submit" 
          className="w-full bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-400 focus:outline-none transition-all duration-300"
        >
          Save Mood
        </button>
      </form>

      {responseFromAI && (
        <div className="ai-feedback mt-6 p-4 bg-blue-50 border-l-4 border-blue-400 text-[#073763] shadow-md rounded-lg">
          <h3 className="font-semibold">AI Feedback:</h3>
          <p>{responseFromAI}</p>
        </div>
      )}

      <div className="mood-history mt-8">
        <h3 className="text-xl font-semibold mb-4 text-[#073763]">Your Mood History</h3>
        <ul className="list-disc pl-5 space-y-2">
          {moodHistory.map((entry, index) => (
            <li key={index} className="text-blue-800">{entry.mood} - {entry.date}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MoodTracker;

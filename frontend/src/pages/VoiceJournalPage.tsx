import { useState } from 'react';
import Lottie from 'lottie-react';
import robotListeningAnimation from '../assets/animation/robot-listening-animation.json';

const VoiceJournalPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [response, setResponse] = useState<{
    mood?: string;
    summary?: string;
    message?: string;
    suggestion?: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // For recording audio
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
    setResponse(null);
    setError(null);
  };

  // Start recording audio
  const handleStartRecording = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);

        const chunks: BlobPart[] = [];
        recorder.ondataavailable = (e) => {
          chunks.push(e.data);
        };

        recorder.onstop = () => {
          const audioData = new Blob(chunks, { type: 'audio/wav' });
          setAudioBlob(audioData);
          setAudioUrl(URL.createObjectURL(audioData));
        };

        recorder.start();
        setIsRecording(true);
        setMediaRecorder(recorder);
      } catch (err) {
        setError('Failed to access microphone.');
      }
    } else {
      setError('Browser does not support audio recording.');
    }
  };

  // Stop recording audio
  const handleStopRecording = () => {
    mediaRecorder?.stop();
    setIsRecording(false);
  };

  const handleSubmit = async () => {
    if (!file && !audioBlob) {
      setError('Missing audio file or recording.');
      return;
    }
  
    const formData = new FormData();
  
    // Append either file or audioBlob to the form data, ensuring it's not null
    if (file) {
      formData.append('audio', file);
    } else if (audioBlob) {
      formData.append('audio', audioBlob, 'recording.wav'); // Give a filename to the Blob if needed
    }
  
    setLoading(true);
    setError(null);
    setResponse(null);
  
    try {
      const res = await fetch('/api/users/analyze-audio-entry', {
        method: 'POST',
        body: formData,
      });
  
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Server error: ${text}`);
      }
  
      const data = await res.json();
      console.log('📥 Frontend Received:', data);
  
      const parsedFeedback = typeof data.aiFeedback === 'string'
        ? JSON.parse(data.aiFeedback)
        : data.aiFeedback;
  
      setResponse({
        mood: parsedFeedback.mood || 'Unknown',
        summary: parsedFeedback.summary || 'No summary.',
        message: parsedFeedback.message || 'No message.',
        suggestion: parsedFeedback.suggestion || 'No suggestion.',
      });
  
    } catch (error) {
      console.error('Error submitting voice journal:', error);
      setError('Failed to analyze audio. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-purple-100 via-pink-100 to-yellow-100 relative overflow-hidden">
      <div className="absolute -top-32 left-0 right-0 h-96 bg-gradient-to-r from-purple-300/40 via-pink-300/30 to-yellow-300/20 rounded-full blur-3xl opacity-60 animate-pulse" />

      {/* Left Section */}
      <div className="w-full md:w-1/2 p-8 flex flex-col justify-center z-10">
        <div className="bg-white/50 backdrop-blur-2xl p-8 rounded-3xl shadow-2xl border border-white/30">
          <h1 className="text-4xl font-extrabold text-purple-700 mb-2">🎙️ Voice Journal</h1>
          <p className="text-gray-700 mb-6 font-medium">Speak your thoughts. Let AI support and reflect back to you.</p>

          <label className="block bg-purple-600 hover:bg-purple-700 transition text-white py-2 px-5 rounded-full cursor-pointer text-center shadow-lg mb-4 hover:scale-105 duration-300">
            🎧 Upload Audio
            <input
              type="file"
              accept="audio/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {file && (
            <p className="text-sm font-medium text-purple-800 mb-3 animate-fadeIn">🎵 Selected: {file.name}</p>
          )}

          {/* Record Audio Section */}
          {!file && !audioBlob && (
            <>
              <button
                onClick={handleStartRecording}
                disabled={isRecording}
                className={`w-full py-3 rounded-xl font-bold text-white transition-all duration-300 transform ${
                  isRecording ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-500 hover:bg-emerald-600 hover:scale-105 shadow-md'
                }`}
              >
                {isRecording ? 'Recording...' : 'Start Recording'}
              </button>

              {isRecording && (
                <button
                  onClick={handleStopRecording}
                  className="w-full py-3 mt-4 rounded-xl font-bold text-white bg-red-500 hover:bg-red-600 shadow-md"
                >
                  Stop Recording
                </button>
              )}
            </>
          )}

          {audioBlob && !isRecording && (
            <>
              <p className="text-sm font-medium text-purple-800 mb-3 animate-fadeIn">🎵 Recorded Audio</p>
              <audio controls src={audioUrl || ''} className="w-full" />
            </>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading || (!file && !audioBlob)}
            className={`w-full py-3 mt-4 rounded-xl font-bold text-white transition-all duration-300 transform ${
              loading || (!file && !audioBlob) ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-500 hover:bg-emerald-600 hover:scale-105 shadow-md'
            }`}
          >
            {loading ? 'Analyzing...' : 'Analyze with AI'}
          </button>

          {loading && (
            <div className="mt-4 w-6 h-6 border-4 border-purple-400 border-dashed rounded-full animate-spin mx-auto" />
          )}

          {error && (
            <div className="mt-4 text-red-600 font-semibold text-center animate-fadeIn">
              ❌ {error}
            </div>
          )}

          {response && (
            <div className="mt-6 bg-white/70 backdrop-blur-md p-5 rounded-xl border border-purple-200 space-y-3 shadow-inner animate-fadeIn">
              <h3 className="text-xl font-bold text-purple-700 text-center">🧠 AI Feedback</h3>
              <p><strong className="text-purple-600">Mood:</strong> {response.mood}</p>
              <p><strong className="text-purple-600">Summary:</strong> {response.summary}</p>
              <p><strong className="text-purple-600">Message:</strong> {response.message}</p>
              <p><strong className="text-purple-600">Suggestion:</strong> {response.suggestion}</p>

              <div className="flex justify-between pt-4 text-sm text-purple-500 font-medium">
                <button onClick={() => { setFile(null); setAudioBlob(null); setResponse(null); }} className="hover:underline">🔁 Try Again</button>
                <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-1 rounded-md shadow-md transition hover:scale-105">✅ Save</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Section: Animation */}
      <div className="hidden md:flex w-1/2 items-center justify-center z-10">
        <div className="p-6 rounded-3xl bg-white/60 backdrop-blur-xl shadow-xl hover:scale-105 transition duration-300">
          <div className="flex flex-col items-center">
            <div className="w-64 h-64 mb-4">
              <Lottie animationData={robotListeningAnimation} loop={true} className="w-full h-full" />
            </div>
            <p className="text-2xl text-purple-700 font-semibold">🦾 Robo is Listening...</p>
            <p className="text-sm text-gray-600">Your voice is being analyzed.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceJournalPage;

import { useState, useEffect } from "react";
import { Player } from "@lottiefiles/react-lottie-player";
import meditationLottie from "../assets/animation/zen_meditation.json";

const sessions: Record<"Morning Calm" | "Stress Relief" | "Gratitude Focus", string> = {
  "Morning Calm": "Close your eyes. Inhale the freshness of a new day. Let the light slowly enter your mind...",
  "Stress Relief": "Take a deep breath. Picture yourself on a quiet beach, with the waves gently washing away your tension...",
  "Gratitude Focus": "Focus on someone or something you're grateful for. Let the warmth of appreciation fill your chest..."
};

const ZenFriend = () => {
  const [selectedSession, setSelectedSession] = useState<"Morning Calm" | "Stress Relief" | "Gratitude Focus">("Morning Calm");
  const [narration, setNarration] = useState("");
  const [loading, setLoading] = useState(false);
  const [playMusic, setPlayMusic] = useState(true);
  const [enableVoice, setEnableVoice] = useState<boolean>(true);

  const musicLinks: Record<string, string> = {
    "Morning Calm": "/music/morning-calm.mp3",
    "Stress Relief": "/music/stress-relief.mp3",
    "Gratitude Focus": "/music/gratitude-focus.mp3",
  };

  // Preload speech synthesis voices
  useEffect(() => {
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
  }, []);

  // Load voice preference
  useEffect(() => {
    const savedVoicePreference = localStorage.getItem("enableVoice");
    if (savedVoicePreference !== null) {
      setEnableVoice(JSON.parse(savedVoicePreference));
    }
  }, []);

  const handleVoiceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.checked;
    setEnableVoice(newValue);
    localStorage.setItem("enableVoice", JSON.stringify(newValue));
  };

  const handleSessionStart = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/zenfriend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: `Narrate a calming visualization for the session: ${selectedSession}` }),
      });

      const data = await response.json();
      const meditationNarration = data.narration || sessions[selectedSession];
      setNarration(meditationNarration);

      if (enableVoice) {
        speak(meditationNarration);
      }
    } catch (error) {
      console.error("Error fetching narration:", error);
      setNarration("Sorry, there was an error with the session.");
    } finally {
      setLoading(false);
    }
  };

  const speak = (text: string) => {
    if (!text || !enableVoice) return;

    // Cancel ongoing speech
    window.speechSynthesis.cancel();

    const voices = window.speechSynthesis.getVoices();
    const selectedVoice =
      voices.find((v) => v.name.includes("Google US English")) || voices[0];

    const utter = new SpeechSynthesisUtterance(text);
    utter.voice = selectedVoice;
    utter.lang = "en-US";
    utter.pitch = 1;
    utter.rate = 1;

    // Delay to ensure voices load
    setTimeout(() => {
      window.speechSynthesis.speak(utter);
    }, 150);
  };

  return (
    <div className="min-h-screen bg-gradient-to-bl from-blue-100 via-violet-100 to-rose-100 p-8 flex flex-col md:flex-row items-center space-y-6 md:space-y-0">
      {/* Lottie animation */}
      <div className="w-full md:w-1/3 h-64 mb-6 md:mb-0">
        <Player autoplay loop src={meditationLottie} style={{ height: "100%", width: "100%" }} />
      </div>

      {/* Content */}
      <div className="w-full md:w-2/3 space-y-6">
        <h1 className="text-4xl font-bold text-teal-700 text-center md:text-left">Breathe in serenity, breathe out stress, and let this moment of calm renew you.</h1>

        <select
          value={selectedSession}
          onChange={(e) => setSelectedSession(e.target.value as "Morning Calm" | "Stress Relief" | "Gratitude Focus")}
          className="p-3 rounded-lg text-lg shadow bg-white border border-gray-300 w-full"
        >
          {Object.keys(sessions).map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>

        <button
          onClick={handleSessionStart}
          className="px-6 py-3 text-white bg-purple-500 hover:bg-purple-600 rounded-lg shadow-lg transition w-full"
        >
          Start Session
        </button>

        <div className="mt-4 max-w-2xl p-4 bg-white rounded-lg shadow-md text-lg text-gray-800 whitespace-pre-wrap">
          {loading ? "Zen Friend is preparing your session..." : narration}
        </div>

        {/* Music toggle */}
        <div className="flex items-center mt-4 space-x-4">
          <label className="text-md text-gray-700">Background Music:</label>
          <input
            type="checkbox"
            checked={playMusic}
            onChange={() => setPlayMusic(!playMusic)}
            className="w-5 h-5"
          />
        </div>

        {playMusic && (
          <audio controls autoPlay loop className="mt-2 w-full">
            <source src={musicLinks[selectedSession]} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        )}

        {/* Voice narration toggle */}
        <div className="flex items-center mt-4 space-x-4">
          <label className="text-md text-gray-700">Enable Voice Narration:</label>
          <input
            type="checkbox"
            checked={enableVoice}
            onChange={handleVoiceChange}
            className="w-5 h-5"
          />
        </div>
      </div>
    </div>
  );
};

export default ZenFriend;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Player } from "@lottiefiles/react-lottie-player";

import happyAnimation from "../assets/animation/happy.json";
import sadAnimation from "../assets/animation/sad.json";
import anxiousAnimation from "../assets/animation/anxious.json";
import excitedAnimation from "../assets/animation/excited.json";
import lonelyAnimation from "../assets/animation/lonely.json";

const moods = [
  { name: "Happy", emoji: "😊", animation: happyAnimation },
  { name: "Sad", emoji: "😢", animation: sadAnimation },
  { name: "Anxious", emoji: "😰", animation: anxiousAnimation },
  { name: "Excited", emoji: "🤩", animation: excitedAnimation },
  { name: "Lonely", emoji: "🥺", animation: lonelyAnimation },
];

export default function MoodArtPage() {
  const [selectedMood, setSelectedMood] = useState<string>("");
  const [response, setResponse] = useState<string>("");
  const [animationData, setAnimationData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  const generateIdea = async () => {
    if (!selectedMood) return;

    setLoading(true);
    setResponse("");
    setAnimationData(null);

    try {
      const sessionId = localStorage.getItem("sessionId");
      if (!sessionId) throw new Error("Missing sessionId");

      const res = await fetch("/api/users/mood-creative", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: sessionId,
        },
        body: JSON.stringify({ mood: selectedMood }),
      });

      if (!res.ok) throw new Error("Failed to generate idea");

      const data = await res.json();
      setResponse(data.idea || "No idea available");

      const mood = moods.find((m) => m.name === selectedMood);
      if (mood) setAnimationData(mood.animation);
    } catch (err) {
      console.error(err);
      setResponse("Something went wrong. Please try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
  className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-pink-50 to-yellow-50 p-6 relative"
  style={{
    backgroundImage: "url('/background/mood-bg.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundAttachment: "fixed",
  }}
>
  {/* Top Right Paint Button */}
  <button
    onClick={() => navigate("/painting")}
    className="absolute top-6 right-6 bg-white border border-indigo-300 text-indigo-600 px-4 py-2 rounded-full shadow hover:bg-indigo-50 transition font-medium"
  >
    🎨 Start Painting
  </button>

  {/* Center Container */}
  <div className="flex-1 flex items-center justify-center">
    <div className="w-full max-w-3xl bg-white/80 border border-indigo-200 rounded-2xl p-10 text-center shadow-xl backdrop-blur-md">
      <h1 className="text-4xl font-bold mb-4 text-indigo-700">🎨 Mood-Inspired Creation</h1>
      <p className="text-gray-600 mb-6 text-base">
        Select your mood and get a fun meme idea or calming art activity.
      </p>

      {/* Mood buttons */}
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        {moods.map(({ name, emoji }) => (
          <button
            key={name}
            className={`px-4 py-2 rounded-full border text-sm font-medium transition hover:scale-105 ${
              selectedMood === name
                ? "bg-blue-600 text-white border-blue-600 shadow-lg"
                : "bg-white border-gray-300 text-gray-800"
            }`}
            onClick={() => setSelectedMood(name)}
          >
            {emoji} {name}
          </button>
        ))}
      </div>

      {/* Generate Button */}
      <button
        onClick={generateIdea}
        disabled={loading || !selectedMood}
        className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow hover:bg-indigo-700 transition disabled:opacity-50"
      >
        {loading ? "Generating..." : "Generate Magic 💡"}
      </button>

      {/* Animation + Response Area */}
      {(response || loading) && (
        <div className="mt-8 bg-white/90 border border-dashed border-indigo-300 shadow-inner rounded-xl p-6">
          {animationData && !loading && (
            <div className="mb-4 flex justify-center">
              <Player
                autoplay
                loop
                src={animationData}
                style={{ height: "200px", width: "200px" }}
              />
            </div>
          )}

          <p className="text-sm text-gray-500 mb-1">✨ Creative Spark:</p>
          <p className="text-lg font-semibold text-gray-800 whitespace-pre-wrap">
            {loading ? "Generating your creative idea..." : response}
          </p>
        </div>
      )}
    </div>
  </div>
</div>
  );
}

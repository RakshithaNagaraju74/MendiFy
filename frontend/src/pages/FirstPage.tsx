import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bot, Smile, Upload, Languages,
  Gamepad2, Music2, Palette, Image, Eye,
  Sun, Moon, Clock, ArrowRightCircle, ArrowLeftCircle,
  UserCircle
} from "lucide-react";
import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";
import quotes from "./api/quotes.json";

export default function LandingPage() {
  const [quote, setQuote] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setQuote(quotes[randomIndex] || "Stay positive and keep moving forward!");
  }, []);

  const features = [
    {
      icon: <Bot size={32} className="text-white" />,
      title: "AI Chat Assistant",
      route: "/chat/conversation",
      description: "Engage in personalized conversations with your AI buddy anytime, anywhere.",
      bgColor: "bg-pink-500"
    },
    {
      icon: <Smile size={32} className="text-white" />,
      title: "Track Your Mood",
      route: "/chat/mood",
      description: "Track your mood daily with emotional insights and feedback to improve well-being.",
      bgColor: "bg-cyan-500"
    },
    {
      icon: <Clock size={32} className="text-white" />,
      title: "Chronicle Your Journey",
      route: "/journal-entry",
      description: "Embark on a journey through time by capturing your thoughts, feelings, and experiences. Use text, voice, or images to document the past, present, and future of your inner world.",
      bgColor: "bg-yellow-500"
    },
    {
      icon: <Languages size={32} className="text-white" />,
      title: "AI Homework Solver",
      route: "/solve-homework",
      description: "Snap a photo of your homework and let AI solve it in seconds — math, science, and more!",
      bgColor: "bg-violet-500"
    },
    {
      icon: <Gamepad2 size={32} className="text-white" />,
      title: "Play a Game",
      route: "/game",
      description: "Take a break and recharge your mind with fun, relaxing mini-games.",
      bgColor: "bg-lime-500"
    },
    {
      icon: <Music2 size={32} className="text-white" />,
      title: "Feeling Upset?",
      route: "/meditation",
      description: "Watch calming videos and listen to relaxing music to soothe your emotions.",
      bgColor: "bg-rose-500"
    },
    {
      icon: <Palette size={32} className="text-white" />,
      title: "Mood Art Generator",
      route: "/mood-creative",
      description: "Generate beautiful art based on your mood and express your feelings creatively.",
      bgColor: "bg-sky-500"
    },
    {
      icon: <Image size={32} className="text-white" />,
      title: "Vision Board",
      route: "/vision-board",
      description: "Create a digital vision board to visualize your goals and dreams with images and quotes.",
      bgColor: "bg-fuchsia-500"
    },
    {
      icon: <Eye size={32} className="text-white" />,
      title: "Zen Friend",
      route: "/zen-friend",
      description: "A calm, virtual friend who helps you unwind, meditate, and find your inner peace.",
      bgColor: "bg-indigo-500"
    },
  ];

  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen w-full relative transition duration-300 ease-in-out">
      {/* Sticky Left Button */}
      <div
        className="fixed left-0 top-1/2 transform -translate-y-1/2 z-50 cursor-pointer"
        onClick={() => navigate("/health-ai")}
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-red-500 text-white py-4 px-2 rounded-tr-xl rounded-br-xl shadow-lg font-bold text-sm tracking-wide"
          style={{
            writingMode: "vertical-rl",
            textOrientation: "upright"
          }}
        >
          Need Help?
        </motion.button>
      </div>

      {/* Profile Icon Button - Top Left */}
      <div className="absolute top-4 left-4 z-50">
        <button
          onClick={() => navigate("/profile")}
          className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition"
        >
          <UserCircle className="text-gray-800" size={28} />
        </button>
      </div>

      {/* Background image layer */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0 opacity-100"
        style={{ backgroundImage: `url("/background/bg-image.jpeg")` }}
      ></div>

      {/* Features Grid */}
      <div className="relative z-10 px-6 py-8 flex flex-col items-center">
        <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              onClick={() => navigate(feature.route)}
              className={`group ${feature.bgColor} rounded-xl p-6 cursor-pointer shadow-xl hover:scale-105 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.6)]`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-3">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                <p className="text-sm mt-2 text-white">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quote Section with Typing Animation */}
        <div className="mt-16 w-full max-w-3xl text-center bg-white/70 dark:bg-white/10 backdrop-blur-md p-6 rounded-lg shadow-lg">
          <p className="text-base font-semibold text-pink-500">Quote of the Day</p>
          <p className="italic mt-2 text-gray-700 dark:text-gray-200">
            <Typewriter
              words={[quote]}
              loop={1}
              cursor
              cursorStyle="_"
              typeSpeed={40}
              deleteSpeed={0}
              delaySpeed={2000}
            />
          </p>
        </div>
      </div>
    </div>
  );
}

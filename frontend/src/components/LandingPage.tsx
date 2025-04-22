import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Player } from '@lottiefiles/react-lottie-player';
import aiWelcomeAnimation from '../assets/animation/ai-welcome.json';
import {
  ChatBubbleLeftEllipsisIcon,
  SparklesIcon,
  LightBulbIcon,
} from '@heroicons/react/24/outline';
import '../styles/landingAnimations.css';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdfbfb] to-[#ebedee] text-gray-800 overflow-hidden relative custom-cursor bg-cover bg-center" 
      style={{ backgroundImage: 'url("/background/final-bg.jpg")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="absolute inset-0 bg-cover bg-center z-0 opacity-10"></div>

      {/* Lottie Animation (Right Side, Bigger, Slightly Higher) */}
      <div className="hidden md:block absolute top-[-40px] right-[-100px] z-10">
        <Player
          autoplay
          loop
          src={aiWelcomeAnimation}
          style={{ width: '900px', height: '900px' }}
        />
      </div>

      {/* Floating Speech Bubbles */}
      <div className="floating-bubble top-[20%] right-[5%]">"Hey, I came for you!"</div>
      <div className="floating-bubble top-[55%] right-[5%]">"Let’s talk about your journey!"</div>

      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-6 bg-transparent shadow-md sticky top-0 z-50">
  <div className="text-pink-600 font-extrabold text-2xl tracking-tight relative z-10">
    MendiFy
  </div>
  <ul className="hidden md:flex space-x-10 text-gray-700 font-semibold text-sm">
  <li>
    <Link to="/about" className="hover:text-pink-500">
      About
    </Link>
  </li>
  <li>
    <Link to="/contact" className="hover:text-pink-500">
      Contact
    </Link>
  </li>
  </ul>
</nav>


      {/* Hero Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 items-center px-6 md:px-20 py-24 gap-10">
        {/* Left Text */}
        <div className="space-y-6 z-10">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-extrabold text-[#073763] leading-tight"
          >
            Your AI Companion<br />
            Always Here, Always Listening.
          </motion.h1>

          <p className="text-lg text-gray-600 max-w-md">
            I’m your cosmic companion — here to chat, heal, and uplift. No judgments, no pressure. Just stardust, stories, and support.
          </p>

          <p className="text-sm text-gray-500 italic">
            “Whispers from the universe brought me here — to be your guide through cloudy days.”
          </p>

          <motion.button
            onClick={() => navigate("/nickname")}
            whileHover={{ scale: 1.1 }}
            className="glow-button bg-pink-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-pink-600 transition font-semibold"
          >
            Enter the Safe Space 💫
          </motion.button>

          <p className="italic text-sm text-gray-500">
            You’re the main character. I’m your guide. Let's start the story.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 md:px-20 py-20 bg-white">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[#073763] mb-12">What Makes WellSpace Special?</h2>
        <div className="grid md:grid-cols-3 gap-10 text-center">
          {/* Feature Cards */}
          <motion.div whileHover={{ scale: 1.05 }} className="bg-gray-100 p-8 rounded-2xl shadow hover:shadow-xl transition">
            <ChatBubbleLeftEllipsisIcon className="h-12 w-12 text-pink-500 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold mb-2">Real-time AI Conversations</h3>
            <p className="text-gray-600 text-sm">Speak freely—our AI is always ready to listen, understand, and respond with care.</p>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} className="bg-gray-100 p-8 rounded-2xl shadow hover:shadow-xl transition">
            <SparklesIcon className="h-12 w-12 text-yellow-500 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold mb-2">Personalized Insights</h3>
            <p className="text-gray-600 text-sm">Get uplifting reflections and motivation tailored to your emotions and interests.</p>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} className="bg-gray-100 p-8 rounded-2xl shadow hover:shadow-xl transition">
            <LightBulbIcon className="h-12 w-12 text-teal-500 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold mb-2">Explore What You Love</h3>
            <p className="text-gray-600 text-sm">Discover empowering content—curated just for you based on your passions and curiosity.</p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-10 text-sm text-gray-500">
        © 2025 WellSpace. Built for every teen who needs a friend.
      </footer>
    </div>
  );
}

import React from "react";
import { Link } from "react-router-dom";

export default function Menu() {
  return (
    <div className="fixed top-0 left-0 w-60 h-full bg-white shadow-lg p-6 z-50">
      <h2 className="text-2xl font-bold text-[#073763] mb-8">Teen Wellness</h2>
      <nav className="flex flex-col gap-4">
        <Link to="/chat" className="text-blue-800 hover:text-pink-500 font-medium">
          💬 Chat
        </Link>
        <Link to="/audio" className="text-blue-800 hover:text-pink-500 font-medium">
          🌈 Mood Tracker
        </Link>
        <Link to="/journal" className="text-blue-800 hover:text-pink-500 font-medium">
          📔 Journal
        </Link>
        <Link to="/profile" className="text-blue-800 hover:text-pink-500 font-medium">
          🙋 Profile
        </Link>
      </nav>
    </div>
  );
}

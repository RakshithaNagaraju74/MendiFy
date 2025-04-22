import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { EnhancementProvider } from "./enhancements/EnhancementProvider"; // ✅ Import this

import LandingPage from "./components/LandingPage";
import NicknamePage from "./pages/NicknamePage";
import ChatPage from "./pages/ChatWithAIPage";
import AudioPage from "./pages/VoiceJournalPage";
import FirstPage from "./pages/FirstPage";
import HomeworkSolver from "./pages/HomeworkSolver";
import MoodArtGenerator from "./components/MoodArtGenerator";
import VisionBoardMaker from "./pages/VisionBoard";
import ZenFriend from "./pages/ZenFriend";
import GamePage from "./components/SimonSays";
import Meditation from "./pages/Meditation";
import JournalEntry from "./pages/JournalEntry";
import HealthAI from "./pages/HealthAI";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ProfilePage from "./pages/ProfilePage";
import PaintingPage from "./pages/PaintingPage"; // Import the new PaintingPage component
function App() {
  return (
    <AuthProvider>
      <EnhancementProvider> {/* ✅ Wrap your app with EnhancementProvider */}
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/nickname" element={<NicknamePage />} />
            <Route path="/chat/conversation" element={<ChatPage />} />
            <Route path="/chat" element={<FirstPage />} />
            <Route path="/chat/mood" element={<AudioPage />} />
            <Route path="/audio" element={<AudioPage />} />
            <Route path="/solve-homework" element={<HomeworkSolver />} />
            <Route path="/mood-creative" element={<MoodArtGenerator />} />
            <Route path="/vision-board" element={<VisionBoardMaker />} />
            <Route path="/zen-friend" element={<ZenFriend />} />
            <Route path="/game" element={<GamePage />} />
            <Route path="/meditation" element={<Meditation />} />
            <Route path="/journal-entry" element={<JournalEntry />} />
            <Route path="/health-ai" element={<HealthAI />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/painting" element={<PaintingPage />} /> {/* New route for PaintingPage */}
            <Route path="*" element={<div className="text-center p-10 text-lg">404 Not Found</div>} />
          </Routes>
        </Router>
      </EnhancementProvider>
    </AuthProvider>
  );
}

export default App;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

interface UserProfile {
  nickname: string;
  streakCount: number;
  selectedAvatar: string;
}

const avatarOptions = [
  "/avatars/avatar1.jpeg",
  "/avatars/avatar2.jpeg",
  "/avatars/avatar3.jpeg",
  "/avatars/avatar4.jpeg",
  "/avatars/avatar5.jpeg",
  "/avatars/avatar6.jpeg",
  "/avatars/avatar7.jpeg",
  "/avatars/avatar8.jpeg",
  "/avatars/avatar9.jpeg",
  "/avatars/avatar10.jpeg",
  "/avatars/avatar11.jpeg",
  "/avatars/avatar12.jpeg"
];

const ProfilePage = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const sessionId = localStorage.getItem("sessionId");
        if (!sessionId) {
          console.error("No session ID found");
          return;
        }

        const response = await axios.get("http://localhost:3000/api/users/profile", {
          headers: { Authorization: `Bearer ${sessionId}` },
        });

        setUser(response.data);
        setSelectedAvatar(response.data.selectedAvatar);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  const saveProfile = async () => {
    try {
      const sessionId = localStorage.getItem("sessionId");
      if (!sessionId) {
        alert("No session ID found.");
        return;
      }

      await axios.put(
        "/api/users/profile",
        { selectedAvatar },
        {
          headers: { Authorization: `Bearer ${sessionId}` },
        }
      );

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to save profile.");
    }
  };

  if (!user) {
    return <div className="text-center p-10 text-lg">Loading profile...</div>;
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-100 p-6">
      {/* Animated Header */}
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <h1 className="text-5xl font-extrabold text-indigo-700">Welcome, {user.nickname} 🌟</h1>
        <p className="text-md text-gray-600 mt-2">Keep growing. Keep glowing. You're doing great!</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl p-10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Left: Profile Summary */}
          <div className="flex flex-col items-center gap-6">
            {/* Avatar */}
            <div className="w-44 h-44 rounded-full overflow-hidden border-4 border-indigo-600 shadow-xl transform transition-transform duration-300 hover:scale-110">
              {selectedAvatar ? (
                <img src={selectedAvatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-indigo-500 font-bold text-xl">
                  Avatar
                </div>
              )}
            </div>

            {/* Name */}
            <p className="text-3xl font-bold text-indigo-800">{user.nickname}</p>

            {/* Streak */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="mt-4 px-6 py-3 bg-yellow-300 text-yellow-900 rounded-full shadow-lg font-semibold"
            >
              🔥 {user.streakCount} Day Streak
            </motion.div>

            {/* Fake stats section */}
            <div className="mt-6 w-full text-center">
              <p className="text-gray-600">✨ You’ve made 0 journal entries</p>
              <p className="text-gray-600">🌈 Logged moods for 1 days</p>
            </div>

            <button
              onClick={saveProfile}
              className="mt-8 bg-indigo-600 text-white px-8 py-3 rounded-full shadow-lg hover:bg-indigo-700 transition-all"
            >
              Save Profile
            </button>
          </div>

          {/* Right: Avatar Selector */}
          <div className="flex flex-col justify-center items-center">
            <h2 className="text-xl font-medium text-indigo-700 mb-4">Choose Your Avatar</h2>
            <div className="grid grid-cols-4 gap-4">
              {avatarOptions.map((url, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedAvatar(url)}
                  className={`w-20 h-20 rounded-full overflow-hidden border-4 ${
                    selectedAvatar === url
                      ? "border-indigo-700"
                      : "border-indigo-300 hover:border-indigo-600"
                  } transition duration-200`}
                >
                  <img src={url} alt={`Avatar ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Motivational Quote */}
            <div className="mt-10 p-4 rounded-xl bg-indigo-100 text-indigo-700 font-medium shadow">
              💬 “You are stronger than you think, and braver than you believe.”
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;

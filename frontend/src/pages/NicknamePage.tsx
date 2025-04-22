import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { TypeAnimation } from "react-type-animation";
import { Player } from "@lottiefiles/react-lottie-player";
import robot from "../assets/animation/ai-hello.json";

export default function NicknamePage() {
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  // Handle form submission for Login/Registration
  const handleSubmit = async () => {
    if (!nickname.trim() || !password.trim()) {
      alert("Please fill in both fields.");
      return;
    }

    try {
      setLoading(true);
      const endpoint = isRegistering
        ? "http://localhost:5000/api/auth/register"
        : "http://localhost:5000/api/auth/login";

      const res = await axios.post(endpoint, { nickname, password });
      const { sessionId } = res.data;

      // Persist session and nickname
      localStorage.setItem("nickname", nickname);
      localStorage.setItem("sessionId", sessionId);

      // Redirect to the chat page after successful login/register
      navigate("/chat/");
    } catch (err: unknown) {
      console.error(`${isRegistering ? "Registration" : "Login"} failed:`, err);
      const errorMsg =
        axios.isAxiosError(err) && err.response?.data?.error
          ? err.response.data.error
          : "Something went wrong. Please try again.";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      {/* Left: Nickname + Password Section */}
      <div className="w-1/2 bg-gradient-to-br from-pink-100 via-pink-50 to-white flex flex-col items-center justify-center relative px-6">
        {/* Decorative Wave */}
        <div className="absolute top-0 left-0 w-full h-48 bg-pink-200 rounded-b-full opacity-40 blur-2xl"></div>

        {/* Typing Welcome Animation */}
        <TypeAnimation
          sequence={[
            "Hey there! 🌸", 1000,
            "Ready to chat with your AI buddy?", 1500,
            isRegistering ? "Create an account to begin!" : "Enter your login details!",
            1000,
          ]}
          wrapper="h1"
          className="text-3xl md:text-4xl font-extrabold text-[#073763] mb-10 text-center drop-shadow-md"
          speed={50}
          repeat={Infinity}
        />

        {/* Nickname Input */}
        <input
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="Enter your nickname"
          className="px-6 py-3 text-lg rounded-xl border border-gray-300 shadow-sm mb-4 w-3/4 focus:ring-2 focus:ring-pink-400 transition-all"
        />

        {/* Password Input */}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          className="px-6 py-3 text-lg rounded-xl border border-gray-300 shadow-sm mb-6 w-3/4 focus:ring-2 focus:ring-pink-400 transition-all"
        />

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-pink-500 text-white px-6 py-3 rounded-xl text-lg hover:bg-pink-600 transition-all duration-300 shadow-md disabled:opacity-60"
        >
          {loading ? (isRegistering ? "Registering..." : "Logging in...") : isRegistering ? "Register" : "Login"}
        </button>

        {/* Toggle between Register/Login */}
        <p className="mt-4 text-sm text-gray-600">
          {isRegistering ? "Already have an account?" : "New here?"}{" "}
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-pink-500 underline hover:text-pink-700 transition"
          >
            {isRegistering ? "Login" : "Register"}
          </button>
        </p>
      </div>

      {/* Right: AI Animation */}
      <div className="w-1/2 bg-gradient-to-bl from-blue-100 to-white flex items-center justify-center relative overflow-hidden">
        <div className="absolute -top-20 -right-32 w-96 h-96 bg-blue-300 opacity-20 rounded-full blur-[120px]" />
        <Player autoplay loop src={robot} className="w-[400px] h-[400px]" />
      </div>
    </div>
  );
}

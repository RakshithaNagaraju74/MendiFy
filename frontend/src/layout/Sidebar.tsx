import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="fixed left-0 top-0 h-full w-60 bg-[#073763] text-white shadow-xl z-50 flex flex-col py-6 px-4">
      <h2 className="text-xl font-bold mb-8">Wellness Menu</h2>
      <nav className="flex flex-col gap-4 text-md">
        <Link to="/mood" className="hover:text-pink-300 transition">Mood Tracker</Link>
        <Link to="/upload" className="hover:text-pink-300 transition">Journal Upload</Link>
        <Link to="/entries" className="hover:text-pink-300 transition">My Entries</Link>
        <Link to="/chat" className="hover:text-pink-300 transition">AI Friend</Link>
      </nav>
    </div>
  );
};

export default Sidebar;

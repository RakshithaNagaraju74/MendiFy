import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function ProfilePage() {
  const [nickname, setNickname] = useState('');
  const [streakCount, setStreakCount] = useState(0);
  const [selectedAvatar, setSelectedAvatar] = useState('avatar1');
  const [editNickname, setEditNickname] = useState(false);
  const [newNickname, setNewNickname] = useState(nickname);

  const avatars = [
    { id: 'avatar1', src: '/avatars/avatar1.jpeg' },
    { id: 'avatar2', src: '/avatars/avatar2.jpeg' },
    { id: 'avatar3', src: '/avatars/avatar3.jpeg' },
    { id: 'avatar4', src: '/avatars/avatar4.jpeg' },
    { id: 'avatar4', src: '/avatars/avatar5.jpeg' },
    { id: 'avatar4', src: '/avatars/avatar6.jpeg' },
    { id: 'avatar4', src: '/avatars/avatar7.jpeg' },
    { id: 'avatar4', src: '/avatars/avatar8.jpeg' },
    { id: 'avatar4', src: '/avatars/avatar9.jpeg' },
    { id: 'avatar4', src: '/avatars/avatar10.jpeg' },
  ];

  // Fetch user data from the backend
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user/profile'); // Your API endpoint to get user data
        const data = await response.json();
        setNickname(data.nickname); // Set the nickname from the backend
        setStreakCount(data.streakCount); // Set the streak count from the backend
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    
    fetchUserData();
  }, []);

  const handleNicknameChange = async () => {
    try {
      const response = await fetch('/api/user/update-nickname', { // Your API endpoint to update the nickname
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newNickname }),
      });
      
      if (response.ok) {
        setNickname(newNickname);
        setEditNickname(false);
      } else {
        console.error('Error updating nickname');
      }
    } catch (error) {
      console.error('Error updating nickname:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 flex flex-col items-center py-12 px-6">
      {/* Profile Card */}
      <motion.div
        className="w-full max-w-lg bg-white rounded-2xl p-8 shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Profile Header */}
        <div className="flex justify-center items-center mb-6">
          <motion.div
            className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-gradient-to-br from-pink-500 to-purple-500"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          >
            <img
              src={`/avatars/${selectedAvatar}.png`}
              alt="Profile Avatar"
              className="object-cover w-full h-full"
            />
          </motion.div>
        </div>

        {/* Nickname Section */}
        <div className="text-center mb-6">
          {editNickname ? (
            <div className="flex justify-center items-center space-x-4">
              <input
                type="text"
                value={newNickname}
                onChange={(e) => setNewNickname(e.target.value)}
                className="px-4 py-2 rounded-lg text-lg font-semibold text-gray-700 border-2 border-gray-300"
              />
              <motion.button
                onClick={handleNicknameChange}
                whileHover={{ scale: 1.05 }}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg"
              >
                Save
              </motion.button>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{nickname}</h2>
              <motion.button
                onClick={() => setEditNickname(true)}
                whileHover={{ scale: 1.05 }}
                className="text-blue-500 text-sm mt-2 hover:underline"
              >
                Edit Nickname
              </motion.button>
            </div>
          )}
        </div>

        {/* Streak Count */}
        <div className="text-center mb-6">
          <p className="text-lg text-gray-600">Streak: {streakCount} days</p>
        </div>

        {/* Avatar Selection */}
        <div className="flex justify-center space-x-4">
          {avatars.map((avatar) => (
            <motion.div
              key={avatar.id}
              className="cursor-pointer"
              whileHover={{ scale: 1.1 }}
              onClick={() => setSelectedAvatar(avatar.id)}
            >
              <img
                src={avatar.src}
                alt={`Avatar ${avatar.id}`}
                className={`w-16 h-16 rounded-full object-cover ${selectedAvatar === avatar.id ? 'border-4 border-blue-500' : ''}`}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { useContext } from 'react';
import { EnhancementContext, EnhancementProvider } from '../enhancements/EnhancementProvider';


type JournalEntry = {
  _id: string;
  text: string;
  imageUrl?: string;
  audioUrl?: string;
  createdAt: string;
};

export default function JournalPage() {
  const { sessionId } = useAuth();
  const { encryptText, decryptText, theme, setTheme,  fontSize, setFontSize, dyslexiaMode } = useContext(EnhancementContext);
  const [text, setText] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [audio, setAudio] = useState<File | null>(null);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [showEntries, setShowEntries] = useState(false); // Toggle visibility

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionId) {
      alert('Please log in to submit a journal entry.');
      return;
    }

    const formData = new FormData();
    const encryptedEntry = encryptText(text); // Encrypt the text

  console.log("Encrypted Entry:", encryptedEntry);
    formData.append('entryText', encryptText(text));
    
    if (image) formData.append('image', image);
    if (audio) formData.append('audio', audio);

    try {
      const response = await axios.post(
        `http://localhost:5000/api/journalEntries/${sessionId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setText('');
      setImage(null);
      setAudio(null);
      fetchEntries();
    } catch (err) {
      console.error('❌ Error submitting journal entry:', err);
      if (axios.isAxiosError(err)) {
        console.log('📦 Server Response:', err.response?.data);
      }
    }
  };

  const fetchEntries = async () => {
    if (!sessionId) return;

    try {
      const res = await axios.get(
        `http://localhost:5000/api/journalEntries/${sessionId}`,
        {
          params: {
            startDate: filterStartDate,
            endDate: filterEndDate,
          },
        }
      );
      setEntries(res.data);
    } catch (err) {
      console.error('Error fetching journal entries:', err);
    }
  };

  useEffect(() => {
    if (sessionId) fetchEntries();
  }, [sessionId, filterStartDate, filterEndDate]);

  


  return (
    <div
      className={`min-h-screen py-12 px-4 flex flex-col items-center ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gradient-to-br from-pink-100 via-blue-100 to-purple-100'}`}
    >
      {/* Theme and Font Size Control */}
      <div className="absolute top-6 right-6 flex gap-4 items-center">
  {/* Creative Theme Toggle Switch */}
  <label className="relative inline-flex items-center cursor-pointer">
    <input
      type="checkbox"
      checked={theme === 'dark'}
      onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="sr-only peer"
    />
    <div className="w-14 h-8 bg-gray-300 dark:bg-gray-700 rounded-full peer peer-checked:bg-rose-500 transition-all duration-300 relative">
      <span className="absolute left-1 top-1 bg-white dark:bg-gray-200 w-6 h-6 rounded-full transition-all duration-300 peer-checked:translate-x-6"></span>
    </div>
    <span className="ml-3 text-sm font-medium text-gray-800 dark:text-gray-200">
      {theme === 'dark' ? 'Dark' : 'Light'}
    </span>
  </label>
</div>

  
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-3xl bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-white/30"
      >
        <h1
          className={`text-4xl font-extrabold text-center mb-6 ${dyslexiaMode ? 'dyslexia-font' : ''}`}
          style={{ fontSize }}
        >
          ✨ Reflect. Express. Heal.
        </h1>
        <p className={`text-center mb-4 text-lg font-medium ${dyslexiaMode ? 'dyslexia-font' : ''}`} style={{ fontSize }}>
          Your safe space to share thoughts, emotions, and moments.
        </p>
  
        <form onSubmit={handleSubmit} className="space-y-6">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write your journal entry..."
            rows={5}
            className={`w-full p-4 ${dyslexiaMode ? 'dyslexia-font' : ''} text-gray-800 border rounded-xl shadow-inner resize-none focus:ring-2 focus:ring-rose-400 focus:outline-none`}
            style={{ fontSize }}
          />
  
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              className="block w-full text-sm text-gray-600 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded-lg file:bg-white hover:file:bg-gray-100"
            />
  
            <input
              type="file"
              accept="audio/*"
              onChange={(e) => setAudio(e.target.files?.[0] || null)}
              className="block w-full text-sm text-gray-600 file:py-2 file:px-4 file:border file:border-gray-300 file:rounded-lg file:bg-white hover:file:bg-gray-100"
            />
          </div>
  
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full py-3 text-lg font-semibold text-white bg-rose-500 rounded-2xl hover:bg-rose-600 transition duration-300 shadow-md"
          >
            ✨ Save Entry
          </motion.button>
        </form>
  
        {/* Toggle Button */}
        <div className="text-center mt-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowEntries(!showEntries)}
            className="inline-block px-6 py-3 text-white bg-gradient-to-r from-rose-500 to-pink-500 rounded-full font-semibold shadow-md hover:from-rose-600 hover:to-pink-600 transition"
          >
            {showEntries ? '🙈 Hide My Journal Entries' : '📖 See My Journal Entries'}
          </motion.button>
        </div>
  
        {/* Filters */}
        {showEntries && (
          <div className="mt-6 flex flex-col sm:flex-row items-center gap-4 justify-center">
            <input
              type="date"
              value={filterStartDate}
              onChange={(e) => setFilterStartDate(e.target.value)}
              className="border px-3 py-2 rounded-xl shadow"
            />
            <span className="text-gray-600">to</span>
            <input
              type="date"
              value={filterEndDate}
              onChange={(e) => setFilterEndDate(e.target.value)}
              className="border px-3 py-2 rounded-xl shadow"
            />
          </div>
        )}
      </motion.div>
  
      {/* Journal Entries List */}
      {showEntries && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-10 w-full max-w-4xl grid gap-6"
        >
          {entries.length === 0 ? (
            <p className="text-center text-gray-500">No journal entries found.</p>
          ) : (
            entries.map((entry) => (
              <div
                key={entry._id}
                className="bg-white/90 backdrop-blur rounded-xl p-6 shadow border border-white/20"
              >
                <p className={`text-gray-800 whitespace-pre-wrap ${dyslexiaMode ? 'dyslexia-font' : ''}`} style={{ fontSize }}>
                  {decryptText(entry.text)}
                </p>
  
                {entry.imageUrl && (
                  <img
                    src={entry.imageUrl}
                    alt="Journal"
                    className="mt-4 rounded-xl max-h-60 object-contain"
                  />
                )}
                {entry.audioUrl && (
                  <audio controls src={entry.audioUrl} className="mt-4 w-full" />
                )}
                <p className="text-sm text-right text-gray-500 mt-2">
                  {new Date(entry.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))
          )}
        </motion.div>
      )}
    </div>
  );
  
}
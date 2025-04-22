import React, { useState } from 'react';
import axios from 'axios';
import { Loader2, ImagePlus, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HomeworkSolver() {
  const [image, setImage] = useState<File | null>(null);
  const [previewURL, setPreviewURL] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [solution, setSolution] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (!file) return;

    // Check if the image size is under the allowed limit (e.g., 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setErrorMessage('❌ Image size should be in KB.');
      setImage(null); // Reset the image
      setPreviewURL(null);
      return;
    } else {
      setErrorMessage('');
      setImage(file);
      setPreviewURL(URL.createObjectURL(file));
      setSolution(''); // Reset the solution when a new image is selected
    }
  };

  const handleSolve = async () => {
    if (!image) return;
    setLoading(true);
    setSolution(''); // Clear previous solution

    // Compress the image before sending it to the backend (Optional, for reducing size)
    const compressedImage = await compressImage(image);

    const formData = new FormData();
    formData.append('image', compressedImage);

    try {
      const res = await axios.post('/api/solve-homework', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Make sure the correct header is set
        },
      });
      setSolution(res.data.solution);
    } catch (err) {
      setSolution('❌ Failed to solve the problem. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Resize the image to 50% of its original size (adjust as needed)
          canvas.width = img.width / 2;
          canvas.height = img.height / 2;
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(new File([blob], file.name, { type: file.type }));
            } else {
              reject('Image compression failed');
            }
          }, file.type);
        }
      };
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  };

  return (
    
<div
      className="min-h-screen bg-cover bg-center relative py-12 px-4 flex flex-col md:flex-row items-center"
      
    >
  {/* Left Section */}
  <div className="w-full md:w-1/2 flex flex-col items-center">
    <h1 className="text-4xl font-bold text-indigo-700 mb-6">📚 AI Homework Buddy</h1>

    <label
      className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg cursor-pointer hover:bg-indigo-700 transition mb-4"
      htmlFor="upload"
    >
      <ImagePlus className="w-5 h-5" />
      Upload Homework Image
    </label>
    <input
      type="file"
      id="upload"
      accept="image/*"
      onChange={handleImageChange}
      className="hidden"
    />

    {errorMessage && (
      <div className="text-red-600 mb-4 text-sm">
        {errorMessage}
      </div>
    )}

    {previewURL && (
      <motion.img
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        src={previewURL}
        alt="preview"
        className="max-w-md mt-4 rounded-lg shadow-md"
      />
    )}

    <p className="text-sm text-gray-600 mt-2">
      Image size should be in KB for optimal performance.
    </p>

    {image && (
      <button
        onClick={handleSolve}
        disabled={loading}
        className="mt-6 px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Solving...
          </>
        ) : (
          <>
            <CheckCircle2 className="w-4 h-4" />
            Solve with AI
          </>
        )}
      </button>
    )}
  </div>

  {/* Right Section */}
  <div className="w-full md:w-1/2 flex flex-col items-center mt-8 md:mt-0">
    {solution && (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mt-10 bg-white shadow-lg rounded-lg p-6 border"
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-2">✅ Solution:</h2>
        <p className="text-gray-700 whitespace-pre-line">{solution}</p>
      </motion.div>
    )}
  </div>
</div>
  );
}

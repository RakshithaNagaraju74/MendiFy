import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function PaintingPage() {
  const navigate = useNavigate();

  // Canvas settings
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [brushColor, setBrushColor] = useState<string>("#000000");
  const [brushSize, setBrushSize] = useState<number>(5);
  const [drawing, setDrawing] = useState<boolean>(false);
  const [lastPosition, setLastPosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 });
  const [erasing, setErasing] = useState<boolean>(false);

  // Start painting (clear canvas)
  const startPainting = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        context.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };

  // Handle mouse drawing
  const handleMouseDown = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        setDrawing(true);
        const { offsetX, offsetY } = e.nativeEvent;
        setLastPosition({ x: offsetX, y: offsetY });
        context.beginPath();
        context.moveTo(offsetX, offsetY);
        context.lineWidth = brushSize;
        context.strokeStyle = erasing ? "#FFFFFF" : brushColor;
        context.lineCap = "round";
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (drawing) {
      const canvas = canvasRef.current;
      if (canvas) {
        const context = canvas.getContext("2d");
        if (context) {
          const { offsetX, offsetY } = e.nativeEvent;
          context.lineTo(offsetX, offsetY);
          context.stroke();
          setLastPosition({ x: offsetX, y: offsetY });
        }
      }
    }
  };

  const handleMouseUp = () => {
    setDrawing(false);
  };

  const handleMouseOut = () => {
    setDrawing(false);
  };

  // Function to download the canvas as an image
  const downloadPainting = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL("image/png"); // Create image data URL
      const a = document.createElement("a");
      a.href = dataUrl; // Set the image data as the link href
      a.download = "painting.png"; // Set the filename for download
      a.click(); // Trigger download
    }
  };

  // Toggle eraser mode
  const toggleEraser = () => {
    setErasing(!erasing);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-300 via-indigo-200 to-teal-200 p-6 transition-all duration-500">
      {/* Back Button */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 bg-white text-indigo-600 px-6 py-3 rounded-full shadow-xl transform hover:scale-105 transition-all"
      >
        🏠 Back
      </button>

      {/* Painting Header */}
      <div className="w-full max-w-4xl text-center mb-8 mt-4">
        <h1 className="text-5xl font-bold text-white mb-4 animate__animated animate__fadeIn animate__delay-1s">
          🎨 Let Your Creativity Flow
        </h1>
        <p className="text-gray-100 mb-6 text-lg animate__animated animate__fadeIn animate__delay-1.5s">
          Express your mood by painting your feelings on the canvas.
        </p>
      </div>

      {/* Canvas */}
      <div className="mb-6 shadow-xl p-4 rounded-xl bg-white border border-gray-300">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="border-2 border-indigo-400 rounded-xl shadow-lg"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseOut={handleMouseOut}
        />
      </div>

      {/* Brush Settings */}
      <div className="flex justify-center gap-6 mb-6 animate__animated animate__fadeIn animate__delay-2s">
        <div className="flex flex-col items-center">
          <label className="text-xl font-semibold text-white">Brush Size</label>
          <input
            type="range"
            min="1"
            max="20"
            value={brushSize}
            onChange={(e) => setBrushSize(parseInt(e.target.value))}
            className="w-32 mt-2"
          />
        </div>
        <div className="flex flex-col items-center">
          <label className="text-xl font-semibold text-white">Brush Color</label>
          <input
            type="color"
            value={brushColor}
            onChange={(e) => setBrushColor(e.target.value)}
            className="w-12 h-12 mt-2 border-2 border-indigo-500 rounded-full"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-8 mb-6 animate__animated animate__fadeIn animate__delay-2.5s">
        <button
          onClick={startPainting}
          className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-2xl hover:bg-indigo-700 transition-all transform hover:scale-105"
        >
          Start Painting 🖌️
        </button>
        <button
          onClick={toggleEraser}
          className={`${
            erasing ? "bg-red-600" : "bg-gray-600"
          } text-white px-6 py-3 rounded-lg shadow-2xl hover:bg-gray-700 transition-all transform hover:scale-105`}
        >
          {erasing ? "Stop Erasing" : "Erase ✏️"}
        </button>
      </div>

      {/* Download Painting Button */}
      <div className="flex justify-center gap-8 mb-6 animate__animated animate__fadeIn animate__delay-3s">
        <button
          onClick={downloadPainting}
          className="bg-green-600 text-white px-6 py-3 rounded-lg shadow-2xl hover:bg-green-700 transition-all transform hover:scale-105"
        >
          Download Painting 📥
        </button>
      </div>
    </div>
  );
}

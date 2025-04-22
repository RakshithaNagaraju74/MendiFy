import { useState, useRef } from "react";
import { Rnd } from "react-rnd"; // For draggable components
import html2canvas from "html2canvas"; // For capturing the vision board as an image
import { Player } from "@lottiefiles/react-lottie-player"; // New Lottie player import
import animationData from "../assets/animation/vision_board.json"; // Import your animation JSON

const VisionBoardMaker = () => {
  const [items, setItems] = useState<any[]>([]); // Array to store items (images, quotes, etc.)
  const [newItem, setNewItem] = useState<any>({ type: "", content: "", x: 100, y: 100 });
  const [bgColor, setBgColor] = useState("#fef8f0"); // Soft pastel beige color
  const boardRef = useRef<HTMLDivElement>(null);

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setNewItem({
          type: "image",
          content: reader.result,
          x: 100,
          y: 100,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Add a new quote
  const handleAddQuote = (quote: string) => {
    setNewItem({
      type: "quote",
      content: quote,
      x: 100,
      y: 100,
    });
  };

  // Add item (image or quote) to the vision board
  const addItem = () => {
    setItems((prevItems) => [...prevItems, newItem]);
    setNewItem({ type: "", content: "", x: 100, y: 100 }); // Clear input
  };

  // Capture the vision board as an image
  const downloadVisionBoard = () => {
    if (boardRef.current) {
      html2canvas(boardRef.current).then((canvas) => {
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = "vision-board.png";
        link.click();
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-row items-center justify-between bg-gradient-to-br from-pink-100 via-lavender-100 to-peach-100 px-10 py-8 space-x-8">
      {/* Left Section (Input and Options) */}
      <div className="w-1/3 flex flex-col items-start space-y-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">✨ Create Your Dream Board ✨</h1>

        {/* Background Color Picker */}
        <div className="mb-8">
          <label className="text-gray-700 font-semibold">Select Background Color: </label>
          <input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
            className="ml-2 p-2 rounded border border-gray-300"
          />
        </div>

        {/* Item Options */}
        <div className="mb-8 flex flex-col items-center space-y-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="p-2 text-white bg-rose-500 rounded-md shadow-md hover:bg-rose-600 transition-colors"
          />
          <input
            type="text"
            placeholder="Enter an inspirational quote"
            onChange={(e) => setNewItem({ ...newItem, content: e.target.value })}
            className="p-3 w-72 text-lg text-gray-700 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-pink-500"
          />
          <button
            onClick={addItem}
            className="px-6 py-3 text-lg text-white bg-gradient-to-r from-lime-500 to-teal-400 rounded-md shadow-md hover:bg-gradient-to-r hover:from-lime-400 hover:to-teal-300 transition-colors"
          >
            Add Item to Dream Board
          </button>
        </div>

        {/* Lottie Animation */}
        <div className="w-full flex justify-center mt-10">
          <Player
            autoplay
            loop
            src={animationData} // Pass the JSON animation data
            style={{ height: "250px", width: "250px" }}
          />
        </div>
      </div>

      {/* Right Section (Vision Board) */}
      <div
        ref={boardRef}
        className="relative w-2/3 h-96 bg-white rounded-xl border-4 border-gray-200 shadow-xl bg-gradient"
        style={{ backgroundColor: bgColor }}
      >
        {items.map((item, index) => (
          <Rnd
            key={index}
            default={{
              x: item.x,
              y: item.y,
              width: item.type === "image" ? 150 : 250,
              height: item.type === "image" ? 150 : 120,
            }}
            bounds="parent"
            onDragStop={(e, data) => {
              const updatedItems = [...items];
              updatedItems[index] = { ...updatedItems[index], x: data.x, y: data.y };
              setItems(updatedItems);
            }}
            className="shadow-lg rounded-lg item-hover animate__animated animate__fadeIn animate__delay-1s"
          >
            {item.type === "image" ? (
              <img
                src={item.content}
                alt="uploaded"
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-center text-xl text-gray-700 p-4">
                “{item.content}”
              </div>
            )}
          </Rnd>
        ))}
      </div>

      {/* Download Button */}
      <button
        onClick={downloadVisionBoard}
        className="mt-8 px-6 py-3 text-lg text-white bg-pink-600 rounded-lg shadow-md hover:bg-pink-500 transition-colors"
      >
        Download Dream Board
      </button>
    </div>
  );
};

export default VisionBoardMaker;

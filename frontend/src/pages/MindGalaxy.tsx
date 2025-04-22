import React, { useState } from 'react';
import axios from 'axios';
import { Player } from '@lottiefiles/react-lottie-player';

import futureAnim from '../assets/animation/future.json';
import egyptAnim from '../assets/animation/egypt.json';
import victorianAnim from '../assets/animation/victorian.json';
import eightiesAnim from '../assets/animation/1980s.json';
import prehistoricAnim from '../assets/animation/egypt.json';  // New animation

const timePeriods = [
  { label: 'Future', color: 'from-blue-400 to-blue-600', image: 'future_abstract.jpg', animation: futureAnim },
  { label: '1980s', color: 'from-pink-400 to-pink-600', image: '1980s_abstract.jpg', animation: eightiesAnim },
  { label: 'Prehistoric', color: 'from-yellow-400 to-yellow-600', image: 'prehistoric_abstract.jpg', animation: prehistoricAnim },
  { label: 'Ancient Egypt', color: 'from-orange-400 to-orange-600', image: 'egypt_abstract.jpg', animation: egyptAnim },
  { label: 'Victorian', color: 'from-purple-400 to-purple-600', image: 'victorian_abstract.jpg', animation: victorianAnim },
  { label: 'Renaissance', color: 'from-teal-400 to-teal-600', image: 'renaissance_abstract.jpg'},  // Added period
];

const fetchHistoricalContext = async (timePeriod: string) => {
  try {
    const response = await axios.post('/api/get-historical-context', { timePeriod });
    return response.data.context;
  } catch (error) {
    console.error('Error fetching historical context:', error);
    return 'Failed to load historical context.';
  }
};

const TimeTravelMachine: React.FC = () => {
  const [currentEra, setCurrentEra] = useState<string | null>(null);
  const [eraDescription, setEraDescription] = useState<string>(''); 
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedAnimation, setSelectedAnimation] = useState<any>(null);

  const handleTimeTravel = async (period: string, animation: any) => {
    setIsLoading(true);
    const description = await fetchHistoricalContext(period);
    setEraDescription(description);
    setCurrentEra(period);
    setSelectedAnimation(animation);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 text-white p-8 flex flex-col items-center relative overflow-hidden">
      <h1 className="text-5xl font-extrabold mb-12 text-center text-purple-700 drop-shadow-lg tracking-tight">
        🌌 AI Takes you anywhere 🌠
      </h1>

      {selectedAnimation && (
        <div className="mb-10 w-full flex justify-center">
          <Player
            autoplay
            loop={false}
            src={selectedAnimation}
            style={{ height: '280px', width: '280px' }}
          />
        </div>
      )}

      {isLoading ? (
        <div className="text-purple-600 text-xl animate-pulse">⏳ Time Traveling... Please wait...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12 max-w-6xl">
            {timePeriods.map((period, index) => {
              const isSelected = currentEra === period.label;
              return (
                <div
                  key={period.label}
                  className={`
                    bg-gradient-to-br ${period.color}
                    cursor-pointer p-5 rounded-2xl text-center shadow-xl transform 
                    hover:scale-110 hover:shadow-2xl hover:rotate-1 transition-all duration-500
                    ${isSelected ? 'ring-4 ring-white scale-105' : ''}
                  `}
                  onClick={() => handleTimeTravel(period.label, period.animation)}
                >
                  <img
                    src={`/images/abstract/${period.image}`}
                    alt={period.label}
                    className="w-32 h-32 object-cover mb-4 rounded-full border-4 border-white shadow-md transition-transform duration-300"
                  />
                  <h2 className="text-2xl font-bold text-white drop-shadow">{period.label}</h2>
                </div>
              );
            })}
          </div>
        </>
      )}

      {currentEra && (
        <div className="bg-white/80 backdrop-blur-md text-black w-11/12 md:w-3/4 p-10 rounded-3xl shadow-2xl transition-all duration-500">
          <h2 className="text-4xl font-extrabold mb-6 text-center text-purple-700">
            {currentEra}
          </h2>
          <p className="text-lg leading-relaxed">{eraDescription}</p>
        </div>
      )}
    </div>
  );
};

export default TimeTravelMachine;

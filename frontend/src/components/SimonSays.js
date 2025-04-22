import React, { useState, useEffect } from 'react';
import { Player } from '@lottiefiles/react-lottie-player'; // Correct import from lottie-react
import './ui/SimonSays.css';
import animationData from '../assets/animation/game.json'; // Path to your Lottie animation file

const colors = ['#FFC0CB', '#ADD8E6', '#98FB98', '#FFD700']; // Soft pastel colors

const SimonSays = () => {
  const [sequence, setSequence] = useState([]);
  const [playerSequence, setPlayerSequence] = useState([]);
  const [round, setRound] = useState(1);
  const [isPlayerTurn, setIsPlayerTurn] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (!gameOver) {
      if (!isPlayerTurn) {
        generateSequence();
      }
    }
  }, [isPlayerTurn, gameOver]);

  const generateSequence = () => {
    const newColor = colors[Math.floor(Math.random() * colors.length)];
    setSequence((prevSequence) => [...prevSequence, newColor]);
    setIsPlayerTurn(false);
    showSequence([...sequence, newColor], 0);
  };

  const showSequence = (sequence, index) => {
    if (index < sequence.length) {
      setTimeout(() => {
        highlightColor(sequence[index]);
        showSequence(sequence, index + 1);
      }, 1000);
    } else {
      setIsPlayerTurn(true); // Player's turn to input sequence
    }
  };

  const highlightColor = (color) => {
    const colorButton = document.getElementById(color);
    colorButton.classList.add('active');
    setTimeout(() => {
      colorButton.classList.remove('active');
    }, 500);
  };

  const handlePlayerClick = (color) => {
    if (gameOver) return;

    setPlayerSequence((prevSequence) => [...prevSequence, color]);

    if (color !== sequence[playerSequence.length]) {
      setGameOver(true);
      alert('Game Over! You made a mistake.');
      return;
    }

    if (playerSequence.length + 1 === sequence.length) {
      setPlayerSequence([]);
      setRound((prevRound) => prevRound + 1);
      setTimeout(() => setIsPlayerTurn(false), 1000);
    }
  };

  const restartGame = () => {
    setSequence([]);
    setPlayerSequence([]);
    setRound(1);
    setGameOver(false);
    setIsPlayerTurn(false);
  };

  return (
    <div className="simon-says-container">
      <div className="left-side">
        <div className="animation-space">
          <Player
            autoplay
            loop
            src={animationData} // Path to your Lottie animation
            style={{ height: '250px', width: '250px' }} // Adjusted size for a slightly bigger animation
          />
        </div>
        <h1 className="title">Simon Says</h1>
        <div className="instructions">
          <p>
            <strong>How to Play:</strong>
          </p>
          <ul>
            <li>The game will show you a sequence of colors.</li>
            <li>Your task is to repeat the sequence by clicking the colors in the same order.</li>
            <li>If you make a mistake, the game will end. Keep going until you get the sequence correct!</li>
          </ul>
        </div>
      </div>

      <div className="right-side">
        <div className="game-status">
          <p className="round-text">Round: {round}</p>
          {gameOver && <p className="game-over-text">Game Over! Click to restart.</p>}
        </div>

        <div className="color-buttons">
          {colors.map((color) => (
            <div
              key={color}
              id={color}
              className={`color-button ${color}`}
              onClick={() => handlePlayerClick(color)}
              style={{
                backgroundColor: color,
                pointerEvents: isPlayerTurn && !gameOver ? 'auto' : 'none',
              }}
            ></div>
          ))}
        </div>
        <button className="restart-button" onClick={restartGame}>
          Restart Game
        </button>
      </div>
    </div>
  );
};

export default SimonSays;

'use client';

import React, { useState, useEffect } from 'react';

const ElectionPredictor = () => {
  const [trail, setTrail] = useState<Array<{x: number, y: number}>>([]);
  const [position, setPosition] = useState({ x: 50, y: 250 });
  const [gameStatus, setGameStatus] = useState('waiting');
  const [winner, setWinner] = useState<string | null>(null);
  const [predictions, setPredictions] = useState({ red: 0, blue: 0 });
  const [momentum, setMomentum] = useState(0);
  const [predictionsCount, setPredictionsCount] = useState(0);
  const [finalResult, setFinalResult] = useState<string | null>(null);

  // Constants
  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 500;
  const START_X = 50;
  const END_X = 750;
  const CENTER_Y = CANVAS_HEIGHT / 2;
  const MOVEMENT_SPEED = 1.5;
  const MAX_VERTICAL_SPEED = 12;
  const MOMENTUM_FACTOR = 0.92;
  const VOLATILITY = 0.7;
  const PREDICTIONS_NEEDED = 10;

  // Party mascot SVGs
  const ElephantIcon = () => (
    <svg className="w-24 h-24" viewBox="0 0 100 100">
      <path
        fill="#EF4444"
        d="M85,50c0-19.33-15.67-35-35-35S15,30.67,15,50c0,19.33,15.67,35,35,35S85,69.33,85,50z M65,45
        c-2.76,0-5-2.24-5-5c0-2.76,2.24-5,5-5s5,2.24,5,5C70,42.76,67.76,45,65,45z M45,35c0-2.76,2.24-5,5-5s5,2.24,5,5
        c0,2.76-2.24,5-5,5S45,37.76,45,35z M70,65H30c-2.76,0-5-2.24-5-5s2.24-5,5-5h40c2.76,0,5,2.24,5,5S72.76,65,70,65z"
      />
      <circle fill="#FFFFFF" cx="65" cy="40" r="3" />
    </svg>
  );

  const DonkeyIcon = () => (
    <svg className="w-24 h-24" viewBox="0 0 100 100">
      <path
        fill="#3B82F6"
        d="M85,50c0-19.33-15.67-35-35-35S15,30.67,15,50c0,19.33,15.67,35,35,35S85,69.33,85,50z M65,45
        c-2.76,0-5-2.24-5-5c0-2.76,2.24-5,5-5s5,2.24,5,5C70,42.76,67.76,45,65,45z M45,35c0-2.76,2.24-5,5-5s5,2.24,5,5
        c0,2.76-2.24,5-5,5S45,37.76,45,35z M70,65H30c-2.76,0-5-2.24-5-5s2.24-5,5-5h40c2.76,0,5,2.24,5,5S72.76,65,70,65z"
      />
      <circle fill="#FFFFFF" cx="65" cy="40" r="3" />
    </svg>
  );

  const getRollsRemaining = () => PREDICTIONS_NEEDED - predictionsCount;
  
  const getPredictionStatus = () => {
    if (predictionsCount === 0) {
      return "🎲 All 10 rolls needed for final prediction! 🎲";
    }
    const remaining = getRollsRemaining();
    if (remaining === 1) {
      return "🚨 Final roll needed! 🚨";
    }
    return `${remaining} more rolls needed for prediction`;
  };

  // Reset and game control functions
  const resetGame = () => {
    setPosition({ x: START_X, y: CENTER_Y });
    setGameStatus('playing');
    setWinner(null);
    setTrail([]);
    setMomentum(0);
  };

  const startNewPrediction = () => {
    if (predictionsCount >= PREDICTIONS_NEEDED) {
      setPredictionsCount(0);
      setPredictions({ red: 0, blue: 0 });
      setFinalResult(null);
    }
    resetGame();
  };

  // Movement effect
  useEffect(() => {
    if (gameStatus !== 'playing') return;

    const moveObject = () => {
      const newX = position.x + MOVEMENT_SPEED;
      let newMomentum = momentum;
      
      if (Math.random() < VOLATILITY) {
        newMomentum += (Math.random() - 0.5) * MAX_VERTICAL_SPEED * 2;
        if (Math.random() < 0.2) {
          newMomentum += (Math.random() - 0.5) * MAX_VERTICAL_SPEED * 3;
        }
      }
      
      newMomentum *= MOMENTUM_FACTOR;
      newMomentum = Math.max(-MAX_VERTICAL_SPEED, Math.min(MAX_VERTICAL_SPEED, newMomentum));
      const newY = Math.max(50, Math.min(CANVAS_HEIGHT - 50, position.y + newMomentum));
      
      setTrail(prev => [...prev, { ...position }].slice(-150));
      setPosition({ x: newX, y: newY });
      setMomentum(newMomentum);

      if (newX >= END_X) {
        setGameStatus('finished');
        const finalWinner = newY < CENTER_Y ? 'red' : 'blue';
        setWinner(finalWinner);
        setPredictions(prev => ({
          ...prev,
          [finalWinner]: prev[finalWinner] + 1
        }));
        setPredictionsCount(prev => prev + 1);
      }
    };

    const gameLoop = setInterval(moveObject, 16);
    return () => clearInterval(gameLoop);
  }, [position, gameStatus, momentum]);

  // Check for final result
  useEffect(() => {
    if (predictionsCount === PREDICTIONS_NEEDED) {
      const finalWinner = predictions.red > predictions.blue ? 'red' : 'blue';
      setFinalResult(finalWinner);
    }
  }, [predictionsCount, predictions]);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-gradient-to-b from-gray-900 to-gray-800 rounded-2xl shadow-2xl">
      <div className="text-center mb-6">
        <h2 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-white to-yellow-400 tracking-wider">
          🗳️ 2024 Election Predictor 🎲
        </h2>
        
        {/* Prediction Counter */}
        <div className="mb-6">
          <div className="flex justify-center items-center space-x-4">
            <div className="bg-gray-800 p-4 rounded-xl border-2 border-yellow-400 shadow-lg">
              <div className="text-3xl font-bold text-yellow-400 mb-2">
                Roll {predictionsCount} of 10
              </div>
              <div className="flex justify-center space-x-1">
                {[...Array(PREDICTIONS_NEEDED)].map((_, index) => (
                  <div
                    key={index}
                    className={`w-8 h-2 rounded-full ${
                      index < predictionsCount 
                        ? 'bg-yellow-400' 
                        : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="text-yellow-400 text-lg mt-2">
            {getPredictionStatus()}
          </div>
        </div>

        <div className="flex justify-center items-center space-x-8 mb-6">
          <div className="flex flex-col items-center bg-red-500/10 p-4 rounded-xl">
            <ElephantIcon />
            <span className="text-2xl font-bold text-red-500">TRUMP</span>
            <span className="text-3xl font-bold text-red-500">{predictions.red}</span>
          </div>
          <div className="text-4xl font-bold text-yellow-400">VS</div>
          <div className="flex flex-col items-center bg-blue-500/10 p-4 rounded-xl">
            <DonkeyIcon />
            <span className="text-2xl font-bold text-blue-500">HARRIS</span>
            <span className="text-3xl font-bold text-blue-500">{predictions.blue}</span>
          </div>
        </div>

        <button 
          onClick={startNewPrediction}
          className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-8 py-4 rounded-xl text-xl font-bold hover:from-yellow-500 hover:to-yellow-700 transition-all transform hover:scale-105 shadow-lg"
        >
          {gameStatus === 'waiting' ? 
            (predictionsCount === 0 ? '🎲 Start 10-Roll Prediction' : '🎲 Next Roll') : 
            '⏳ Predicting...'}
        </button>
        
        {predictionsCount === 0 && (
          <div className="mt-4 text-gray-400 text-sm">
            Complete all 10 rolls for an official prediction
          </div>
        )}
      </div>

      <div className="relative bg-gradient-to-b from-gray-700 to-gray-900 rounded-xl overflow-hidden shadow-2xl border-2 border-yellow-400"
           style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT, margin: '0 auto' }}>
        {/* Center Line */}
        <div 
          className="absolute w-full h-px bg-yellow-400/50"
          style={{ top: CENTER_Y }}
        />
        
        {/* Finish Line */}
        <div 
          className="absolute w-1 h-full bg-yellow-400/50"
          style={{ left: END_X }}
        />

        {/* Party Areas */}
        <div className="absolute right-4 top-4 flex items-center">
          <ElephantIcon />
          <span className="text-2xl font-bold text-red-500 ml-2">TRUMP</span>
        </div>
        <div className="absolute right-4 bottom-4 flex items-center">
          <DonkeyIcon />
          <span className="text-2xl font-bold text-blue-500 ml-2">HARRIS</span>
        </div>

        {/* Trail */}
        {trail.map((pos, index) => (
          <div
            key={index}
            className="absolute w-2 h-2 rounded-full"
            style={{
              left: pos.x,
              top: pos.y,
              transform: 'translate(-50%, -50%)',
              backgroundColor: pos.y < CENTER_Y ? '#EF4444' : '#3B82F6',
              opacity: 0.3 + (index / trail.length) * 0.7,
            }}
          />
        ))}
        
        {/* Moving Ballot Box */}
        {gameStatus !== 'waiting' && (
          <div 
            className="absolute w-12 h-12 flex items-center justify-center animate-bounce"
            style={{ 
              left: position.x, 
              top: position.y, 
              transform: 'translate(-50%, -50%)',
              transition: 'none'
            }}
          >
            <svg viewBox="0 0 24 24" className="w-full h-full drop-shadow-lg">
              <path 
                fill="#FCD34D"
                d="M4 4v16h16V4H4zm2 2h12v12H6V6zm2 2v8h8V8H8zm2 2h4v4h-4v-4z"
                className="filter drop-shadow-md"
              />
            </svg>
          </div>
        )}

        {/* Winner Message */}
        {(winner && !finalResult) && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
            <div className="bg-gradient-to-b from-gray-900 to-gray-800 p-8 rounded-xl shadow-2xl border-2 border-yellow-400">
              <p className="text-4xl font-bold mb-4" style={{ color: winner === 'red' ? '#EF4444' : '#3B82F6' }}>
                {winner === 'red' ? 'TRUMP' : 'HARRIS'} wins roll #{predictionsCount}!
              </p>
              <p className="text-yellow-400 text-xl">
                {getRollsRemaining() > 0 
                  ? `${getRollsRemaining()} more ${getRollsRemaining() === 1 ? 'roll' : 'rolls'} needed!` 
                  : 'Calculating final results...'}
              </p>
            </div>
          </div>
        )}

        {/* Final Results */}
        {finalResult && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-md">
            <div className="bg-gradient-to-b from-gray-900 to-gray-800 p-10 rounded-xl shadow-2xl border-2 border-yellow-400">
              <h3 className="text-5xl font-bold mb-6 text-yellow-400">
                Official 2024 Prediction
              </h3>
              <p className="text-4xl font-bold mb-6" style={{ color: finalResult === 'red' ? '#EF4444' : '#3B82F6' }}>
                {finalResult === 'red' ? 'TRUMP' : 'HARRIS'} VICTORY
              </p>
              <p className="text-2xl text-white mb-6">
                Final Tally: {predictions.red} - {predictions.blue}
              </p>
              <div className="text-gray-400 mb-6">
                Based on full 10-roll prediction set
              </div>
              <button 
                onClick={startNewPrediction}
                className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-8 py-4 rounded-xl text-xl font-bold hover:from-yellow-500 hover:to-yellow-700 transition-all transform hover:scale-105"
              >
                Start New 10-Roll Prediction
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ElectionPredictor;
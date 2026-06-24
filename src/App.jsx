import React from 'react';
import { useMinesweeper } from './hooks/useMinesweeper';
import Header from './components/Header';
import Board from './components/Board';
import Controls from './components/Controls';

export default function App() {
  const { 
    board, gameStatus, minesLeft, timeElapsed, isFlagMode, 
    setIsFlagMode, initGame, handleCellClick, toggleFlag 
  } = useMinesweeper();

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col items-center justify-center p-4 select-none touch-manipulation">
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-xl max-w-full">
        <Header 
          minesLeft={minesLeft} 
          gameStatus={gameStatus} 
          timeElapsed={timeElapsed} 
          onReset={initGame} 
        />
        <Board 
          board={board} 
          onCellClick={handleCellClick} 
          onCellRightClick={toggleFlag} 
        />
        <Controls 
          isFlagMode={isFlagMode} 
          setIsFlagMode={setIsFlagMode} 
        />
        {(gameStatus === 'won' || gameStatus === 'lost') && (
          <div className="mt-4 text-center font-bold text-lg animate-bounce">
            {gameStatus === 'won' ? <span className="text-green-600">🎉 지뢰를 모두 피했습니다! 🎉</span> : <span className="text-red-500">💥 지뢰를 밟았습니다! 💥</span>}
          </div>
        )}
      </div>
    </div>
  );
}

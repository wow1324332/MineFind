import React from 'react';

export default function Header({ minesLeft, gameStatus, timeElapsed, onReset }) {
  return (
    <div className="flex justify-between items-center bg-neutral-200 p-3 rounded-xl mb-4 border-b-4 border-neutral-300">
      <div className="bg-black text-red-500 font-mono text-2xl px-2 py-1 rounded tracking-widest min-w-[3rem] text-center shadow-inner">
        {String(Math.max(0, minesLeft)).padStart(3, '0')}
      </div>
      <button 
        onClick={onReset}
        className="text-3xl active:scale-95 transition-transform bg-neutral-100 hover:bg-white p-2 rounded-full shadow border-b-2 border-neutral-300"
      >
        {gameStatus === 'lost' ? '😵' : gameStatus === 'won' ? '😎' : '😃'}
      </button>
      <div className="bg-black text-red-500 font-mono text-2xl px-2 py-1 rounded tracking-widest min-w-[3rem] text-center shadow-inner">
        {String(timeElapsed).padStart(3, '0')}
      </div>
    </div>
  );
}

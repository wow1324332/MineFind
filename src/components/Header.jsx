// src/components/Header.jsx
import React from 'react';

export default function Header({ minesLeft, gameStatus, timeElapsed, onReset, dungeon }) {
  const isFire = dungeon === 'fire';
  
  // 패널 색상 및 그림자 분리
  const panelColor = isFire ? "text-red-600 shadow-[inset_0_0_12px_rgba(220,38,38,0.25)]" : "text-blue-500 shadow-[inset_0_0_12px_rgba(56,189,248,0.25)]";

  return (
    <div className={`flex justify-between items-center bg-neutral-950 p-4 rounded-xl mb-6 border-2 shadow-[0_10px_20px_rgba(0,0,0,0.6)] ${isFire ? 'border-red-900/40' : 'border-blue-900/40'}`}>
      
      <div className={`bg-black font-black font-mono text-3xl px-3 py-1 rounded-lg tracking-widest min-w-[4rem] text-center border border-neutral-800 select-none ${panelColor}`}>
        {String(Math.max(0, minesLeft)).padStart(3, '0')}
      </div>
      
      <button 
        onClick={onReset}
        className="text-4xl active:scale-90 transition-transform drop-shadow-[0_0_10px_rgba(255,255,255,0.1)] select-none"
        style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}
      >
        {gameStatus === 'lost' ? '💀' : gameStatus === 'won' ? '👑' : '🛡️'}
      </button>
      
      <div className={`bg-black font-black font-mono text-3xl px-3 py-1 rounded-lg tracking-widest min-w-[4rem] text-center border border-neutral-800 select-none ${panelColor}`}>
        {String(timeElapsed).padStart(3, '0')}
      </div>
      
    </div>
  );
}

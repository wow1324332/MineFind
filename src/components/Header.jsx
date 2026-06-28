import React from 'react';

export default function Header({ minesLeft, gameStatus, timeElapsed, onReset }) {
  return (
    <div className="flex justify-between items-center bg-neutral-900 p-4 rounded-xl mb-6 border-2 border-neutral-800 shadow-[0_10px_20px_rgba(0,0,0,0.6)]">
      
      {/* 남은 지뢰(악마) 개수 */}
      <div className="bg-black text-red-600 font-black font-mono text-3xl px-3 py-1 rounded-lg tracking-widest min-w-[4rem] text-center shadow-[inset_0_0_12px_rgba(220,38,38,0.25)] border border-neutral-800 select-none">
        {String(Math.max(0, minesLeft)).padStart(3, '0')}
      </div>
      
      {/* 상태 및 리셋 버튼 */}
      <button 
        onClick={onReset}
        className="text-4xl active:scale-90 transition-transform drop-shadow-[0_0_10px_rgba(255,255,255,0.1)] select-none"
        style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}
      >
        {gameStatus === 'lost' ? '💀' : gameStatus === 'won' ? '👑' : '🛡️'}
      </button>
      
      {/* 경과 시간 */}
      <div className="bg-black text-red-600 font-black font-mono text-3xl px-3 py-1 rounded-lg tracking-widest min-w-[4rem] text-center shadow-[inset_0_0_12px_rgba(220,38,38,0.25)] border border-neutral-800 select-none">
        {String(timeElapsed).padStart(3, '0')}
      </div>
      
    </div>
  );
}

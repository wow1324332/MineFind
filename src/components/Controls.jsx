import React from 'react';

export default function Controls({ isFlagMode, setIsFlagMode }) {
  return (
    <div className="mt-6 flex justify-center space-x-4 max-w-sm mx-auto">
      <button
        onClick={() => setIsFlagMode(false)}
        className={`flex-1 py-3 text-lg font-black tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 border-2 ${!isFlagMode ? 'bg-neutral-900 border-red-900/80 text-red-500 shadow-[0_0_15px_rgba(220,38,38,0.4)] scale-105' : 'bg-neutral-950 border-neutral-800 text-neutral-600 hover:text-neutral-400'}`}
        style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}
      >
        <span>🗡️</span> 탐색
      </button>
      <button
        onClick={() => setIsFlagMode(true)}
        className={`flex-1 py-3 text-lg font-black tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 border-2 ${isFlagMode ? 'bg-neutral-900 border-blue-900/80 text-blue-400 shadow-[0_0_15px_rgba(56,189,248,0.4)] scale-105' : 'bg-neutral-950 border-neutral-800 text-neutral-600 hover:text-neutral-400'}`}
        style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}
      >
        <span>💠</span> 봉인
      </button>
    </div>
  );
}

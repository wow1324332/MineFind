import React from 'react';

export default function Controls({ isFlagMode, setIsFlagMode }) {
  return (
    <div className="mt-6 flex justify-center space-x-4">
      <button
        onClick={() => setIsFlagMode(false)}
        className={`flex-1 py-3 text-lg font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${!isFlagMode ? 'bg-blue-500 text-white shadow-lg scale-105' : 'bg-neutral-200 text-neutral-500'}`}
      >
        <span>⛏️</span> 탐색
      </button>
      <button
        onClick={() => setIsFlagMode(true)}
        className={`flex-1 py-3 text-lg font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${isFlagMode ? 'bg-red-500 text-white shadow-lg scale-105' : 'bg-neutral-200 text-neutral-500'}`}
      >
        <span>🚩</span> 깃발
      </button>
    </div>
  );
}

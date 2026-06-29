import React from 'react';

export default function Header({ minesLeft, gameStatus, timeElapsed, onReset, dungeon }) {
  const isFire = dungeon === 'fire';
  
  // 패널 색상 및 그림자 분리
  const panelColor = isFire ? "text-red-600 shadow-[inset_0_0_12px_rgba(220,38,38,0.25)]" : "text-blue-500 shadow-[inset_0_0_12px_rgba(56,189,248,0.25)]";

  return (
    <div className={`relative flex justify-between items-center p-4 rounded-xl mb-6 shadow-[0_10px_20px_rgba(0,0,0,0.6)] overflow-hidden`}>
      
      {/* 돌담 배경 이미지 추가 */}
      <div 
        className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-90"
        style={{ backgroundImage: "url('/header-bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* 내용물 묶음 */}
      <div className="relative z-10 flex w-full justify-between items-center">
        
        {/* 남은 지뢰 개수 */}
        <div className={`bg-black font-black font-mono text-3xl px-3 py-1 rounded-lg tracking-widest min-w-[4rem] text-center select-none ${panelColor}`}>
          {String(Math.max(0, minesLeft)).padStart(3, '0')}
        </div>
        
        {/* 💡 상태 및 리셋 버튼 */}
        <button 
          onClick={onReset}
          className="flex items-center justify-center active:scale-90 transition-transform drop-shadow-[0_0_10px_rgba(255,255,255,0.1)] select-none"
          style={{ WebkitTapHighlightColor: 'transparent', outline: 'none' }}
        >
          {gameStatus === 'lost' ? (
            <img 
              src="/hellofflame-mine.png" 
              alt="Game Over - Devil Eye" 
              className="w-10 h-10 object-contain drop-shadow-[0_0_10px_rgba(220,38,38,0.8)] animate-pulse" 
            />
          ) : gameStatus === 'won' ? (
            <span className="text-4xl">👑</span> // 왕관 유지
          ) : (
            /* 💡 기존 🛡️ 이모지 대신 만드신 holyshield.png 이미지를 적용했습니다 */
            <img 
              src="/holyshield-icon.png" 
              alt="🛡️" 
              className="w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]" 
            />
          )}
        </button>
        
        {/* 경과 시간 */}
        <div className={`bg-black font-black font-mono text-3xl px-3 py-1 rounded-lg tracking-widest min-w-[4rem] text-center select-none ${panelColor}`}>
          {String(timeElapsed).padStart(3, '0')}
        </div>

      </div>
    </div>
  );
}

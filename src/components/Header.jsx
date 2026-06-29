import React from 'react';

export default function Header({ minesLeft, gameStatus, timeElapsed, onReset, dungeon }) {
  const isFire = dungeon === 'fire';
  
  // 💡 패널 배경 그림자에 더해서, 글자 자체에서 뿜어져 나오는 네온 효과(drop-shadow)를 추가했습니다!
  const panelColor = isFire 
    ? "text-red-600 shadow-[inset_0_0_12px_rgba(220,38,38,0.25)] drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]" 
    : "text-blue-500 shadow-[inset_0_0_12px_rgba(56,189,248,0.25)] drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]";

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
        
        {/* 💡 남은 지뢰 개수 (led-font, tabular-nums 적용 및 크기를 4xl로 키움) */}
        <div className={`bg-black/90 led-font tabular-nums font-black text-4xl px-3 py-1 rounded-lg tracking-widest min-w-[4.5rem] text-center select-none ${panelColor}`}>
          {String(Math.max(0, minesLeft)).padStart(3, '0')}
        </div>
        
        {/* 상태 및 리셋 버튼 */}
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
            <span className="text-4xl">👑</span> 
          ) : (
            <img 
              src="/holyshield-icon.png" 
              alt="🛡️" 
              className="w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]" 
            />
          )}
        </button>
        
        {/* 💡 경과 시간 (led-font, tabular-nums 적용 및 크기를 4xl로 키움) */}
        <div className={`bg-black/90 led-font tabular-nums font-black text-4xl px-3 py-1 rounded-lg tracking-widest min-w-[4.5rem] text-center select-none ${panelColor}`}>
          {String(timeElapsed).padStart(3, '0')}
        </div>

      </div>
    </div>
  );
}

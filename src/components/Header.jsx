import React from 'react';

export default function Header({ minesLeft, gameStatus, timeElapsed, onReset, dungeon }) {
  const isFire = dungeon === 'fire';
  
  // 패널 색상 및 그림자 분리
  const panelColor = isFire ? "text-red-600 shadow-[inset_0_0_12px_rgba(220,38,38,0.25)]" : "text-blue-500 shadow-[inset_0_0_12px_rgba(56,189,248,0.25)]";

  return (
    <div className={`relative flex justify-between items-center p-4 rounded-xl mb-6 border-2 shadow-[0_10px_20px_rgba(0,0,0,0.6)] overflow-hidden >
      
      {/* 💡 돌담 배경 이미지 추가 (Header 영역에 꽉 차게) */}
      <div 
        className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-90"
        style={{ backgroundImage: "url('/header-bg.jpg')" }}
      >
        {/* 배경이 너무 밝아서 숫자가 안 보일 수 있으므로 검은색으로 살짝 덮어줍니다 */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* 💡 내용물 묶음 (배경 이미지보다 위에 오도록 relative z-10 적용) */}
      <div className="relative z-10 flex w-full justify-between items-center">
        
        {/* 남은 지뢰(악마/크라켄) 개수 */}
        <div className={`bg-black font-black font-mono text-3xl px-3 py-1 rounded-lg tracking-widest min-w-[4rem] text-center border border-neutral-800 select-none ${panelColor}`}>
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
        <div className={`bg-black font-black font-mono text-3xl px-3 py-1 rounded-lg tracking-widest min-w-[4rem] text-center border border-neutral-800 select-none ${panelColor}`}>
          {String(timeElapsed).padStart(3, '0')}
        </div>

      </div>
    </div>
  );
}

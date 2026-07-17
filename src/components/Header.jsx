import React from 'react';
// 💡 전역 던전 데이터 파일 연동
import { DUNGEON_INFO } from '../constants/dungeonData';

export default function Header({ minesLeft, gameStatus, timeElapsed, onReset, dungeon }) {
  // 💡 현재 입장한 던전의 실시간 고유 데이터 확보
  const currentDungeonInfo = DUNGEON_INFO[dungeon];
  
  // 💡 원장님 아이디어 완벽 적용! 
  // 허옇게 뜨던 기존 drop-shadow를 완전히 제거했습니다.
  // 1. 박스 바깥엔 강력한 검은 그림자: shadow-[0_0_15px_rgba(0,0,0,0.9)] 
  // 2. 글자 자체에만 네온 불빛 효과: [text-shadow:0_0_8px_rgba(...)]
  let panelColor = "text-blue-500 shadow-[0_0_15px_rgba(0,0,0,0.9),inset_0_0_12px_rgba(56,189,248,0.25)] [text-shadow:0_0_8px_rgba(56,189,248,0.8)]"; 
  
  if (dungeon === 'fire') {
    panelColor = "text-red-600 shadow-[0_0_15px_rgba(0,0,0,0.9),inset_0_0_12px_rgba(220,38,38,0.25)] [text-shadow:0_0_8px_rgba(220,38,38,0.8)]";
  } else if (dungeon === 'poison') {
    panelColor = "text-green-500 shadow-[0_0_15px_rgba(0,0,0,0.9),inset_0_0_12px_rgba(34,197,94,0.25)] [text-shadow:0_0_8px_rgba(34,197,94,0.8)]";
  } else if (dungeon === 'light') {
    panelColor = "text-yellow-500 shadow-[0_0_15px_rgba(0,0,0,0.9),inset_0_0_12px_rgba(234,179,8,0.25)] [text-shadow:0_0_8px_rgba(234,179,8,0.8)]";
  } else if (dungeon === 'ice') {
    // ❄️ 아이스 던전도 허연 안개 없이 딥블랙 그림자 위에서 폰트만 영롱하게 빛납니다!
    panelColor = "text-cyan-400 shadow-[0_0_15px_rgba(0,0,0,0.9),inset_0_0_12px_rgba(34,211,238,0.25)] [text-shadow:0_0_8px_rgba(34,211,238,0.8)]";
  } else if (dungeon === 'cure') {
    panelColor = "text-emerald-400 shadow-[0_0_15px_rgba(0,0,0,0.9),inset_0_0_12px_rgba(52,211,153,0.25)] [text-shadow:0_0_8px_rgba(52,211,153,0.8)]";
  }

  return (
    <div className={`relative flex justify-between items-center p-4 rounded-xl mb-6 shadow-[0_10px_20px_rgba(0,0,0,0.6)] overflow-hidden`}>
      
      {/* 돌담 배경 이미지 추가 */}
      <div 
        className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-90"
        style={{ backgroundImage: "url('/header/header-bg.webp')" }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* 내용물 묶음 */}
      <div className="relative z-10 flex w-full justify-between items-center">
        
        {/* 남은 지뢰 개수 */}
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
              src={currentDungeonInfo?.mineImg || "/dungeons/hellofflame-mine.webp"} 
              alt="Game Over - Dungeon Mine" 
              className={`w-10 h-10 object-contain animate-pulse ${currentDungeonInfo?.mineShadow || 'drop-shadow-[0_0_10px_rgba(220,38,38,0.8)]'}`} 
            />
          ) : gameStatus === 'won' ? (
            <span className="text-4xl">👑</span> 
          ) : (
            <img 
              src="/dungeons/holyshield-icon.webp" 
              alt="🛡️" 
              className="w-10 h-10 object-contain drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]" 
            />
          )}
        </button>
        
        {/* 경과 시간 */}
        <div className={`bg-black/90 led-font tabular-nums font-black text-4xl px-3 py-1 rounded-lg tracking-widest min-w-[4.5rem] text-center select-none ${panelColor}`}>
          {String(timeElapsed).padStart(3, '0')}
        </div>

      </div>
    </div>
  );
}

import React from 'react';
// 💡 전역 던전 데이터 파일 연동
import { DUNGEON_INFO } from '../constants/dungeonData';

export default function Header({ minesLeft, gameStatus, timeElapsed, onReset, dungeon }) {
  // 💡 현재 입장한 던전의 실시간 고유 데이터 확보
  const currentDungeonInfo = DUNGEON_INFO[dungeon];
  
  // 💡 망쳐놨던 숫자 텍스트 그림자는 싹 지우고, 원래 원하시던 영롱한 카운터 박스 네온 불빛으로 원상복구 했습니다!
  let panelColor = "text-blue-500 shadow-[inset_0_0_12px_rgba(56,189,248,0.25)] drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]"; 
  if (dungeon === 'fire') {
    panelColor = "text-red-600 shadow-[inset_0_0_12px_rgba(220,38,38,0.25)] drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]";
  } else if (dungeon === 'poison') {
    panelColor = "text-green-500 shadow-[inset_0_0_12px_rgba(34,197,94,0.25)] drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]";
  } else if (dungeon === 'light') {
    panelColor = "text-yellow-500 shadow-[inset_0_0_12px_rgba(234,179,8,0.25)] drop-shadow-[0_0_8px_rgba(234,179,8,0.8)]";
  } else if (dungeon === 'ice') {
    panelColor = "text-cyan-300 shadow-[inset_0_0_12px_rgba(34,211,238,0.3)] drop-shadow-[0_0_8px_rgba(34,211,238,0.6)]";
  } else if (dungeon === 'cure') {
    panelColor = "text-emerald-400 shadow-[inset_0_0_12px_rgba(34,197,94,0.25)] drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]";
  }

  return (
    {/* 💡 핵심 수정: 헤더 컨테이너 뒤쪽에 'shadow-[0_20px_40px_rgba(0,0,0,0.95)]'를 주어 밝은 얼음 배경에서도 돌담이 묵직하게 분리되도록 엄청나게 진한 그림자를 쫙 깔았습니다! */}
    <div className={`relative flex justify-between items-center p-4 rounded-xl mb-6 shadow-[0_20px_40px_rgba(0,0,0,0.95),_0_0_20px_rgba(0,0,0,0.8)] overflow-hidden`}>
      
      {/* 돌담 배경 이미지 추가 */}
      <div 
        className="absolute inset-0 bg-cover bg-center pointer-events-none opacity-90"
        style={{ backgroundImage: "url('/header/header-bg.webp')" }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* 내용물 묶음 */}
      <div className="relative z-10 flex w-full justify-between items-center">
        
        {/* 남은 지뢰 개수 (led-font, tabular-nums 적용 및 크기를 4xl로 키움) */}
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
        
        {/* 경과 시간 (led-font, tabular-nums 적용 및 크기를 4xl로 키움) */}
        <div className={`bg-black/90 led-font tabular-nums font-black text-4xl px-3 py-1 rounded-lg tracking-widest min-w-[4.5rem] text-center select-none ${panelColor}`}>
          {String(timeElapsed).padStart(3, '0')}
        </div>

      </div>
    </div>
  );
}

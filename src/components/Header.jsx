import React from 'react';
// 💡 전역 던전 데이터 파일 연동
import { DUNGEON_INFO } from '../constants/dungeonData';

export default function Header({ minesLeft, gameStatus, timeElapsed, onReset, dungeon }) {
  // 💡 현재 입장한 던전의 실시간 고유 데이터 확보
  const currentDungeonInfo = DUNGEON_INFO[dungeon];
  
  // 💡 던전 종류에 따른 타이머/카운터 네온 효과(drop-shadow) 동적 할당
  let panelColor = "text-blue-500 shadow-[inset_0_0_12px_rgba(56,189,248,0.25)] drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]"; // 기본(water) 파란색
  if (dungeon === 'fire') {
    panelColor = "text-red-600 shadow-[inset_0_0_12px_rgba(220,38,38,0.25)] drop-shadow-[0_0_8px_rgba(220,38,38,0.8)]";
  } else if (dungeon === 'poison') {
    // 💡 독 던전(poison)일 경우 녹색 불빛 적용
    panelColor = "text-green-500 shadow-[inset_0_0_12px_rgba(34,197,94,0.25)] drop-shadow-[0_0_8px_rgba(34,197,94,0.8)]";
  } else if (dungeon === 'light') {
    // 👇👇👇여기가 새로 추가된 4번째 번뇌의 던전(빛) 영역입니다! 👇👇👇
    panelColor = "text-yellow-500 shadow-[inset_0_0_12px_rgba(234,179,8,0.25)] drop-shadow-[0_0_8px_rgba(234,179,8,0.8)]";
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
              // 💡 하드코딩된 옛날 경로 대신, dungeonData에 정의된 동적 mineImg 경로를 매핑하여 이미지 깨짐 해결
              src={currentDungeonInfo?.mineImg || "/dungeons/hellofflame-mine.webp"} 
              alt="Game Over - Dungeon Mine" 
              // 💡 패배했을 때 번쩍이는 네온 후광 효과(drop-shadow)도 던전 테마에 맞춰 변경
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
